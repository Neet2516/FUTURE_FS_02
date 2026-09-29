import React from 'react';
import { Pencil } from 'lucide-react';

export function LoadingState({ message = 'Sketching CRM data from Rust Axum...' }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
      <div className="relative mb-5">
        <div className="w-16 h-16 border-3 border-ink wobbly bg-postit-yellow flex items-center justify-center shadow-hard animate-bounce">
          <Pencil className="w-8 h-8 text-ink rotate-45" />
        </div>
        <div className="absolute -bottom-2 -right-2 w-6 h-6 border-2 border-ink rounded-full bg-accent-red animate-ping opacity-75" />
      </div>
      <h4 className="text-2xl font-heading font-bold text-ink">
        {message}
      </h4>
      <p className="text-sm font-body text-ink/70 mt-1">
        Flipping pages in the sketchbook...
      </p>
    </div>
  );
}
