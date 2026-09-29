import React from 'react';
import { clsx } from 'clsx';
import { Menu, X, Plus } from 'lucide-react';

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Front Page' },
  { id: 'pipeline', label: 'Pipeline' },
  { id: 'contacts', label: 'Directory' },
  { id: 'tasks', label: 'Dossiers' },
  { id: 'activity', label: 'Wire' },
  { id: 'settings', label: 'Masthead' },
];

export function EditorialNav({ currentTab, onSelectTab, onQuickAdd }) {
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleSelect = (id) => {
    onSelectTab(id);
    setMobileOpen(false);
  };

  return (
    <nav className="bg-foreground text-newsprint sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 flex items-center justify-between h-11">
        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-0 h-full">
          {NAV_ITEMS.map((item, idx) => (
            <React.Fragment key={item.id}>
              <button
                type="button"
                onClick={() => handleSelect(item.id)}
                className={clsx(
                  'h-full px-4 font-ui text-xs font-bold uppercase tracking-[0.12em] transition-colors duration-150 border-b-2',
                  currentTab === item.id
                    ? 'text-newsprint border-accent'
                    : 'text-neutral-400 border-transparent hover:text-newsprint hover:border-neutral-500'
                )}
              >
                {item.label}
              </button>
              {idx < NAV_ITEMS.length - 1 && (
                <span className="text-neutral-700 text-xs select-none">·</span>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Quick Add */}
        <button
          type="button"
          onClick={onQuickAdd}
          className="hidden md:flex items-center gap-1.5 px-3 py-1.5 bg-accent text-newsprint font-ui text-[0.625rem] font-bold uppercase tracking-[0.12em] border border-accent hover:bg-newsprint hover:text-accent transition-colors"
        >
          <Plus className="w-3 h-3" />
          <span>File Report</span>
        </button>

        {/* Mobile menu toggle */}
        <button
          type="button"
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden p-2 text-newsprint"
          aria-label="Toggle navigation"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>

        {/* Mobile quick add */}
        <button
          type="button"
          onClick={onQuickAdd}
          className="md:hidden flex items-center gap-1 px-3 py-1.5 bg-accent text-newsprint font-ui text-[0.625rem] font-bold uppercase tracking-wider"
        >
          <Plus className="w-3 h-3" />
        </button>
      </div>

      {/* Mobile dropdown */}
      {mobileOpen && (
        <div className="md:hidden border-t border-neutral-700 bg-foreground">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => handleSelect(item.id)}
              className={clsx(
                'w-full text-left px-6 py-3 font-ui text-sm font-bold uppercase tracking-wider border-b border-neutral-800 transition-colors',
                currentTab === item.id
                  ? 'text-newsprint bg-neutral-800 border-l-4 border-l-accent'
                  : 'text-neutral-400 hover:text-newsprint hover:bg-neutral-800'
              )}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </nav>
  );
}
