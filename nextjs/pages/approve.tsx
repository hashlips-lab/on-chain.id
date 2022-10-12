import { ethers } from 'ethers';
import type { NextPage } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import ModalWrapper from '../components/Modal/ModalWrapper/ModalWrapper';
import NewProviderRequestModal from '../components/Modal/NewProviderRequestModal/NewProviderRequestModal';
import PermissionsRequestData from '../lib/types/PermissionsRequestData';
import styles from '../styles/Home.module.scss';

const Home: NextPage = () => {
  const router = useRouter();
  const query = router.query;
  const [ data, setData ] = useState<PermissionsRequestData>();

  useEffect(() => {
    if (
      !Array.isArray(query.addr) &&
      typeof query.addr === 'string' &&
      ethers.utils.isAddress(query.addr ?? '') &&
      query.p &&
      query.p.length > 0
    ) {
      setData({
        providerAddress: query.addr,
        requiredPermissions: Array.isArray(query.p) ? query.p : [ query.p ],
        isPreview: false,
      });
    }
  }, [ query ]);

  return (
    <main className={styles.main}>
      <ModalWrapper>
        {data === undefined ?
          <div className="text-center">
            This link is <strong>invalid</strong>!<br />
            Please visit <Link href="/"><a className="font-bold text-[#0075FF] hover:underline">your dashboard</a></Link>.
          </div>
          :
          <NewProviderRequestModal {...data} />
        }
      </ModalWrapper>
    </main>
  );
};

export default Home;
