import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function WobblyButton({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  onClick,
  disabled = false,
  type = 'button',
  ...props
}) {
  const baseStyles = 'inline-flex items-center justify-center font-heading font-bold select-none cursor-pointer transition-all duration-150 border-2 border-ink disabled:opacity-50 disabled:cursor-not-allowed';

  const variants = {
    primary: 'bg-ink text-paper hover:bg-[#1a1a1a] shadow-hard hover:shadow-hard-lg hover:-translate-x-[1px] hover:-translate-y-[1px] active:translate-x-[2px] active:translate-y-[2px] active:shadow-hard-sm',
    secondary: 'bg-paper text-ink hover:bg-[#f5f1e8] shadow-hard hover:shadow-hard-lg hover:-translate-x-[1px] hover:-translate-y-[1px] active:translate-x-[2px] active:translate-y-[2px] active:shadow-hard-sm',
    accent: 'bg-accent-red text-white hover:bg-[#e63e3e] shadow-hard hover:shadow-hard-lg hover:-translate-x-[1px] hover:-translate-y-[1px] active:translate-x-[2px] active:translate-y-[2px] active:shadow-hard-sm',
    yellow: 'bg-postit-yellow text-ink hover:bg-[#fff59d] shadow-hard hover:shadow-hard-lg hover:-translate-x-[1px] hover:-translate-y-[1px] active:translate-x-[2px] active:translate-y-[2px] active:shadow-hard-sm',
    blue: 'bg-secondary-blue text-white hover:bg-[#234c85] shadow-hard hover:shadow-hard-lg hover:-translate-x-[1px] hover:-translate-y-[1px] active:translate-x-[2px] active:translate-y-[2px] active:shadow-hard-sm',
    ghost: 'bg-transparent text-ink border-transparent hover:border-ink hover:bg-muted-paper/40 shadow-none hover:shadow-hard-sm',
  };

  const sizes = {
    sm: 'text-sm px-3 py-1.5 wobbly-sm gap-1.5 min-h-[36px]',
    md: 'text-base px-4 py-2 wobbly gap-2 min-h-[44px]',
    lg: 'text-lg px-6 py-2.5 wobbly-md gap-2.5 min-h-[50px]',
  };

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={twMerge(clsx(baseStyles, variants[variant], sizes[size], className))}
      {...props}
    >
      {children}
    </button>
  );
}
