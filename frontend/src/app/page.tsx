"use client";

import React from "react";
import { ConnectWallet } from "@/components/ConnectWallet";
import { DonateForm } from "@/components/DonateForm";
import { ActivityFeed } from "@/components/ActivityFeed";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <main className="min-h-screen relative flex flex-col items-center p-6 sm:p-24 overflow-hidden bg-background">
      {/* Background gradients */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[150px] translate-x-1/3 translate-y-1/3" />
      
      <div className="z-10 w-full max-w-5xl flex flex-col items-center space-y-12">
        <header className="w-full flex justify-between items-center mb-8">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center font-bold text-primary-foreground">
              S
            </div>
            <h1 className="text-xl font-bold tracking-tight">StellarFund</h1>
          </div>
          <ConnectWallet />
        </header>

        <div className="text-center space-y-6 max-w-3xl mx-auto">
          <motion.h1 
            className="text-5xl sm:text-7xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Fund the Future on Stellar
          </motion.h1>
          <motion.p 
            className="text-lg sm:text-xl text-muted-foreground leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            A decentralized, secure, and lightning-fast community donation platform powered by Soroban Smart Contracts.
          </motion.p>
        </div>

        <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-6 items-start mt-12">
          {/* Donation Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="w-full bg-card/40 backdrop-blur-md border-border/50 text-card-foreground shadow-xl transition-all duration-300 hover:shadow-2xl hover:bg-card/60">
              <CardHeader>
                <CardTitle>Community Dev Fund</CardTitle>
                <CardDescription className="text-muted-foreground">
                  Support the development of open-source tools for the Stellar ecosystem. Your contribution directly funds independent developers.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm font-medium">
                    <span>Raised</span>
                    <span>1,250 / 5,000 XLM</span>
                  </div>
                  <Progress value={25} className="h-2 bg-secondary" />
                </div>
                
                <DonateForm />
              </CardContent>
              <CardFooter className="flex justify-center border-t border-border/50 pt-4">
                <p className="text-xs text-muted-foreground">
                  Secured by Stellar Smart Contracts
                </p>
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
