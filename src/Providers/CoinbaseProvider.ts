import { post } from '@wholelot/util/lib/fetchHelper';
class CoinbaseProvider {
    props: any;
    constructor(props: any) {
        this.props = props;

    }

    activate = async () => {
        try {
            const { dAppId, scope, oAuthUrl, clientId, clientSecret, authKey, callbackUrl } = this.props;
            const split = window.location.href.split('code=');
            const redirect_uri = window.origin.includes('capacitor://') ? 'urn:ietf:wg:oauth:2.0:oob' : `${window.location.host}${callbackUrl}`;
            if (split && split[1]) {
                const code = split[1];
                if (code) {
                    const data = {
                        oAuthAppName: 'coinbase',
                        oAuthAppId: dAppId,
                        grantType: 'authorization_code',
                        tokenType: 'Bearer',
                        code,
                        scope,
                        headerParams: { 'CB-VERSION': '2021-09-25' },
                        routes: [
                            {
                                url: "v2/user",
                                saveObjName: 'user',
                                resultParamName: 'data',
                            },
                            {
                                url: "v2/accounts",
                                resultParamName: 'data',
                                saveObjName: 'accounts',
                            }
                        ],
                        redirect_uri: `${window.location.protocol}//${redirect_uri}`
                    };
                    const results = await post(oAuthUrl, data, { clientId, clientSecret, authKey });
                    if (results) {
                        localStorage.setItem('coinbase-user', JSON.stringify(results));
                    }
                    return results;
                }
            }
        } catch (error: any) {
            throw error;
        }
    };

    getAddresses = async (accountId: string) => {
        if (!accountId) {
            throw new Error('Account Id required');
        }
        const storageUser = localStorage.getItem('coinbase-user');
        if (storageUser) {
            const coinbaseObj = JSON.parse(storageUser);
            if (coinbaseObj) {
                const url = `https://api.coinbase.com/v2/accounts/${accountId}/addresses`;
                const headers = {
                    Authorization: `Bearer ${coinbaseObj.access_token}`,
                    'CB-VERSION': '2021-09-25'
                };
                try {
                    const json: any = await fetch(url, { headers });
                    const response: any = await json.json();
                    if (response) {
                        return response.data;
                    }
                } catch (error: any) {
                    console.log(error);
                    throw new Error(error);
                }
            }
        }
    };
}
export default CoinbaseProvider;