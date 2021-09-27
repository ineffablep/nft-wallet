import Web3 from 'web3';

export class BitskProvider {
    client: any = null;
    dAppId = '';
    chainId = 1;
    provider: any = null;
    web3: Web3 | null = null;
    constructor(dAppId: string, chainId: number) {
        this.dAppId = dAppId;
        this.chainId = chainId
    }
    activate = async () => {
        const Bitski = require('bitski').Bitski;
        const bitski = new Bitski(this.dAppId, window.location.href + '/bitski_callback');
        this.provider = bitski.getProvider();
        this.web3 = new Web3(this.provider);
        // connect via oauth to use the wallet (call this from a click handler)
        await bitski.signIn();
        const account: string | null = await this.getAccount();
        const response = {
            account,
            chainId: this.chainId,
            provider: this.provider
        }
        return response;
    };

    deactivate = async () => {
        this.provider = null;
        this.web3 = null;
    };

    getChainId = async () => {
        return this.chainId;
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
        return this.provider;
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