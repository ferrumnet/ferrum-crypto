import { TransactionSerializer, TransactionSerializerResult } from "./TransactionSerializer";
import { sha3 } from "../cryptor/WebNativeCryptor";
import * as rlp from 'rlp';
import { ValidationUtils } from "ferrum-plumbing";
import BN from 'bn.js';

export class EthereumTransactionSerializer implements TransactionSerializer {
    constructor( private chainId: number, ) { }
    verifySend(tx: any, from: string, to: string, currency: string, amountBigInt: string) {
        // For eth.
        ValidationUtils.isTrue(!!currency && currency.indexOf(':')>0, '"currency" is requried');
        ValidationUtils.isTrue(!!to, '"to" is requried');
        ValidationUtils.isTrue(!!amountBigInt, '"amountBigInt" is requried');
        ValidationUtils.isTrue(!!tx, '"tx" is requried');
        const cur = currency.split(':')[1];
        if (cur === 'ETH') {
            return (
                tx.to === to &&
                new BN(amountBigInt).toString('hex') === stripHexPrefix(tx.value)
            );
        } else { // ERC 20?
            const methodId = '0xa9059cbb';
            const _to = stripHexPrefix(to.toLowerCase());
            const toFullHex = '0'.repeat(64 - _to.length) + _to;
            const amount = new BN(amountBigInt).toString('hex');
            const amountFullHex = '0'.repeat(64 - amount.length) + amount;
            const data = methodId + toFullHex + amountFullHex;
            return (
                tx.to === cur &&
                new BN(stripHexPrefix(tx.value) || '0').eq(new BN(0)) &&
                tx.data === data
            );
        }
    }

    verifyData(tx: any, from: string, to: string, data: string, amountBigInt: string) {
        return (
            tx.from === from &&
            tx.to === to &&
            stripHexPrefix(tx.data) === data &&
            tx.value === '0x'
        );
    }

    serialize(tx: any): TransactionSerializerResult {
        // Define Properties
        const fields = [
        {
            name: 'nonce',
            length: 32,
            allowLess: true,
            default: Buffer.from([]),
        },
        {
            name: 'gasPrice',
            length: 32,
            allowLess: true,
            default: Buffer.from([]),
        },
        {
            name: 'gasLimit',
            alias: 'gas',
            length: 32,
            allowLess: true,
            default: Buffer.from([]),
        },
        {
            name: 'to',
            allowZero: true,
            length: 20,
            default: Buffer.from([]),
        },
        {
            name: 'value',
            length: 32,
            allowLess: true,
            default: Buffer.from([]),
        },
        {
            name: 'data',
            alias: 'input',
            allowZero: true,
            default: Buffer.from([]),
        },
        {
            name: 'v',
            allowZero: true,
            default: Buffer.from([]),
        },
        {
            name: 'r',
            length: 32,
            allowZero: true,
            allowLess: true,
            default: Buffer.from([]),
        },
        {
            name: 's',
            length: 32,
            allowZero: true,
            allowLess: true,
            default: Buffer.from([]),
        },
        ];
        const raw: any = [];
        fields.forEach((field: any, i: number) => {
            setter(raw, field, i, tx[field.name]);
        })
        const serializedTransaction = this._serialize(raw).toString('hex');
        const signableHex = this.hash(raw, false).toString('hex');
        return {serializedTransaction, signableHex};
    }

    /**
     * Returns the rlp encoding of the transaction
     */
    _serialize(raw: any): Buffer {
        // Note: This never gets executed, defineProperties overwrites it.
        return rlp.encode(raw);
    }

   /**
   * Computes a sha3-256 hash of the serialized tx
   * @param includeSignature - Whether or not to include the signature
   */
    private hash(raw: any, includeSignature: boolean = true): Buffer {
        let items
        if (includeSignature) {
        items = raw
        } else {
            items = [
            ...raw.slice(0, 6),
            intToBuffer(this.chainId),
            unpadBuffer(intToBuffer(0)),
            unpadBuffer(intToBuffer(0)),
            ]
        };

        // create hash
        return rlphash(items)
    }

    private _implementsEIP155(): boolean { return true; }
}

/**
 * Attempts to turn a value into a `Buffer`. As input it supports `Buffer`, `String`, `Number`, null/undefined, `BN` and other objects with a `toArray()` method.
 * @param v the value
 */
