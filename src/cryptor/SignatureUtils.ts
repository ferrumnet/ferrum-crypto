import { HexString, ValidationUtils } from "ferrum-plumbing";
import {eddsa} from 'elliptic';
import { hexToArrayBuffer, arrayBufferToHex } from "./WebNativeCryptor";

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
