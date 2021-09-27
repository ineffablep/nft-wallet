import React, { useState } from 'react';
import Web3 from 'web3';
import { post } from '@wholelot/util/lib/fetchHelper';
import ConnectProvider from './ConnectProvider';
import { IWalletInfo } from './types';
import './WalletContainer.css';
import CoinBasePage from './CoinBasePage';
declare var window: any;
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
    const [showError, setShowError] = useState(false);
    const onConnectToWalletClick = async (e: IWalletInfo) => {
        setSelectedWallet(e);
        if (e.key !== 'coinbase') {
            if (e.key === 'metamask' || e.key === 'injected') {
                if (typeof window.ethereum === 'undefined') {
                    window.location.href = 'https://metamask.io/download.html';
                    return;
                }
            }
            try {
                setShowError(false);
                const conObj: any = ConnectProvider(e);
                if (conObj) {
                    const response = await conObj.activate();
                    const account = response.account ? response.account : await conObj.getAccount();
                    const provider = response.provider ? response.provider : await conObj.getProvider();
                    const web3 = new Web3(provider);
                    const addressId = account ? typeof account == 'string' ? account : account[0] : '';
                    if (addressId) {
                        let balance: any = await web3.eth.getBalance(addressId);
                        if (typeof balance === 'string') {
                            balance = parseInt(balance, 10);
                        }
                        if (!isNaN(balance)) {
                            if (balance > 0) {
                                processAccount({ id: account, account: account, balance }, { address: account });
                                await response.deactivate();
                            } else {
                                setError(`${e.title} Wallet account has balance of ${balance}, try another wallet`);
                                setShowError(true);
                            }
                        }
                    } else {
                        setError(`Failed to load accounts for ${e.title}, try another wallet`);
                        setShowError(true);
                    }
                }
            } catch (error) {
                setError(error);
                setShowError(true);
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
                setShowError(true);
            }
        }

    };
    if (selectedWallet && selectedWallet.key === 'coinbase') {
        const args: any = selectedWallet && selectedWallet.args ? selectedWallet.args : {}
        return <CoinBasePage {...rest} {...args} onChangeWallet={() => setSelectedWallet(undefined)} onContinue={processAccount} />
    }
    return (
        <div>
            {showError && <div className="danger ion-padding">
                {error}
                <div className="text-white pointer ion-float-right" onClick={() => setShowError(false)} >&times;</div>
            </div>}
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
