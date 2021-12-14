"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ferrum_plumbing_1 = require("ferrum-plumbing");
const elliptic_1 = require("elliptic");
const WebNativeCryptor_1 = require("./WebNativeCryptor");
const AddressFromPublicKey_1 = require("../address/AddressFromPublicKey");
class Eddsa {
    static curve() {
        if (!Eddsa._curve) {
            Eddsa._curve = new elliptic_1.eddsa('ed25519');
        }
        return Eddsa._curve;
    }
    static sign(secret, msgHash) {
        const key = Eddsa.curve().keyFromSecret(WebNativeCryptor_1.hexToArrayBuffer(secret));
        const sig = key.sign(WebNativeCryptor_1.hexToArrayBuffer(msgHash)).toHex();
        key.verify(msgHash, sig);
        const pub = key.getPublic('hex');
        ferrum_plumbing_1.ValidationUtils.isTrue(Eddsa.verify(pub, msgHash, sig), 'Could not verify signature just created! This should not happen');
        return sig;
    }
    static publicKey(secret) {
        const key = Eddsa.curve().keyFromSecret(WebNativeCryptor_1.hexToArrayBuffer(secret));
        return key.getPublic('hex');
    }
    static verify(publicKey, msgHash, sig) {
        // @ts-ignore
        const key = Eddsa.curve().keyFromPublic(publicKey, 'hex');
        return key.verify(msgHash, sig);
    }
}
exports.Eddsa = Eddsa;
class Ecdsa {
    static curve() {
        if (!Ecdsa._curve) {
            Ecdsa._curve = new elliptic_1.ec('secp256k1');
        }
        return Ecdsa._curve;
    }
    static sign(sk, msgHash) {
        const msg = WebNativeCryptor_1.hexToArrayBuffer(msgHash);
        const key = Ecdsa.curve().keyFromPrivate(WebNativeCryptor_1.hexToArrayBuffer(sk));
        const sig = key.sign(msg);
        ferrum_plumbing_1.ValidationUtils.isTrue(key.verify(msgHash, sig), 'Could not verify signature just created! This should not happen');
        return Ecdsa.encode(WebNativeCryptor_1.arrayBufferToHex(sig.r.toBuffer()), WebNativeCryptor_1.arrayBufferToHex(sig.s.toBuffer()), sig.recoveryParam || 0);
    }
    static publicKey(secret) {
        const key = Ecdsa.curve().keyFromPrivate(WebNativeCryptor_1.hexToArrayBuffer(secret));
        return key.getPublic(false, 'hex');
    }
    static recoverAddress(sig, msgHash) {
        const curve = Ecdsa.curve();
        const [r, s, v] = Ecdsa.decode(sig);
        const sigDecoded = { r, s, recoveryParam: v };
        const pub = curve.recoverPubKey(WebNativeCryptor_1.hexToArrayBuffer(msgHash), sigDecoded, v);
        const pubKey = curve.keyPair({ pub });
        const pubHex = pubKey.getPublic().encode('hex', false);
        return new AddressFromPublicKey_1.AddressFromPublicKey().forNetwork('ETHEREUM', pubHex.substring(0, 66), // Dummy compressed pubkey. Not needed for ETH network
        pubHex).address;
    }
    static encode(r, s, v) {
        ferrum_plumbing_1.ValidationUtils.isTrue(r.length === 64, 'r len is not 64');
        ferrum_plumbing_1.ValidationUtils.isTrue(s.length === 64, 's len is not 64');
        let h = v.toString(16);
        ferrum_plumbing_1.ValidationUtils.isTrue(h.length <= 2, 'v too large');
        if (h.length === 1) {
            h = '0' + h;
        }
        return r + s + h;
    }
    static decode(sig) {
        ferrum_plumbing_1.ValidationUtils.isTrue(sig.length === 64 * 2 + 2, 'sig len rs not 66');
        return [sig.substring(0, 64), sig.substring(64, 64 * 2), Number('0x' + sig.substring(64 * 2))];
    }
}
exports.Ecdsa = Ecdsa;
//# sourceMappingURL=SignatureUtils.js.map