import React from 'react';

export function EditorialFooter() {
  return (
    <footer className="border-t-[3px] border-foreground mt-12 bg-newsprint">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 border-b border-neutral-300 pb-8">
          {/* Brand */}
          <div>
            <h4 className="font-display text-2xl font-bold text-foreground mb-2">
              PaperCRM
            </h4>
            <p className="font-body text-sm text-neutral-500 leading-relaxed">
              A premium editorial CRM platform built with Rust, React, and an unwavering commitment to typographic excellence.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <span className="editorial-label text-neutral-400 block mb-3">
              Sections
            </span>
            <div className="space-y-1.5">
              {['Front Page', 'Pipeline', 'Directory', 'Dossiers', 'Wire', 'Masthead'].map((item) => (
                <p key={item} className="font-ui text-sm text-neutral-600 hover:text-accent cursor-pointer transition-colors">
                  {item}
                </p>
              ))}
            </div>
          </div>

          {/* Tech Stack */}
          <div>
            <span className="editorial-label text-neutral-400 block mb-3">
              Infrastructure
            </span>
            <div className="space-y-1 font-data text-xs text-neutral-500">
              <p>Backend: Rust + Axum</p>
              <p>Database: PostgreSQL (Render)</p>
              <p>Frontend: React 18 + Vite</p>
              <p>Design: Newsprint Editorial System</p>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-4">
          <span className="font-data text-[0.625rem] text-neutral-400 tracking-wider">
            VOL. 01 — DIGITAL EDITION — PRINTED FOR THE WEB
          </span>
          <span className="font-data text-[0.625rem] text-neutral-400">
            © {new Date().getFullYear()} PAPERCRM. ALL RIGHTS RESERVED.
          </span>
        </div>
      </div>
    </footer>
  );
}
