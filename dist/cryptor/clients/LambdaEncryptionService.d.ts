import { EncryptedData, HexString, Injectable } from 'ferrum-plumbing';
/**
 * This should NOT be used in a browser or mobile app.
 */
export declare class LambdaEncryptionService implements Injectable {
    private readonly lambdaSecret;
    private readonly endpoint;
    constructor(endpoint: string, lambdaSecret: string);
    private call;
    /**
     * Encrypts a data. Needs a buffer and returns @EncryptedData
     */
    encrypt(data: HexString): Promise<EncryptedData>;
    /**\
     * Decrypts the data. Returns a buffer
     */
    decrypt(enc: EncryptedData): Promise<HexString>;
    __name__(): string;
}
//# sourceMappingURL=LambdaEncryptionService.d.ts.map