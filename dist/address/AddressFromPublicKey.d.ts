import { HexString, Injectable, Network } from 'ferrum-plumbing';
export declare class AddressFromPublicKey implements Injectable {
    constructor();
    __name__(): string;
    forNetwork(network: Network, publicKeyCompressed: HexString, publicKeyUncompressed: HexString): HexString;
}
export declare const bnbGetAddressFromPublicKey: (compressedPublicKeyHex: string, prefix: string) => string;
export declare const bnbEncodeAddress: (value: string, prefix?: string) => string;
export declare const sha256ripemd160: (hex: string) => string;
//# sourceMappingURL=AddressFromPublicKey.d.ts.map