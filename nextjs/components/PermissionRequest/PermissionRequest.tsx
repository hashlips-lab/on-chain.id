import Button from '../Button/Button';
import styles from './PermissionRequest.module.scss';
import Image from 'next/image';
import { useRouter } from 'next/router';
import PermissionsRequestData from '../../lib/types/PermissionsRequestData';

import CheckBoxChecked from '../../assets/images/icon/check.svg';
import KnownServicesIcons from '../../lib/KnownServicesIcons';
import { useOnChainIdContext } from '../../lib/OnChainIdContext';
import { keyToBytes } from '../../lib/types/PrivateDataKey';
import { useEffect } from 'react';

const PermissionRequest = ({ providerAddress, requiredPermissions, isPreview }: PermissionsRequestData) => {
  const router = useRouter();
  const { noExpirationValue, writePermissions, writePermissionsResult, isWritePermissionsLoading } = useOnChainIdContext();

  useEffect(() => {
    if (writePermissionsResult) {
      router.push(`/providers/${providerAddress}`);
    }
  }, [ writePermissionsResult ]);

  return (
    <div className={styles.permissionRequest}>
      <h1>Permissions Request</h1>
      <span className={styles.publicKey}>
        {providerAddress}
      </span>
      <span className={styles.listTitle}>
        Is requesting access to the following data:
      </span>

      <ul>
        {requiredPermissions.map((key, index) => {
          return (
            <li key={index}>
              <div className={styles.socialList}>
                <div className={styles.socialIcon}>
                  <Image src={KnownServicesIcons[key].src} width={48} height={48} alt={`Icon for ${key}`} />
                </div>

                <div className={styles.socialBox}>
                  <div className={styles.socialName}>{key}</div>

                  <div className={styles.socialStatus}>
                    <Image
                      src={CheckBoxChecked.src}
                      width={36}
                      height={36}
                      alt="Check mark"
                    />
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ul>

      <div className={styles.buttonWrapper}>
        <Button
          type="borderRedBgWhiteTextRed"
          size="lg"
          onClick={() => router.push('/')}
          disabled={isPreview || isWritePermissionsLoading}
        >DENY</Button>
        <Button
          type="borderBlueBgBlueTextWhite"
          size="lg"
          onClick={() => {
            if (!isPreview) {
              writePermissions({
                providerAddress,
                updatedPermissions: requiredPermissions.map(key => {
                  return { key: keyToBytes(key), canRead: true };
                }),
                expiration: noExpirationValue!,
              });
            }
          }}
          disabled={isPreview || isWritePermissionsLoading}
        >APPROVE</Button>
      </div>

      <p>
        In your <span>LinkList Dashboard</span> you can provide or revoke access to all connected providers at any time.
      </p>
    </div>
  );
};

export default PermissionRequest;
