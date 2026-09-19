'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

const STEPS = [
  'Menghubungkan ke server media...',
  'Mengekstrak metadata stream...',
  'Menyiapkan tautan unduhan...',
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
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="w-full bg-[#0c0c10] border border-[#1f1f26] rounded-xl p-6 space-y-4"
    >
      <div className="flex items-center gap-2 text-xs text-zinc-300 font-mono">
        <Loader2 className="w-3.5 h-3.5 animate-spin text-zinc-400" />
        <motion.span
          key={stepIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {STEPS[stepIndex]}
        </motion.span>
      </div>

      <div className="space-y-2">
        <div className="h-4 bg-[#181820] rounded w-2/3 animate-pulse" />
        <div className="h-3 bg-[#14141a] rounded w-1/3 animate-pulse" />
      </div>

      <div className="pt-2 border-t border-[#181820] grid grid-cols-1 sm:grid-cols-2 gap-2">
        <div className="h-10 bg-[#14141a] rounded animate-pulse" />
        <div className="h-10 bg-[#14141a] rounded animate-pulse" />
      </div>
    </motion.div>
  );
};
