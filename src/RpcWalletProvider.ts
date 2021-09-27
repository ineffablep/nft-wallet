//https://docs.walletconnect.org/quick-start/dapps/web3-provider
import WalletConnectProvider from "@walletconnect/web3-provider";
import Web3 from 'web3';

export class RpcWalletProvider {
    rpc: { [chainId: number]: string };
    provider: any;
    web3: Web3 | null = null;
    chainId = '1';
    constructor(rpc: { [chainId: number]: string }) {
        this.rpc = rpc;
    }
    activate = async () => {

        //  Create WalletConnect Provider
        this.provider = new WalletConnectProvider({
            rpc: this.rpc
        });

        //  Enable session (triggers QR Code modal)
        await this.provider.enable();
        this.web3 = new Web3(this.provider);
        const chainIds = Object.keys(this.rpc);
        this.chainId = chainIds[0];
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
        return this.web3 ? await this.web3.eth.net.getId() : this.chainId;
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

}