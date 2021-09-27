import React, { useState } from 'react';
import { IonButton } from '@ionic/react';

import Web3 from 'web3';
import { post } from '@wholelot/util/lib/fetchHelper';
import ConnectProvider from './ConnectProvider';
import { IWalletInfo } from './types';
import './WalletContainer.css';
import CoinBasePage from './CoinBasePage';
import NetworkPicker from './NetworkPicker';

interface IChain {
    name: string,
    chain: string,
    network: string,
    icon: string,
    rpc: Array<string>,
    faucets: Array<string>,
    nativeCurrency: {
        name: string,
        symbol: string,
        decimals: number
    },
    infoURL: string,
    shortName: string,
    chainId: number,
    networkId: number,
    slip44: number,
    ens: {
        registry: string,
    },
    explorers: Array<{
        name: string,
        url: string,
        standard: string
    }>,
    text: string,
    value: string
}

declare var window: any;
const WalletContainer: React.FC<{
    ConnectorList: Array<IWalletInfo>,
    history: any
    infuraApiKey: string,
    alchemyApiKey: string,
    submitUrl: string,
    item: any,
    successRedirectionUrl: string,
    clientId: string,
    clientSecret: string,
    successParams: Array<{ field: string, key: string }>
}> = ({ ConnectorList, submitUrl, item, successRedirectionUrl, infuraApiKey, alchemyApiKey, successParams, history, ...rest }) => {
    const [account, setAccount] = useState<any>();
    const [address, setAddress] = useState<any>();
    const [selectedWallet, setSelectedWallet] = useState<IWalletInfo>();
    const [selectedNetworkChain, setSelectedNetworkChain] = useState<IChain>();
    const [error, setError] = useState('');
    const [showError, setShowError] = useState(false);

    const onConnectToWalletClick = async (chain: IChain) => {
        setSelectedNetworkChain(chain);
        if (selectedWallet && selectedNetworkChain) {
            if (selectedWallet.key === 'metamask' || selectedWallet.key === 'injected') {
                if (typeof window.ethereum === 'undefined') {
                    window.location.href = 'https://metamask.io/download.html';
                    return;
                }
            }
            try {
                setShowError(false);
                const { args, ...rest } = selectedWallet;
                if (args) {
                    args.chainId = selectedNetworkChain.chainId;
                    args.supportedChainIds = [selectedNetworkChain.chainId];
                    args.network = selectedNetworkChain.network;
                    const networkObj: any = { chainId: selectedNetworkChain.chainId };
                    networkObj[selectedNetworkChain.chainId] = selectedNetworkChain.network;
                    args.networks = [networkObj];
                    args.urls = selectedNetworkChain.rpc;
                    args.url = selectedNetworkChain.rpc[0];
                }
                const obj = { ...rest, args, ...selectedNetworkChain };
                const conObj: any = ConnectProvider(obj);
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
                                setAccount({ id: account, account: account, balance });
                                setAddress({ id: account, address: account })
                                await response.deactivate();
                            } else {
                                setError(`${selectedWallet.title} Wallet account has balance of ${balance}, try another wallet`);
                                setShowError(true);
                            }
                        }
                    } else {
                        setError(`Failed to load accounts for ${selectedWallet.title}, try another wallet`);
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
            const data = { ...item, walletAccount: account, walletAddress: address, network: selectedNetworkChain, walletType: selectedWallet ? selectedWallet.type : '' };
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
            {selectedWallet && selectedWallet.key !== 'coinbase' && <NetworkPicker infuraApiKey={infuraApiKey} alchemyApiKey={alchemyApiKey} onChange={(chain: IChain) => onConnectToWalletClick(chain)} />}
            {!selectedWallet && <div className="wallet-list">
                {ConnectorList && ConnectorList.map((connector, index) => <div onClick={() => setSelectedWallet(connector)} className="wallet-item" key={`wallet_map_${index}_${connector.key}`} >
                    <div className="wallet-item-img-slot">
                        <img src={connector.logo} alt={connector.title} />
                    </div>
                    <div className="wallet-item-caption-slot">
                        <p>{connector.description}</p>
                    </div>
                </div>
                )}
            </div>}
            <div>
                {account && <IonButton fill="outline" color="primary" size="small" onClick={() => processAccount(account, address)}>Continue</IonButton>}
            </div>
        </div>
    )
}
export default WalletContainer;
