import { AsymetricCryptorService, AsymetricKeyPair, AsymetricSharedKey } from './CryptorService';
import { HexString } from 'ferrum-plumbing';
export declare class TweetNaclCryptor implements AsymetricCryptorService {
    keyPair(secret: string): AsymetricKeyPair;
    decrypt(encMessage: HexString, nonce: HexString, sharedKey: AsymetricSharedKey): Promise<HexString>;
    encrypt(message: HexString, nonce: HexString, sharedKey: AsymetricSharedKey): Promise<HexString>;
}
//# sourceMappingURL=TweetNaclCryptor.d.ts.map