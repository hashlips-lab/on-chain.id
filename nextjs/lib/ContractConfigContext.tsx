import { ContractInterface } from  'ethers';
import React, { createContext, ReactNode, useContext, useEffect, useState } from  'react';
import { useAccount, useContract, useNetwork, useSigner } from 'wagmi';
import onChainId from '../../hardhat/artifacts/contracts/OnChainId.sol/OnChainId.json';
import { OnChainId as OnChainIdContract } from '../../hardhat/typechain-types';
import * as sapphire from '@oasisprotocol/sapphire-paratime';

const CONTRACT_ADDRESSES = new Map<number, string>([
  // HardHat local node
  [ 31337, '0x5FbDB2315678afecb367f032d93F642f64180aa3' ],
  // Sapphire testnet
  [ sapphire.NETWORKS.testnet.chainId, '0x164C9907E44D5D8e404B0c68dFD918d2181239ad' ],
]);
interface Props {
  children: ReactNode;
}

type ContractConfigBuilder = (contractConfiguration: any) => any;

interface UseContractInterface {
  onChainIdContract: OnChainIdContract,
  onChainIdContractConfigBuilder: ContractConfigBuilder;
}

interface PartialContractConfigurationInterface {
  addressOrName: string;
  contractInterface: ContractInterface;
  overrides: { from?: string },
}

const UseContractContext = createContext({} as UseContractInterface);

export function useContractContext() {
  return useContext(UseContractContext);
}

export function UseContractProvider({ children }: Props) {
  const { data: signer } = useSigner();
  const { chain } = useNetwork();
  const { address } = useAccount();
  const [ contractAddress, setContractAddress ] = useState<string>();
  const onChainIdContract = useContract({
    addressOrName: contractAddress ?? CONTRACT_ADDRESSES.values().next().value,
    contractInterface: onChainId.abi,
    signerOrProvider: signer,
  });

  const generateContractConfigBuilder = (
    partialContractConfiguration: PartialContractConfigurationInterface,
  ): ContractConfigBuilder => {
    return (contractConfiguration) => {
      return { ...partialContractConfiguration, ...contractConfiguration };
    };
  };

  useEffect(() => {
    if (chain) {
      setContractAddress(CONTRACT_ADDRESSES.get(chain.id));
    }
  }, [ chain ]);

  const value = {
    onChainIdContract,
    onChainIdContractConfigBuilder: generateContractConfigBuilder({
      addressOrName: contractAddress ?? CONTRACT_ADDRESSES.values().next().value,
      contractInterface: onChainId.abi,
      // TODO: investigate this
      // Read calls randomly use the wrong address when moving between wallets
      overrides: { from: address },
    }),
  } as UseContractInterface;

  return (
    <UseContractContext.Provider value={value}>
      {children}
    </UseContractContext.Provider>
  );
}
