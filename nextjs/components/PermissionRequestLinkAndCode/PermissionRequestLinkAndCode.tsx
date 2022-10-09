import Button from "../Button/Button";
import styles from "./PermissionRequestLinkAndCode.module.scss";
import Image from "next/image";
const PermissionRequestLinkAndCode = () => {
  return (
    <div className={styles.permissionRequestLinkAndCode}>
      <div className={styles.editor}>Code</div>
      <div className={styles.buildBtn}>
        <Button type="borderBlueBgBlueTextWhite" onClick={() => {}} size={"lg"}>
          Build Link
        </Button>
      </div>
      <div className={styles.link}>
        <span>
          https://www.Final/URL/OF/Permissionrequest.com/w.Final/URL/OF/Permissionrequest.com/
        </span>

        <Image
          src="./images/icon/copy.svg"
          width={36}
          height={36}
          alt="On chain ID"
        />
      </div>
    </div>
  );
};

export default PermissionRequestLinkAndCode;
