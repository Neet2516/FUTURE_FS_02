import React, { useState } from 'react';
import { formatCurrency } from '../../utils/format';

export function DealVelocityBarChart({ data = [] }) {
  const [hoveredIdx, setHoveredIdx] = useState(null);

  const validItems = data.filter((item) => (item.value || 0) > 0 || (item.count || 0) > 0);
  const maxValue = Math.max(...validItems.map((d) => d.value || 0), 1000);
  const totalValue = validItems.reduce((acc, d) => acc + (d.value || 0), 0);

  // SVG dimensions
  const height = 220;
  const paddingBottom = 40;
  const paddingTop = 25;
  const plotHeight = height - paddingBottom - paddingTop;

  return (
    <div className="p-4 space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-neutral-300 pb-2">
        <div>
          <span className="editorial-label text-neutral-500 block">
            STAGE CAPITAL EXPOSURE GRAPH
          </span>
          <span className="font-body text-xs text-neutral-600">
            Comparative capital allocation across pipeline milestones
          </span>
        </div>
        <div className="text-right">
          <span className="font-data text-xs font-bold text-foreground">
            Peak: {formatCurrency(maxValue)}
          </span>
        </div>
      </div>

      {/* SVG Column Chart */}
      <div className="relative">
        <svg
          viewBox={`0 0 500 ${height}`}
          className="w-full h-56 select-none overflow-visible"
        >
          {/* Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
            const y = paddingTop + plotHeight * (1 - ratio);
            const val = maxValue * ratio;
            return (
              <g key={ratio}>
                <line
                  x1="0"
                  y1={y}
                  x2="500"
                  y2={y}
                  stroke="#E5E5E0"
                  strokeWidth="1"
                  strokeDasharray={ratio === 0 ? 'none' : '3 3'}
                />
                <text
                  x="4"
                  y={y - 4}
                  fill="#888888"
                  fontSize="9"
                  fontFamily="JetBrains Mono, monospace"
                >
                  {val >= 1000 ? `$${Math.round(val / 1000)}k` : `$${Math.round(val)}`}
                </text>
              </g>
            );
          })}

          {/* Columns */}
          {validItems.map((item, idx) => {
            const barWidth = Math.min(380 / validItems.length - 12, 42);
            const x =
              40 +
              idx * ((500 - 80) / validItems.length) +
              ((500 - 80) / validItems.length - barWidth) / 2;
            const barHeight = Math.max((item.value / maxValue) * plotHeight, 4);
            const y = paddingTop + plotHeight - barHeight;
            const isWon = item.stage === 'Won';
            const isHovered = hoveredIdx === idx;

            return (
              <g
                key={item.stage}
                className="cursor-pointer transition-all duration-150"
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
              >
                {/* Background hover column highlight */}
                {isHovered && (
                  <rect
                    x={x - 6}
                    y={paddingTop}
                    width={barWidth + 12}
                    height={plotHeight}
                    fill="rgba(0,0,0,0.03)"
                  />
                )}

                {/* The Bar */}
                <rect
                  x={x}
                  y={y}
                  width={barWidth}
                  height={barHeight}
                  fill={isWon ? '#CC0000' : isHovered ? '#111111' : '#2D2D2D'}
                  stroke="#111111"
                  strokeWidth="1"
                />

                {/* Deal Count Pip on top of bar */}
                <rect
                  x={x}
                  y={y - 12}
                  width={barWidth}
                  height="10"
                  fill="#F9F9F7"
                  stroke="#111111"
                  strokeWidth="0.8"
                />
                <text
                  x={x + barWidth / 2}
                  y={y - 4}
                  textAnchor="middle"
                  fill="#111111"
                  fontSize="7.5"
                  fontWeight="bold"
                  fontFamily="JetBrains Mono, monospace"
                >
                  {item.count}d
                </text>

                {/* Stage Label on X Axis */}
                <text
                  x={x + barWidth / 2}
                  y={height - 20}
                  textAnchor="middle"
                  fill={isHovered ? '#111111' : '#666666'}
                  fontSize="9.5"
                  fontWeight={isHovered ? 'bold' : 'normal'}
                  fontFamily="Inter, sans-serif"
                >
                  {item.stage.length > 8 ? `${item.stage.slice(0, 7)}.` : item.stage}
                </text>

                {/* Amount on X Axis */}
                <text
                  x={x + barWidth / 2}
                  y={height - 8}
                  textAnchor="middle"
                  fill={isHovered ? '#CC0000' : '#888888'}
                  fontSize="8"
                  fontFamily="JetBrains Mono, monospace"
                >
                  {item.value >= 1000 ? `$${Math.round(item.value / 1000)}k` : `$${item.value}`}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Hover Tooltip Card */}
        {hoveredIdx !== null && validItems[hoveredIdx] && (
          <div className="absolute top-2 right-2 bg-[#FDFCF7] border-2 border-foreground p-3 shadow-hard-sm animate-soft-fade-in pointer-events-none z-10">
            <span className="editorial-label text-neutral-500 text-[9px] block">
              STAGE SUMMARY
            </span>
            <p className="font-display font-black text-base text-foreground">
              {validItems[hoveredIdx].stage}
            </p>
            <div className="mt-1 space-y-0.5 font-data text-xs text-neutral-700">
              <div>
                Value:{' '}
                <strong className="text-foreground">
                  {formatCurrency(validItems[hoveredIdx].value)}
                </strong>
              </div>
              <div>
                Volume:{' '}
                <strong>
                  {validItems[hoveredIdx].count}{' '}
                  {validItems[hoveredIdx].count === 1 ? 'deal' : 'deals'}
                </strong>
              </div>
              {totalValue > 0 && (
                <div className="text-[10px] text-neutral-500 pt-1 border-t border-neutral-300">
                  {Math.round((validItems[hoveredIdx].value / totalValue) * 100)}% of total pipeline
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
