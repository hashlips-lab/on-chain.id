import type { NextPage } from 'next';
import Image from 'next/image';
import Button from '../components/Button/Button';
import Nav from '../components/nav/Nav';
import RightSideContentBox from '../components/RightSideContentBox/RightSideContentBox';
import TopNavBar from '../components/TopNavBar/TopNavBar';
import styles from '../styles/userDashboardProvidersSocialLinks.module.scss';

const KEY_LIST = [
  {
    title: 'Facebook',
    icon: './images/icon/metamask.svg',
    description: 'Log in with MetaMask',
    isOnclick: true,
  },
  {
    title: 'test',
    icon: './images/icon/coinbase.svg',
    description: 'Log in with Coinbase Wallet',
    isOnclick: false,
  },
  {
    title: 'test2',
    icon: './images/icon/walletConnect.svg',
    description: 'Log in with WalletConnect',
    isOnclick: false,
  },
  {
    title: 'test3',
    icon: './images/icon/phantom.svg',
    description: 'Log in with Phantom (Solana)',
    isOnclick: false,
  },
];
const userDashboardProvidersSocialLinks: NextPage = () => {
  return (
    <div className={styles.userDashboardLinks}>
      <Nav />
      <RightSideContentBox>
        <TopNavBar
          firstBtnClass="borderBlueBgWhiteTextBlue"
          firstBtnContent="LINKS"
          firstBtnOnClick={
            () => console.log('Click!') /* TODO: implement this */
          }
          mainTitle="Provider Dashboard"
          secondBtnClass="borderBlueBgBlueTextWhite"
          secondBtnContent={
            <div className={styles.btnContent}>
              <Image
                src="./images/icon/backArrow.svg"
                width={27}
                height={24}
                alt="Back"
              />
              <span>BACK</span>
            </div>
          }
          secondBtnOnClick={
            () => console.log('Click!') /* TODO: implement this */
          }
          subTitle=""
        />
        <div className={styles.midContent}>
          <div className={styles.subBtnTitleWrapper}>
            <div className={styles.title}>
              0xde3B22caAaD25e65C839c2A3d852d665669EdD5c
            </div>
            <div className={styles.button}>
              <Button
                type="borderRedBgWhiteTextRed"
                onClick={() => console.log('Click!') /* TODO: implement this */}
                size="sm"
              >
                <div className={styles.btnContent}>
                  <span>REMOVE PROVIDER</span>
                  <div>
                    <Image
                      src="./images/icon/closeRed.svg"
                      width={16}
                      height={16}
                      alt="Remove"
                    />
                  </div>
                </div>
              </Button>
            </div>
          </div>

          <ul>
            {KEY_LIST.map(({ icon, description, title, isOnclick }, index) => {
              return (
                <li key={index}>
                  <div
                    className={`${styles.listItem} ${
                      isOnclick && styles.selected
                    }`}
                  >
                    <div className={styles.social}>
                      <div className={styles.icon}>
                        <Image
                          src={icon}
                          width={isOnclick ? 72 : 60}
                          height={isOnclick ? 72 : 60}
                          alt={description}
                        />
                      </div>
                      <div className={styles.info}>
                        <span className={styles.title}>{title}</span>
                        <span className={styles.description}>
                          {description}
                        </span>
                      </div>
                    </div>

                    {isOnclick ? (
                      <div className={styles.btnWrapper}>
                        <div className={styles.firstBtn}>
                          <Button
                            type="borderRedBgWhiteTextRed"
                            onClick={
                              () =>
                                console.log('Click!') /* TODO: implement this */
                            }
                            size="sm"
                          >
                            <div className={styles.btnContent}>
                              <span>REMOVE LINK</span>
                              <div>
                                <Image
                                  src="./images/icon/closeRed.svg"
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
                            type="borderGreyBgWhiteTextGrey"
                            onClick={
                              () =>
                                console.log('Click!') /* TODO: implement this */
                            }
                            size="sm"
                          >
                            CANCEL
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <Image
                          src="./images/icon/editPen.svg"
                          width={24}
                          height={24}
                          alt="Remove"
                        />
                      </div>
                    )}
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

export default userDashboardProvidersSocialLinks;
