import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { WashiTape } from './WashiTape';

export function WobblyCard({
  children,
  className = '',
  withTape = false,
  tapeColor = 'tape',
  tapeRotation = '-1.5deg',
  onClick,
  hoverable = false,
  ...props
}) {
  const baseStyles = 'relative bg-[#fdfbf7] border-2 border-ink wobbly p-5 shadow-hard transition-all duration-200';
  const hoverStyles = hoverable ? 'cursor-pointer hover:shadow-hard-lg hover:-translate-y-1 hover:-rotate-[0.3deg]' : '';

  return (
    <div
      onClick={onClick}
      className={twMerge(clsx(baseStyles, hoverStyles, className))}
      {...props}
    >
      {withTape && (
        <WashiTape
          className="-top-3 left-1/2 -translate-x-1/2"
          color={tapeColor}
          rotation={tapeRotation}
        />
      )}
      {children}
    </div>
  );
}
