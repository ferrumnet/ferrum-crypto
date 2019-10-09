import { CryptorService } from './CryptorService';
import { EncryptedData, HexString, Injectable } from 'ferrum-plumbing';
import { sha256 } from './WebNativeCryptor';
import { LambdaEncryptionService } from './clients/LambdaEncryptionService';

/**
 * Uses a cloud service to do all crypto-related tasks. No keys are managed locally
 */
export class CloudCryptor implements CryptorService, Injectable {
  constructor(private encSvc: LambdaEncryptionService) { }

  async decryptToHex(enc: EncryptedData): Promise<HexString> {
    return await this.encSvc.decrypt(enc);
  }

  async encryptHex(data: string): Promise<EncryptedData> {
    return await this.encSvc.encrypt(data);
  }

  async sha256(hexData: string): Promise<HexString> {
    return sha256(hexData);
  }

  __name__(): string { return 'CloudCryptor'; }
}
