// TODO: This is a temporary page for this branch (remove before merge)

import { ethers, BigNumber, BytesLike } from 'ethers';
import { useDebounce } from 'use-debounce';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { useContractRead, useContractWrite, usePrepareContractWrite, useWaitForTransaction } from 'wagmi';
import { SendTransactionResult } from '@wagmi/core';
import { useContractContext } from './ContractConfigContext';
import { PrivateDataKey, PrivateDataKeyLike } from './lib/OnChainId/types/PrivateDataKey';

export const AccessDenied = 'AccessDenied';
export const DataAccessDenied = 'DataAccessDenied';

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
  noExpirationValue?: BigNumber;
  privateData: PrivateData[];
  refreshPrivateData: (entriesPerPage?: number) => void;
  isPrivateDataRefreshing: boolean;
  allowedProviders: string[];
  refreshAllowedProviders: (providersPerPage?: number) => void;
  areAllowedProvidersRefreshing: boolean;
  permissions: PermissionsEntry[];
  refreshPermissions: (provider: string, providersPerPage?: number) => void;
  arePermissionsRefreshing: boolean;
  providerExpiration: BigNumber | undefined;
  refreshProviderExpiration: (providerAddress: string) => void;
  userData: string | undefined;
  refreshUserData: (userAddress: string, key: PrivateDataKeyLike) => void;
  getUserDataError?: { name: string, expiration?: BigNumber };
  deleteUserData: (key: PrivateDataKey) => void;
  deleteDataResult?: ethers.providers.TransactionReceipt;
  isDeleteUserDataLoading: boolean;
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

  // NO_EXPIRATION_VALUE
  const { data: noExpirationValue } = useContractRead(onChainIdContractConfigBuilder({
    functionName: 'NO_EXPIRATION_VALUE',
    watch: false,
    // Using the zero address avoids signing TX when reading public data
    overrides: { from: ethers.constants.AddressZero },
  }));

  // getExpiration
  const [ getExpirationArgs, setGetExpirationArgs ] = useState<{ providerAddress: string }>();
  const [ debouncedGetExpirationArgs ] = useDebounce(getExpirationArgs, 500);
  const { data: getExpiration } = useContractRead(onChainIdContractConfigBuilder({
    functionName: 'getExpiration',
    args: [ debouncedGetExpirationArgs?.providerAddress ],
    watch: false,
    enabled: Boolean(debouncedGetExpirationArgs && ethers.utils.isAddress(debouncedGetExpirationArgs.providerAddress)),
  }));

  const refreshProviderExpiration = (providerAddress: string) => {
    setGetExpirationArgs({
      providerAddress,
    });
  };

  // getData
  const [ getDataArgs, setGetDataArgs ] = useState<{ userAddress: string, key: PrivateDataKey }>();
  const [ debouncedGetDataArgs ] = useDebounce(getDataArgs, 500);
  const { data: getData, error: getDataError } = useContractRead(onChainIdContractConfigBuilder({
    functionName: 'getData',
    args: [ debouncedGetDataArgs?.userAddress, debouncedGetDataArgs?.key.getKey() ],
    watch: false,
    enabled: Boolean(debouncedGetDataArgs && ethers.utils.isAddress(debouncedGetDataArgs.userAddress)),
  }));

  const refreshUserData = (userAddress: string, key: PrivateDataKeyLike) => {
    setGetDataArgs({
      userAddress,
      key: PrivateDataKey.from(key),
    });
  };

  // Private data
  const [ getPrivateDataProgress, setGetPrivateDataProgress ] = useState<GetPrivateDataProgress>();
  const { refetch: getDataEntries } = useContractRead(onChainIdContractConfigBuilder({
    functionName: 'getDataEntries',
    args: [
      getPrivateDataProgress?.nextStartKey ?? ethers.constants.HashZero,
      getPrivateDataProgress == undefined ? 0 : getPrivateDataProgress.entriesPerPage,
    ],
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
        const [ privateData, nextStartKey ] = (await getDataEntries()).data as [
          { key: PrivateDataKeyLike, data: string }[],
          string,
        ];

        if (privateData === undefined) {
          throw new Error('Something went wrong...');
        }

        const normalizedPrivateData = privateData.map(entry => ({ key: PrivateDataKey.from(entry.key), data: entry.data }));

        setGetPrivateDataProgress({
          isLoading: nextStartKey !== ethers.constants.HashZero,
          nextStartKey,
          entriesPerPage: getPrivateDataProgress.entriesPerPage,
          currentData: getPrivateDataProgress.currentData.concat(normalizedPrivateData),
        });
      }
    })();
  }, [ getPrivateDataProgress ]);

  // Allowed providers
  const [ getAllowedProvidersProgress, setGetAllowedProvidersProgress ] = useState<GetAllowedProvidersProgress>();
  const { refetch: getAllowedProviders } = useContractRead(onChainIdContractConfigBuilder({
    functionName: 'getAllowedProviders',
    args: [
      getAllowedProvidersProgress?.nextStartProvider ?? ethers.constants.AddressZero,
      getAllowedProvidersProgress == undefined ? 0 : getAllowedProvidersProgress.providersPerPage,
    ],
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
        const [ allowedProviders, nextStartProvider ] = (await getAllowedProviders()).data as [ string[], string ];

        if (allowedProviders === undefined) {
          throw new Error('Something went wrong...');
        }

        setGetAllowedProvidersProgress({
          isLoading: nextStartProvider !== ethers.constants.AddressZero,
          nextStartProvider,
          providersPerPage: getAllowedProvidersProgress.providersPerPage,
          currentData: getAllowedProvidersProgress.currentData.concat(allowedProviders),
        });
      }
    })();
  }, [ getAllowedProvidersProgress ]);

  // Get permissions
  const [ getPermissionsProgress, setGetPermissionsProgress ] = useState<GetPermissionsProgress>();
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
        const [ permissions, nextStartKey ] = (await getPermissions()).data as [
          { key: PrivateDataKeyLike, canRead: boolean }[],
          string,
        ];

        if (permissions === undefined) {
          throw new Error('Something went wrong...');
        }

        const normalizedPrivateData = permissions.map(entry => ({
          key: PrivateDataKey.from(entry.key),
          canRead: entry.canRead
        }));

        setGetPermissionsProgress({
          isLoading: nextStartKey !== ethers.constants.HashZero,
          provider: getPermissionsProgress.provider,
          nextStartKey,
          entriesPerPage: getPermissionsProgress.entriesPerPage,
          currentData: getPermissionsProgress.currentData.concat(normalizedPrivateData),
        });
      }
    })();
  }, [ getPermissionsProgress ]);

  // Delete data
  const [ writeDeleteDataArgs, setWriteDeleteDataArgs ] = useState<{ key?: BytesLike }>();
  const [ debouncedDeleteDataArgs ] = useDebounce(writeDeleteDataArgs, 500);
  const { config: deleteDataConfig } = usePrepareContractWrite(onChainIdContractConfigBuilder({
    functionName: 'deleteData',
    args: [ debouncedDeleteDataArgs?.key ],
    enabled: Boolean(debouncedDeleteDataArgs?.key),
  }));
  const { write: deleteDataWrite, isLoading: deleteDataIsLoading, data: deleteDataTx } = useContractWrite(deleteDataConfig);
  const { data: deleteDataResult } = useWaitForTransaction({ hash: deleteDataTx?.hash });

  const deleteData = (key: PrivateDataKeyLike) => {
    setWriteDeleteDataArgs({ key: PrivateDataKey.from(key).getKey() });
  };

  useEffect(() => {
    if (debouncedDeleteDataArgs?.key) {
      deleteDataWrite?.();
    }
  }, [ debouncedDeleteDataArgs ]);

  useEffect(() => {
    if (deleteDataResult) {
      setWriteDeleteDataArgs({ key: undefined });
      refreshPrivateData();
    }
  }, [ deleteDataResult ]);

  const value: OnChainIdInterface = {
    noExpirationValue: noExpirationValue as BigNumber | undefined,
    privateData: getPrivateDataProgress?.currentData === undefined ? []: getPrivateDataProgress.currentData,
    refreshPrivateData,
    isPrivateDataRefreshing: getPrivateDataProgress?.isLoading === true,
    allowedProviders: getAllowedProvidersProgress?.currentData === undefined ? []: getAllowedProvidersProgress.currentData,
    refreshAllowedProviders,
    areAllowedProvidersRefreshing: getAllowedProvidersProgress?.isLoading === true,
    permissions: getPermissionsProgress?.currentData === undefined ? []: getPermissionsProgress.currentData,
    refreshPermissions,
    arePermissionsRefreshing: getPermissionsProgress?.isLoading === true,
    providerExpiration: getExpiration as BigNumber | undefined,
    refreshProviderExpiration,
    userData: getData as string | undefined,
    refreshUserData,
    getUserDataError: getDataError === null ? undefined : {
      name: (getDataError as any).errorName,
      expiration: (getDataError as any)?.errorArgs[0] as BigNumber | undefined,
    },
    deleteUserData: deleteData,
    deleteDataResult,
    isDeleteUserDataLoading: deleteDataIsLoading,
  };

  return (
    <OnChainIdContext.Provider value={value}>
      {children}
    </OnChainIdContext.Provider>
  );
}
