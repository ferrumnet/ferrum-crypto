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
const WebNativeCryptor_1 = require("./WebNativeCryptor");
const tweetnacl_1 = __importDefault(require("tweetnacl"));
class TweetNaclCryptor {
    keyPair(secret) {
        const secretBuffer = WebNativeCryptor_1.hexToArrayBuffer(secret);
        const keyPair = tweetnacl_1.default.box.keyPair.fromSecretKey(secretBuffer);
        return {
            publicKey: WebNativeCryptor_1.arrayBufferToHex(keyPair.publicKey),
            secretKey: WebNativeCryptor_1.arrayBufferToHex(keyPair.secretKey),
        };
    }
    decrypt(encMessage, nonce, sharedKey) {
        return __awaiter(this, void 0, void 0, function* () {
            const msgBuffer = WebNativeCryptor_1.hexToArrayBuffer(encMessage);
            const nonceBuffer = WebNativeCryptor_1.hexToArrayBuffer(nonce);
            const publicKey = WebNativeCryptor_1.hexToArrayBuffer(sharedKey.remotePublicKey);
            const secretKey = WebNativeCryptor_1.hexToArrayBuffer(sharedKey.localSecretKey);
            const payload = tweetnacl_1.default.box.open(msgBuffer, nonceBuffer, publicKey, secretKey);
            if (!payload) {
                throw new Error('TweetNaclCryptor.decrypt: Error decrypting message. There is no payload decrypted!');
            }
            return WebNativeCryptor_1.arrayBufferToHex(payload);
        });
    }
    encrypt(message, nonce, sharedKey) {
        return __awaiter(this, void 0, void 0, function* () {
            const messageBuffer = WebNativeCryptor_1.hexToArrayBuffer(message);
            const nonceBuffer = WebNativeCryptor_1.hexToArrayBuffer(nonce);
            const publicKey = WebNativeCryptor_1.hexToArrayBuffer(sharedKey.remotePublicKey);
            const secretKey = WebNativeCryptor_1.hexToArrayBuffer(sharedKey.localSecretKey);
            const payload = tweetnacl_1.default.box(messageBuffer, nonceBuffer, publicKey, secretKey);
            if (!payload) {
                throw new Error('TweetNaclCryptor.encrypt: Error encrypting message. There is no payload encrypted!');
            }
            return WebNativeCryptor_1.arrayBufferToHex(payload);
        });
    }
}
exports.TweetNaclCryptor = TweetNaclCryptor;
//# sourceMappingURL=TweetNaclCryptor.js.map