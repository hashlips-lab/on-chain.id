import Button from '../Button/Button';
import styles from './PermissionRequest.module.scss';
import Image from 'next/image';

import FacebookIcon from '../../assets/images/icon/facebook.svg';
import HashLipsIcon from '../../assets/images/icon/hashlips.svg';
import GitLabIcon from '../../assets/images/icon/gitlab.svg';
import CheckBoxChecked from '../../assets/images/icon/check.svg';
import CheckBoxUnchecked from '../../assets/images/icon/unCheck.svg';

const SOCIAL_MEDIA_LINKS = [
  {
    icon: FacebookIcon.src,
    name: 'facebook',
    isActive: true,
  },

  {
    icon: HashLipsIcon.src,
    name: 'Hashlips/Hash',
    isActive: false,
  },

  {
    icon: GitLabIcon.src,
    name: 'gitlab',
    isActive: true,
  },
];

const PermissionRequest = () => {
  return (
    <div className={styles.permissionRequest}>
      <h1>Permission Request</h1>
      <span className={styles.publicKey}>
        0xde3B22caAaD25e65C839c2A3d852d665669EdD5c
      </span>
      <span className={styles.listTitle}>
        Is requesting access to the following accounts:
      </span>

      <ul>
        {SOCIAL_MEDIA_LINKS.map(({ icon, name, isActive }, index) => {
          return (
            <li key={index}>
              <div className={styles.socialList}>
                <div className={styles.socialIcon}>
                  <Image src={icon} width={48} height={48} alt={name} />
                </div>

                <div className={styles.socialBox}>
                  <div className={styles.socialName}>{name}</div>

                  <div className={styles.socialStatus}>
                    {isActive ? (
                      <Image
                        src={CheckBoxChecked.src}
                        width={36}
                        height={36}
                        alt={name}
                      />
                    ) : (
                      <Image
                        src={CheckBoxUnchecked.src}
                        width={36}
                        height={36}
                        alt={name}
                      />
                    )}
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ul>

      <div className={styles.buttonWrapper}>
        <Button
          type="borderRedBgWhiteTextRed"
          size="lg"
          onClick={() => console.log('Click!')/* TODO: implement this */}
        >DENY</Button>
        <Button
          type="borderBlueBgBlueTextWhite"
          size="lg"
          onClick={() => console.log('Click!')/* TODO: implement this */}
        >APPROVE</Button>
      </div>

      <p>
        In your <span>LinkList Dashboard</span> you can provide or revoke access
        to all connected providers at any time.
      </p>
    </div>
  );
};

export default PermissionRequest;
