import { ethers, BytesLike } from 'ethers';

const _constructorGuard = { };

export type PrivateDataKeyLike = string | BytesLike | PrivateDataKey;

export class PrivateDataKey {
  private key: BytesLike;
  private name: string;

  constructor(constructorGuard: any, key: BytesLike, name: string) {
    if (constructorGuard !== _constructorGuard) {
        throw new Error('Cannot call constructor directly; use PrivateDataKey.from');
    }

    this.key = key;
    this.name = name;

    Object.freeze(this);
  }

  public getKey(): BytesLike {
    return this.key;
  }

  public getName(): string {
    return this.name;
  }

  static from(value: PrivateDataKeyLike): PrivateDataKey {
    if (value instanceof PrivateDataKey) {
      return value;
    }

    let name: string | undefined;
    let key: string | undefined;

    if (ethers.utils.isBytesLike(value)) {
      key = (typeof value === 'string') ? value : ethers.utils.hexlify(value);

      try {
        name = ethers.utils.parseBytes32String(value);
      } catch (error) {
        // Value doesn't contain a UTF-8 encoded string
        name = (typeof value === 'string') ? value : key;
      }
    } else {
      name = value;
      key = ethers.utils.formatBytes32String(value);
    }

    if (name === undefined || key === undefined) {
      throw new Error('Invalid PrivateDataKey value');
    }

    return new PrivateDataKey(_constructorGuard, key, name);
  }
}
