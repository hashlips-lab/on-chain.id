import { ethers } from "hardhat";

async function main() {
  const OnChainId = await ethers.getContractFactory("OnChainId");
  const onChainId = await OnChainId.deploy();

  await onChainId.deployed();

  console.log(`Collection deployed to ${onChainId.address}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
