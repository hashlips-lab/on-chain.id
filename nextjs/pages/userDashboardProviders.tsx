import type { NextPage } from 'next';
import Button from '../components/Button/Button';
import Nav from '../components/nav/Nav';
import RightSideContentBox from '../components/RightSideContentBox/RightSideContentBox';
import TopNavBar from '../components/TopNavBar/TopNavBar';
import styles from '../styles/UserDashboardProviders.module.scss';
import Image from 'next/image';

import CloseRedIcon from '../assets/images/icon/closeRed.svg';
import CloseIcon from '../assets/images/icon/close.svg';

const KEY_LIST = [
  '0xde3B22caAaD25e65C839c2A3d852d665669EdD5c',
  '0xde3B22caAaD25e65C839c2A3d852d665669EdD5c',
  '0xde3B22caAaD25e65C839c2A3d852d665669EdD5c',
];

const UserDashboardProviders: NextPage = () => {
  return (
    <div className={styles.userDashboardLinks}>
      <Nav />
      <RightSideContentBox>
        <TopNavBar
          firstBtnClass="borderBlueBgWhiteTextBlue"
          firstBtnContent="TEST"
          firstBtnOnClick={() => console.log('Click!')/* TODO: implement this */}
          mainTitle="Provider Dashboard"
          secondBtnClass="borderBlueBgBlueTextWhite"
          secondBtnContent="CREATE"
          secondBtnOnClick={() => console.log('Click!')/* TODO: implement this */}
          subTitle="0xde3B22caAaD25e65C839c2A3d852d665669EdD5c"
        />
        <div className={styles.midContent}>
          <div className={styles.subBtnTitleWrapper}>
            <div className={styles.title}>New Permission Request Link</div>
            <div className={styles.button}>
              <Button
                type="borderRedBgRedTextWhite"
                onClick={() => console.log('Click!')/* TODO: implement this */}
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
            </div>
          </div>

          <ul>
            {KEY_LIST.map((key, index) => {
              return (
                <li key={index}>
                  <div className={styles.listItem}>
                    <span className={styles.keyText}>{key}</span>
                    <div className={styles.btnWrapper}>
                      <div className={styles.firstBtn}>
                        <Button
                          type="borderRedBgWhiteTextRed"
                          onClick={() => console.log('Click!')/* TODO: implement this */}
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
                          type="borderBlueBgWhiteTextBlue"
                          onClick={() => console.log('Click!')/* TODO: implement this */}
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

export default UserDashboardProviders;
