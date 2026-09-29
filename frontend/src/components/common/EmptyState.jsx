import React from 'react';
import { WobblyButton } from '../ui/WobblyButton';
import { Plus } from 'lucide-react';

export function EmptyState({
  title = 'Blank Page in the Sketchbook',
  description = 'No records found matching your filters. Scribble a new entry to get started!',
  actionLabel = 'Add New Entry',
  onAction,
  icon = '📋',
}) {
  return (
    <div className="relative border-3 border-dashed border-ink/40 wobbly p-12 text-center bg-paper/60 my-6 max-w-lg mx-auto shadow-hard-sm">
      <div className="text-5xl mb-4 select-none -rotate-6">
        {icon}
      </div>
      <h4 className="text-2xl font-heading font-bold text-ink mb-2">
        {title}
      </h4>
      <p className="text-base font-body text-ink/70 mb-6 max-w-sm mx-auto">
        {description}
      </p>
      {onAction && (
        <WobblyButton variant="primary" onClick={onAction}>
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>{actionLabel}</span>
        </WobblyButton>
      )}
    </div>
  );
}
