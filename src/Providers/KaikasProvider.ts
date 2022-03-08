import Web3 from 'web3';
import BaseProvider from './BaseProvider';
declare var window: any;
//https://docs.kaikas.io/01_getting_started/02_quick_start
class KaikasProvider extends BaseProvider {
    activate = async () => {
        if (typeof window.klaytn === 'undefined') {
            window.location.href = 'https://chrome.google.com/webstore/detail/kaikas/jblndlipeogpafnldhgmapagcccfchpi';
        }
        await window.klaytn.enable();
        const provider = window.klaytn;
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

export default KaikasProvider;
