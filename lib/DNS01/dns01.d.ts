declare function verifyDNS01(domain: URL, txt: string): Promise<{
    verified: boolean;
    error: Error;
    TXT?: undefined;
} | {
    TXT: any;
    verified: boolean;
    error?: undefined;
}>;
export { verifyDNS01 };
//# sourceMappingURL=dns01.d.ts.map