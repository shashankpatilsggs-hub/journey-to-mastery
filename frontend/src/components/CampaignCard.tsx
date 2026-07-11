import React from 'react';
import { Target, Clock, Users } from 'lucide-react';

interface CampaignCardProps {
  goal: number;
  pledged: number;
  deadlineMs: number;
}

export const CampaignCard: React.FC<CampaignCardProps> = ({ goal, pledged, deadlineMs }) => {
  const progress = Math.min((pledged / goal) * 100, 100);
  const timeLeft = Math.max(0, Math.floor((deadlineMs - Date.now()) / (1000 * 60 * 60 * 24))); // Days left

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-xl relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-slate-800">
        <div 
          className="h-full bg-gradient-to-r from-sky-400 to-indigo-500 transition-all duration-1000"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-xl font-bold text-slate-100">RiseIn Dev Fund</h3>
          <p className="text-sm text-slate-400 mt-1">Help fund the next generation of Stellar developers.</p>
        </div>
        <div className="bg-indigo-500/10 text-indigo-400 text-xs font-bold px-3 py-1 rounded-full border border-indigo-500/20">
          Active
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-slate-500 text-xs">
            <Target className="w-3.5 h-3.5" /> Goal
          </div>
          <div className="text-lg font-semibold text-slate-200">{goal} XLM</div>
        </div>
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-slate-500 text-xs">
            <Users className="w-3.5 h-3.5" /> Pledged
          </div>
          <div className="text-lg font-semibold text-sky-400">{pledged} XLM</div>
        </div>
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-slate-500 text-xs">
            <Clock className="w-3.5 h-3.5" /> Deadline
          </div>
          <div className="text-lg font-semibold text-slate-200">{timeLeft} Days</div>
        </div>
      </div>
    </div>
  );
};
