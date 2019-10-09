"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class CryptorError extends Error {
}
exports.CryptorError = CryptorError;
class Algo {
}
exports.Algo = Algo;
Algo.SIZES = {
    KEY_SIZE: 32,
    NONCE_SIZE: 24,
};
Algo.ENCRYPTION = {
    AES: 'aes',
};
//# sourceMappingURL=CryptorService.js.map