import Web3 from 'web3';
import BaseProvider from './BaseProvider';

class BitskiProvider extends BaseProvider {

    activate = async () => {
        const Bitski = require('bitski').Bitski;
        const bitski = new Bitski(this.walletInfo.args?.dAppId, `${window.location.protocol}//${window.location.host}${this.walletInfo.args?.callbackUrl}`);
        const provider = bitski.getProvider();
        this.web3 = new Web3(provider);
        // connect via oauth to use the wallet (call this from a click handler)
        await bitski.signIn();
        const accounts = await this.getAccounts();
        const chainId = await this.getChainId();
        const response = {
            accounts,
            chainId: chainId,
            provider: this.getProvider()
        }
        return response;
    };
}

export default BitskiProvider;
