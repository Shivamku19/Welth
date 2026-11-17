import React from "react";
import { ShieldCheck, Lock, Building2 } from "lucide-react";
import { trustHighlights } from "@/data/footer";

const ICONS = {
  shield: <ShieldCheck className="w-4 h-4" />,
  lock: <Lock className="w-4 h-4" />,
  building: <Building2 className="w-4 h-4" />,
};

export default function TrustBadges() {
  return (
    <div className="relative border-y border-slate-800/80 bg-slate-900/40">
      <div className="container mx-auto px-4 lg:px-8 py-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-slate-400">
          {trustHighlights.map((item) => (
            <div key={item.title} className="flex items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-800/80 border border-slate-700/60 text-blue-400 shadow-sm">
                {ICONS[item.icon]}
              </div>
              <div className="text-xs">
                <div className="font-semibold text-white">{item.title}</div>
                <div className="text-slate-400">{item.description}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
