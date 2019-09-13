import { CryptorService, KeyEncryptionProvider } from './CryptorService';
import { EncryptedData, HexString } from 'ferrum-plumbing';
export declare function sha256(hexData: string): Promise<HexString>;
export declare class WebNativeCryptor implements CryptorService {
    private keyProvider;
    constructor(keyProvider: KeyEncryptionProvider);
    private decryptKey;
    private newKey;
    decryptToHex(enc: EncryptedData): Promise<HexString>;
    encryptHex(data: HexString): Promise<EncryptedData>;
    sha256(hexData: string): Promise<HexString>;
}
//# sourceMappingURL=WebNativeCryptor.d.ts.map