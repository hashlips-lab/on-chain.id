import styles from './NewProviderRequestModal.module.scss';
import Image from 'next/image';
import PermissionRequest from '../../PermissionRequest/PermissionRequest';

const NewProviderRequestModal = () => {
  return (
    <div className={styles.modalBody}>
      <div className={styles.icon}>
        <Image
          src="./images/icon/onChainID.svg"
          width={250}
          height={36}
          alt="On chain ID"
        />
      </div>
      <PermissionRequest />
    </div>
  );
};

export default NewProviderRequestModal;
