import { PlatformId, PlatformInfo } from './types';

export const PLATFORMS: PlatformInfo[] = [
  {
    id: 'auto',
    name: 'Auto Detect',
    badge: 'ALL',
    color: '#10B981',
    examples: ['tiktok.com', 'instagram.com', 'youtube.com', 'x.com', 'spotify.com'],
    placeholder: 'Paste any video, reels, or audio URL here...',
  },
  {
    id: 'tiktok',
    name: 'TikTok',
    badge: 'TT',
    color: '#00F2FE',
    examples: ['tiktok.com', 'vt.tiktok.com'],
    placeholder: 'Paste TikTok video or photo slide link...',
  },
  {
    id: 'instagram',
    name: 'Instagram',
    badge: 'IG',
    color: '#E1306C',
    examples: ['instagram.com/reel', 'instagram.com/p'],
    placeholder: 'Paste Instagram Reel, Post, or Story link...',
  },
  {
    id: 'youtube',
    name: 'YouTube',
    badge: 'YT',
    color: '#FF0000',
    examples: ['youtube.com/watch', 'youtu.be'],
    placeholder: 'Paste YouTube video or Shorts link...',
  },
  {
    id: 'twitter',
    name: 'X / Twitter',
    badge: 'X',
    color: '#FFFFFF',
    examples: ['x.com', 'twitter.com'],
    placeholder: 'Paste X / Twitter post link...',
  },
  {
    id: 'facebook',
    name: 'Facebook',
    badge: 'FB',
    color: '#1877F2',
    examples: ['facebook.com', 'fb.watch'],
    placeholder: 'Paste Facebook video or reel link...',
  },
  {
    id: 'spotify',
    name: 'Spotify',
    badge: 'SP',
    color: '#1DB954',
    examples: ['open.spotify.com/track'],
    placeholder: 'Paste Spotify track link or song title...',
  },
  {
    id: 'soundcloud',
    name: 'SoundCloud',
    badge: 'SC',
    color: '#FF5500',
    examples: ['soundcloud.com'],
    placeholder: 'Paste SoundCloud track link...',
  },
  {
    id: 'capcut',
    name: 'CapCut',
    badge: 'CC',
    color: '#FFFFFF',
    examples: ['capcut.com/template'],
    placeholder: 'Paste CapCut template link...',
  },
  {
    id: 'threads',
    name: 'Threads',
    badge: 'TH',
    color: '#FFFFFF',
    examples: ['threads.net/@'],
    placeholder: 'Paste Threads post link...',
  },
];

export function detectPlatform(url: string): PlatformId {
  if (!url || typeof url !== 'string') return 'auto';

  const clean = url.trim().toLowerCase();

  if (clean.includes('tiktok.com') || clean.includes('vt.tiktok.com')) return 'tiktok';
  if (clean.includes('instagram.com') || clean.includes('instagr.am')) return 'instagram';
  if (clean.includes('youtube.com') || clean.includes('youtu.be')) return 'youtube';
  if (clean.includes('twitter.com') || clean.includes('x.com')) return 'twitter';
  if (clean.includes('facebook.com') || clean.includes('fb.watch') || clean.includes('fb.com')) return 'facebook';
  if (clean.includes('spotify.com')) return 'spotify';
  if (clean.includes('soundcloud.com')) return 'soundcloud';
  if (clean.includes('pinterest.com') || clean.includes('pin.it')) return 'pinterest';
  if (clean.includes('capcut.com')) return 'capcut';
  if (clean.includes('threads.net')) return 'threads';

  return 'auto';
}

export function extractUrl(text: string): string {
  if (!text) return '';
  const match = text.match(/(https?:\/\/[^\s]+)/i);
  return match ? match[1].trim() : text.trim();
}
