import Image from "next/image";
import styles from "./Nav.module.scss";

import MainIcon from "../../assets/images/icon/nav/white/main.svg";
import PersonIcon from "../../assets/images/icon/nav/white/person.svg";
import PersonInfoIcon from "../../assets/images/icon/nav/white/personInfo.svg";
import RightArrowIcon from "../../assets/images/icon/nav/white/rightArrow.svg";

import MainIconGreen from "../../assets/images/icon/nav/green/main.svg";
import PersonIconGreen from "../../assets/images/icon/nav/green/person.svg";
import PersonInfoIconGreen from "../../assets/images/icon/nav/green/personInfo.svg";
import RightArrowIconGreen from "../../assets/images/icon/nav/green/rightArrow.svg";

interface NavProps {
  activeNav?: "person" | "info";
}

const Nav = ({ activeNav = "person" }: NavProps) => {
  return (
    <div className={styles.nav}>
      <ul>
        <li>
          <Image src={MainIcon.src} width={36} height={36} alt="On chain ID" />
        </li>
        <li>
          {activeNav === "person" ? (
            <Image
              src={PersonIconGreen.src}
              width={36}
              height={36}
              alt="On chain ID"
            />
          ) : (
            <>
              <div className={styles.active}>
                <Image
                  src={PersonIconGreen.src}
                  width={36}
                  height={36}
                  alt="On chain ID"
                  className={styles.active}
                />
              </div>
              <div className={styles.inactive}>
                <Image
                  src={PersonIcon.src}
                  width={36}
                  height={36}
                  alt="On chain ID"
                  className={styles.inactive}
                />
              </div>
            </>
          )}
        </li>
        <li>
          {activeNav === "info" ? (
            <Image
              src={PersonInfoIconGreen.src}
              width={36}
              height={36}
              alt="On chain ID"
            />
          ) : (
            <>
              <div className={styles.active}>
                <Image
                  src={PersonInfoIconGreen.src}
                  width={36}
                  height={36}
                  alt="On chain ID"
                  className={styles.active}
                />
              </div>
              <div className={styles.inactive}>
                <Image
                  src={PersonInfoIcon.src}
                  width={36}
                  height={36}
                  alt="On chain ID"
                  className={styles.inactive}
                />
              </div>
            </>
          )}
        </li>
        {/* <li>
          {activeNav === 'logout' ? (
            <Image
              src={RightArrowIconGreen.src}
              width={36}
              height={36}
              alt="On chain ID"
            />
          ) : (
            <>
              <div className={styles.active}>
                <Image
                  src={RightArrowIconGreen.src}
                  width={36}
                  height={36}
                  alt="On chain ID"
                  className={styles.active}
                />
              </div>
              <div className={styles.inactive}>
                <Image
                  src={RightArrowIcon.src}
                  width={36}
                  height={36}
                  alt="On chain ID"
                  className={styles.inactive}
                />
              </div>{' '}
            </>
          )}
        </li> */}
      </ul>
    </div>
  );
};

export default Nav;
