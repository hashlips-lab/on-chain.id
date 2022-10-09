import type { NextPage } from "next";
import Nav from "../components/nav/Nav";
import PermissionRequest from "../components/PermissionRequest/PermissionRequest";
import PermissionRequestLinkAndCode from "../components/PermissionRequestLinkAndCode/PermissionRequestLinkAndCode";
import RightSideContentBox from "../components/RightSideContentBox/RightSideContentBox";
import TopNavBar from "../components/TopNavBar/TopNavBar";
import styles from "../styles/UserDashboardLinks.module.scss";
const UserDashboardLinks: NextPage = () => {
  return (
    <div className={styles.userDashboardLinks}>
      <Nav />
      <RightSideContentBox>
        <TopNavBar
          firstBtnClass="borderBlueBgWhiteTextBlue"
          firstBtnContent={"TEST"}
          firstBtnOnClick={() => {}}
          mainTitle="Provider Dashboard"
          secondBtnClass="borderBlueBgBlueTextWhite"
          secondBtnContent={"CREATE"}
          secondBtnOnClick={() => {}}
          subTitle="0xde3B22caAaD25e65C839c2A3d852d665669EdD5c"
        />
        <div className={styles.midContent}>
          <div className={styles.leftSide}>
            <div className={styles.title}>New Permission Request Link</div>
            <PermissionRequestLinkAndCode />
          </div>
          <div className={styles.rightSide}>
            <div className={styles.title}>Preview</div>
            <div className={styles.rightSideContentWrapper}>
              <PermissionRequest />
            </div>
          </div>
        </div>
      </RightSideContentBox>
    </div>
  );
};

export default UserDashboardLinks;