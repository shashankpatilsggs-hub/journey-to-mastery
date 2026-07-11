import React from 'react';
import { Activity } from 'lucide-react';

export interface PledgeEvent {
  id: string;
  backer: string;
  amount: number;
  timestamp: Date;
  isBadgeAwarded?: boolean; // For Phase 3
}

interface ActivityFeedProps {
  events: PledgeEvent[];
}

export const ActivityFeed: React.FC<ActivityFeedProps> = ({ events }) => {
  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 shadow-xl h-full flex flex-col">
      <div className="flex items-center gap-2 mb-6">
        <Activity className="w-5 h-5 text-sky-400" />
        <h3 className="text-lg font-bold text-slate-200">Live Activity</h3>
      </div>
      
      <div className="flex-1 overflow-y-auto space-y-4 pr-2">
        {events.length === 0 ? (
          <div className="text-center text-slate-500 text-sm py-8">
            No pledges yet. Be the first!
          </div>
        ) : (
          events.map((event) => (
            <div key={event.id} className="flex items-start gap-3 p-3 rounded-xl bg-slate-950/50 border border-slate-800/50">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-sky-500 to-indigo-500 flex items-center justify-center flex-shrink-0 text-white font-bold text-xs shadow-md">
                {event.backer.slice(0, 2)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-slate-300">
                  <span className="font-semibold text-slate-200 truncate inline-block max-w-[100px] align-bottom">
                    {event.backer.slice(0, 4)}...{event.backer.slice(-4)}
                  </span>
                  {' '}pledged{' '}
                  <span className="font-bold text-sky-400">{event.amount} XLM</span>
                </p>
                <p className="text-xs text-slate-500">
                  {event.timestamp.toLocaleTimeString()}
                </p>
                {event.isBadgeAwarded && (
                  <p className="text-[10px] text-amber-400 font-bold uppercase tracking-wider mt-1 bg-amber-500/10 px-2 py-0.5 rounded-full inline-block border border-amber-500/20">
                    Badge Awarded! 🏅
                  </p>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
