declare type Network = number | {
    chainId: string;
    [key: string]: any;
};
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
        networks?: Network[];
        chainId?: number;
        supportedChainIds?: number[];
        dAppId?: string;
        dAppName?: string;
        dAppEmail?: string;
        dAppLogoUrl?: string;
        dAppUrl?: string;
        dAppSecret?: string;
    }
}