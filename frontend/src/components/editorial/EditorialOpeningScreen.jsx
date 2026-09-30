import React, { useState, useEffect } from 'react';

export function EditorialOpeningScreen({ message = 'Typesetting edition & verifying session...' }) {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds((s) => s + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Soft progressive status messages based on elapsed time (helps with Render spin-ups)
  const getProgressStatus = () => {
    if (seconds < 2) return message;
    if (seconds < 5) return 'Accessing archives & verifying authentication token...';
    if (seconds < 10) return 'Connecting to remote cloud dispatch (Render backend)...';
    if (seconds < 20) return 'Render cloud instance waking up from sleep mode...';
    return 'Finalizing database connections — press will be ready in moments...';
  };

  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="min-h-screen bg-newsprint newsprint-texture flex flex-col items-center justify-center p-4 selection:bg-foreground selection:text-newsprint">
      <div className="max-w-md w-full bg-[#FDFCF7] border-2 border-foreground shadow-hard p-6 sm:p-8 relative overflow-hidden animate-soft-fade-in">
        {/* Top Editorial Folio */}
        <div className="flex items-center justify-between font-data text-[10px] tracking-wider uppercase text-neutral-500 pb-2 border-b border-foreground/20">
          <span>VOL. MMXXVI • DISPATCH NO. 1</span>
          <span className="font-semibold text-foreground">{currentDate}</span>
        </div>

        {/* Brand Headline */}
        <div className="text-center pt-6 pb-4">
          <div className="inline-flex items-center gap-2 mb-1.5">
            <span className="inline-block w-2 h-2 bg-accent" />
            <span className="font-data text-[10px] tracking-[0.2em] uppercase text-neutral-600 font-bold">
              The Broadside Gazette
            </span>
            <span className="inline-block w-2 h-2 bg-accent" />
          </div>

          <h1 className="font-display text-4xl sm:text-5xl font-black text-foreground tracking-tight leading-none">
            PaperCRM<span className="text-accent">.</span>
          </h1>

          <p className="font-body italic text-neutral-600 text-xs sm:text-sm mt-2 max-w-xs mx-auto">
            Commercial contact rolodex, active deal ledger & task chronicle.
          </p>
        </div>

        {/* Soft Press Runner / Loading Bar */}
        <div className="my-6">
          <div className="flex items-center justify-between font-data text-[10px] text-neutral-400 mb-1.5">
            <span className="uppercase tracking-widest">PRESS RUNNER</span>
            <span className="text-foreground font-mono">
              {String(Math.floor(seconds / 60)).padStart(2, '0')}:
              {String(seconds % 60).padStart(2, '0')}s
            </span>
          </div>

          {/* Dual rail with sliding vermilion ink runner */}
          <div className="relative h-2 bg-neutral-200 border border-foreground/30 overflow-hidden">
            <div className="absolute inset-y-0 w-24 bg-accent animate-press-runner shadow-sm" />
          </div>

          {/* Sub-rail line */}
          <div className="h-0.5 bg-foreground/15 mt-1" />
        </div>

        {/* Soft Status Message */}
        <div className="text-center min-h-[48px] flex flex-col items-center justify-center">
          <div className="flex items-center gap-2 text-foreground font-data text-xs tracking-tight">
            <span className="inline-block w-1.5 h-1.5 bg-foreground animate-ping" />
            <span>{getProgressStatus()}</span>
          </div>

          {/* Render Cold-Start Soft Reassurance */}
          {seconds >= 5 && (
            <div className="mt-3 px-3 py-1.5 bg-neutral-100 border border-neutral-300 font-data text-[11px] text-neutral-600 animate-soft-fade-in text-center leading-relaxed">
              <span className="font-bold text-foreground">Note:</span> Cloud backend is in eco-sleep mode. Cold start typically takes 20–45 seconds.
            </div>
          )}
        </div>

        {/* Decorative Editorial Bottom Rules */}
        <div className="mt-6 pt-3 border-t-2 border-foreground flex items-center justify-between text-[9px] font-data uppercase tracking-widest text-neutral-400">
          <span>Typeset in Playfair & Lora</span>
          <span className="text-neutral-600 font-semibold">Ready Shortly</span>
        </div>
      </div>
    </div>
  );
}
