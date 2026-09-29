import React from 'react';

export function WashiTape({ className = '', color = 'tape', rotation = '-1deg' }) {
  const colors = {
    tape: 'bg-[#ede7db]/80 text-[#8c8273]',
    yellow: 'bg-[#fff59d]/80 text-[#a3943b]',
    pink: 'bg-[#ffd1dc]/80 text-[#a8586c]',
    blue: 'bg-[#d0e8ff]/80 text-[#49719c]',
  };

  return (
    <div
      className={`absolute z-10 h-5 w-24 border-l-2 border-r-2 border-dashed border-ink/40 shadow-sm pointer-events-none select-none ${colors[color] || colors.tape} ${className}`}
      style={{
        transform: `rotate(${rotation})`,
        clipPath: 'polygon(0% 0%, 5% 100%, 0% 100%, 95% 100%, 100% 0%, 95% 0%)',
      }}
    >
      <div className="w-full h-full opacity-30 bg-[radial-gradient(#2d2d2d_1px,transparent_1px)] [background-size:4px_4px]" />
    </div>
  );
}

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
