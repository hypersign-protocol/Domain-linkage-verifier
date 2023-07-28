export default class DomainLinkageVerifier {
    private domain;
    constructor(domain: string);
    verify(did: string): Promise<any>;
    verifyDnsTxtRecord(url: URL, txt: string): Promise<any>;
}
//# sourceMappingURL=index.d.ts.map