import { EncryptedData, HexString, Injectable } from 'ferrum-plumbing';
import fetch, { Headers } from 'cross-fetch';

/**
 * This should NOT be used in a browser or mobile app.
 */
export class LambdaEncryptionService implements Injectable {
  private readonly lambdaSecret: string;
  private readonly endpoint: string;
  constructor(endpoint: string, lambdaSecret: string) {
    this.lambdaSecret = lambdaSecret;
    this.endpoint = endpoint;
    if (!this.endpoint) {
      throw new Error('LambdaEncryptionService: Endpoint not initialized: ' +
                'Make sure to provide the config endpoint in "custom.lambdaEncryptionEndpoint"');
    }
  }

  private async call(command: string, data: string): Promise<string> {
        // TODO: Address manager lambda does not implement standard JSON RPC api. Migrate
        // res = requests.post(_END_POINT,
        //     headers={'x-command': command, 'x-secret': self.lambda_secret},
        //     data=json.dumps(data))
    const headers = new Headers();
    headers.append('x-command', command);
    headers.append('x-secret', this.lambdaSecret);
    headers.append('Content-Type', 'application/json');
    const res = await fetch(
      this.endpoint, {
        headers,
        body: data,
        method: 'POST',
      });
    const result = await res.text();
      // tslint:disable-next-line:no-magic-numbers
    if (res.status > 300) {
      throw new Error(`LambdaEncryptionService:Error - ${res.statusText}:${result}`);
    }
    return result;
  }

    /**
     * Encrypts a data. Needs a buffer and returns @EncryptedData
     */
  async encrypt(data: HexString): Promise<EncryptedData> {
    // @ts-ignore
    const dataBuffer = Buffer.from(data, 'hex');
    // @ts-ignore
    const res = await this.call('encrypt', JSON.stringify({ data: dataBuffer.toString('base64') }));
    return JSON.parse(res) as EncryptedData;
  }

    /**\
     * Decrypts the data. Returns a buffer
     */
  async decrypt(enc: EncryptedData): Promise<HexString> {
        // const key = isBase64 ? enc.key : Buffer.from(enc.key, 'hex').toString('base64');
        // const data = isBase64 ? enc.key : Buffer.from(enc.data, 'hex').toString('base64');
    const res = await this.call(
      'decrypt',
      JSON.stringify({ ...enc }));
    // @ts-ignore
    return Buffer.from(res, 'base64').toString('hex');
  }

  __name__(): string {
    return 'LambdaEncryptionService';
  }
}
