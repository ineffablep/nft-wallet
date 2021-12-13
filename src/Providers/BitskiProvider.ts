import Web3 from 'web3';
// import { Bitski } from 'bitski';
import BaseProvider from './BaseProvider';
import { IWalletInfo } from '../types';
const Bitski = require('bitski').Bitski;
class BitskiProvider extends BaseProvider {
    bitski: any;
    constructor(walletInfo: IWalletInfo, props: any = {}) {
        super(walletInfo, props);
        if (this.walletInfo.args && this.walletInfo.args.dAppId && this.walletInfo.args.callbackUrl) {
            this.bitski = new Bitski(this.walletInfo.args.dAppId, `${window.location.protocol}//${window.location.host}${this.walletInfo.args.callbackUrl}`);
        }
    }
    signin = async () => {
        if (this.bitski) {
            try {
                this.bitski.signInRedirect();
            } catch (error) {
                if (error.code === 1001) {
                    throw 'You have cancelled the connection, please select wallet to connect.'
                } else {
                    throw error;
                }
            }
        }
    }

    activate = async () => {
        const user = await this.bitski.redirectCallback();
        const provider: any = this.bitski.getProvider();
        this.web3 = new Web3(provider);
        const accounts = await this.getAccounts();
        const chainId = await this.getChainId();
        const response = {
            accounts,
            chainId: chainId,
            provider: this.getProvider(),
            user
        }
        return response;
    };

    deactivate = async () => {
        this.bitski.signOut();
    };
}

export default BitskiProvider;
