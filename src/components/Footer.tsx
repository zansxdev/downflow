'use client';

import React from 'react';
import { Shield, Sparkles, Terminal } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full max-w-6xl mx-auto px-4 py-8 border-t border-[#17171e] text-xs text-zinc-500 font-mono flex flex-col sm:flex-row items-center justify-between gap-4">
      <div className="flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-emerald-500" />
        <span className="text-zinc-400 font-sans font-medium">DownFlow Media Hub</span>
        <span>•</span>
        <span>Obsidian Tech Stack</span>
      </div>

      <div className="flex items-center gap-4 text-[11px]">
        <span className="text-zinc-500">Fastify Engine</span>
        <span>/</span>
        <span className="text-zinc-500">Framer Motion</span>
        <span>/</span>
        <span className="text-zinc-500">Zero Watermark</span>
      </div>
    </footer>
  );
};
