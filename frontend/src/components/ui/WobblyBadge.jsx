import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function WobblyBadge({
  children,
  variant = 'neutral',
  className = '',
  size = 'md',
}) {
  const baseStyles = 'inline-flex items-center font-heading font-bold uppercase tracking-wider border border-ink select-none wobbly-badge';

  const variants = {
    green: 'bg-emerald-100 text-emerald-950 border-emerald-800',
    yellow: 'bg-postit-yellow text-amber-950 border-amber-800',
    red: 'bg-rose-100 text-rose-950 border-rose-800',
    blue: 'bg-blue-100 text-blue-950 border-blue-800',
    purple: 'bg-purple-100 text-purple-950 border-purple-800',
    neutral: 'bg-muted-paper/60 text-ink border-ink',
    ink: 'bg-ink text-paper border-ink',
  };

  const sizes = {
    sm: 'text-[11px] px-2 py-0.5 shadow-[1px_1px_0px_#2d2d2d]',
    md: 'text-xs px-2.5 py-1 shadow-hard-sm',
    lg: 'text-sm px-3 py-1.5 shadow-hard-sm',
  };

  return (
    <span className={twMerge(clsx(baseStyles, variants[variant], sizes[size], className))}>
      {children}
    </span>
  );
}
