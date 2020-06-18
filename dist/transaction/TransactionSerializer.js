"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const EthereumTransactionSerializer_1 = require("./EthereumTransactionSerializer");
class TransactionSerializerFactory {
    static forNetwork(network) {
        switch (network) {
            case 'ETHEREUM':
                return new EthereumTransactionSerializer_1.EthereumTransactionSerializer(1);
            case 'RINKEBY':
                return new EthereumTransactionSerializer_1.EthereumTransactionSerializer(4);
            default:
                throw new Error('TransactionSerializerFactory.forNetwork: Chain not supported ' + network);
        }
    }
}
exports.TransactionSerializerFactory = TransactionSerializerFactory;
//# sourceMappingURL=TransactionSerializer.js.map