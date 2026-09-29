import React from 'react';
import { clsx } from 'clsx';

export function EditorialButton({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  ...props
}) {
  const base = 'btn-editorial sharp-corners inline-flex items-center justify-center gap-2 font-ui font-bold uppercase tracking-[0.12em] border-2 transition-all duration-150 ease-out cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed';

  const variants = {
    primary: 'bg-foreground text-newsprint border-foreground hover:bg-newsprint hover:text-foreground',
    secondary: 'bg-transparent text-foreground border-foreground hover:bg-foreground hover:text-newsprint',
    accent: 'bg-accent text-newsprint border-accent hover:bg-newsprint hover:text-accent',
    ghost: 'bg-transparent text-foreground border-transparent hover:border-foreground',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-[0.625rem]',
    md: 'px-5 py-2.5 text-xs',
    lg: 'px-8 py-3 text-sm',
  };

  return (
    <button
      className={clsx(base, variants[variant], sizes[size], className)}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}
