import styles from "./UnsavedModal.module.scss";

const UnsavedModal = () => {
  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h1>Unsaved Changes</h1>
        <p>
          Are you sure you want to leave this page without saving or publishing
          your changes?
        </p>

        <div className={styles.buttonWrapper}>
          <button className={styles.redBorderWhiteBgBtn}>IT’S FINE</button>
          <button className={styles.blueWhiteTextBtn}>TAKE ME BACK</button>
        </div>
      </div>
    </div>
  );
};

export default UnsavedModal;
