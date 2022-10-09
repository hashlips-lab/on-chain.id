import styles from './ModalWrapper.module.scss';

const ModalWrapper = ({ children }: any) => {
  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>{children}</div>
    </div>
  );
};

export default ModalWrapper;
