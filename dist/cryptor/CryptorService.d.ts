import { EncryptedData, HexString } from 'ferrum-plumbing';
export declare class CryptorError extends Error {
}
export declare class Algo {
    static SIZES: {
        KEY_SIZE: number;
    };
    static ENCRYPTION: {
        AES: string;
    };
}
export interface KeyEncryptionProvider {
    getKey(keyId?: string): HexString;
    newKeyId(): string;
}
export interface CryptorService {
    sha256(hexData: HexString): Promise<HexString>;
    encryptHex(data: HexString): Promise<EncryptedData>;
    decryptToHex(enc: EncryptedData): Promise<HexString>;
}
export interface SigningService {
    sign(hashOfData: HexString): Promise<HexString>;
    verify(hashOfData: HexString, signature: HexString): Promise<boolean>;
}
//# sourceMappingURL=CryptorService.d.ts.map