import React from 'react';
import { WobblyCard } from '../ui/WobblyCard';

export function StatCard({
  title,
  value,
  subvalue,
  icon: Icon,
  color = 'yellow',
  withTape = true,
  tapeColor = 'tape',
  tapeRotation = '-1.5deg',
}) {
  const iconColors = {
    yellow: 'bg-postit-yellow text-amber-950',
    red: 'bg-rose-100 text-rose-950',
    green: 'bg-emerald-100 text-emerald-950',
    blue: 'bg-blue-100 text-blue-950',
  };

  return (
    <WobblyCard
      withTape={withTape}
      tapeColor={tapeColor}
      tapeRotation={tapeRotation}
      className="p-5"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <span className="font-heading font-bold text-sm uppercase tracking-wide text-ink/70">
            {title}
          </span>
          <h3 className="text-3xl sm:text-4xl font-heading font-bold text-ink mt-1">
            {value}
          </h3>
          {subvalue && (
            <p className="font-body text-sm text-ink/80 mt-1">
              {subvalue}
            </p>
          )}
        </div>

        {Icon && (
          <div
            className={`w-12 h-12 border-2 border-ink wobbly-sm flex items-center justify-center shadow-hard-sm ${iconColors[color] || iconColors.yellow}`}
          >
            <Icon className="w-6 h-6 stroke-[2.2]" />
          </div>
        )}
      </div>
    </WobblyCard>
  );
}
