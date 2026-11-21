"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  // Show [ ANALYSIS ] on testing/results pages, [ INTRO ] on home
  const sectionLabel = pathname === "/" ? "INTRO" : "ANALYSIS";

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 md:px-10">
      <div className="flex items-center gap-3 text-[11px] font-semibold tracking-wider uppercase text-[#1A1B1C]">
        <Link href="/" className="hover:opacity-70 transition-opacity">
          SKINSTRIC
        </Link>
        <span className="text-gray-400 font-normal">[ {sectionLabel} ]</span>
      </div>

      <button
        type="button"
        className="bg-[#1A1B1C] text-white text-[10px] font-semibold tracking-wider uppercase px-4 py-2.5 hover:bg-neutral-800 transition-colors cursor-pointer"
      >
        ENTER CODE
      </button>
    </header>
  );
}