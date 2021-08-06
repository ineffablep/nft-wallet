# Simple to Create NFT Wallet
Configuration based NFT Wallet  React Component with all wallet connections for your NFT

## Installation

``` npm install --save nft-wallet ```

## Usage
See Connector list example with supported wallets, please update args values as needed.
```javascript
const ConnectorList = [
    {
        title: 'Ethereum Wallet',
        key: 'network',
        logo: 'https://www.pngitem.com/pimgs/m/124-1245793_ethereum-eth-icon-ethereum-png-transparent-png.png',
        description: 'Connect to RPC Ethereum Wallet that supports multiple chains.',
        link: 'https://ethereum.org/en/',
        type: 'ethereum',
        args: { urls: { 1: '', 4: '' }, supportedChainIds: [1, 3, 4, 5, 42] }
    },
    {
        title: 'METAMASK',
        key: 'metamask',
        logo: 'https://opensea.io/static/images/logos/metamask.png',
        description: 'Connect with Meta Mask , over 1 million worldwide  users trusted wallet.',
        link: 'https://metamask.io',
        type: 'ethereum',
        args: {  supportedChainIds: [1, 3, 4, 5, 42] }
    },
    {
        title: 'Coinbase',
        key: 'coinbase',
        logo: 'https://storage.googleapis.com/opensea-static/logos/coinbasewallet-logo.png',
        description: 'Connect with Coinbase, a wellknown global crypto currency wallet.',
        link: 'https://www.coinbase.com/',
        type: 'all',
        args: {  dAppId: '', dAppSecret: '' }
    },
    {
        title: 'Bitski',
        key: 'bitski',
        logo: 'https://storage.googleapis.com/opensea-static/logos/bitski.png',
        description: 'Connect with Bitski, A simple-to-use wallet with email and password.',
        link: 'https://bitski.com',
        type: 'all',
        args: {  dAppId: '' }
    },
    {
        title: 'Portis',
        key: 'portis',
        type: 'all',
        logo: 'https://storage.googleapis.com/opensea-static/logos/portis.png',
        description: 'Connect with Portis, a cloud-hosted Non-Custodial Blockchain wallet ',
        link: 'https://portis.io/',
        args: { dAppId: '', networks: [{ chainId: '1', 1: '' }, { chainId: '4', 4: '' }] }
    },
    {
        title: 'Dapper',
        key: 'dapper',
        type: 'ethereum',
        logo: 'https://storage.googleapis.com/opensea-static/logos/dapper-icon.png',
        description: 'Connect with Dapper, a browser extension that pays gas fee for you. ',
        link: 'https://www.meetdapper.com/',
        args: {  supportedChainIds: [1, 100] }
    },
    {
        title: 'Kaikas',
        key: 'kaikas',
        type: 'ethereum',
        logo: 'https://opensea.io/static/images/logos/kaikas-alternative.png',
        description: 'Connect with Dapper, a chrome extension wallet. ',
        link: 'https://chrome.google.com/webstore/detail/kaikas/jblndlipeogpafnldhgmapagcccfchpi/',
        args: {  supportedChainIds: [1, 100] }
    },
    {
        title: 'Trezor',
        key: 'trezor',
        type: 'all',
        logo: 'https://trezor.io/static/images/trezor-logo-black.png',
        description: 'Connect with Trezor,  the secure vault for your digital assets."',
        link: 'https://trezor.ie/',
        args: {url:'', chainId: 1, dAppEmail: '', dAppUrl: '' }
    },
    {
        title: 'Authereum',
        key: 'authereum',
        type: 'all',
        logo: 'https://storage.googleapis.com/opensea-static/logos/authereum.png',
        description: 'Connect with Authereum, a usability focused wallet with no transaction fee.',
        link: 'https://authereum.com/',
        args: {  chainId: 1}
    },
    {
        title: 'Fortmatic',
        key: 'fortmatic',
        type: 'all',
        logo: 'https://storage.opensea.io/static/wallets/fortmatic/fortmatic.png',
        description: 'Connect with Fortmatic , join with your phone number on any device.',
        link: 'https://fortmatic.com/',
        args: {  dAppId: '', dAppName: 'Your App Name', chainId: 1, }
    },
    {
        title: 'Ledger',
        key: 'ledger',
        type: 'all',
        logo: '',
        description: 'Connect with a Ledger  Nano X , Nano S device with Bluetooth or USB.',
        link: 'https://www.ledger.com/wp-content/themes/ledger-v2/public/images/ledger.svg',
        args: { email: '', url:'', chainId: 1 }
    },
    {
        title: 'Lattice 1',
        key: 'lattice',
        type: 'all',
        logo: 'https://cdn.shopify.com/s/files/1/0221/1921/9264/files/grid-plus-logo-white_180x.png?v=1607610627',
        description: 'Connect with your Grid Plus Lattice 1, a programmable hardware wallet.',
        link: 'https://gridplus.io/products/grid-lattice1',
        args: { url:'', dAppName: 'Your App Name', chainId: 1, }
    },
    
    {
        title: 'Wallet Connect',
        key: 'walletConnect',
        type: 'all',
        logo: 'https://storage.opensea.io/static/wallets/walletconnect/walletconnect.png',
        description: 'Pair with Trust, Argent, MetaMask  & more. Works from any browser, without an extension.',
        link: 'https://walletconnect.org/',
        args: { urls: { 1: '', 4: '' }, }
    },
    {
        title: 'Wallet Link',
        key: 'walletLink',
        type: 'all',
        logo: 'https://walletlink.org/favicon.ico',
        description: 'Connect your own Wallet, An open protocol that lets to connect mobile wallets',
        link: 'https://walletlink.org/',
        args: { url:'', dAppName: 'Your App Name', dAppLogoUrl:'',supportedChainIds: [1, 100] }
    },

];
const onConnection =(account, provider)=>{
// Manage your logic provide account addressId and Connection Provider
};
<WalletContainer ConnectorList={connectorList} onConnection={onConnection}/>

```