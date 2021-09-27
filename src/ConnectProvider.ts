import { InjectedConnector } from '@web3-react/injected-connector';
import { NetworkConnector } from '@web3-react/network-connector';
import { LedgerConnector } from '@web3-react/ledger-connector';
import { TrezorConnector } from '@web3-react/trezor-connector';
import { LatticeConnector } from '@web3-react/lattice-connector';
import { AuthereumConnector } from '@web3-react/authereum-connector';
import { FortmaticConnector } from '@web3-react/fortmatic-connector';
import { BitskProvider } from './BitskProvider';
import { DapperProvider } from './DapperProvider';
import { KaikasProvider } from './KaikasProvider';
import { IWalletInfo } from './types';
import { PortisProvider } from './PortisProvider';
import { RpcWalletProvider } from './RpcWalletProvider';

const ConnectionProvider = (e: IWalletInfo) => {
    switch (e.key) {
        //URL hosting
        case 'network': {
            if (e.args?.urls && e.args?.supportedChainIds) {
                return new NetworkConnector({
                    urls: e.args?.urls,
                    defaultChainId: e.args?.supportedChainIds[0]
                });
            }
            return null;
        }
        /// Already in browse through Chrome Extensions
        case 'metamask':
        case 'injected': {
            try {
                return new InjectedConnector({ supportedChainIds: e.args?.supportedChainIds });
            } catch (error) {
                console.log(error);
            }
        }
        case 'bitski': {
            if (e.args?.dAppId) {
                const chainId = e.args.chainId || 1;
                return new BitskProvider(e.args?.dAppId, chainId);
            }
            return null;
        }
        case 'portis': {
            if (e.args && e.args?.dAppId && e.args?.networks) {
                return new PortisProvider(e.args?.dAppId, e.args.network);
            }
            return null;
        }
        case 'dapper': {
            return new DapperProvider();
        }
        case 'kaikas': {
            return new KaikasProvider();
        }
        case 'trezor': {
            if (e.args?.url && e.args?.chainId && e.args?.dAppEmail && e.args?.dAppUrl) {
                return new TrezorConnector({
                    chainId: e.args?.chainId,
                    url: e.args?.url,
                    pollingInterval: 12000,
                    manifestEmail: e.args?.dAppEmail,
                    manifestAppUrl: e.args?.dAppUrl,
                });
            }
            return null;
        }
        case 'authereum': {
            if (e.args?.chainId) {
                return new AuthereumConnector({ chainId: e.args?.chainId })
            }
            return null;
        }
        case 'fortmatic':
            if (e.args?.dAppId && e.args?.chainId) {
                return new FortmaticConnector({ apiKey: e.args?.dAppId, chainId: e.args?.chainId })
            }
            return null;

        case 'ledger': {
            if (e.args?.chainId && e.args?.url) {
                return new LedgerConnector({
                    chainId: e.args?.chainId,
                    url: e.args?.url,
                    pollingInterval: 12000
                });
            }
            return null;
        }
        case 'lattice': {
            if (e.args?.chainId && e.args?.dAppName && e.args?.url) {
                return new LatticeConnector({
                    chainId: e.args?.chainId,
                    appName: e.args?.dAppName,
                    url: e.args?.url
                });
            }
            return null;
        }
        case 'walletConnect':
        case 'rpc': {
            if (e.args && e.args.urls) {
                const obj = {
                    rpc: e.args.urls,
                    qrcode: false,
                    pollingInterval: 1200
                }
                return new RpcWalletProvider(obj);
            }
        }


        default:
            return null;
    }
};

export default ConnectionProvider;
