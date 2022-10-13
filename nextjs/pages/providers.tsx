import type { NextPage } from 'next';
import Button from '../components/Button/Button';
import Nav from '../components/nav/Nav';
import RightSideContentBox from '../components/RightSideContentBox/RightSideContentBox';
import TopNavBar from '../components/TopNavBar/TopNavBar';
import styles from '../styles/providers/Providers.module.scss';
import Image from 'next/image';
import { useOnChainIdContext } from '../lib/OnChainIdContext';
import router from 'next/router';
import { useAccount } from 'wagmi';

import CloseRedIcon from '../assets/images/icon/closeRed.svg';

const Providers: NextPage = () => {
  const {
    allowedProviders,
    refreshAllowedProviders,
    areAllowedProvidersRefreshing,

    disableProvider,
    isDisableProviderLoading,
  } = useOnChainIdContext();

  const { address } = useAccount();

  return (
    <div className={styles.userDashboardLinks}>
      <Nav />
      <RightSideContentBox>
        <TopNavBar
          mainTitle="My Providers"
          subTitle={address ?? ''}
          firstBtnClass="borderBlueBgWhiteTextBlue"
          firstBtnContent="MY DATA"
          firstBtnOnClick={() => router.push('/')}
          secondBtnClass="borderBlueBgBlueTextWhite"
          secondBtnContent="PROVIDERS"
          secondBtnDisabled
        />
        <div className={styles.midContent}>
          <div className={styles.subBtnTitleWrapper}>
            <div className={styles.title}>Manage access permissions</div>
          </div>

          <div className="flex justify-center mb-8">
            <Button
              loading={areAllowedProvidersRefreshing}
              disabled={areAllowedProvidersRefreshing || isDisableProviderLoading}
              type="borderBlueBgBlueTextWhite"
              onClick={() => refreshAllowedProviders()}
              size="sm"
            >Refresh providers</Button>
          </div>
          <ul className={(areAllowedProvidersRefreshing || isDisableProviderLoading) ? 'animate-pulse' : ''}>
            {allowedProviders.map((provider, index) => {
              return (
                <li key={index}>
                  <div className={styles.listItem}>
                    <span className={styles.keyText}>{provider}</span>
                    <div className={styles.btnWrapper}>
                      <div className={styles.firstBtn}>
                        <Button
                          loading={isDisableProviderLoading}
                          disabled={areAllowedProvidersRefreshing || isDisableProviderLoading}
                          type="borderRedBgWhiteTextRed"
                          onClick={() => disableProvider(provider)}
                          size="sm"
                        >
                          <div className={styles.btnContent}>
                            <span>REMOVE</span>
                            <Image
                              src={CloseRedIcon.src}
                              width={16}
                              height={16}
                              alt="Remove"
                            />
                          </div>
                        </Button>
                      </div>
                      <div className={styles.secondBtn}>
                        <Button
                          type="borderBlueBgWhiteTextBlue"
                          onClick={() => router.push({ pathname: '/provider', query: { addr: provider } })}
                          size="sm"
                        >
                          VIEW
                        </Button>
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </RightSideContentBox>
    </div>
  );
};

export default Providers;
