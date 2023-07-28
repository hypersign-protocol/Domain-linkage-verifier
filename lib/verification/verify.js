"use strict";
/* @ts-ignore */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Verify = void 0;
const vc_1 = require("@digitalbazaar/vc");
/* @ts-ignore */
const jsonld_signatures_1 = require("jsonld-signatures");
/* @ts-ignore */
const jsonld_1 = __importDefault(require("jsonld"));
/* @ts-ignore */
const ed25519_signature_2020_1 = require("@digitalbazaar/ed25519-signature-2020");
/* @ts-ignore */
const ed25519_verification_key_2020_1 = require("@digitalbazaar/ed25519-verification-key-2020");
const api_1 = require("../utils/api");
const utils_1 = require("../utils");
class Verify {
    constructor(did, domain) {
        this.suite = new ed25519_signature_2020_1.Ed25519Signature2020();
        this.domain = new URL(domain);
        Verify.validateDID(did);
        this.did = did;
    }
    static validateDID(did) {
        if (!did.startsWith('did:hid:')) {
            throw new Error('DID is invalid');
        }
        return true;
    }
    verify() {
        return __awaiter(this, void 0, void 0, function* () {
            this.finalResult = {
                verified: true,
                results: []
            };
            const resp1 = yield this.resolveDid();
            const did = resp1.data;
            const resp2 = yield this.resolveDidConfig();
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
                });
            }
            // https://identity.foundation/.well-known/resources/did-configuration/#did-configuration-resource-verification
            if (did.id !== credential.issuer) {
                this.finalResult.results.push({
                    error: new Error('Passed DID and Issuer DID are not same'),
                    proof: undefined,
                    purposeResult: undefined,
                    verificationMethod: undefined,
                    verified: false
                });
            }
            //1 The credentialSubject.id MUST be a DID, and the value MUST be equal to both the Subject and Issuer of the Domain Linkage Credential.
            if (credential.credentialSubject.id !== credential.issuer) {
                this.finalResult.results.push({
                    error: new Error('Credential Subject ID and Issuer DID are not same'),
                    proof: undefined,
                    purposeResult: undefined,
                    verificationMethod: undefined,
                    verified: false
                });
            }
            //3 The credentialSubject.origin property MUST be present, and its value MUST match the origin the resource was requested from.
            if (credential.credentialSubject.origin !== this.domain.host) {
                this.finalResult.results.push({
                    error: new Error('Resource DID and Issuer DID are not same'),
                    proof: undefined,
                    purposeResult: undefined,
                    verificationMethod: undefined,
                    verified: false
                });
            }
            const verificationMethodId = credential.proof.verificationMethod;
            const verificationMethod = did.verificationMethod.find((method) => method.id === verificationMethodId);
            this.suite = new ed25519_signature_2020_1.Ed25519Signature2020({
                key: yield new ed25519_verification_key_2020_1.Ed25519VerificationKey2020({
                    id: verificationMethod.id,
                    controller: verificationMethod.controller,
                    publicKeyMultibase: (0, utils_1.convertPublickeyToMultibaseEd25519VerificationKey)(verificationMethod.publicKeyMultibase)
                })
            });
            const result = yield this._verifyCredential({
                credential: credential,
                suite: this.suite,
                purpose: new jsonld_signatures_1.purposes.AssertionProofPurpose({
                    controller: {
                        '@context': 'https://w3id.org/security/v2',
                        id: this.did,
                        assertionMethod: [verificationMethodId]
                    }
                }),
                documentLoader: (url) => __awaiter(this, void 0, void 0, function* () {
                    return yield jsonld_1.default.documentLoader(url);
                })
            });
            this.finalResult.results.push(result.results[0]);
            for (const result of this.finalResult.results) {
                if (!result.verified) {
                    this.finalResult.verified = false;
                    break;
                }
            }
            return this.finalResult;
        });
    }
    _verifyCredential({ credential, suite, purpose, documentLoader }) {
        return __awaiter(this, void 0, void 0, function* () {
            //6 The Domain Linkage Credential must be in either a Linked Data Proof Format or JSON Web Token Proof Format
            return yield (0, vc_1.verifyCredential)({
                credential: credential,
                suite: suite,
                purpose: purpose,
                documentLoader: documentLoader
            });
        });
    }
    resolveDid() {
        return __awaiter(this, void 0, void 0, function* () {
            const resolverURL = this.domain + '.well-known/did.json';
            return yield (0, api_1.makeCall)(resolverURL, 'GET');
        });
    }
    resolveDidConfig() {
        return __awaiter(this, void 0, void 0, function* () {
            const resolverURL = this.domain + '.well-known/did-configuration.json';
            return yield (0, api_1.makeCall)(resolverURL, 'GET');
        });
    }
}
exports.Verify = Verify;
//# sourceMappingURL=verify.js.map