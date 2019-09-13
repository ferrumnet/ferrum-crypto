import { CryptorService } from './CryptorService';
import { EncryptedData, HexString } from 'ferrum-plumbing';
import { sha256 } from './WebNativeCryptor';

/**
 * Uses a cloud service to do all crypto-related tasks. No keys are managed locally
 */
export class CloudCryptor implements CryptorService {
  decryptToHex(enc: EncryptedData): Promise<HexString> {
    throw new Error('Not implemented');
  }

  encryptHex(data: string): Promise<EncryptedData> {
    throw new Error('Not implemented');
  }

  async sha256(hexData: string): Promise<HexString> {
    return sha256(hexData);
  }
}
