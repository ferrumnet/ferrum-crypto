import { KeyEncryptionProvider } from './CryptorService';
import { arrayBufferToHex, hexToBase64, hexToUtf8, sha1, sha256, utf8ToHex, WebNativeCryptor,
} from './WebNativeCryptor';
import {HexString} from "ferrum-plumbing";

class DummyKeyProvider implements KeyEncryptionProvider {
  getKey(keyId?: string): string {
    return '39fc4d7daea55e95999e5a5e517710f6477917c6997ef552afd76a7b520c5209';
  }

  newKeyId(): string {
    return 'test_key_id';
  }

  async randomHex(keySize?: number): Promise<HexString> {
    return '';
  }
}

test('hash', async () => {
  const hex = await utf8ToHex('HELLO WORLD');
  const hash = await sha256(hex);
  expect(hash).toBe('787ec76dcafd20c1908eb0936a12f91edd105ab5cd7ecc2b1ae2032648345dff');
});

test('encrypt then decrypt', async () => {
  const msg = 'HELLO WORLD!';
  const data = await utf8ToHex(msg);
  const cryptor = new WebNativeCryptor(new DummyKeyProvider());
  const encrypted = await cryptor.encryptHex(data);
  const decrpted = await cryptor.decryptToHex(encrypted);
  const decryptedMsg = hexToUtf8(decrpted);
  expect(decryptedMsg).toBe(msg);
});

test('array buffer to hex', () => {
  // tslint:disable-next-line:no-magic-numbers
  const ab = new Uint8Array([72, 69, 76, 76, 79, 33]);
  const hex = arrayBufferToHex(ab);
  const text = hexToUtf8(hex);
  expect(text).toBe('HELLO!');
});

test('hex to b64', () => {
  const msg = 'testing the sha1';
  const msgHex = utf8ToHex(msg);
  const sha1ed = sha1(msgHex);
  console.log('AHSAS', sha1ed);
  expect(msgHex).toBe('27b3899354c310000d7cd77a4530649890116b2d');
});

test('sha1 ', () => {
  const msg = 'testing the sha1';
  const msgHex = utf8ToHex(msg);
  const hex = sha1(msgHex);
  console.log('sha1', hex)
  expect(hex).toBe('27b3899354c310000d7cd77a4530649890116b2d');
});