import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useState } from "react";
import { useAccount } from "wagmi";
import Button from "../../components/Button/Button";
import Input from "../../components/Input/Input";
import Nav from "../../components/nav/Nav";
import RightSideContentBox from "../../components/RightSideContentBox/RightSideContentBox";
import TopNavBar from "../../components/TopNavBar/TopNavBar";
import { AccessDenied, useOnChainIdContext } from "../../lib/OnChainIdContext";
import { keyToBytes } from "../../lib/types/PrivateDataKey";
import styles from "../../styles/manager/Debugger.module.scss";

const Debugger: NextPage = () => {
  const router = useRouter();
  const { address } = useAccount();
  const { userData, refreshUserData, getUserDataError } = useOnChainIdContext();
  const [getUserDataAddressInputValue, setGetUserDataAddressInputValue] =
    useState("");
  const [getUserDataKeyInputValue, setGetUserDataKeyInputValue] = useState("");

  return (
    <div className={styles.userDashboardLinks}>
      <Nav />
      <RightSideContentBox>
        <TopNavBar
          firstBtnClass="borderBlueBgWhiteTextBlue"
          firstBtnContent="DEBUGGER"
          firstBtnOnClick={
            () => console.log("Click!") /* TODO: implement this */
          }
          mainTitle="Provider Dashboard"
          secondBtnClass="borderBlueBgBlueTextWhite"
          secondBtnContent="CREATE"
          secondBtnOnClick={
            () => router.push("/manager/create-link") /* TODO: implement this */
          }
          subTitle={address ?? ""}
          firstBtnDisabled
        />
        <div className={styles.midContent}>
          <div className={styles.title}>Test Permissions</div>

          <div className={styles.inputWrapper}>
            <div>
              <Input
                placeholder="User Address"
                onChange={(e) =>
                  setGetUserDataAddressInputValue(e.target.value)
                }
                required
                pattern="^0x[a-fA-F0-9]{40}$"
              />
            </div>
            <div>
              <Input
                placeholder="Private Data Key"
                onChange={(e) => setGetUserDataKeyInputValue(e.target.value)}
                required
              />
            </div>
          </div>

          <div className={styles.buttonWrapper}>
            <Button
              type="borderBlueBgBlueTextWhite"
              size="lg"
              onClick={() =>
                refreshUserData(
                  getUserDataAddressInputValue,
                  keyToBytes(getUserDataKeyInputValue)
                )
              }
              disabled={
                getUserDataAddressInputValue.length === 0 ||
                getUserDataKeyInputValue.length === 0
              }
            >
              GET DATA
            </Button>
          </div>

          <div className={styles.secondTitle}>Result:</div>
          {getUserDataError ? (
            <div className={styles.error}>
              {getUserDataError.name === AccessDenied
                ? `Access denied or expired: ${String(
                    getUserDataError.expiration
                  )}`
                : "Access denied to this information"}
            </div>
          ) : (
            <div className={styles.subList}>
              {userData ?? <em>No data available...</em>}
            </div>
          )}
        </div>
      </RightSideContentBox>
    </div>
  );
};

export default Debugger;
