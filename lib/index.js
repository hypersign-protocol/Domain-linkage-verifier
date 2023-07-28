"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const verify_1 = require("./verification/verify");
const dns01_1 = require("./DNS01/dns01");
class DomainLinkageVerifier {
    constructor(domain) {
        if (!domain.startsWith('http')) {
            domain = 'https://' + domain;
        }
        this.domain = new URL(domain);
    }
    verify(did) {
        return __awaiter(this, void 0, void 0, function* () {
            const verify = new verify_1.Verify(did, this.domain.origin);
            return yield verify.verify();
        });
    }
    verifyDnsTxtRecord(url, txt) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, dns01_1.verifyDNS01)(url, txt);
        });
    }
}
exports.default = DomainLinkageVerifier;
//# sourceMappingURL=index.js.map