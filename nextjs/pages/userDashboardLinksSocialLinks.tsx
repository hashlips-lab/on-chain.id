import type { NextPage } from "next";
import Button from "../components/Button/Button";
import Input from "../components/Input/Input";
import Nav from "../components/nav/Nav";
import RightSideContentBox from "../components/RightSideContentBox/RightSideContentBox";
import TopNavBar from "../components/TopNavBar/TopNavBar";
import styles from "../styles/UserDashboardLinksSocialLinks.module.scss";
const userDashboardLinksSocialLinks: NextPage = () => {
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
          <div className={styles.title}>Test Permissions</div>

          <div className={styles.inputWrapper}>
            <div>
              <Input placeholder={"User Address"} onChange={() => {}} />
            </div>
            <div>
              <Input placeholder={"Private Data Key"} onChange={() => {}} />
            </div>
          </div>

          <div className={styles.buttonWrapper}>
            <Button
              type="borderBlueBgBlueTextWhite"
              size="lg"
              onClick={() => {}}
            >
              CALL
            </Button>
            <Button
              type="borderGreyBgWhiteTextGrey"
              size="lg"
              onClick={() => {}}
            >
              CANCEL
            </Button>
          </div>

          <div className={styles.secondTitle}>Result:</div>
          <div className={styles.subList}>@HashUser</div>
        </div>
      </RightSideContentBox>
    </div>
  );
};

export default userDashboardLinksSocialLinks;
