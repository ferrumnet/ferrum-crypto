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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const cross_fetch_1 = __importStar(require("cross-fetch"));
/**
 * This should NOT be used in a browser or mobile app.
 */
class LambdaEncryptionService {
    constructor(endpoint, lambdaSecret) {
        this.lambdaSecret = lambdaSecret;
        // this.lambdaSecret = config.custom.lambdaSecret ||
        //  config.secrets['ADDRESS_MANAGER_SECRET_KEY'];
        // this.endpoint = config.custom.lambdaEncryptionEndpoint;
        this.endpoint = endpoint;
        if (!this.endpoint) {
            throw new Error('LambdaEncryptionService: Endpoint not initialized: ' +
                'Make sure to provide the config endpoint in "custom.lambdaEncryptionEndpoint"');
        }
    }
    call(command, data) {
        return __awaiter(this, void 0, void 0, function* () {
            // TODO: Address manager lambda does not implement standard JSON RPC api. Migrate
            // res = requests.post(_END_POINT,
            //     headers={'x-command': command, 'x-secret': self.lambda_secret},
            //     data=json.dumps(data))
            const headers = new cross_fetch_1.Headers();
            headers.append('x-command', command);
            headers.append('x-secret', this.lambdaSecret);
            headers.append('Content-Type', 'application/json');
            const res = yield cross_fetch_1.default(this.endpoint, {
                headers,
                body: data,
                method: 'POST',
            });
            const result = yield res.text();
            // tslint:disable-next-line:no-magic-numbers
            if (res.status > 300) {
                throw new Error(`LambdaEncryptionService:Error - ${res.statusText}:${result}`);
            }
            return result;
        });
    }
    /**
     * Encrypts a data. Needs a buffer and returns @EncryptedData
     */
    encrypt(data) {
        return __awaiter(this, void 0, void 0, function* () {
            // @ts-ignore
            const res = yield this.call('encrypt', JSON.stringify({ data: data.toString('base64') }));
            return JSON.parse(res);
        });
    }
    /**\
     * Decrypts the data. Returns a buffer
     */
    decrypt(enc) {
        return __awaiter(this, void 0, void 0, function* () {
            // const key = isBase64 ? enc.key : Buffer.from(enc.key, 'hex').toString('base64');
            // const data = isBase64 ? enc.key : Buffer.from(enc.data, 'hex').toString('base64');
            const res = yield this.call('decrypt', JSON.stringify(Object.assign({}, enc)));
            // @ts-ignore
            return Buffer.from(res, 'base64');
        });
    }
    __name__() {
        return 'LambdaEncryptionService';
    }
}
exports.LambdaEncryptionService = LambdaEncryptionService;
//# sourceMappingURL=LambdaEncryptionService.js.map