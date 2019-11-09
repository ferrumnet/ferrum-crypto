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
Object.defineProperty(exports, "__esModule", { value: true });
const WebNativeCryptor_1 = require("./WebNativeCryptor");
class CryptoJsKeyProvider {
    getKey(keyId) {
        throw new Error('Not implemented');
    }
    newKeyId() {
        throw new Error('Not implemented');
    }
    randomHex(keySize) {
        return __awaiter(this, void 0, void 0, function* () {
            return WebNativeCryptor_1.randomBytes(keySize || 32);
        });
    }
    __name__() { return 'CryptoJsKeyProvider'; }
}
exports.CryptoJsKeyProvider = CryptoJsKeyProvider;
//# sourceMappingURL=CryptoJsKeyProvider.js.map