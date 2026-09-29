import React from 'react';

export function ScribbleUnderline({ className = '', color = '#ff4d4d' }) {
  return (
    <svg
      className={`w-full h-3 overflow-visible pointer-events-none select-none ${className}`}
      viewBox="0 0 200 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="none"
    >
      <path
        d="M2 8C35 3 65 11 98 7C130 3 162 10 198 5"
        stroke={color}
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function SketchArrow({ className = '', color = '#2d2d2d' }) {
  return (
    <svg
      className={`w-6 h-6 pointer-events-none select-none ${className}`}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M6 22C14 20 25 18 34 20M34 20L26 12M34 20L27 28"
        stroke={color}
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function RoughCircle({ children, color = '#ff4d4d', className = '' }) {
  return (
    <div className={`relative inline-flex items-center justify-center p-1 ${className}`}>
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none select-none scale-110"
        viewBox="0 0 100 100"
        fill="none"
        preserveAspectRatio="none"
      >
        <path
          d="M10,50 A40,40 0 1,0 90,50 A40,42 0 1,0 8,48"
          stroke={color}
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
        />
      </svg>
      <span className="relative z-10">{children}</span>
    </div>
  );
}
