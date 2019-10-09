
import {TweetNaclCryptor} from "./TweetNaclCryptor";
import {hexToUtf8, utf8ToHex} from "./WebNativeCryptor";

const skHex = '39fc4d7daea55e95999e5a5e517710f6477917c6997ef552afd76a7b520c5209';

test('dummyKey', () => {
    const cryptor = new TweetNaclCryptor();
    const keyPair = cryptor.keyPair(skHex);
    expect(keyPair.secretKey).toBe(skHex);
    expect(keyPair.publicKey).toBe('3231bf3a1f4afd6b0485e02e6105fe0d470c564a4bebe98fdfaafbe8128dd86a');
});

test('encrypt async then decrypt', async () => {
    const cryptor = new TweetNaclCryptor();
    const aliceSKey = skHex;
    const aliceKey = cryptor.keyPair(aliceSKey);
    const nonce = aliceSKey.replace('9', '0').substring(0, 48);

    const bobSKey = aliceSKey.replace('1', '2');
    const bobKey = cryptor.keyPair(bobSKey);

    const origMsg = 'Hey Bob! Check the bag!';
    const msg = utf8ToHex(origMsg);
    // Alice sends a secret message to Bob.
    const encMsgs = await cryptor.encrypt(msg, nonce,
        { localSecretKey: aliceKey.secretKey, remotePublicKey: bobKey.publicKey });
    console.log('Encrypted message: ', encMsgs);

    // Now bob decrypts the message
    const decMsgs = await cryptor.decrypt(encMsgs, nonce,
        { localSecretKey: bobKey.secretKey, remotePublicKey: aliceKey.publicKey });
    const msgUtf8 = hexToUtf8(decMsgs);
    console.log('decrypted ', msgUtf8);
    expect(msgUtf8).toBe(origMsg);
});
