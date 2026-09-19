# DownFlow

An ultra-clean, Obsidian-themed universal media downloader web application built with Next.js 15, Tailwind CSS, and fluid Framer Motion animations. Connected to a dedicated Fastify REST-API backend.

## Features

- **Obsidian Dark Aesthetic**: Custom true-dark palette (`#050505`) with high WCAG AA contrast and zero visual clutter.
- **Fluid Motion Design**: Rich interactive animations powered by Framer Motion (dynamic active platform indicators, reactive glow input, animated loading cues, and result transitions).
- **Universal Multi-Platform Support**:
  - **TikTok**: Video without watermark, audio MP3, and photo slides.
  - **Instagram**: Reels, posts, and multi-media albums.
  - **YouTube**: Direct MP4 video and high-bitrate MP3 extraction.
  - **X / Twitter**: Multi-resolution video downloads.
  - **Facebook**: HD and SD video formats.
  - **Spotify & SoundCloud**: Audio track stream converter.
- **Zero AI-Slop Compliant**: No fake statistics, no fake testimonials, no template clutter, no em dash characters, and 100% functional interactive controls.
- **Local Download History**: Client-side storage of recent media downloads with quick reload actions.

## Tech Stack

- **Framework**: Next.js 15 (App Router, Server Actions & Route Handlers)
- **UI & Styling**: React 19, Tailwind CSS, Lucide Icons
- **Animation**: Framer Motion
- **Backend API**: Fastify REST engine with `kode-scrape` & `yt-dlp`

## Getting Started

### Development
```bash
npm install
npm run dev
```

### Production Build
```bash
npm run build
npm run start
```
