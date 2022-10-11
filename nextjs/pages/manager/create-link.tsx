import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useAccount } from 'wagmi';
import Nav from '../../components/nav/Nav';
import PermissionRequest from '../../components/PermissionRequest/PermissionRequest';
import PermissionRequestLinkAndCode from '../../components/PermissionRequestLinkAndCode/PermissionRequestLinkAndCode';
import RightSideContentBox from '../../components/RightSideContentBox/RightSideContentBox';
import TopNavBar from '../../components/TopNavBar/TopNavBar';
import PermissionsRequestData from '../../lib/types/PermissionsRequestData';
import styles from '../../styles/manager/CreateApprovalLink.module.scss';

const CreateApprovalLink: NextPage = () => {
  const router = useRouter();
  const { address } = useAccount();
  const [ jsonValidationValue, setJsonValidationValue ] =
    useState<PermissionsRequestData>();

  return (
    <div className={styles.userDashboardLinks}>
      <Nav />
      <RightSideContentBox>
        <TopNavBar
          mainTitle="Create approval link"
          subTitle={address ?? ''}
          firstBtnClass="borderBlueBgBlueTextWhite"
          firstBtnContent="CREATE LINK"
          firstBtnDisabled
          secondBtnClass="borderBlueBgWhiteTextBlue"
          secondBtnContent="DEBUGGER"
          secondBtnOnClick={() => router.push('/manager/debugger')}
        />
        <div className={styles.midContent}>
          <div className={styles.leftSide}>
            <div className={styles.title}>New Permission Request Link</div>
            <PermissionRequestLinkAndCode
              jsonValidationValue={jsonValidationValue}
              setJsonValidationValue={setJsonValidationValue}
            />
          </div>
          <div className={styles.rightSide}>
            <div className={styles.title}>Preview</div>
            {jsonValidationValue ? (
              <div className={styles.rightSideContentWrapper}>
                <PermissionRequest {...jsonValidationValue} isPreview={true} />
              </div>
            ) : (
              <strong>
                Please correct the errors in the code before you can see the
                preview!
              </strong>
            )}
          </div>
        </div>
      </RightSideContentBox>
    </div>
  );
};

export default CreateApprovalLink;
