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
exports.verifyDNS01 = void 0;
const api_1 = require("../utils/api");
function verifyDNS01(domain, txt) {
    return __awaiter(this, void 0, void 0, function* () {
        const resolveDNSURL = `https://dns.google/resolve?name=${new URL(domain).host}&type=TXT`;
        const actuaTxt = txt;
        console.log(resolveDNSURL);
        const res = yield (0, api_1.makeCall)(resolveDNSURL, 'GET');
        const data = res.data;
        const txtRecords = data.Answer.filter((record) => record.type === 16);
        const txtRecord = txtRecords.find((record) => record.data.includes(txt));
        if (!txtRecord) {
            return {
                verified: false,
                error: new Error('DNS TXT record not found')
            };
        }
        if (txtRecord.data !== actuaTxt) {
            return {
                verified: false,
                error: new Error('DNS TXT record not found')
            };
        }
        return {
            TXT: txtRecord,
            verified: true,
        };
    });
}
exports.verifyDNS01 = verifyDNS01;
//# sourceMappingURL=dns01.js.map