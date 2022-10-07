import type { NextPage } from "next";
import Nav from "../components/nav/Nav";
import PermissionRequest from "../components/PermissionRequest/PermissionRequest";
import RightSideContentBox from "../components/RightSideContentBox/RightSideContentBox";
import TopNavBar from "../components/TopNavBar/TopNavBar";
import styles from "../styles/UserDashboardLinks.module.scss";
const UserDashboardLinks: NextPage = () => {
  return (
    <div className={styles.userDashboardLinks}>
      <Nav />
      <RightSideContentBox>
        <TopNavBar />
        <div>
          <div></div>
          <div>
            <div>Preview</div>
            <PermissionRequest />
          </div>
        </div>
      </RightSideContentBox>
    </div>
  );
};

export default UserDashboardLinks;
