import React from "react";

export default function StatusIndicator({ uptime = "99.99% Uptime" }) {
  return (
    <div className="inline-flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-xs shadow-sm">
      <span className="relative flex h-2 w-2" aria-hidden="true">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
      </span>
      <span className="text-slate-300 font-medium">All Systems Operational</span>
      <span className="text-slate-500 text-[10px] border-l border-slate-700 pl-2 font-mono">
        {uptime}
      </span>
    </div>
  );
}
