
import { useState } from 'react';
import { useWallet } from './hooks/useWallet';
import { useBalance } from './hooks/useBalance';
import { useContractEvents } from './hooks/useContractEvents';
import { WalletConnect } from './components/WalletConnect';
import { BalanceDisplay } from './components/BalanceDisplay';
import { SendPayment } from './components/SendPayment';
import { CampaignCard } from './components/CampaignCard';
import { PledgeForm } from './components/PledgeForm';
import { ActivityFeed } from './components/ActivityFeed';
import { TxStatusToast, type TxStatus } from './components/TxStatusToast';
import { Coins, Heart, ArrowRight, ShieldAlert } from 'lucide-react';
import './App.css';

function App() {
  const { publicKey, isConnected } = useWallet();
  const { balance, isFunded, isLoading, refreshBalance } = useBalance(publicKey);
  const { events, addLocalEvent } = useContractEvents();
  
  const [txStatus, setTxStatus] = useState<TxStatus>('idle');
  const [txMessage, setTxMessage] = useState<string>('');

  const handlePledgeSuccess = (hash: string, amount: string) => {
    refreshBalance();
    addLocalEvent(Number(amount), publicKey!);
    setTxStatus('success');
    setTxMessage(`Hash: ${hash.substring(0, 6)}...${hash.substring(hash.length - 6)}`);
    setTimeout(() => setTxStatus('idle'), 4000);
  };

  return (
    <div className="min-h-screen flex flex-col justify-between">
      {/* Header */}
      <header className="border-b border-slate-800/80 bg-slate-950/60 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-gradient-to-tr from-sky-500 to-indigo-600 rounded-xl shadow-md shadow-sky-500/10">
              <Coins className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-slate-50 to-slate-200 bg-clip-text text-transparent">
                StellarFund <span className="text-sky-400">Live</span>
              </h1>
              <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Crowdfunding on Soroban</p>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-4 text-sm font-medium text-slate-400">
            <a href="#about" className="hover:text-sky-400 transition-colors">About</a>
            <span className="text-slate-800">|</span>
            <div className="flex items-center gap-1.5 text-slate-500 bg-slate-900/60 border border-slate-800 py-1.5 px-3 rounded-full text-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Stellar Testnet
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-6xl mx-auto px-4 py-12 flex-1 w-full space-y-12">
        {/* Hero Section */}
        <section className="text-center space-y-4 max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-slate-100 leading-tight">
            Decentralized Crowdfunding, <br />
            <span className="bg-gradient-to-r from-sky-400 to-indigo-400 bg-clip-text text-transparent">
              Settled in Real Time.
            </span>
          </h2>
          <p className="text-slate-400 text-sm md:text-base leading-relaxed">
            StellarFund Live brings crowdfund projects to life using Soroban smart contracts. 
            Connect your Freighter wallet, fund with Testnet XLM, and pledge to campaigns with total transparency.
          </p>
        </section>

        {/* Dashboard Grid */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start max-w-4xl mx-auto">
          {/* Left Column: Wallet Connection and Balance */}
          <div className="space-y-8">
            <WalletConnect isFunded={isFunded} onFundedRefresh={refreshBalance} />
            <BalanceDisplay
              balance={balance}
              isFunded={isFunded}
              isLoading={isLoading}
              onRefresh={refreshBalance}
              publicKey={publicKey}
            />
          </div>

          {/* Right Column: Payments and Campaigns */}
          <div className="space-y-8 flex flex-col">
            {isConnected ? (
              <>
                <CampaignCard goal={5000} pledged={2450} deadlineMs={Date.now() + 1000 * 60 * 60 * 24 * 14} />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-8">
                    <PledgeForm 
                      publicKey={publicKey!} 
                      onPledgeSuccess={handlePledgeSuccess}
                      onPledgeStart={() => {
                        setTxStatus('submitting');
                        setTxMessage('Sending to testnet...');
                      }}
                      onPledgeError={(err) => {
                        setTxStatus('fail');
                        setTxMessage(err.message);
                        setTimeout(() => setTxStatus('idle'), 4000);
                      }}
                    />
                    <SendPayment onPaymentSuccess={refreshBalance} senderBalance={balance} />
                  </div>
                  <div className="h-[400px]">
                    <ActivityFeed events={events} />
                  </div>
                </div>
              </>
            ) : (
              <div className="glass p-8 rounded-2xl text-center space-y-4 shadow-xl border-dashed h-full flex flex-col justify-center">
                <div className="p-4 bg-slate-950/40 rounded-full w-14 h-14 flex items-center justify-center mx-auto border border-slate-800">
                  <ShieldAlert className="h-6 w-6 text-slate-500 animate-pulse-slow" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-slate-300">Unlock Dashboard Actions</h3>
                  <p className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed">
                    Connect your Freighter, xBull, Albedo, or Rabet wallet to start interacting with the Campaign contract and live feeds.
                  </p>
                </div>
                <div className="inline-flex items-center gap-1.5 text-[11px] text-sky-400/80 bg-sky-950/20 border border-sky-800/30 px-3 py-1 rounded-full font-semibold">
                  Wallet Required
                  <ArrowRight className="h-3 w-3" />
                </div>
              </div>
            )}
          </div>
        </section>
      </main>

      <TxStatusToast status={txStatus} message={txMessage} />

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/80 py-8 mt-12 text-center text-xs text-slate-500 space-y-2">
        <p className="flex items-center justify-center gap-1">
          Made for the RiseIn Stellar Journey to Mastery with <Heart className="h-3.5 w-3.5 text-red-500 fill-red-500" />
        </p>
        <p>&copy; {new Date().getFullYear()} StellarFund Live. Built on Soroban. Testnet only.</p>
      </footer>
    </div>
  );
}

export default App;
