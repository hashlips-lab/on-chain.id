import { ethers, BigNumber, BytesLike, Bytes } from 'ethers';
import { useDebounce } from 'use-debounce';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { useContractRead, useContractWrite, usePrepareContractWrite, useWaitForTransaction } from 'wagmi';
import { useContractContext } from './ContractConfigContext';
import { keyToString } from './types/PrivateDataKey';

export const AccessDenied = 'AccessDenied';
export const DataAccessDenied = 'DataAccessDenied';

const DEFAULT_PAGINATION_VALUE = 10;

interface WritePermissionsArgs {
  providerAddress: string;
  updatedPermissions: PermissionsEntry[];
  expiration: BigNumber;
}

export interface PrivateDataEntry {
  key: Bytes;
  data: string;
}

export interface PermissionsEntry {
  key: Bytes;
  canRead: boolean;
}

interface Props {
  children: ReactNode;
}

interface OnChainIdInterface {
  noExpirationValue?: BigNumber;

  onChainPrivateData: PrivateDataEntry[];
  refreshOnChainPrivateData: (entriesPerPage?: number) => void;
  isOnChainPrivateDataRefreshing: boolean;

  allowedProviders: string[];
  refreshAllowedProviders: (providersPerPage?: number) => void;
  areAllowedProvidersRefreshing: boolean;

  onChainPermissions: PermissionsEntry[];
  onChainPermissionsProvider?: string;
  refreshOnChainPermissions: (provider: string, providersPerPage?: number) => void;
  areOnChainPermissionsRefreshing: boolean;

  providerExpiration: BigNumber | undefined;
  refreshProviderExpiration: (providerAddress: string) => void;

  userData: string | undefined;
  refreshUserData: (userAddress: string, key: Bytes) => void;
  getUserDataError?: { name: string, expiration?: BigNumber };

  writePrivateData: (newPrivateData: PrivateDataEntry[]) => void;
  writePrivateDataResult?: ethers.providers.TransactionReceipt;
  isWritePrivateDataLoading?: boolean;

  deleteUserData: (key: Bytes) => void;
  deleteDataResult?: ethers.providers.TransactionReceipt;
  isDeleteUserDataLoading: boolean;

  writePermissions: (newPermissions: WritePermissionsArgs) => void;
  writePermissionsResult?: ethers.providers.TransactionReceipt;
  isWritePermissionsLoading?: boolean;

  disableProvider: (providerAddress: string) => void;
  disableProviderResult?: ethers.providers.TransactionReceipt;
  isDisableProviderLoading: boolean;
}

interface GetPrivateDataProgress {
  isLoading: boolean;
  nextStartKey?: BytesLike;
  entriesPerPage: number;
  currentData: PrivateDataEntry[];
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
  const { data: getExpiration, refetch: getExpirationRefetch } = useContractRead(onChainIdContractConfigBuilder({
    functionName: 'getExpiration',
    args: [ debouncedGetExpirationArgs?.providerAddress ],
    watch: false,
    enabled: Boolean(debouncedGetExpirationArgs && ethers.utils.isAddress(debouncedGetExpirationArgs.providerAddress)),
  }));

  const refreshProviderExpiration = (providerAddress: string) => {
    if (providerAddress === getExpirationArgs?.providerAddress) {
      getExpirationRefetch();

      return;
    }

    setGetExpirationArgs({
      providerAddress,
    });
  };

  // getData
  const [ getDataArgs, setGetDataArgs ] = useState<{ userAddress: string, key: Bytes }>();
  const [ debouncedGetDataArgs ] = useDebounce(getDataArgs, 500);
  const { data: getData, refetch: getDataRefetch, error: getDataError } = useContractRead(onChainIdContractConfigBuilder({
    functionName: 'getData',
    args: [
      debouncedGetDataArgs?.userAddress,
      debouncedGetDataArgs && ethers.utils.hexlify(debouncedGetDataArgs?.key),
    ],
    watch: false,
    enabled: Boolean(debouncedGetDataArgs && ethers.utils.isAddress(debouncedGetDataArgs.userAddress)),
  }));

