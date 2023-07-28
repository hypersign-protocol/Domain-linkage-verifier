import { IfinalResult, Verify } from "./verification/verify";

import {verifyDNS01} from './DNS01/dns01'
export default class DomainLinkageVerifier {
    private domain: URL;
    constructor(domain: string) {
        
        if(!domain.startsWith('http')){
            domain = 'https://' + domain;
        }

        this.domain = new URL(domain);
    }
    async verify(did: string): Promise<any> {
                const verify = new Verify(did, this.domain.origin);
        return await verify.verify();
    }
    async verifyDnsTxtRecord(url:URL, txt:string): Promise<any> {        
        return await verifyDNS01(url,txt );
    }

    
}