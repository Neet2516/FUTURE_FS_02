import React from 'react';
import { clsx } from 'clsx';

export function SectionHeader({
  number,
  title,
  subtitle,
  className = '',
  action,
}) {
  return (
    <div className={clsx('mb-6', className)}>
      <div className="flex items-end justify-between gap-4">
        <div className="flex items-baseline gap-3">
          {number && (
            <span className="font-data text-xs text-neutral-400 tracking-wider">
              {String(number).padStart(2, '0')}
            </span>
          )}
          <div className="h-px flex-shrink-0 w-8 bg-foreground self-center" />
          <h3 className="font-display text-xl sm:text-2xl font-bold text-foreground uppercase tracking-wide">
            {title}
          </h3>
        </div>
        {action && <div className="flex-shrink-0">{action}</div>}
      </div>
      {subtitle && (
        <p className="font-body text-sm text-neutral-500 mt-1 ml-16">
          {subtitle}
        </p>
      )}
      <hr className="section-rule mt-3" />
    </div>
  );
}
