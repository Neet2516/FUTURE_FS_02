import React, { useState, useEffect } from 'react';

export function LoadingState({
  message = 'Loading records...',
  subtitle = 'Typesetting ledger & archives...',
  showSkeleton = true,
}) {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds((s) => s + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full py-10 px-4 flex flex-col items-center justify-center animate-soft-fade-in">
      {/* Central Editorial Loader Box */}
      <div className="max-w-md w-full bg-[#FAF8F3] border border-foreground/30 shadow-hard-sm p-6 text-center">
        {/* Subtle decorative top folio */}
        <div className="flex items-center justify-between text-[10px] font-data text-neutral-400 uppercase tracking-widest pb-2 border-b border-foreground/15 mb-4">
          <span>DISPATCH IN TRANSIT</span>
          <span className="font-mono text-neutral-600">
            {String(Math.floor(seconds / 60)).padStart(2, '0')}:
            {String(seconds % 60).padStart(2, '0')}s
          </span>
        </div>

        {/* Soft Press Runner Bar */}
        <div className="relative h-1.5 bg-neutral-200 border border-foreground/20 overflow-hidden mb-4">
          <div className="absolute inset-y-0 w-20 bg-accent animate-press-runner" />
        </div>

        {/* Message and Subtitle */}
        <div className="flex items-center justify-center gap-2 mb-1">
          <span className="text-accent text-xs">✦</span>
          <h3 className="font-display text-base font-bold text-foreground tracking-tight">
            {message}
          </h3>
          <span className="text-accent text-xs">✦</span>
        </div>

        <p className="font-body italic text-xs text-neutral-500">
          {seconds >= 5
            ? 'Backend cold start detected — waking up Render server instance...'
            : subtitle}
        </p>

        {/* Render Cold-Start Helper Box */}
        {seconds >= 5 && (
          <div className="mt-4 p-2.5 bg-neutral-100 border border-neutral-300 text-left animate-soft-fade-in">
            <div className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 bg-accent mt-1 flex-shrink-0 animate-ping" />
              <p className="font-data text-[11px] text-neutral-600 leading-snug">
                <span className="font-bold text-foreground">Server Spin-Up:</span> The Render free cloud backend enters low-power sleep when idle. Cold starts take ~30–45s. Your request is active.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Soft Editorial Skeleton Preview (simulates broadside layout arriving) */}
      {showSkeleton && (
        <div className="max-w-3xl w-full mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 opacity-75 pointer-events-none">
          {/* Skeleton Card 1 */}
          <div className="border border-neutral-300 bg-white/60 p-4 space-y-3">
            <div className="h-3 w-1/3 bg-neutral-200 animate-editorial-shimmer" />
            <div className="h-6 w-3/4 bg-neutral-200 animate-editorial-shimmer" />
            <div className="h-2 w-full bg-neutral-200 animate-editorial-shimmer" />
            <div className="h-2 w-5/6 bg-neutral-200 animate-editorial-shimmer" />
          </div>

          {/* Skeleton Card 2 */}
          <div className="border border-neutral-300 bg-white/60 p-4 space-y-3">
            <div className="h-3 w-1/2 bg-neutral-200 animate-editorial-shimmer" />
            <div className="h-6 w-2/3 bg-neutral-200 animate-editorial-shimmer" />
            <div className="h-2 w-full bg-neutral-200 animate-editorial-shimmer" />
            <div className="h-2 w-4/5 bg-neutral-200 animate-editorial-shimmer" />
          </div>

          {/* Skeleton Card 3 */}
          <div className="border border-neutral-300 bg-white/60 p-4 space-y-3">
            <div className="h-3 w-2/5 bg-neutral-200 animate-editorial-shimmer" />
            <div className="h-6 w-1/2 bg-neutral-200 animate-editorial-shimmer" />
            <div className="h-2 w-full bg-neutral-200 animate-editorial-shimmer" />
            <div className="h-2 w-3/4 bg-neutral-200 animate-editorial-shimmer" />
          </div>
        </div>
      )}
    </div>
  );
}
