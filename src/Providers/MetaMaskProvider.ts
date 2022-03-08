import Web3 from 'web3';
import BaseProvider from './BaseProvider';
declare var window: any;
class MetaMaskProvider extends BaseProvider {
    activate = async () => {
        if (typeof window.ethereum !== 'undefined') {
            // Instance web3 with the provided information
            this.web3 = new Web3(window.ethereum);
            try {
                // Request account access
                await window.ethereum.enable();
                const accounts = await this.getAccounts();
                const response = {
                    accounts,
                    chainId: this.chainId,
                    provider: this.getProvider()
                };
                return response;
            } catch (e) {
                throw 'Your have rejected the access, please connect wallet.'
            }
        } else {
            window.location.href = 'https://metamask.io/download.html';
            return {
                accounts: [],
                chainId: this.chainId,
                provider: this.getProvider()
            };
        }
    };
}

export default MetaMaskProvider;
