import type { NextPage } from 'next';
import { useState } from 'react';
import Nav from '../components/nav/Nav';
import PermissionRequest from '../components/PermissionRequest/PermissionRequest';
import PermissionRequestLinkAndCode from '../components/PermissionRequestLinkAndCode/PermissionRequestLinkAndCode';
import RightSideContentBox from '../components/RightSideContentBox/RightSideContentBox';
import TopNavBar from '../components/TopNavBar/TopNavBar';
import PermissionsRequestData from '../lib/types/PermissionsRequestData';
import styles from '../styles/UserDashboardLinks.module.scss';
const UserDashboardLinks: NextPage = () => {
  const [ jsonValidationValue, setJsonValidationValue ] = useState<PermissionsRequestData>();

  return (
    <div className={styles.userDashboardLinks}>
      <Nav />
      <RightSideContentBox>
        <TopNavBar
          firstBtnClass="borderBlueBgWhiteTextBlue"
          firstBtnContent="TEST"
          firstBtnOnClick={() => console.log('Click!')/* TODO: implement this */}
          mainTitle="Provider Dashboard"
          secondBtnClass="borderBlueBgBlueTextWhite"
          secondBtnContent="CREATE"
          secondBtnOnClick={() => console.log('Click!')/* TODO: implement this */}
          subTitle="0xde3B22caAaD25e65C839c2A3d852d665669EdD5c"
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
            {jsonValidationValue ?
              <div className={styles.rightSideContentWrapper}>
                <PermissionRequest {...jsonValidationValue} />
              </div>
              :
              <strong>Please correct the errors in the code before you can see the preview!</strong>
            }
          </div>
        </div>
      </RightSideContentBox>
    </div>
  );
};

export default UserDashboardLinks;
