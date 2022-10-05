import { ethers, BigNumber, BytesLike } from 'ethers';
import { useDebounce } from 'use-debounce';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { useContractRead, useContractWrite, usePrepareContractWrite } from 'wagmi';
import { SendTransactionResult } from '@wagmi/core';
import { useContractContext } from './ContractConfigContext';
import PrivateDataKey from './lib/OnChainId/types/PrivateDataKey';

const DEFAULT_PAGINATION_VALUE = 10;

interface PrivateData {
  key: PrivateDataKey;
  data: string;
}

interface PermissionsEntry {
  key: PrivateDataKey;
  canRead: boolean;
}

interface Props {
  children: ReactNode;
}

interface OnChainIdInterface {
  privateData: PrivateData[];
  refreshPrivateData: (entriesPerPage?: number) => void;
  isPrivateDataRefreshing: boolean;
  allowedProviders: string[];
  refreshAllowedProviders: (providersPerPage?: number) => void;
  areAllowedProvidersRefreshing: boolean;
  permissions: PermissionsEntry[];
  refreshPermissions: (provider: string, providersPerPage?: number) => void;
  arePermissionsRefreshing: boolean;
}

interface GetPrivateDataProgress {
  isLoading: boolean;
  nextStartKey?: BytesLike;
  entriesPerPage: number;
  currentData: PrivateData[];
}

interface GetAllowedProvidersProgress {
  isLoading: boolean;
  nextStartProvider?: string;
  providersPerPage: number;
  currentData: string[];
}

interface GetPermissionsProgress {
  isLoading: boolean;
  provider?: string;
  nextStartKey?: BytesLike;
  entriesPerPage: number;
  currentData: PermissionsEntry[];
}

const OnChainIdContext = createContext({} as OnChainIdInterface);

export function useOnChainIdContext() {
    return useContext(OnChainIdContext);
}

