import Image from 'next/image';
import styles from './Nav.module.scss';
import MainIcon from '../../assets/images/icon/nav/main.svg';
import PersonIcon from '../../assets/images/icon/nav/person.svg';
import PersonInfoIcon from '../../assets/images/icon/nav/personInfo.svg';
import RightArrowIcon from '../../assets/images/icon/nav/rightArrow.svg';

const Nav = () => {
  return (
    <div className={styles.nav}>
      <ul>
        <li>
          <Image
            src={MainIcon.src}
            width={36}
            height={36}
            alt="On chain ID"
          />
        </li>
        <li>
          <Image
            src={PersonIcon.src}
            width={36}
            height={36}
            alt="On chain ID"
          />
        </li>
        <li>
          <Image
            src={PersonInfoIcon.src}
            width={36}
            height={36}
            alt="On chain ID"
          />
        </li>
        <li>
          <Image
            src={RightArrowIcon.src}
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
