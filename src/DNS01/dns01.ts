import { makeCall } from "../utils/api";

 async function verifyDNS01(domain:URL,txt:string) {
    const resolveDNSURL = `https://dns.google/resolve?name=${new URL(domain).host}&type=TXT`
    const actuaTxt = txt    
    const res = await makeCall(resolveDNSURL, 'GET');
    const data = res.data;
    const txtRecords = data.Answer.filter((record: any) => record.type === 16);
    const txtRecord = txtRecords.find((record: any) => record.data.includes(txt));
    if (!txtRecord) {
        return {
            verified: false,
            error: new Error('DNS TXT record not found')

        }
    }
    if (txtRecord.data !== actuaTxt) {
        return {
            verified: false,
            error: new Error('DNS TXT record not found')

        }
    }

    return {
        TXT: txtRecord,
        verified: true,
    }




}

export {
    verifyDNS01
}