"use client";
import { AlertTriangle } from "lucide-react";
import Link from "next/link";

interface ErrorFallbackProps {
  error?: Error;
  reset?: () => void;
  backHref?: string;
  backLabel?: string;
}

export function ErrorFallback({ error, reset, backHref = "/", backLabel = "Back to home" }: ErrorFallbackProps) {
  return (
    <div className="min-h-[50vh] flex items-center justify-center p-4">
      <div className="glass-card p-8 max-w-md w-full text-center">
        <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
        <h2 className="text-xl font-semibold mb-2">Something went wrong</h2>
        <p className="text-muted-foreground mb-6 text-sm">{error?.message || "An unexpected error occurred."}</p>
        <div className="flex gap-3 justify-center">
          {reset && (
            <button onClick={reset} className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors">
              Try again
            </button>
          )}
          <Link href={backHref} className="px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80 transition-colors">
            {backLabel}
          </Link>
        </div>
      </div>
    </div>
  );
}