export function OnChainIdProvider({ children }: Props) {
  const { onChainIdContractConfigBuilder } = useContractContext();
  const [ getPrivateDataProgress, setGetPrivateDataProgress ] = useState<GetPrivateDataProgress>();
  const [ getAllowedProvidersProgress, setGetAllowedProvidersProgress ] = useState<GetAllowedProvidersProgress>();
  const [ getPermissionsProgress, setGetPermissionsProgress ] = useState<GetPermissionsProgress>();

  // Private data
  const { refetch: getDataEntries } = useContractRead(onChainIdContractConfigBuilder({
    functionName: 'getDataEntries',
    args: [ getPrivateDataProgress?.nextStartKey ?? ethers.constants.HashZero, getPrivateDataProgress == undefined ? 0 : getPrivateDataProgress.entriesPerPage ],
    enabled: false,
  }));

  const refreshPrivateData = (entriesPerPage: number = DEFAULT_PAGINATION_VALUE) => {
    setGetPrivateDataProgress({
      isLoading: true,
      nextStartKey: undefined,
      entriesPerPage,
      currentData: [],
    });
  };

  useEffect(() => {
    (async () => {
      if (getPrivateDataProgress?.isLoading === true) {
        const privateData = (await getDataEntries()).data as { key: string, data: string }[];

        if (privateData === undefined) {
          throw new Error('Something went wrong...');
        }

        const isLoading = privateData.length > 0;
        const normalizedPrivateData = privateData.map(entry => ({ key: PrivateDataKey.from(entry.key), data: entry.data }));

        setGetPrivateDataProgress({
          isLoading,
          nextStartKey: isLoading ? normalizedPrivateData[normalizedPrivateData.length - 1].key.getKey() : ethers.constants.HashZero,
          entriesPerPage: getPrivateDataProgress.entriesPerPage,
          currentData: getPrivateDataProgress.currentData.concat(normalizedPrivateData),
        });
      }
    })();
  }, [ getPrivateDataProgress ]);

  // Allowed providers
  const { refetch: getAllowedProviders } = useContractRead(onChainIdContractConfigBuilder({
    functionName: 'getAllowedProviders',
    args: [ getAllowedProvidersProgress?.nextStartProvider ?? ethers.constants.AddressZero, getAllowedProvidersProgress == undefined ? 0 : getAllowedProvidersProgress.providersPerPage ],
    enabled: false,
  }));

  const refreshAllowedProviders = (providersPerPage: number = DEFAULT_PAGINATION_VALUE) => {
    setGetAllowedProvidersProgress({
      isLoading: true,
      nextStartProvider: undefined,
      providersPerPage,
      currentData: [],
    });
  };

  useEffect(() => {
    (async () => {
      if (getAllowedProvidersProgress?.isLoading === true) {
        const allowedProviders = (await getAllowedProviders()).data as string[];

        if (allowedProviders === undefined) {
          throw new Error('Something went wrong...');
        }

        const isLoading = allowedProviders.length > 0;

        setGetAllowedProvidersProgress({
          isLoading,
          nextStartProvider: isLoading ? allowedProviders[allowedProviders.length - 1] : ethers.constants.HashZero,
          providersPerPage: getAllowedProvidersProgress.providersPerPage,
          currentData: getAllowedProvidersProgress.currentData.concat(allowedProviders),
        });
      }
    })();
  }, [ getAllowedProvidersProgress ]);

  // Private data
  const { refetch: getPermissions } = useContractRead(onChainIdContractConfigBuilder({
    functionName: 'getPermissions',
    args: [
      getPermissionsProgress?.provider ?? ethers.constants.AddressZero,
      getPermissionsProgress?.nextStartKey ?? ethers.constants.HashZero,
      getPermissionsProgress == undefined ? 0 : getPermissionsProgress.entriesPerPage,
    ],
    enabled: false,
  }));

  const refreshPermissions = (provider: string, entriesPerPage: number = DEFAULT_PAGINATION_VALUE) => {
    setGetPermissionsProgress({
      isLoading: true,
      provider, 
      nextStartKey: undefined,
      entriesPerPage,
      currentData: [],
    });
  };

  useEffect(() => {
    (async () => {
      if (getPermissionsProgress?.isLoading === true) {
        const permissions = (await getPermissions()).data as { key: string, canRead: boolean }[];

        if (permissions === undefined) {
          throw new Error('Something went wrong...');
        }

        const isLoading = permissions.length > 0;
        const normalizedPrivateData = permissions.map(entry => ({ key: PrivateDataKey.from(entry.key), canRead: entry.canRead }));

        setGetPermissionsProgress({
          isLoading,
          provider: getPermissionsProgress.provider,
          nextStartKey: isLoading ? normalizedPrivateData[normalizedPrivateData.length - 1].key.getKey() : ethers.constants.HashZero,
          entriesPerPage: getPermissionsProgress.entriesPerPage,
          currentData: getPermissionsProgress.currentData.concat(normalizedPrivateData),
        });
      }
    })();
  }, [ getPermissionsProgress ]);

  const value: OnChainIdInterface = {
    privateData: getPrivateDataProgress?.currentData === undefined ? []: getPrivateDataProgress.currentData,
    refreshPrivateData,
    isPrivateDataRefreshing: getPrivateDataProgress?.isLoading === true,
    allowedProviders: getAllowedProvidersProgress?.currentData === undefined ? []: getAllowedProvidersProgress.currentData,
    refreshAllowedProviders,
    areAllowedProvidersRefreshing: getAllowedProvidersProgress?.isLoading === true,
    permissions: getPermissionsProgress?.currentData === undefined ? []: getPermissionsProgress.currentData,
    refreshPermissions,
    arePermissionsRefreshing: getPermissionsProgress?.isLoading === true,
  };

  return (
    <OnChainIdContext.Provider value={value}>
      {children}
    </OnChainIdContext.Provider>
  );
}
