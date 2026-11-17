"use client";

import React, { useState } from "react";
import { Mail, Send, CheckCircle2, Loader2, Lock, Sparkles } from "lucide-react";
import { toast } from "sonner";

export default function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      toast.error("Please enter a valid email address.");
      return;
    }

    setIsSubscribing(true);

    setTimeout(() => {
      setIsSubscribing(false);
      setIsSubscribed(true);
      toast.success("Welcome aboard! You have subscribed to Welth Intelligence.");
      setEmail("");
    }, 600);
  };

  return (
    <div className="relative border-b border-slate-800/80">
      <div className="container mx-auto px-4 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center justify-between">
          {/* Headline & Value Proposition */}
          <div className="lg:col-span-7 space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              <span>Welth Intelligence Dispatch</span>
            </div>
            <h3 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
              Stay ahead of your financial growth
            </h3>
            <p className="text-slate-400 text-sm md:text-base max-w-xl leading-relaxed">
              Join over 25,000+ founders, investors, and professionals receiving our weekly 
              breakdown on automated budgeting, wealth analytics, and AI financial tooling.
            </p>
          </div>

          {/* Interactive Form */}
          <div className="lg:col-span-5 w-full">
            <form onSubmit={handleSubscribe} className="space-y-2.5">
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="relative flex-1">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your work email"
                    required
                    disabled={isSubscribing || isSubscribed}
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-slate-900/90 border border-slate-700/80 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:opacity-60"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSubscribing || isSubscribed}
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 active:scale-[0.98] transition-all shadow-md shadow-blue-600/20 disabled:opacity-75 disabled:pointer-events-none whitespace-nowrap cursor-pointer"
                >
                  {isSubscribing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Joining...</span>
                    </>
                  ) : isSubscribed ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                      <span>Subscribed</span>
                    </>
                  ) : (
                    <>
                      <span>Get Updates</span>
                      <Send className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>
              <div className="flex items-center gap-2 text-[12px] text-slate-500">
                <Lock className="w-3.5 h-3.5 text-slate-400" />
                <span>Zero spam. Unsubscribe anytime. Bank-grade data privacy.</span>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
