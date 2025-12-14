'use client';

import { useState, useEffect } from 'react';
import { BrowserProvider } from 'ethers';
import { SUPPORTED_CHAIN_IDS, getNetworkConfig } from '../config';

export function useWallet() {
  const [address, setAddress] = useState<string | null>(null);
  const [chainId, setChainId] = useState<number | null>(null);
  const [provider, setProvider] = useState<BrowserProvider | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isCorrectNetwork = chainId ? SUPPORTED_CHAIN_IDS.includes(chainId) : false;
  const networkConfig = chainId ? getNetworkConfig(chainId) : null;

  useEffect(() => {
    if (typeof window !== 'undefined' && window.ethereum) {
      const handleAccountsChanged = (accounts: string[]) => {
        setAddress(accounts[0] || null);
      };

      const handleChainChanged = (chainIdHex: string) => {
        setChainId(parseInt(chainIdHex, 16));
        window.location.reload();
      };

      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);

      return () => {
        window.ethereum?.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum?.removeListener('chainChanged', handleChainChanged);
      };
    }
  }, []);

  const connect = async () => {
    if (!window.ethereum) {
      setError('MetaMask not installed');
      return;
    }

    setIsConnecting(true);
    setError(null);

    try {
      const provider = new BrowserProvider(window.ethereum);
      const accounts = await provider.send('eth_requestAccounts', []);
      const network = await provider.getNetwork();

      setProvider(provider);
      setAddress(accounts[0]);
      setChainId(Number(network.chainId));
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsConnecting(false);
    }
  };

  const switchNetwork = async (targetChainId: number) => {
    if (!window.ethereum) return;

    const config = getNetworkConfig(targetChainId);
    if (!config) return;

    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${targetChainId.toString(16)}` }],
      });
    } catch (err: any) {
      if (err.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [{
              chainId: `0x${targetChainId.toString(16)}`,
              chainName: config.name,
              rpcUrls: [config.rpcUrl],
              nativeCurrency: config.nativeCurrency,
              blockExplorerUrls: config.blockExplorer ? [config.blockExplorer] : [],
            }],
          });
        } catch (addError) {
          console.error('Failed to add network:', addError);
        }
      }
    }
  };

  const disconnect = () => {
    setAddress(null);
    setProvider(null);
    setChainId(null);
  };

  return {
    address,
    chainId,
    provider,
    isConnecting,
    isConnected: !!address,
    isCorrectNetwork,
    networkConfig,
    error,
    connect,
    switchNetwork,
    disconnect,
  };
}
