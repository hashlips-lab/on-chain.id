import Button, { ButtonProps } from "../Button/Button";
import styles from "./TopNavBar.module.scss";

interface TopNavBar {
  mainTitle: string;
  subTitle: string;
  firstBtnClass: ButtonProps["type"];
  firstBtnContent: any;
  firstBtnDisabled?: boolean;
  firstBtnOnClick: () => void;
  secondBtnClass: ButtonProps["type"];
  secondBtnContent: any;
  secondBtnOnClick: () => void;
  secondBtnDisabled?: boolean;
}

const TopNavBar = ({
  mainTitle,
  subTitle,
  firstBtnClass,
  firstBtnContent,
  firstBtnOnClick,
  secondBtnClass,
  secondBtnContent,
  secondBtnOnClick,
  firstBtnDisabled,
  secondBtnDisabled,
}: TopNavBar) => {
  return (
    <div className={styles.topNavBar}>
      <div className={styles.topNavBarTitle}>
        <h1 className={styles.h1}>{mainTitle}</h1>
        <span>{subTitle}</span>
      </div>

      <div className={styles.buttonWrapper}>
        <Button
          type={firstBtnClass}
          size="lg"
          onClick={firstBtnOnClick}
          disabled={firstBtnDisabled}
        >
          {firstBtnContent}
        </Button>

        <Button
          type={secondBtnClass}
          size="lg"
          onClick={secondBtnOnClick}
          disabled={secondBtnDisabled}
        >
          {secondBtnContent}
        </Button>
      </div>
    </div>
  );
};

export default TopNavBar;
