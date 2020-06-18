import { Network } from "ferrum-plumbing";
import { EthereumTransactionSerializer } from "./EthereumTransactionSerializer";

export interface TransactionSerializerResult {
    serializedTransaction: string;
    signableHex: string;
}

export interface TransactionSerializer {
    serialize(tx: any): TransactionSerializerResult;
    verifySend(tx: any, from: string, to: string, currency: string, amountBigInt: string): boolean;
    verifyData(tx: any, from: string, to: string, data: string, amountBigInt: string): boolean;
}

export class TransactionSerializerFactory {
    static forNetwork(network: Network) {
        switch (network) {
            case 'ETHEREUM':
                return new EthereumTransactionSerializer(1);
            case 'RINKEBY':
                return new EthereumTransactionSerializer(4);
            default:
                throw new Error('TransactionSerializerFactory.forNetwork: Chain not supported ' + network);
        }
    }
}