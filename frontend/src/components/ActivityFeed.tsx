"use client";

import React from "react";
import { useContractEvents } from "@/hooks/useContractEvents";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { motion, AnimatePresence } from "framer-motion";

export function ActivityFeed() {
  const contractId = process.env.NEXT_PUBLIC_FUND_CONTRACT_ID;
  const { events } = useContractEvents(contractId || "");

  return (
    <Card className="w-full max-w-md bg-card/40 backdrop-blur-md border-border/50 text-card-foreground">
      <CardHeader>
        <CardTitle className="text-xl">Live Activity</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!contractId ? (
          <p className="text-muted-foreground text-sm">Contract ID not configured.</p>
        ) : events.length === 0 ? (
          <div className="space-y-3">
            <Skeleton className="h-12 w-full opacity-20" />
            <Skeleton className="h-12 w-full opacity-20" />
            <p className="text-sm text-center text-muted-foreground mt-2">Listening for on-chain events...</p>
          </div>
        ) : (
          <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
            <AnimatePresence>
              {events.map((evt) => (
                <motion.div
                  key={evt.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center justify-between p-3 rounded-lg bg-background/50 border border-border/30 shadow-sm"
                >
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">{evt.donor}</span>
                    <span className="text-xs text-muted-foreground">{evt.timestamp}</span>
                  </div>
                  <span className="font-bold text-primary">+{evt.amount}</span>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
