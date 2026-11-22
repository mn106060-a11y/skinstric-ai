"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";

export default function TestingPage() {
  const router = useRouter();
  const [step, setStep] = useState("name"); // "name" | "location" | "loading" | "success"
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [error, setError] = useState("");

  const handleNameSubmit = (e) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) {
      setError("Please enter your name.");
      return;
    }
    if (!/^[a-zA-Z\s'-]+$/.test(trimmed)) {
      setError("Please enter a valid name using letters only.");
      return;
    }
    setError("");
    setStep("location");
  };

  const handleLocationSubmit = async (e) => {
    e.preventDefault();
    const trimmed = location.trim();
    if (!trimmed) {
      setError("Please enter your city or location.");
      return;
    }
    if (!/^[a-zA-Z\s,.-]+$/.test(trimmed)) {
      setError("Please enter a valid location without numbers.");
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
            location: trimmed,
          }),
        }
      );

      if (response.ok) {
        localStorage.setItem(
          "skinstricUser",
          JSON.stringify({ name: name.trim(), location: trimmed })
        );
        setStep("success");
      } else {
        setError("Something went wrong submitting your info. Please try again.");
        setStep("location");
      }
    } catch (err) {
      setError("Network error. Please check your connection and try again.");
      setStep("location");
    }
  };

  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-white flex flex-col justify-between pt-20 pb-8 px-6 md:px-10">
      {/* Top Left Label */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-[11px] font-semibold tracking-wider uppercase text-[#1A1B1C] z-10"
      >
        TO START ANALYSIS
      </motion.div>

      {/* Center Rotating Diamonds & Active Step */}
      <div className="relative flex-1 flex flex-col items-center justify-center my-auto">
        {/* Continuous Rotating Concentric Dotted Diamonds */}
        <motion.div
          animate={{ rotate: 395 }}
          transition={{ repeat: Infinity, duration: 45, ease: "linear" }}
          className="absolute w-[310px] h-[310px] sm:w-[440px] sm:h-[440px] md:w-[500px] md:h-[500px] border border-dashed border-gray-200 pointer-events-none"
        />
        <motion.div
          animate={{ rotate: -320 }}
          transition={{ repeat: Infinity, duration: 55, ease: "linear" }}
          className="absolute w-[310px] h-[310px] sm:w-[440px] sm:h-[440px] md:w-[500px] md:h-[500px] border border-dashed border-gray-200 pointer-events-none"
        />
        <motion.div
          animate={{ rotate: 405 }}
          transition={{ repeat: Infinity, duration: 65, ease: "linear" }}
          className="absolute w-[310px] h-[310px] sm:w-[440px] sm:h-[440px] md:w-[500px] md:h-[500px] border border-dashed border-gray-300 pointer-events-none"
        />

        {/* Animated Form Steps */}
        <div className="relative z-10 flex flex-col items-center text-center w-full max-w-md px-4">
          <AnimatePresence mode="wait">
            {step === "name" && (
              <motion.form
                key="name-step"
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -18 }}
                transition={{ duration: 0.4 }}
                onSubmit={handleNameSubmit}
                className="w-full flex flex-col items-center"
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
                  className="w-full text-center text-3xl sm:text-5xl font-light text-[#1A1B1C] placeholder:text-gray-400 bg-transparent border-b border-[#1A1B1C] pb-2 focus:outline-none"
                />
                {error && <p className="mt-3 text-xs text-red-500">{error}</p>}
              </motion.form>
            )}

            {step === "location" && (
              <motion.form
                key="location-step"
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -18 }}
                transition={{ duration: 0.4 }}
                onSubmit={handleLocationSubmit}
                className="w-full flex flex-col items-center"
              >
                <span className="text-[10px] tracking-widest uppercase text-gray-400 mb-2">
                  CLICK TO TYPE
                </span>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Your city name"
                  autoFocus
                  className="w-full text-center text-3xl sm:text-5xl font-light text-[#1A1B1C] placeholder:text-gray-400 bg-transparent border-b border-[#1A1B1C] pb-2 focus:outline-none"
                />
                {error && <p className="mt-3 text-xs text-red-500">{error}</p>}
              </motion.form>
            )}

            {step === "loading" && (
              <motion.div
                key="loading-step"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.35 }}
                className="flex flex-col items-center gap-3"
              >
                <p className="text-sm tracking-widest uppercase text-gray-500 animate-pulse">
                  Processing submission...
                </p>
              </motion.div>
            )}

            {step === "success" && (
              <motion.div
                key="success-step"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.45 }}
                className="flex flex-col items-center gap-2"
              >
                <p className="text-xl sm:text-2xl font-normal text-[#1A1B1C]">
                  Thank you!
                </p>
                <p className="text-xs sm:text-sm text-gray-500">
                  Proceed for the next step
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Bottom Controls: BACK (left) & PROCEED (right when ready) */}
      <div className="flex items-center justify-between w-full z-10">
        <Link
          href="/"
          className="group flex items-center gap-4 text-[11px] font-semibold tracking-wider uppercase text-[#1A1B1C]"
        >
          <span className="w-8 h-8 border border-[#1A1B1C] rotate-45 flex items-center justify-center group-hover:scale-110 group-hover:bg-[#1A1B1C] group-hover:text-white transition-all duration-300">
            <span className="-rotate-45 text-[10px]">◀</span>
          </span>
          <span>BACK</span>
        </Link>

        {step === "success" && (
          <motion.button
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.45 }}
            type="button"
            onClick={() => router.push("/result")}
            className="group flex items-center gap-4 text-[11px] font-semibold tracking-wider uppercase text-[#1A1B1C] cursor-pointer"
          >
            <span>PROCEED</span>
            <span className="w-8 h-8 border border-[#1A1B1C] rotate-45 flex items-center justify-center group-hover:scale-110 group-hover:bg-[#1A1B1C] group-hover:text-white transition-all duration-300">
              <span className="-rotate-45 text-[10px]">▶</span>
            </span>
          </motion.button>
        )}
      </div>
    </main>
  );
}