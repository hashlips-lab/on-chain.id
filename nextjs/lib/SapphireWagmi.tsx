import { Chain, ChainProviderFn, Connector } from 'wagmi';
import * as sapphire from '@oasisprotocol/sapphire-paratime';

export const sapphireChain: Chain = {
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

export const sapphireWrapProvider = (chainProviderFunction: ChainProviderFn) => (chain: Chain) => {
  const chainProvider = chainProviderFunction(chain);

  if (chainProvider === null) {
    return null;
  }

  (chainProvider as any)._provider = chainProvider.provider;

  if (chain.id === sapphireChain.id) {
    chainProvider.provider = () => sapphire.wrap((chainProvider as any)._provider());
  }

  return chainProvider;
};

export const sapphireConnectorWrapper = (connector: Connector) => {
  let cachedProvider: typeof Connector.prototype.getProvider;

  return new Proxy(connector, {
    get(connector, property) {
      const getProvider: typeof connector.getProvider = async (...args) => {
        if (!cachedProvider) {
          cachedProvider = sapphire.wrap(await connector.getProvider(...args));
        }

        return cachedProvider;
      };

      if (property === 'getProvider') {
        return getProvider;
      }

      if (property in connector) {
        return (connector as any)[property];
      }
    },
  });
};
