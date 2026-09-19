'use client';

import React from 'react';
import { motion } from 'framer-motion';

const ICONS = {
  tiktok: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.298 0 .591.045.87.13V9.4a6.33 6.33 0 0 0-1-.08A6.34 6.34 0 0 0 3 15.66a6.34 6.34 0 0 0 10.82 4.5 6.3 6.3 0 0 0 1.96-4.49V8.62a8.28 8.28 0 0 0 4.81 1.52V6.69h-1z" />
    </svg>
  ),
  instagram: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.449-1.44z" />
    </svg>
  ),
  youtube: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  ),
  twitter: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  ),
  spotify: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
      <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.502 17.31c-.22.359-.684.475-1.042.256-2.859-1.748-6.458-2.143-10.697-1.173-.41.094-.82-.162-.914-.572-.094-.41.163-.82.573-.914 4.639-1.06 8.607-.615 11.824 1.36.358.22.474.684.256 1.043zm1.47-3.265c-.276.45-.863.593-1.314.317-3.272-2.012-8.26-2.595-12.128-1.42-.507.155-1.043-.133-1.198-.64-.155-.508.133-1.044.64-1.199 4.417-1.341 9.91-.689 13.683 1.628.45.276.593.863.317 1.314zm.126-3.41c-3.924-2.33-10.395-2.545-14.15-1.405-.6.182-1.242-.16-1.424-.761-.182-.602.16-1.242.761-1.424 4.316-1.31 11.458-1.06 15.98 1.625.54.32.716 1.023.396 1.564-.32.541-1.024.717-1.563.397z" />
    </svg>
  ),
  facebook: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  ),
  pinterest: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
      <path d="M12 0a12 12 0 0 0-4.37 23.17c-.07-.63-.13-1.6.03-2.29l.98-4.14s-.25-.5-.25-1.25c0-1.17.68-2.05 1.53-2.05.72 0 1.07.54 1.07 1.19 0 .73-.46 1.81-.71 2.82-.2.85.42 1.54 1.26 1.54 1.51 0 2.67-1.59 2.67-3.89 0-2.03-1.46-3.46-3.55-3.46-2.42 0-3.84 1.82-3.84 3.69 0 .73.28 1.52.63 1.95.07.08.08.16.06.25l-.23.95c-.04.16-.13.2-.3.12-1.12-.52-1.82-2.15-1.82-3.46 0-2.82 2.05-5.41 5.91-5.41 3.1 0 5.51 2.21 5.51 5.16 0 3.08-1.94 5.56-4.64 5.56-.91 0-1.76-.47-2.05-1.02l-.56 2.13c-.2.78-.75 1.76-1.12 2.36A12 12 0 1 0 12 0z" />
    </svg>
  ),
  threads: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
      <path d="M12.186 24h-.007C5.463 23.978 0 18.579 0 11.973 0 5.378 5.446 0 12.153 0c6.643 0 11.847 5.158 11.847 11.758 0 .61-.047 1.226-.14 1.832l-2.09-.32c.07-.464.105-.934.105-1.401 0-5.187-3.99-9.258-9.722-9.258-5.772 0-9.654 4.14-9.654 9.362 0 5.212 3.882 9.473 9.68 9.495 2.855.011 5.304-.98 7.078-2.867.247.387.525.753.834 1.096-2.124 2.278-5.064 3.486-8.525 3.486l.48-.183z" />
    </svg>
  ),
};

type IconKey = keyof typeof ICONS;

// Deterministic set of 32 flying floating social media brand marks
interface FloatingLogo {
  id: string;
  type: IconKey;
  size: number;
  startX: number; // percentage vw
  startY: number; // percentage vh
  xMoves: number[];
  yMoves: number[];
  rotates: number[];
  duration: number;
  delay: number;
  opacity: number;
}

