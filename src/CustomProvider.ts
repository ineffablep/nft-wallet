import Web3 from 'web3';
import { IWalletInfo } from './types';
export class CustomProvider {
    walletInfo: IWalletInfo;

    web3: Web3 | null = null;
    constructor(walletInfo: IWalletInfo) {
        this.walletInfo = walletInfo;
    }
    activate = async () => {
        if (this.walletInfo && this.walletInfo.args && this.walletInfo.args.url) {
            this.web3 = new Web3(this.walletInfo.args.url);
        }
        // connect via oauth to use the wallet (call this from a click handler)

        const account: string | null = await this.getAccount();
        const response = {
            account,
            chainId: this.walletInfo.args?.chainId,
            provider: this.web3
        }
        return response;
    };

    deactivate = async () => {
        this.web3 = null;
    };

    getChainId = async () => {
        return this.web3 ? await this.web3.eth.net.getId() : this.walletInfo.args?.chainId;
    }
    getAccount = async () => {
        try {
            if (this.web3) {
                const accounts = await this.web3.eth.getAccounts();
                return accounts[0];
            }
            return null;
        } catch (error) {
            throw error;
        }
    };

    getBalance = async (accountId = '') => {
        try {
            if (this.web3) {
                return await this.web3.eth.getBalance(accountId);
            }
            return null;
        } catch (error) {
            throw error;
        }
    };

    getBlockNumber = async () => {
        try {
            if (this.web3) {
                return await this.web3.eth.getBlockNumber();
            }
            return null;
        } catch (error) {
            throw error;
        }
    };

    getProvider = () => {
        return this.web3;
    };

    sendTransaction = async (config: {
        from?: string | number;
        to?: string;
        value?: number | string;
        gas?: number | string;
        gasPrice?: number | string;
        data?: string;
        nonce?: number;
        chainId?: number;
        common?: {
            customChain: {
                name?: string;
                networkId: number;
                chainId: number;
            };
            baseChain?: | 'mainnet' | 'goerli' | 'kovan' | 'rinkeby' | 'ropsten';
            hardfork?: | 'chainstart' | 'homestead' | 'dao' | 'tangerineWhistle' | 'spuriousDragon' | 'byzantium' | 'constantinople' | 'petersburg' | 'istanbul';
        };
        chain?: string;
        hardfork?: string;
    }) => {
        if (this.web3) {
            const txn = await this.web3.eth.sendTransaction(config);
            return txn;
        }
        return null;
    };
}