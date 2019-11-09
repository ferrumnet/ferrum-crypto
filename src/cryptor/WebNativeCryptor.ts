import { Algo, CryptorError, CryptorService, KeyEncryptionProvider } from './CryptorService';
import {EncryptedData, HexString, Injectable, InternalReactNativeEncryptedKey} from 'ferrum-plumbing';
import AES from 'crypto-js/aes';
import encUtf8 from 'crypto-js/enc-utf8';
import encHex from 'crypto-js/enc-hex';
import SHA256 from 'crypto-js/sha256';
import SHA3 from 'crypto-js/sha3';
import CryptoJS, { WordArray, lib, enc } from 'crypto-js';
import RIPEMD160 from "crypto-js/ripemd160"
import bs58 from 'bs58';

export function utf8ToHex(hexStr: HexString): HexString {
  return encHex.stringify(encUtf8.parse(hexStr));
}

export function hexToUtf8(hexStr: HexString): string {
  return encUtf8.stringify(encHex.parse(hexStr));
}

export function arrayBufferToHex(ab: Uint8Array): HexString {
  return encHex.stringify(lib.WordArray.create(ab));
}

export function ripemd160(hex: HexString): string {
  return RIPEMD160(encHex.parse(hex)).toString();
}

export function randomBytes(size: number): HexString {
  return encHex.stringify(lib.WordArray.random(size));
}

export function hexToArrayBuffer(hex: HexString): Uint8Array {
  // @ts-ignore
  hex = hex.toString(16);

  hex = hex.replace(/^0x/i,'');

  let bytes: any[] = [];
  for (let c = 0; c < hex.length; c += 2)
    bytes.push(parseInt(hex.substr(c, 2), 16));
  // @ts-ignore
  return new Uint8Array(bytes);
}

/**
 * Convert a hex string to a byte array
 *
 * Note: Implementation from crypto-js
 *
 * @method hexToBytes
 * @param {string} hex
 * @return {Array} the byte array
 */
export function hexToBase64(hex: HexString): string {
  return enc.Base64.stringify(encHex.parse(hex));
}

export function hexToBase58(hex: HexString): string {
  return bs58.encode(Buffer.from(hex, 'hex'));
}

export function base64ToHex(base64: string): HexString {
  return encHex.stringify(enc.Base64.parse(base64));
}

function keyToHex(key: InternalReactNativeEncryptedKey): HexString {
  const json = JSON.stringify(key);
  return encHex.stringify(encUtf8.parse(json));
}

function keyHexToObject(hex: HexString) {
  // parse the key
  const keyStr = hexToUtf8(hex);
  return JSON.parse(keyStr) as InternalReactNativeEncryptedKey;
}

export async function sha256(hexData: string): Promise<HexString> {
  return sha256sync(hexData);
}

export function sha256sync(hexData: string): HexString {
  const dataWa = encHex.parse(hexData);
  const hash: WordArray = SHA256(dataWa);
  return hash.toString(encHex);
}


export function sha3(hexData: string): HexString {
  const dataWa = encHex.parse(hexData);
  const hash: WordArray = SHA3(dataWa, { outputLength: 256 });
  return hash.toString(encHex);
}

export class WebNativeCryptor implements CryptorService, Injectable {
  constructor(private keyProvider: KeyEncryptionProvider) { }

  protected async decryptKey(key: InternalReactNativeEncryptedKey, overrideKey?: HexString) {
    const kek = overrideKey || this.keyProvider.getKey(key.keyId);
    const msg = encHex.parse(key.key);
    const decKey = AES.decrypt(enc.Base64.stringify(msg), kek);
    return decKey.toString();
  }

  protected async newKey(overrideKey?: HexString):
      Promise<{ encryptedKey: HexString, keyId: string, unEncrypedKey: string }> {
    const keyId = this.keyProvider.newKeyId();
    const kek = overrideKey || this.keyProvider.getKey(keyId);
    const randomKeyWa = lib.WordArray.random(Algo.SIZES.KEY_SIZE);
    const encKey = AES.encrypt(randomKeyWa, kek);
    const encKeyB64 = encKey.toString();
    const encKeyHex = enc.Hex.stringify(enc.Base64.parse(encKeyB64));
    return { encryptedKey: encKeyHex, keyId, unEncrypedKey: encHex.stringify(randomKeyWa) };
  }

  async decryptToHex(encData: EncryptedData, overrideKey?: string): Promise<HexString> {
    const key = keyHexToObject(encData.key);
    if (key.algo !== Algo.ENCRYPTION.AES) {
      throw new CryptorError(`Key algorithm "${key.algo}" unsupported`);
    }
    const msg = encHex.parse(encData.data);
    const unEnvelopedKey = await this.decryptKey(key, overrideKey);
    const encRes = AES.decrypt(enc.Base64.stringify(msg), unEnvelopedKey);
    return encRes.toString(encHex);
  }

  async encryptHex(data: HexString, overrideKey?: HexString): Promise<EncryptedData> {
    const newKey = await this.newKey(overrideKey);
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

  __name__(): string { return 'WebNativeCryptor'; }
}
