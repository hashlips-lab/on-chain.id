import styles from './NewProviderRequestModal.module.scss';
import Image from 'next/image';
import PermissionRequest from '../../PermissionRequest/PermissionRequest';

import OnChainIdLogo from '../../../assets/images/icon/onChainID.svg';
import PermissionsRequestData from '../../../lib/types/PermissionsRequestData';

const NewProviderRequestModal = (data: PermissionsRequestData) => {
  return (
    <div className={styles.modalBody}>
      <div className={styles.icon}>
        <Image
          src={OnChainIdLogo.src}
          width={250}
          height={36}
          alt="On chain ID"
        />
      </div>
      <PermissionRequest {...data} />
    </div>
  );
};

export default NewProviderRequestModal;
