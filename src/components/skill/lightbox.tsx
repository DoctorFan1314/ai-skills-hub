"use client";

import { useEffect } from "react";
import { X } from "lucide-react";

interface LightboxProps {
  src: string | null;
  screenshots: string[];
  onClose: () => void;
  onNavigate: (src: string) => void;
}

export function Lightbox({ src, screenshots, onClose, onNavigate }: LightboxProps) {
  const showNav = screenshots.length > 1;
  const currentIdx = src ? screenshots.indexOf(src) : -1;

  // Keyboard navigation
  useEffect(() => {
    if (!src) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
        const idx = screenshots.indexOf(src!);
        if (idx === -1) return;
        const next = e.key === "ArrowRight"
          ? (idx + 1) % screenshots.length
          : (idx - 1 + screenshots.length) % screenshots.length;
        onNavigate(screenshots[next]);
      }
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [src, screenshots, onClose, onNavigate]);

  if (!src) return null;

  function handlePrev(e: React.MouseEvent) {
    e.stopPropagation();
    const prev = (currentIdx - 1 + screenshots.length) % screenshots.length;
    onNavigate(screenshots[prev]);
  }

  function handleNext(e: React.MouseEvent) {
    e.stopPropagation();
    const next = (currentIdx + 1) % screenshots.length;
    onNavigate(screenshots[next]);
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <div className="relative max-w-[90vw] max-h-[90vh]">
        <button
          onClick={onClose}
          className="absolute -top-10 right-0 text-white/70 hover:text-white"
        >
          <X className="h-6 w-6" />
        </button>
        {showNav && (
          <button
            onClick={handlePrev}
            className="absolute left-[-40px] top-1/2 -translate-y-1/2 text-white/70 hover:text-white"
            aria-label="Previous screenshot"
          >
            <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          </button>
        )}
        <img
          src={src}
          alt="Screenshot"
          className="max-w-full max-h-[90vh] rounded-lg object-contain"
        />
        {showNav && (
          <button
            onClick={handleNext}
            className="absolute right-[-40px] top-1/2 -translate-y-1/2 text-white/70 hover:text-white"
            aria-label="Next screenshot"
          >
            <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          </button>
        )}
        {showNav && (
          <div className="absolute bottom-[-30px] left-1/2 -translate-x-1/2 text-white/60 text-sm">
            {currentIdx + 1} / {screenshots.length}
          </div>
        )}
      </div>
    </div>
  );
}
