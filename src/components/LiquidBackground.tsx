'use client';

import React from 'react';
import { motion } from 'framer-motion';

export const LiquidBackground: React.FC = () => {
  return (
    <div
      aria-hidden="true"
      className="liquid-aurora-layer fixed inset-0 pointer-events-none select-none overflow-hidden max-w-full z-0"
      style={{ contain: 'strict' }}
    >
      {/* Orb 1: Cyan / Electric Sky Glow */}
      <motion.div
        animate={{
          x: [0, 90, -70, 0],
          y: [0, -80, 60, 0],
          scale: [1, 1.2, 0.95, 1],
        }}
        transition={{
          duration: 16,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute -top-32 left-[8%] w-[500px] sm:w-[700px] h-[500px] sm:h-[700px] rounded-full opacity-70 filter blur-[95px] sm:blur-[135px]"
        style={{
          background:
            'radial-gradient(circle, rgba(6, 182, 212, 0.75) 0%, rgba(14, 165, 233, 0.45) 45%, transparent 70%)',
          willChange: 'transform',
        }}
      />

      {/* Orb 2: Electric Purple / Hot Magenta Glow */}
      <motion.div
        animate={{
          x: [0, -80, 60, 0],
          y: [0, 90, -70, 0],
          scale: [1, 1.25, 0.9, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 1,
        }}
        className="absolute top-[25%] -right-28 w-[450px] sm:w-[650px] h-[450px] sm:h-[650px] rounded-full opacity-65 filter blur-[95px] sm:blur-[140px]"
        style={{
          background:
            'radial-gradient(circle, rgba(168, 85, 247, 0.7) 0%, rgba(217, 70, 239, 0.45) 45%, transparent 70%)',
          willChange: 'transform',
        }}
      />

      {/* Orb 3: Royal Blue / Indigo Center Fluid */}
      <motion.div
        animate={{
          x: [0, 70, -90, 0],
          y: [0, -60, 80, 0],
          scale: [1, 1.15, 0.95, 1],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 2,
        }}
        className="absolute bottom-[2%] left-[18%] w-[500px] sm:w-[750px] h-[500px] sm:h-[750px] rounded-full opacity-60 filter blur-[100px] sm:blur-[150px]"
        style={{
          background:
            'radial-gradient(circle, rgba(59, 130, 246, 0.65) 0%, rgba(99, 102, 241, 0.4) 45%, transparent 70%)',
          willChange: 'transform',
        }}
      />

      {/* Orb 4: Teal / Emerald Accent Floating Bottom-Left */}
      <motion.div
        animate={{
          x: [0, -60, 70, 0],
          y: [0, 70, -50, 0],
          scale: [0.9, 1.2, 1, 0.9],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 3,
        }}
        className="absolute top-[55%] -left-28 w-[400px] sm:w-[550px] h-[400px] sm:h-[550px] rounded-full opacity-50 filter blur-[85px] sm:blur-[120px]"
        style={{
          background:
            'radial-gradient(circle, rgba(20, 184, 166, 0.6) 0%, rgba(6, 182, 212, 0.3) 45%, transparent 70%)',
          willChange: 'transform',
        }}
      />
    </div>
  );
};
