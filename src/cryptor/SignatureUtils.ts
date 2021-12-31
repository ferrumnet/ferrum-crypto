import { HexString, ValidationUtils } from "ferrum-plumbing";
import { eddsa, ec } from 'elliptic';
import { arrayBufferToHex, hexToArrayBuffer } from "./WebNativeCryptor";
import { AddressFromPublicKey } from "../address/AddressFromPublicKey";

export class Eddsa {
    private static _curve: eddsa | undefined;
    private static curve(): eddsa {
        if (!Eddsa._curve) {
            Eddsa._curve = new eddsa('ed25519');
        }
        return Eddsa._curve!;
    }

    static sign(secret: HexString, msgHash: HexString): HexString {
        const key = Eddsa.curve().keyFromSecret(hexToArrayBuffer(secret) as any);
        const sig = key.sign(hexToArrayBuffer(msgHash) as any).toHex();

        key.verify(msgHash, sig)
        const pub = key.getPublic('hex');
        ValidationUtils.isTrue(Eddsa.verify(pub, msgHash, sig), 'Could not verify signature just created! This should not happen');
        return sig;
    }

    static publicKey(secret: HexString): HexString {
        const key = Eddsa.curve().keyFromSecret(hexToArrayBuffer(secret) as any);
        return key.getPublic('hex');
    }

    static verify(publicKey: HexString, msgHash: HexString, sig: HexString): boolean {
        // @ts-ignore
        const key = Eddsa.curve().keyFromPublic(publicKey, 'hex');
        return key.verify(msgHash, sig);
    }
}

export class Ecdsa {
    private static _curve: ec | undefined;
    private static curve(): ec {
        if (!Ecdsa._curve) {
            Ecdsa._curve = new ec('secp256k1');
        }
        return Ecdsa._curve!;
    }

    static sign(sk: HexString, msgHash: HexString): HexString {
        const msg = hexToArrayBuffer(msgHash) as any;
        const key = Ecdsa.curve().keyFromPrivate(hexToArrayBuffer(sk) as any);
        const sig = key.sign(msg);
        ValidationUtils.isTrue(key.verify(msgHash, sig), 'Could not verify signature just created! This should not happen');
        return  Ecdsa.encode(arrayBufferToHex(sig.r.toBuffer('be', 32)), arrayBufferToHex(sig.s.toBuffer('be', 32)), sig.recoveryParam || 0);
    }

    static publicKey(secret: HexString): HexString {
        const key = Ecdsa.curve().keyFromPrivate(hexToArrayBuffer(secret) as any);
        return key.getPublic(false, 'hex');
    }

    static recoverAddress(sig: HexString, msgHash: HexString): HexString {
        const curve = Ecdsa.curve(); 
        const [r, s, v] = Ecdsa.decode(sig);
        const sigDecoded = { r, s, recoveryParam: v } as any;
        const pub = curve.recoverPubKey(hexToArrayBuffer(msgHash), sigDecoded, v);
        const pubKey = curve.keyPair({pub});
        const pubHex = pubKey.getPublic().encode('hex', false);
        return new AddressFromPublicKey().forNetwork(
            'ETHEREUM', 
            pubHex.substring(0, 66), // Dummy compressed pubkey. Not needed for ETH network
            pubHex).address;
    }

    static encode(r: HexString, s: HexString, v: number): HexString {
        ValidationUtils.isTrue(r.length === 64, 'r len is not 64');
        ValidationUtils.isTrue(s.length === 64, 's len is not 64');
        let h = v.toString(16);
        ValidationUtils.isTrue(h.length <= 2, 'v too large');
        if (h.length === 1) { h = '0' + h; }
        return r+s+h;
    }

    static decode(sig: HexString): [string, string, number] {
        ValidationUtils.isTrue(sig.length === 64 * 2 + 2, 'sig len rs not 66');
        return [sig.substring(0, 64), sig.substring(64, 64 * 2), Number('0x' + sig.substring(64 * 2))];
    }
}
