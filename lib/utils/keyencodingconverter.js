"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertPublickeyToMultibaseEd25519VerificationKey = void 0;
/* @ts-ignore */
const base58_universal_1 = require("base58-universal");
const MULTICODEC_ED25519_PUB_HEADER = new Uint8Array([0xed, 0x01]);
function _encodeMbKey(header, key) {
    const mbKey = new Uint8Array(header.length + key.length);
    mbKey.set(header);
    mbKey.set(key, header.length);
    return "z" + (0, base58_universal_1.encode)(mbKey);
}
function convertPublickeyToMultibaseEd25519VerificationKey(publicKey) {
    const publicKeyBytes = (0, base58_universal_1.decode)(publicKey.substring(1));
    const publicKeyMultibase = _encodeMbKey(MULTICODEC_ED25519_PUB_HEADER, publicKeyBytes);
    return publicKeyMultibase;
}
exports.convertPublickeyToMultibaseEd25519VerificationKey = convertPublickeyToMultibaseEd25519VerificationKey;
//# sourceMappingURL=keyencodingconverter.js.map