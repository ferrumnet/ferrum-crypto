"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ferrum_plumbing_1 = require("ferrum-plumbing");
const elliptic_1 = require("elliptic");
const WebNativeCryptor_1 = require("./WebNativeCryptor");
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
//# sourceMappingURL=SignatureUtils.js.map