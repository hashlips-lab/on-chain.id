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
import { sapphireChainTestnet, sapphireWrapConnector, sapphireWrapProvider } from '../lib/SapphireWagmi';
import RouteGuard from '../components/RouteGuard/RouteGuard';

const { chains, provider } = configureChains(
  [ chain.hardhat, sapphireChainTestnet ],
  [ sapphireWrapProvider(publicProvider()) ],
);

const { connectors, wallets } = getDefaultWallets({
  appName: 'On-chain ID',
  chains,
});

const wagmiClient = createClient({
  autoConnect: true,
  connectors: () => connectors().map(connector => sapphireWrapConnector(connector)),
  provider,
});

function OnChainId({ Component, pageProps }: AppProps) {
  return <WagmiConfig client={wagmiClient}>
    <RainbowKitProvider chains={chains}>
      <RouteGuard>
        <ContractConfigProvider>
          <OnChainIdProvider>
            <Component {...pageProps} />
          </OnChainIdProvider>
        </ContractConfigProvider>
      </RouteGuard>
    </RainbowKitProvider>
  </WagmiConfig>;
}

export default OnChainId;
