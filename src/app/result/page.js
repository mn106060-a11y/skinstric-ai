"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ResultPage() {
  const router = useRouter();
  const fileInputRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [previewUrl, setPreviewUrl] = useState(null);

  const handleGalleryClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError("");
    const reader = new FileReader();

    reader.onloadend = async () => {
      const fullDataUrl = reader.result;
      setPreviewUrl(fullDataUrl);

      // Strip the "data:image/...;base64," prefix so the API receives a clean base64 string
      const base64String = fullDataUrl.split(",")[1];
      await analyzeImage(base64String);
    };

    reader.readAsDataURL(file);
  };

  const analyzeImage = async (base64Image) => {
    setLoading(true);
    try {
      const response = await fetch(
        "https://us-central1-api-skinstric-ai.cloudfunctions.net/skinstricPhaseTwo",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            image: base64Image,
          }),
        }
      );

      const result = await response.json();

      if (response.ok && result.data) {
        localStorage.setItem("skinstricDemographics", JSON.stringify(result.data));
        router.push("/summary");
      } else {
        setError("Failed to analyze image. Please try another photo.");
        setLoading(false);
      }
    } catch (err) {
      setError("Network error while uploading image. Please try again.");
      setLoading(false);
    }
  };

  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-white flex flex-col justify-between pt-20 pb-8 px-6 md:px-10">
      {/* Top Left Header & Top Right Preview Box */}
      <div className="flex items-start justify-between z-10">
        <div className="text-[11px] font-semibold tracking-wider uppercase text-[#1A1B1C]">
          TO START ANALYSIS
        </div>

        <div className="flex flex-col items-end">
          <span className="text-[10px] tracking-wider uppercase text-gray-500 mb-1.5">
            Preview
          </span>
          <div className="w-24 h-24 border border-gray-300 bg-gray-50 flex items-center justify-center overflow-hidden">
            {previewUrl ? (
              <img
                src={previewUrl}
                alt="Selected preview"
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-[9px] uppercase text-gray-400">No Image</span>
            )}
          </div>
        </div>
      </div>

      {/* Center Section: Loading State OR Camera vs Gallery Options */}
      {loading ? (
        <div className="relative flex-1 flex flex-col items-center justify-center my-auto">
          <div className="absolute w-[300px] h-[300px] sm:w-[400px] sm:h-[400px] border border-dashed border-gray-200 rotate-[35deg] animate-spin [animation-duration:25s]" />
          <div className="absolute w-[300px] h-[300px] sm:w-[400px] sm:h-[400px] border border-dashed border-gray-300 rotate-[45deg] animate-spin [animation-duration:20s]" />
          <p className="z-10 text-xs sm:text-sm font-semibold tracking-widest uppercase text-[#1A1B1C] animate-pulse">
            PREPARING YOUR ANALYSIS...
          </p>
        </div>
      ) : (
        <div className="flex-1 flex flex-col lg:flex-row items-center justify-center gap-20 lg:gap-40 my-auto z-10">
          {/* Option 1: Camera Scan (Links to /camera for Phase 3) */}
          <div className="relative flex flex-col items-center justify-center">
            <div className="absolute w-56 h-56 sm:w-64 sm:h-64 border border-dashed border-gray-200 rotate-[35deg] pointer-events-none" />
            <div className="absolute w-56 h-56 sm:w-64 sm:h-64 border border-dashed border-gray-300 rotate-[45deg] pointer-events-none" />

            <Link
              href="/camera"
              className="group relative z-10 flex flex-col items-center text-center cursor-pointer"
            >
              <div className="w-24 h-24 rounded-full border border-[#1A1B1C] flex items-center justify-center bg-white group-hover:scale-105 transition-transform duration-300">
                <svg
                  className="w-10 h-10 text-[#1A1B1C]"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z"
                  />
                </svg>
              </div>
              <span className="mt-4 text-[11px] font-semibold tracking-wider uppercase text-[#1A1B1C] max-w-[140px]">
                ALLOW A.I. TO SCAN YOUR FACE
              </span>
            </Link>
          </div>

          {/* Option 2: Gallery Upload */}
          <div className="relative flex flex-col items-center justify-center">
            <div className="absolute w-56 h-56 sm:w-64 sm:h-64 border border-dashed border-gray-200 rotate-[35deg] pointer-events-none" />
            <div className="absolute w-56 h-56 sm:w-64 sm:h-64 border border-dashed border-gray-300 rotate-[45deg] pointer-events-none" />

            <button
              type="button"
              onClick={handleGalleryClick}
              className="group relative z-10 flex flex-col items-center text-center cursor-pointer"
            >
              <div className="w-24 h-24 rounded-full border border-[#1A1B1C] flex items-center justify-center bg-white group-hover:scale-105 transition-transform duration-300">
                <svg
                  className="w-10 h-10 text-[#1A1B1C]"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
                  />
                </svg>
              </div>
              <span className="mt-4 text-[11px] font-semibold tracking-wider uppercase text-[#1A1B1C] max-w-[140px]">
                ALLOW A.I. ACCESS GALLERY
              </span>
            </button>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>
        </div>
      )}

      {error && (
        <p className="text-center text-xs text-red-500 z-10 mb-4">{error}</p>
      )}

      {/* Bottom Left BACK Button */}
      <div className="flex items-center justify-between w-full z-10">
        <Link
          href="/testing"
          className="group flex items-center gap-4 text-[11px] font-semibold tracking-wider uppercase text-[#1A1B1C]"
        >
          <span className="w-8 h-8 border border-[#1A1B1C] rotate-45 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
            <span className="-rotate-45 text-[10px]">◀</span>
          </span>
          <span>BACK</span>
        </Link>
      </div>
    </main>
  );
}