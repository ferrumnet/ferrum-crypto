import { CryptorService } from './CryptorService';
import { EncryptedData, HexString } from 'ferrum-plumbing';
/**
 * Uses a cloud service to do all crypto-related tasks. No keys are managed locally
 */
export declare class CloudCryptor implements CryptorService {
    decryptToHex(enc: EncryptedData): Promise<HexString>;
    encryptHex(data: string): Promise<EncryptedData>;
    sha256(hexData: string): Promise<HexString>;
}
//# sourceMappingURL=CloudCryptor.d.ts.map