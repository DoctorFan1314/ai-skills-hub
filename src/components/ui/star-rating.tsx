"use client";
import { useState, useRef } from "react";
import { Star } from "lucide-react";

interface StarRatingProps {
  value: number;
  onChange?: (value: number) => void;
  readonly?: boolean;
  size?: number;
}

export function StarRating({ value, onChange, readonly = false, size = 20 }: StarRatingProps) {
  const [hoverValue, setHoverValue] = useState<number | null>(null);
  const displayValue = hoverValue ?? value;
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);

  function handleKeyDown(e: React.KeyboardEvent) {
    if (readonly) return;
    const stars = [1, 2, 3, 4, 5];
    const currentIdx = stars.indexOf(value);
    if (e.key === "ArrowRight" || e.key === "ArrowDown") {
      e.preventDefault();
      const next = stars[Math.min(currentIdx + 1, stars.length - 1)];
      onChange?.(next);
      buttonRefs.current[next - 1]?.focus();
    } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
      e.preventDefault();
      const prev = stars[Math.max(currentIdx - 1, 0)];
      onChange?.(prev);
      buttonRefs.current[prev - 1]?.focus();
    }
  }

  return (
    <div className="flex gap-1" role={readonly ? "img" : "radiogroup"} aria-label={readonly ? `Rating: ${value}/5` : "Rate"} onKeyDown={handleKeyDown}>
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          ref={(el) => { buttonRefs.current[star - 1] = el; }}
          className={`star-rating-btn ${readonly ? "cursor-default" : "cursor-pointer"} focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 hover:scale-110 active:scale-95 transition-transform rounded-sm`}
          onClick={() => !readonly && onChange?.(star)}
          onMouseEnter={() => !readonly && setHoverValue(star)}
          onMouseLeave={() => !readonly && setHoverValue(null)}
          disabled={readonly}
          role="radio"
          aria-checked={value === star}
          aria-label={`${star} star${star > 1 ? "s" : ""}`}
          tabIndex={readonly ? -1 : value === star ? 0 : -1}
        >
          <Star
            size={size}
            className={`transition-colors ${star <= displayValue ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground/30"}`}
          />
        </button>
      ))}
    </div>
  );
}
