import { Algo, CryptorError, CryptorService, KeyEncryptionProvider } from './CryptorService';
import { EncryptedData, HexString, InternalReactNativeEncryptedKey } from 'ferrum-plumbing';
import AES from 'crypto-js/aes';
import encUtf8 from 'crypto-js/enc-utf8';
import encHex from 'crypto-js/enc-hex';
import SHA256 from 'crypto-js/sha256';
import { WordArray, lib } from 'crypto-js';

function hexToUtf8(hexStr: HexString): string {
  return encUtf8.stringify(encHex.parse(hexStr));
}

function keyToHex(key: InternalReactNativeEncryptedKey): string {
  const json = JSON.stringify(key);
  return encHex.stringify(encUtf8.parse(json));
}

function keyHexToObject(hex: HexString) {
  // parse the key
  const keyStr = hexToUtf8(hex);
  return JSON.parse(keyStr) as InternalReactNativeEncryptedKey;
}

export async function sha256(hexData: string): Promise<HexString> {
  const dataWa = encHex.parse(hexData);
  const hash: WordArray = SHA256(dataWa);
  return hash.toString(encHex);
}

export class WebNativeCryptor implements CryptorService {
  constructor(private keyProvider: KeyEncryptionProvider) { }

  private decryptKey(key: InternalReactNativeEncryptedKey) {
    const kek = this.keyProvider.getKey(key.keyId);
    const kekWa = encHex.parse(kek);
    const msg = encHex.parse(key.key);
    const decKey = AES.decrypt(msg, kekWa);
    return decKey.toString(encHex);
  }

  private newKey(): { encryptedKey: HexString, keyId: string } {
    const keyId = this.keyProvider.newKeyId();
    const kek = this.keyProvider.getKey(keyId);
    const kekWa = encHex.parse(kek);
    const randomKeyWa = lib.WordArray.random(Algo.SIZES.KEY_SIZE);
    const encKey = AES.encrypt(randomKeyWa, kekWa);
    return { encryptedKey: encKey.toString(encHex), keyId };
  }

  async decryptToHex(enc: EncryptedData): Promise<HexString> {
    const key = keyHexToObject(enc.key);
    if (key.algo !== Algo.ENCRYPTION.AES) {
      throw new CryptorError(`Key algorithm "${key.algo}" unsupported`);
    }
    const msg = encHex.parse(enc.data);
    const unEnvelopedKey = this.decryptKey(key);
    const encRes = AES.decrypt(msg, encHex.parse(unEnvelopedKey));
    return encRes.toString(encHex);
  }

  async encryptHex(data: HexString): Promise<EncryptedData> {
    const newKey = this.newKey();
    const newKeyWa = encHex.parse(newKey.encryptedKey);
    const msg = encHex.parse(data);
    const res = AES.encrypt(msg, newKeyWa);
    const encMsg = res.toString(encHex);
    return {
      data: encMsg,
      key: keyToHex({
        key: newKey.encryptedKey,
        keyId: newKey.keyId,
        algo: Algo.ENCRYPTION.AES,
      }),
    };
  }

  async sha256(hexData: string): Promise<HexString> {
    return sha256(hexData);
  }
}
