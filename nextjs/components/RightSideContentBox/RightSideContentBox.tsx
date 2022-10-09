import styles from './RightSideContentBox.module.scss';

const RightSideContentBox = ({ children }: any) => {
  return <div className={styles.rightSideContentBox}>{children}</div>;
};

export default RightSideContentBox;
