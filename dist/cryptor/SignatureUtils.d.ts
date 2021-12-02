import { HexString } from "ferrum-plumbing";
export declare class Eddsa {
    private static _curve;
    private static curve;
    static sign(secret: HexString, msgHash: HexString): HexString;
    static publicKey(secret: HexString): HexString;
    static verify(publicKey: HexString, msgHash: HexString, sig: HexString): boolean;
}
export declare class Ecdsa {
    private static _curve;
    private static curve;
    static sign(sk: HexString, msgHash: HexString): HexString;
    static publicKey(secret: HexString): HexString;
    static recoverAddress(sig: HexString, msgHash: HexString): HexString;
    static encode(r: HexString, s: HexString, v: number): HexString;
    static decode(sig: HexString): [string, string, number];
}
//# sourceMappingURL=SignatureUtils.d.ts.map