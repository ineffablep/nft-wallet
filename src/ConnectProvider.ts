import BitskProvider from './Providers/BitskiProvider';
import DapperProvider from './Providers/DapperProvider';
import KaikasProvider from './Providers/KaikasProvider';
import PortisProvider from './Providers/PortisProvider';
import RpcWalletProvider from './Providers/RpcWalletProvider';
import CustomProvider from './Providers/CustomProvider';
import MetaMaskProvider from './Providers/MetaMaskProvider';
import { IWalletInfo } from './types';
const ConnectionProvider = (e: IWalletInfo) => {
    switch (e.key) {
        case 'metamask':
        case 'injected': {
            return new MetaMaskProvider(e);
        }
        case 'bitski': {
            return new BitskProvider(e);
        }
        case 'portis': {
            return new PortisProvider(e);
        }
        case 'dapper': {
            return new DapperProvider(e);
        }
        case 'kaikas': {
            return new KaikasProvider(e);
        }
        case 'walletConnect':
        case 'rpc': {
            return new RpcWalletProvider(e);
        }
        case 'custom': {
            return new CustomProvider(e);
        }
        default:
            return null;
    }
};

export default ConnectionProvider;
