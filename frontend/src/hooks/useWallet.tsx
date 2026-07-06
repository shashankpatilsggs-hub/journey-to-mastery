import React, { createContext, useContext, useState, useEffect } from 'react';
import { kit } from '../lib/walletKit';

interface WalletContextType {
  publicKey: string | null;
  isConnected: boolean;
  isConnecting: boolean;
  error: string | null;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => Promise<void>;
  clearError: () => void;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [publicKey, setPublicKey] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Sync wallet connection status on mount if previously connected
  useEffect(() => {
    const checkConnection = async () => {
      try {
        const { address } = await kit.getAddress({ skipRequestAccess: true });
        if (address) {
          setPublicKey(address);
        }
      } catch (err) {
        console.warn('Failed to check initial wallet connection status:', err);
      }
    };
    checkConnection();
  }, []);

  const connectWallet = async () => {
    setIsConnecting(true);
    setError(null);
    try {
      // Open the wallet kit connection modal
      await kit.openModal({
        onWalletSelected: async (option) => {
          console.log('Selected wallet:', option.id);
          try {
            kit.setWallet(option.id);
            const { address } = await kit.getAddress();
            setPublicKey(address);
          } catch (keyErr: any) {
            console.error('Failed to get public key after connect:', keyErr);
            setError(keyErr.message || 'Failed to retrieve wallet public key.');
          }
        },
        onClosed: () => {
          setIsConnecting(false);
        },
        modalTitle: 'Connect Wallet'
      });
    } catch (err: any) {
      console.error('Wallet connection modal failed:', err);
      setError(err.message || 'Failed to connect wallet.');
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectWallet = async () => {
    try {
      await kit.disconnect();
      setPublicKey(null);
      setError(null);
    } catch (err: any) {
      console.error('Failed to disconnect wallet:', err);
      setError(err.message || 'Failed to disconnect wallet.');
    }
  };

  const clearError = () => setError(null);

  return (
    <WalletContext.Provider
      value={{
        publicKey,
        isConnected: !!publicKey,
        isConnecting,
        error,
        connectWallet,
        disconnectWallet,
        clearError,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = (): WalletContextType => {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};
