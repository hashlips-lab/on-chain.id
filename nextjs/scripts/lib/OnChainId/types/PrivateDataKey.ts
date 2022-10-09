import { ethers, BytesLike, Bytes } from 'ethers';

export const keyToString = (key: BytesLike): string => {
  try {
    return ethers.utils.parseBytes32String(key);
  } catch (error) {
    // Value doesn't contain a UTF-8 encoded string return the raw value
  }

  return ethers.utils.hexlify(key);
}

export const keyToBytes = (key: string): Bytes => {
  if (!ethers.utils.isHexString(key)) {
    key = ethers.utils.formatBytes32String(key);
  }

  if (ethers.utils.isBytesLike(key)) {
    return ethers.utils.arrayify(key);
  }

  throw new Error(`Unsupported key format: "${key}".`);
}
