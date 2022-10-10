import Button from '../Button/Button';
import styles from './PermissionRequestLinkAndCode.module.scss';
import Image from 'next/image';

import CopyIcon from '../../assets/images/icon/copy.svg';

const PermissionRequestLinkAndCode = () => {
  return (
    <div className={styles.permissionRequestLinkAndCode}>
      <div className={styles.editor}>Code</div>
      <div className={styles.buildBtn}>
        <Button
          type="borderBlueBgBlueTextWhite"
          size="lg"
          onClick={() => console.log('Click!')/* TODO: implement this */}
        >Build Link</Button>
      </div>
      <div className={styles.link}>
        <span>
          https://www.Final/URL/OF/Permissionrequest.com/w.Final/URL/OF/Permissionrequest.com/
        </span>

        <Image
          src={CopyIcon.src}
          width={36}
          height={36}
          alt="On chain ID"
        />
      </div>
    </div>
  );
};

export default PermissionRequestLinkAndCode;
