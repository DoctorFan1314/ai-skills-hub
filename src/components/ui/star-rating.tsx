"use client";
import { Star } from "lucide-react";

interface StarRatingProps {
  value: number;
  onChange?: (value: number) => void;
  readonly?: boolean;
  size?: number;
}

export function StarRating({ value, onChange, readonly = false, size = 20 }: StarRatingProps) {
  return (
    <div className="flex gap-1" role={readonly ? "img" : "radiogroup"} aria-label={readonly ? `Rating: ${value}/5` : "Rate"}>
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          className={`star-rating-btn ${readonly ? "cursor-default" : "cursor-pointer"}`}
          onClick={() => !readonly && onChange?.(star)}
          disabled={readonly}
          role="radio"
          aria-checked={value === star}
          aria-label={`${star} star${star > 1 ? "s" : ""}`}
          tabIndex={readonly ? -1 : 0}
        >
          <Star
            size={size}
            className={`transition-colors ${star <= value ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground/30"}`}
          />
        </button>
      ))}
    </div>
  );
}
