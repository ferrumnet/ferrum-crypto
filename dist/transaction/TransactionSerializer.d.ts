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
export declare class TransactionSerializerFactory {
    static forNetwork(network: Network): EthereumTransactionSerializer;
}
//# sourceMappingURL=TransactionSerializer.d.ts.map