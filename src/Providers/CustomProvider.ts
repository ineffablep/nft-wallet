import Web3 from 'web3';
import BaseProvider from './BaseProvider';
class CustomProvider extends BaseProvider {
    activate = async () => {
        if (this.walletInfo && this.walletInfo.args && this.walletInfo.args.url) {
            this.web3 = new Web3(this.walletInfo.args.url);
        }
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

export default CustomProvider;
