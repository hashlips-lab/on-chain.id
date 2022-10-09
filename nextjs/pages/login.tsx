import { ConnectButton } from '@rainbow-me/rainbowkit';
import type { NextPage } from 'next';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useAccount } from 'wagmi';
import styles from '../styles/Login.module.scss';

const DEFAULT_REDIRECT_PATH = '/';

const Login: NextPage = () => {
  const router = useRouter();
  const { isConnected } = useAccount();

  useEffect(() => {
    if (isConnected) {
      const returnUrl = router.query.returnUrl || DEFAULT_REDIRECT_PATH;

      // router.push doesn't work properly (causes infinite redirect loop)
      window.location.href = Array.isArray(returnUrl) ? returnUrl[0] ?? '' : returnUrl;
    }
  }, [ isConnected ]);

  return (
    <div className={styles.container}>
      <div className={styles.left_content}>
        <div className={styles.logo_section}>
          <div className={styles.welcome}>Welcome to</div>
          <div className={styles.logo}>
            <Image
              src="./images/logo.svg"
              width={261}
              height={222}
              alt="On chain ID"
            />
          </div>
          <div className={styles.questions}>Questions?</div>
          <div className={styles.faq}>
            Check out our&nbsp;
            <a href="#" onClick={() => alert('This has not been implemented yet!')/* TODO: implement this */}>FAQs</a>
          </div>
        </div>
      </div>
      <div className={styles.right_content}>
        <h1>Sign in with your wallet</h1>
        <p>
          If you don&#39;t have a wallet yet, you can select a provider and
          create one now.
        </p>

        <div className={styles.buttonContainer}>
          <ConnectButton label="Connect wallet or create one" />
        </div>

        {/* TODO: We have no error to show here since RainbowKit handles
                  everything inside its popup.
        <div className={styles.error}>
          Chain Error! Please change to MainNet.
        </div>
        */}
      </div>
    </div>
  );
};

export default Login;
