import { ContractInterface } from  'ethers';
import React, { createContext, ReactNode, useContext } from  'react';
import { useAccount } from 'wagmi';

interface Props {
  children: ReactNode;
}

type ContractConfigBuilder = (contractConfiguration: any) => any;

interface UseContractInterface {
  onChainIdContractConfigBuilder: ContractConfigBuilder;
}

interface PartialContractConfigurationInterface {
  addressOrName: string;
  contractInterface: ContractInterface;
  overrides: { from?: string },
}
const onChainId = require('../../hardhat/artifacts/contracts/OnChainId.sol/OnChainId.json');

const UseContractContext = createContext({} as UseContractInterface);

export function useContractContext() {
    return useContext(UseContractContext);
}

export function UseContractProvider({ children }: Props) {
  const { address } = useAccount();

  const generateContractConfigBuilder = (partialContractConfiguration: PartialContractConfigurationInterface): ContractConfigBuilder => {
    return (contractConfiguration) => {
      return {...partialContractConfiguration, ...contractConfiguration};
    };
  }

  const value = {
    onChainIdContractConfigBuilder: generateContractConfigBuilder({
      addressOrName: process.env.NEXT_PUBLIC_ON_CHAIN_ID_ADDRESS!,
      contractInterface: onChainId.abi,
      // TODO: why do read calls randomly use the wrong address when moving between wallets??
      overrides: { from: address },
    }),
  } as UseContractInterface;

  return (
    <UseContractContext.Provider value={value}>
      {children}
    </UseContractContext.Provider>
  );
}
