"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const WebNativeCryptor_1 = require("./WebNativeCryptor");
const SignatureUtils_1 = require("./SignatureUtils");
const AddressFromPublicKey_1 = require("../address/AddressFromPublicKey");
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
test('ECDSA encode decode', () => {
    const _r = '0'.repeat(64);
    const _s = '1'.repeat(64);
    const _v = 3;
    const enc = SignatureUtils_1.Ecdsa.encode(_r, _s, _v);
    const [r, s, v] = SignatureUtils_1.Ecdsa.decode(enc);
    expect(r).toBe(_r);
    expect(s).toBe(_s);
    expect(v).toBe(_v);
});
test('ECDSA sg and back', () => {
    const sk = '9789d3dfda8752e5168ad1e5ad15117ddf98e5bfe43a84af9c5fbe4ae56a5e05';
    const msg1 = 'This is a good test message1';
    const msgHash1 = WebNativeCryptor_1.sha256sync(msg1);
    const sig1 = SignatureUtils_1.Ecdsa.sign(sk, msgHash1);
    const pubK = SignatureUtils_1.Ecdsa.publicKey(sk);
    const ourAddr = new AddressFromPublicKey_1.AddressFromPublicKey().forNetwork('ETHEREUM', pubK.substring(0, 66), pubK); /* dummy compressed */
    const recovered = SignatureUtils_1.Ecdsa.recoverAddress(sig1, msgHash1);
    expect(ourAddr.address).toBe(recovered);
});
test('Sign verif a gizzilion times', () => {
    for (let i = 0; i < 100000; i++) {
        const msgHash = WebNativeCryptor_1.randomBytes(32);
        const sk = WebNativeCryptor_1.randomBytes(32);
        const pubHex = SignatureUtils_1.Ecdsa.publicKey(sk);
        const addr = new AddressFromPublicKey_1.AddressFromPublicKey().forNetwork('ETHEREUM', pubHex.substring(0, 66), // Dummy compressed pubkey. Not needed for ETH network
        pubHex).address;
        const sig = SignatureUtils_1.Ecdsa.sign(sk, msgHash);
        const ver = SignatureUtils_1.Ecdsa.recoverAddress(sig, msgHash);
        expect(ver).toBe(addr);
        process.stdout.write('.');
    }
});
//# sourceMappingURL=SignatureUtils.test.js.map