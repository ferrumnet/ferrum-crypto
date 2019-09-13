import { KeyEncryptionProvider } from './CryptorService';
import { hexToUtf8, sha256, utf8ToHex, WebNativeCryptor } from './WebNativeCryptor';

class DummyKeyProvider implements KeyEncryptionProvider {
  getKey(keyId?: string): string {
    return '39fc4d7daea55e95999e5a5e517710f6477917c6997ef552afd76a7b520c5209';
  }

  newKeyId(): string {
    return 'test_key_id';
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
