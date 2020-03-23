import {HexString, Injectable, Network, ValidationUtils} from 'ferrum-plumbing';
import {
    arrayBufferToHex,
    hexToArrayBuffer,
    hexToBase58,
    ripemd160,
    sha256sync,
    sha3,
    utf8ToHex,
} from '../cryptor/WebNativeCryptor';
import bech32 from 'bech32';

export interface AddressChecksumPair {
    address: string;
    addressWithChecksum: string;
}

function addressPair(address: string) {
    return {
        address,
        addressWithChecksum: address,
    } as AddressChecksumPair;
}

export class AddressFromPublicKey implements Injectable {
    constructor() {}

    __name__(): string { return 'AddressFromPublicKey'; }

    forNetwork(network: Network, publicKeyCompressed: HexString, publicKeyUncompressed: HexString): AddressChecksumPair {
        ValidationUtils.isTrue(!!publicKeyUncompressed && publicKeyUncompressed.length === 130,
            '"publicKeyUncompressed" must be provided and 130 bytes long');
        ValidationUtils.isTrue(!!publicKeyCompressed && publicKeyCompressed.length === 66,
            '"publicKeyCompressed" must be provided and 66 bytes long');
        switch (network) {
            case 'BINANCE':
                return addressPair(bnbGetAddressFromPublicKey(publicKeyCompressed, 'bnb'));
            case 'BITCOIN':
                return addressPair(bitcoinP2pkh(publicKeyUncompressed));
            case 'RINKEBY':
            case 'ETHEREUM':
                const ethAddr = ethAddressFromPublicKey(publicKeyUncompressed);
                return {
                    address: ethAddr.toLowerCase(),
                    addressWithChecksum: ethAddr,
                } as AddressChecksumPair;
            case 'FERRUM':
                const frmAddr = ethAddressFromPublicKey(publicKeyUncompressed).replace('0x', 'fx');
                return {
                    address: frmAddr.toLowerCase(),
                    addressWithChecksum: frmAddr,
                } as AddressChecksumPair;
            default:
                throw new Error(`Network ${network} is not supported`);
        }
    }
}

function ethAddressFromPublicKey(publicKey: HexString): HexString {
    const publicHash = sha3(publicKey.slice(2));
    return toChecksum("0x" + publicHash.slice(-40));
}

function toChecksum(address: HexString) {
    const addressHash = '0x' + sha3(utf8ToHex(address.slice(2)));
    let checksumAddress = "0x";
    for (let i = 0; i < 40; i++)
        checksumAddress += parseInt(addressHash[i + 2], 16) > 7
            ? address[i + 2].toUpperCase()
            : address[i + 2];
    return checksumAddress;
}

export const bnbGetAddressFromPublicKey = (compressedPublicKeyHex: HexString, prefix: string) => {
    const hexed = compressedPublicKeyHex;
    const hash = sha256ripemd160(hexed); // https://git.io/fAn8N
    const address = bnbEncodeAddress(hash, prefix);
    return address
};

export const bnbEncodeAddress = (value: HexString, prefix = 'tbnb') => {
    const words = bech32.toWords(hexToArrayBuffer(value) as any);
    return bech32.encode(prefix, words)
};

export const sha256ripemd160 = (hex: HexString) => {
    if (hex.length % 2 !== 0) throw new Error(`invalid hex string length: ${hex}`);
    const ProgramSha256 = sha256sync(hex);
    return ripemd160(ProgramSha256);
};

// Based on http://procbits.com/2013/08/27/generating-a-bitcoin-address-with-javascript
function bitcoinP2pkh(pubKey: HexString): string {
    const hash160 = sha256ripemd160(pubKey);

    const version = 0x00; //if using testnet, would use 0x6F or 111.
    const hashAndBytes = normalArray(hexToArrayBuffer(hash160));
    hashAndBytes.unshift(version);
    const hexed = arrayBufferToHex(toByteArray(hashAndBytes));
    const doubleSHA = sha256sync(sha256sync(hexed));
    const addressChecksum = doubleSHA.substr(0,8);
    const unencodedAddress = "00" + hash160 + addressChecksum;
    return hexToBase58(unencodedAddress);
}

function normalArray(buffer: Uint8Array) {
    const normal = [];
    for (let i = 0; i < buffer.length; ++i)
        normal[i] = buffer[i];
    return normal;
}

function toByteArray(normalArray: number[]) {
    const rv = new Uint8Array(normalArray.length);
    for (let i = 0; i < normalArray.length; ++i)
        rv[i] = normalArray[i];
    return rv;
}
