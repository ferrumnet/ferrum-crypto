"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AddressFromPublicKey_1 = require("./AddressFromPublicKey");
const dummyPrivateKey = 'f4402ff66db8098b5515f67c1b36fb07213f82dcd9b574b56b6f7fefbee6d57f';
const dummyPublicKey = '043073a2e08e757842a174d3ae1bee948a73b6194de86e07626350f11c71273dca5444e672bd11d0db02e93324584cefdb7afe2bc73bede846c84a0294ecd1c10f';
const dummyPublicKeyCompressed = '033073a2e08e757842a174d3ae1bee948a73b6194de86e07626350f11c71273dca';
test('ETH', () => {
    const expectedAddress = '0x5d91e4167207740f73c1e08d62B2564beE979Ef3';
    const actual = new AddressFromPublicKey_1.AddressFromPublicKey().forNetwork('ETHEREUM', dummyPublicKeyCompressed, dummyPublicKey);
    expect(actual).toBe(expectedAddress);
});
test('FRM', () => {
    const expectedAddress = 'fx5d91e4167207740f73c1e08d62B2564beE979Ef3';
    const actual = new AddressFromPublicKey_1.AddressFromPublicKey().forNetwork('FERRUM', dummyPublicKeyCompressed, dummyPublicKey);
    expect(actual).toBe(expectedAddress);
});
test('BNB', () => {
    const expectedAddress = 'bnb12cwfj4vv63pzwrty4j85rd74gkm8gdutnlrqcj';
    const actual = new AddressFromPublicKey_1.AddressFromPublicKey().forNetwork('BINANCE', dummyPublicKeyCompressed, dummyPublicKey);
    expect(actual).toBe(expectedAddress);
});
test('BTC', () => {
    const expectedAddress = '1G1wucY23Agco3iaBnhL4DjQFFZxVbcAYy';
    const actual = new AddressFromPublicKey_1.AddressFromPublicKey().forNetwork('BITCOIN', dummyPublicKeyCompressed, dummyPublicKey);
    expect(actual).toBe(expectedAddress);
});
//# sourceMappingURL=AddressFromPublicKey.test.js.map