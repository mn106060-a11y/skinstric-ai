"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function TestingPage() {
  const router = useRouter();
  const [step, setStep] = useState("name"); // "name" | "location" | "loading" | "success"
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [error, setError] = useState("");

  const handleNameSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Please enter your name.");
      return;
    }
    setError("");
    setStep("location");
  };

  const handleLocationSubmit = async (e) => {
    e.preventDefault();
    if (!location.trim()) {
      setError("Please enter your location.");
      return;
    }

    setError("");
    setStep("loading");

    try {
      const response = await fetch(
        "https://us-central1-api-skinstric-ai.cloudfunctions.net/skinstricPhaseOne",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: name.trim(),
            location: location.trim(),
          }),
        }
      );

      const data = await response.json();

      if (response.ok || data.SUCCUSS) {
        localStorage.setItem(
          "skinstricUser",
          JSON.stringify({ name: name.trim(), location: location.trim() })
        );
        setStep("success");
      } else {
        setError("Something went wrong. Please try again.");
        setStep("location");
      }
    } catch (err) {
      setError("Network error. Please check your connection.");
      setStep("location");
    }
  };

  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-white flex flex-col justify-between pt-20 pb-8 px-6 md:px-10">
      {/* Top Left Subtitle */}
      <div className="text-[11px] font-semibold tracking-wider uppercase text-[#1A1B1C] z-10">
        TO START ANALYSIS
      </div>

      {/* Center Rotating Dotted Diamonds & Form */}
      <div className="relative flex-1 flex flex-col items-center justify-center my-auto">
        {/* Background Layered Diamonds */}
        <div className="absolute w-[300px] h-[300px] sm:w-[420px] sm:h-[420px] border border-dashed border-gray-200 rotate-[35deg] pointer-events-none" />
        <div className="absolute w-[300px] h-[300px] sm:w-[420px] sm:h-[420px] border border-dashed border-gray-300 rotate-[45deg] pointer-events-none" />
        <div className="absolute w-[300px] h-[300px] sm:w-[420px] sm:h-[420px] border border-dashed border-gray-200 rotate-[55deg] pointer-events-none" />

        {/* Step 1: Name Input */}
        {step === "name" && (
          <form
            onSubmit={handleNameSubmit}
            className="z-10 flex flex-col items-center text-center w-full max-w-md px-4"
          >
            <span className="text-[10px] tracking-widest uppercase text-gray-400 mb-2">
              CLICK TO TYPE
            </span>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Introduce Yourself"
              autoFocus
              className="w-full text-center text-3xl sm:text-5xl font-light text-[#1A1B1C] placeholder:text-gray-400 border-b border-[#1A1B1C] pb-2 bg-transparent focus:outline-none"
            />
            {error && <p className="text-xs text-red-500 mt-3">{error}</p>}
          </form>
        )}

        {/* Step 2: Location Input */}
        {step === "location" && (
          <form
            onSubmit={handleLocationSubmit}
            className="z-10 flex flex-col items-center text-center w-full max-w-md px-4"
          >
            <span className="text-[10px] tracking-widest uppercase text-gray-400 mb-2">
              CLICK TO TYPE
            </span>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Where are you from?"
              autoFocus
              className="w-full text-center text-3xl sm:text-5xl font-light text-[#1A1B1C] placeholder:text-gray-400 border-b border-[#1A1B1C] pb-2 bg-transparent focus:outline-none"
            />
            {error && <p className="text-xs text-red-500 mt-3">{error}</p>}
          </form>
        )}

        {/* Step 3: Loading State */}
        {step === "loading" && (
          <div className="z-10 flex flex-col items-center text-center">
            <p className="text-sm tracking-widest uppercase text-gray-500 animate-pulse">
              Processing submission...
            </p>
          </div>
        )}

        {/* Step 4: Success Confirmation */}
        {step === "success" && (
          <div className="z-10 flex flex-col items-center text-center">
            <p className="text-2xl sm:text-3xl font-light text-[#1A1B1C] mb-2">
              Thank you!
            </p>
            <p className="text-xs uppercase tracking-wider text-gray-500">
              Proceed for the next step
            </p>
          </div>
        )}
      </div>

      {/* Bottom Navigation Bar (BACK on left, PROCEED on right when ready) */}
      <div className="flex items-center justify-between w-full z-10">
        {step === "location" ? (
          <button
            type="button"
            onClick={() => setStep("name")}
            className="group flex items-center gap-4 text-[11px] font-semibold tracking-wider uppercase text-[#1A1B1C] cursor-pointer"
          >
            <span className="w-8 h-8 border border-[#1A1B1C] rotate-45 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <span className="-rotate-45 text-[10px]">◀</span>
            </span>
            <span>BACK</span>
          </button>
        ) : (
          <Link
            href="/"
            className="group flex items-center gap-4 text-[11px] font-semibold tracking-wider uppercase text-[#1A1B1C]"
          >
            <span className="w-8 h-8 border border-[#1A1B1C] rotate-45 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <span className="-rotate-45 text-[10px]">◀</span>
            </span>
            <span>BACK</span>
          </Link>
        )}

        {step === "success" && (
          <button
            type="button"
            onClick={() => router.push("/result")}
            className="group flex items-center gap-4 text-[11px] font-semibold tracking-wider uppercase text-[#1A1B1C] cursor-pointer"
          >
            <span>PROCEED</span>
            <span className="w-8 h-8 border border-[#1A1B1C] rotate-45 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <span className="-rotate-45 text-[10px]">▶</span>
            </span>
          </button>
        )}
      </div>
    </main>
  );
}