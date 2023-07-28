/* @ts-ignore */
import {encode,decode} from 'base58-universal'
const MULTICODEC_ED25519_PUB_HEADER= new Uint8Array([0xed, 0x01])
function _encodeMbKey(header:Uint8Array, key:Uint8Array) {
    const mbKey = new Uint8Array(header.length + key.length);
    mbKey.set(header);
    mbKey.set(key, header.length);
    return "z" + encode(mbKey);
  }


 function convertPublickeyToMultibaseEd25519VerificationKey(publicKey: string) {
    const publicKeyBytes = decode(publicKey.substring(1));
    const publicKeyMultibase = _encodeMbKey(MULTICODEC_ED25519_PUB_HEADER, publicKeyBytes);
    
    return publicKeyMultibase;

}


export {convertPublickeyToMultibaseEd25519VerificationKey}