export const toBuffer = function(v: any): Buffer {
    if (!Buffer.isBuffer(v)) {
      if (Array.isArray(v)) {
        v = Buffer.from(v)
      } else if (typeof v === 'string') {
        if (isHexString(v)) {
          v = Buffer.from(padToEven(stripHexPrefix(v)), 'hex')
        } else {
          throw new Error(
            `Cannot convert string to buffer. toBuffer only supports 0x-prefixed hex strings and this string was given: ${v}`,
          )
        }
      } else if (typeof v === 'number') {
        v = intToBuffer(v)
      } else if (v === null || v === undefined) {
        v = Buffer.allocUnsafe(0)
      } else if (BN.isBN(v)) {
        v = v.toArrayLike(Buffer)
      } else if (v.toArray) {
        // converts a BN to a Buffer
        v = Buffer.from(v.toArray())
      } else {
        throw new Error('invalid type')
      }
    }
    return v
  }

/**
 * Converts a `Number` into a hex `String`
 * @param {Number} i
 * @return {String}
 */
function intToHex(i: number) {
    var hex = i.toString(16); // eslint-disable-line
  
    return `0x${hex}`;
}

/**
 * Converts an `Number` to a `Buffer`
 * @param {Number} i
 * @return {Buffer}
 */
function intToBuffer(i: number) {
    const hex = intToHex(i);
  
    return new Buffer(padToEven(hex.slice(2)), 'hex');
  }

 /**
 * Pads a `String` to have an even length
 * @param {String} value
 * @return {String} output
 */
function padToEven(value: any) {
  var a = value; // eslint-disable-line

  if (typeof a !== 'string') {
    throw new Error(`[ethjs-util] while padding to even, value must be string, is currently ${typeof a}, while padToEven.`);
  }

  if (a.length % 2) {
    a = `0${a}`;
  }

  return a;
}

/**
 * Trims leading zeros from a `Buffer`.
 * @param a (Buffer)
 * @return (Buffer)
 */
export const unpadBuffer = function(a: Buffer): Buffer {
    return stripZeros(a) as Buffer
}

  /**
 * Trims leading zeros from a `Buffer`, `String` or `Number[]`.
 * @param a (Buffer|Array|String)
 * @return (Buffer|Array|String)
 */
const stripZeros = function(a: any): Buffer | number[] | string {
    let first = a[0]
    while (a.length > 0 && first.toString() === '0') {
      a = a.slice(1)
      first = a[0]
    }
    return a
  }

/**
 * Creates SHA-3 hash of the RLP encoded version of the input.
 * @param a The input data
 */
export const rlphash = function(a: rlp.Input): Buffer {
    return Buffer.from(sha3(rlp.encode(a).toString('hex')), 'hex');
}


function setter(raw: any, field: any, i: number, v: any) {
    v = toBuffer(v)

    if (v.toString('hex') === '00' && !field.allowZero) {
    v = Buffer.allocUnsafe(0)
    }

    if (field.allowLess && field.length) {
    v = unpadBuffer(v)
    ValidationUtils.isTrue(
        field.length >= v.length,
        `The field ${field.name} must not have more ${field.length} bytes`,
    )
    } else if (!(field.allowZero && v.length === 0) && field.length) {
    ValidationUtils.isTrue(
        field.length === v.length,
        `The field ${field.name} must have byte length of ${field.length}`,
    )
    }

    raw[i] = v
}

/**
 * Is the string a hex string.
 *
 * @method check if string is hex string of specific length
 * @param {String} value
 * @param {Number} length
 * @returns {Boolean} output the string is a hex string
 */
function isHexString(value: any, length?: number) {
    if (typeof(value) !== 'string' || !value.match(/^0x[0-9A-Fa-f]*$/)) {
      return false;
    }
  
    if (length && value.length !== 2 + 2 * length) { return false; }
  
    return true;
  }

/**
 * Removes '0x' from a given `String` if present
 * @param {String} str the string value
 * @return {String|Optional} a string by pass if necessary
 */
function stripHexPrefix(str: any) {
    if (typeof str !== 'string') {
      return str;
    }
  
    return (str || '').startsWith('0x') ? str.slice(2) : str;
  }