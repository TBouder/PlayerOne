export declare type SendReturnResult = {
    result: any;
};
export declare type SendReturn = any;
export declare type Send = (method: string, params?: any[]) => Promise<SendReturnResult | SendReturn>;
export declare type SendOld = ({ method }: {
    method: string;
}) => Promise<SendReturnResult | SendReturn>;
export declare type SendAsync = (request: {
    method: string;
    params?: Array<any>;
}, callback: (error: any, response: any) => void) => void;
export declare type Request = (request: {
    method: string;
    params?: Array<any>;
}) => Promise<any>;
