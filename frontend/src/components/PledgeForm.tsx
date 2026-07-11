import React, { useState } from 'react';
import { pledgeToCampaign } from '../lib/contract';
import { Send, Loader2 } from 'lucide-react';

interface PledgeFormProps {
  publicKey: string;
  onPledgeSuccess: (hash: string, amount: string) => void;
  onPledgeStart?: () => void;
  onPledgeError?: (err: Error) => void;
}

export const PledgeForm: React.FC<PledgeFormProps> = ({ publicKey, onPledgeSuccess, onPledgeStart, onPledgeError }) => {
  const [amount, setAmount] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) return;
    
    setIsSubmitting(true);
    setError(null);
    onPledgeStart?.();
    try {
      const hash = await pledgeToCampaign(publicKey, amount);
      onPledgeSuccess(hash, amount);
      setAmount('');
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to submit pledge');
      onPledgeError?.(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
      <h3 className="text-lg font-bold text-slate-200">Back this Project</h3>
      
      {error && (
        <div className="text-red-400 text-sm bg-red-950/30 border border-red-900/50 p-3 rounded-xl">
          {error}
        </div>
      )}

      <div>
        <label className="block text-xs font-medium text-slate-400 mb-1.5">Pledge Amount (XLM)</label>
        <div className="relative">
          <input
            type="number"
            step="0.0000001"
            min="1"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            disabled={isSubmitting}
            className="w-full bg-slate-950/50 border border-slate-800 rounded-xl px-4 py-3 text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500/50 transition-all"
            placeholder="e.g. 100"
          />
          <div className="absolute right-4 top-3 text-slate-500 font-medium">XLM</div>
        </div>
      </div>

      <button
        type="submit"
        disabled={isSubmitting || !amount}
        className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-semibold py-3 px-6 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-sky-500/20"
      >
        {isSubmitting ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          <>
            <Send className="w-5 h-5" />
            Submit Pledge
          </>
        )}
      </button>
    </form>
  );
};
