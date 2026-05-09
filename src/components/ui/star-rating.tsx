"use client";
import { useState } from "react";
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

  return (
    <div className="flex gap-1" role={readonly ? "img" : "radiogroup"} aria-label={readonly ? `Rating: ${value}/5` : "Rate"}>
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          className={`star-rating-btn ${readonly ? "cursor-default" : "cursor-pointer"}`}
          onClick={() => !readonly && onChange?.(star)}
          onMouseEnter={() => !readonly && setHoverValue(star)}
          onMouseLeave={() => !readonly && setHoverValue(null)}
          disabled={readonly}
          role="radio"
          aria-checked={value === star}
          aria-label={`${star} star${star > 1 ? "s" : ""}`}
          tabIndex={readonly ? -1 : 0}
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
