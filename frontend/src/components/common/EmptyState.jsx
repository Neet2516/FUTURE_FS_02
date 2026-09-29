import React from 'react';
import { EditorialButton } from '../editorial/EditorialButton';

export function EmptyState({ title, description, actionLabel, onAction, icon }) {
  return (
    <div className="border-2 border-dashed border-neutral-300 py-16 px-8 text-center">
      {icon && <div className="text-4xl mb-4 grayscale opacity-60">{icon}</div>}
      <h4 className="font-display text-xl font-bold text-foreground mb-2">
        {title}
      </h4>
      <p className="font-body text-sm text-neutral-500 max-w-md mx-auto mb-6">
        {description}
      </p>
      {actionLabel && onAction && (
        <EditorialButton variant="secondary" onClick={onAction}>
          {actionLabel}
        </EditorialButton>
      )}
    </div>
  );
}
