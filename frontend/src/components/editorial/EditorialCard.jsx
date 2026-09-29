import React from 'react';
import { clsx } from 'clsx';

export function EditorialCard({
  children,
  className = '',
  hoverable = false,
  bordered = true,
  onClick,
  ...props
}) {
  return (
    <div
      className={clsx(
        'bg-newsprint sharp-corners',
        bordered && 'border border-foreground',
        hoverable && 'hard-shadow-hover cursor-pointer',
        onClick && 'cursor-pointer',
        className
      )}
      onClick={onClick}
      {...props}
    >
      {children}
    </div>
  );
}

export function EditorialCardHeader({ children, className = '' }) {
  return (
    <div className={clsx('px-5 py-3 border-b border-foreground', className)}>
      {children}
    </div>
  );
}

export function EditorialCardBody({ children, className = '' }) {
  return (
    <div className={clsx('px-5 py-4', className)}>
      {children}
    </div>
  );
}
