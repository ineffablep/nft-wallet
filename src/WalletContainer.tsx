import React, { useState } from 'react';
import ConnectProvider from './ConnectProvider';
import { IWalletInfo } from './types';
import './WalletContainer.css';
import { post } from '@wholelot/util/lib/fetchHelper';
import CoinBasePage from './CoinBasePage';

const WalletContainer: React.FC<{
    ConnectorList: Array<IWalletInfo>,
    history: any
    submitUrl: string,
    item: any,
    successRedirectionUrl: string,
    clientId: string,
    clientSecret: string,
    successParams: Array<{ field: string, key: string }>
}> = ({ ConnectorList, submitUrl, item, successRedirectionUrl, successParams, history, ...rest }) => {

    const [selectedWallet, setSelectedWallet] = useState<IWalletInfo>();
    const [error, setError] = useState('');

    const onConnectToWalletClick = async (e: IWalletInfo) => {
        setSelectedWallet(e);
        if (e.key === 'coinbase') {

        } else {
            try {
                const provider = ConnectProvider(e);
                provider?.activate();
                const account = await provider?.getAccount();
                processAccount(account, account);
                setError('');
            } catch (error) {
                setError(error);
            }
        }
    };

    const processAccount = async (account: any, address: any) => {
        if (submitUrl) {
            const data = { ...item, walletAccount: account, walletAddress: address, walletType: selectedWallet ? selectedWallet.type : '' };
            try {
                await post(submitUrl, data, rest);
                if (successRedirectionUrl) {
                    let url = successRedirectionUrl;
                    if (successParams) {
                        successParams.forEach((param: any, index: number) => {
                            if (param.field && param.key) {
                                const val = data[param.field];
                                if (val) {
                                    url = `${url}${index === 0 ? `/${param.key}=${val}` : `&${param.key}=${val}`}`;
                                }
                            }
                        });
                    }
                    if (history) {
                        history.push(url);
                    } else {
                        window.location.href = url;
                    }
                } else {
                    if (history) {
                        history.push('/');
                    } else {
                        window.location.href = '/';
                    }
                }
            } catch (error) {
                setError(error);
            }
        }

    };
    if (selectedWallet && selectedWallet.key === 'coinbase') {
        const args: any = selectedWallet && selectedWallet.args ? selectedWallet.args : {}
        return <CoinBasePage {...rest} {...args} onChangeWallet={() => setSelectedWallet(undefined)} onContinue={processAccount} />
    }
    return (
        <div>
            {error && <div className="danger"> {error} </div>}
            <div className="ion-margin">Your wallet, {selectedWallet && <span>powered by <a href={selectedWallet.link} target="_blank" rel="nofollow noopener noreferrer">{selectedWallet.title}</a>, </span>} will be used to securely store your digital goods and cryptocurrencies.</div>
            <div className="wallet-list">
                {ConnectorList && ConnectorList.map((connector, index) => <div onClick={() => onConnectToWalletClick(connector)} className="wallet-item" key={`wallet_map_${index}_${connector.key}`} >
                    <div className="wallet-item-img-slot">
                        <img src={connector.logo} alt={connector.title} />
                    </div>
                    <div className="wallet-item-caption-slot">
                        <p>{connector.description}</p>
                    </div>
                </div>
                )}
            </div>
        </div>
    )
}
export default WalletContainer;