  const refreshUserData = (userAddress: string, key: Bytes) => {
    if (userAddress === getDataArgs?.userAddress && keyToString(key) === keyToString(getDataArgs.key)) {
      getDataRefetch();

      return;
    }

    setGetDataArgs({
      userAddress,
      key,
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
          { key: BytesLike, data: string }[],
          string,
        ];

        if (privateData === undefined) {
          throw new Error('Something went wrong...');
        }

        const normalizedPrivateData = privateData.map(entry => ({
          key: ethers.utils.arrayify(entry.key),
          data: entry.data,
        }));

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
          { key: BytesLike, canRead: boolean }[],
          string,
        ];

        if (permissions === undefined) {
          throw new Error('Something went wrong...');
        }

        const normalizedPrivateData = permissions.map(entry => ({
          key: ethers.utils.arrayify(entry.key),
          canRead: entry.canRead,
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

  // Write multiple data
  const filterUpdatedPrivateData = (newPrivateData?: PrivateDataEntry[]): PrivateDataEntry[] => {
    const onChainPrivateData = getPrivateDataProgress?.currentData ?? [];

    if (!newPrivateData) {
      return [];
    }

    const updatedPrivateData: PrivateDataEntry[] = [];
    const onChainPrivateDataMap: Map<string, string> = new Map(onChainPrivateData.map(
      entry => [ keyToString(entry.key), entry.data ],
    ));

    let matchingEntriesCounter = 0;

    newPrivateData.map(newEntry => {
      if (onChainPrivateDataMap.has(keyToString(newEntry.key))) {
        matchingEntriesCounter++;
      }

      if (onChainPrivateDataMap.get(keyToString(newEntry.key)) !== newEntry.data) {
        updatedPrivateData.push(newEntry);
      }
    });

    if (onChainPrivateData.length !== matchingEntriesCounter) {
      throw new Error('Editable data MUST include at least all the on-chain entries.')
    }

    return updatedPrivateData;
  }

  const [ writePrivateDataArgs, setWritePrivateDataArgs ] = useState<{ data: PrivateDataEntry[] }>();
  const { config: writePrivateDataConfig } = usePrepareContractWrite(onChainIdContractConfigBuilder({
    functionName: 'writeMultipleData',
    args: [ writePrivateDataArgs?.data ],
    enabled: Boolean(writePrivateDataArgs && writePrivateDataArgs.data?.length !== 0 ),
  }));
  const {
    write: writePrivateDataWrite,
    isLoading: writePrivateDataIsLoading,
    data: writePrivateDataTx,
  } = useContractWrite(writePrivateDataConfig);
  const { data: writePrivateDataResult } = useWaitForTransaction({ hash: writePrivateDataTx?.hash });

  const writePrivateData = (newData?: PrivateDataEntry[]) => {
    if (!newData) {
      setWritePrivateDataArgs(undefined);

      return;
    }

    newData = filterUpdatedPrivateData(newData);

    setWritePrivateDataArgs({ data: newData });
  }

  useEffect(() => {
    if (!writePrivateDataIsLoading && writePrivateDataArgs && writePrivateDataWrite) {
      writePrivateDataWrite();
    }
  }, [ writePrivateDataArgs, writePrivateDataWrite ]);

  useEffect(() => {
    if (writePrivateDataResult) {
      setWritePrivateDataArgs(undefined);

      refreshPrivateData(getPrivateDataProgress?.entriesPerPage);
    }
  }, [ writePrivateDataResult ]);

  // Delete data
  const [ writeDeleteDataArgs, setWriteDeleteDataArgs ] = useState<{ key: Bytes }>();
  const { config: deleteDataConfig } = usePrepareContractWrite(onChainIdContractConfigBuilder({
    functionName: 'deleteData',
    args: [ writeDeleteDataArgs && ethers.utils.hexlify(writeDeleteDataArgs?.key) ],
    enabled: Boolean(writeDeleteDataArgs?.key),
  }));
  const { write: deleteDataWrite, isLoading: deleteDataIsLoading, data: deleteDataTx } = useContractWrite(deleteDataConfig);
  const { data: deleteDataResult } = useWaitForTransaction({ hash: deleteDataTx?.hash });

  const deleteData = (key: Bytes) => {
    setWriteDeleteDataArgs({ key });
  };

  useEffect(() => {
    if (!deleteDataIsLoading && writeDeleteDataArgs && deleteDataWrite) {
      deleteDataWrite();
    }
  }, [ writeDeleteDataArgs, deleteDataWrite ]);

  useEffect(() => {
    if (deleteDataResult) {
      setWriteDeleteDataArgs(undefined);
      refreshPrivateData(getPrivateDataProgress?.entriesPerPage);
    }
  }, [ deleteDataResult ]);

  // Write permissions
  const filterUpdatedPermissions = (newPermissions?: PermissionsEntry[]): PermissionsEntry[] => {
    const onChainPermissions = getPermissionsProgress?.currentData;

    if (!onChainPermissions || !newPermissions) {
      return [];
    }

    const updatedPermissions: PermissionsEntry[] = [];
    const onChainPermissionsMap: Map<string, boolean> = new Map(onChainPermissions.map(
      entry => [ keyToString(entry.key), entry.canRead ],
    ));

    let matchingEntriesCounter = 0;

    newPermissions.map(newEntry => {
      if (onChainPermissionsMap.has(keyToString(newEntry.key))) {
        matchingEntriesCounter++;
      }

      if (onChainPermissionsMap.get(keyToString(newEntry.key)) !== newEntry.canRead) {
        updatedPermissions.push(newEntry);
      }
    });

    if (onChainPermissions.length !== matchingEntriesCounter) {
      throw new Error('Editable permissions MUST include at least all the on-chain entries.');
    }

    return updatedPermissions;
  }

  const [ writePermissionsArgs, setWritePermissionsArgs ] = useState<WritePermissionsArgs>();
  const { config: writePermissionsConfig } = usePrepareContractWrite(onChainIdContractConfigBuilder({
    functionName: 'writePermissions',
    args: [
      writePermissionsArgs?.providerAddress ?? ethers.constants.AddressZero,
      writePermissionsArgs?.updatedPermissions,
      writePermissionsArgs?.expiration ?? 0,
    ],
    enabled: Boolean(writePermissionsArgs && writePermissionsArgs?.updatedPermissions.length !== 0),
  }));
  const {
    write: writePermissionsWrite,
    isLoading: writePermissionsIsLoading,
    data: writePermissionsTx,
  } = useContractWrite(writePermissionsConfig);
  const { data: writePermissionsResult } = useWaitForTransaction({ hash: writePermissionsTx?.hash });

  const writePermissions = (newWritePermissionsArgs?: WritePermissionsArgs) => {
    if (!newWritePermissionsArgs) {
      setWritePermissionsArgs(undefined);

      return;
    }

    if (newWritePermissionsArgs.providerAddress === ethers.constants.AddressZero) {
      throw new Error('Invalid provider address (zero address).');
    }

    if (
      newWritePermissionsArgs.expiration.lt(Math.floor(Date.now() / 1000)) &&
      (noExpirationValue === undefined || !newWritePermissionsArgs.expiration.eq(noExpirationValue))
    ) {
      throw new Error('Invalid expiration date.');
    }

    newWritePermissionsArgs.updatedPermissions = filterUpdatedPermissions(newWritePermissionsArgs.updatedPermissions);

    setWritePermissionsArgs(newWritePermissionsArgs);
  };

  useEffect(() => {
    if (!writePermissionsIsLoading && writePermissionsArgs && writePermissionsWrite) {
      writePermissionsWrite();
    }
  }, [ writePermissionsArgs, writePermissionsWrite ]);

  useEffect(() => {
    if (writePermissionsResult) {
      const updatedProviderAddress = writePermissionsArgs?.providerAddress;
      setWritePermissionsArgs(undefined);

      if (updatedProviderAddress) {
        refreshPermissions(updatedProviderAddress, getPermissionsProgress?.entriesPerPage);
      }
    }
  }, [ writePermissionsResult ]);

  // Disable provider
  const [ disableProviderArgs, setDisableProviderArgs ] = useState<{ providerAddress: string }>();
  const { config: disableProviderConfig } = usePrepareContractWrite(onChainIdContractConfigBuilder({
    functionName: 'disableProvider',
    args: [ disableProviderArgs?.providerAddress ],
    enabled: Boolean(disableProviderArgs?.providerAddress),
  }));
  const {
    write: disableProviderWrite,
    isLoading: disableProviderIsLoading,
    data: disableProviderTx,
  } = useContractWrite(disableProviderConfig);
  const { data: disableProviderResult } = useWaitForTransaction({ hash: disableProviderTx?.hash });

  const disableProvider = (providerAddress: string) => {
    setDisableProviderArgs({ providerAddress });
  };

  useEffect(() => {
    if (!disableProviderIsLoading && disableProviderArgs && disableProviderWrite) {
      disableProviderWrite();
    }
  }, [ disableProviderArgs, disableProviderWrite ]);

  useEffect(() => {
    if (disableProviderResult) {
      setDisableProviderArgs(undefined);
      refreshAllowedProviders(getAllowedProvidersProgress?.providersPerPage);
    }
  }, [ disableProviderResult ]);

  const value: OnChainIdInterface = {
    noExpirationValue: noExpirationValue as BigNumber | undefined,

    onChainPrivateData: getPrivateDataProgress?.currentData === undefined ? []: getPrivateDataProgress.currentData,
    refreshOnChainPrivateData: refreshPrivateData,
    isOnChainPrivateDataRefreshing: getPrivateDataProgress?.isLoading === true,

    allowedProviders: getAllowedProvidersProgress?.currentData === undefined ? []: getAllowedProvidersProgress.currentData,
    refreshAllowedProviders,
    areAllowedProvidersRefreshing: getAllowedProvidersProgress?.isLoading === true,

    onChainPermissions: getPermissionsProgress?.currentData === undefined ? []: getPermissionsProgress.currentData,
    onChainPermissionsProvider: getPermissionsProgress?.provider,
    refreshOnChainPermissions: refreshPermissions,
    areOnChainPermissionsRefreshing: getPermissionsProgress?.isLoading === true,

    providerExpiration: getExpiration as BigNumber | undefined,
    refreshProviderExpiration,

    userData: getData as string | undefined,
    refreshUserData,
    getUserDataError: getDataError === null ? undefined : {
      name: (getDataError as any).errorName,
      expiration: (getDataError as any)?.errorArgs[0] as BigNumber | undefined,
    },

    writePrivateData,
    writePrivateDataResult,
    isWritePrivateDataLoading: writePrivateDataIsLoading,

    deleteUserData: deleteData,
    deleteDataResult,
    isDeleteUserDataLoading: deleteDataIsLoading,

    writePermissions,
    writePermissionsResult,
    isWritePermissionsLoading: writePermissionsIsLoading,

    disableProvider,
    disableProviderResult,
    isDisableProviderLoading: disableProviderIsLoading,
  };

  return (
    <OnChainIdContext.Provider value={value}>
      {children}
    </OnChainIdContext.Provider>
  );
}
