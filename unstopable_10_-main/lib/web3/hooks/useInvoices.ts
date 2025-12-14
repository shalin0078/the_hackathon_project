'use client';

import { useState, useEffect } from 'react';
import { useContract } from './useContract';
import { BrowserProvider } from 'ethers';

export interface Invoice {
  hash: string;
  payee: string;
  amount: bigint;
  timestamp: number;
  status: number;
  riskScore: number;
  metadata: string;
}

export function useInvoices(provider: BrowserProvider | null, userAddress: string | null) {
  const { contract, getUserInvoices, getInvoice } = useContract(provider);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!contract || !userAddress) {
      setInvoices([]);
      return;
    }

    const fetchInvoices = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const hashes = await getUserInvoices(userAddress);
        const invoiceData = await Promise.all(
          hashes.map(async (hash: string) => {
            const data = await getInvoice(hash);
            return {
              hash: data[0],
              payee: data[1],
              amount: data[2],
              timestamp: Number(data[3]),
              status: data[4],
              riskScore: data[5],
              metadata: data[6]
            };
          })
        );
        setInvoices(invoiceData);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInvoices();
  }, [contract, userAddress]);

  const refresh = async () => {
    if (!contract || !userAddress) return;
    
    setIsLoading(true);
    try {
      const hashes = await getUserInvoices(userAddress);
      const invoiceData = await Promise.all(
        hashes.map(async (hash: string) => {
          const data = await getInvoice(hash);
          return {
            hash: data[0],
            payee: data[1],
            amount: data[2],
            timestamp: Number(data[3]),
            status: data[4],
            riskScore: data[5],
            metadata: data[6]
          };
        })
      );
      setInvoices(invoiceData);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    invoices,
    isLoading,
    error,
    refresh
  };
}
