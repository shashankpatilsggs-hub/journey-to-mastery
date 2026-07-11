import React, { useState } from 'react';
import { useWallet } from '../hooks/useWallet';
import { horizonServer, TESTNET_NETWORK_PASSPHRASE } from '../lib/stellar';
import { TransactionBuilder, Operation, Asset, Transaction } from '@stellar/stellar-sdk';
import { kit } from '../lib/walletKit';
import { Send, ArrowUpRight, CheckCircle, XCircle, RefreshCw, ExternalLink } from 'lucide-react';

interface SendPaymentProps {
  onPaymentSuccess: () => Promise<void>;
  senderBalance: string | null;
}

type TxState = 'idle' | 'building' | 'signing' | 'submitting' | 'success' | 'error';

export const SendPayment: React.FC<SendPaymentProps> = ({ onPaymentSuccess, senderBalance }) => {
  const { publicKey, isConnected } = useWallet();
  const [destination, setDestination] = useState('');
  const [amount, setAmount] = useState('');
  const [txState, setTxState] = useState<TxState>('idle');
  const [txHash, setTxHash] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!publicKey || !isConnected) return;

    setTxState('building');
    setErrorMsg(null);
    setTxHash(null);

    // Basic client validations
    if (!destination.startsWith('G') || destination.length !== 56) {
      setErrorMsg('Invalid Stellar destination address. Addresses must start with "G" and be 56 characters long.');
      setTxState('error');
      return;
    }

    const pledgeAmt = parseFloat(amount);
    if (isNaN(pledgeAmt) || pledgeAmt <= 0) {
      setErrorMsg('Please enter a valid amount greater than 0.');
      setTxState('error');
      return;
    }

    const currentBal = parseFloat(senderBalance || '0');
    if (pledgeAmt > currentBal) {
      setErrorMsg(`Insufficient balance. You want to send ${amount} XLM, but only have ${senderBalance} XLM.`);
      setTxState('error');
      return;
    }

    try {
      // 1. Fetch source account from Horizon
      let sourceAccount;
      try {
        sourceAccount = await horizonServer.loadAccount(publicKey);
      } catch (err: any) {
        if (err.status === 404 || (err.response && err.response.status === 404)) {
          throw new Error('Your account is not funded. Use the Friendbot button above to get test XLM first.');
        }
        throw err;
      }

      // 2. Build Transaction
      setTxState('building');
      const baseFee = await horizonServer.fetchBaseFee();
      const transaction = new TransactionBuilder(sourceAccount, {
        fee: baseFee.toString(),
        networkPassphrase: TESTNET_NETWORK_PASSPHRASE,
      })
        .addOperation(
          Operation.payment({
            destination,
            asset: Asset.native(),
            amount,
          })
        )
        .setTimeout(180)
        .build();

      // 3. Sign Transaction via Wallet Kit
      setTxState('signing');
      const xdr = transaction.toXDR();
      const signResult = await kit.signTransaction(xdr);
      const signedXdr = typeof signResult === 'string' ? signResult : signResult.signedTxXdr;

      // 4. Submit Transaction to Horizon
      setTxState('submitting');
      const signedTx = TransactionBuilder.fromXDR(signedXdr, TESTNET_NETWORK_PASSPHRASE) as Transaction;
      const response = await horizonServer.submitTransaction(signedTx);
      
      setTxHash(response.hash);
      setTxState('success');
      setDestination('');
      setAmount('');
      
      // Refresh balance
      await onPaymentSuccess();
    } catch (err: any) {
      console.error(err);
      let errMsg = err.message;
      if (err.response?.data?.extras?.result_codes) {
        const codes = err.response.data.extras.result_codes;
        errMsg = `Horizon Error: ${codes.transaction || codes.operations?.join(', ')}`;
      }
      setTxState('error');

      // Check for user rejection
      const msg = errMsg || '';
      if (
        msg.includes('user reject') || 
        msg.includes('User rejected') || 
        msg.includes('declined') || 
        msg.includes('cancel') ||
        err === 'User rejected signing'
      ) {
        setErrorMsg('Transaction signature rejected by user.');
      } 
      // Check for underfunded
      else if (msg.includes('underfunded') || msg.includes('tx_insufficient_balance') || msg.includes('op_underfunded')) {
        setErrorMsg('Insufficient balance to cover the payment amount and the network transaction fee.');
      } 
      // Check for invalid destination on ledger
      else if (msg.includes('op_no_destination') || msg.includes('tx_no_source_account')) {
        setErrorMsg('Destination account does not exist. (You can send funds to activate it, but make sure the address is correct).');
      } 
      // General fallbacks
      else {
        setErrorMsg(err.message || 'Transaction submission failed. Please verify transaction inputs.');
      }
    }
  };

  if (!isConnected) return null;

  return (
    <div className="glass p-6 rounded-2xl w-full max-w-md mx-auto shadow-xl space-y-4">
      <h2 className="text-xl font-bold flex items-center gap-2 text-slate-100">
        <ArrowUpRight className="h-5 w-5 text-sky-400" />
        Send XLM Payment
      </h2>

      <form onSubmit={handleSend} className="space-y-4">
        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Destination Address</label>
          <input
            type="text"
            required
            placeholder="G..."
            value={destination}
            onChange={(e) => setDestination(e.target.value.trim())}
            disabled={txState !== 'idle' && txState !== 'success' && txState !== 'error'}
            className="w-full px-3 py-2 bg-slate-950/60 border border-slate-800 rounded-xl font-mono text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-sky-500 transition-colors"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Amount (XLM)</label>
          <div className="relative">
            <input
              type="number"
              required
              step="0.000001"
              min="0.000001"
              placeholder="0.0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              disabled={txState !== 'idle' && txState !== 'success' && txState !== 'error'}
              className="w-full pl-3 pr-12 py-2 bg-slate-950/60 border border-slate-800 rounded-xl font-medium text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-sky-500 transition-colors"
            />
            <span className="absolute right-3 top-2 text-sm font-bold text-slate-500">XLM</span>
          </div>
        </div>

        <button
          type="submit"
          disabled={txState !== 'idle' && txState !== 'success' && txState !== 'error'}
          className="w-full py-3 bg-sky-600 hover:bg-sky-500 disabled:bg-slate-800 disabled:text-slate-500 text-white font-semibold rounded-xl flex items-center justify-center gap-2 transition-all"
        >
          {txState === 'building' && (
            <>
              <RefreshCw className="h-5 w-5 animate-spin" />
              Building Transaction...
            </>
          )}
          {txState === 'signing' && (
            <>
              <RefreshCw className="h-5 w-5 animate-spin text-amber-400" />
              Waiting for Signature...
            </>
          )}
          {txState === 'submitting' && (
            <>
              <RefreshCw className="h-5 w-5 animate-spin text-emerald-400" />
              Submitting to Ledger...
            </>
          )}
          {(txState === 'idle' || txState === 'success' || txState === 'error') && (
            <>
              <Send className="h-4 w-4" />
              Send Payment
            </>
          )}
        </button>
      </form>

      {/* Transaction Result States */}
      {txState === 'success' && txHash && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl space-y-2">
          <div className="flex items-center gap-2 text-emerald-400 font-semibold text-sm">
            <CheckCircle className="h-4.5 w-4.5" />
            Payment Successful!
          </div>
          <p className="text-xs text-slate-400 font-mono break-all">
            Tx Hash: {txHash}
          </p>
          <a
            href={`https://stellar.expert/explorer/testnet/tx/${txHash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs text-sky-400 hover:underline pt-1 font-semibold"
          >
            View on Stellar.Expert
            <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      )}

      {txState === 'error' && errorMsg && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl space-y-1.5">
          <div className="flex items-center gap-2 text-red-400 font-semibold text-sm">
            <XCircle className="h-4.5 w-4.5" />
            Payment Failed
          </div>
          <p className="text-xs text-red-200/80 leading-relaxed">
            {errorMsg}
          </p>
        </div>
      )}
    </div>
  );
};
