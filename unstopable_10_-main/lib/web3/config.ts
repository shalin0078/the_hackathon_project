// Web3 Network Configuration
export const NETWORKS = {
  LOCALHOST: {
    chainId: 31337,
    name: 'Localhost',
    rpcUrl: 'http://127.0.0.1:8545',
    blockExplorer: null,
    nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 18 }
  },
  SEPOLIA: {
    chainId: 11155111,
    name: 'Sepolia',
    rpcUrl: 'https://eth-sepolia.g.alchemy.com/v2/demo',
    blockExplorer: 'https://sepolia.etherscan.io',
    nativeCurrency: { name: 'SepoliaETH', symbol: 'ETH', decimals: 18 }
  }
} as const;

export const SUPPORTED_CHAIN_IDS = [31337, 11155111];

export const getNetworkConfig = (chainId: number) => {
  if (chainId === 31337) return NETWORKS.LOCALHOST;
  if (chainId === 11155111) return NETWORKS.SEPOLIA;
  return null;
};

export const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || '';
