export class CoinbaseProvider {
    dAppId = ''
    dAppSecret = ''
    client: any = null;
    constructor(dAppId: string, dAppSecret: string) {
        this.dAppId = dAppId;
        this.dAppSecret = dAppSecret;
    }
    activate = async () => {
        const coinbase = await import('coinbase').then(m => m?.default ?? m);
        // const Client = require('coinbase').Client;
        if (this.dAppId && this.dAppSecret) {
            this.client = new coinbase.Client({ 'apiKey': this.dAppId, 'apiSecret': this.dAppSecret });
        }
    };

    getAccount = async () => {
        try {
            const accounts = await this.client.getAccounts({});
            return accounts
        } catch (error) {
            throw error;
        }
    };

    getBalance = async (accountId = {}) => {
        try {
            const account = await this.client.getAccount(accountId);
            if (account) {
                return account.balance.amount
            }
            throw new Error('Account not found');
        } catch (error) {
            throw error;
        }
    };
}