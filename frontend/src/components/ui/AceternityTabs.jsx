import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function Tabs({
  tabs,
  activeTab,
  onTabChange,
  className = '',
}) {
  return (
    <div className={twMerge('flex flex-wrap items-center gap-2 border-b-2 border-ink pb-2', className)}>
      {tabs.map((tab, idx) => {
        const isActive = activeTab === tab.id;
        const rotations = ['-rotate-1', 'rotate-1', '-rotate-2', 'rotate-0', 'rotate-2'];
        const rot = rotations[idx % rotations.length];

        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onTabChange(tab.id)}
            className={twMerge(
              'relative px-4 py-2 text-base font-heading font-bold select-none border-2 border-ink transition-all duration-150',
              isActive
                ? 'bg-postit-yellow text-ink shadow-hard -translate-y-1 z-10 wobbly'
                : 'bg-paper text-ink/70 hover:text-ink hover:bg-muted-paper/50 shadow-hard-sm wobbly-sm',
              isActive ? rot : ''
            )}
          >
            <div className="flex items-center gap-2">
              {tab.icon && <span className="w-4 h-4">{tab.icon}</span>}
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span
                  className={twMerge(
                    'text-xs px-1.5 py-0.2 rounded-full border border-ink font-body',
                    isActive ? 'bg-ink text-paper' : 'bg-muted-paper text-ink'
                  )}
                >
                  {tab.count}
                </span>
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
}
