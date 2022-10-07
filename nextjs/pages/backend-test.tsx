import type { NextPage } from 'next';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import styles from '../styles/Home.module.scss';
import {
  ConnectButton,
} from '@rainbow-me/rainbowkit';
import '@rainbow-me/rainbowkit/styles.css';
import { useAccount } from 'wagmi';
import { useOnChainIdContext, AccessDenied } from '../scripts/OnChainIdContext';
import { keyToBytes, keyToString } from '../scripts/lib/OnChainId/types/PrivateDataKey';

const BackEndTest: NextPage = () => {
  const { isConnected } = useAccount();
  const [ walletIsConnected, setWalletIsConnected ] = useState(false);
  const [ providerAddress, setProviderAddress ] = useState('');
  const [ userAddress, setUserAddress ] = useState('');
  const [ userKey, setUserKey ] = useState('');
  const {
    noExpirationValue,
  
    privateData,
    refreshPrivateData,
    isPrivateDataRefreshing,

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

    deleteUserData,
    deleteDataResult,
    isDeleteUserDataLoading,

    writePermissions,
    writePermissionsResult,
    isWritePermissionsLoading,
  } = useOnChainIdContext();

  // Write permissions
  const [ editablePermissions, setEditablePermissions ] = useState<boolean[]>([]);

  useEffect(() => {
    setEditablePermissions(onChainPermissions.map(entry => entry.canRead));
  }, [ onChainPermissions ]);

  const togglePermissions = (toggleIndex: number) => {
    setEditablePermissions(editablePermissions.map((canRead, index) => (index === toggleIndex) ? !canRead : canRead));
  };

  const handleWritePermissionsClick = () => {
    writePermissions({
      providerAddress: onChainPermissionsProvider!,
      updatedPermissions: onChainPermissions.map((entry, index) => {
        return { key: entry.key, canRead: editablePermissions[index] };
      }),
      expiration: noExpirationValue!,
    });
  };

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
          <button className="px-2 py-1 border border-black rounded disabled:bg-red-800" onClick={() => refreshPrivateData()} disabled={isPrivateDataRefreshing}>Refresh</button>
          <ul className="my-4">
            {privateData.map((data, index) =>
              <li key={`private-data-${index}`} className="flex flex-col mb-4 p-2 border border-black rounded">
                <strong>{data.data}</strong>
                <code className="text-xs">{keyToString(data.key)}</code>
                <button className="px-2 py-1 text-xs border border-black rounded disabled:bg-red-800" onClick={() => deleteUserData(data.key)} disabled={isDeleteUserDataLoading}>🗑 Delete</button>
              </li>
            )}
          </ul>

          <hr className="w-96 border border-black"/>

          <h2 className="mt-4 text-xl font-bold">Allowed providers:</h2>
          <button className="px-2 py-1 border border-black rounded disabled:bg-red-800" onClick={() => refreshAllowedProviders()} disabled={areAllowedProvidersRefreshing}>Refresh</button>
          <ul className="my-4">
            {allowedProviders.map((provider, index) =>
              <li key={`allowed-providers-${index}`} className="flex flex-col mb-4 p-2 border border-black rounded">
                <code className="text-xs">{provider}</code> <button className="px-2 py-1 border border-black rounded disabled:bg-red-800" onClick={() => refreshOnChainPermissions(provider)} disabled={areOnChainPermissionsRefreshing}>Show permissions</button>
              </li>
            )}
          </ul>

          <hr className="w-96 border border-black" />

          <h2 className="mt-4 text-xl font-bold">Permissions:</h2>
          {onChainPermissions.length > 0 && <>
            <ul className="my-4">
              {onChainPermissions.map((permissionsEntry, index) =>
                <li key={`private-data-${index}`} className="flex flex-col mb-4 p-2 border border-black rounded">
                  <div>
                    <strong>Access {editablePermissions[index] ? <span className="text-green-700">granted</span> : <span className="text-red-700">denied</span>}</strong>
                    <button className="mx-2 px-2 py-1 text-xs border border-black rounded disabled:bg-red-800" onClick={() => togglePermissions(index)}>🔁 Toggle</button>
                  </div>
                  <code className="text-xs">{keyToString(permissionsEntry.key)}</code>
                </li>
              )}
            </ul>
            <button className="px-2 py-1 border border-black rounded disabled:bg-red-800" onClick={handleWritePermissionsClick} disabled={isWritePermissionsLoading}>Save</button>
          </>}

          <hr className="w-96 border border-black" />

          {noExpirationValue && <>
            <h2 className="mt-4 text-xl font-bold">No Expiration Value:</h2>
            <strong>{noExpirationValue.toNumber()}</strong>
          </>}

          <hr className="w-96 border border-black" />

          <h2 className="mt-4 text-xl font-bold">Provider Expiration:</h2>
          <small className="font-normal italic">(current user context)</small>
          <input className="border border-black mt-1 mb-4 w-96 text-sm" type="text" placeholder='Provider address' onChange={(e) => setProviderAddress(e.target.value)} />
          <button className="px-2 py-1 border border-black rounded" onClick={() => refreshProviderExpiration(providerAddress)}>Get expiration for provider</button>
          {providerExpiration && <strong>{providerExpiration.toNumber()}</strong>}

          <hr className="w-96 border border-black" />

          <h2 className="mt-4 text-xl font-bold">Data:</h2>
          <input className="border border-black mt-1 mb-4 w-96 text-sm" type="text" placeholder='User address' onChange={(e) => setUserAddress(e.target.value)} />
          <input className="border border-black mt-1 mb-4 w-96 text-sm" type="text" placeholder='Key' onChange={(e) => setUserKey(e.target.value)} />
          <button className="px-2 py-1 border border-black rounded" onClick={() => refreshUserData(userAddress, keyToBytes(userKey))}>Get data</button>
          {userData && <strong>{userData}</strong>}
          {getUserDataError && <span className="text-red-500">{ getUserDataError.name === AccessDenied ? `Access denied or expired: ${String(getUserDataError.expiration)}` : `Access denied to this information` }</span>}
        </> : <>Please connect wallet</>}
      </main>
    </div>
  );
};

export default BackEndTest;
