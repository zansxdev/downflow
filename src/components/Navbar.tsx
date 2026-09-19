'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { History, Zap, ShieldCheck } from 'lucide-react';

interface NavbarProps {
  onOpenHistory: () => void;
  historyCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenHistory, historyCount }) => {
  return (
    <motion.header 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="w-full max-w-6xl mx-auto px-4 py-6 flex items-center justify-between border-b border-[#1a1a20]"
    >
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center text-black font-black text-lg shadow-lg shadow-emerald-950/40">
          <Zap className="w-5 h-5 text-black fill-black" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-xl tracking-tight text-white font-sans">
              Down<span className="text-emerald-400">Flow</span>
            </span>
            <span className="text-[10px] font-mono uppercase bg-[#141419] border border-[#272730] text-zinc-400 px-2 py-0.5 rounded-md">
              v1.0
            </span>
          </div>
          <p className="text-xs text-zinc-500 font-mono hidden sm:block">
            High speed clean media extractor
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#0d0d12] border border-[#1f1f28] text-xs text-zinc-400 font-mono">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>API Node Online</span>
        </div>

        <button
          type="button"
          onClick={onOpenHistory}
          className="relative flex items-center gap-2 px-3 py-2 rounded-lg bg-[#0e0e14] hover:bg-[#181822] text-zinc-300 hover:text-white border border-[#22222d] transition-all text-xs font-medium cursor-pointer"
          aria-label="Buka Riwayat Download"
        >
          <History className="w-4 h-4 text-zinc-400" />
          <span className="hidden sm:inline">Riwayat</span>
          {historyCount > 0 && (
            <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-mono font-bold px-1.5 py-0.2 rounded-full">
              {historyCount}
            </span>
          )}
        </button>
      </div>
    </motion.header>
  );
};
