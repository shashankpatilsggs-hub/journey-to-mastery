"use client";

import React, { useEffect, useState } from "react";
import { ConnectWallet } from "@/components/ConnectWallet";
import { DonateForm } from "@/components/DonateForm";
import { ActivityFeed } from "@/components/ActivityFeed";
import { FTUXModal, UserProfile } from "@/components/FTUXModal";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";
import { useWallet } from "@/contexts/WalletContext";
import { ShieldCheck, Zap, Layers, RefreshCw, Sparkles, CheckCircle2 } from "lucide-react";

export default function Home() {
  const { address } = useWallet();
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    if (!address) {
      setProfile(null);
      return;
    }
    const checkProfile = () => {
      const saved = localStorage.getItem(`stellar_user_profile_${address}`);
      if (saved) {
        try {
          setProfile(JSON.parse(saved));
        } catch {
          setProfile(null);
        }
      }
    };
    checkProfile();
    const interval = setInterval(checkProfile, 1000);
    return () => clearInterval(interval);
  }, [address]);

  return (
    <main className="min-h-screen relative flex flex-col items-center p-4 sm:p-8 md:p-16 lg:p-24 overflow-hidden bg-background">
      {/* Background gradients */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[150px] translate-x-1/3 translate-y-1/3 pointer-events-none" />
      
      {/* First Time User Onboarding Modal */}
      <FTUXModal />

      <div className="z-10 w-full max-w-5xl flex flex-col items-center space-y-8 sm:space-y-12">
        {/* Header */}
        <header className="w-full flex flex-wrap justify-between items-center gap-4 mb-4 pb-4 border-b border-border/40">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-primary to-blue-500 flex items-center justify-center font-bold text-primary-foreground shadow-lg">
              S
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">StellarFund</h1>
              <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                Soroban Testnet v22
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {profile && (
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-card/60 border border-border/50 text-xs shadow-sm">
                <div
                  className="w-5 h-5 rounded-full flex items-center justify-center text-white text-[10px] font-bold"
                  style={{ backgroundColor: profile.avatarColor }}
                >
                  {profile.role.charAt(0)}
                </div>
                <div className="flex flex-col">
                  <span className="font-semibold text-[11px] leading-tight">{profile.companyName}</span>
                  <span className="text-[9px] text-muted-foreground">{profile.role} • {profile.tier}</span>
                </div>
              </div>
            )}
            <ConnectWallet />
          </div>
        </header>

        {/* Hero Section */}
        <div className="text-center space-y-4 max-w-3xl mx-auto px-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            Decentralized Soroban Crowdfunding & Treasury
          </div>
          <motion.h1 
            className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-primary via-blue-400 to-indigo-300"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Fund the Future on Stellar
          </motion.h1>
          <motion.p 
            className="text-sm sm:text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            A decentralized, secure, and lightning-fast community donation & subscription engine powered by multi-contract Soroban architecture.
          </motion.p>
        </div>

        {/* System Architecture Highlights */}
        <div className="w-full grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-card/40 border border-border/40 backdrop-blur-sm flex flex-col gap-1">
            <div className="flex items-center gap-1.5 text-primary font-semibold">
              <Layers className="w-3.5 h-3.5" />
              <span>Inter-Contract</span>
            </div>
            <span className="text-[11px] text-muted-foreground">Cross-contract call to Treasury & NFT Badge</span>
          </div>

          <div className="p-3 rounded-xl bg-card/40 border border-border/40 backdrop-blur-sm flex flex-col gap-1">
            <div className="flex items-center gap-1.5 text-cyan-400 font-semibold">
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Event Streaming</span>
            </div>
            <span className="text-[11px] text-muted-foreground">Live RPC getEvents polling without refresh</span>
          </div>

          <div className="p-3 rounded-xl bg-card/40 border border-border/40 backdrop-blur-sm flex flex-col gap-1">
            <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Verified On-Chain</span>
            </div>
            <span className="text-[11px] text-muted-foreground">Deterministic execution & state safety</span>
          </div>

          <div className="p-3 rounded-xl bg-card/40 border border-border/40 backdrop-blur-sm flex flex-col gap-1">
            <div className="flex items-center gap-1.5 text-amber-400 font-semibold">
              <Zap className="w-3.5 h-3.5" />
              <span>Instant Finality</span>
            </div>
            <span className="text-[11px] text-muted-foreground">Sub-5s testnet ledger confirmation</span>
          </div>
        </div>

        {/* Main Grid: Donation + Activity Feed */}
        <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          {/* Donation Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="w-full"
          >
            <Card className="w-full bg-card/40 backdrop-blur-md border-border/50 text-card-foreground shadow-xl transition-all duration-300 hover:shadow-2xl hover:bg-card/60">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl font-bold">Community Dev Fund</CardTitle>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 font-medium">
                    Goal: 5,000 XLM
                  </span>
                </div>
                <CardDescription className="text-xs text-muted-foreground">
                  Support open-source builders creating tools on Soroban. Inter-contract logic automatically triggers supporter badges and treasury routing.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-muted-foreground">Funding Progress</span>
                    <span className="text-primary">1,250 / 5,000 XLM (25%)</span>
                  </div>
                  <Progress value={25} className="h-2 bg-secondary" />
                </div>
                
                <DonateForm />
              </CardContent>
              <CardFooter className="flex flex-col items-center gap-2 border-t border-border/50 pt-4 text-center">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  Secured by Soroban Multi-Contract Architecture
                </div>
              </CardFooter>
            </Card>
          </motion.div>

          {/* Live Activity Feed */}
          <motion.div 
            className="w-full"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <ActivityFeed />
          </motion.div>
        </div>
      </div>
    </main>
  );
}
