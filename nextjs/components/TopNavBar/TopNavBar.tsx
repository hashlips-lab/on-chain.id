import Button from "../Button/Button";
import styles from "./TopNavBar.module.scss";

const TopNavBar = () => {
  return (
    <div className={styles.topNavBar}>
      <div className={styles.topNavBarTitle}>
        <h1 className={styles.h1}>Provider Dashboard</h1>
        <span>0xde3B22caAaD25e65C839c2A3d852d665669EdD5c</span>
      </div>

      <div className={styles.buttonWrapper}>
        <Button type="borderBlueBgWhiteTextBlue" size="lg" onClick={() => {}}>
          TEST
        </Button>

        <Button type="borderBlueBgBlueTextWhite" size="lg" onClick={() => {}}>
          CREATE
        </Button>
      </div>
    </div>
  );
};

export default TopNavBar;
