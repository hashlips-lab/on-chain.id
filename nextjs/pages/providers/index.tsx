import type { NextPage } from "next";
import Button from "../../components/Button/Button";
import Nav from "../../components/nav/Nav";
import RightSideContentBox from "../../components/RightSideContentBox/RightSideContentBox";
import TopNavBar from "../../components/TopNavBar/TopNavBar";
import styles from "../../styles/UserDashboardProviders.module.scss";
import Image from "next/image";
import { useEffect } from "react";
import { useOnChainIdContext } from "../../lib/OnChainIdContext";
import router from "next/router";
import { useAccount } from "wagmi";

import CloseRedIcon from "../../assets/images/icon/closeRed.svg";

const Providers: NextPage = () => {
  const {
    allowedProviders,
    refreshAllowedProviders,
    disableProvider,
    isDisableProviderLoading,
  } = useOnChainIdContext();

  const { address } = useAccount();

  useEffect(() => {
    refreshAllowedProviders();
  }, []);

  return (
    <div className={styles.userDashboardLinks}>
      <Nav />
      <RightSideContentBox>
        <TopNavBar
          firstBtnClass="borderBlueBgWhiteTextBlue"
          firstBtnContent="MY LINKS"
          firstBtnOnClick={() => router.push("/")}
          mainTitle="Provider Dashboard"
          secondBtnClass="borderBlueBgBlueTextWhite"
          secondBtnContent="PROVIDERS"
          secondBtnOnClick={() => router.push("/providers")}
          subTitle={address ?? ""}
        />
        <div className={styles.midContent}>
          <div className={styles.subBtnTitleWrapper}>
            <div className={styles.title}>New Permission Request Link</div>
            {/* <div className={styles.button}>
              <Button
                type="borderRedBgRedTextWhite"
                onClick={() => console.log("Click!") }
                size="md"
              >
                <div className={styles.btnContent}>
                  <span>REMOVE ALL</span>
                  <div>
                    <Image
                      src={CloseIcon.src}
                      width={16}
                      height={16}
                      alt="Remove"
                    />
                  </div>
                </div>
              </Button>
            </div> */}
          </div>

          <ul>
            {allowedProviders.map((provider, index) => {
              return (
                <li key={index}>
                  <div className={styles.listItem}>
                    <span className={styles.keyText}>{provider}</span>
                    <div className={styles.btnWrapper}>
                      <div className={styles.firstBtn}>
                        <Button
                          loading={isDisableProviderLoading}
                          disabled={isDisableProviderLoading}
                          type="borderRedBgWhiteTextRed"
                          onClick={() => disableProvider(provider)}
                          size="sm"
                        >
                          <div className={styles.btnContent}>
                            <span>REMOVE</span>
                            <div>
                              <Image
                                src={CloseRedIcon.src}
                                width={16}
                                height={16}
                                alt="Remove"
                              />
                            </div>
                          </div>
                        </Button>
                      </div>
                      <div className={styles.secondBtn}>
                        <Button
                          loading={false}
                          disabled={false}
                          type="borderBlueBgWhiteTextBlue"
                          onClick={() => router.push(`/providers/${provider}`)}
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
