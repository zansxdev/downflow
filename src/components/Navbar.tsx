'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { History } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { SoundToggle } from './SoundToggle';

interface NavbarProps {
  onOpenHistory: () => void;
  historyCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenHistory, historyCount }) => {
  return (
    <header className="w-full max-w-4xl mx-auto px-4 py-4 sm:py-6 flex items-center justify-between border-b border-[var(--navbar-border)] relative z-10">
      <div className="flex items-center gap-2">
        <span className="font-display font-extrabold text-lg sm:text-xl tracking-tight text-[var(--text-primary)]">
          DownFlow
        </span>
      </div>

      <div className="flex items-center gap-2 sm:gap-2.5">
        <ThemeToggle />
        <SoundToggle />

        <button
          type="button"
          onClick={onOpenHistory}

          className="flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 min-h-[36px] rounded-xl text-xs font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] bg-[var(--bg-surface-elevated)] hover:bg-[var(--chip-active-bg)] border border-[var(--border-subtle)] transition-colors cursor-pointer shadow-sm neo-box"
          aria-label="Buka Riwayat Unduhan"
        >
          <History className="w-3.5 h-3.5" />
          <span className="hidden xs:inline">Riwayat</span>
          {historyCount > 0 && (
            <span className="text-[10px] font-mono text-[var(--text-muted)] ml-0.5">
              ({historyCount})
            </span>
          )}
        </button>
      </div>
    </header>
  );
};
