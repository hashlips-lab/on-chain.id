import { keccak256, toUtf8Bytes, formatBytes32String } from 'ethers/lib/utils';
import { ethers } from 'hardhat';

async function main() {
  const OnChainId = await ethers.getContractFactory('OnChainId');
  const onChainId = await OnChainId.attach('0x5FbDB2315678afecb367f032d93F642f64180aa3');

  await onChainId.writeMultipleData([
    { key: formatBytes32String('Discord'), data: 'User#1234' },
    { key: formatBytes32String('Email'), data: 'test@example.com' },
    { key: keccak256(toUtf8Bytes('Custom key (hash)')), data: 'User#1234' },
  ]);

  await onChainId.writePermissions('0x70997970C51812dc3A010C7d01b50e0d17dc79C8', [
    { key: formatBytes32String('Discord'), canRead: true },
    { key: keccak256(toUtf8Bytes('Custom key (hash)')), canRead: true },
  ], onChainId.NO_EXPIRATION_VALUE());

  await onChainId.writePermissions('0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC', [
    { key: formatBytes32String('Email'), canRead: true },
  ], onChainId.NO_EXPIRATION_VALUE());
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
