import React from 'react';

export function Thumbtack({ className = '', color = '#ff4d4d' }) {
  return (
    <div className={`absolute z-20 pointer-events-none select-none drop-shadow-[2px_2px_0px_rgba(45,45,45,0.8)] ${className}`}>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Needle shadow */}
        <line x1="12" y1="14" x2="8" y2="22" stroke="#2d2d2d" strokeWidth="2.5" strokeLinecap="round" />
        {/* Pin base */}
        <ellipse cx="12" cy="12" rx="7" ry="5" fill="#2d2d2d" />
        {/* Pin head */}
        <circle cx="12" cy="10" r="6" fill={color} stroke="#2d2d2d" strokeWidth="1.5" />
        {/* Specular highlight */}
        <circle cx="10" cy="8" r="1.8" fill="#ffffff" opacity="0.8" />
      </svg>
    </div>
  );
}
