import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function BentoGrid({ className = '', children }) {
  return (
    <div
      className={twMerge(
        'grid grid-cols-1 md:grid-cols-3 gap-5 max-w-7xl mx-auto',
        className
      )}
    >
      {children}
    </div>
  );
}

export function BentoGridItem({
  className = '',
  title,
  description,
  header,
  icon,
  badge,
  onClick,
}) {
  return (
    <div
      onClick={onClick}
      className={twMerge(
        'relative group/bento bg-[#fdfbf7] border-2 border-ink wobbly p-5 shadow-hard transition-all duration-200 flex flex-col justify-between space-y-4 hover:shadow-hard-lg hover:-translate-y-1',
        onClick ? 'cursor-pointer' : '',
        className
      )}
    >
      {/* Tape decoration on hover */}
      <div className="absolute -top-2.5 right-6 w-16 h-4 bg-[#ede7db]/80 border-l border-r border-dashed border-ink/30 rotate-2 pointer-events-none" />

      {header && <div className="w-full">{header}</div>}

      <div className="transition duration-200 group-hover/bento:translate-x-1">
        <div className="flex items-center justify-between gap-2 mb-2">
          {icon && (
            <div className="w-10 h-10 border-2 border-ink wobbly-sm bg-postit-yellow flex items-center justify-center text-ink shadow-hard-sm">
              {icon}
            </div>
          )}
          {badge && <div>{badge}</div>}
        </div>

        <div className="font-heading font-bold text-xl text-ink">
          {title}
        </div>
        <div className="font-body text-base text-ink/75 mt-1">
          {description}
        </div>
      </div>
    </div>
  );
}
