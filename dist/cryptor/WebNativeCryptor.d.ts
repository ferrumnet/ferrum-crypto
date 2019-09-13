import { CryptorService, KeyEncryptionProvider } from './CryptorService';
import { EncryptedData, HexString } from 'ferrum-plumbing';
export declare function utf8ToHex(hexStr: HexString): string;
export declare function hexToUtf8(hexStr: HexString): string;
export declare function arrayBufferToHex(ab: Uint8Array): string;
export declare function hexToBase64(hex: HexString): string;
export declare function sha256(hexData: string): Promise<HexString>;
export declare class WebNativeCryptor implements CryptorService {
    private keyProvider;
    constructor(keyProvider: KeyEncryptionProvider);
    private decryptKey;
    private newKey;
    decryptToHex(encData: EncryptedData): Promise<HexString>;
    encryptHex(data: HexString): Promise<EncryptedData>;
    sha256(hexData: string): Promise<HexString>;
}
//# sourceMappingURL=WebNativeCryptor.d.ts.map