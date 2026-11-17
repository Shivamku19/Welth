import React from "react";
import NewsletterForm from "./newsletter-form";
import BrandColumn from "./brand-column";
import DirectoryNav from "./directory-nav";
import TrustBadges from "./trust-badges";
import RegulatoryDisclaimer from "./regulatory-disclaimer";
import BottomBar from "./bottom-bar";

export default function Footer() {
  return (
    <footer 
      role="contentinfo"
      aria-label="Site Footer"
      className="relative bg-slate-950 text-slate-300 border-t border-slate-800/80 overflow-hidden font-sans"
    >
      {/* Background Ambient Glow */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-96 bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,rgba(59,130,246,0.15),rgba(255,255,255,0))]"
        aria-hidden="true"
      />

      {/* TOP SECTION: Newsletter & Product Updates */}
      <NewsletterForm />

      {/* MIDDLE SECTION: Directory Navigation Grid */}
      <div className="relative container mx-auto px-4 lg:px-8 py-16 md:py-20">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 xl:gap-12">
          <BrandColumn />
          <DirectoryNav />
        </div>
      </div>

      {/* SECURITY & TRUST BADGES */}
      <TrustBadges />

      {/* REGULATORY DISCLAIMER */}
      <RegulatoryDisclaimer />

      {/* SUB-FOOTER BOTTOM BAR */}
      <BottomBar />
    </footer>
  );
}
