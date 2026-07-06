import React, { useState } from 'react';
import { useWallet } from '../hooks/useWallet';
import { fundWithFriendbot } from '../lib/stellar';
import { Wallet, LogOut, Coins, Copy, Check, AlertTriangle } from 'lucide-react';

interface WalletConnectProps {
  isFunded: boolean;
  onFundedRefresh: () => Promise<void>;
}

export const WalletConnect: React.FC<WalletConnectProps> = ({ isFunded, onFundedRefresh }) => {
  const { publicKey, isConnected, isConnecting, error, connectWallet, disconnectWallet, clearError } = useWallet();
  const [funding, setFunding] = useState(false);
  const [fundingError, setFundingError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleFund = async () => {
    if (!publicKey) return;
    setFunding(true);
    setFundingError(null);
    try {
      await fundWithFriendbot(publicKey);
      // Wait a moment for Horizon to register the ledger change
      await new Promise((resolve) => setTimeout(resolve, 2000));
      await onFundedRefresh();
    } catch (err: any) {
      setFundingError(err.message || 'Failed to fund account. Please try again.');
    } finally {
      setFunding(false);
    }
  };

  const copyToClipboard = () => {
    if (!publicKey) return;
    navigator.clipboard.writeText(publicKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatKey = (key: string) => {
    return `${key.slice(0, 6)}...${key.slice(-6)}`;
  };

  return (
    <div className="glass p-6 rounded-2xl w-full max-w-md mx-auto shadow-xl">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold flex items-center gap-2 text-slate-100">
          <Wallet className="h-5 w-5 text-sky-400" />
          Wallet Manager
        </h2>
        {isConnected && (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-sky-500/10 text-sky-400 border border-sky-500/20">
            Testnet
          </span>
        )}
      </div>

      {/* Global Wallet Error */}
      {error && (
        <div className="mb-4 p-3 bg-red-950/40 border border-red-500/30 text-red-200 text-sm rounded-lg flex items-start gap-2 relative">
          <AlertTriangle className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />
          <div className="flex-1 pr-6">{error}</div>
          <button 
            onClick={clearError} 
            className="absolute top-2 right-2 text-red-400 hover:text-red-200 text-xs font-semibold"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Friendbot Funding Error */}
      {fundingError && (
        <div className="mb-4 p-3 bg-amber-950/40 border border-amber-500/30 text-amber-200 text-sm rounded-lg flex items-start gap-2">
          <AlertTriangle className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
          <div className="flex-1">{fundingError}</div>
        </div>
      )}

      {!isConnected ? (
        <div className="space-y-4">
          <p className="text-sm text-slate-400">
            Connect your Freighter wallet to start backtesting, creating crowdfunding campaigns, or donating.
          </p>
          <button
            onClick={connectWallet}
            disabled={isConnecting}
            className="w-full py-3 px-4 flex items-center justify-center gap-2 bg-sky-600 hover:bg-sky-500 disabled:bg-slate-800 disabled:text-slate-500 text-white font-semibold rounded-xl transition-all shadow-lg hover:shadow-sky-500/20 duration-200"
          >
            {isConnecting ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Connecting...
              </>
            ) : (
              <>
                <Wallet className="h-5 w-5" />
                Connect Freighter Wallet
              </>
            )}
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Connected Details */}
          <div className="p-3.5 bg-slate-950/60 border border-slate-800/80 rounded-xl flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Account Address</span>
              <span className="text-sm font-mono text-slate-200 select-all">{formatKey(publicKey!)}</span>
            </div>
            <button
              onClick={copyToClipboard}
              className="p-2 text-slate-400 hover:text-slate-200 rounded-lg hover:bg-slate-800/50 transition-colors"
              title="Copy Address"
            >
              {copied ? <Check className="h-4.5 w-4.5 text-emerald-400" /> : <Copy className="h-4.5 w-4.5" />}
            </button>
          </div>

          {/* Unfunded State */}
          {!isFunded && (
            <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl space-y-3">
              <div className="flex gap-2">
                <Coins className="h-5 w-5 text-amber-400 shrink-0" />
                <div>
                  <h4 className="text-sm font-semibold text-amber-200">Account Not Activated</h4>
                  <p className="text-xs text-amber-200/70 mt-0.5">
                    This account is empty and hasn't been registered on the Testnet ledger. Fund it via Friendbot to receive 10,000 test XLM.
                  </p>
                </div>
              </div>
              <button
                onClick={handleFund}
                disabled={funding}
                className="w-full py-2 px-3 bg-amber-500 hover:bg-amber-400 disabled:bg-slate-800 disabled:text-slate-500 text-slate-950 font-bold rounded-lg transition-all text-sm flex items-center justify-center gap-1.5 shadow-md shadow-amber-500/10"
              >
                {funding ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-1.5 h-4 w-4 text-slate-950" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Activating...
                  </>
                ) : (
                  <>
                    <Coins className="h-4 w-4" />
                    Fund with Friendbot
                  </>
                )}
              </button>
            </div>
          )}

          {/* Disconnect Button */}
          <button
            onClick={disconnectWallet}
            className="w-full py-2.5 px-4 flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700/80 text-slate-300 font-semibold rounded-xl transition-all duration-200 border border-slate-700/50"
          >
            <LogOut className="h-4 w-4" />
            Disconnect Wallet
          </button>
        </div>
      )}
    </div>
  );
};
