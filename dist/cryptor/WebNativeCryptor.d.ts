import { CryptorService, KeyEncryptionProvider } from './CryptorService';
import { EncryptedData, HexString, Injectable, InternalReactNativeEncryptedKey } from 'ferrum-plumbing';
export declare function utf8ToHex(hexStr: HexString): HexString;
export declare function hexToUtf8(hexStr: HexString): string;
export declare function arrayBufferToHex(ab: Uint8Array): HexString;
export declare function ripemd160(hex: HexString): string;
export declare function randomBytes(size: number): HexString;
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
export declare function hexToBase58(hex: HexString): string;
export declare function base64ToHex(base64: string): HexString;
export declare function sha256(hexData: string): Promise<HexString>;
export declare function sha256sync(hexData: string): HexString;
export declare function sha1(hexData: HexString): HexString;
export declare function sha3(hexData: string): HexString;
export declare class WebNativeCryptor implements CryptorService, Injectable {
    private keyProvider;
    constructor(keyProvider: KeyEncryptionProvider);
    protected decryptKey(key: InternalReactNativeEncryptedKey, overrideKey?: HexString): Promise<string>;
    protected newKey(overrideKey?: HexString): Promise<{
        encryptedKey: HexString;
        keyId: string;
        unEncrypedKey: string;
    }>;
    decryptToHex(encData: EncryptedData, overrideKey?: string): Promise<HexString>;
    encryptHex(data: HexString, overrideKey?: HexString): Promise<EncryptedData>;
    sha256(hexData: string): Promise<HexString>;
    __name__(): string;
}
//# sourceMappingURL=WebNativeCryptor.d.ts.map