import '../styles/globals.scss';
import type { AppProps } from 'next/app';
import '@rainbow-me/rainbowkit/styles.css';
import {
  getDefaultWallets,
  RainbowKitProvider,
} from '@rainbow-me/rainbowkit';
import { chain, configureChains, createClient, WagmiConfig } from 'wagmi';
import { publicProvider } from 'wagmi/providers/public';
import { UseContractProvider as ContractConfigProvider } from '../lib/ContractConfigContext';
import { OnChainIdProvider } from '../lib/OnChainIdContext';
import { sapphireChain, sapphireConnectorWrapper, sapphireWrapProvider } from '../lib/SapphireWagmi';

const { chains, provider } = configureChains(
  [ chain.hardhat, sapphireChain ],
  [ sapphireWrapProvider(publicProvider()) ],
);

const { connectors } = getDefaultWallets({
  appName: 'On-chain ID',
  chains,
});

const wagmiClient = createClient({
  autoConnect: true,
  // TODO: not working...
  // eslint-disable-next-line
  //connectors: () => connectors().map(connector => sapphireConnectorWrapper(connector)),
  connectors,
  provider,
});

function MyApp({ Component, pageProps }: AppProps) {
  return <WagmiConfig client={wagmiClient}>
    <RainbowKitProvider chains={chains}>
      <ContractConfigProvider>
        <OnChainIdProvider>
          <Component {...pageProps} />
        </OnChainIdProvider>
      </ContractConfigProvider>
    </RainbowKitProvider>
  </WagmiConfig>;
}

export default MyApp;
