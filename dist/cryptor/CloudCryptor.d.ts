import { CryptorService } from './CryptorService';
import { EncryptedData, HexString, Injectable } from 'ferrum-plumbing';
import { LambdaEncryptionService } from './clients/LambdaEncryptionService';
/**
 * Uses a cloud service to do all crypto-related tasks. No keys are managed locally
 */
export declare class CloudCryptor implements CryptorService, Injectable {
    private encSvc;
    constructor(encSvc: LambdaEncryptionService);
    decryptToHex(enc: EncryptedData): Promise<HexString>;
    encryptHex(data: string): Promise<EncryptedData>;
    sha256(hexData: string): Promise<HexString>;
    __name__(): string;
}
//# sourceMappingURL=CloudCryptor.d.ts.map