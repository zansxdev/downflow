import fs from 'fs';
import path from 'path';

export interface ActivityLog {
  id: string;
  timestamp: number;
  type: 'download' | 'bot_blocked' | 'honeypot';
  platform?: string;
  title?: string;
  url?: string;
  success?: boolean;
  ip?: string;
  userAgent?: string;
  details?: string;
}

export interface AppStats {
  totalRequests: number;
  totalSuccess: number;
  totalFailed: number;
  totalBotsBlocked: number;
  totalHoneypotHits: number;
  byPlatform: Record<string, number>;
  recentLogs: ActivityLog[];
  updatedAt: number;
}

const DATA_DIR = path.join(process.cwd(), 'data');
const STATS_FILE = path.join(DATA_DIR, 'stats.json');

const INITIAL_STATS: AppStats = {
  totalRequests: 0,
  totalSuccess: 0,
  totalFailed: 0,
  totalBotsBlocked: 0,
  totalHoneypotHits: 0,
  byPlatform: {
    tiktok: 0,
    youtube: 0,
    instagram: 0,
    spotify: 0,
    twitter: 0,
    facebook: 0,
    soundcloud: 0,
    capcut: 0,
    threads: 0,
    pinterest: 0,
    other: 0,
  },
  recentLogs: [],
  updatedAt: Date.now(),
};

function ensureDataDir(): void {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

export function getStats(): AppStats {
  try {
    ensureDataDir();
    if (!fs.existsSync(STATS_FILE)) {
      fs.writeFileSync(STATS_FILE, JSON.stringify(INITIAL_STATS, null, 2), 'utf-8');
      return { ...INITIAL_STATS };
    }
    const content = fs.readFileSync(STATS_FILE, 'utf-8');
    const parsed = JSON.parse(content);
    return {
      ...INITIAL_STATS,
      ...parsed,
      byPlatform: { ...INITIAL_STATS.byPlatform, ...(parsed.byPlatform || {}) },
      recentLogs: Array.isArray(parsed.recentLogs) ? parsed.recentLogs : [],
    };
  } catch (err) {
    console.error('Failed to read stats.json:', err);
    return { ...INITIAL_STATS };
  }
}

function persistStats(stats: AppStats): void {
  try {
    ensureDataDir();
    stats.updatedAt = Date.now();
    // Keep max 100 recent logs to keep file light
    if (stats.recentLogs.length > 100) {
      stats.recentLogs = stats.recentLogs.slice(0, 100);
    }
    fs.writeFileSync(STATS_FILE, JSON.stringify(stats, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to save stats.json:', err);
  }
}

export function recordDownload(entry: {
  platform: string;
  url: string;
  title?: string;
  success: boolean;
  ip?: string;
  userAgent?: string;
}): void {
  const stats = getStats();
  stats.totalRequests += 1;
  if (entry.success) {
    stats.totalSuccess += 1;
  } else {
    stats.totalFailed += 1;
  }

  const p = (entry.platform || 'other').toLowerCase();
  stats.byPlatform[p] = (stats.byPlatform[p] || 0) + 1;

  const log: ActivityLog = {
    id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    timestamp: Date.now(),
    type: 'download',
    platform: entry.platform,
    title: entry.title || entry.url,
    url: entry.url,
    success: entry.success,
    ip: entry.ip || 'Unknown',
    userAgent: entry.userAgent || 'Unknown',
  };

  stats.recentLogs.unshift(log);
  persistStats(stats);
}

export function recordBotBlocked(entry: {
  userAgent: string;
  ip?: string;
  url?: string;
  reason?: string;
}): void {
  const stats = getStats();
  stats.totalBotsBlocked += 1;

  const log: ActivityLog = {
    id: `bot-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    timestamp: Date.now(),
    type: 'bot_blocked',
    ip: entry.ip || 'Unknown',
    userAgent: entry.userAgent,
    url: entry.url,
    details: entry.reason || 'Blocked by 418 Scraper Detector',
  };

  stats.recentLogs.unshift(log);
  persistStats(stats);
}

export function recordHoneypot(entry: {
  endpoint: string;
  ip?: string;
  userAgent?: string;
}): void {
  const stats = getStats();
  stats.totalHoneypotHits += 1;

  const log: ActivityLog = {
    id: `hp-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    timestamp: Date.now(),
    type: 'honeypot',
    ip: entry.ip || 'Unknown',
    userAgent: entry.userAgent || 'Unknown',
    details: `Accessed trap endpoint: ${entry.endpoint}`,
  };

  stats.recentLogs.unshift(log);
  persistStats(stats);
}

export function resetAllStats(): void {
  persistStats({ ...INITIAL_STATS, recentLogs: [] });
}
