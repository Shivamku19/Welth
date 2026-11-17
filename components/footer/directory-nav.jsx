import React from "react";
import Link from "next/link";
import { footerNavigation } from "@/data/footer";

export default function DirectoryNav() {
  const sections = Object.values(footerNavigation);

  return (
    <>
      {sections.map((section) => (
        <div key={section.title} className="space-y-4">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-white">
            {section.title}
          </h4>
          <ul className="space-y-2.5 text-sm">
            {section.links.map((link) => (
              <li key={link.name}>
                <Link
                  href={link.href}
                  className="hover:text-white transition-colors inline-flex items-center gap-1.5 group"
                >
                  <span className="group-hover:translate-x-0.5 transition-transform duration-150">
                    {link.name}
                  </span>
                  {link.badge && (
                    <span
                      className={`text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded border ${
                        link.badge === "AI"
                          ? "bg-blue-500/20 text-blue-400 border-blue-500/30"
                          : link.badge === "OCR"
                          ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                          : "bg-purple-500/20 text-purple-300 border-purple-500/30"
                      }`}
                    >
                      {link.badge}
                    </span>
                  )}
                  {link.isStatus && (
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" aria-hidden="true" />
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </>
  );
}
