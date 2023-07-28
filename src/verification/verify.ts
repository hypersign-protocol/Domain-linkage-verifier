
/* @ts-ignore */

import { verifyCredential, issue } from '@digitalbazaar/vc'

/* @ts-ignore */

import { purposes } from 'jsonld-signatures'
/* @ts-ignore */

import jsonld from 'jsonld'


/* @ts-ignore */
import { Ed25519Signature2020 } from '@digitalbazaar/ed25519-signature-2020';
/* @ts-ignore */

import { Ed25519VerificationKey2020 } from '@digitalbazaar/ed25519-verification-key-2020';
import { makeCall } from '../utils/api';
import { AxiosResponse } from 'axios';
import { DNS01_PREFIX, convertPublickeyToMultibaseEd25519VerificationKey } from '../utils';

export interface IfinalResult {
    verified: boolean;
    results: any[];
}


export class Verify {
    private suite: Ed25519Signature2020;
    private domain: URL;
    private did: string;
    private finalResult: IfinalResult | undefined;
    constructor(did: string, domain: string) {
        this.suite = new Ed25519Signature2020();
        this.domain = new URL(domain);

        Verify.validateDID(did)
        this.did = did;

    }
    private static validateDID(did: string) {

        if (!did.startsWith('did:hid:')) {
            throw new Error('DID is invalid');
        }
        return true;
    }
    async verify(): Promise<any> {
        this.finalResult = {
            verified: true,
            results: []
        } as IfinalResult;

        const resp1: AxiosResponse = await this.resolveDid();
        const did = resp1.data;


        const resp2: AxiosResponse = await this.resolveDidConfig();
        const didConfig = resp2.data;
        //4 The implementer MUST perform DID resolution on the DID specified in the Issuer of the Domain Linkage Credential to obtain the associated DID document.

        const credential = didConfig.linked_dids[0];
        if (this.did !== did.id || this.did !== credential.issuer) {

            this.finalResult.verified = false;
            this.finalResult.results.push({
                error: new Error('Resource DID and Issuer DID are not same'),
                proof: undefined,
                purposeResult: undefined,
                verificationMethod: undefined,
                verified: false

            })
        }
        // https://identity.foundation/.well-known/resources/did-configuration/#did-configuration-resource-verification
        if (did.id !== credential.issuer) {
            this.finalResult.results.push({
                error: new Error('Passed DID and Issuer DID are not same'),
                proof: undefined,
                purposeResult: undefined,
                verificationMethod: undefined,
                verified: false

            })
        }
        //1 The credentialSubject.id MUST be a DID, and the value MUST be equal to both the Subject and Issuer of the Domain Linkage Credential.

        if (credential.credentialSubject.id !== credential.issuer) {
            this.finalResult.results.push({
                error: new Error('Credential Subject ID and Issuer DID are not same'),
                proof: undefined,
                purposeResult: undefined,
                verificationMethod: undefined,
                verified: false

            })
        }
        //3 The credentialSubject.origin property MUST be present, and its value MUST match the origin the resource was requested from.

        if (credential.credentialSubject.origin !== this.domain.host) {

            this.finalResult.results.push({
                error: new Error('Resource DID and Issuer DID are not same'),
                proof: undefined,
                purposeResult: undefined,
                verificationMethod: undefined,
                verified: false

            })
        }

        const verificationMethodId = credential.proof.verificationMethod;
        const verificationMethod = did.verificationMethod.find((method: any) => method.id === verificationMethodId);

        this.suite = new Ed25519Signature2020({
            key: await new Ed25519VerificationKey2020({
                id: verificationMethod.id,
                controller: verificationMethod.controller,
                publicKeyMultibase: convertPublickeyToMultibaseEd25519VerificationKey(verificationMethod.publicKeyMultibase)
            })
        })


        const result = await this._verifyCredential({
            credential: credential,
            suite: this.suite,
            purpose: new purposes.AssertionProofPurpose({
                controller: {
                    '@context': 'https://w3id.org/security/v2',
                    id: this.did,
                    assertionMethod: [verificationMethodId]
                }
            }),
            documentLoader: async (url: string) => {
                return await jsonld.documentLoader(url)

            }
        });



        this.finalResult.results.push(result.results[0]);
        for (const result of this.finalResult.results) {
            if (!result.verified) {
                this.finalResult.verified = false;
                break;
            }
        }




        return this.finalResult;



    }

    private async _verifyCredential({ credential, suite, purpose, documentLoader }: {
        credential: any,
        suite: Ed25519Signature2020,
        purpose: purposes,
        documentLoader: Function

    }) {

        //6 The Domain Linkage Credential must be in either a Linked Data Proof Format or JSON Web Token Proof Format
        return await verifyCredential({
            credential: credential,
            suite: suite,
            purpose: purpose,
            documentLoader: documentLoader
        });
    }


    private async resolveDid() {
        const resolverURL = this.domain + '.well-known/did.json';
        return await makeCall(resolverURL, 'GET',);

    }

    private async resolveDidConfig() {
        const resolverURL = this.domain + '.well-known/did-configuration.json';
        return await makeCall(resolverURL, 'GET',);

    }


   



}