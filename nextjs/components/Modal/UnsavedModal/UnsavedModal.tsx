import Button from "../../Button/Button";
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
          <Button type="borderRedBgWhiteTextRed" size="lg" onClick={() => {}}>
            IT’S FINE
          </Button>
          <Button type="borderBlueBgBlueTextWhite" size="lg" onClick={() => {}}>
            TAKE ME BACK
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UnsavedModal;
