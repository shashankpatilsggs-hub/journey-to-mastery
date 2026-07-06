import React from 'react';
import { Coins, RefreshCw } from 'lucide-react';

interface BalanceDisplayProps {
  balance: string | null;
  isFunded: boolean;
  isLoading: boolean;
  onRefresh: () => Promise<void>;
  publicKey: string | null;
}

export const BalanceDisplay: React.FC<BalanceDisplayProps> = ({
  balance,
  isFunded,
  isLoading,
  onRefresh,
  publicKey,
}) => {
  if (!publicKey) {
    return (
      <div className="glass p-6 rounded-2xl w-full max-w-md mx-auto shadow-xl text-center space-y-2">
        <Coins className="h-8 w-8 text-slate-600 mx-auto animate-pulse-slow" />
        <h3 className="text-md font-semibold text-slate-400">Balance Unavailable</h3>
        <p className="text-xs text-slate-500">Connect your wallet to see your XLM balance.</p>
      </div>
    );
  }

  return (
    <div className="glass p-6 rounded-2xl w-full max-w-md mx-auto shadow-xl space-y-4 relative overflow-hidden group">
      {/* Background visual elements */}
      <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-sky-500/5 rounded-full blur-xl group-hover:bg-sky-500/10 transition-all duration-500"></div>

      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-sky-400/90 tracking-wider uppercase flex items-center gap-1.5">
          <Coins className="h-3.5 w-3.5" />
          Native Balance
        </span>
        <button
          onClick={() => onRefresh()}
          disabled={isLoading}
          className="p-1 text-slate-400 hover:text-slate-200 disabled:text-slate-600 hover:bg-slate-800/40 rounded transition-all"
          title="Refresh Balance"
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin text-sky-400' : ''}`} />
        </button>
      </div>

      <div className="space-y-1">
        {isLoading && balance === null ? (
          <div className="h-10 w-36 skeleton rounded-lg"></div>
        ) : (
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-extrabold text-slate-100 tracking-tight">
              {isFunded ? balance : '0.0000'}
            </span>
            <span className="text-lg font-bold text-sky-400/80">XLM</span>
          </div>
        )}

        {!isFunded && !isLoading && (
          <p className="text-xs text-amber-400 font-medium">
            Account not activated (0 XLM on testnet)
          </p>
        )}
      </div>

      <div className="pt-2 flex items-center justify-between text-[11px] text-slate-500 border-t border-slate-800/60">
        <span>Asset Type: Native</span>
        <span>Network: Horizon Testnet</span>
      </div>
    </div>
  );
};
