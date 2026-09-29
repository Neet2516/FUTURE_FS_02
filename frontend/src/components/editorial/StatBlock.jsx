import React from 'react';
import { clsx } from 'clsx';

export function StatBlock({
  label,
  value,
  sublabel,
  accent = false,
  className = '',
  onClick,
}) {
  return (
    <div
      className={clsx(
        'p-4 border border-foreground sharp-corners',
        accent && 'border-l-4 border-l-accent',
        onClick && 'cursor-pointer hard-shadow-hover',
        className
      )}
      onClick={onClick}
    >
      <span className="editorial-label text-neutral-500 block mb-1">
        {label}
      </span>
      <div className="font-display text-3xl sm:text-4xl font-bold text-foreground leading-none tracking-tight">
        {value}
      </div>
      {sublabel && (
        <span className="data-label text-neutral-500 block mt-2">
          {sublabel}
        </span>
      )}
    </div>
  );
}
