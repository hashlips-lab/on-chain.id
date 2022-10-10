import styles from './PermissionRequestLinkAndCode.module.scss';
import Image from 'next/image';
import JsonEditor from '../JsonEditor/JsonEditor';
import { Dispatch, SetStateAction, useState } from 'react';
import Link from 'next/link';

import CopyIcon from '../../assets/images/icon/copy.svg';

const PermissionRequestLinkAndCode = (props: {
  jsonValidationValue: any,
  setJsonValidationValue:Dispatch<SetStateAction<any>>,
}) => {
  const [ permissionRequestLink, setPermissionRequestLink ] = useState('');

  const copyOnClick = () => {
    // TODO: originally used the permissionRequestLink,
    //       update it to the link containing element
    if (navigator && navigator.clipboard && navigator.clipboard.writeText) {
      console.log('Copied');

      return navigator.clipboard.writeText(permissionRequestLink);
    }
  };

  return (
    <div className={styles.permissionRequestLinkAndCode}>
      <JsonEditor jsonPermissionSetCallback={props.setJsonValidationValue}/>
      {props.jsonValidationValue &&
        <div className={styles.link}>
          {/* TODO: add provider*/}
          <Link href={{
            pathname: '/approve/',
            query: { p: props.jsonValidationValue.requiredPermissions },
          }}>
            <a target="_blank" rel="noreferrer">link</a>
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
