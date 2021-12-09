import React, { useState } from 'react';
import { IonButton } from '@ionic/react';
import Web3 from 'web3';
import { post } from '@wholelot/util/lib/fetchHelper';
import ConnectProvider from './ConnectProvider';
import { IWalletInfo } from './types';
import './WalletContainer.css';
import CoinBasePage from './CoinBasePage';
import NetworkPicker, { IChain } from './NetworkPicker';

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
    connectIfAccountHasBalance: boolean;
    clientSecret: string,
    enableCustomRpc: boolean,
    enableAdvancedOptions: boolean,
    successParams: Array<{ field: string, key: string }>
}> = ({ ConnectorList, submitUrl, item, successRedirectionUrl, enableCustomRpc, connectIfAccountHasBalance, enableAdvancedOptions, infuraApiKey, alchemyApiKey, successParams, history, ...rest }) => {
    const [account, setAccount] = useState<any>();
    const [address, setAddress] = useState<any>();
    const [selectedWallet, setSelectedWallet] = useState<IWalletInfo>();
    const [selectedNetworkChain, setSelectedNetworkChain] = useState<IChain>();
    const [error, setError] = useState('');
    const [showError, setShowError] = useState(false);

    const onConnectToWalletClick = async (chain: IChain) => {
        setSelectedNetworkChain(chain);
        if (chain.isCustom) {
            setAccount({ id: chain.addressId, account: chain.addressId });
            setAddress({ id: chain.addressId, address: chain.addressId })
        }
        if (chain) {
            const wl: IWalletInfo = {
                key: 'custom', title: 'Custom',
                type: 'ethereum',
                link: '',
                description: 'Connect to your own Wallet with RPC',
                logo: '',
                args: {
                    chainId: chain?.chainId,
                    network: chain?.network,
                    urls: chain?.rpc,
                    url: chain?.rpc[0],
                }
            }
            setSelectedWallet(wl);
            await getAccountInfo(wl);
        }
    }

    const getAccountInfo = async (wallet: IWalletInfo) => {
        if (wallet) {
            if (wallet.key === 'metamask' || wallet.key === 'injected') {
                if (typeof window.ethereum === 'undefined') {
                    window.location.href = 'https://metamask.io/download.html';
                    return;
                }
            }
            try {
                setShowError(false);
                const conObj: any = ConnectProvider(wallet);
                if (conObj) {
                    const response = await conObj.activate();
                    const account = response.account ? response.account : await conObj.getAccount();
                    const provider = response.provider ? response.provider : await conObj.getProvider();
                    const web3 = new Web3(provider);
                    const addressId = account ? typeof account == 'string' ? account : account[0] : '';
                    if (addressId) {
                        if (connectIfAccountHasBalance) {
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
                                    const address = typeof account === 'string' ? account : '';
                                    setError(`${wallet.title} Wallet account has balance of ${balance}, try another wallet or try adding funds to the wallet address: ${address}`);
                                    setShowError(true);
                                }
                            }
                        } else {
                            setAccount({ id: account, account: account });
                            setAddress({ id: account, address: account })
                            await response.deactivate();
                        }
                        if (wallet.key === 'custom') {
                            if (account) {
                                setAccount({ id: account, account: account });
                                setAddress({ id: account, address: account })
                                await response.deactivate();
                                setError(`We did not check ${wallet.title} Wallet account balance, minting will fail if wallet doesn't have sufficient funds.`);
                                setShowError(true);
                            } else {
                                setError(`${wallet.title} account information not available form the connections or network may be not compatible, please provide other RPC info or select another wallet.`);
                                setShowError(true);
                            }
                        }
                    } else {
                        setError(`Failed to load accounts for ${wallet.title}, try another wallet`);
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
            const data = {
                ...item,
                walletAccount: account,
                walletAddress: address,
                walletType: selectedWallet ? selectedWallet.type : 'Custom'
            };
            if (selectedNetworkChain) {
                data.networkName = selectedNetworkChain.name;
                data.networkChainId = selectedNetworkChain.chainId;
                data.networkChain = selectedNetworkChain.chain;
                data.networkType = selectedNetworkChain.network;
                data.networkRpc = selectedNetworkChain.rpc;
                data.networkFaucets = selectedNetworkChain.faucets;
                data.networkNativeCurrency = selectedNetworkChain.nativeCurrency;
                data.networkExplorers = selectedNetworkChain.explorers;
            }

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
    const args: any = selectedWallet && selectedWallet.args ? selectedWallet.args : {}
    return (
        <div>
            {showError && <div className="danger ion-padding">
                {error}
                <div className="text-white pointer ion-float-right" onClick={() => setShowError(false)} >&times;</div>
            </div>}
            {selectedWallet && selectedWallet.key !== 'coinbase' && <div className="ion-margin">Your wallet, {selectedWallet && <span>powered by <a href={selectedWallet.link} target="_blank" rel="nofollow noopener noreferrer">{selectedWallet.title}</a>, </span>} will be used to securely store your digital goods and cryptocurrencies.</div>}
            {selectedWallet && selectedWallet.key === 'coinbase' && <CoinBasePage {...rest} {...args} onChangeWallet={() => setSelectedWallet(undefined)} onContinue={processAccount} />}
            <div className="wallet-list ion-margin-vertical">
                {ConnectorList && ConnectorList.map((connector, index) => <div onClick={() => {
                    setSelectedWallet(connector);
                    getAccountInfo(connector);
                }} className="wallet-item" key={`wallet_map_${index}_${connector.key}`} >
                    <div className="wallet-item-img-slot">
                        <img src={connector.logo} alt={connector.title} />
                    </div>
                    <div className="wallet-item-caption-slot">
                        <p>{connector.description}</p>
                    </div>
                </div>
                )}
            </div>
            {enableAdvancedOptions && <NetworkPicker enableCustomRpc={enableCustomRpc} infuraApiKey={infuraApiKey} alchemyApiKey={alchemyApiKey} onChange={(chain: IChain) => onConnectToWalletClick(chain)} />}

            <div>
                {account && <IonButton fill="outline" expand="block" color="primary" size="small" onClick={() => processAccount(account, address)}>Continue</IonButton>}
            </div>
        </div>
    )
}
export default WalletContainer;
