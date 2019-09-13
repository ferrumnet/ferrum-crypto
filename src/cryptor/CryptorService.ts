import { EncryptedData, HexString } from 'ferrum-plumbing';

export class CryptorError extends Error {}

export class Algo {
  static SIZES = {
    KEY_SIZE: 32,
  };
  static ENCRYPTION = {
    AES: 'aes',
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
