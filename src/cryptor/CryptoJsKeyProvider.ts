import {KeyEncryptionProvider} from "./CryptorService";
import {HexString, Injectable} from "ferrum-plumbing";
import {randomBytes} from "./WebNativeCryptor";

export class CryptoJsKeyProvider implements KeyEncryptionProvider, Injectable {
    getKey(keyId?: string): HexString {
        throw new Error('Not implemented');
    }

    newKeyId(): string {
        throw new Error('Not implemented');
    }

    async randomHex(keySize?: number): Promise<HexString> {
        return randomBytes(keySize || 32);
    }

    __name__(): string {return 'CryptoJsKeyProvider';}
}
