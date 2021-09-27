import Web3 from 'web3';
import { provider, TransactionConfig } from 'web3-core';
declare var window: any;
///https://dapperdocs.netlify.app/integrate-with-dapper/request-user-account.html 
export class DapperProvider {
    client: any = null;
    provider: provider = null;
    web3: Web3 | null = null;
    constructor() {
    }
    activate = async () => {
        if (typeof window.ethereum === 'undefined') {
            throw new Error('No Ethereum provider was found on window.ethereum');
        }
        await window.ethereum.enable();
        const provider = window.ethereum;
        this.web3 = new Web3(provider);
        const account: string | null = await this.getAccount();
        const response = {
            account,
            chainId: 1,
            provider: this.provider
        }
        return response;
    };
    deactivate = async () => {
        this.provider = null;
        this.web3 = null;
    };

    getChainId = async () => {
        return 1;
    }
    getAccount = async () => {
        if (!window.ethereum) {
            throw new Error('No Ethereum provider was found on window.ethereum');
        }
        const accounts = await window.ethereum.enable();
        return accounts[0];
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
        return window.ethereum;
    };

    sendTransaction = async (config: TransactionConfig) => {
        if (this.web3) {
            const txn = await this.web3.eth.sendTransaction(config);
            return txn;
        }
        return null;
    };
}