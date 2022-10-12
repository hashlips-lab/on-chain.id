import type { NextPage } from 'next';
import Image from 'next/image';
import Button from '../components/Button/Button';
import Nav from '../components/nav/Nav';
import RightSideContentBox from '../components/RightSideContentBox/RightSideContentBox';
import TopNavBar from '../components/TopNavBar/TopNavBar';
import styles from '../styles/Dashboard.module.scss';
import { useRouter } from 'next/router';
import { useAccount } from 'wagmi';
import { useEffect, useState } from 'react';
import {
  useOnChainIdContext,
  PrivateDataEntry,
} from '../lib/OnChainIdContext';
import { keyToBytes, keyToString } from '../lib/types/PrivateDataKey';
import ServiceIcon from '../components/ServicesIcons/ServiceIcon';
import { Bytes } from 'ethers';
import CloseRedIcon from '../assets/images/icon/closeRed.svg';
import UpArrow from '../assets/images/icon/upArrow.svg';

const Dashboard: NextPage = () => {
  const router = useRouter();
  const { address } = useAccount();

  const {
    onChainPrivateData,
    refreshOnChainPrivateData,
    isOnChainPrivateDataRefreshing,

    writePrivateData,
    isWritePrivateDataLoading,

    deleteUserData,
    isDeleteUserDataLoading,
  } = useOnChainIdContext();

  // Write private data (edit existing data)
  const [ editablePrivateData, setEditablePrivateData ] = useState<string[]>([]);

  const updateEditablePrivateData = (updateIndex: number, newData: string) => {
    setEditablePrivateData(
      editablePrivateData.map((data, index) =>
        index === updateIndex ? newData : data
      )
    );
  };

  // Write private data (new data)
  const [ newPrivateData, setNewPrivateData ] = useState<PrivateDataEntry[]>([]);

  const addNewPrivateData = () => {
    setNewPrivateData(
      newPrivateData.concat({
        key: keyToBytes('Example key'),
        data: 'Example data',
      })
    );
  };

  const updateNewPrivateDataKey = (updateIndex: number, newKey: Bytes) => {
    setNewPrivateData(
      newPrivateData.map((entry, index) =>
        index === updateIndex ? { key: newKey, data: entry.data } : entry
      )
    );
  };

  const updateNewPrivateData = (updateIndex: number, newData: string) => {
    setNewPrivateData(
      newPrivateData.map((entry, index) =>
        index === updateIndex ? { key: entry.key, data: newData } : entry
      )
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
    setOnChainPrivateDataKeysSet(
      new Set<string>(onChainPrivateData.map((entry) => keyToString(entry.key)))
    );
  }, [ onChainPrivateData ]);

  useEffect(() => {
    setNePrivateDataKeysSet(
      new Set<string>(newPrivateData.map((entry) => keyToString(entry.key)))
    );
  }, [ newPrivateData ]);

  useEffect(() => {
    setEditablePrivateData(onChainPrivateData.map((entry) => entry.data));

    setNewPrivateData(
      newPrivateData.filter(
        (entry) => !onChainPrivateDataKeysSet.has(keyToString(entry.key))
      )
    );
  }, [ onChainPrivateDataKeysSet ]);

  const handleWritePrivateDataClick = () => {
    writePrivateData(
      onChainPrivateData
        .map((entry, index) => {
          return { key: entry.key, data: editablePrivateData[index] };
        })
        .concat(newPrivateData)
    );
  };

  const privateDataChanged = () => {
    const hasValidNewData =
      newPrivateData.length !== 0 &&
      newPrivateData.length === newPrivateDataKeysSet.size &&
      newPrivateData.reduce(
        (isValid, entry) =>
          isValid && !onChainPrivateDataKeysSet.has(keyToString(entry.key)),
        true
      );

    const hasValidPrivateDataChanges =
      onChainPrivateData.length !== 0 &&
      onChainPrivateData.reduce(
        (didChange, entry, index) =>
          editablePrivateData[index]?.length !== 0 &&
          (didChange || entry.data !== editablePrivateData[index]),
        false
      );

    return hasValidNewData || hasValidPrivateDataChanges;
  };

  return (
    <div className={styles.userDashboardLinks}>
      <Nav />
      <RightSideContentBox>
        <TopNavBar
          mainTitle="My On-Chain ID"
          subTitle={String(address)}
          firstBtnClass="borderBlueBgBlueTextWhite"
          firstBtnContent="MY DATA"
          firstBtnDisabled
          secondBtnClass="borderBlueBgWhiteTextBlue"
          secondBtnContent="PROVIDERS"
          secondBtnOnClick={() => router.push('/providers')}
        />
        <div className={styles.midContent}>
          <div className={styles.subBtnTitleWrapper}>
            <div className={styles.title}>Manage your private data</div>

            <div className={styles.topBtnWrapper}>
              <div className={styles.buttonUpdate}>
                <Button
                  type="borderWhiteBgWhiteTextBlue"
                  onClick={() => addNewPrivateData()}
                  size="sm"
                >
                  <div className={styles.btnContent}>
                    <span> ➕ ADD NEW</span>
                  </div>
                </Button>
              </div>

              <div className={styles.buttonUpdateAll}>
                <Button
                  disabled={isWritePrivateDataLoading || !privateDataChanged()}
                  type="borderBlueBgBlueTextWhite"
                  onClick={handleWritePrivateDataClick}
                  size="sm"
                >
                  <div className={styles.btnContent}>
                    <span>SAVE</span>
                    <div>
                      <Image
                        src={UpArrow.src}
                        width={15}
                        height={18}
                        alt="Up"
                      />
                    </div>
                  </div>
                </Button>
              </div>
            </div>
          </div>

          <div className="flex justify-center">
            <Button
              loading={isOnChainPrivateDataRefreshing}
              disabled={isOnChainPrivateDataRefreshing}
              type="borderBlueBgBlueTextWhite"
              onClick={() => refreshOnChainPrivateData()}
              size="sm"
            >Refresh on-chain private data</Button>
          </div>
          <ul className="my-4">
            {newPrivateData.length !== newPrivateDataKeysSet.size && (
              <div className="text-red-500 mb-5">
                New data contains duplicates!
              </div>
            )}
            {newPrivateData.map((data, index) => (
              <li
                key={`private-data-${index}`}
                className="flex flex-row mb-8 p-2 border-2 border-slate-300 rounded gap-4"
              >
                <div className="flex flex-col flex-1 gap-2">
                  <div className="flex flex-row flex-1 gap-2 items-center">
                    <ServiceIcon serviceKey={keyToString(newPrivateData[index].key)} className={styles.privateDataIcon} />
                    <div className="flex flex-col gap-1 flex-1">
                      <code className="text-sm">Key</code>
                      <input
                        className="px-2 rounded bg-slate-100 border-2 border-slate-300 invalid:bg-red-300 h-10 font-semibold"
                        type="text"
                        onChange={(e) =>
                          updateNewPrivateDataKey(
                            index,
                            keyToBytes(e.target.value)
                          )
                        }
                        value={keyToString(newPrivateData[index].key)}
                        required
                      />
                    </div>
                    <div className="flex flex-col gap-1 flex-1">
                      <code className="text-sm">Value</code>
                      <input
                        className="px-2 rounded bg-slate-100 border-2 border-slate-300 invalid:bg-red-300 h-10 font-semibold"
                        type="text"
                        onChange={(e) =>
                          updateNewPrivateData(index, e.target.value)
                        }
                        value={newPrivateData[index].data ?? ''}
                        required
                      />
                    </div>
                  </div>
                  {onChainPrivateDataKeysSet.has(
                    keyToString(newPrivateData[index].key)
                  ) && (
                    <small className="text-red-500">Key already exists!</small>
                  )}
                </div>
                <div className="flex flex-shrink">
                  <Button
                    type="borderRedBgWhiteTextRed"
                    onClick={() => removeNewPrivateData(index)}
                    size="sm"
                  >
                    <div className={styles.btnContent}>
                      <div>
                        <Image
                          src={CloseRedIcon.src}
                          width={16}
                          height={16}
                          alt="Remove"
                        />
                      </div>
                    </div>
                  </Button>
                </div>
              </li>
            ))}
            {onChainPrivateData.map((data, index) => (
              <li
                key={`private-data-${index}`}
                className="flex flex-row mb-8 p-2 border-2 border-slate-300 rounded gap-4"
              >
                <ServiceIcon serviceKey={keyToString(data.key)} className={styles.privateDataIcon} />
                <div className="flex flex-col flex-1 gap-2">
                  <code className="px-2 text-md">{keyToString(data.key)}</code>

                  <input
                    className="px-2 rounded bg-slate-100 border-2 border-slate-300 invalid:bg-red-300 h-10 font-semibold"
                    type="text"
                    onChange={(e) =>
                      updateEditablePrivateData(index, e.target.value)
                    }
                    value={editablePrivateData[index] ?? ''}
                    required
                  />
                </div>
                <div className="flex flex-shrink">
                  <Button
                    loading={isDeleteUserDataLoading}
                    disabled={isDeleteUserDataLoading}
                    type="borderRedBgWhiteTextRed"
                    onClick={() => deleteUserData(data.key)}
                    size="sm"
                  >
                    <div className={styles.btnContent}>
                      <span>REMOVE</span>
                    </div>
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </RightSideContentBox>
    </div>
  );
};

export default Dashboard;
