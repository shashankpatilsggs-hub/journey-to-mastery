import { useEffect, useState, useCallback, useRef } from "react";
import { rpc, scValToNative } from "@stellar/stellar-sdk";

export interface SorobanActivityEvent {
  id: string;
  type: "donate" | "sub_new" | "pay_exec" | "deposit" | "mint" | "withdraw" | "custom";
  actor: string;
  amount?: string;
  details: string;
  timestamp: string;
}

export interface UseSorobanEventsOptions {
  contractIds?: string[];
  pollInterval?: number;
  limit?: number;
  rpcUrl?: string;
}

export function useSorobanEvents(options: UseSorobanEventsOptions = {}) {
  const {
    contractIds = [],
    pollInterval = 4000,
    limit = 15,
    rpcUrl = "https://soroban-testnet.stellar.org",
  } = options;

  const [events, setEvents] = useState<SorobanActivityEvent[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const seenIdsRef = useRef<Set<string>>(new Set());

  const parseEvent = useCallback((evt: rpc.Api.RawEventResponse): SorobanActivityEvent | null => {
    try {
      if (!evt.topic || evt.topic.length === 0) return null;

      const topic0 = scValToNative(evt.topic[0]);
      const eventName = String(topic0);

      let actor = "Anonymous";
      if (evt.topic.length > 1) {
        try {
          const rawActor = String(scValToNative(evt.topic[1]));
          actor = rawActor.length > 8
            ? `${rawActor.substring(0, 4)}...${rawActor.substring(rawActor.length - 4)}`
            : rawActor;
        } catch {
          actor = "Unknown";
        }
      }

      let parsedAmount = "";
      try {
        if (evt.value) {
          const nativeVal = scValToNative(evt.value);
          if (typeof nativeVal === "number" || typeof nativeVal === "bigint") {
            const valNum = Number(nativeVal);
            // Convert stroops if large
            if (valNum >= 100000) {
              parsedAmount = `${(valNum / 10000000).toFixed(2)} XLM`;
            } else {
              parsedAmount = `${valNum}`;
            }
          }
        }
      } catch {
        // ignore
      }

      const timestamp = evt.ledgerClosedAt
        ? new Date(evt.ledgerClosedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
        : new Date().toLocaleTimeString();

      let details = `Contract event: ${eventName}`;
      let type: SorobanActivityEvent["type"] = "custom";

      if (eventName === "donate") {
        type = "donate";
        details = `Donated ${parsedAmount || "funds"} to campaign`;
      } else if (eventName === "sub_new") {
        type = "sub_new";
        details = `Subscribed to Tier ${parsedAmount || "1"}`;
      } else if (eventName === "pay_exec") {
        type = "pay_exec";
        details = `Recurring payment executed: ${parsedAmount}`;
      } else if (eventName === "deposit") {
        type = "deposit";
        details = `Treasury vault deposit: ${parsedAmount}`;
      } else if (eventName === "mint") {
        type = "mint";
        details = `Supporter NFT Badge minted for ${actor}`;
      } else if (eventName === "withdraw") {
        type = "withdraw";
        details = `Admin withdrawal processed: ${parsedAmount}`;
      }

      return {
        id: evt.id || `evt-${Date.now()}-${Math.random()}`,
        type,
        actor,
        amount: parsedAmount,
        details,
        timestamp,
      };
    } catch (e) {
      console.warn("Failed to parse Soroban event:", e);
      return null;
    }
  }, []);

  const fetchEvents = useCallback(async () => {
    const validContracts = contractIds.filter(Boolean);
    if (validContracts.length === 0) {
      setIsLoading(false);
      return;
    }

    try {
      const server = new rpc.Server(rpcUrl);
      const response = await server.getEvents({
        startLedger: 0,
        filters: [
          {
            type: "contract",
            contractIds: validContracts,
          },
        ],
        limit,
      });

      if (response.events && response.events.length > 0) {
        const parsedList: SorobanActivityEvent[] = [];
        for (const raw of response.events) {
          const parsed = parseEvent(raw);
          if (parsed) {
            parsedList.push(parsed);
            seenIdsRef.current.add(parsed.id);
          }
        }
        setEvents(parsedList);
      }
      setError(null);
    } catch (err: unknown) {
      console.error("Soroban getEvents polling error:", err);
      if (err instanceof Error) {
        setError(err.message);
      }
    } finally {
      setIsLoading(false);
    }
  }, [contractIds, limit, parseEvent, rpcUrl]);

  useEffect(() => {
    let isMounted = true;
    fetchEvents();

    const interval = setInterval(() => {
      if (isMounted) {
        fetchEvents();
      }
    }, pollInterval);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [fetchEvents, pollInterval]);

  return {
    events,
    isLoading,
    error,
    refresh: fetchEvents,
  };
}
