import React from 'react';
import { useAuth } from '../context/AuthContext';
import { WobblyCard } from '../components/ui/WobblyCard';
import { WobblyButton } from '../components/ui/WobblyButton';
import { WobblyBadge } from '../components/ui/WobblyBadge';
import { WashiTape } from '../components/ui/WashiTape';
import { Thumbtack } from '../components/ui/Thumbtack';
import {
  Settings,
  Cpu,
  Palette,
  Shield,
  User,
  Database,
  Download,
  Terminal,
} from 'lucide-react';

export function SettingsPage() {
  const { user, demoUsers, switchDemoUser } = useAuth();

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Title */}
      <div className="bg-paper border-2 border-ink wobbly p-5 shadow-hard flex items-center justify-between gap-4">
        <div>
          <h3 className="text-2xl font-heading font-bold text-ink flex items-center gap-2">
            <Settings className="w-6 h-6 text-secondary-blue" />
            <span>Settings & Sketchbook Design System</span>
          </h3>
          <p className="text-sm font-body text-ink/70">
            Account preferences, system diagnostics & design token reference
          </p>
        </div>
      </div>

      {/* 1. Account / Active Profile */}
      <WobblyCard withTape tapeColor="yellow" className="p-6">
        <h4 className="text-xl font-heading font-bold text-ink mb-4 flex items-center gap-2">
          <User className="w-5 h-5 text-accent-red" />
          <span>Active Representative Account</span>
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {demoUsers.map((u) => {
            const isSelected = user.id === u.id;
            return (
              <div
                key={u.id}
                onClick={() => switchDemoUser(u.id)}
                className={`p-4 border-2 border-ink wobbly cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-postit-yellow shadow-hard scale-[1.02]'
                    : 'bg-paper hover:bg-muted-paper/40 shadow-hard-sm'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-12 h-12 border-2 border-ink rounded-full flex items-center justify-center font-heading font-bold text-xl shadow-inner"
                    style={{ backgroundColor: u.avatarColor }}
                  >
                    {u.name.charAt(0)}
                  </div>
                  <div>
                    <h5 className="font-heading font-bold text-lg text-ink">
                      {u.name}
                    </h5>
                    <p className="text-xs font-body text-ink/70">{u.role}</p>
                    <p className="text-xs font-body text-secondary-blue font-bold">{u.email}</p>
                  </div>
                </div>
                {isSelected && (
                  <div className="mt-3 text-right">
                    <WobblyBadge variant="green" size="sm">Active Account</WobblyBadge>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </WobblyCard>

      {/* 2. System Architecture Diagnostics */}
      <WobblyCard withTape tapeColor="blue" className="p-6">
        <h4 className="text-xl font-heading font-bold text-ink mb-4 flex items-center gap-2">
          <Cpu className="w-5 h-5 text-secondary-blue" />
          <span>System & Infrastructure Diagnostics</span>
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm font-body">
          <div className="p-4 bg-[#f5f1e8] border border-ink wobbly-sm shadow-hard-sm">
            <span className="font-heading font-bold text-xs uppercase text-ink/70 block mb-1">
              Backend Runtime
            </span>
            <p className="text-lg font-heading font-bold text-ink">Rust 1.80+ (Axum 0.7)</p>
            <p className="text-xs text-ink/70 mt-1">Multi-threaded Tokio asynchronous engine</p>
          </div>

          <div className="p-4 bg-[#f5f1e8] border border-ink wobbly-sm shadow-hard-sm">
            <span className="font-heading font-bold text-xs uppercase text-ink/70 block mb-1">
              Database Storage
            </span>
            <p className="text-lg font-heading font-bold text-ink">SQLite (WAL Mode)</p>
            <p className="text-xs text-ink/70 mt-1">Self-healing auto-migrations & seeded test data</p>
          </div>

          <div className="p-4 bg-[#f5f1e8] border border-ink wobbly-sm shadow-hard-sm">
            <span className="font-heading font-bold text-xs uppercase text-ink/70 block mb-1">
              Frontend Client
            </span>
            <p className="text-lg font-heading font-bold text-ink">React 18 + Vite</p>
            <p className="text-xs text-ink/70 mt-1">Tailwind CSS + adapted Aceternity UI</p>
          </div>
        </div>
      </WobblyCard>

      {/* 3. Design Tokens & Visual Showcase */}
      <WobblyCard withTape tapeColor="pink" className="p-6">
        <h4 className="text-xl font-heading font-bold text-ink mb-4 flex items-center gap-2">
          <Palette className="w-5 h-5 text-accent-red" />
          <span>Design Tokens Showcase</span>
        </h4>

        <div className="space-y-4">
          <div>
            <span className="font-heading font-bold text-sm block mb-2">Palette Colors:</span>
            <div className="flex flex-wrap gap-3">
              {[
                { name: 'Paper', hex: '#fdfbf7', border: true },
                { name: 'Ink', hex: '#2d2d2d', text: '#fff' },
                { name: 'Muted', hex: '#e5e0d8', border: true },
                { name: 'Accent Red', hex: '#ff4d4d', text: '#fff' },
                { name: 'Secondary Blue', hex: '#2d5da1', text: '#fff' },
                { name: 'Post-it Yellow', hex: '#fff9c4', border: true },
                { name: 'Post-it Pink', hex: '#ffd1dc', border: true },
              ].map((c) => (
                <div
                  key={c.name}
                  className="px-3 py-2 border-2 border-ink wobbly-sm shadow-hard-sm text-xs font-heading font-bold"
                  style={{
                    backgroundColor: c.hex,
                    color: c.text || '#2d2d2d',
                  }}
                >
                  {c.name} ({c.hex})
                </div>
              ))}
            </div>
          </div>

          <div>
            <span className="font-heading font-bold text-sm block mb-2">Typography:</span>
            <div className="p-3 bg-paper border border-ink wobbly-sm space-y-1">
              <p className="font-heading font-bold text-xl text-ink">
                Headings: Kalam 700 (Expressive, organic handwriting)
              </p>
              <p className="font-body text-base text-ink">
                Body: Patrick Hand 400 (Clean, casual handwriting print for maximum readability)
              </p>
            </div>
          </div>
        </div>
      </WobblyCard>
    </div>
  );
}
