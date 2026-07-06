import { useState, useEffect, useCallback } from 'react';
import { horizonServer } from '../lib/stellar';

export interface UseBalanceResult {
  balance: string | null;
  isFunded: boolean;
  isLoading: boolean;
  error: string | null;
  refreshBalance: () => Promise<void>;
}

export function useBalance(publicKey: string | null): UseBalanceResult {
  const [balance, setBalance] = useState<string | null>(null);
  const [isFunded, setIsFunded] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBalance = useCallback(async () => {
    if (!publicKey) {
      setBalance(null);
      setIsFunded(false);
      setIsLoading(false);
      setError(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const account = await horizonServer.loadAccount(publicKey);
      const nativeBalance = account.balances.find((b) => b.asset_type === 'native');
      if (nativeBalance) {
        setBalance(Number(nativeBalance.balance).toFixed(4));
        setIsFunded(true);
      } else {
        setBalance('0.0000');
        setIsFunded(true);
      }
    } catch (err: any) {
      console.warn('Horizon loadAccount failed:', err);
      // Status 404 indicates the account is not funded yet
      if (err.status === 404 || (err.response && err.response.status === 404)) {
        setBalance('0.0000');
        setIsFunded(false);
      } else {
        setError(err.message || 'Failed to fetch balance. Checking connection...');
      }
    } finally {
      setIsLoading(false);
    }
  }, [publicKey]);

  // Initial fetch and polling
  useEffect(() => {
    fetchBalance();

    if (!publicKey) return;

    // Poll every 12 seconds
    const interval = setInterval(() => {
      fetchBalance();
    }, 12000);

    return () => clearInterval(interval);
  }, [publicKey, fetchBalance]);

  return {
    balance,
    isFunded,
    isLoading,
    error,
    refreshBalance: fetchBalance,
  };
}
