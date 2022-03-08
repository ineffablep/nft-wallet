import Web3 from 'web3';
import BaseProvider from './BaseProvider';
declare var window: any;
///https://dapperdocs.netlify.app/integrate-with-dapper/request-user-account.html 
class DapperProvider extends BaseProvider {
    activate = async () => {
        if (typeof window.ethereum === 'undefined') {
            throw new Error('No Ethereum provider was found on window.ethereum');
        }
        await window.ethereum.enable();
        const provider = window.ethereum;
        this.web3 = new Web3(provider);
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

export default DapperProvider;
