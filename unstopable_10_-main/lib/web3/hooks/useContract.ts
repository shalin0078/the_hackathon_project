'use client';

import { useState, useEffect } from 'react';
import { Contract, BrowserProvider } from 'ethers';
import { CONTRACT_ADDRESS } from '../config';

const CONTRACT_ABI = [
  'function submitInvoice(bytes32 invoiceHash, address payee, uint256 amount, uint8 riskScore, string metadata) external',
  'function getInvoice(bytes32 invoiceHash) external view returns (tuple(bytes32 invoiceHash, address payee, uint256 amount, uint256 timestamp, uint8 status, uint8 riskScore, string metadata))',
  'function getUserInvoices(address user) external view returns (bytes32[])',
  'event InvoiceSubmitted(bytes32 indexed invoiceHash, address indexed payee, uint256 amount)',
  'event InvoiceStatusUpdated(bytes32 indexed invoiceHash, uint8 status)'
];

export function useContract(provider: BrowserProvider | null) {
  const [contract, setContract] = useState<Contract | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!provider || !CONTRACT_ADDRESS) {
      setContract(null);
      return;
    }

    const initContract = async () => {
      try {
        const signer = await provider.getSigner();
        const contractInstance = new Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
        setContract(contractInstance);
        setError(null);
      } catch (err: any) {
        setError(err.message);
        setContract(null);
      }
    };

    initContract();
  }, [provider]);

  const submitInvoice = async (
    invoiceHash: string,
    payee: string,
    amount: bigint,
    riskScore: number,
    metadata: string
  ) => {
    if (!contract) throw new Error('Contract not initialized');
    
    setIsLoading(true);
    try {
      const tx = await contract.submitInvoice(invoiceHash, payee, amount, riskScore, metadata);
      const receipt = await tx.wait();
      return receipt;
    } catch (err: any) {
      throw new Error(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const getInvoice = async (invoiceHash: string) => {
    if (!contract) throw new Error('Contract not initialized');
    return await contract.getInvoice(invoiceHash);
  };

  const getUserInvoices = async (userAddress: string) => {
    if (!contract) throw new Error('Contract not initialized');
    return await contract.getUserInvoices(userAddress);
  };

  return {
    contract,
    isLoading,
    error,
    submitInvoice,
    getInvoice,
    getUserInvoices,
    isReady: !!contract && !!CONTRACT_ADDRESS
  };
}
