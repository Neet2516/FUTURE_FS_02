import React from 'react';

export function NewsTicker({ items = [] }) {
  if (items.length === 0) return null;

  const tickerContent = items.map((item, i) => (
    <span key={i} className="inline-flex items-center gap-3 whitespace-nowrap">
      <span className="font-ui text-xs font-bold uppercase tracking-wider text-newsprint">
        {item}
      </span>
      <span className="text-accent text-sm font-bold">───</span>
    </span>
  ));

  return (
    <div className="bg-foreground border-y border-neutral-700 overflow-hidden h-8 flex items-center">
      <div className="flex-shrink-0 bg-accent px-3 h-full flex items-center z-10">
        <span className="font-ui text-[0.5625rem] font-black uppercase tracking-[0.15em] text-newsprint">
          Latest
        </span>
      </div>
      <div className="overflow-hidden flex-1">
        <div className="ticker-animate flex items-center gap-8 px-4">
          {tickerContent}
          {tickerContent}
        </div>
      </div>
    </div>
  );
}
