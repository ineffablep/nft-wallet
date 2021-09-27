import Web3 from 'web3';
export class PortisProvider {
    dAppId = ''
    network = 'mainnet';
    web3: Web3 | null;
    portis: any;
    // https://docs.portis.io/#/configuration
    constructor(dAppId: string, network?: string) {
        this.dAppId = dAppId;
        if (network) {
            this.network = network;
        }
    }
    activate = async () => {
        const Portis = require('@portis/web3');
        this.portis = new Portis(this.dAppId, this.network);
        this.web3 = new Web3(this.portis.provider);
        const account: string | null = await this.getAccount();
        const response = {
            account,
            chainId: this.network,
            provider: this.portis.provider
        }
        return response;
    }
    getProvider = () => {
        return this.portis.provider;
    }
    deactivate = async () => {
        this.portis = null;
        this.web3 = null;
    };

    getChainId = async () => {
        return this.network;
    }
    getAccount = async () => {
        try {
            if (this.web3) {
                try {
                    const accounts = await this.web3.eth.getAccounts();
                    return accounts && accounts.length > 0 ? accounts[0] : null;
                } catch (error) {
                    throw new Error(error);
                }
            }
            return null;
        } catch (error) {
            throw error;
        }
    };
    getAccounts = async () => {
        try {
            if (this.web3) {
                try {
                    return await this.web3.eth.getAccounts();
                } catch (error) {
                    throw new Error(error);
                }
            }
            return null;
        } catch (error) {
            throw error;
        }
    };
}