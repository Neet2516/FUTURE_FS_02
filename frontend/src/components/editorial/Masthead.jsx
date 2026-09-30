import React from 'react';
import { LogOut } from 'lucide-react';

export function Masthead({ user, onLogout }) {
  const today = new Date();
  const dateStr = today
    .toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
    .toUpperCase();

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
        {/* User identity + logout */}
        <div className="flex items-center gap-3">
          {user && (
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-accent" />
              <span className="font-ui text-[0.625rem] font-semibold text-neutral-600 uppercase tracking-wider">
                {user.name || user.email}
              </span>
              {user.role && (
                <span className="hidden sm:inline font-data text-[0.5625rem] text-neutral-400 border-l border-neutral-300 pl-2">
                  {user.role}
                </span>
              )}
            </div>
          )}
          {onLogout && (
            <button
              type="button"
              onClick={onLogout}
              title="Sign out"
              className="flex items-center gap-1 font-ui text-[0.5625rem] font-bold uppercase tracking-wider text-neutral-400 hover:text-accent transition-colors"
            >
              <LogOut className="w-3 h-3" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          )}
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
