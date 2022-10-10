import { ethers } from 'ethers';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import ModalWrapper from '../../components/Modal/ModalWrapper/ModalWrapper';
import NewProviderRequestModal from '../../components/Modal/NewProviderRequestModal/NewProviderRequestModal';
import PermissionsRequestData from '../../lib/types/PermissionsRequestData';
import styles from '../../styles/Home.module.scss';

const Home: NextPage = () => {
  const router = useRouter();
  const query = router.query;
  const [ data, setData ] = useState<PermissionsRequestData>();

  useEffect(() => {
    if (
      Array.isArray(query.providerAddress) &&
      typeof query.providerAddress[0] === 'string' &&
      ethers.utils.isAddress(query.providerAddress[0] ?? '') &&
      query.p &&
      query.p.length > 0
    ) {
      setData({
        providerAddress: query.providerAddress[0],
        requiredPermissions: Array.isArray(query.p) ? query.p : [ query.p ],
        isPreview: false,
      });
    }
  }, [ query ]);

  return (
    <main className={styles.main}>
      <ModalWrapper>
        {data === undefined ?
          <span>This link is invalid!</span>
          :
          <NewProviderRequestModal {...data} />
        }
      </ModalWrapper>
    </main>
  );
};

export default Home;
