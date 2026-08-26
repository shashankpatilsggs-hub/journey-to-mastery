"use client";

import React from "react";
import { useSorobanEvents } from "@/hooks/useSorobanEvents";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { motion, AnimatePresence } from "framer-motion";
import { Activity, Award, CheckCircle, Flame, Layers, Radio, Sparkles } from "lucide-react";

export function ActivityFeed() {
  const fundContractId = process.env.NEXT_PUBLIC_FUND_CONTRACT_ID || "";
  const badgeContractId = process.env.NEXT_PUBLIC_BADGE_CONTRACT_ID || "";
  const treasuryContractId = process.env.NEXT_PUBLIC_TREASURY_CONTRACT_ID || "";
  const subManagerId = process.env.NEXT_PUBLIC_SUB_MANAGER_ID || "";

  const contracts = [fundContractId, badgeContractId, treasuryContractId, subManagerId].filter(Boolean);

  const { events, isLoading, error } = useSorobanEvents({
    contractIds: contracts.length > 0 ? contracts : undefined,
    pollInterval: 3500,
  });

  const getEventIcon = (type: string) => {
    switch (type) {
      case "mint":
        return <Award className="w-4 h-4 text-amber-400" />;
      case "deposit":
        return <Layers className="w-4 h-4 text-emerald-400" />;
      case "sub_new":
      case "pay_exec":
        return <Sparkles className="w-4 h-4 text-cyan-400" />;
      case "donate":
      default:
        return <Flame className="w-4 h-4 text-primary" />;
    }
  };

  const getEventBadge = (type: string) => {
    switch (type) {
      case "mint":
        return "bg-amber-500/10 text-amber-400 border-amber-500/30";
      case "deposit":
        return "bg-emerald-500/10 text-emerald-400 border-emerald-500/30";
      case "sub_new":
        return "bg-cyan-500/10 text-cyan-400 border-cyan-500/30";
      default:
        return "bg-primary/10 text-primary border-primary/30";
    }
  };

  return (
    <Card className="w-full max-w-md bg-card/40 backdrop-blur-md border-border/50 text-card-foreground shadow-xl">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-primary" />
            <CardTitle className="text-xl font-bold">Recent Activity</CardTitle>
          </div>
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Live Stream
          </div>
        </div>
        <CardDescription className="text-xs text-muted-foreground">
          Real-time Soroban RPC on-chain event listener
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading && events.length === 0 ? (
          <div className="space-y-3">
            <Skeleton className="h-14 w-full rounded-lg bg-muted/40 animate-pulse" />
            <Skeleton className="h-14 w-full rounded-lg bg-muted/40 animate-pulse" />
            <Skeleton className="h-14 w-full rounded-lg bg-muted/40 animate-pulse" />
            <p className="text-xs text-center text-muted-foreground flex items-center justify-center gap-1.5">
              <Radio className="w-3.5 h-3.5 animate-spin" />
              Connecting to Stellar Testnet RPC...
            </p>
          </div>
        ) : error && events.length === 0 ? (
          <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20 text-center">
            <p className="text-xs text-destructive">RPC Event stream temporarily unavailable.</p>
            <p className="text-[10px] text-muted-foreground mt-1">Polling will retry automatically.</p>
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-6 space-y-2">
            <CheckCircle className="w-8 h-8 text-muted-foreground/40 mx-auto" />
            <p className="text-sm font-medium text-muted-foreground">No recent events yet</p>
            <p className="text-xs text-muted-foreground/70">
              Submit a transaction or donation to trigger live Soroban contract events.
            </p>
          </div>
        ) : (
          <div className="space-y-2.5 max-h-[340px] overflow-y-auto pr-1 custom-scrollbar">
            <AnimatePresence>
              {events.map((evt) => (
                <motion.div
                  key={evt.id}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.25 }}
                  className="flex items-center justify-between p-3 rounded-lg bg-background/60 border border-border/40 hover:border-primary/40 transition-colors shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-md bg-secondary/50 flex items-center justify-center">
                      {getEventIcon(evt.type)}
                    </div>
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold">{evt.actor}</span>
                        <span className={`text-[10px] px-1.5 py-0.2 rounded border font-mono ${getEventBadge(evt.type)}`}>
                          {evt.type}
                        </span>
                      </div>
                      <span className="text-[11px] text-muted-foreground truncate max-w-[180px]">
                        {evt.details}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    {evt.amount && (
                      <span className="font-bold text-xs text-primary">{evt.amount}</span>
                    )}
                    <span className="text-[10px] text-muted-foreground font-mono">{evt.timestamp}</span>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
