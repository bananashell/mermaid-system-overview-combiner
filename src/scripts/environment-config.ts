import { defaults } from "lodash";

const defaultConfig: Partial<typeof config> = {
    BaseAssetsPath: "/assets",
    ReduxDispatchedActionsOnErrorSize: 20
};

window.__env__ = defaults(window.__env__, defaultConfig);

const config = {
    BaseApiUrl: window.__env__.BaseApiUrl,
    BaseAssetsPath: window.__env__.BaseAssetsPath,
    LegacyPartnerBaseUrl: window.__env__.LegacyPartnerBaseUrl,
    ReduxDispatchedActionsOnErrorSize: +window.__env__.ReduxDispatchedActionsOnErrorSize,
    BaseEpiUrl: window.__env__.BaseEpiUrl
};

export default config;

declare global {
    interface Window {
        __env__: {
            LegacyPartnerBaseUrl: string;
            ReduxDispatchedActionsOnErrorSize: string;
            BaseApiUrl: string;
            BaseAssetsPath: string;
            BaseEpiUrl: string;
        };
        dataLayer: any;
        __DEV__?: boolean;
        __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: any;
    }
}
