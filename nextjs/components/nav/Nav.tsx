import Image from "next/image";
import styles from "./Nav.module.scss";

import MainIcon from "../../assets/images/icon/nav/white/main.svg";
import PersonIcon from "../../assets/images/icon/nav/white/person.svg";
import PersonInfoIcon from "../../assets/images/icon/nav/white/personInfo.svg";

import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import PersonIconGreen from "../../assets/images/icon/nav/green/person.svg";
import PersonInfoIconGreen from "../../assets/images/icon/nav/green/personInfo.svg";

interface NavProps {
  activeNav?: "person" | "info";
}

const Nav = ({ activeNav = "person" }: NavProps) => {
  const [activeNavigation, setActiveNavigation] = useState(activeNav);

  const router = useRouter();

  useEffect(() => {
    if (router.asPath === "/") {
      setActiveNavigation("person");
    } else if (
      router.asPath === "/manager/create-link" ||
      router.asPath === "/manager/debugger"
    ) {
      setActiveNavigation("info");
    }
  }, []);

  return (
    <div className={styles.nav}>
      <ul>
        <li>
          <Image src={MainIcon.src} width={36} height={36} alt="On chain ID" />
        </li>
        <li onClick={() => router.push("/")}>
          {activeNavigation === "person" ? (
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
        <li onClick={() => router.push("/manager/create-link")}>
          {activeNavigation === "info" ? (
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
