import Button from '../../Button/Button';
import styles from './UnsavedModal.module.scss';

const UnsavedModal = () => {
  return (
    <div className={styles.modalBody}>
      <h1>Unsaved Changes</h1>
      <p>
        Are you sure you want to leave this page without saving or publishing
        your changes?
      </p>

      <div className={styles.buttonWrapper}>
        <Button type="borderRedBgWhiteTextRed" size="lg" onClick={() => {console.log('Click!');/* TODO: implement this */}}>
          IT’S FINE
        </Button>
        <Button type="borderBlueBgBlueTextWhite" size="lg" onClick={() => {console.log('Click!');/* TODO: implement this */}}>
          TAKE ME BACK
        </Button>
      </div>
    </div>
  );
};

export default UnsavedModal;
