"use client";

import React from "react";
import { ConnectWallet } from "@/components/ConnectWallet";
import { DonateForm } from "@/components/DonateForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <main className="min-h-screen relative overflow-hidden bg-background">
      {/* Background Decorative Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/20 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-500/20 blur-[120px] pointer-events-none" />

      {/* Navigation */}
      <nav className="relative z-10 flex items-center justify-between p-6 border-b border-border/40 bg-background/60 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary to-blue-500 flex items-center justify-center">
            <span className="font-bold text-white text-lg">S</span>
          </div>
          <h1 className="text-xl font-bold tracking-tight">StellarFund</h1>
        </div>
        <ConnectWallet />
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 px-6 py-24 flex flex-col items-center text-center max-w-4xl mx-auto space-y-8">
        <motion.h2 
          className="text-5xl font-extrabold tracking-tight sm:text-7xl bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-400"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Fund the Future on Stellar
        </motion.h2>
        <motion.p 
          className="text-xl text-muted-foreground max-w-2xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          A decentralized, secure, and lightning-fast community donation platform powered by Soroban Smart Contracts.
        </motion.p>
      </section>

      {/* Campaign Section */}
      <section className="relative z-10 px-6 pb-24 max-w-lg mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="border-border/50 bg-background/40 backdrop-blur-xl shadow-2xl">
            <CardHeader>
              <CardTitle>Community Dev Fund</CardTitle>
              <CardDescription>
                Support the development of open-source tools for the Stellar ecosystem. 
                Your contribution directly funds independent developers.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Raised</span>
                  <span className="font-medium">1,250 / 5,000 XLM</span>
                </div>
                <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-primary w-1/4 rounded-full" />
                </div>
              </div>
              <DonateForm />
            </CardContent>
          </Card>
        </motion.div>
      </section>
    </main>
  );
}
