'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { PLATFORMS } from '@/lib/url-detector';
import { PlatformId } from '@/lib/types';

interface PlatformChipsProps {
  selectedPlatform: PlatformId;
  onSelectPlatform: (id: PlatformId) => void;
}

export const PlatformChips: React.FC<PlatformChipsProps> = ({
  selectedPlatform,
  onSelectPlatform,
}) => {
  return (
    <div className="w-full overflow-x-auto no-scrollbar py-2">
      <div className="flex items-center gap-2 min-w-max px-1">
        {PLATFORMS.map((platform) => {
          const isSelected = selectedPlatform === platform.id;
          return (
            <button
              key={platform.id}
              type="button"
              onClick={() => onSelectPlatform(platform.id)}
              className={`relative px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer border ${
                isSelected
                  ? 'text-white border-emerald-500/50 bg-[#121814]'
                  : 'text-zinc-400 hover:text-zinc-200 border-[#1f1f26] bg-[#0b0b0e] hover:bg-[#121217]'
              }`}
            >
              {isSelected && (
                <motion.div
                  layoutId="activeChipGlow"
                  className="absolute inset-0 rounded-lg bg-emerald-500/10 -z-10"
                  transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                />
              )}
              <span className="flex items-center gap-2">
                <span
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ backgroundColor: isSelected ? '#10B981' : '#52525b' }}
                />
                <span>{platform.name}</span>
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
