import '@oasisprotocol/sapphire-hardhat';
import * as sapphire from '@oasisprotocol/sapphire-paratime';
import * as dotenv from 'dotenv';
import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "solidity-coverage";
import "hardhat-contract-sizer";

dotenv.config();

const config: HardhatUserConfig = {
  solidity: {
    "version": "0.8.11",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    truffle: {
      url: 'http://localhost:24012/rpc',
      timeout: 60000,
    },
    sapphire: {
      chainId: sapphire.NETWORKS.testnet.chainId,
      url: sapphire.NETWORKS.testnet.defaultGateway,
      accounts: [
        process.env.PRIVATE_KEY ?? Buffer.alloc(32, 0).toString('hex'),
      ],
    },
  },
  gasReporter: {
    currency: "USD",
    gasPrice: 100,
    showTimeSpent: true,
  },
};

export default config;
