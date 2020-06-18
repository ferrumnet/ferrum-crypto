/// <reference types="node" />
import { TransactionSerializer, TransactionSerializerResult } from "./TransactionSerializer";
import * as rlp from 'rlp';
export declare class EthereumTransactionSerializer implements TransactionSerializer {
    private chainId;
    constructor(chainId: number);
    verifySend(tx: any, from: string, to: string, currency: string, amountBigInt: string): boolean;
    verifyData(tx: any, from: string, to: string, data: string, amountBigInt: string): boolean;
    serialize(tx: any): TransactionSerializerResult;
    /**
     * Returns the rlp encoding of the transaction
     */
    _serialize(raw: any): Buffer;
    /**
    * Computes a sha3-256 hash of the serialized tx
    * @param includeSignature - Whether or not to include the signature
    */
    private hash;
    private _implementsEIP155;
}
/**
 * Attempts to turn a value into a `Buffer`. As input it supports `Buffer`, `String`, `Number`, null/undefined, `BN` and other objects with a `toArray()` method.
 * @param v the value
 */
export declare const toBuffer: (v: any) => Buffer;
/**
 * Trims leading zeros from a `Buffer`.
 * @param a (Buffer)
 * @return (Buffer)
 */
export declare const unpadBuffer: (a: Buffer) => Buffer;
/**
 * Creates SHA-3 hash of the RLP encoded version of the input.
 * @param a The input data
 */
export declare const rlphash: (a: rlp.Input) => Buffer;
//# sourceMappingURL=EthereumTransactionSerializer.d.ts.map