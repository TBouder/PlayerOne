import { ConnectorUpdate } from '@web3-react/types';
import { AbstractConnector } from '@web3-react/abstract-connector';
import { IWalletConnectProviderOptions } from '@walletconnect/types';
export declare const URI_AVAILABLE = "URI_AVAILABLE";
export declare class UserRejectedRequestError extends Error {
    constructor();
}
export declare class WalletConnectConnector extends AbstractConnector {
    private readonly opts;
    walletConnectProvider?: any;
    constructor(opts: IWalletConnectProviderOptions);
    private handleChainChanged;
    private handleAccountsChanged;
    private handleDisconnect;
    activate(): Promise<ConnectorUpdate>;
    getProvider(): Promise<any>;
    getChainId(): Promise<number | string>;
    getAccount(): Promise<null | string>;
    deactivate(): void;
    close(): Promise<void>;
}
