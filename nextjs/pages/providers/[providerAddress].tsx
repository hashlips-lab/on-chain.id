import type { NextPage } from "next";
import Image from "next/image";
import Button from "../../components/Button/Button";
import Nav from "../../components/nav/Nav";
import RightSideContentBox from "../../components/RightSideContentBox/RightSideContentBox";
import TopNavBar from "../../components/TopNavBar/TopNavBar";
import styles from "../../styles/userDashboardProvidersSocialLinks.module.scss";
import { useAccount } from "wagmi";
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { useRouter } from "next/router";
import { keyToString } from "../../lib/types/PrivateDataKey";
import { useOnChainIdContext } from "../../lib/OnChainIdContext";

const userDashboardProvidersSocialLinks: NextPage = () => {
  const router = useRouter();
  const { providerAddress } = router.query;

  const {
    onChainPermissions,
    onChainPermissionsProvider,
    refreshOnChainPermissions,
    writePermissions,
    isWritePermissionsLoading,
    noExpirationValue,
    disableProvider,
    isDisableProviderLoading,
  } = useOnChainIdContext();

  const [editablePermissions, setEditablePermissions] = useState<boolean[]>([]);

  useEffect(() => {
    if (ethers.utils.isAddress(String(providerAddress))) {
      refreshOnChainPermissions(String(providerAddress));
    }
  }, [providerAddress]);

  useEffect(() => {
    setEditablePermissions(onChainPermissions.map((entry) => entry.canRead));
  }, [onChainPermissions]);

  const handleWritePermissionsClick = () => {
    if (!onChainPermissionsProvider) {
      throw new Error(
        "Cannot write permissions before a provider has been selected."
      );
    }

    writePermissions({
      providerAddress: onChainPermissionsProvider,
      updatedPermissions: onChainPermissions.map((entry, index) => {
        return { key: entry.key, canRead: editablePermissions[index] };
      }),
      expiration: noExpirationValue!,
    });
  };

  const permissionsChanged = () => {
    return (
      onChainPermissionsProvider &&
      onChainPermissions.length > 0 &&
      onChainPermissions.reduce(
        (didChange, entry, index) =>
          didChange || entry.canRead !== editablePermissions[index],
        false
      )
    );
  };

  const togglePermissions = (toggleIndex: number) => {
    setEditablePermissions(
      editablePermissions.map((canRead, index) =>
        index === toggleIndex ? !canRead : canRead
      )
    );
  };

  return (
    <div className={styles.userDashboardLinks}>
      <Nav />
      <RightSideContentBox>
        <TopNavBar
          firstBtnClass="borderBlueBgWhiteTextBlue"
          firstBtnContent="MY LINKS"
          firstBtnOnClick={() => router.push("/")}
          mainTitle="Provider Dashboard"
          secondBtnClass="borderBlueBgBlueTextWhite"
          secondBtnContent={
            <div className={styles.btnContent}>
              <Image
                src=".././images/icon/backArrow.svg"
                width={27}
                height={24}
                alt="Back"
              />
              <span>BACK</span>
            </div>
          }
          secondBtnOnClick={() => router.back()}
          subTitle=""
        />
        <div className={styles.midContent}>
          <div className={styles.subBtnTitleWrapper}>
            <div className={styles.title}>{providerAddress}</div>
            <div className={styles.btnWrapper}>
              <Button
                type="borderRedBgWhiteTextRed"
                onClick={() => disableProvider(String(providerAddress))}
                size="sm"
              >
                <div className={styles.btnContent}>
                  <span>REMOVE PROVIDER</span>
                  <div>
                    <Image
                      src=".././images/icon/closeRed.svg"
                      width={16}
                      height={16}
                      alt="Remove"
                    />
                  </div>
                </div>
              </Button>
              <br />
              <br />
              <Button
                disabled={isWritePermissionsLoading || !permissionsChanged()}
                type="borderBlueBgBlueTextWhite"
                onClick={handleWritePermissionsClick}
                size="sm"
              >
                <div className={styles.btnContent}>SAVE</div>
              </Button>
            </div>
          </div>

          <ul>
            {onChainPermissions.map((permissionsEntry, index) => {
              return (
                <li key={index}>
                  <div className={`${styles.listItem}`}>
                    <div className={styles.social}>
                      <div className={styles.icon}>
                        <Image src={"../"} width={60} height={60} />
                      </div>
                      <div className={styles.info}>
                        <span className={styles.title}>
                          {keyToString(permissionsEntry.key)}
                        </span>
                        <span className={styles.description}>
                          Access&nbsp;
                          {editablePermissions[index] ? (
                            <span className="text-green-700">granted</span>
                          ) : (
                            <span className="text-red-700">denied</span>
                          )}
                        </span>
                      </div>
                    </div>

                    <div className={styles.btnWrapper}>
                      <Button
                        type="borderWhiteBgWhiteTextBlue"
                        onClick={() => togglePermissions(index)}
                        size="sm"
                      >
                        <div className={styles.btnContent}>
                          <span>TOGGLE</span>
                        </div>
                      </Button>
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

export default userDashboardProvidersSocialLinks;
