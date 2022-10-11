import { Chain, ChainProviderFn, Connector } from 'wagmi';
import * as sapphire from '@oasisprotocol/sapphire-paratime';

export const sapphireChainTestnet: Chain = {
  id: sapphire.NETWORKS.testnet.chainId,
  name: 'Sapphire',
  network: 'sapphire',
  nativeCurrency: {
    decimals: 18,
    name: 'Sapphire',
    symbol: 'ROSE',
  },
  rpcUrls: {
    default: sapphire.NETWORKS.testnet.defaultGateway,
  },
  blockExplorers: {
    default: { name: 'Sapphire Explorer (Testnet)', url: 'https://testnet.explorer.sapphire.oasis.dev' },
  },
  testnet: true,
};

export const sapphireWrapProvider = (wagmiChainProviderFunction: ChainProviderFn) => (chain: Chain) => {
  const wagmiChainProvider = wagmiChainProviderFunction(chain);

  if (wagmiChainProvider === null) {
    return null;
  }

  (wagmiChainProvider as any)._provider = wagmiChainProvider.provider;

  if (chain.id === sapphireChainTestnet.id) {
    console.log('Wrapping provider...');

    wagmiChainProvider.provider = () => sapphire.wrap((wagmiChainProvider as any)._provider());
  }

  return wagmiChainProvider;
};

export const sapphireWrapConnector = (connector: Connector) => {
  const originalGetProviderFunction = connector.getProvider;

  connector.getProvider = async (...args) => {
    let provider = await originalGetProviderFunction.bind(connector)(...args);

    if (Number(provider.chainId)  === sapphireChainTestnet.id) {
      console.log('Wrapping connector...');

      provider = sapphire.wrap(provider);
    }

    return provider;
  };

  return connector;
};
