import React from 'react';

export function LoadingState({ message = 'Loading...' }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="mb-4 flex items-center gap-2">
        <div className="w-2 h-2 bg-foreground animate-pulse" />
        <div className="w-2 h-2 bg-foreground animate-pulse" style={{ animationDelay: '0.2s' }} />
        <div className="w-2 h-2 bg-foreground animate-pulse" style={{ animationDelay: '0.4s' }} />
      </div>
      <span className="editorial-label text-neutral-400">{message}</span>
    </div>
  );
}
