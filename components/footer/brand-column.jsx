import React from "react";
import Link from "next/link";
import Image from "next/image";
import StatusIndicator from "./status-indicator";
import SocialLinks from "./social-links";

export default function BrandColumn() {
  return (
    <div className="col-span-2 space-y-5">
      <Link href="/" className="inline-flex items-center gap-2.5 group">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 shadow-lg shadow-blue-600/30 group-hover:scale-105 transition-transform">
          <Image
            src="/icon.png"
            alt="Welth Logo"
            width={28}
            height={28}
            className="h-6 w-6 object-contain"
          />
        </div>
        <span className="text-2xl font-bold tracking-tight text-white group-hover:text-blue-400 transition-colors">
          Welth<span className="text-blue-500">.</span>
        </span>
      </Link>

      <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
        The AI-powered financial intelligence platform engineered for proactive wealth building, 
        automated expense management, and institutional-grade cashflow clarity.
      </p>

      {/* Live Operational Status */}
      <div>
        <StatusIndicator uptime="99.99% Uptime" />
      </div>

      {/* Social Profiles */}
      <div className="pt-2">
        <SocialLinks />
      </div>
    </div>
  );
}
