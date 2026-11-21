"use client";

import { useState } from "react";
import Link from "next/link";

export default function HomePage() {
  // Track which side is hovered: "left" | "right" | null
  const [hoveredSide, setHoveredSide] = useState(null);

  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-white flex flex-col justify-between pt-20 pb-8 px-6 md:px-10">
      {/* Left Dotted Diamond & "DISCOVER A.I." Trigger */}
      <div
        className={`hidden lg:flex fixed left-0 top-1/2 -translate-y-1/2 items-center transition-all duration-700 ease-out ${
          hoveredSide === "right" ? "opacity-0 pointer-events-none -translate-x-10" : "opacity-100 translate-x-0"
        }`}
      >
        {/* Outer Dotted Diamond */}
        <div className="w-[420px] h-[420px] -ml-[210px] border border-dashed border-gray-300 rotate-45 pointer-events-none" />

        <button
          type="button"
          onMouseEnter={() => setHoveredSide("left")}
          onMouseLeave={() => setHoveredSide(null)}
          className="group flex items-center gap-4 -ml-6 text-[11px] font-medium tracking-wider uppercase text-[#1A1B1C] cursor-pointer"
        >
          <span className="w-8 h-8 border border-[#1A1B1C] rotate-45 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
            <span className="-rotate-45 text-[10px]">◀</span>
          </span>
          <span>DISCOVER A.I.</span>
        </button>
      </div>

      {/* Center Hero Title */}
      <div className="flex-1 flex flex-col items-center justify-center text-center z-10 my-auto">
        {/* Mobile/Tablet Decorative Diamonds */}
        <div className="relative flex items-center justify-center lg:hidden mb-8">
          <div className="w-64 h-64 border border-dashed border-gray-300 rotate-45 absolute" />
          <div className="w-56 h-56 border border-dashed border-gray-200 rotate-45 absolute" />
        </div>

        <h1
          className={`text-5xl sm:text-7xl lg:text-[96px] font-light tracking-tight leading-[0.95] text-[#1A1B1C] transition-transform duration-700 ease-out ${
            hoveredSide === "left"
              ? "lg:translate-x-28"
              : hoveredSide === "right"
              ? "lg:-translate-x-28"
              : "translate-x-0"
          }`}
        >
          Sophisticated
          <span className="block">skincare</span>
        </h1>

        <p className="lg:hidden mt-6 max-w-xs text-xs text-gray-500 leading-relaxed">
          Skinstric developed an A.I. that creates a highly-personalized routine tailored to what your skin needs.
        </p>

        {/* Mobile/Tablet CTA */}
        <Link
          href="/testing"
          className="lg:hidden mt-8 inline-flex items-center gap-3 text-xs font-semibold tracking-wider uppercase text-[#1A1B1C]"
        >
          <span>ENTER EXPERIENCE</span>
          <span className="w-7 h-7 border border-[#1A1B1C] rotate-45 flex items-center justify-center">
            <span className="-rotate-45 text-[9px]">▶</span>
          </span>
        </Link>
      </div>

      {/* Right Dotted Diamond & "TAKE TEST" Trigger */}
      <div
        className={`hidden lg:flex fixed right-0 top-1/2 -translate-y-1/2 z-20 items-center transition-all duration-700 ease-out ${
          hoveredSide === "left" ? "opacity-0 pointer-events-none translate-x-10" : "opacity-100 translate-x-0"
        }`}
      >
        <Link
          href="/testing"
          onMouseEnter={() => setHoveredSide("right")}
          onMouseLeave={() => setHoveredSide(null)}
          className="group flex items-center gap-4 -mr-6 z-10 text-[11px] font-medium tracking-wider uppercase text-[#1A1B1C]"
        >
          <span>TAKE TEST</span>
          <span className="w-8 h-8 border border-[#1A1B1C] rotate-45 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
            <span className="-rotate-45 text-[10px]">▶</span>
          </span>
        </Link>

        {/* Outer Dotted Diamond */}
        <div className="w-[420px] h-[420px] -mr-[210px] border border-dashed border-gray-300 rotate-45 pointer-events-none" />
      </div>

      {/* Bottom Left Description */}
      <div className="hidden lg:block max-w-[280px] text-[11px] leading-relaxed uppercase tracking-wide text-[#1A1B1C] z-10">
        SKINSTRIC DEVELOPED AN A.I. THAT CREATES A HIGHLY-PERSONALIZED ROUTINE TAILORED TO WHAT YOUR SKIN NEEDS.
      </div>
    </main>
  );
}