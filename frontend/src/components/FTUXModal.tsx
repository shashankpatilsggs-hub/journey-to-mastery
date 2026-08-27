"use client";

import React, { useState, useEffect } from "react";
import { useWallet } from "@/contexts/WalletContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Sparkles, UserCheck, ShieldCheck, Code, Building, Palette } from "lucide-react";

export interface UserProfile {
  address: string;
  role: "Developer" | "Enterprise" | "DAO Member" | "Creator";
  companyName: string;
  avatarColor: string;
  tier: "Starter" | "Pro" | "Enterprise";
  tagline: string;
  onboardedAt: string;
}

const AVATAR_COLORS = [
  { name: "Cyan", hex: "#06b6d4" },
  { name: "Emerald", hex: "#10b981" },
  { name: "Purple", hex: "#a855f7" },
  { name: "Rose", hex: "#f43f5e" },
  { name: "Amber", hex: "#f59e0b" },
];

export function FTUXModal() {
  const { address } = useWallet();
  const [isOpen, setIsOpen] = useState(false);
  const [role, setRole] = useState<UserProfile["role"]>("Developer");
  const [companyName, setCompanyName] = useState("");
  const [avatarColor, setAvatarColor] = useState(AVATAR_COLORS[0].hex);
  const [tier, setTier] = useState<UserProfile["tier"]>("Pro");
  const [tagline, setTagline] = useState("");

  useEffect(() => {
    if (!address) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- sync reset on wallet disconnect
      setIsOpen(false);
      return;
    }

    const savedProfile = localStorage.getItem(`stellar_user_profile_${address}`);
    if (!savedProfile) {
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  }, [address]);

  const handleCompleteOnboarding = (e: React.FormEvent) => {
    e.preventDefault();
    if (!address) return;

    const profile: UserProfile = {
      address,
      role,
      companyName: companyName.trim() || (role === "Developer" ? "Independent Builder" : "Stellar Ecosystem Org"),
      avatarColor,
      tier,
      tagline: tagline.trim() || "Building the decentralized future on Soroban",
      onboardedAt: new Date().toISOString(),
    };

    localStorage.setItem(`stellar_user_profile_${address}`, JSON.stringify(profile));
    toast.success(`Welcome to StellarFund, ${profile.companyName}! Profile setup complete.`, {
      icon: <Sparkles className="w-4 h-4 text-amber-400" />,
    });
    setIsOpen(false);
  };

  if (!isOpen || !address) return null;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-md bg-card/95 backdrop-blur-xl border border-primary/20 shadow-2xl p-6 rounded-2xl">
        <DialogHeader className="space-y-2">
          <div className="flex items-center gap-2">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold shadow-md transition-colors"
              style={{ backgroundColor: avatarColor }}
            >
              {role === "Developer" ? <Code className="w-4 h-4" /> : <Building className="w-4 h-4" />}
            </div>
            <DialogTitle className="text-xl font-bold">Welcome! Complete Your Profile</DialogTitle>
          </div>
          <DialogDescription className="text-xs text-muted-foreground">
            Configure your unique Web3 identity to personalize your StellarFund experience.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleCompleteOnboarding} className="space-y-4 mt-2">
          {/* Role Selection */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">Select Your Role</Label>
            <div className="grid grid-cols-2 gap-2">
              {(["Developer", "Enterprise", "DAO Member", "Creator"] as const).map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRole(r)}
                  className={`flex items-center gap-2 p-2 rounded-lg border text-xs font-medium transition-all ${
                    role === r
                      ? "bg-primary/20 border-primary text-primary"
                      : "bg-background/50 border-border/60 text-muted-foreground hover:bg-background"
                  }`}
                >
                  {r === "Developer" && <Code className="w-3.5 h-3.5" />}
                  {r === "Enterprise" && <Building className="w-3.5 h-3.5" />}
                  {r === "DAO Member" && <ShieldCheck className="w-3.5 h-3.5" />}
                  {r === "Creator" && <Sparkles className="w-3.5 h-3.5" />}
                  {r}
                </button>
              ))}
            </div>
          </div>

          {/* Company / Organization Name */}
          <div className="space-y-1.5">
            <Label htmlFor="companyName" className="text-xs font-semibold">
              Organization or Name
            </Label>
            <Input
              id="companyName"
              placeholder={role === "Developer" ? "e.g. Satoshi Labs" : "e.g. Acme Ventures"}
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className="text-xs bg-background/50"
            />
          </div>

          {/* Tier Selection */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">Subscription Interest</Label>
            <div className="grid grid-cols-3 gap-2">
              {(["Starter", "Pro", "Enterprise"] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTier(t)}
                  className={`p-2 rounded-lg border text-center text-xs font-medium transition-all ${
                    tier === t
                      ? "bg-primary/20 border-primary text-primary"
                      : "bg-background/50 border-border/60 text-muted-foreground hover:bg-background"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Custom Avatar Accent Color */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold flex items-center gap-1.5">
              <Palette className="w-3.5 h-3.5" /> Avatar Color Theme
            </Label>
            <div className="flex items-center gap-3">
              {AVATAR_COLORS.map((c) => (
                <button
                  key={c.hex}
                  type="button"
                  onClick={() => setAvatarColor(c.hex)}
                  className={`w-7 h-7 rounded-full transition-transform ${
                    avatarColor === c.hex ? "scale-125 ring-2 ring-white shadow-lg" : "opacity-70 hover:opacity-100"
                  }`}
                  style={{ backgroundColor: c.hex }}
                  title={c.name}
                />
              ))}
            </div>
          </div>

          {/* Tagline / Bio */}
          <div className="space-y-1.5">
            <Label htmlFor="tagline" className="text-xs font-semibold">
              Tagline (Optional)
            </Label>
            <Input
              id="tagline"
              placeholder="e.g. Building next-gen DeFi on Stellar"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              className="text-xs bg-background/50"
            />
          </div>

          <div className="pt-2">
            <Button type="submit" className="w-full text-xs font-semibold h-10 shadow-lg">
              <UserCheck className="w-4 h-4 mr-1.5" /> Complete Setup & Enter
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
