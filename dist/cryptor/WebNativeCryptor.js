"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const CryptorService_1 = require("./CryptorService");
const ferrum_plumbing_1 = require("ferrum-plumbing");
const aes_1 = __importDefault(require("crypto-js/aes"));
const enc_utf8_1 = __importDefault(require("crypto-js/enc-utf8"));
const enc_hex_1 = __importDefault(require("crypto-js/enc-hex"));
const sha256_1 = __importDefault(require("crypto-js/sha256"));
const sha1_1 = __importDefault(require("crypto-js/sha1"));
const sha3_1 = __importDefault(require("crypto-js/sha3"));
const hmac_sha256_1 = __importDefault(require("crypto-js/hmac-sha256"));
const crypto_js_1 = require("crypto-js");
const ripemd160_1 = __importDefault(require("crypto-js/ripemd160"));
const bs58_1 = __importDefault(require("bs58"));
function utf8ToHex(hexStr) {
    return enc_hex_1.default.stringify(enc_utf8_1.default.parse(hexStr));
}
exports.utf8ToHex = utf8ToHex;
function hexToUtf8(hexStr) {
    return enc_utf8_1.default.stringify(enc_hex_1.default.parse(hexStr));
}
exports.hexToUtf8 = hexToUtf8;
function arrayBufferToHex(ab) {
    return enc_hex_1.default.stringify(crypto_js_1.lib.WordArray.create(ab));
}
exports.arrayBufferToHex = arrayBufferToHex;
function ripemd160(hex) {
    return ripemd160_1.default(enc_hex_1.default.parse(hex)).toString();
}
exports.ripemd160 = ripemd160;
function randomBytes(size) {
    return enc_hex_1.default.stringify(crypto_js_1.lib.WordArray.random(size));
}
exports.randomBytes = randomBytes;
function hexToArrayBuffer(hex) {
    // @ts-ignore
    hex = hex.toString(16);
    hex = hex.replace(/^0x/i, '');
    let bytes = [];
    for (let c = 0; c < hex.length; c += 2)
        bytes.push(parseInt(hex.substr(c, 2), 16));
    // @ts-ignore
    return new Uint8Array(bytes);
}
exports.hexToArrayBuffer = hexToArrayBuffer;
/**
 * Convert a hex string to a byte array
 *
 * Note: Implementation from crypto-js
 *
 * @method hexToBytes
 * @param {string} hex
 * @return {Array} the byte array
 */
function hexToBase64(hex) {
    return crypto_js_1.enc.Base64.stringify(enc_hex_1.default.parse(hex));
}
exports.hexToBase64 = hexToBase64;
function hexToBase58(hex) {
    return bs58_1.default.encode(Buffer.from(hex, 'hex'));
}
exports.hexToBase58 = hexToBase58;
function base64ToHex(base64) {
    return enc_hex_1.default.stringify(crypto_js_1.enc.Base64.parse(base64));
}
exports.base64ToHex = base64ToHex;
function keyToHex(key) {
    const json = JSON.stringify(key);
    return enc_hex_1.default.stringify(enc_utf8_1.default.parse(json));
}
function keyHexToObject(hex) {
    // parse the key
    const keyStr = hexToUtf8(hex);
    return JSON.parse(keyStr);
}
function sha256(hexData) {
    return __awaiter(this, void 0, void 0, function* () {
        return sha256sync(hexData);
    });
}
exports.sha256 = sha256;
function sha256sync(hexData) {
    const dataWa = enc_hex_1.default.parse(hexData);
    const hash = sha256_1.default(dataWa);
    return hash.toString(enc_hex_1.default);
}
exports.sha256sync = sha256sync;
function hmac(secret, dataUtf8) {
    const secretWa = enc_hex_1.default.parse(secret);
    const dataWa = enc_utf8_1.default.parse(dataUtf8);
    const res = hmac_sha256_1.default(dataWa, secretWa);
    return res.toString(enc_hex_1.default);
}
exports.hmac = hmac;
function sha1(hexData) {
    const dataWa = enc_hex_1.default.parse(hexData);
    const hash = sha1_1.default(dataWa);
    return hash.toString(enc_hex_1.default);
}
exports.sha1 = sha1;
function sha3(hexData) {
    const dataWa = enc_hex_1.default.parse(hexData);
    const hash = sha3_1.default(dataWa, { outputLength: 256 });
    return hash.toString(enc_hex_1.default);
}
exports.sha3 = sha3;
class WebNativeCryptor {
    constructor(keyProvider) {
        this.keyProvider = keyProvider;
    }
    decryptKey(key, overrideKey) {
        return __awaiter(this, void 0, void 0, function* () {
            if (key.keyId === 'PROVIDED') {
                ferrum_plumbing_1.ValidationUtils.isTrue(!!overrideKey, 'You must provide the key to decrypt');
            }
            const kek = overrideKey || this.keyProvider.getKey(key.keyId);
            const msg = enc_hex_1.default.parse(key.key);
            const decKey = aes_1.default.decrypt(crypto_js_1.enc.Base64.stringify(msg), kek);
            return decKey.toString();
        });
    }
    newKey(overrideKey) {
        return __awaiter(this, void 0, void 0, function* () {
            const keyId = !!overrideKey ? 'PROVIDED' : this.keyProvider.newKeyId();
            const kek = overrideKey || this.keyProvider.getKey(keyId);
            const randomKeyWa = crypto_js_1.lib.WordArray.random(CryptorService_1.Algo.SIZES.KEY_SIZE);
            const encKey = aes_1.default.encrypt(randomKeyWa, kek);
            const encKeyB64 = encKey.toString();
            const encKeyHex = crypto_js_1.enc.Hex.stringify(crypto_js_1.enc.Base64.parse(encKeyB64));
            return { encryptedKey: encKeyHex, keyId, unEncrypedKey: enc_hex_1.default.stringify(randomKeyWa) };
        });
    }
    decryptToHex(encData, overrideKey) {
        return __awaiter(this, void 0, void 0, function* () {
            const key = keyHexToObject(encData.key);
            if (key.algo !== CryptorService_1.Algo.ENCRYPTION.AES) {
                throw new CryptorService_1.CryptorError(`Key algorithm "${key.algo}" unsupported`);
            }
            const msg = enc_hex_1.default.parse(encData.data);
            const unEnvelopedKey = yield this.decryptKey(key, overrideKey);
            const encRes = aes_1.default.decrypt(crypto_js_1.enc.Base64.stringify(msg), unEnvelopedKey);
            return encRes.toString(enc_hex_1.default);
        });
    }
    encryptHex(data, overrideKey) {
        return __awaiter(this, void 0, void 0, function* () {
            const newKey = yield this.newKey(overrideKey);
            const msg = enc_hex_1.default.parse(data);
            const res = aes_1.default.encrypt(msg, newKey.unEncrypedKey);
            const encMsgB64 = res.toString();
            const encMsg = crypto_js_1.enc.Hex.stringify(crypto_js_1.enc.Base64.parse(encMsgB64));
            return {
                data: encMsg,
                key: keyToHex({
                    key: newKey.encryptedKey,
                    keyId: newKey.keyId,
                    algo: CryptorService_1.Algo.ENCRYPTION.AES,
                }),
            };
        });
    }
    sha256(hexData) {
        return __awaiter(this, void 0, void 0, function* () {
            return sha256(hexData);
        });
    }
    __name__() { return 'WebNativeCryptor'; }
}
exports.WebNativeCryptor = WebNativeCryptor;
//# sourceMappingURL=WebNativeCryptor.js.map