import { KeyEncryptionProvider } from "./CryptorService";
import { HexString, Injectable } from "ferrum-plumbing";
export declare class CryptoJsKeyProvider implements KeyEncryptionProvider, Injectable {
    getKey(keyId?: string): HexString;
    newKeyId(): string;
    randomHex(keySize?: number): Promise<HexString>;
    __name__(): string;
}
//# sourceMappingURL=CryptoJsKeyProvider.d.ts.map