const FLOATING_ITEMS: FloatingLogo[] = [
  // Top left cluster
  { id: 'f-1', type: 'tiktok', size: 48, startX: 6, startY: 10, xMoves: [0, 25, -15, 0], yMoves: [0, -35, 20, 0], rotates: [0, 20, -15, 0], duration: 18, delay: 0, opacity: 0.55 },
  { id: 'f-2', type: 'instagram', size: 36, startX: 18, startY: 8, xMoves: [0, -20, 25, 0], yMoves: [0, 40, -20, 0], rotates: [0, -25, 15, 0], duration: 15, delay: 1, opacity: 0.45 },
  { id: 'f-3', type: 'youtube', size: 54, startX: 28, startY: 14, xMoves: [0, 30, -20, 0], yMoves: [0, -30, 25, 0], rotates: [0, 15, -20, 0], duration: 20, delay: 2, opacity: 0.50 },
  
  // Top right cluster
  { id: 'f-4', type: 'spotify', size: 44, startX: 72, startY: 9, xMoves: [0, -25, 20, 0], yMoves: [0, 35, -25, 0], rotates: [0, -15, 20, 0], duration: 17, delay: 0.5, opacity: 0.50 },
  { id: 'f-5', type: 'twitter', size: 50, startX: 84, startY: 12, xMoves: [0, 20, -30, 0], yMoves: [0, -40, 15, 0], rotates: [0, 25, -10, 0], duration: 19, delay: 1.5, opacity: 0.55 },
  { id: 'f-6', type: 'threads', size: 38, startX: 94, startY: 8, xMoves: [0, -15, 15, 0], yMoves: [0, 25, -30, 0], rotates: [0, -20, 15, 0], duration: 16, delay: 3, opacity: 0.40 },

  // Mid left flank
  { id: 'f-7', type: 'facebook', size: 46, startX: 4, startY: 34, xMoves: [0, 35, -10, 0], yMoves: [0, -30, 30, 0], rotates: [0, 15, -25, 0], duration: 21, delay: 2, opacity: 0.50 },
  { id: 'f-8', type: 'instagram', size: 58, startX: 14, startY: 42, xMoves: [0, -25, 30, 0], yMoves: [0, 35, -20, 0], rotates: [0, -18, 18, 0], duration: 22, delay: 0.8, opacity: 0.60 },
  { id: 'f-9', type: 'pinterest', size: 34, startX: 8, startY: 56, xMoves: [0, 20, -25, 0], yMoves: [0, -25, 35, 0], rotates: [0, 30, -15, 0], duration: 16, delay: 3.5, opacity: 0.45 },

  // Mid right flank
  { id: 'f-10', type: 'tiktok', size: 62, startX: 88, startY: 36, xMoves: [0, -30, 20, 0], yMoves: [0, 45, -25, 0], rotates: [0, -20, 25, 0], duration: 23, delay: 1.2, opacity: 0.60 },
  { id: 'f-11', type: 'youtube', size: 42, startX: 78, startY: 46, xMoves: [0, 25, -35, 0], yMoves: [0, -35, 20, 0], rotates: [0, 20, -15, 0], duration: 18, delay: 2.8, opacity: 0.50 },
  { id: 'f-12', type: 'spotify', size: 52, startX: 92, startY: 58, xMoves: [0, -20, 15, 0], yMoves: [0, 30, -40, 0], rotates: [0, -15, 20, 0], duration: 20, delay: 0.2, opacity: 0.55 },

  // Lower left cluster
  { id: 'f-13', type: 'twitter', size: 40, startX: 5, startY: 72, xMoves: [0, 30, -20, 0], yMoves: [0, -40, 20, 0], rotates: [0, 25, -20, 0], duration: 17, delay: 1.7, opacity: 0.50 },
  { id: 'f-14', type: 'threads', size: 48, startX: 18, startY: 78, xMoves: [0, -20, 25, 0], yMoves: [0, 30, -30, 0], rotates: [0, -20, 15, 0], duration: 19, delay: 2.4, opacity: 0.50 },
  { id: 'f-15', type: 'tiktok', size: 36, startX: 10, startY: 88, xMoves: [0, 25, -15, 0], yMoves: [0, -25, 35, 0], rotates: [0, 15, -25, 0], duration: 15, delay: 0.4, opacity: 0.45 },

  // Lower right cluster
  { id: 'f-16', type: 'facebook', size: 38, startX: 86, startY: 75, xMoves: [0, -25, 30, 0], yMoves: [0, 35, -20, 0], rotates: [0, -25, 20, 0], duration: 16, delay: 2.1, opacity: 0.50 },
  { id: 'f-17', type: 'instagram', size: 50, startX: 74, startY: 82, xMoves: [0, 20, -25, 0], yMoves: [0, -30, 25, 0], rotates: [0, 18, -15, 0], duration: 21, delay: 1.1, opacity: 0.55 },
  { id: 'f-18', type: 'youtube', size: 60, startX: 90, startY: 90, xMoves: [0, -30, 20, 0], yMoves: [0, 25, -35, 0], rotates: [0, -15, 25, 0], duration: 24, delay: 3.2, opacity: 0.55 },

  // Center subtle ambient floaters (around content)
  { id: 'f-19', type: 'spotify', size: 32, startX: 42, startY: 4, xMoves: [0, 20, -20, 0], yMoves: [0, -20, 20, 0], rotates: [0, 30, -30, 0], duration: 14, delay: 0.6, opacity: 0.38 },
  { id: 'f-20', type: 'tiktok', size: 34, startX: 56, startY: 5, xMoves: [0, -20, 20, 0], yMoves: [0, 20, -20, 0], rotates: [0, -30, 30, 0], duration: 15, delay: 2.2, opacity: 0.38 },
  { id: 'f-21', type: 'twitter', size: 30, startX: 34, startY: 88, xMoves: [0, 15, -25, 0], yMoves: [0, -25, 20, 0], rotates: [0, 20, -20, 0], duration: 16, delay: 1.8, opacity: 0.38 },
  { id: 'f-22', type: 'pinterest', size: 32, startX: 62, startY: 89, xMoves: [0, -25, 15, 0], yMoves: [0, 20, -25, 0], rotates: [0, -20, 20, 0], duration: 17, delay: 0.9, opacity: 0.38 },
  { id: 'f-23', type: 'instagram', size: 28, startX: 24, startY: 48, xMoves: [0, 20, -15, 0], yMoves: [0, -25, 25, 0], rotates: [0, 25, -25, 0], duration: 13, delay: 3.1, opacity: 0.32 },
  { id: 'f-24', type: 'youtube', size: 30, startX: 70, startY: 52, xMoves: [0, -20, 20, 0], yMoves: [0, 25, -20, 0], rotates: [0, -25, 25, 0], duration: 14, delay: 1.4, opacity: 0.32 },
];

export const SocialBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden select-none z-0">
      {/* 24+ Prominent Flying Social Media Brand Logos */}
      {FLOATING_ITEMS.map((item) => (
        <motion.div
          key={item.id}
          style={{
            position: 'absolute',
            left: `${item.startX}%`,
            top: `${item.startY}%`,
            width: item.size,
            height: item.size,
            opacity: item.opacity,
          }}
          className="text-zinc-400 hover:text-white transition-colors"
          animate={{
            x: item.xMoves,
            y: item.yMoves,
            rotate: item.rotates,
          }}
          transition={{
            duration: item.duration,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: item.delay,
          }}
        >
          {ICONS[item.type]}
        </motion.div>
      ))}
    </div>
  );
};
