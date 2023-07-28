export interface IfinalResult {
    verified: boolean;
    results: any[];
}
export declare class Verify {
    private suite;
    private domain;
    private did;
    private finalResult;
    constructor(did: string, domain: string);
    private static validateDID;
    verify(): Promise<any>;
    private _verifyCredential;
    private resolveDid;
    private resolveDidConfig;
}
//# sourceMappingURL=verify.d.ts.map