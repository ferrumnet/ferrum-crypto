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
/**
 * Uses a cloud service to do all crypto-related tasks. No keys are managed locally
 */
class CloudCryptor {
    constructor(encSvc) {
        this.encSvc = encSvc;
    }
    decryptToHex(enc) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.encSvc.decrypt(enc);
        });
    }
    encryptHex(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.encSvc.encrypt(data);
        });
    }
    sha256(hexData) {
        return __awaiter(this, void 0, void 0, function* () {
            return WebNativeCryptor_1.sha256(hexData);
        });
    }
    __name__() { return 'CloudCryptor'; }
}
exports.CloudCryptor = CloudCryptor;
//# sourceMappingURL=CloudCryptor.js.map