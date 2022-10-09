import type { NextPage } from 'next';
import Image from 'next/image';
import styles from '../styles/Login.module.scss';

const WALLET_LIST = [
  { icon: './images/icon/metamask.svg', description: 'Log in with MetaMask' },
  {
    icon: './images/icon/coinbase.svg',
    description: 'Log in with Coinbase Wallet',
  },
  {
    icon: './images/icon/walletConnect.svg',
    description: 'Log in with WalletConnect',
  },
  {
    icon: './images/icon/phantom.svg',
    description: 'Log in with Phantom (Solana)',
  },
  { icon: './images/icon/glow.svg', description: 'Log in with Glow (Solana)' },
];

const Login: NextPage = () => {
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
            Check out our <a href="#">FAQs</a>
          </div>
        </div>
      </div>
      <div className={styles.right_content}>
        <h1>Sign in with your wallet</h1>
        <p>
          If you don&#39;t have a wallet yet, you can select a provider and
          create one now.
        </p>

        <ul>
          {WALLET_LIST.map(({ icon, description }, i) => {
            return (
              <li key={i}>
                <button className={styles.wallet}>
                  <div className={styles.icon}>
                    <Image
                      src={icon}
                      width={36}
                      height={36}
                      alt={description}
                    />
                  </div>

                  <div>{description}</div>
                </button>
              </li>
            );
          })}

          <li>
            <button className={styles.moreOption}>SHOW MORE OPTIONS</button>
          </li>
        </ul>

        <div className={styles.error}>
          Chain Error! Please change to MainNet.
        </div>
      </div>
    </div>
  );
};

export default Login;
