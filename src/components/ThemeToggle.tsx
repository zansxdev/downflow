'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Moon, Sun, Zap } from 'lucide-react';

export type ThemeMode = 'dark' | 'light' | 'neo';

const THEMES: { id: ThemeMode; label: string; icon: React.ReactNode; desc: string }[] = [
  {
    id: 'dark',
    label: 'Dark',
    icon: <Moon className="w-3.5 h-3.5" />,
    desc: 'Obsidian Black',
  },
  {
    id: 'light',
    label: 'Light',
    icon: <Sun className="w-3.5 h-3.5" />,
    desc: 'Clean Daylight',
  },
  {
    id: 'neo',
    label: 'Brutal',
    icon: <Zap className="w-3.5 h-3.5" />,
    desc: 'Neo-Brutalism',
  },
];

export const ThemeToggle: React.FC = () => {
  const [theme, setTheme] = useState<ThemeMode>('dark');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const raw = localStorage.getItem('downflow_theme');
      const saved = (raw === 'liquid' ? 'neo' : raw) as ThemeMode || 'dark';
      setTheme(saved);
      applyTheme(saved);
    } catch {
      applyTheme('dark');
    }
  }, []);

  const applyTheme = (mode: ThemeMode) => {
    document.documentElement.setAttribute('data-theme', mode);
    // Also toggle standard 'dark' class for tailwind dark: modifiers if any
    if (mode === 'light' || mode === 'neo') {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    } else {
      document.documentElement.classList.remove('light');
      document.documentElement.classList.add('dark');
    }

    const metaTheme = document.querySelector('meta[name="theme-color"]');
    if (metaTheme) {
      metaTheme.setAttribute(
        'content',
        mode === 'light' ? '#f8fafc' : mode === 'neo' ? '#fffdf5' : '#050505'
      );
    }
  };

  const handleSelectTheme = (mode: ThemeMode) => {
    setTheme(mode);
    applyTheme(mode);
    try {
      localStorage.setItem('downflow_theme', mode);
    } catch {
      // Storage unavailable
    }
  };

  if (!mounted) {
    return (
      <div className="flex items-center gap-0.5 p-1 rounded-lg bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] opacity-0">
        <div className="w-7 h-7" />
        <div className="w-7 h-7" />
        <div className="w-7 h-7" />
      </div>
    );
  }

  return (
    <div
      role="radiogroup"
      aria-label="Pilih Tema Tampilan"
      className="flex items-center gap-0.5 p-1 rounded-xl bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] shadow-sm backdrop-blur-md theme-toggle-container"
    >
      {THEMES.map((t) => {
        const isActive = theme === t.id;
        return (
          <button
            key={t.id}
            type="button"
            role="radio"
            aria-checked={isActive}
            onClick={() => handleSelectTheme(t.id)}
            data-active={isActive}
            className={`relative flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium cursor-pointer select-none transition-all duration-100 ${
              isActive
                ? 'text-[var(--chip-active-text)] font-bold'
                : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)]'
            }`}
            title={`${t.label} (${t.desc})`}
            aria-label={`${t.label} mode`}
          >
            {isActive && (
              <span
                className="absolute inset-0 rounded-lg bg-[var(--chip-active-bg)] border border-[var(--chip-active-border)] shadow-sm -z-10"
              />
            )}
            <span className="shrink-0">{t.icon}</span>
            <span className="hidden sm:inline text-[11px] font-mono tracking-tight">
              {t.label}
            </span>
          </button>
        );
      })}
    </div>
  );
};
