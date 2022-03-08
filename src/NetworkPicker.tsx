import React, { useState, useEffect } from 'react';

export interface IChain {
    name: string,
    chain: string,
    network: string,
    icon: string,
    rpc: Array<string>,
    faucets: Array<string>,
    nativeCurrency: {
        name: string,
        symbol: string,
        decimals: number
    },
    infoURL: string,
    shortName: string,
    chainId: number,
    networkId: number,
    slip44: number,
    ens: {
        registry: string,
    },
    explorers: Array<{
        name: string,
        url: string,
        standard: string
    }>,
    text: string,
    value: string,
    isCustom?: boolean,
    addressId?: string
}

const NetworkPicker: React.FC<{ alchemyApiKey: string, enableCustomRpc: boolean, infuraApiKey: string, onChange: Function }> = ({ infuraApiKey, enableCustomRpc, alchemyApiKey, onChange }) => {
    const [chains, setChains] = useState<Array<IChain>>([]);
    const [filterChains, setFilterChains] = useState<Array<{ text: string, value: string }>>([]);
    const [networks, setNetworks] = useState<Array<string>>([]);
    const [selectedNetwork, setSelectNetwork] = useState('');
    const [showCustomNetworkOption, setShowCustomNetworkOption] = useState(false);
    const [selectedChain, setSelectedChain] = useState<any>();
    const [customNetworkUrl, setCustomNetworkUrl] = useState('');
    const [customChainId, setCustomChainId] = useState('');
    const [customAddressId, setCustomAddressId] = useState('');
    const [customNetworkName, setCustomNetworkName] = useState('');

    useEffect(() => {
        async function loadDaa() {
            try {
                const url = 'https://chainid.network/chains.json';
                const response = await fetch(url);
                const json = await response.json();
                const networkNames: Array<string> = [];
                json.forEach((chain: IChain) => {
                    if (networkNames.includes(chain.network)) {
                        networkNames.push(chain.network);
                    }
                    if (chain) {
                        chain.rpc = chain.rpc.map(rp => {
                            if (rp === 'https://mainnet.infura.io/v3/${INFURA_API_KEY}') {
                                return `https://mainnet.infura.io/v3/${infuraApiKey}`;
                            } else if (rp === "wss://mainnet.infura.io/ws/v3/${INFURA_API_KEY}") {
                                return `wss://mainnet.infura.io/ws/v3/${infuraApiKey}`;
                            } else if ("https://ropsten.infura.io/v3/${INFURA_API_KEY}") {
                                return `https://ropsten.infura.io/v3/${infuraApiKey}`;
                            } else if ("wss://ropsten.infura.io/ws/v3/${INFURA_API_KEY}") {
                                return `wss://ropsten.infura.io/ws/v3/${infuraApiKey}`;
                            } else if ("https://rinkeby.infura.io/v3/${INFURA_API_KEY}") {
                                return `https://rinkeby.infura.io/v3/${infuraApiKey}`;
                            } else if ("wss://rinkeby.infura.io/ws/v3/${INFURA_API_KEY}") {
                                return `wss://rinkeby.infura.io/ws/v3/${infuraApiKey}`;
                            } else if ("https://kovan.infura.io/v3/${INFURA_API_KEY}") {
                                return `https://kovan.infura.io/v3/${infuraApiKey}`;
                            } else if ("wss://kovan.infura.io/ws/v3/${INFURA_API_KEY}") {
                                return `wss://kovan.infura.io/ws/v3/${infuraApiKey}`;
                            } else if ("https://mainnet.infura.io/v3/${INFURA_API_KEY}") {
                                return `https://arbitrum-mainnet.infura.io/v3/${infuraApiKey}`;
                            } else if ("https://arb-mainnet.g.alchemy.com/v2/${ALCHEMY_API_KEY}") {
                                return `https://eth-mainnet.alchemyapi.io/v2/${alchemyApiKey}`
                            }
                            return rp;
                        });
                    }
                });
                setNetworks(networkNames);
                setChains(json);
            } catch (error) {
            }
        }
        if (chains.length === 0) {
            loadDaa();
        }
    }, [alchemyApiKey, chains, infuraApiKey]);

    const onNetworkSelect = (val: any) => {
        setSelectNetwork(val)
        const filterChains = chains.filter(f => f.network === val)
            .map(m => { return { value: m.name, text: `${m.name}-${m.chainId}-${m.nativeCurrency.symbol}`, selected: m.name === selectedChain } });
        setFilterChains(filterChains);
    };

    const onChainSelect = (val: any) => {
        setSelectedChain(val);
        if (onChange) {
            const chain = chains.find(f => f.name === val);
            onChange(chain);
        }
    };

    return (
        <div>
            {showCustomNetworkOption && <div className="margin-vertical">
                <div className="wallet-label">
                    <label className="text-primary"> Select Network</label>
                </div>
                <div className="wallet-control">
                    <select onChange={onNetworkSelect} value={selectedNetwork}>
                        {networks.map(m => <option key={m} value={m}>{m}</option>)}
                    </select>
                </div>
            </div>
            }
            {showCustomNetworkOption && <div className="margin-vertical">
                <div className="wallet-label">
                    <label className="text-primary"> Select Chain</label>
                </div>
                <div className="wallet-control">
                    <select onChange={onChainSelect} value={selectedChain}>
                        {filterChains.map(m => <option key={m.value} value={m.value}>{m.text}</option>)}
                    </select>
                </div>
            </div>
            }

            {enableCustomRpc && <div className="margin-vertical">
                <div className="wallet-label">
                    <label className="text-primary"> Custom RPC Config</label>
                </div>
                <div className="wallet-control">
                    <input type="checked" checked={showCustomNetworkOption} onChange={e => setShowCustomNetworkOption(e.target.checked)} />
                </div>
            </div>
            }
            {showCustomNetworkOption && <div>
                <div className="margin-vertical">
                    <div className="wallet-label">
                        <label color="primary"> Enter Network URL</label>
                    </div>
                    <div className="wallet-control">
                        <input value={customNetworkUrl} type='url' inputMode="url" placeholder="RPC URL" onChange={(e) => setCustomNetworkUrl(e.target.value)} />
                    </div>
                </div>
                <div className="margin-vertical">
                    <div className="wallet-label">
                        <label color="primary"> Enter Network Name</label>
                    </div>
                    <div className="wallet-control">
                        <input value={customNetworkName} type="text" inputMode="text" placeholder="Network Name - mainnet,testnet" onChange={(e) => setCustomNetworkName(e.target.value)} />
                    </div>
                </div>
                <div className="margin-vertical">
                    <div className="wallet-label">
                        <label color="primary"> Enter Chain Id</label>
                    </div>
                    <div className="wallet-control">
                        <input value={customChainId} type="number" placeholder="Chain ID number" onChange={(e) => setCustomChainId(e.target.value)} />
                    </div>
                </div>
                <div className="margin-vertical">
                    <div className="wallet-label">
                        <label color="primary"> Enter Address Id</label>
                    </div>
                    <div className="wallet-control">
                        <input value={customAddressId} type="text" placeholder="Address Id" onChange={(e) => setCustomAddressId(e.target.value)} />
                    </div>
                </div>
                <div className="margin-vertical wallet-control">
                    <button
                        className='primary'
                        onClick={() => {
                            const obj = {
                                network: selectedNetwork,
                                name: customNetworkName,
                                rpc: [customNetworkUrl],
                                chainId: customChainId,
                                networkId: customChainId || selectedNetwork,
                                addressId: customAddressId,
                                isCustom: true
                            };
                            if (onChange) {
                                onChange(obj);
                            }
                        }} >Confirm Custom Config</button>
                </div>
            </div>}
        </div>
    )
}

export default NetworkPicker
