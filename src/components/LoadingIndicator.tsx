import React from 'react';

interface LoadingIndicatorProps {
  message?: string;
  fullscreen?: boolean;
}

/**
 * Simple loading indicator used across pages to avoid blank screens.
 * Shows a spinner and optional message. Can be rendered fullscreen.
 */
export function LoadingIndicator({ message = 'Loading…', fullscreen = false }: LoadingIndicatorProps) {
  return (
    <div
      className={
        fullscreen
          ? 'min-h-screen flex items-center justify-center bg-background'
          : 'py-12 flex items-center justify-center'
      }
      aria-busy="true"
      aria-live="polite"
      role="status"
    >
      <div className="flex items-center gap-3 text-foreground/70">
        <div className="h-5 w-5 border-2 border-foreground/30 border-t-[#FF00A8] rounded-full animate-spin" />
        <span className="text-sm">{message}</span>
      </div>
    </div>
  );
}

export default LoadingIndicator;
