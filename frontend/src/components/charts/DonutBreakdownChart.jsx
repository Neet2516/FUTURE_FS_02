import React, { useState } from 'react';
import { formatCurrency } from '../../utils/format';

export function DonutBreakdownChart({
  data = [],
  title = 'Portfolio Distribution',
  subtitle = 'Monetary exposure by pipeline stage',
}) {
  const [hoveredIdx, setHoveredIdx] = useState(null);

  // Filter out zero-value items
  const validItems = data.filter((item) => (item.value || 0) > 0);
  const totalValue = validItems.reduce((acc, curr) => acc + curr.value, 0);

  // Editorial broadside ink palette
  const PALETTE = [
    '#CC0000', // Crimson Accent (Won / Top)
    '#111111', // Deep Black
    '#3B3B3B', // Charcoal
    '#5C5C5C', // Slate
    '#7D7D7D', // Neutral Gray
    '#9E9E9E', // Light Gray
    '#BDBDBD', // Whisper Gray
  ];

  if (totalValue === 0) {
    return (
      <div className="p-8 text-center border border-dashed border-neutral-300">
        <p className="font-body italic text-neutral-500 text-sm">
          No monetary deals recorded yet to render portfolio donut.
        </p>
      </div>
    );
  }

  // SVG Geometry
  const size = 260;
  const strokeWidth = 32;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  // Compute slice offsets
  let accumulatedPercent = 0;
  const slices = validItems.map((item, idx) => {
    const percent = item.value / totalValue;
    const strokeDasharray = `${percent * circumference} ${circumference}`;
    const strokeDashoffset = -accumulatedPercent * circumference;
    accumulatedPercent += percent;

    return {
      ...item,
      color: item.stage === 'Won' ? '#CC0000' : PALETTE[(idx + 1) % PALETTE.length],
      percent,
      strokeDasharray,
      strokeDashoffset,
    };
  });

  const activeItem = hoveredIdx !== null ? slices[hoveredIdx] : null;

  return (
    <div className="flex flex-col md:flex-row items-center justify-between gap-6 p-4">
      {/* Donut Graphic */}
      <div className="relative flex-shrink-0 flex items-center justify-center">
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className="transform -rotate-90"
        >
          {/* Background circle track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="transparent"
            stroke="#E5E5E0"
            strokeWidth={strokeWidth}
          />

          {/* Slices */}
          {slices.map((slice, idx) => {
            const isHovered = hoveredIdx === idx;
            return (
              <circle
                key={slice.stage || idx}
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="transparent"
                stroke={slice.color}
                strokeWidth={isHovered ? strokeWidth + 6 : strokeWidth}
                strokeDasharray={slice.strokeDasharray}
                strokeDashoffset={slice.strokeDashoffset}
                strokeLinecap="butt"
                className="transition-all duration-200 cursor-pointer"
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
              />
            );
          })}
        </svg>

        {/* Center Editorial Text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none px-4">
          <span className="editorial-label text-neutral-400 text-[9px] block">
            {activeItem ? activeItem.stage : 'TOTAL EXPOSURE'}
          </span>
          <span className="font-display font-black text-lg sm:text-xl text-foreground leading-tight tracking-tight mt-0.5">
            {activeItem ? formatCurrency(activeItem.value) : formatCurrency(totalValue)}
          </span>
          <span className="font-data text-[11px] text-neutral-500 mt-0.5">
            {activeItem
              ? `${Math.round(activeItem.percent * 100)}% of pipeline (${activeItem.count} ${activeItem.count === 1 ? 'deal' : 'deals'})`
              : `${validItems.length} active stages`}
          </span>
        </div>
      </div>

      {/* Editorial Legend */}
      <div className="flex-1 w-full max-w-xs space-y-2 border-l-0 md:border-l border-neutral-300 md:pl-6">
        <span className="editorial-label text-neutral-500 block mb-2">
          STAGE CONCENTRATION
        </span>
        <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
          {slices.map((slice, idx) => {
            const isHovered = hoveredIdx === idx;
            return (
              <div
                key={slice.stage}
                className={`flex items-center justify-between text-xs p-1.5 cursor-pointer transition-colors border ${
                  isHovered
                    ? 'border-foreground bg-neutral-100 font-bold'
                    : 'border-transparent hover:bg-neutral-50'
                }`}
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span
                    className="w-2.5 h-2.5 flex-shrink-0"
                    style={{ backgroundColor: slice.color }}
                  />
                  <span className="font-ui text-foreground truncate">
                    {slice.stage}
                  </span>
                </div>
                <div className="flex items-center gap-2 pl-2">
                  <span className="font-data text-neutral-500 text-[11px]">
                    {Math.round(slice.percent * 100)}%
                  </span>
                  <span className="font-data font-bold text-foreground">
                    {formatCurrency(slice.value)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
