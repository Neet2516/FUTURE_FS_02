import React from 'react';
import { EditorialButton } from '../components/editorial/EditorialButton';
import { EditorialBadge } from '../components/editorial/EditorialBadge';
import { SectionHeader } from '../components/editorial/SectionHeader';
import { useToast } from '../components/common/Toast';
import { LogOut, User, Mail, Briefcase, Shield, Cpu, Database, Layers } from 'lucide-react';

export function SettingsPage({ user, onLogout }) {
  const toast = useToast();

  const handleLogout = () => {
    toast.info('Session terminated. Signing out...');
    setTimeout(onLogout, 800);
  };

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Title Header */}
      <div className="border-2 border-foreground bg-newsprint p-6 shadow-hard flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <span className="font-data text-xs text-neutral-500 uppercase tracking-widest">
              SECTION 06 • MASTHEAD PREFERENCES
            </span>
            <EditorialBadge variant="dark" size="xs">Config V1.0</EditorialBadge>
          </div>
          <h2 className="font-display text-3xl font-bold text-foreground">
            Editorial Settings & System Dossier
          </h2>
          <p className="font-body text-sm text-neutral-600">
            Staff credentials, engine diagnostics & typography tokens
          </p>
        </div>

        <EditorialButton variant="secondary" size="md" onClick={handleLogout}>
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </EditorialButton>
      </div>

      {/* 1. Active Session Profile */}
      <div className="border-2 border-foreground bg-newsprint p-6 shadow-hard">
        <SectionHeader
          number={1}
          title="Active Session Profile"
          subtitle="Currently authenticated staff correspondent"
        />

        {user && (
          <div className="mt-4 border border-foreground bg-neutral-100/50 p-5 flex flex-col sm:flex-row items-start sm:items-center gap-5">
            {/* Avatar */}
            <div className="w-16 h-16 border-2 border-foreground bg-foreground text-newsprint flex items-center justify-center font-display font-bold text-2xl sharp-corners flex-shrink-0">
              {(user.name || user.email || 'U').charAt(0).toUpperCase()}
            </div>

            {/* Info */}
            <div className="flex-1 space-y-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <span className="editorial-label text-neutral-500 block mb-0.5 flex items-center gap-1">
                    <User className="w-3 h-3" /> FULL NAME
                  </span>
                  <p className="font-display text-lg font-bold text-foreground">{user.name || '—'}</p>
                </div>
                <div>
                  <span className="editorial-label text-neutral-500 block mb-0.5 flex items-center gap-1">
                    <Mail className="w-3 h-3" /> EMAIL
                  </span>
                  <p className="font-data text-sm text-foreground">{user.email || '—'}</p>
                </div>
                <div>
                  <span className="editorial-label text-neutral-500 block mb-0.5 flex items-center gap-1">
                    <Briefcase className="w-3 h-3" /> ROLE
                  </span>
                  <p className="font-ui text-sm font-semibold text-foreground uppercase tracking-wider">
                    {user.role || '—'}
                  </p>
                </div>
                <div>
                  <span className="editorial-label text-neutral-500 block mb-0.5 flex items-center gap-1">
                    <Shield className="w-3 h-3" /> STAFF ID
                  </span>
                  <p className="font-data text-xs text-neutral-500">{user.id || '—'}</p>
                </div>
              </div>
            </div>

            <EditorialBadge variant="accent" size="sm">Active Session</EditorialBadge>
          </div>
        )}
      </div>

      {/* 2. System Architecture */}
      <div className="border-2 border-foreground bg-newsprint p-6 shadow-hard space-y-4">
        <SectionHeader
          number={2}
          title="System Architecture Diagnostics"
          subtitle="Real-time status of backend services, async runtime, and datastore engines"
        />

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            {
              Icon: Cpu,
              label: 'BACKEND RUNTIME',
              name: 'Rust 1.80+ (Axum)',
              desc: 'Multi-threaded Tokio async engine with zero-allocation JSON serialization',
            },
            {
              Icon: Database,
              label: 'DATASTORE ENGINE',
              name: 'PostgreSQL / SQLx',
              desc: 'Connection-pooled relational store with declarative migrations and automated seed',
            },
            {
              Icon: Layers,
              label: 'FRONTEND INTERFACE',
              name: 'React 18 + Vite',
              desc: 'Newsprint Editorial design system with Tailwind CSS & zero border-radius enforcement',
            },
          ].map(({ Icon, label, name, desc }) => (
            <div key={label} className="p-4 border border-foreground bg-neutral-100 sharp-corners">
              <div className="flex items-center gap-2 mb-2">
                <Icon className="w-4 h-4 text-foreground" />
                <span className="editorial-label text-neutral-500">{label}</span>
              </div>
              <p className="font-display text-xl font-bold text-foreground">{name}</p>
              <p className="font-body text-xs text-neutral-600 mt-1">{desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Typography */}
      <div className="border-2 border-foreground bg-newsprint p-6 shadow-hard space-y-4">
        <SectionHeader
          number={3}
          title="Newsprint Editorial Design Tokens"
          subtitle="Official style guide and chromatic tokens for the editorial system"
        />

        <div className="space-y-6">
          {/* Colors */}
          <div>
            <span className="font-ui text-xs font-bold uppercase tracking-wider text-foreground block mb-2">
              Chromatic Palette (95% Neutral / 5% Red Accent)
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { name: 'Newsprint Paper', hex: '#F9F9F7', bg: 'bg-[#F9F9F7]', text: 'text-foreground', border: 'border-foreground' },
                { name: 'Ink Foreground', hex: '#111111', bg: 'bg-[#111111]', text: 'text-newsprint', border: 'border-foreground' },
                { name: 'Editorial Accent', hex: '#CC0000', bg: 'bg-[#CC0000]', text: 'text-newsprint', border: 'border-[#CC0000]' },
                { name: 'Muted Divider', hex: '#E5E5E0', bg: 'bg-[#E5E5E0]', text: 'text-foreground', border: 'border-foreground' },
              ].map((c) => (
                <div key={c.name} className={`p-3 border-2 ${c.border} ${c.bg} ${c.text} sharp-corners flex flex-col justify-between h-20 shadow-hard-sm`}>
                  <span className="font-ui text-[11px] font-bold uppercase tracking-wider">{c.name}</span>
                  <span className="font-data text-xs font-semibold">{c.hex}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Typography */}
          <div className="pt-4 border-t border-neutral-300">
            <span className="font-ui text-xs font-bold uppercase tracking-wider text-foreground block mb-2">
              Four-Family Editorial Typography
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { label: 'DISPLAY SERIF', name: 'Playfair Display', className: 'font-display', desc: 'Mastheads, major headlines, big numerical figures.' },
                { label: 'BODY SERIF', name: 'Lora', className: 'font-body', desc: 'Contemporary reading serif for editorial body copy.' },
                { label: 'UI SANS-SERIF', name: 'Inter', className: 'font-ui font-bold uppercase tracking-wider', desc: 'Navigational links, badges, and uppercase labels.' },
                { label: 'MONOSPACE DATA', name: 'JetBrains Mono', className: 'font-data', desc: 'Currency sums, timestamps, percentages, serials.' },
              ].map(({ label, name, className, desc }) => (
                <div key={label} className="p-4 border border-foreground bg-newsprint sharp-corners">
                  <span className="editorial-label text-neutral-500 block mb-1">{label}</span>
                  <p className={`text-2xl font-bold text-foreground ${className}`}>{name}</p>
                  <p className="font-body text-xs text-neutral-600 mt-1">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
