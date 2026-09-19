'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Loader2, Radio } from 'lucide-react';

const STEPS = [
  'Menghubungkan ke server media...',
  'Mengekstrak metadata dan stream video...',
  'Menyiapkan tautan unduhan berkecepatan tinggi...',
];

export const LoadingSkeleton: React.FC = () => {
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setStepIndex((prev) => (prev + 1) % STEPS.length);
    }, 1800);
    return () => clearInterval(timer);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      className="w-full bg-[#0c0c10] border border-[#1f1f28] rounded-2xl p-6 sm:p-8 space-y-6"
    >
      <div className="flex flex-col sm:flex-row items-center gap-6">
        <div className="relative w-full sm:w-48 h-36 bg-[#14141c] rounded-xl overflow-hidden animate-pulse border border-[#252533] flex items-center justify-center">
          <Radio className="w-8 h-8 text-zinc-700 animate-bounce" />
        </div>

        <div className="flex-1 space-y-3 w-full">
          <div className="h-5 bg-[#171722] rounded-md w-3/4 animate-pulse" />
          <div className="h-4 bg-[#14141c] rounded-md w-1/2 animate-pulse" />
          <div className="h-3 bg-[#111118] rounded-md w-1/3 animate-pulse" />

          <div className="pt-3 flex items-center gap-2.5 text-xs text-emerald-400 font-mono">
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
            <motion.span
              key={stepIndex}
              initial={{ opacity: 0, y: 3 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -3 }}
              transition={{ duration: 0.2 }}
            >
              {STEPS[stepIndex]}
            </motion.span>
          </div>
        </div>
      </div>

      <div className="pt-2 border-t border-[#181822] grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="h-11 bg-[#14141c] rounded-xl animate-pulse" />
        <div className="h-11 bg-[#14141c] rounded-xl animate-pulse" />
      </div>
    </motion.div>
  );
};
