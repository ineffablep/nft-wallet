//https://docs.walletconnect.org/quick-start/dapps/web3-provider
import WalletConnectProvider from "@walletconnect/web3-provider";
import Web3 from 'web3';
import BaseProvider from './BaseProvider';
class RpcWalletProvider extends BaseProvider {

    activate = async () => {
        //  Create WalletConnect Provider
        const provider = new WalletConnectProvider({
            rpc: this.walletInfo.args?.urls
        });

        await provider.enable();
        this.web3 = new Web3(provider as any);
        const accounts = await this.getAccounts();
        const chainId = await this.getChainId();
        const response = {
            accounts,
            chainId,
            provider: this.getProvider()
        }
        return response;
    };

}
export default RpcWalletProvider;
