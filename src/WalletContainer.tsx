import React, { useState } from 'react';
import ConnectProvider from './ConnectProvider';
import { IWalletInfo } from './types';
import QRCode from 'qrcode.react';
import './WalletContainer.css';

const WalletContainer: React.FC<{ ConnectorList: Array<IWalletInfo>, onConnection?: Function }> = ({ ConnectorList, onConnection }) => {
    const [selectedWallet, setSelectedWallet] = useState<IWalletInfo>();
    const [account, setAccounts] = useState('');
    const onConnectToWalletClick = async (e: IWalletInfo) => {
        setSelectedWallet(e);
        try {
            const provider = ConnectProvider(e);
            provider?.activate();
            const account = await provider?.getAccount();
            setAccounts(account);
            if (onConnection) {
                onConnection({ account, provider });
            }
        } catch (error) {
            console.log(error);
        }
    };
    return (
        <div>
            {account && <div className="ion-margin">
                <QRCode value={account} />
            </div>
            }
            <div className="ion-margin">Your wallet, {selectedWallet && <span>powered by <a href={selectedWallet.link} target="_blank" rel="nofollow noopener noreferrer">{selectedWallet.title}</a>, </span>} will be used to securely store your digital goods and cryptocurrencies.</div>
            <div className="wallet-list">
                {ConnectorList && ConnectorList.map((connector, index) => <div onClick={() => onConnectToWalletClick(connector)} className="wallet-item" key={`wallet_map_${index}_${connector.key}`} >
                    <div className="wallet-item-img-slot">
                        <img src={connector.logo} alt={connector.title} />
                    </div>
                    <div className="wallet-item-caption-slot">
                        <p>{connector.description}</p>
                    </div>
                </div>
                )}
            </div>
        </div >
    )
}
export default WalletContainer;
