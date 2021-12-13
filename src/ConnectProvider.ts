import BitskProvider from './Providers/BitskiProvider';
import DapperProvider from './Providers/DapperProvider';
import KaikasProvider from './Providers/KaikasProvider';
import PortisProvider from './Providers/PortisProvider';
import RpcWalletProvider from './Providers/RpcWalletProvider';
import CustomProvider from './Providers/CustomProvider';
import MetaMaskProvider from './Providers/MetaMaskProvider';
import CoinbaseProvider from './Providers/CoinbaseProvider';
import { IWalletInfo } from './types';
const ConnectionProvider = (e: IWalletInfo, props: any) => {
    switch (e.key) {
        case 'metamask':
        case 'injected': {
            return new MetaMaskProvider(e, props);
        }
        case 'bitski': {
            return new BitskProvider(e, props);
        }
        case 'portis': {
            return new PortisProvider(e, props);
        }
        case 'dapper': {
            return new DapperProvider(e, props);
        }
        case 'kaikas': {
            return new KaikasProvider(e, props);
        }
        case 'walletConnect':
        case 'rpc': {
            return new RpcWalletProvider(e, props);
        }
        case 'coinbase': {
            return new CoinbaseProvider(e, props);
        }
        case 'custom': {
            return new CustomProvider(e);
        }
        default:
            return null;
    }
};

export default ConnectionProvider;
