import React from 'react';
import { useAuth } from '../context/AuthContext';
import { EditorialButton } from '../components/editorial/EditorialButton';
import { EditorialBadge } from '../components/editorial/EditorialBadge';
import { SectionHeader } from '../components/editorial/SectionHeader';
import {
  Settings,
  Cpu,
  Palette,
  User,
  Database,
  CheckCircle,
  Terminal,
  Layers,
} from 'lucide-react';

export function SettingsPage() {
  const { user, demoUsers, switchDemoUser } = useAuth();

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Title Header */}
      <div className="border-2 border-foreground bg-newsprint p-6 shadow-hard flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <span className="font-data text-xs text-neutral-500 uppercase tracking-widest">
              SECTION 06 • MASTHEAD PREFERENCES
            </span>
            <EditorialBadge variant="dark" size="xs">
              Config V1.0
            </EditorialBadge>
          </div>
          <h2 className="font-display text-3xl font-bold text-foreground">
            Editorial Settings & System Dossier
          </h2>
          <p className="font-body text-sm text-neutral-600">
            Staff credentials, active representative switching, engine diagnostics & typography tokens
          </p>
        </div>
      </div>

      {/* 1. Account / Active Representative */}
      <div className="border-2 border-foreground bg-newsprint p-6 shadow-hard space-y-4">
        <SectionHeader
          number={1}
          title="Active Representative Profile"
          subtitle="Select an editorial staff persona to simulate distinct access roles"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {demoUsers.map((u) => {
            const isSelected = user.id === u.id;
            return (
              <div
                key={u.id}
                onClick={() => switchDemoUser(u.id)}
                className={`p-4 border-2 transition-all cursor-pointer sharp-corners flex flex-col justify-between ${
                  isSelected
                    ? 'border-foreground bg-neutral-100 shadow-hard'
                    : 'border-neutral-300 hover:border-foreground bg-newsprint'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 border-2 border-foreground bg-foreground text-newsprint flex items-center justify-center font-display font-bold text-xl sharp-corners">
                    {u.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-display text-lg font-bold text-foreground">
                      {u.name}
                    </h4>
                    <p className="font-ui text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                      {u.role}
                    </p>
                    <p className="font-data text-xs text-neutral-600 mt-0.5">{u.email}</p>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-neutral-300 flex items-center justify-between">
                  <span className="font-data text-[10px] text-neutral-400">
                    STAFF ID: #{String(u.id).padStart(4, '0')}
                  </span>
                  {isSelected ? (
                    <EditorialBadge variant="accent" size="xs">
                      Active Byline
                    </EditorialBadge>
                  ) : (
                    <span className="font-ui text-xs font-bold text-neutral-500 uppercase hover:text-foreground">
                      Switch To Persona →
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. System Architecture Diagnostics */}
      <div className="border-2 border-foreground bg-newsprint p-6 shadow-hard space-y-4">
        <SectionHeader
          number={2}
          title="System Architecture Diagnostics"
          subtitle="Real-time status of backend services, async runtime, and datastore engines"
        />

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 border border-foreground bg-neutral-100 sharp-corners">
            <span className="editorial-label text-neutral-500 block mb-1">
              BACKEND RUNTIME
            </span>
            <p className="font-display text-xl font-bold text-foreground">Rust 1.80+ (Axum)</p>
            <p className="font-body text-xs text-neutral-600 mt-1">
              Multi-threaded Tokio asynchronous engine with zero-allocation JSON serialization
            </p>
          </div>

          <div className="p-4 border border-foreground bg-neutral-100 sharp-corners">
            <span className="editorial-label text-neutral-500 block mb-1">
              DATASTORE ENGINE
            </span>
            <p className="font-display text-xl font-bold text-foreground">PostgreSQL / SQLx</p>
            <p className="font-body text-xs text-neutral-600 mt-1">
              Connection-pooled relational store with declarative migrations and automated seed
            </p>
          </div>

          <div className="p-4 border border-foreground bg-neutral-100 sharp-corners">
            <span className="editorial-label text-neutral-500 block mb-1">
              FRONTEND INTERFACE
            </span>
            <p className="font-display text-xl font-bold text-foreground">React 18 + Vite</p>
            <p className="font-body text-xs text-neutral-600 mt-1">
              Newsprint Editorial design system with Tailwind CSS & zero border-radius enforcement
            </p>
          </div>
        </div>
      </div>

      {/* 3. Newsprint Editorial Design Tokens */}
      <div className="border-2 border-foreground bg-newsprint p-6 shadow-hard space-y-4">
        <SectionHeader
          number={3}
          title="Newsprint Editorial Design Tokens"
          subtitle="Official style guide and chromatic tokens for the editorial system"
        />

        <div className="space-y-6">
          {/* Color Palette */}
          <div>
            <span className="font-ui text-xs font-bold uppercase tracking-wider text-foreground block mb-2">
              Color Palette (95% Neutral / 5% Red Accent)
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { name: 'Newsprint Paper', hex: '#F9F9F7', bg: 'bg-[#F9F9F7]', text: 'text-foreground', border: 'border-foreground' },
                { name: 'Ink Foreground', hex: '#111111', bg: 'bg-[#111111]', text: 'text-newsprint', border: 'border-foreground' },
                { name: 'Editorial Accent', hex: '#CC0000', bg: 'bg-[#CC0000]', text: 'text-newsprint', border: 'border-[#CC0000]' },
                { name: 'Muted Divider', hex: '#E5E5E0', bg: 'bg-[#E5E5E0]', text: 'text-foreground', border: 'border-foreground' },
              ].map((c) => (
                <div
                  key={c.name}
                  className={`p-3 border-2 ${c.border} ${c.bg} ${c.text} sharp-corners flex flex-col justify-between h-20 shadow-hard-sm`}
                >
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
              <div className="p-4 border border-foreground bg-newsprint sharp-corners">
                <span className="editorial-label text-neutral-500 block mb-1">
                  DISPLAY SERIF (HEADLINES & NUMBERS)
                </span>
                <p className="font-display text-2xl font-bold text-foreground">
                  Playfair Display
                </p>
                <p className="font-body text-xs text-neutral-600 mt-1">
                  High-contrast modern serif used for mastheads, major headlines, and big numerical figures.
                </p>
              </div>

              <div className="p-4 border border-foreground bg-newsprint sharp-corners">
                <span className="editorial-label text-neutral-500 block mb-1">
                  BODY SERIF (NARRATIVE TEXT)
                </span>
                <p className="font-body text-2xl text-foreground">
                  Lora
                </p>
                <p className="font-body text-xs text-neutral-600 mt-1">
                  Contemporary reading serif with brushed curves, optimized for comfortable editorial body copy.
                </p>
              </div>

              <div className="p-4 border border-foreground bg-newsprint sharp-corners">
                <span className="editorial-label text-neutral-500 block mb-1">
                  USER INTERFACE (BUTTONS & METADATA)
                </span>
                <p className="font-ui text-2xl font-bold text-foreground uppercase tracking-wider">
                  Inter
                </p>
                <p className="font-body text-xs text-neutral-600 mt-1">
                  Precision neo-grotesque sans-serif used for navigational links, badges, and uppercase labels.
                </p>
              </div>

              <div className="p-4 border border-foreground bg-newsprint sharp-corners">
                <span className="editorial-label text-neutral-500 block mb-1">
                  DATA & FINANCIAL FIGURES
                </span>
                <p className="font-data text-2xl font-bold text-foreground">
                  JetBrains Mono
                </p>
                <p className="font-body text-xs text-neutral-600 mt-1">
                  Clean monospace typeface used for currency sums, timestamps, percentages, and serial numbers.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
