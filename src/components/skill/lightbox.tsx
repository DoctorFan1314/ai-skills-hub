"use client";

import { useEffect, useRef, useCallback } from "react";
import { X } from "lucide-react";

interface LightboxProps {
  src: string | null;
  screenshots: string[];
  onClose: () => void;
  onNavigate: (src: string) => void;
  closeLabel?: string;
  prevLabel?: string;
  nextLabel?: string;
  counterLabel?: (current: number, total: number) => string;
}

export function Lightbox({ src, screenshots, onClose, onNavigate, closeLabel = "Close lightbox", prevLabel = "Previous screenshot", nextLabel = "Next screenshot", counterLabel }: LightboxProps) {
  const showNav = screenshots.length > 1;
  const currentIdx = src ? screenshots.indexOf(src) : -1;
  const containerRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  // Save and restore focus + body scroll lock
  useEffect(() => {
    if (src) {
      previousFocusRef.current = document.activeElement as HTMLElement;
      document.body.style.overflow = "hidden";
      setTimeout(() => containerRef.current?.focus(), 50);
    } else {
      document.body.style.overflow = "";
      previousFocusRef.current?.focus();
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [src]);

  const handlePrev = useCallback(() => {
    const prev = (currentIdx - 1 + screenshots.length) % screenshots.length;
    onNavigate(screenshots[prev]);
  }, [currentIdx, screenshots, onNavigate]);

  const handleNext = useCallback(() => {
    const next = (currentIdx + 1) % screenshots.length;
    onNavigate(screenshots[next]);
  }, [currentIdx, screenshots, onNavigate]);

  // Keyboard navigation + focus trap
  useEffect(() => {
    if (!src) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowRight") {
        if (showNav) handleNext();
      } else if (e.key === "ArrowLeft") {
        if (showNav) handlePrev();
      } else if (e.key === "Tab") {
        // Focus trap: keep focus within lightbox
        e.preventDefault();
        containerRef.current?.focus();
      }
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [src, showNav, onClose, handlePrev, handleNext]);

  if (!src) return null;

  const counterText = counterLabel
    ? counterLabel(currentIdx + 1, screenshots.length)
    : `${currentIdx + 1} / ${screenshots.length}`;

  return (
    <div
      ref={containerRef}
      role="dialog"
      aria-modal="true"
      aria-label="Screenshot lightbox"
      tabIndex={-1}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm outline-none"
      onClick={onClose}
    >
      <div className="relative max-w-[90vw] max-h-[90vh]">
        <button
          onClick={onClose}
          aria-label={closeLabel}
          className="absolute -top-10 right-0 text-white/70 hover:text-white p-2 min-w-[44px] min-h-[44px] flex items-center justify-center"
        >
          <X className="h-6 w-6" />
        </button>
        {showNav && (
          <button
            onClick={(e) => { e.stopPropagation(); handlePrev(); }}
            className="absolute left-2 sm:-left-10 top-1/2 -translate-y-1/2 text-white/70 hover:text-white p-2 min-w-[44px] min-h-[44px] flex items-center justify-center z-10"
            aria-label={prevLabel}
          >
            <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          </button>
        )}
        <img
          src={src}
          alt={`Screenshot ${currentIdx + 1} of ${screenshots.length}`}
          className="max-w-full max-h-[90vh] rounded-lg object-contain"
        />
        {showNav && (
          <button
            onClick={(e) => { e.stopPropagation(); handleNext(); }}
            className="absolute right-2 sm:-right-10 top-1/2 -translate-y-1/2 text-white/70 hover:text-white p-2 min-w-[44px] min-h-[44px] flex items-center justify-center z-10"
            aria-label={nextLabel}
          >
            <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          </button>
        )}
        {showNav && (
          <div className="absolute bottom-[-30px] left-1/2 -translate-x-1/2 text-white/60 text-sm" aria-live="polite">
            {counterText}
          </div>
        )}
      </div>
    </div>
  );
}
