// TODO: This is a temporary page for testing and can be used as a reference.
// Delete this as soon as the real front end is ready.

import type { NextPage } from 'next';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import styles from '../styles/Home.module.scss';
import {
  ConnectButton,
} from '@rainbow-me/rainbowkit';
import '@rainbow-me/rainbowkit/styles.css';
import { useAccount } from 'wagmi';
import { useOnChainIdContext, AccessDenied, PrivateDataEntry } from '../lib/OnChainIdContext';
import { keyToBytes, keyToString } from '../lib/types/PrivateDataKey';
import { Bytes, ethers } from 'ethers';

const BackEndTest: NextPage = () => {
  const { isConnected } = useAccount();
  const {
    noExpirationValue,

    onChainPrivateData,
    refreshOnChainPrivateData,
    isOnChainPrivateDataRefreshing,

    allowedProviders,
    refreshAllowedProviders,
    areAllowedProvidersRefreshing,

    onChainPermissions,
    onChainPermissionsProvider,
    refreshOnChainPermissions,
    areOnChainPermissionsRefreshing,

    providerExpiration,
    refreshProviderExpiration,

    userData,
    refreshUserData,
    getUserDataError,

    writePrivateData,
    isWritePrivateDataLoading,

    deleteUserData,
    isDeleteUserDataLoading,

    writePermissions,
    isWritePermissionsLoading,

    disableProvider,
    isDisableProviderLoading,
  } = useOnChainIdContext();
  const [ walletIsConnected, setWalletIsConnected ] = useState(false);
  const [ expirationProviderAddressInputValue, setExpirationProviderAddressInputValue ] = useState('');
  const [ getUserDataAddressInputValue, setGetUserDataAddressInputValue ] = useState('');
  const [ getUserDataKeyInputValue, setGetUserDataKeyInputValue ] = useState('');

  // Write private data (edit existing data)
  const [ editablePrivateData, setEditablePrivateData ] = useState<string[]>([]);

  const updateEditablePrivateData = (updateIndex: number, newData: string) => {
    setEditablePrivateData(editablePrivateData.map((data, index) => (index === updateIndex) ? newData : data));
  };

  // Write private data (new data)
  const [ newPrivateData, setNewPrivateData ] = useState<PrivateDataEntry[]>([]);

  const addNewPrivateData = () => {
    setNewPrivateData(newPrivateData.concat({ key: keyToBytes('Example key'), data: 'Example data' }));
  };

  const updateNewPrivateDataKey = (updateIndex: number, newKey: Bytes) => {
    setNewPrivateData(newPrivateData.map(
      (entry, index) => (index === updateIndex) ? { key: newKey, data: entry.data } : entry),
    );
  };

  const updateNewPrivateData = (updateIndex: number, newData: string) => {
    setNewPrivateData(newPrivateData.map(
      (entry, index) => (index === updateIndex) ? { key: entry.key, data: newData } : entry),
    );
  };

  const removeNewPrivateData = (index: number) => {
    const newPrivateDataClone = Array.from(newPrivateData);

    newPrivateDataClone.splice(index, 1);

    setNewPrivateData(newPrivateDataClone);
  };

  // Write private data (general)
  const [ onChainPrivateDataKeysSet, setOnChainPrivateDataKeysSet ] = useState<Set<string>>(new Set<string>());
  const [ newPrivateDataKeysSet, setNePrivateDataKeysSet ] = useState<Set<string>>(new Set<string>());

  useEffect(() => {
    setOnChainPrivateDataKeysSet(new Set<string>(
      onChainPrivateData.map(entry => keyToString(entry.key)),
    ));
  }, [ onChainPrivateData ]);

  useEffect(() => {
    setNePrivateDataKeysSet(new Set<string>(
      newPrivateData.map(entry => keyToString(entry.key)),
    ));
  }, [ newPrivateData ]);

  useEffect(() => {
    setEditablePrivateData(onChainPrivateData.map(entry => entry.data));

    setNewPrivateData(newPrivateData.filter(entry => !onChainPrivateDataKeysSet.has(keyToString(entry.key))));
  }, [ onChainPrivateDataKeysSet ]);

  const handleWritePrivateDataClick = () => {
    writePrivateData(onChainPrivateData.map((entry, index) => {
      return { key: entry.key, data: editablePrivateData[index] };
    }).concat(newPrivateData));
  };

  const privateDataChanged = () => {
    const hasValidNewData = newPrivateData.length !== 0 &&
      newPrivateData.length === newPrivateDataKeysSet.size &&
      newPrivateData.reduce(
        (isValid, entry) => (isValid && !onChainPrivateDataKeysSet.has(keyToString(entry.key))),
        true,
      );

    const hasValidPrivateDataChanges = onChainPrivateData.length !== 0 && onChainPrivateData.reduce(
      (didChange, entry, index) =>
        editablePrivateData[index]?.length !== 0 && (didChange || (entry.data !== editablePrivateData[index])),
      false,
    );

    return hasValidNewData || hasValidPrivateDataChanges;
  };

  // Get permissions
  const [ permissionsProviderAddressInputValue, setPermissionsProviderAddressInputValue ] = useState('');

  useEffect(() => {
    if (ethers.utils.isAddress(permissionsProviderAddressInputValue)) {
      refreshOnChainPermissions(permissionsProviderAddressInputValue);
    }
  }, [ permissionsProviderAddressInputValue ]);

  // Write permissions
  const [ editablePermissions, setEditablePermissions ] = useState<boolean[]>([]);

  useEffect(() => {
    setEditablePermissions(onChainPermissions.map(entry => entry.canRead));
  }, [ onChainPermissions ]);

  const togglePermissions = (toggleIndex: number) => {
    setEditablePermissions(editablePermissions.map((canRead, index) => (index === toggleIndex) ? !canRead : canRead));
  };

  const handleWritePermissionsClick = () => {
    if (!onChainPermissionsProvider) {
      throw new Error('Cannot write permissions before a provider has been selected.');
    }

    writePermissions({
      providerAddress: onChainPermissionsProvider,
      updatedPermissions: onChainPermissions.map((entry, index) => {
        return { key: entry.key, canRead: editablePermissions[index] };
      }),
      expiration: noExpirationValue!,
    });
  };

  const permissionsChanged = () => {
    return onChainPermissionsProvider &&
      onChainPermissions.length > 0 &&
      onChainPermissions.reduce(
        (didChange, entry, index) => didChange || (entry.canRead !== editablePermissions[index]),
        false,
      );
  };

  // Connection
  useEffect(() => {
    setWalletIsConnected(isConnected);
  }, [ isConnected ]);

  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Hello world!
        </h1>

        <ConnectButton />

        {walletIsConnected ? <>
          <hr className="mt-8 w-96 border border-black"/>

          <h2 className="mt-4 text-xl font-bold">Private data:</h2>
          <button
            className="px-2 py-1 border border-black rounded disabled:bg-red-300"
            onClick={() => refreshOnChainPrivateData()}
            disabled={isOnChainPrivateDataRefreshing}
          >Refresh</button>
          {editablePrivateData.length > 0 ? <>
            <ul className="my-4">
              {onChainPrivateData.map((data, index) =>
                <li key={`private-data-${index}`} className="flex flex-col mb-4 p-2 border border-black rounded">
                  <input
                    className="px-1 rounded bg-slate-100 border border-slate-500 invalid:bg-red-300"
                    type="text"
                    onChange={e => updateEditablePrivateData(index, e.target.value)}
                    value={editablePrivateData[index] ?? ''}
                    required
                  />
                  <code className="text-xs">{keyToString(data.key)}</code>
                  <button
                    className="px-2 py-1 text-xs border border-black rounded disabled:bg-red-300"
                    onClick={() => deleteUserData(data.key)}
                    disabled={isDeleteUserDataLoading}
                  >🗑 Delete</button>
                </li>
              )}
            </ul>
          </> : <em className="my-4">No entry found...</em>}
          <h3>New data entries:</h3>
          <button
            className="px-2 py-1 border border-black rounded disabled:bg-red-300"
            onClick={() => addNewPrivateData()}
          >➕ Add new</button>
          {newPrivateData.length !== newPrivateDataKeysSet.size &&
            <small className="text-red-500">New data contains duplicates!</small>
          }
          <ul className="my-4">
            {newPrivateData.map((data, index) =>
              <li key={`private-data-${index}`} className="flex flex-col mb-4 p-2 border border-black rounded">
                <input
                  className="px-1 rounded bg-slate-100 border border-slate-500 invalid:bg-red-300"
                  type="text"
                  onChange={e => updateNewPrivateData(index, e.target.value)}
                  value={newPrivateData[index].data ?? ''}
                  required
                />
                <input
                  className="px-1 text-xs font-mono rounded bg-slate-100 border border-slate-500 invalid:bg-red-300"
                  type="text"
                  onChange={e => updateNewPrivateDataKey(index, keyToBytes(e.target.value))}
                  value={keyToString(newPrivateData[index].key)}
                  required
                />
                {onChainPrivateDataKeysSet.has(keyToString(newPrivateData[index].key)) &&
                  <small className="text-red-500">Key already exists!</small>
                }
                <button
                  className="px-2 py-1 text-xs border border-black rounded disabled:bg-red-300"
                  onClick={() => removeNewPrivateData(index)}
                >🗑 Delete</button>
              </li>
            )}
          </ul>
          <button
            className="px-2 py-1 border border-black rounded disabled:bg-red-300"
            onClick={handleWritePrivateDataClick}
            disabled={isWritePrivateDataLoading || !privateDataChanged()}
          >Save</button>

          <hr className="w-96 border border-black"/>

          <h2 className="mt-4 text-xl font-bold">Allowed providers:</h2>
          <button
            className="px-2 py-1 border border-black rounded disabled:bg-red-300"
            onClick={() => refreshAllowedProviders()}
            disabled={areAllowedProvidersRefreshing}
          >Refresh</button>
          <ul className="my-4">
            {allowedProviders.map((provider, index) =>
              <li key={`allowed-providers-${index}`} className="flex flex-col mb-4 p-2 border border-black rounded">
                <code className="text-xs">{provider}</code>
                <button
                  className="px-2 py-1 border border-black rounded disabled:bg-red-300"
                  onClick={() => setPermissionsProviderAddressInputValue(provider)}
                  disabled={areOnChainPermissionsRefreshing}
                >Show permissions</button>
                <button
                  className="px-2 py-1 text-xs border border-black rounded disabled:bg-red-300"
                  onClick={() => disableProvider(provider)}
                  disabled={isDisableProviderLoading}
                >🗑 Delete</button>
              </li>
            )}
          </ul>

          <hr className="w-96 border border-black" />

          <h2 className="mt-4 text-xl font-bold">Permissions:</h2>
          <input
            className="px-1 w-96 rounded bg-slate-100 border border-slate-500 invalid:bg-red-300"
            type="text"
            placeholder="Provider address"
            onChange={(e) => setPermissionsProviderAddressInputValue(e.target.value)}
            value={permissionsProviderAddressInputValue}
          />
          {ethers.utils.isAddress(permissionsProviderAddressInputValue) && <>
            <button
              className="px-2 py-1 border border-black rounded disabled:bg-red-300"
              onClick={() => refreshOnChainPermissions(permissionsProviderAddressInputValue)}
              disabled={areOnChainPermissionsRefreshing}
            >Refresh</button>
            {editablePermissions.length > 0 && <>
              <ul className="my-4">
                {onChainPermissions.map((permissionsEntry, index) =>
                  <li key={`private-data-${index}`} className="flex flex-col mb-4 p-2 border border-black rounded">
                    <div>
                      <strong>
                        Access&nbsp;
                        {editablePermissions[index] ?
                          <span className="text-green-700">granted</span>
                          :
                          <span className="text-red-700">denied</span>
                        }
                      </strong>
                      <button
                        className="mx-2 px-2 py-1 text-xs border border-black rounded disabled:bg-red-300"
                        onClick={() => togglePermissions(index)}
                      >🔁 Toggle</button>
                    </div>
                    <code className="text-xs">{keyToString(permissionsEntry.key)}</code>
                  </li>
                )}
              </ul>
              <button
                className="px-2 py-1 border border-black rounded disabled:bg-red-300"
                onClick={handleWritePermissionsClick}
                disabled={isWritePermissionsLoading || !permissionsChanged()}
              >Save</button>
            </>}
          </>}

          <hr className="w-96 border border-black" />

          {noExpirationValue && <>
            <h2 className="mt-4 text-xl font-bold">No Expiration Value:</h2>
            <strong>{noExpirationValue.toNumber()}</strong>
          </>}

          <hr className="w-96 border border-black" />

          <h2 className="mt-4 text-xl font-bold">Provider Expiration:</h2>
          <small className="font-normal italic">(current user context)</small>
          <input
            className="px-1 w-96 rounded bg-slate-100 border border-slate-500 invalid:bg-red-300"
            type="text"
            placeholder="Provider address"
            onChange={(e) => setExpirationProviderAddressInputValue(e.target.value)}
          />
          <button
            className="px-2 py-1 border border-black rounded"
            onClick={() => refreshProviderExpiration(expirationProviderAddressInputValue)}
          >Get expiration for provider</button>
          {providerExpiration && <strong>{providerExpiration.toNumber()}</strong>}

          <hr className="w-96 border border-black" />

          <h2 className="mt-4 text-xl font-bold">Retrieve user data:</h2>
          <input
            className="px-1 w-96 rounded bg-slate-100 border border-slate-500 invalid:bg-red-300"
            type="text"
            placeholder="User address"
            onChange={(e) => setGetUserDataAddressInputValue(e.target.value)}
          />
          <input
            className="px-1 w-96 rounded bg-slate-100 border border-slate-500 invalid:bg-red-300"
            type="text"
            placeholder="Key"
            onChange={(e) => setGetUserDataKeyInputValue(e.target.value)}
          />
          <button
            className="px-2 py-1 border border-black rounded"
            onClick={() => refreshUserData(getUserDataAddressInputValue, keyToBytes(getUserDataKeyInputValue))}
          >Get data</button>
          {userData && <strong>{userData}</strong>}
          {getUserDataError &&
            <span className="text-red-500">
              {getUserDataError.name === AccessDenied ?
                `Access denied or expired: ${String(getUserDataError.expiration)}`
                :
                'Access denied to this information'
              }</span>}
        </> : <>Please connect wallet</>}
      </main>
    </div>
  );
};

export default BackEndTest;
