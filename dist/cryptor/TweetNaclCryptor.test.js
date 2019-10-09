"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const TweetNaclCryptor_1 = require("./TweetNaclCryptor");
const WebNativeCryptor_1 = require("./WebNativeCryptor");
const skHex = '39fc4d7daea55e95999e5a5e517710f6477917c6997ef552afd76a7b520c5209';
test('dummyKey', () => {
    const cryptor = new TweetNaclCryptor_1.TweetNaclCryptor();
    const keyPair = cryptor.keyPair(skHex);
    expect(keyPair.secretKey).toBe(skHex);
    expect(keyPair.publicKey).toBe('3231bf3a1f4afd6b0485e02e6105fe0d470c564a4bebe98fdfaafbe8128dd86a');
});
test('encrypt async then decrypt', () => __awaiter(void 0, void 0, void 0, function* () {
    const cryptor = new TweetNaclCryptor_1.TweetNaclCryptor();
    const aliceSKey = skHex;
    const aliceKey = cryptor.keyPair(aliceSKey);
    const nonce = aliceSKey.replace('9', '0').substring(0, 48);
    const bobSKey = aliceSKey.replace('1', '2');
    const bobKey = cryptor.keyPair(bobSKey);
    const origMsg = 'Hey Bob! Check the bag!';
    const msg = WebNativeCryptor_1.utf8ToHex(origMsg);
    // Alice sends a secret message to Bob.
    const encMsgs = yield cryptor.encrypt(msg, nonce, { localSecretKey: aliceKey.secretKey, remotePublicKey: bobKey.publicKey });
    console.log('Encrypted message: ', encMsgs);
    // Now bob decrypts the message
    const decMsgs = yield cryptor.decrypt(encMsgs, nonce, { localSecretKey: bobKey.secretKey, remotePublicKey: aliceKey.publicKey });
    const msgUtf8 = WebNativeCryptor_1.hexToUtf8(decMsgs);
    console.log('decrypted ', msgUtf8);
    expect(msgUtf8).toBe(origMsg);
}));
//# sourceMappingURL=TweetNaclCryptor.test.js.map