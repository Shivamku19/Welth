import React from "react";

export default function RegulatoryDisclaimer() {
  return (
    <div className="relative border-b border-slate-800/60 bg-slate-950">
      <div className="container mx-auto px-4 lg:px-8 py-8">
        <div className="text-[11px] leading-relaxed text-slate-400 space-y-2 max-w-5xl">
          <p>
            <strong className="text-slate-300">Regulatory Disclosure:</strong> Welth Technologies, Inc. 
            is a financial technology software provider, not an FDIC-insured bank. Banking and payment processing 
            services are facilitated through licensed banking partners and PCI-DSS Level 1 compliant networks. 
            Depository balances are eligible for FDIC pass-through deposit insurance up to allowable federal limits 
            through partner banking institutions.
          </p>
          <p>
            Investment analytics, AI-assisted summaries, and automated budgeting projections are intended strictly for 
            informational and planning purposes. They do not constitute personalized financial, tax, or investment 
            advice. Past financial performance is not indicative of future market returns. Always consult with a qualified 
            fiduciary advisor before making substantial financial investments.
          </p>
        </div>
      </div>
    </div>
  );
}
