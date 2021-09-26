import Web3 from 'web3';
import { provider, TransactionConfig } from 'web3-core';
declare var window: any;
//https://docs.kaikas.io/01_getting_started/02_quick_start
export class KaikasProvider {
    client: any = null;
    provider: provider = null;
    web3: Web3 | null = null;

    activate = async () => {
        if (typeof window.klaytn !== 'undefined') {
            window.location.href = 'https://chrome.google.com/webstore/detail/kaikas/jblndlipeogpafnldhgmapagcccfchpi';
        }
        await window.klaytn.enable();
        const provider = window.klaytn;
        this.web3 = new Web3(provider);
    };

    getAccount = async () => {
        if (!window.klaytn) {
            throw new Error('No klaytn provider was found on window.klaytn');
        }
        const accounts = await window.klaytn.enable()
        return accounts[0]
    };

    getProvider = () => {
        return window.klaytn;
    };

    sendTransaction = async (config: TransactionConfig) => {
        let caver = window.caver;
        if (!window.caver) {
            const Caver = await import('caver-js').then(m => m?.default ?? m);
            caver = new Caver(window.klaytn);
            window.caver = caver;
        }
        return new Promise((resolve, reject) => {
            try {
                let txHash = '';
                let receipt: any = null;
                caver.klay
                    .sendTransaction({
                        type: 'VALUE_TRANSFER',
                        from: window.klaytn.selectedAddress,
                        to: config.to,
                        value: caver.utils.toPeb(config.value, 'KLAY'),
                        gas: config.gas
                    })
                    .once('transactionHash', (transactionHash: string) => {
                        console.log('txHash', transactionHash)
                        txHash = transactionHash;
                        resolve({ txHash, receipt });
                    })
                    .once('receipt', (rcpt: any) => {
                        console.log('receipt', rcpt)
                        receipt = rcpt;
                        resolve({ txHash, receipt });
                    })
                    .once('error', (error: any) => {
                        reject(error);
                        console.log('error', error)
                    });
            } catch (error) {
                reject(error);
            }
        });
    };
}