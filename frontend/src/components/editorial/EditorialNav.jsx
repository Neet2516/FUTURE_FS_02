import React from 'react';
import { clsx } from 'clsx';
import { Menu, X, Plus, LayoutDashboard, TrendingUp, Users, CheckSquare, Radio, Settings } from 'lucide-react';

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Front Page', shortLabel: 'Desk', Icon: LayoutDashboard },
  { id: 'pipeline', label: 'Pipeline', shortLabel: 'Pipeline', Icon: TrendingUp },
  { id: 'contacts', label: 'Directory', shortLabel: 'Directory', Icon: Users },
  { id: 'tasks', label: 'Task Ledger', shortLabel: 'Tasks', Icon: CheckSquare },
  { id: 'activity', label: 'Wire', shortLabel: 'Wire', Icon: Radio },
  { id: 'settings', label: 'Masthead', shortLabel: 'Settings', Icon: Settings },
];

export function EditorialNav({ currentTab, onSelectTab, onQuickAdd, pendingTaskCount = 0 }) {
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
                  'h-full px-4 font-ui text-xs font-bold uppercase tracking-[0.12em] transition-colors duration-150 border-b-2 flex items-center gap-1.5 relative',
                  currentTab === item.id
                    ? 'text-newsprint border-accent'
                    : 'text-neutral-400 border-transparent hover:text-newsprint hover:border-neutral-500'
                )}
              >
                {item.label}
                {item.id === 'tasks' && pendingTaskCount > 0 && (
                  <span className="absolute top-1.5 right-2 w-1.5 h-1.5 bg-accent" />
                )}
              </button>
              {idx < NAV_ITEMS.length - 1 && (
                <span className="text-neutral-700 text-xs select-none">·</span>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Desktop Quick Add */}
        <button
          type="button"
          onClick={onQuickAdd}
          className="hidden md:flex items-center gap-1.5 px-3 py-1.5 bg-accent text-newsprint font-ui text-[0.625rem] font-bold uppercase tracking-[0.12em] border border-accent hover:bg-newsprint hover:text-accent transition-colors"
        >
          <Plus className="w-3 h-3" />
          <span>File Report</span>
        </button>

        {/* Mobile: Quick add + hamburger */}
        <div className="md:hidden flex items-center gap-2">
          {pendingTaskCount > 0 && (
            <span className="font-data text-[10px] text-accent font-bold">
              {pendingTaskCount} pending
            </span>
          )}
          <button
            type="button"
            onClick={onQuickAdd}
            className="flex items-center gap-1 px-3 py-1.5 bg-accent text-newsprint font-ui text-[0.625rem] font-bold uppercase tracking-wider"
          >
            <Plus className="w-3 h-3" />
          </button>
          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-2 text-newsprint"
            aria-label="Toggle navigation"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-neutral-700 bg-foreground">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => handleSelect(item.id)}
              className={clsx(
                'w-full text-left px-6 py-3.5 font-ui text-sm font-bold uppercase tracking-wider border-b border-neutral-800 transition-colors flex items-center justify-between',
                currentTab === item.id
                  ? 'text-newsprint bg-neutral-800 border-l-4 border-l-accent pl-5'
                  : 'text-neutral-400 hover:text-newsprint hover:bg-neutral-800'
              )}
            >
              <div className="flex items-center gap-3">
                <item.Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </div>
              {item.id === 'tasks' && pendingTaskCount > 0 && (
                <span className="font-data text-[11px] text-accent font-bold">
                  {pendingTaskCount} open
                </span>
              )}
            </button>
          ))}
        </div>
      )}
    </nav>
  );
}
