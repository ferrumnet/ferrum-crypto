import { utf8ToHex, sha256, sha256sync, randomBytes } from "./WebNativeCryptor";
import { Ecdsa, Eddsa } from "./SignatureUtils";
import { AddressFromPublicKey } from "../address/AddressFromPublicKey";

const SK = '37ff9ae02be75eb21bd1ff24e0a21907d6bbfb7694c16968095480f33bed8e0c';
const PUB = '0ffd3d21a3ea78d79ac18caebf494d5bdac7f91795e5dbbd86adbc964f07934a';
test('Gets public key', () => {
    const pub = Eddsa.publicKey(SK);
    expect(pub).toBe(PUB);
});

test('Sign then verify', () => {
    const msg1 = 'This is a good test message1';
    const msg2 = 'This is a good test message2';
    const msgHash1 = sha256sync(utf8ToHex(msg1));
    const msgHash2 = sha256sync(utf8ToHex(msg2));

    const sig1 = Eddsa.sign(SK, msgHash1);
    const sig2 = Eddsa.sign(SK, msgHash2);

    const ver1 = Eddsa.verify(PUB, msgHash1, sig1);
    const nver1 = Eddsa.verify(PUB, msgHash1, sig2);
    const ver2 = Eddsa.verify(PUB, msgHash2, sig2);
    const nver2 = Eddsa.verify(PUB, msgHash2, sig1)
    expect(ver1).toBe(true);
    expect(nver1).toBe(false);
    expect(ver2).toBe(true);
    expect(nver2).toBe(false);
});

test('pubk from sk', () => {
    const sk = '0000000000000000000000000000000000000000000000000000000000000000';
    const pubk = Eddsa.publicKey(sk);
    console.log(pubk)
});

test('ECDSA encode decode', () => {
    const _r = '0'.repeat(64);
    const _s = '1'.repeat(64);
    const _v = 3;
    const enc = Ecdsa.encode(_r, _s , _v);
    const [r, s, v] = Ecdsa.decode(enc);
    expect(r).toBe(_r);
    expect(s).toBe(_s);
    expect(v).toBe(_v);
});

test('ECDSA sg and back', () => {
    const sk = '9789d3dfda8752e5168ad1e5ad15117ddf98e5bfe43a84af9c5fbe4ae56a5e05';
    const msg1 = 'This is a good test message1';
    const msgHash1 = sha256sync(msg1);
    const sig1 = Ecdsa.sign(sk, msgHash1);
    const pubK = Ecdsa.publicKey(sk);
    const ourAddr = new AddressFromPublicKey().forNetwork('ETHEREUM', pubK.substring(0, 66), pubK); /* dummy compressed */
    const recovered = Ecdsa.recoverAddress(sig1, msgHash1);
    expect(ourAddr.address).toBe(recovered);
});

test('Sign verif a gizzilion times', () => {
    for(let i=0; i<100000; i++) {
        const msgHash = randomBytes(32);
        const sk = randomBytes(32);
        const pubHex = Ecdsa.publicKey(sk);
        const addr = new AddressFromPublicKey().forNetwork(
            'ETHEREUM', 
            pubHex.substring(0, 66), // Dummy compressed pubkey. Not needed for ETH network
            pubHex).address;
        const sig = Ecdsa.sign(sk, msgHash);
        const ver = Ecdsa.recoverAddress(sig, msgHash);
        expect(ver).toBe(addr);
        if (i % 1000 === 0) {
            console.log('.... ', i);
        }
    }
});