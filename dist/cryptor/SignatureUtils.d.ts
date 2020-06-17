import { HexString } from "ferrum-plumbing";
export declare class Eddsa {
    private static _curve;
    private static curve;
    static sign(secret: HexString, msgHash: HexString): HexString;
    static publicKey(secret: HexString): HexString;
    static verify(publicKey: HexString, msgHash: HexString, sig: HexString): boolean;
}
//# sourceMappingURL=SignatureUtils.d.ts.map