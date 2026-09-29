import React from 'react';
import { useAuth } from '../../context/AuthContext';

export function Masthead() {
  const { user } = useAuth();
  const today = new Date();
  const dateStr = today.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).toUpperCase();

  return (
    <header className="bg-newsprint border-b-[3px] border-foreground">
      {/* Top meta bar */}
      <div className="border-b border-neutral-300 px-4 sm:px-8 py-1.5 flex items-center justify-between">
        <span className="font-data text-[0.625rem] text-neutral-500 tracking-wider">
          VOL. 01 — DIGITAL EDITION
        </span>
        <span className="font-data text-[0.625rem] text-neutral-500 tracking-wider hidden sm:block">
          {dateStr}
        </span>
        <div className="flex items-center gap-2">
          <span className="font-ui text-[0.625rem] font-semibold text-neutral-500 uppercase tracking-wider">
            {user?.name || 'Editor'}
          </span>
          <span className="w-1.5 h-1.5 bg-accent" />
        </div>
      </div>

      {/* Masthead title */}
      <div className="text-center py-4 sm:py-5 px-4">
        <div className="flex items-center justify-center gap-4 mb-1">
          <div className="h-px flex-1 max-w-24 bg-foreground" />
          <span className="font-ui text-[0.5rem] font-bold uppercase tracking-[0.3em] text-neutral-400">
            All The Deals That's Fit To Print
          </span>
          <div className="h-px flex-1 max-w-24 bg-foreground" />
        </div>
        <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-black text-foreground tracking-tight leading-none">
          PaperCRM
        </h1>
        <div className="flex items-center justify-center gap-4 mt-2">
          <div className="h-[2px] flex-1 max-w-16 bg-foreground" />
          <span className="font-data text-[0.5625rem] text-neutral-400 tracking-[0.15em]">
            THE DAILY LEDGER
          </span>
          <div className="h-[2px] flex-1 max-w-16 bg-foreground" />
        </div>
      </div>
    </header>
  );
}
