import React from 'react';
import { clsx } from 'clsx';

export function EditorialBadge({
  children,
  variant = 'default',
  size = 'sm',
  className = '',
}) {
  const base = 'inline-flex items-center font-ui font-bold uppercase tracking-[0.08em] border sharp-corners leading-none';

  const variants = {
    default: 'bg-neutral-100 text-foreground border-foreground',
    accent: 'bg-accent text-newsprint border-accent',
    dark: 'bg-foreground text-newsprint border-foreground',
    success: 'bg-newsprint text-foreground border-foreground',
    outline: 'bg-transparent text-foreground border-foreground',
  };

  const sizes = {
    xs: 'px-1.5 py-0.5 text-[0.5625rem]',
    sm: 'px-2 py-1 text-[0.625rem]',
    md: 'px-3 py-1.5 text-xs',
  };

  return (
    <span className={clsx(base, variants[variant], sizes[size], className)}>
      {children}
    </span>
  );
}
