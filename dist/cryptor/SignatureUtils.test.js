"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const WebNativeCryptor_1 = require("./WebNativeCryptor");
const SignatureUtils_1 = require("./SignatureUtils");
const SK = '37ff9ae02be75eb21bd1ff24e0a21907d6bbfb7694c16968095480f33bed8e0c';
const PUB = '0ffd3d21a3ea78d79ac18caebf494d5bdac7f91795e5dbbd86adbc964f07934a';
test('Gets public key', () => {
    const pub = SignatureUtils_1.Eddsa.publicKey(SK);
    expect(pub).toBe(PUB);
});
test('Sign then verify', () => {
    const msg1 = 'This is a good test message1';
    const msg2 = 'This is a good test message2';
    const msgHash1 = WebNativeCryptor_1.sha256sync(WebNativeCryptor_1.utf8ToHex(msg1));
    const msgHash2 = WebNativeCryptor_1.sha256sync(WebNativeCryptor_1.utf8ToHex(msg2));
    const sig1 = SignatureUtils_1.Eddsa.sign(SK, msgHash1);
    const sig2 = SignatureUtils_1.Eddsa.sign(SK, msgHash2);
    const ver1 = SignatureUtils_1.Eddsa.verify(PUB, msgHash1, sig1);
    const nver1 = SignatureUtils_1.Eddsa.verify(PUB, msgHash1, sig2);
    const ver2 = SignatureUtils_1.Eddsa.verify(PUB, msgHash2, sig2);
    const nver2 = SignatureUtils_1.Eddsa.verify(PUB, msgHash2, sig1);
    expect(ver1).toBe(true);
    expect(nver1).toBe(false);
    expect(ver2).toBe(true);
    expect(nver2).toBe(false);
});
test('pubk from sk', () => {
    const sk = '0000000000000000000000000000000000000000000000000000000000000000';
    const pubk = SignatureUtils_1.Eddsa.publicKey(sk);
    console.log(pubk);
});
//# sourceMappingURL=SignatureUtils.test.js.map