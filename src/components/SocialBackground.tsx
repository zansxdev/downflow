'use client';

import React from 'react';
import { motion } from 'framer-motion';

// Authentic minimalist SVG brand glyphs (monochrome vector)
const LOGOS = [
  {
    id: 'tiktok-1',
    name: 'TikTok',
    size: 56,
    initialX: '8%',
    initialY: '14%',
    duration: 14,
    delay: 0,
    rotateDelta: 12,
    svg: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.298 0 .591.045.87.13V9.4a6.33 6.33 0 0 0-1-.08A6.34 6.34 0 0 0 3 15.66a6.34 6.34 0 0 0 10.82 4.5 6.3 6.3 0 0 0 1.96-4.49V8.62a8.28 8.28 0 0 0 4.81 1.52V6.69h-1z" />
      </svg>
    ),
  },
  {
    id: 'instagram-1',
    name: 'Instagram',
    size: 64,
    initialX: '84%',
    initialY: '18%',
    duration: 18,
    delay: 1,
    rotateDelta: -15,
    svg: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
      </svg>
    ),
  },
  {
    id: 'youtube-1',
    name: 'YouTube',
    size: 68,
    initialX: '15%',
    initialY: '68%',
    duration: 16,
    delay: 2,
    rotateDelta: 10,
    svg: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    ),
  },
  {
    id: 'x-1',
    name: 'X',
    size: 52,
    initialX: '88%',
    initialY: '65%',
    duration: 13,
    delay: 3,
    rotateDelta: -8,
    svg: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    id: 'spotify-1',
    name: 'Spotify',
    size: 58,
    initialX: '48%',
    initialY: '8%',
    duration: 15,
    delay: 1.5,
    rotateDelta: 14,
    svg: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
        <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.502 17.31c-.22.359-.684.475-1.042.256-2.859-1.748-6.458-2.143-10.697-1.173-.41.094-.82-.162-.914-.572-.094-.41.163-.82.573-.914 4.639-1.06 8.607-.615 11.824 1.36.358.22.474.684.256 1.043zm1.47-3.265c-.276.45-.863.593-1.314.317-3.272-2.012-8.26-2.595-12.128-1.42-.507.155-1.043-.133-1.198-.64-.155-.508.133-1.044.64-1.199 4.417-1.341 9.91-.689 13.683 1.628.45.276.593.863.317 1.314zm.126-3.41c-3.924-2.33-10.395-2.545-14.15-1.405-.6.182-1.242-.16-1.424-.761-.182-.602.16-1.242.761-1.424 4.316-1.31 11.458-1.06 15.98 1.625.54.32.716 1.023.396 1.564-.32.541-1.024.717-1.563.397z" />
      </svg>
    ),
  },
  {
    id: 'facebook-1',
    name: 'Facebook',
    size: 48,
    initialX: '4%',
    initialY: '42%',
    duration: 17,
    delay: 2.5,
    rotateDelta: -10,
    svg: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
  },
  {
    id: 'tiktok-2',
    name: 'TikTok',
    size: 46,
    initialX: '92%',
    initialY: '45%',
    duration: 16,
    delay: 4,
    rotateDelta: 15,
    svg: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.298 0 .591.045.87.13V9.4a6.33 6.33 0 0 0-1-.08A6.34 6.34 0 0 0 3 15.66a6.34 6.34 0 0 0 10.82 4.5 6.3 6.3 0 0 0 1.96-4.49V8.62a8.28 8.28 0 0 0 4.81 1.52V6.69h-1z" />
      </svg>
    ),
  },
  {
    id: 'threads-1',
    name: 'Threads',
    size: 52,
    initialX: '45%',
    initialY: '82%',
    duration: 19,
    delay: 0.5,
    rotateDelta: -12,
    svg: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
        <path d="M12.186 24h-.007C5.463 23.978 0 18.579 0 11.973 0 5.378 5.446 0 12.153 0c6.643 0 11.847 5.158 11.847 11.758 0 .61-.047 1.226-.14 1.832l-2.09-.32c.07-.464.105-.934.105-1.401 0-5.187-3.99-9.258-9.722-9.258-5.772 0-9.654 4.14-9.654 9.362 0 5.212 3.882 9.473 9.68 9.495 2.855.011 5.304-.98 7.078-2.867.247.387.525.753.834 1.096-2.124 2.278-5.064 3.486-8.525 3.486l.48-.183z" />
      </svg>
    ),
  },
];

export const SocialBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden select-none -z-10 bg-[#050505]">
      {/* Very subtle ambient mesh overlay to keep contrast crisp and text readable */}
      <div className="absolute inset-0 bg-[#050505]/90 z-10" />

      {/* Floating social brand marks */}
      {LOGOS.map((item) => (
        <motion.div
          key={item.id}
          style={{
            position: 'absolute',
            left: item.initialX,
            top: item.initialY,
            width: item.size,
            height: item.size,
          }}
          className="text-zinc-500 opacity-20"
          animate={{
            y: [0, -30, 0, 20, 0],
            x: [0, 15, -10, 0],
            rotate: [0, item.rotateDelta, -item.rotateDelta, 0],
          }}
          transition={{
            duration: item.duration,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: item.delay,
          }}
        >
          {item.svg}
        </motion.div>
      ))}

      {/* Subtle bottom grid anchor line */}
      <div className="absolute bottom-0 inset-x-0 h-px bg-zinc-900" />
    </div>
  );
};
