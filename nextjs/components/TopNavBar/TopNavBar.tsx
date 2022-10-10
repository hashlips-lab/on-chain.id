import Button, { ButtonProps } from '../Button/Button';
import styles from './TopNavBar.module.scss';

interface TopNavBar {
  mainTitle: string;
  subTitle: string;
  firstBtnClass: ButtonProps['type'];
  firstBtnContent: any;
  firstBtnOnClick: () => void;
  secondBtnClass: ButtonProps['type'];
  secondBtnContent: any;
  secondBtnOnClick: () => void;
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
}: TopNavBar) => {
  return (
    <div className={styles.topNavBar}>
      <div className={styles.topNavBarTitle}>
        <h1 className={styles.h1}>{mainTitle}</h1>
        <span>{subTitle}</span>
      </div>

      <div className={styles.buttonWrapper}>
        <Button type={firstBtnClass} size="lg" onClick={firstBtnOnClick}>
          {firstBtnContent}
        </Button>

        <Button type={secondBtnClass} size="lg" onClick={secondBtnOnClick}>
          {secondBtnContent}
        </Button>
      </div>
    </div>
  );
};

export default TopNavBar;
