import React from 'react';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';

export type TxStatus = 'idle' | 'building' | 'signing' | 'submitting' | 'success' | 'fail';

interface TxStatusToastProps {
  status: TxStatus;
  message?: string;
}

export const TxStatusToast: React.FC<TxStatusToastProps> = ({ status, message }) => {
  if (status === 'idle') return null;

  const getIcon = () => {
    switch (status) {
      case 'building':
      case 'signing':
      case 'submitting':
        return <Loader2 className="w-5 h-5 animate-spin text-sky-400" />;
      case 'success':
        return <CheckCircle className="w-5 h-5 text-emerald-400" />;
      case 'fail':
        return <XCircle className="w-5 h-5 text-red-400" />;
      default:
        return null;
    }
  };

  const getLabel = () => {
    switch (status) {
      case 'building': return 'Building transaction...';
      case 'signing': return 'Waiting for signature...';
      case 'submitting': return 'Submitting to network...';
      case 'success': return 'Transaction confirmed!';
      case 'fail': return 'Transaction failed';
      default: return '';
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5 fade-in duration-300">
      <div className="bg-slate-900/90 backdrop-blur border border-slate-800 rounded-xl shadow-2xl p-4 flex items-center gap-3 min-w-[250px]">
        {getIcon()}
        <div>
          <p className="text-sm font-semibold text-slate-200">{getLabel()}</p>
          {message && <p className="text-xs text-slate-400 max-w-xs truncate" title={message}>{message}</p>}
        </div>
      </div>
    </div>
  );
};
