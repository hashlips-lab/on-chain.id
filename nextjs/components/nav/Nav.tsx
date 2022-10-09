import Image from 'next/image';
import styles from './Nav.module.scss';
const Nav = () => {
  return (
    <div className={styles.nav}>
      <ul>
        <li>
          <Image
            src="./images/icon/nav/main.svg"
            width={36}
            height={36}
            alt="On chain ID"
          />
        </li>
        <li>
          <Image
            src="./images/icon/nav/person.svg"
            width={36}
            height={36}
            alt="On chain ID"
          />
        </li>
        <li>
          <Image
            src="./images/icon/nav/personInfo.svg"
            width={36}
            height={36}
            alt="On chain ID"
          />
        </li>
        <li>
          <Image
            src="./images/icon/nav/rightArrow.svg"
            width={36}
            height={36}
            alt="On chain ID"
          />
        </li>
      </ul>
    </div>
  );
};

export default Nav;
