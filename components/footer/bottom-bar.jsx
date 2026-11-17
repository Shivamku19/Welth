"use client";

import React from "react";
import Link from "next/link";
import { Globe, ArrowUp } from "lucide-react";
import { footerLegalLinks } from "@/data/footer";

export default function BottomBar() {
  const currentYear = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div className="relative bg-black/40">
      <div className="container mx-auto px-4 lg:px-8 py-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          {/* Copyright */}
          <div className="flex items-center gap-2">
            <span>&copy; {currentYear} Welth Technologies, Inc. All rights reserved.</span>
          </div>

          {/* Legal navigation */}
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs">
            {footerLegalLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="hover:text-slate-300 transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Language Selector & Back to Top */}
          <div className="flex items-center gap-4">
            <button
              type="button"
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md hover:bg-slate-900 border border-transparent hover:border-slate-800 transition-all text-slate-400 hover:text-slate-200 cursor-pointer"
              aria-label="Select Region and Language"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>English (US)</span>
              <span className="text-slate-500">/ USD ($)</span>
            </button>

            <button
              type="button"
              onClick={scrollToTop}
              aria-label="Scroll back to top"
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-300 hover:text-white transition-all cursor-pointer"
            >
              <span>Top</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
