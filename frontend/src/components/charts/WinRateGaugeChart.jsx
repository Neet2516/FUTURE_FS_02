import React from 'react';

export function WinRateGaugeChart({
  winRate = 0,
  wonCount = 0,
  activeCount = 0,
  totalPipeline = 0,
}) {
  const rate = Math.min(Math.max(Number(winRate) || 0, 0), 100);

  // SVG Gauge calculations
  // Semi-circle arc from 180deg (left) to 0deg (right)
  const size = 200;
  const strokeWidth = 18;
  const radius = (size - strokeWidth * 2) / 2;
  const center = size / 2;
  const arcLength = Math.PI * radius; // Half circumference
  const filledLength = (rate / 100) * arcLength;

  // Needle angle (from -180deg to 0deg)
  const needleAngle = -180 + (rate / 100) * 180;

  const getEfficiencyRating = (r) => {
    if (r >= 50) return { text: 'EXEMPLARY VELOCITY', color: 'text-accent' };
    if (r >= 25) return { text: 'HEALTHY CONVERSION', color: 'text-foreground' };
    return { text: 'NASCENT PIPELINE', color: 'text-neutral-500' };
  };

  const rating = getEfficiencyRating(rate);

  return (
    <div className="flex flex-col items-center justify-between p-4 text-center">
      <div className="w-full flex items-center justify-between border-b border-neutral-300 pb-2 mb-2">
        <span className="editorial-label text-neutral-500">
          WIN CONVERSION EFFICIENCY
        </span>
        <span className={`font-data text-[10px] font-bold ${rating.color}`}>
          {rating.text}
        </span>
      </div>

      {/* SVG Semi-Circle Dial */}
      <div className="relative w-48 h-28 overflow-hidden my-2 flex items-end justify-center">
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className="absolute top-0"
        >
          {/* Background track (semi-circle) */}
          <path
            d={`M ${center - radius} ${center} A ${radius} ${radius} 0 0 1 ${center + radius} ${center}`}
            fill="none"
            stroke="#E5E5E0"
            strokeWidth={strokeWidth}
            strokeLinecap="butt"
          />

          {/* Benchmark ticks at 25%, 50%, 75% */}
          {[0.25, 0.5, 0.75].map((tick) => {
            const angle = Math.PI * (1 - tick);
            const x1 = center + (radius - 12) * Math.cos(angle);
            const y1 = center - (radius - 12) * Math.sin(angle);
            const x2 = center + (radius + 12) * Math.cos(angle);
            const y2 = center - (radius + 12) * Math.sin(angle);
            return (
              <line
                key={tick}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="#111111"
                strokeWidth="1.5"
                strokeDasharray="2 1"
              />
            );
          })}

          {/* Active Colored Value Arc */}
          <path
            d={`M ${center - radius} ${center} A ${radius} ${radius} 0 0 1 ${center + radius} ${center}`}
            fill="none"
            stroke="#CC0000"
            strokeWidth={strokeWidth}
            strokeDasharray={`${filledLength} ${arcLength}`}
            strokeLinecap="butt"
            className="transition-all duration-700 ease-out"
          />

          {/* Center Hub */}
          <circle cx={center} cy={center} r="6" fill="#111111" />
        </svg>

        {/* Center Readout Text */}
        <div className="relative z-10 -mb-1 text-center">
          <span className="font-display font-black text-3xl sm:text-4xl text-foreground leading-none tracking-tight block">
            {rate}%
          </span>
          <span className="font-data text-[10px] text-neutral-500 uppercase tracking-widest">
            Confirmed Win Rate
          </span>
        </div>
      </div>

      {/* Benchmark Tick Labels */}
      <div className="w-full flex justify-between px-3 text-[9px] font-data text-neutral-400 -mt-1 mb-3">
        <span>0%</span>
        <span>25%</span>
        <span>50%</span>
        <span>75%</span>
        <span>100%</span>
      </div>

      {/* Sub-Metrics Ledger */}
      <div className="w-full grid grid-cols-2 gap-2 pt-2 border-t border-neutral-300">
        <div className="p-1.5 bg-neutral-100 border border-neutral-300">
          <span className="editorial-label text-neutral-500 text-[9px] block">
            CLOSED WON
          </span>
          <span className="font-data font-bold text-sm text-accent">
            {wonCount} Deals
          </span>
        </div>
        <div className="p-1.5 bg-neutral-100 border border-neutral-300">
          <span className="editorial-label text-neutral-500 text-[9px] block">
            IN PLAY
          </span>
          <span className="font-data font-bold text-sm text-foreground">
            {activeCount} Active
          </span>
        </div>
      </div>
    </div>
  );
}
