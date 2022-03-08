import React, { useState, useCallback, useEffect } from 'react';
import { post } from '@wholelot/util/lib/fetchHelper';
import ConnectProvider from './ConnectProvider';
import NetworkPicker, { IChain } from './NetworkPicker';
import { IWalletInfo, IAccount } from './types';
import './WalletConnector.css';

declare var window: any;
export const handleError = (error: any) => {
    let alertMessage;
    if (typeof error === 'string') {
        alertMessage = error;
    } else if (error.message) {
        alertMessage = error.message;
    } else if (error.error) {
        alertMessage = error.error;
    } else {
        alertMessage = 'Error while processing request, please try again later';
    }
    return alertMessage;
};

const WalletConnector: React.FC<{
    ConnectorList: Array<IWalletInfo>,
    history: any
    infuraApiKey: string,
    alchemyApiKey: string,
    submitUrl: string,
    item: Object,
    successRedirectionUrl: string,
    clientId: string,
    connectIfAccountHasBalance: boolean;
    clientSecret: string,
    enableCustomRpc: boolean,
    enableAdvancedOptions: boolean,
    successParams: Array<{ field: string, key: string }>
    location?: any;
    authKey: string;
}> = ({
    ConnectorList,
    submitUrl,
    item = {},
    successRedirectionUrl,
    enableCustomRpc,
    connectIfAccountHasBalance,
    enableAdvancedOptions,
    infuraApiKey,
    clientId,
    clientSecret,
    authKey,
    alchemyApiKey,
    successParams,
    history,
    location }) => {
        const [viewState, setViewState] = useState<{
            message: string,
            showMessage: boolean,
            selectedNetworkChain?: IChain,
            selectedWallet?: IWalletInfo,
            address?: IAccount;
            account?: IAccount,
            color: string;
            success: boolean;
            accounts: Array<IAccount>;
            addresses?: Array<IAccount>;
            user?: any;
            token?: any;
        }>({ message: '', showMessage: false, color: 'danger', success: false, accounts: [] });

        const { message, success, color, showMessage, selectedNetworkChain, selectedWallet, address, account, accounts, user, token } = viewState;
        const { search } = location || {};

        /** Coinbase */
        useEffect(() => {
            const load = async () => {
                if (search.includes('code')) {
                    const key = localStorage.getItem('wl-wallet-key');
                    const wallet: any = ConnectorList.find(f => f.key === key);
                    try {
                        if (wallet) {
                            const conObj = ConnectProvider(wallet, { clientId, clientSecret, authKey });
                            if (conObj) {
                                const response: any = await conObj.activate();
                                const { accounts, user, provider, ...rest } = response;
                                await conObj.deactivate();
                                if (accounts) {
                                    setViewState(viewState => {
                                        return {
                                            ...viewState,
                                            selectedWallet: wallet,
                                            message: (!accounts || (accounts && accounts.length === 0)) ? 'No Account connected, Please check with Coinbase '
                                                : (accounts && accounts.length === 1 ? 'Successfully Connected, Please click on Continue to map the wallet' : 'Select Account and Address to Use'),
                                            success: accounts && accounts.length === 1 && accounts[0],
                                            showMessage: true,
                                            color: 'success',
                                            account: accounts && accounts.length === 1 && accounts[0] ? accounts[0] : undefined,
                                            accounts: accounts ? accounts : [],
                                            user: user,
                                            token: rest
                                        }
                                    });
                                }
                            }
                        }
                    } catch (error: any) {
                        setViewState(viewState => {
                            return {
                                ...viewState,
                                message: handleError(error),
                                color: 'danger',
                                showMessage: true
                            }
                        });
                    }
                }

            }
            if (search) {
                load();
            }
        }, [ConnectorList, clientId, clientSecret, search]);

        const getAccountInfo = useCallback(async (wallet: IWalletInfo) => {
            if (wallet) {
                const { args, key } = wallet;
                if (key === 'metamask' || key === 'injected') {
                    if (typeof window.ethereum === 'undefined') {
                        window.location.href = 'https://metamask.io/download.html';
                        return;
                    }
                }

                if (key === 'coinbase') {
                    const { dAppId, scope, callbackUrl } = args || {};
                    const redirect_uri = window.origin.includes('capacitor://') ? 'urn:ietf:wg:oauth:2.0:oob' : `${window.location.host}${callbackUrl}`;
                    window.location.href = `https://www.coinbase.com/oauth/authorize?response_type=code&client_id=${dAppId}&redirect_uri=${window.location.protocol}//${redirect_uri}&scope=${scope}`;
                    return;
                }
                try {
                    const conObj = ConnectProvider(wallet, { clientId, clientSecret, authKey });
                    if (conObj) {
                        if (key === 'bitski') {
                            conObj.signin();
                            return;
                        }
                        const response = await conObj.activate();
                        const { accounts } = response;
                        const account = accounts && accounts.length === 1 && accounts[0] ? accounts[0] : undefined;
                        let error = '';
                        let balance: any = 0;
                        if (account) {
                            balance = account.balance;
                            if (typeof balance === 'string') {
                                balance = Number(balance);
                            }
                            if (wallet.key === 'custom') {
                                if (!account) {
                                    error = `${wallet.title} account information not available form the connections or network may be not compatible, please provide other RPC info or select another wallet.`;
                                }
                            }

                        }
                        await conObj.deactivate();
                        setViewState(viewState => {
                            return {
                                ...viewState,
                                selectedWallet: wallet,
                                message: error ? error : ((!accounts || (accounts && accounts.length === 0)) ? 'No Account connected, Please check with Coinbase ' : (accounts && accounts.length === 1 ? 'Successfully Connected, Please click on Continue to map the wallet' : 'Select Account and Address to Use')),
                                success: !error && accounts && accounts.length === 1 && accounts[0] ? true : false,
                                showMessage: true,
                                color: error ? 'danger' : 'success',
                                account,
                                address: account
                            }
                        });
                    }
                } catch (error: any) {
                    setViewState(viewState => {
                        return {
                            ...viewState,
                            message: 'An error occurred while connecting to wallet',
                            showMessage: true
                        }
                    });
                }
            }
        }, [clientId, clientSecret, authKey]);

        const onConnectToWalletClick = useCallback(async (chain: IChain) => {
            if (chain) {
                const wl: IWalletInfo = {
                    key: 'custom',
                    title: 'Custom',
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
                setViewState(viewState => {
                    return {
                        ...viewState,
                        selectedNetworkChain: chain,
                        selectedWallet: wl,
                        account: { id: chain.addressId || '', name: chain.addressId || '' },
                        address: { id: chain.addressId || '', name: chain.addressId || '' }
                    };
                });
                await getAccountInfo(wl);
            }
        }, [getAccountInfo]);

        const processAccount = async () => {
            if (submitUrl && account) {
                const data = {
                    ...item,
                    connectedWallet: selectedWallet,
                    connectedNetwork: selectedNetworkChain,
                    walletAccount: account,
                    walletAddress: address,
                    walletType: selectedWallet ? selectedWallet.title : 'Custom',
                    blockChain: selectedWallet ? selectedWallet.type : 'Custom',
                    address: account.id,
                    user,
                    token
                };
                try {
                    await post(submitUrl, data, { clientId, clientSecret, authKey });
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
                            history.goBack();
                        } else {
                            window.location.href = '/';
                        }
                    }
                } catch (error: any) {
                    setViewState(viewState => {
                        return {
                            ...viewState,
                            error: handleError(error),
                            showMessage: true
                        }
                    });
                }
            }
        };

        const toggleError = useCallback(() => {
            setViewState(viewState => {
                return { ...viewState, showMessage: !viewState.showMessage };
            })
        }, []);

        const setWallet = useCallback((wallet) => {
            localStorage.setItem('wl-wallet-key', wallet.key);
            setViewState(viewState => {
                return { ...viewState, selectedWallet: wallet };
            })
        }, []);

        const onAccountSelect = useCallback(async (e) => {
            setViewState((viewState) => {
                const account: any = viewState.accounts.find((f: any) => f.id === e.target.value);
                return { ...viewState, account, success: true, showMessage: true, message: `Successfully Connected, Please click on Continue to map the wallet` };
            });

        }, []);

        return (
            <div>
                {showMessage && <div className={`${color} ion-padding`}>
                    {message}
                    {connectIfAccountHasBalance && <span>{selectedWallet ? selectedWallet.title : 'Your '} account information not available form the connections or network may be not compatible, please provide other RPC info or select another wallet.</span>}
                    <div className="text-white pointer ion-float-right" onClick={toggleError} >&times;</div>
                </div>}
                {!success && selectedWallet && <div className="ion-margin">Your wallet, {selectedWallet && <span>powered by <a href={selectedWallet.link} target="_blank" rel="nofollow noopener noreferrer">{selectedWallet.title}</a>, </span>} will be used to securely store your digital goods and cryptocurrencies.</div>}
                {accounts && accounts.length > 1 && <div className="margin-vertical">
                    <div>
                        <div className="wallet-label">
                            <label className="text-primary"> Select  Account </label>
                        </div>
                        <div className="wallet-control">
                            <select value={account ? account.id : ''} onChange={onAccountSelect}>
                                <option value="" disabled>Select Account</option>
                                {accounts.map((acc: IAccount) => <option key={acc.id} value={acc.id}>
                                    {acc.name} {acc.balance ? (typeof acc.balance === 'object' ? `- ${acc.balance.amount}` : `-${acc.balance}`) : ''}
                                </option>)}
                            </select>
                        </div>
                    </div>
                </div>
                }
                <div className='margin-vertical wallet-control'>
                    {success && account && <button className='primary' color="primary" onClick={processAccount}>Continue</button>}
                </div>
                {accounts.length < 1 && <div className="wallet-list margin-vertical">
                    {ConnectorList && ConnectorList.map((connector, index) => <div onClick={() => {
                        setWallet(connector);
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
                }
                {accounts.length < 1 && enableAdvancedOptions && <NetworkPicker enableCustomRpc={enableCustomRpc} infuraApiKey={infuraApiKey} alchemyApiKey={alchemyApiKey} onChange={(chain: IChain) => onConnectToWalletClick(chain)} />}
            </div>
        )
    }
export default WalletConnector;
