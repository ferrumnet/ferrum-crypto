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
const WebNativeCryptor_1 = require("./WebNativeCryptor");
class DummyKeyProvider {
    getKey(keyId) {
        return '39fc4d7daea55e95999e5a5e517710f6477917c6997ef552afd76a7b520c5209';
    }
    newKeyId() {
        return 'test_key_id';
    }
    randomHex(keySize) {
        return __awaiter(this, void 0, void 0, function* () {
            return '';
        });
    }
}
test('hash', () => __awaiter(void 0, void 0, void 0, function* () {
    const hex = yield WebNativeCryptor_1.utf8ToHex('HELLO WORLD');
    const hash = yield WebNativeCryptor_1.sha256(hex);
    expect(hash).toBe('787ec76dcafd20c1908eb0936a12f91edd105ab5cd7ecc2b1ae2032648345dff');
}));
test('encrypt then decrypt', () => __awaiter(void 0, void 0, void 0, function* () {
    const msg = 'HELLO WORLD!';
    const data = yield WebNativeCryptor_1.utf8ToHex(msg);
    const cryptor = new WebNativeCryptor_1.WebNativeCryptor(new DummyKeyProvider());
    const encrypted = yield cryptor.encryptHex(data);
    const decrpted = yield cryptor.decryptToHex(encrypted);
    const decryptedMsg = WebNativeCryptor_1.hexToUtf8(decrpted);
    expect(decryptedMsg).toBe(msg);
}));
test('array buffer to hex', () => {
    // tslint:disable-next-line:no-magic-numbers
    const ab = new Uint8Array([72, 69, 76, 76, 79, 33]);
    const hex = WebNativeCryptor_1.arrayBufferToHex(ab);
    const text = WebNativeCryptor_1.hexToUtf8(hex);
    expect(text).toBe('HELLO!');
});
test('hex to b64', () => {
    const msg = 'testing the sha1';
    const msgHex = WebNativeCryptor_1.utf8ToHex(msg);
    const sha1ed = WebNativeCryptor_1.sha1(msgHex);
    console.log('AHSAS', sha1ed);
    expect(msgHex).toBe('27b3899354c310000d7cd77a4530649890116b2d');
});
test('sha1 ', () => {
    const msg = 'testing the sha1';
    const msgHex = WebNativeCryptor_1.utf8ToHex(msg);
    const hex = WebNativeCryptor_1.sha1(msgHex);
    console.log('sha1', hex);
    expect(hex).toBe('27b3899354c310000d7cd77a4530649890116b2d');
});
test('hmac', () => {
    const secret = '39fc4d7daea55e95999e5a5e517710f6477917c6997ef552afd76a7b520c5209';
    const data = 'Some data {"here"}';
    const res = WebNativeCryptor_1.hmac(secret, data);
    console.log('HMAC', res);
    expect(res).toBe('dbd6eeda2ac65f22f179add01cc2a692fc98ee5c3f5c6cc639362a965f7ad8fc');
});
//# sourceMappingURL=WebNativeCryptor.test.js.map