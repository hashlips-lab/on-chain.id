import type { NextPage } from 'next';
import Button from '../components/Button/Button';
import Input from '../components/Input/Input';
import Nav from '../components/nav/Nav';
import RightSideContentBox from '../components/RightSideContentBox/RightSideContentBox';
import TopNavBar from '../components/TopNavBar/TopNavBar';
import styles from '../styles/UserDashboardLinksSocialLinks.module.scss';
const userDashboardLinksSocialLinks: NextPage = () => {
  return (
    <div className={styles.userDashboardLinks}>
      <Nav />
      <RightSideContentBox>
        <TopNavBar
          firstBtnClass="borderBlueBgWhiteTextBlue"
          firstBtnContent="TEST"
          firstBtnOnClick={() => {console.log('Click!');/* TODO: implement this */}}
          mainTitle="Provider Dashboard"
          secondBtnClass="borderBlueBgBlueTextWhite"
          secondBtnContent="CREATE"
          secondBtnOnClick={() => {console.log('Click!');/* TODO: implement this */}}
          subTitle="0xde3B22caAaD25e65C839c2A3d852d665669EdD5c"
        />
        <div className={styles.midContent}>
          <div className={styles.title}>Test Permissions</div>

          <div className={styles.inputWrapper}>
            <div>
              <Input placeholder="User Address" onChange={() => {console.log('Click!');/* TODO: implement this */}} />
            </div>
            <div>
              <Input placeholder="Private Data Key" onChange={() => {console.log('Click!');/* TODO: implement this */}} />
            </div>
          </div>

          <div className={styles.buttonWrapper}>
            <Button
              type="borderBlueBgBlueTextWhite"
              size="lg"
              onClick={() => {console.log('Click!');/* TODO: implement this */}}
            >
              CALL
            </Button>
            <Button
              type="borderGreyBgWhiteTextGrey"
              size="lg"
              onClick={() => {console.log('Click!');/* TODO: implement this */}}
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
