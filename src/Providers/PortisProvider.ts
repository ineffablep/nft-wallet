import Web3 from 'web3';
import BaseProvider from './BaseProvider';
class PortisProvider extends BaseProvider {

    activate = async () => {
        const Portis = require('@portis/web3');
        const portis = new Portis(this.walletInfo.args?.dAppId, this.walletInfo.args?.network);
        this.web3 = new Web3(portis.provider);
        const accounts = await this.getAccounts();
        const chainId = await this.getChainId();
        const response = {
            accounts,
            chainId,
            provider: this.getProvider
        }
        return response;
    }
}

export default PortisProvider;
