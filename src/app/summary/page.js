"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function SummaryPage() {
  const router = useRouter();
  const [demographics, setDemographics] = useState(null);
  const [activeCategory, setActiveCategory] = useState("race"); // "race" | "age" | "gender"
  const [selectedOverrides, setSelectedOverrides] = useState({
    race: null,
    age: null,
    gender: null,
  });

  useEffect(() => {
    const stored = localStorage.getItem("skinstricDemographics");
    if (!stored) {
      router.push("/result");
      return;
    }
    try {
      setDemographics(JSON.parse(stored));
    } catch {
      router.push("/result");
    }
  }, [router]);

  if (!demographics) return null;

  const getSortedEntries = (category) => {
    const rawObj = demographics[category] || {};
    return Object.entries(rawObj)
      .map(([label, score]) => ({
        label,
        percentage: Number((score * 100).toFixed(2)),
      }))
      .sort((a, b) => b.percentage - a.percentage);
  };

  const raceList = getSortedEntries("race");
  const ageList = getSortedEntries("age");
  const genderList = getSortedEntries("gender");

  const currentList =
    activeCategory === "race"
      ? raceList
      : activeCategory === "age"
      ? ageList
      : genderList;

  const topRace = selectedOverrides.race || raceList[0];
  const topAge = selectedOverrides.age || ageList[0];
  const topGender = selectedOverrides.gender || genderList[0];

  const activeItem =
    activeCategory === "race"
      ? topRace
      : activeCategory === "age"
      ? topAge
      : topGender;

  // SVG Circle Math
  const radius = 140;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset =
    circumference - ((activeItem?.percentage || 0) / 100) * circumference;

  const handleReset = () => {
    setSelectedOverrides({ race: null, age: null, gender: null });
  };

  return (
    <main className="min-h-screen w-full bg-white flex flex-col justify-between pt-20 pb-8 px-6 md:px-10">
      {/* Animated Page Title */}
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-6"
      >
        <p className="text-[11px] font-semibold tracking-wider uppercase text-[#1A1B1C]">
          A.I. ANALYSIS
        </p>
        <h1 className="text-4xl sm:text-6xl font-normal tracking-tight uppercase text-[#1A1B1C] mt-1">
          DEMOGRAPHICS
        </h1>
        <p className="text-[11px] tracking-wider uppercase text-gray-500 mt-1">
          PREDICTED RACE &amp; AGE
        </p>
      </motion.div>

      {/* Main 3-Column Dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 my-auto">
        {/* Column 1: Staggered Category Selector Boxes */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.55, delay: 0.1 }}
          className="lg:col-span-3 flex flex-col gap-3"
        >
          {/* RACE Box */}
          <button
            type="button"
            onClick={() => setActiveCategory("race")}
            className={`w-full text-left p-4 border-t border-[#1A1B1C] transition-all duration-300 cursor-pointer ${
              activeCategory === "race"
                ? "bg-[#1A1B1C] text-white"
                : "bg-[#F3F3F4] text-[#1A1B1C] hover:bg-gray-200"
            }`}
          >
            <p className="text-sm font-semibold uppercase tracking-wide">
              {topRace?.label}
            </p>
            <p
              className={`text-[11px] uppercase tracking-wider mt-6 ${
                activeCategory === "race" ? "text-gray-300" : "text-gray-500"
              }`}
            >
              RACE
            </p>
          </button>

          {/* AGE Box */}
          <button
            type="button"
            onClick={() => setActiveCategory("age")}
            className={`w-full text-left p-4 border-t border-[#1A1B1C] transition-all duration-300 cursor-pointer ${
              activeCategory === "age"
                ? "bg-[#1A1B1C] text-white"
                : "bg-[#F3F3F4] text-[#1A1B1C] hover:bg-gray-200"
            }`}
          >
            <p className="text-sm font-semibold uppercase tracking-wide">
              {topAge?.label}
            </p>
            <p
              className={`text-[11px] uppercase tracking-wider mt-6 ${
                activeCategory === "age" ? "text-gray-300" : "text-gray-500"
              }`}
            >
              AGE
            </p>
          </button>

          {/* SEX / GENDER Box */}
          <button
            type="button"
            onClick={() => setActiveCategory("gender")}
            className={`w-full text-left p-4 border-t border-[#1A1B1C] transition-all duration-300 cursor-pointer ${
              activeCategory === "gender"
                ? "bg-[#1A1B1C] text-white"
                : "bg-[#F3F3F4] text-[#1A1B1C] hover:bg-gray-200"
            }`}
          >
            <p className="text-sm font-semibold uppercase tracking-wide">
              {topGender?.label}
            </p>
            <p
              className={`text-[11px] uppercase tracking-wider mt-6 ${
                activeCategory === "gender" ? "text-gray-300" : "text-gray-500"
              }`}
            >
              SEX
            </p>
          </button>
        </motion.div>

        {/* Column 2: Animated Circular Progress Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="lg:col-span-6 bg-[#F3F3F4] border-t border-[#1A1B1C] p-6 sm:p-8 flex flex-col justify-between min-h-[380px]"
        >
          <motion.p
            key={activeItem?.label}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="text-2xl sm:text-3xl font-normal capitalize text-[#1A1B1C]"
          >
            {activeItem?.label}
          </motion.p>

          <div className="relative flex items-center justify-center my-6 self-center">
            <svg className="w-72 h-72 sm:w-80 sm:h-80 -rotate-90" viewBox="0 0 320 320">
              {/* Background Track */}
              <circle
                cx="160"
                cy="160"
                r={radius}
                stroke="#D4D4D8"
                strokeWidth="4"
                fill="transparent"
              />
              {/* Animated Progress Ring */}
              <motion.circle
                cx="160"
                cy="160"
                r={radius}
                stroke="#1A1B1C"
                strokeWidth="4"
                fill="transparent"
                strokeDasharray={circumference}
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset }}
                transition={{ duration: 0.85, ease: "easeOut" }}
              />
            </svg>
            <motion.span
              key={activeItem?.percentage}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.35 }}
              className="absolute text-3xl sm:text-4xl font-light text-[#1A1B1C]"
            >
              {activeItem?.percentage}%
            </motion.span>
          </div>
        </motion.div>

        {/* Column 3: Confidence Breakdown Table */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.55, delay: 0.3 }}
          className="lg:col-span-3 bg-[#F3F3F4] border-t border-[#1A1B1C] p-4 flex flex-col"
        >
          <div className="flex items-center justify-between text-[11px] font-semibold uppercase tracking-wider text-[#1A1B1C] pb-3 border-b border-gray-300">
            <span>{activeCategory === "gender" ? "SEX" : activeCategory}</span>
            <span>A.I. CONFIDENCE</span>
          </div>

          <div className="flex flex-col divide-y divide-gray-200 mt-1">
            {currentList.map((item, idx) => {
              const isSelected = activeItem?.label === item.label;
              return (
                <motion.button
                  key={`${activeCategory}-${item.label}`}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25, delay: idx * 0.04 }}
                  type="button"
                  onClick={() =>
                    setSelectedOverrides((prev) => ({
                      ...prev,
                      [activeCategory]: item,
                    }))
                  }
                  className={`flex items-center justify-between py-3 px-2 text-xs transition-colors cursor-pointer ${
                    isSelected
                      ? "bg-[#1A1B1C] text-white font-semibold"
                      : "text-[#1A1B1C] hover:bg-gray-200"
                  }`}
                >
                  <span className="flex items-center gap-2.5 capitalize">
                    <span
                      className={`w-2.5 h-2.5 rotate-45 border transition-colors ${
                        isSelected
                          ? "border-white bg-white"
                          : "border-[#1A1B1C]"
                      }`}
                    />
                    {item.label}
                  </span>
                  <span>{item.percentage}%</span>
                </motion.button>
              );
            })}
          </div>
        </motion.div>
      </div>

      {/* Bottom Controls */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.35 }}
        className="flex flex-col sm:flex-row items-center justify-between gap-4 w-full mt-8"
      >
        <Link
          href="/result"
          className="group flex items-center gap-4 text-[11px] font-semibold tracking-wider uppercase text-[#1A1B1C] self-start sm:self-auto"
        >
          <span className="w-8 h-8 border border-[#1A1B1C] rotate-45 flex items-center justify-center group-hover:scale-110 group-hover:bg-[#1A1B1C] group-hover:text-white transition-all duration-300">
            <span className="-rotate-45 text-[10px]">◀</span>
          </span>
          <span>BACK</span>
        </Link>

        <p className="text-[11px] text-gray-500 text-center">
          If A.I. estimate is wrong, select the correct one.
        </p>

        <div className="flex items-center gap-3 self-end sm:self-auto">
          <button
            type="button"
            onClick={handleReset}
            className="border border-[#1A1B1C] text-[#1A1B1C] text-[10px] font-semibold tracking-wider uppercase px-4 py-2.5 hover:bg-gray-100 transition-colors cursor-pointer"
          >
            RESET
          </button>
          <button
            type="button"
            onClick={() => alert("Demographics confirmed!")}
            className="bg-[#1A1B1C] text-white text-[10px] font-semibold tracking-wider uppercase px-4 py-2.5 hover:bg-neutral-800 transition-colors cursor-pointer"
          >
            CONFIRM
          </button>
        </div>
      </motion.div>
    </main>
  );
}