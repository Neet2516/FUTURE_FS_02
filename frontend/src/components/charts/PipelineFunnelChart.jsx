import React, { useState } from 'react';
import { formatCurrency } from '../../utils/format';

export function PipelineFunnelChart({ data = [] }) {
  const [hoveredStage, setHoveredStage] = useState(null);

  // Standard funnel order
  const STAGE_ORDER = ['Lead', 'Qualified', 'Proposal', 'Negotiation', 'Won'];

  // Map incoming data to canonical funnel order, filtering out Lost or placing it at the end
  const stages = STAGE_ORDER.map((stageName) => {
    const found = data.find((d) => d.stage.toLowerCase() === stageName.toLowerCase());
    return {
      stage: stageName,
      count: found ? found.count : 0,
      value: found ? found.value : 0,
    };
  });

  const maxCount = Math.max(...stages.map((s) => s.count), 1);
  const totalValue = stages.reduce((acc, s) => acc + s.value, 0);

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between border-b border-neutral-300 pb-2">
        <span className="editorial-label text-neutral-500">
          CONVERSION FUNNEL (LEAD → WON)
        </span>
        <span className="font-data text-xs text-neutral-600">
          Cumulative Volume: {stages.reduce((acc, s) => acc + s.count, 0)} Opportunities
        </span>
      </div>

      <div className="space-y-3 pt-2">
        {stages.map((stage, idx) => {
          const widthPct = Math.max(
            Math.round((stage.count / maxCount) * 100),
            stage.count > 0 ? 18 : 6
          );
          const isWon = stage.stage === 'Won';
          const isHovered = hoveredStage === stage.stage;
          const avgDeal = stage.count > 0 ? stage.value / stage.count : 0;

          // Conversion rate from previous stage
          const prevStage = idx > 0 ? stages[idx - 1] : null;
          const conversionRate =
            prevStage && prevStage.count > 0
              ? Math.round((stage.count / prevStage.count) * 100)
              : null;

          return (
            <div key={stage.stage} className="relative group">
              {/* Conversion Drop-off Tag Between Stages */}
              {conversionRate !== null && (
                <div className="flex items-center gap-2 pl-4 py-0.5 text-[10px] font-data text-neutral-500">
                  <span className="text-neutral-400">│</span>
                  <span className="bg-neutral-200 px-1.5 py-0.2 border border-neutral-300">
                    ↓ {conversionRate}% conversion velocity
                  </span>
                </div>
              )}

              {/* Funnel Stage Row */}
              <div
                className={`p-3 border transition-all duration-150 cursor-pointer ${
                  isHovered
                    ? 'border-foreground bg-neutral-100 shadow-hard-sm -translate-y-0.5'
                    : isWon
                    ? 'border-accent/40 bg-red-50/20'
                    : 'border-neutral-300 bg-newsprint hover:border-foreground'
                }`}
                onMouseEnter={() => setHoveredStage(stage.stage)}
                onMouseLeave={() => setHoveredStage(null)}
              >
                <div className="flex items-center justify-between text-xs mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-data text-neutral-400 font-bold">
                      0{idx + 1}
                    </span>
                    <span className="font-display font-black text-sm text-foreground uppercase tracking-tight">
                      {stage.stage}
                    </span>
                    <span
                      className={`px-1.5 py-0.5 text-[10px] font-data font-bold border ${
                        isWon
                          ? 'border-accent text-accent bg-accent/5'
                          : 'border-neutral-400 text-neutral-700 bg-neutral-100'
                      }`}
                    >
                      {stage.count} {stage.count === 1 ? 'deal' : 'deals'}
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="font-data font-bold text-foreground block text-sm">
                      {formatCurrency(stage.value)}
                    </span>
                    {stage.count > 0 && (
                      <span className="font-data text-[10px] text-neutral-500">
                        avg: {formatCurrency(avgDeal)}
                      </span>
                    )}
                  </div>
                </div>

                {/* Geometric Funnel Bar */}
                <div className="relative h-4 bg-neutral-200 border border-foreground/20 overflow-hidden">
                  <div
                    className={`h-full transition-all duration-500 ${
                      isWon
                        ? 'bg-accent'
                        : isHovered
                        ? 'bg-foreground'
                        : 'bg-neutral-800'
                    }`}
                    style={{ width: `${widthPct}%` }}
                  />
                  {/* Subtle hatching overlay for broadside print look */}
                  <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:4px_4px]" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
