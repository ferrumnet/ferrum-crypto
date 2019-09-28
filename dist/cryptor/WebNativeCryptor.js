"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const CryptorService_1 = require("./CryptorService");
const aes_1 = __importDefault(require("crypto-js/aes"));
const enc_utf8_1 = __importDefault(require("crypto-js/enc-utf8"));
const enc_hex_1 = __importDefault(require("crypto-js/enc-hex"));
const sha256_1 = __importDefault(require("crypto-js/sha256"));
const crypto_js_1 = require("crypto-js");
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
function hexToBase64(hex) {
    return crypto_js_1.enc.Base64.stringify(enc_hex_1.default.parse(hex));
}
exports.hexToBase64 = hexToBase64;
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
        const dataWa = enc_hex_1.default.parse(hexData);
        const hash = sha256_1.default(dataWa);
        return hash.toString(enc_hex_1.default);
    });
}
exports.sha256 = sha256;
class WebNativeCryptor {
    constructor(keyProvider) {
        this.keyProvider = keyProvider;
    }
    decryptKey(key) {
        const kek = this.keyProvider.getKey(key.keyId);
        const msg = enc_hex_1.default.parse(key.key);
        const decKey = aes_1.default.decrypt(crypto_js_1.enc.Base64.stringify(msg), kek);
        return decKey.toString();
    }
    newKey() {
        const keyId = this.keyProvider.newKeyId();
        const kek = this.keyProvider.getKey(keyId);
        const randomKeyWa = crypto_js_1.lib.WordArray.random(CryptorService_1.Algo.SIZES.KEY_SIZE);
        const encKey = aes_1.default.encrypt(randomKeyWa, kek);
        const encKeyB64 = encKey.toString();
        const encKeyHex = crypto_js_1.enc.Hex.stringify(crypto_js_1.enc.Base64.parse(encKeyB64));
        return { encryptedKey: encKeyHex, keyId, unEncrypedKey: enc_hex_1.default.stringify(randomKeyWa) };
    }
    decryptToHex(encData) {
        return __awaiter(this, void 0, void 0, function* () {
            const key = keyHexToObject(encData.key);
            if (key.algo !== CryptorService_1.Algo.ENCRYPTION.AES) {
                throw new CryptorService_1.CryptorError(`Key algorithm "${key.algo}" unsupported`);
            }
            const msg = enc_hex_1.default.parse(encData.data);
            const unEnvelopedKey = this.decryptKey(key);
            const encRes = aes_1.default.decrypt(crypto_js_1.enc.Base64.stringify(msg), unEnvelopedKey);
            return encRes.toString(enc_hex_1.default);
        });
    }
    encryptHex(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const newKey = this.newKey();
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
}
exports.WebNativeCryptor = WebNativeCryptor;
//# sourceMappingURL=WebNativeCryptor.js.map