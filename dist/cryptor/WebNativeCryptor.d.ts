import { CryptorService, KeyEncryptionProvider } from './CryptorService';
import { EncryptedData, HexString, Injectable } from 'ferrum-plumbing';
export declare function utf8ToHex(hexStr: HexString): HexString;
export declare function hexToUtf8(hexStr: HexString): string;
export declare function arrayBufferToHex(ab: Uint8Array): HexString;
export declare function hexToArrayBuffer(hex: HexString): Uint8Array;
/**
 * Convert a hex string to a byte array
 *
 * Note: Implementation from crypto-js
 *
 * @method hexToBytes
 * @param {string} hex
 * @return {Array} the byte array
 */
export declare function hexToBase64(hex: HexString): string;
export declare function sha256(hexData: string): Promise<HexString>;
export declare class WebNativeCryptor implements CryptorService, Injectable {
    private keyProvider;
    constructor(keyProvider: KeyEncryptionProvider);
    private decryptKey;
    private newKey;
    decryptToHex(encData: EncryptedData): Promise<HexString>;
    encryptHex(data: HexString): Promise<EncryptedData>;
    sha256(hexData: string): Promise<HexString>;
    randomKey(): Promise<HexString>;
    __name__(): string;
}
//# sourceMappingURL=WebNativeCryptor.d.ts.map