"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
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
}
test('hash', () => __awaiter(this, void 0, void 0, function* () {
    const hex = yield WebNativeCryptor_1.utf8ToHex('HELLO WORLD');
    const hash = yield WebNativeCryptor_1.sha256(hex);
    expect(hash).toBe('787ec76dcafd20c1908eb0936a12f91edd105ab5cd7ecc2b1ae2032648345dff');
}));
test('encrypt then decrypt', () => __awaiter(this, void 0, void 0, function* () {
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
    const msg = 'HI!';
    const msgHex = WebNativeCryptor_1.utf8ToHex(msg);
    const b64 = WebNativeCryptor_1.hexToBase64(msgHex);
    expect(b64).toBe('SEkh');
});
//# sourceMappingURL=WebNativeCryptor.test.js.map