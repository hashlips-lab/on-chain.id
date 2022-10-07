import '../styles/globals.scss';
import type { AppProps } from 'next/app';
import '@rainbow-me/rainbowkit/styles.css';
import {
  getDefaultWallets,
  RainbowKitProvider,
} from '@rainbow-me/rainbowkit';
import { chain, configureChains, createClient, WagmiConfig } from 'wagmi';
import { publicProvider } from 'wagmi/providers/public';
import { UseContractProvider as ContractConfigProvider } from '../scripts/ContractConfigContext';
import { OnChainIdProvider } from '../scripts/OnChainIdContext';
import { sapphireChain, sapphireConnectorWrapper, sapphireWrapProvider } from '../scripts/lib/OnChainId/SapphireWagmi';

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
