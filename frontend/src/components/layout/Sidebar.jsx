import React, { useEffect, useState } from 'react';
import {
  LayoutDashboard,
  Kanban,
  Users,
  CheckSquare,
  History,
  Settings,
  Sparkles,
  Cpu,
  ChevronRight,
  PlusCircle,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';

export function Sidebar({ currentTab, onSelectTab, isMobileOpen, setIsMobileOpen, onQuickAdd }) {
  const { user } = useAuth();
  const [backendHealth, setBackendHealth] = useState({ online: false, checking: true });

  useEffect(() => {
    fetch('/health')
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data && data.status === 'healthy') {
          setBackendHealth({ online: true, checking: false });
        } else {
          setBackendHealth({ online: false, checking: false });
        }
      })
      .catch(() => setBackendHealth({ online: false, checking: false }));
  }, []);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, badge: null },
    { id: 'pipeline', label: 'Pipeline Kanban', icon: Kanban, badge: 'Deals' },
    { id: 'contacts', label: 'Contacts & Leads', icon: Users, badge: null },
    { id: 'tasks', label: 'Sticky Notes / Tasks', icon: CheckSquare, badge: 'To-do' },
    { id: 'activity', label: 'Activity Audit Log', icon: History, badge: null },
    { id: 'settings', label: 'Settings & Theme', icon: Settings, badge: null },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-ink/40 backdrop-blur-sm lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-72 bg-[#fdfbf7] border-r-3 border-ink flex flex-col justify-between transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Spiral Notebook Ring Decorations */}
        <div className="absolute top-4 bottom-4 -right-3 flex flex-col justify-between pointer-events-none select-none z-50">
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="w-5 h-2.5 bg-[#d3cdc4] border-2 border-ink rounded-full shadow-[1px_1px_0px_#2d2d2d] -rotate-6"
            />
          ))}
        </div>

        <div>
          {/* Brand Header */}
          <div className="p-6 border-b-2 border-dashed border-ink/30">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-postit-yellow border-2 border-ink wobbly flex items-center justify-center text-2xl shadow-hard-sm -rotate-3">
                📝
              </div>
              <div>
                <h1 className="font-heading font-bold text-2xl tracking-tight text-ink flex items-center gap-1.5">
                  PaperCRM
                  <span className="text-xs px-2 py-0.5 bg-accent-red text-white wobbly-badge font-heading">
                    v1.0
                  </span>
                </h1>
                <p className="text-xs text-ink/70 font-body">Hand-Drawn • Rust + React</p>
              </div>
            </div>
          </div>

          {/* Quick Action Button */}
          <div className="p-4 px-5">
            <button
              type="button"
              onClick={onQuickAdd}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-accent-red text-white font-heading font-bold text-base border-2 border-ink wobbly shadow-hard hover:shadow-hard-lg hover:-translate-y-0.5 active:translate-y-0.5 active:shadow-hard-sm transition-all"
            >
              <PlusCircle className="w-5 h-5 stroke-[2.5]" />
              <span>+ Quick Add Note/Deal</span>
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1.5">
            {navItems.map((item, index) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              const rotations = ['rotate-[0.5deg]', '-rotate-[0.5deg]', 'rotate-0', '-rotate-[1deg]', 'rotate-[1deg]'];
              const rot = rotations[index % rotations.length];

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    onSelectTab(item.id);
                    setIsMobileOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 border-2 transition-all font-heading font-bold text-lg select-none ${
                    isActive
                      ? `bg-postit-yellow text-ink border-ink wobbly shadow-hard ${rot} translate-x-1`
                      : 'bg-transparent text-ink/80 border-transparent hover:border-ink/60 hover:bg-muted-paper/40 hover:shadow-hard-sm wobbly-sm'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-5 h-5 ${isActive ? 'text-ink stroke-[2.5]' : 'text-ink/70'}`} />
                    <span>{item.label}</span>
                  </div>

                  {item.badge && (
                    <span className="text-[11px] uppercase font-bold tracking-wider px-2 py-0.5 bg-paper border border-ink wobbly-badge">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer: User & Rust Status */}
        <div className="p-5 border-t-2 border-dashed border-ink/30 space-y-3">
          {/* Rust Status Indicator */}
          <div className="flex items-center justify-between text-xs px-3 py-1.5 bg-[#f5f1e8] border border-ink wobbly-sm font-heading">
            <div className="flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-secondary-blue" />
              <span className="font-bold">Rust Axum Engine</span>
            </div>
            <div className="flex items-center gap-1">
              <span className={`w-2 h-2 rounded-full ${backendHealth.online ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
              <span className="font-mono text-[10px]">{backendHealth.online ? 'PORT 8080' : 'CHECKING'}</span>
            </div>
          </div>

          {/* Current User Card */}
          <div className="flex items-center gap-3 p-2 bg-paper border-2 border-ink wobbly-sm shadow-hard-sm">
            <div
              className="w-10 h-10 border-2 border-ink rounded-full flex items-center justify-center font-heading font-bold text-lg shadow-inner"
              style={{ backgroundColor: user.avatarColor || '#fff9c4' }}
            >
              {user.name ? user.name.charAt(0) : 'U'}
            </div>
            <div className="overflow-hidden">
              <p className="font-heading font-bold text-sm text-ink truncate leading-tight">
                {user.name}
              </p>
              <p className="text-xs text-ink/70 font-body truncate">
                {user.role}
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
