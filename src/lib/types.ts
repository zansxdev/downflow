export type PlatformId =
  | 'auto'
  | 'tiktok'
  | 'instagram'
  | 'youtube'
  | 'twitter'
  | 'facebook'
  | 'spotify'
  | 'soundcloud'
  | 'pinterest'
  | 'capcut'
  | 'threads';

export interface PlatformInfo {
  id: PlatformId;
  name: string;
  badge: string;
  color: string;
  examples: string[];
  placeholder: string;
}

export interface DownloadOption {
  id: string;
  label: string;
  format: 'mp4' | 'mp3' | 'jpg' | 'zip' | 'file';
  quality?: string;
  size?: string;
  url: string;
  downloadUrl?: string;
  isStream?: boolean;
}

export interface NormalizedMediaResult {
  id: string;
  platform: PlatformId;
  platformName: string;
  title: string;
  author?: {
    name?: string;
    username?: string;
    avatar?: string;
  };
  thumbnail?: string;
  duration?: string;
  description?: string;
  downloads: DownloadOption[];
  images?: string[];
  originalUrl: string;
  timestamp: number;
}

export interface DownloadHistoryItem {
  id: string;
  title: string;
  platform: PlatformId;
  platformName: string;
  thumbnail?: string;
  authorName?: string;
  originalUrl: string;
  timestamp: number;
}

export interface BatchQueueItem {
  id: string;
  url: string;
  platform: PlatformId;
  status: 'pending' | 'processing' | 'success' | 'error';
  result?: NormalizedMediaResult;
  error?: string;
}

