import type { NextPage } from 'next';
import Image from 'next/image';
import Button from '../components/Button/Button';
import Nav from '../components/nav/Nav';
import RightSideContentBox from '../components/RightSideContentBox/RightSideContentBox';
import TopNavBar from '../components/TopNavBar/TopNavBar';
import styles from '../styles/provider/ProviderSettings.module.scss';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { keyToString } from '../lib/types/PrivateDataKey';
import { useOnChainIdContext } from '../lib/OnChainIdContext';
import ServiceIcon from '../components/ServicesIcons/ServiceIcon';
import BackArrow from '../assets/images/icon/backArrow.svg';
import CloseRed from '../assets/images/icon/closeRed.svg';
import { ethers } from 'ethers';

const ProviderSettings: NextPage = () => {
  const router = useRouter();
  const { providerAddress } = router.query as { providerAddress?: string };

  const {
    onChainPermissions,
    onChainPermissionsProvider,
    refreshOnChainPermissions,
    areOnChainPermissionsRefreshing,
    writePermissions,
    isWritePermissionsLoading,
    noExpirationValue,
    disableProvider,
    disableProviderResult,
  } = useOnChainIdContext();

  const [ editablePermissions, setEditablePermissions ] = useState<boolean[]>([]);

  useEffect(() => {
    if (disableProviderResult) {
      router.back();
    }
  }, [ disableProviderResult ]);

  useEffect(() => {
    setEditablePermissions(onChainPermissions.map((entry) => entry.canRead));
  }, [ onChainPermissions ]);

  const handleWritePermissionsClick = () => {
    if (!onChainPermissionsProvider) {
      throw new Error(
        'Cannot write permissions before a provider has been selected.'
      );
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
    return (
      onChainPermissionsProvider &&
      onChainPermissions.length > 0 &&
      onChainPermissions.reduce(
        (didChange, entry, index) =>
          didChange || entry.canRead !== editablePermissions[index],
        false
      )
    );
  };

  const togglePermissions = (toggleIndex: number) => {
    setEditablePermissions(
      editablePermissions.map((canRead, index) =>
        index === toggleIndex ? !canRead : canRead
      )
    );
  };

  return (
    <div className={styles.userDashboardLinks}>
      <Nav />
      <RightSideContentBox>
        {ethers.utils.isAddress(providerAddress ?? '') ?
          <>
            <TopNavBar
              mainTitle="Provider permissions"
              subTitle=""
              firstBtnClass="borderBlueBgWhiteTextBlue"
              firstBtnContent="MY DATA"
              firstBtnOnClick={() => router.push('/')}
              secondBtnClass="borderBlueBgBlueTextWhite"
              secondBtnContent={
                <div className={styles.btnContent}>
                  <Image
                    src={BackArrow.src}
                    width={27}
                    height={24}
                    alt="Back"
                  />
                  <span>PROVIDERS</span>
                </div>
              }
              secondBtnOnClick={() => router.push('/providers')}
            />
            <div className={styles.midContent}>
              <div className={styles.subBtnTitleWrapper}>
                <div className={styles.title}>{providerAddress}</div>
                <div className={styles.btnWrapper}>
                  <Button
                    type="borderRedBgWhiteTextRed"
                    onClick={() => disableProvider(String(providerAddress))}
                    size="sm"
                  >
                    <div className={styles.btnContent}>
                      <span>REMOVE PROVIDER</span>
                      <Image
                        src={CloseRed.src}
                        width={16}
                        height={16}
                        alt="Remove"
                      />
                    </div>
                  </Button>
                  <br />
                  <br />
                  <Button
                    disabled={isWritePermissionsLoading || !permissionsChanged()}
                    type="borderBlueBgBlueTextWhite"
                    onClick={handleWritePermissionsClick}
                    size="sm"
                  >
                    <div className={styles.btnContent}>SAVE</div>
                  </Button>
                </div>
              </div>

              <div className="flex justify-center mb-4">
                <Button
                  loading={areOnChainPermissionsRefreshing}
                  disabled={areOnChainPermissionsRefreshing}
                  type="borderBlueBgBlueTextWhite"
                  onClick={() => refreshOnChainPermissions(String(providerAddress))}
                  size="sm"
                >Refresh provider permissions</Button>
              </div>
              <ul>
                {onChainPermissions.map((permissionsEntry, index) => {
                  return (
                    <li key={index}>
                      <div className={`${styles.listItem}`}>
                        <div className={styles.social}>
                          <div className={styles.icon}>
                            <ServiceIcon serviceKey={keyToString(permissionsEntry.key)} className={styles.iconStyle} />
                          </div>
                          <div className={styles.info}>
                            <span className={styles.title}>
                              {keyToString(permissionsEntry.key)}
                            </span>
                            <span className={styles.description}>
                              Access&nbsp;
                              {editablePermissions[index] ? (
                                <strong className="text-green-700">granted</strong>
                              ) : (
                                <strong className="text-red-700">denied</strong>
                              )}
                            </span>
                          </div>
                        </div>

                        <div className={styles.btnWrapper}>
                          <Button
                            type="borderBlueBgWhiteTextBlue"
                            onClick={() => togglePermissions(index)}
                            size="sm"
                          >
                            <div className={styles.btnContent}>
                              <span>TOGGLE</span>
                            </div>
                          </Button>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          </>
          :
          <div className="flex flex-col justify-center items-center w-full h-full">
            <strong>Invalid ETH address:</strong>
            {providerAddress}
          </div>
        }
      </RightSideContentBox>
    </div>
  );
};

export default ProviderSettings;
