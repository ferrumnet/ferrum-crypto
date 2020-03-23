"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ferrum_plumbing_1 = require("ferrum-plumbing");
const WebNativeCryptor_1 = require("../cryptor/WebNativeCryptor");
const bech32_1 = __importDefault(require("bech32"));
function addressPair(address) {
    return {
        address,
        addressWithChecksum: address,
    };
}
class AddressFromPublicKey {
    constructor() { }
    __name__() { return 'AddressFromPublicKey'; }
    forNetwork(network, publicKeyCompressed, publicKeyUncompressed) {
        ferrum_plumbing_1.ValidationUtils.isTrue(!!publicKeyUncompressed && publicKeyUncompressed.length === 130, '"publicKeyUncompressed" must be provided and 130 bytes long');
        ferrum_plumbing_1.ValidationUtils.isTrue(!!publicKeyCompressed && publicKeyCompressed.length === 66, '"publicKeyCompressed" must be provided and 66 bytes long');
        switch (network) {
            case 'BINANCE':
                return addressPair(exports.bnbGetAddressFromPublicKey(publicKeyCompressed, 'bnb'));
            case 'BITCOIN':
                return addressPair(bitcoinP2pkh(publicKeyUncompressed));
            case 'RINKEBY':
            case 'ETHEREUM':
                const ethAddr = ethAddressFromPublicKey(publicKeyUncompressed);
                return {
                    address: ethAddr.toLowerCase(),
                    addressWithChecksum: ethAddr,
                };
            case 'FERRUM':
                const frmAddr = ethAddressFromPublicKey(publicKeyUncompressed).replace('0x', 'fx');
                return {
                    address: frmAddr.toLowerCase(),
                    addressWithChecksum: frmAddr,
                };
            default:
                throw new Error(`Network ${network} is not supported`);
        }
    }
}
exports.AddressFromPublicKey = AddressFromPublicKey;
function ethAddressFromPublicKey(publicKey) {
    const publicHash = WebNativeCryptor_1.sha3(publicKey.slice(2));
    return toChecksum("0x" + publicHash.slice(-40));
}
function toChecksum(address) {
    const addressHash = '0x' + WebNativeCryptor_1.sha3(WebNativeCryptor_1.utf8ToHex(address.slice(2)));
    let checksumAddress = "0x";
    for (let i = 0; i < 40; i++)
        checksumAddress += parseInt(addressHash[i + 2], 16) > 7
            ? address[i + 2].toUpperCase()
            : address[i + 2];
    return checksumAddress;
}
exports.bnbGetAddressFromPublicKey = (compressedPublicKeyHex, prefix) => {
    const hexed = compressedPublicKeyHex;
    const hash = exports.sha256ripemd160(hexed); // https://git.io/fAn8N
    const address = exports.bnbEncodeAddress(hash, prefix);
    return address;
};
exports.bnbEncodeAddress = (value, prefix = 'tbnb') => {
    const words = bech32_1.default.toWords(WebNativeCryptor_1.hexToArrayBuffer(value));
    return bech32_1.default.encode(prefix, words);
};
exports.sha256ripemd160 = (hex) => {
    if (hex.length % 2 !== 0)
        throw new Error(`invalid hex string length: ${hex}`);
    const ProgramSha256 = WebNativeCryptor_1.sha256sync(hex);
    return WebNativeCryptor_1.ripemd160(ProgramSha256);
};
// Based on http://procbits.com/2013/08/27/generating-a-bitcoin-address-with-javascript
function bitcoinP2pkh(pubKey) {
    const hash160 = exports.sha256ripemd160(pubKey);
    const version = 0x00; //if using testnet, would use 0x6F or 111.
    const hashAndBytes = normalArray(WebNativeCryptor_1.hexToArrayBuffer(hash160));
    hashAndBytes.unshift(version);
    const hexed = WebNativeCryptor_1.arrayBufferToHex(toByteArray(hashAndBytes));
    const doubleSHA = WebNativeCryptor_1.sha256sync(WebNativeCryptor_1.sha256sync(hexed));
    const addressChecksum = doubleSHA.substr(0, 8);
    const unencodedAddress = "00" + hash160 + addressChecksum;
    return WebNativeCryptor_1.hexToBase58(unencodedAddress);
}
function normalArray(buffer) {
    const normal = [];
    for (let i = 0; i < buffer.length; ++i)
        normal[i] = buffer[i];
    return normal;
}
function toByteArray(normalArray) {
    const rv = new Uint8Array(normalArray.length);
    for (let i = 0; i < normalArray.length; ++i)
        rv[i] = normalArray[i];
    return rv;
}
//# sourceMappingURL=AddressFromPublicKey.js.map