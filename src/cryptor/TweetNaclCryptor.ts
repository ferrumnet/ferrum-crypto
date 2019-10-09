
import {AsymetricCryptorService, AsymetricKeyPair, AsymetricSharedKey} from './CryptorService';
import { HexString } from 'ferrum-plumbing';
import {arrayBufferToHex, hexToArrayBuffer} from './WebNativeCryptor';
import nacl from 'tweetnacl';

export class TweetNaclCryptor implements AsymetricCryptorService {

  keyPair(secret: string): AsymetricKeyPair {
    const secretBuffer= hexToArrayBuffer(secret);
    const keyPair = nacl.box.keyPair.fromSecretKey(secretBuffer);
    return {
      publicKey: arrayBufferToHex(keyPair.publicKey),
      secretKey: arrayBufferToHex(keyPair.secretKey),
    } as AsymetricKeyPair;
  }

  async decrypt(encMessage: HexString, nonce: HexString, sharedKey: AsymetricSharedKey):
  Promise<HexString> {
    const msgBuffer = hexToArrayBuffer(encMessage);
    const nonceBuffer = hexToArrayBuffer(nonce);
    const publicKey = hexToArrayBuffer(sharedKey.remotePublicKey);
    const secretKey = hexToArrayBuffer(sharedKey.localSecretKey);
    const payload = nacl.box.open(msgBuffer, nonceBuffer,
        publicKey, secretKey);
    if (!payload) {
      throw new Error('TweetNaclCryptor.decrypt: Error decrypting message. There is no payload decrypted!');
    }
    return arrayBufferToHex(payload);
  }

  async encrypt(message: HexString, nonce: HexString, sharedKey: AsymetricSharedKey): Promise<HexString> {
    const messageBuffer = hexToArrayBuffer(message);
    const nonceBuffer = hexToArrayBuffer(nonce);
    const publicKey = hexToArrayBuffer(sharedKey.remotePublicKey);
    const secretKey = hexToArrayBuffer(sharedKey.localSecretKey);
    const payload = nacl.box(messageBuffer, nonceBuffer, publicKey, secretKey);
    if (!payload) {
      throw new Error('TweetNaclCryptor.encrypt: Error encrypting message. There is no payload encrypted!');
    }

    return arrayBufferToHex(payload!);
  }
}
