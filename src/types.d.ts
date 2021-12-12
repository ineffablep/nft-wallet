import { TransactionConfig, TransactionReceipt } from 'web3-core';
declare type Network = number | {
    chainId: string;
    [key: string]: any;
};
export interface IAccount {
    id: string, name: string, balance?: string | number | { amount: number | string, currency: string | number }
}
export interface IProvider {
    activate(): Promise<{
        accounts: Array<IAccount>,
        chainId: string | number
        provider: any
    }>;
    deactivate(): void;
    getChainId(): Promise<number | string>;
    getAccounts(): Promise<Array<IAccount>>;
    getBalance(accountId: string): Promise<string>;
    getBlockNumber(): Promise<number | string>;
    getProvider(): any;
    sendTransaction(transactionConfig: TransactionConfig): Promise<TransactionReceipt | null>;
}

export interface IWalletInfo {
    key: string;
    link: string;
    title: string;
    type: 'all' | 'ethereum' | string;
    description: string;
    logo: string;
    args?: {
        urls?: {
            [chainId: number]: string;
        };
        url?: string;
        network?: string;
        networks?: Network[];
        chainId?: number;
        supportedChainIds?: number[];
        dAppId?: string;
        scope?: string;
        dAppName?: string;
        dAppEmail?: string;
        dAppLogoUrl?: string;
        dAppUrl?: string;
        dAppSecret?: string;
        callbackUrl?: string;
    }
}