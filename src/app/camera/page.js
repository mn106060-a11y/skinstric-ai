"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function CameraPage() {
  const router = useRouter();
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  const [stage, setStage] = useState("permission"); // "permission" | "streaming" | "captured" | "loading"
  const [capturedImage, setCapturedImage] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  };

  const handleAllowCamera = async () => {
    setError("");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
        audio: false,
      });
      streamRef.current = stream;
      setStage("streaming");

      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      }, 50);
    } catch (err) {
      setError(
        "Camera access was denied or unavailable. Please allow camera permissions in Safari or go back to upload from your gallery."
      );
    }
  };

  const handleTakePicture = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;

    const ctx = canvas.getContext("2d");
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const dataUrl = canvas.toDataURL("image/jpeg", 0.9);
    setCapturedImage(dataUrl);
    stopCamera();
    setStage("captured");
  };

  const handleRetake = () => {
    setCapturedImage(null);
    handleAllowCamera();
  };

  const handleUsePhoto = async () => {
    if (!capturedImage) return;
    setStage("loading");
    setError("");

    try {
      const base64String = capturedImage.split(",")[1];
      const response = await fetch(
        "https://us-central1-api-skinstric-ai.cloudfunctions.net/skinstricPhaseTwo",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            image: base64String,
          }),
        }
      );

      const result = await response.json();

      if (response.ok && result.data) {
        localStorage.setItem(
          "skinstricDemographics",
          JSON.stringify(result.data)
        );
        router.push("/summary");
      } else {
        setError("Failed to analyze snapshot. Please try again.");
        setStage("captured");
      }
    } catch (err) {
      setError("Network error while uploading photo. Please try again.");
      setStage("captured");
    }
  };

  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-white flex flex-col justify-between pt-20 pb-8 px-6 md:px-10">
      {/* Stage 1: Camera Permission Prompt */}
      {stage === "permission" && (
        <div className="relative flex-1 flex flex-col items-center justify-center my-auto z-10">
          <motion.div
            animate={{ rotate: 395 }}
            transition={{ repeat: Infinity, duration: 40, ease: "linear" }}
            className="absolute w-[300px] h-[300px] sm:w-[400px] sm:h-[400px] border border-dashed border-gray-200 pointer-events-none"
          />
          <motion.div
            animate={{ rotate: -315 }}
            transition={{ repeat: Infinity, duration: 50, ease: "linear" }}
            className="absolute w-[300px] h-[300px] sm:w-[400px] sm:h-[400px] border border-dashed border-gray-300 pointer-events-none"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 14 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="z-10 bg-white border border-[#1A1B1C] p-6 sm:p-8 max-w-sm w-full text-center shadow-sm"
          >
            <p className="text-xs font-semibold tracking-wider uppercase text-[#1A1B1C] mb-6">
              ALLOW A.I. TO ACCESS YOUR CAMERA
            </p>
            <div className="flex items-center justify-center gap-4 border-t border-gray-200 pt-5">
              <Link
                href="/result"
                className="flex-1 py-2.5 border border-gray-300 text-[10px] font-semibold tracking-wider uppercase text-gray-600 hover:bg-gray-100 transition-colors"
              >
                DENY
              </Link>
              <button
                type="button"
                onClick={handleAllowCamera}
                className="flex-1 py-2.5 bg-[#1A1B1C] text-white text-[10px] font-semibold tracking-wider uppercase hover:bg-neutral-800 transition-colors cursor-pointer"
              >
                ALLOW
              </button>
            </div>
          </motion.div>

          {error && (
            <p className="mt-4 max-w-sm text-center text-xs text-red-500 z-10">
              {error}
            </p>
          )}
        </div>
      )}

      {/* Stage 2: Live Camera Feed */}
      {stage === "streaming" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="fixed inset-0 z-30 bg-black flex flex-col justify-between"
        >
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover -scale-x-100"
          />

          <div className="fixed inset-0 flex flex-col justify-between p-6 md:p-10 pointer-events-none">
            <div />

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="self-end my-auto pointer-events-auto"
            >
              <button
                type="button"
                onClick={handleTakePicture}
                className="group flex items-center gap-3 bg-black/50 backdrop-blur-sm text-white px-4 py-2.5 rounded-full border border-white/40 hover:bg-black/75 transition-all cursor-pointer"
              >
                <span className="text-[11px] font-semibold tracking-wider uppercase">
                  TAKE PICTURE
                </span>
                <span className="w-10 h-10 rounded-full bg-white text-[#1A1B1C] flex items-center justify-center group-hover:scale-105 transition-transform">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
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
                </span>
              </button>
            </motion.div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pointer-events-auto">
              <Link
                href="/result"
                onClick={stopCamera}
                className="group flex items-center gap-4 text-[11px] font-semibold tracking-wider uppercase text-white self-start sm:self-auto"
              >
                <span className="w-8 h-8 border border-white rotate-45 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <span className="-rotate-45 text-[10px]">◀</span>
                </span>
                <span>BACK</span>
              </Link>

              <div className="text-center text-white bg-black/45 backdrop-blur-sm px-4 py-2 rounded">
                <p className="text-[10px] tracking-widest uppercase mb-1">
                  TO GET BETTER RESULTS MAKE SURE TO HAVE
                </p>
                <div className="flex items-center justify-center gap-4 text-[10px] tracking-wider uppercase text-gray-200">
                  <span>◇ NEUTRAL EXPRESSION</span>
                  <span>◇ FRONTAL POSE</span>
                  <span>◇ ADEQUATE LIGHTING</span>
                </div>
              </div>

              <div className="hidden sm:block w-20" />
            </div>
          </div>
        </motion.div>
      )}

      {/* Stage 3: Snapshot Preview ("GREAT SHOT!") */}
      {stage === "captured" && capturedImage && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-30 bg-black flex flex-col justify-between"
        >
          <img
            src={capturedImage}
            alt="Captured selfie"
            className="w-full h-full object-cover"
          />

          <div className="fixed inset-0 bg-black/25 flex flex-col justify-between p-6 md:p-10">
            <motion.div
              initial={{ opacity: 0, y: -15 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-14 text-center"
            >
              <p className="text-xs sm:text-sm font-semibold tracking-widest uppercase text-white">
                GREAT SHOT!
              </p>
            </motion.div>

            {error && (
              <p className="text-center text-xs text-red-300 bg-black/70 px-4 py-2 rounded self-center">
                {error}
              </p>
            )}

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col sm:flex-row items-center justify-between gap-4"
            >
              <Link
                href="/result"
                className="group flex items-center gap-4 text-[11px] font-semibold tracking-wider uppercase text-white self-start sm:self-auto"
              >
                <span className="w-8 h-8 border border-white rotate-45 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <span className="-rotate-45 text-[10px]">◀</span>
                </span>
                <span>BACK</span>
              </Link>

              <div className="flex flex-col items-center gap-3">
                <p className="text-xs font-medium tracking-wider uppercase text-white">
                  Preview
                </p>
                <div className="flex items-center gap-4">
                  <button
                    type="button"
                    onClick={handleRetake}
                    className="bg-white/90 text-[#1A1B1C] text-[10px] font-semibold tracking-wider uppercase px-5 py-2.5 hover:bg-white transition-colors cursor-pointer"
                  >
                    RETAKE
                  </button>
                  <button
                    type="button"
                    onClick={handleUsePhoto}
                    className="bg-[#1A1B1C] text-white border border-white/40 text-[10px] font-semibold tracking-wider uppercase px-5 py-2.5 hover:bg-neutral-800 transition-colors cursor-pointer"
                  >
                    USE THIS PHOTO
                  </button>
                </div>
              </div>

              <div className="hidden sm:block w-20" />
            </motion.div>
          </div>
        </motion.div>
      )}

      {/* Stage 4: Uploading Snapshot */}
      {stage === "loading" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="relative flex-1 flex flex-col items-center justify-center my-auto z-10"
        >
          <motion.div
            animate={{ rotate: 395 }}
            transition={{ repeat: Infinity, duration: 25, ease: "linear" }}
            className="absolute w-[300px] h-[300px] sm:w-[400px] sm:h-[400px] border border-dashed border-gray-200"
          />
          <motion.div
            animate={{ rotate: -315 }}
            transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
            className="absolute w-[300px] h-[300px] sm:w-[400px] sm:h-[400px] border border-dashed border-gray-300"
          />
          <p className="z-10 text-xs sm:text-sm font-semibold tracking-widest uppercase text-[#1A1B1C] animate-pulse">
            ANALYZING YOUR PHOTO...
          </p>
        </motion.div>
      )}

      <canvas ref={canvasRef} className="hidden" />

      {stage === "permission" && (
        <div className="flex items-center justify-between w-full z-10">
          <Link
            href="/result"
            className="group flex items-center gap-4 text-[11px] font-semibold tracking-wider uppercase text-[#1A1B1C]"
          >
            <span className="w-8 h-8 border border-[#1A1B1C] rotate-45 flex items-center justify-center group-hover:scale-110 group-hover:bg-[#1A1B1C] group-hover:text-white transition-all duration-300">
              <span className="-rotate-45 text-[10px]">◀</span>
            </span>
            <span>BACK</span>
          </Link>
        </div>
      )}
    </main>
  );
}