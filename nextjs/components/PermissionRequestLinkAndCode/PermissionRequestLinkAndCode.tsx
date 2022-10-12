import styles from './PermissionRequestLinkAndCode.module.scss';
import Image from 'next/image';
import JsonEditor from '../JsonEditor/JsonEditor';
import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import Link from 'next/link';

import CopyIcon from '../../assets/images/icon/copy.svg';
import { useAccount } from 'wagmi';

interface PermissionRequestLinkAndCodeProps {
  jsonValidationValue: any,
  setJsonValidationValue:Dispatch<SetStateAction<any>>,
}

const PermissionRequestLinkAndCode = ({
  jsonValidationValue,
  setJsonValidationValue,
}: PermissionRequestLinkAndCodeProps) => {
  const [ permissionsRequestLink, setPermissionsRequestLink ] = useState<string>();
  const linkElement = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    if (jsonValidationValue) {
      setPermissionsRequestLink(linkElement.current?.href);
    }
  }, [ jsonValidationValue ]);

  const copyOnClick = () => {
    if (permissionsRequestLink && navigator && navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(permissionsRequestLink);
    }
  };

  return (
    <div className={styles.permissionRequestLinkAndCode}>
      <JsonEditor jsonPermissionSetCallback={setJsonValidationValue}/>

      {jsonValidationValue &&
        <div className={styles.link}>
          <Link href={{
            pathname: '/approve',
            query: {
              addr: jsonValidationValue.providerAddress,
              p: jsonValidationValue.requiredPermissions,
            },
          }}>
            <a ref={linkElement} target="_blank" rel="noreferrer">{permissionsRequestLink}</a>
          </Link>
          <button>
            <Image
              src={CopyIcon.src}
              width={36}
              height={36}
              alt="On chain ID"
              onClick={copyOnClick}
            />
          </button>
        </div>
      }
    </div>
  );
};

export default PermissionRequestLinkAndCode;
