'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { History } from 'lucide-react';

interface NavbarProps {
  onOpenHistory: () => void;
  historyCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenHistory, historyCount }) => {
  return (
    <header className="w-full max-w-4xl mx-auto px-4 py-4 sm:py-6 flex items-center justify-between border-b border-[#18181f] relative z-10">
      <div className="flex items-center gap-2">
        <span className="font-display font-extrabold text-lg sm:text-xl tracking-tight text-white">
          DownFlow
        </span>
      </div>

      <button
        type="button"
        onClick={onOpenHistory}
        className="flex items-center gap-2 px-3 py-1.5 min-h-[36px] rounded-md text-xs font-medium text-zinc-400 hover:text-white bg-[#0e0e12] hover:bg-[#16161c] border border-[#222228] transition-colors cursor-pointer"
        aria-label="Buka Riwayat Unduhan"
      >
        <History className="w-3.5 h-3.5" />
        <span>Riwayat</span>
        {historyCount > 0 && (
          <span className="text-[10px] font-mono text-zinc-300 ml-0.5">
            ({historyCount})
          </span>
        )}
      </button>
    </header>
  );
};
