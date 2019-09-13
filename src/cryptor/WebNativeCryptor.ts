import { Algo, CryptorError, CryptorService, KeyEncryptionProvider } from './CryptorService';
import { EncryptedData, HexString, InternalReactNativeEncryptedKey } from 'ferrum-plumbing';
import AES from 'crypto-js/aes';
import encUtf8 from 'crypto-js/enc-utf8';
import encHex from 'crypto-js/enc-hex';
import SHA256 from 'crypto-js/sha256';
import { WordArray, lib, enc } from 'crypto-js';

export function utf8ToHex(hexStr: HexString): string {
  return encHex.stringify(encUtf8.parse(hexStr));
}

export function hexToUtf8(hexStr: HexString): string {
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
    const msg = encHex.parse(key.key);
    const decKey = AES.decrypt(enc.Base64.stringify(msg), kek);
    return decKey.toString();
  }

  private newKey(): { encryptedKey: HexString, keyId: string, unEncrypedKey: string } {
    const keyId = this.keyProvider.newKeyId();
    const kek = this.keyProvider.getKey(keyId);
    const randomKeyWa = lib.WordArray.random(Algo.SIZES.KEY_SIZE);
    const encKey = AES.encrypt(randomKeyWa, kek);
    const encKeyB64 = encKey.toString();
    const encKeyHex = enc.Hex.stringify(enc.Base64.parse(encKeyB64));
    return { encryptedKey: encKeyHex, keyId, unEncrypedKey: encHex.stringify(randomKeyWa) };
  }

  async decryptToHex(encData: EncryptedData): Promise<HexString> {
    const key = keyHexToObject(encData.key);
    if (key.algo !== Algo.ENCRYPTION.AES) {
      throw new CryptorError(`Key algorithm "${key.algo}" unsupported`);
    }
    const msg = encHex.parse(encData.data);
    const unEnvelopedKey = this.decryptKey(key);
    const encRes = AES.decrypt(enc.Base64.stringify(msg), unEnvelopedKey);
    return encRes.toString(encHex);
  }

  async encryptHex(data: HexString): Promise<EncryptedData> {
    const newKey = this.newKey();
    const msg = encHex.parse(data);
    const res = AES.encrypt(msg, newKey.unEncrypedKey);
    const encMsgB64 = res.toString();
    const encMsg = enc.Hex.stringify(enc.Base64.parse(encMsgB64));
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
