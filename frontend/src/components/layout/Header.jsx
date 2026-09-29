import React from 'react';
import { Menu, Plus, UserCheck, Search, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { WobblyButton } from '../ui/WobblyButton';
import { ScribbleUnderline } from '../ui/SketchAnnotation';

export function Header({ title, onToggleMobile, onQuickAdd }) {
  const { user, demoUsers, switchDemoUser } = useAuth();

  return (
    <header className="sticky top-0 z-30 bg-[#fdfbf7]/90 backdrop-blur-md border-b-2 border-ink px-4 sm:px-8 py-3.5 flex items-center justify-between">
      {/* Left: Mobile Toggle & Page Title */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onToggleMobile}
          className="lg:hidden p-2 border-2 border-ink wobbly-sm bg-postit-yellow shadow-hard-sm"
          aria-label="Toggle menu"
        >
          <Menu className="w-5 h-5 text-ink" />
        </button>

        <div className="relative">
          <h2 className="text-2xl sm:text-3xl font-heading font-bold text-ink">
            {title}
          </h2>
          <ScribbleUnderline className="absolute -bottom-2 left-0 w-32" color="#ff4d4d" />
        </div>
      </div>

      {/* Right: Quick Add & Demo Account Switch */}
      <div className="flex items-center gap-3">
        {/* Quick Demo Switcher */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-[#f5f1e8] border-2 border-ink wobbly-sm shadow-hard-sm text-sm">
          <UserCheck className="w-4 h-4 text-secondary-blue" />
          <span className="font-heading font-bold text-xs uppercase text-ink/70">Rep:</span>
          <select
            value={user.id}
            onChange={(e) => switchDemoUser(e.target.value)}
            className="bg-transparent font-heading font-bold text-ink text-sm cursor-pointer outline-none"
          >
            {demoUsers.map((u) => (
              <option key={u.id} value={u.id}>
                {u.name} ({u.role.split(' ')[0]})
              </option>
            ))}
          </select>
        </div>

        {/* Quick Add CTA */}
        <WobblyButton
          variant="primary"
          size="sm"
          onClick={onQuickAdd}
          className="font-heading"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span className="hidden sm:inline">Add Entry</span>
        </WobblyButton>
      </div>
    </header>
  );
}
