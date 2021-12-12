import Web3 from 'web3';
import { TransactionConfig } from 'web3-core';
import { IWalletInfo, IProvider } from '../types';
import { IAccount } from '../types.d';

class BaseProvider implements IProvider {

    web3: Web3 | null = null;
    walletInfo: IWalletInfo;
    chainId = '1';
    constructor(walletInfo: IWalletInfo) {
        this.walletInfo = walletInfo;
    }
    activate(): Promise<{ accounts: { id: string; name: string; balance?: string | number | { amount: string | number; currency: string | number; } | undefined; }[]; chainId: string | number; provider: any; }> {
        throw new Error('Method not implemented.');
    }


    deactivate = async () => {
    };

    getChainId = async () => {
        return this.web3 ? await this.web3.eth.net.getId() : this.chainId;
    }

    getAccounts = async () => {
        const accList: Array<IAccount> = [];
        if (this.web3) {
            const accounts = await this.web3.eth.getAccounts();
            if (accounts) {
                for (const acc of accounts) {
                    const balance = await this.getBalance(acc);
                    accList.push({
                        id: acc,
                        name: acc,
                        balance,
                    });
                }
            }
        }
        return accList;
    };

    getBalance = async (accountId = '') => {
        if (this.web3) {
            return await this.web3.eth.getBalance(accountId);
        }
        return '';

    };

    getBlockNumber = async () => {
        if (this.web3) {
            return await this.web3.eth.getBlockNumber();
        }
        return '';
    }
    getProvider = () => {
        return this.web3?.givenProvider;
    };

    sendTransaction = async (config: TransactionConfig) => {
        if (this.web3) {
            const txn = await this.web3.eth.sendTransaction(config);
            return txn;
        }
        return null;
    };
}

export default BaseProvider;
