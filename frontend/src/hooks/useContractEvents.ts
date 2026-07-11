import { useState } from 'react';
import type { PledgeEvent } from '../components/ActivityFeed';

// A mock hook for Phase 2 until Soroban getEvents is fully wired
export const useContractEvents = () => {
  const [events, setEvents] = useState<PledgeEvent[]>([
    {
      id: 'mock-1',
      backer: 'GAX...34B',
      amount: 50,
      timestamp: new Date(Date.now() - 1000 * 60 * 5),
    },
    {
      id: 'mock-2',
      backer: 'GBY...99Z',
      amount: 150,
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
      isBadgeAwarded: true, // Previewing Phase 3 feature
    }
  ]);

  // In a real implementation, this would poll server.getEvents({ filters: [...] })
  
  const addLocalEvent = (amount: number, backer: string) => {
    const newEvent: PledgeEvent = {
      id: Math.random().toString(),
      backer,
      amount,
      timestamp: new Date(),
    };
    setEvents(prev => [newEvent, ...prev]);
  };

  return { events, addLocalEvent };
};
