'use client';

import React from 'react';
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
    <div className="w-full overflow-x-auto no-scrollbar py-1">
      <div className="flex items-center gap-1.5 min-w-max">
        {PLATFORMS.map((platform) => {
          const isSelected = selectedPlatform === platform.id;
          return (
            <button
              key={platform.id}
              type="button"
              onClick={() => onSelectPlatform(platform.id)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer border ${
                isSelected
                  ? 'text-white border-zinc-500 bg-zinc-800/60'
                  : 'text-zinc-400 hover:text-zinc-200 border-[#1e1e24] bg-[#0c0c10] hover:bg-[#14141a]'
              }`}
            >
              {platform.name}
            </button>
          );
        })}
      </div>
    </div>
  );
};
