import { EthereumTransactionSerializer } from "./EthereumTransactionSerializer";

test('Serialize a send tx', () => {
    const serializedTransaction = 'eb808507ea8ed400825208948017877a1c06efbc7f444ac709119c1e209f26ee872bd72a2487400080808080';
    const signableHex = 'c122332f2b9deeec5e821807cde18237e418fd8ff13f9a25c8536265effe3e14';
    const transaction = {
          nonce: '0x00',
          gasPrice: '0x7ea8ed400',
          gasLimit: '0x5208',
          to: '0x8017877A1C06efbc7f444AC709119C1e209F26Ee',
          value: '0x2bd72a24874000',
          data: '0x'
        };
      const serializer = new EthereumTransactionSerializer(1);
      const res = serializer.serialize(transaction);
      expect(res.serializedTransaction).toBe(serializedTransaction);
      expect(res.signableHex).toBe(signableHex);

      const valid = serializer.verifySend(transaction, 'from',
        '0x8017877A1C06efbc7f444AC709119C1e209F26Ee', 'ETHEREUM:ETH', '12340000000000000');
      expect(valid).toBe(true);
      const nvalid = serializer.verifySend(transaction, 'from',
        '0x8017877A1C06efbc7f444AC709119C1e209F26Ee', 'ETHEREUM:ETH', '12340000000000001');
      expect(nvalid).toBe(false);
});

const FRM = '0xe5caef4af8780e59df925470b050fb23c43ca68c';
test('Serialize a smart contract tx', () => {
    const serializedTransaction= 'f86b8086246139ca80008301388094e5caef4af8780e59df925470b050fb23c43ca68c80b844a9059cbb0000000000000000000000008017877a1c06efbc7f444ac709119c1e209f26ee0000000000000000000000000000000000000000000000000000000006b3f141808080';
    const signableHex= 'b08ba497cc8ee9b80b569f3c267e9699dce57a65aa3fff5a8917c6ac4941cfdd';
    const transaction = {
          nonce: '0x00',
          gasPrice: '0x246139ca8000',
          gasLimit: '0x13880',
          to: '0xe5caef4af8780e59df925470b050fb23c43ca68c',
          value: '0x00',
          data: '0xa9059cbb0000000000000000000000008017877a1c06efbc7f444ac709119c1e209f26ee0000000000000000000000000000000000000000000000000000000006b3f141'
        };
    const serializer = new EthereumTransactionSerializer(1);
    const res = serializer.serialize(transaction);
    expect(res.serializedTransaction).toBe(serializedTransaction);
    expect(res.signableHex).toBe(signableHex);

    const valid = serializer.verifySend(transaction, 'from',
    '0x8017877A1C06efbc7f444AC709119C1e209F26Ee', `ETHEREUM:${FRM}`, '112456001');
    expect(valid).toBe(true);
    const nvalid = serializer.verifySend(transaction, 'from',
    '0x8017877A1C06efbc7f444AC709119C1e209F26Ee', `ETHEREUM:${FRM}`, '112456002');
    expect(nvalid).toBe(false);
});
