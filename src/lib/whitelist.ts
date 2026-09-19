import fs from 'fs';
import path from 'path';

export interface WhitelistEntry {
  id: string;
  ip: string;
  label: string;
  createdAt: number;
  bypassBotBlock: boolean;
  allowAdmin: boolean;
}

const DATA_DIR = path.join(process.cwd(), 'data');
const WHITELIST_FILE = path.join(DATA_DIR, 'whitelist.json');

const DEFAULT_WHITELIST: WhitelistEntry[] = [
  {
    id: 'wl-localhost-v4',
    ip: '127.0.0.1',
    label: 'Localhost IPv4',
    createdAt: Date.now(),
    bypassBotBlock: true,
    allowAdmin: true,
  },
  {
    id: 'wl-localhost-v6',
    ip: '::1',
    label: 'Localhost IPv6',
    createdAt: Date.now(),
    bypassBotBlock: true,
    allowAdmin: true,
  },
];

function ensureDataDir(): void {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

export function cleanIp(rawIp?: string | null): string {
  if (!rawIp) return '';
  let ip = rawIp.trim();
  // Strip IPv4-mapped IPv6 prefix ::ffff:
  if (ip.startsWith('::ffff:')) {
    ip = ip.substring(7);
  }
  return ip;
}

export function getClientIpFromHeaders(headers: Headers): string {
  const forwardedFor = headers.get('x-forwarded-for');
  if (forwardedFor) {
    const firstIp = forwardedFor.split(',')[0].trim();
    if (firstIp) return cleanIp(firstIp);
  }

  const realIp = headers.get('x-real-ip');
  if (realIp) return cleanIp(realIp);

  const cfIp = headers.get('cf-connecting-ip');
  if (cfIp) return cleanIp(cfIp);

  return '127.0.0.1';
}

export function getWhitelist(): WhitelistEntry[] {
  try {
    ensureDataDir();
    if (!fs.existsSync(WHITELIST_FILE)) {
      fs.writeFileSync(WHITELIST_FILE, JSON.stringify(DEFAULT_WHITELIST, null, 2), 'utf-8');
      return [...DEFAULT_WHITELIST];
    }
    const content = fs.readFileSync(WHITELIST_FILE, 'utf-8');
    const parsed = JSON.parse(content);
    return Array.isArray(parsed) ? parsed : [...DEFAULT_WHITELIST];
  } catch (err) {
    console.error('Failed to read whitelist.json:', err);
    return [...DEFAULT_WHITELIST];
  }
}

function persistWhitelist(entries: WhitelistEntry[]): void {
  try {
    ensureDataDir();
    fs.writeFileSync(WHITELIST_FILE, JSON.stringify(entries, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to write whitelist.json:', err);
  }
}

export function isIpWhitelisted(
  rawIp: string | null | undefined,
  scope: 'bypassBotBlock' | 'allowAdmin' = 'bypassBotBlock'
): boolean {
  const ip = cleanIp(rawIp);
  if (!ip) return false;

  const list = getWhitelist();
  return list.some((entry) => {
    const entryIp = cleanIp(entry.ip);
    const matches = entryIp === ip || entryIp === '*' || (entryIp.endsWith('.*') && ip.startsWith(entryIp.slice(0, -1)));
    if (!matches) return false;

    if (scope === 'bypassBotBlock') return entry.bypassBotBlock !== false;
    if (scope === 'allowAdmin') return entry.allowAdmin !== false;
    return true;
  });
}

export function addWhitelistEntry(params: {
  ip: string;
  label?: string;
  bypassBotBlock?: boolean;
  allowAdmin?: boolean;
}): WhitelistEntry {
  const ip = cleanIp(params.ip);
  if (!ip) {
    throw new Error('Alamat IP tidak valid.');
  }

  const list = getWhitelist();
  // Check if IP already exists
  const existing = list.find((e) => cleanIp(e.ip) === ip);
  if (existing) {
    existing.label = params.label || existing.label;
    existing.bypassBotBlock = params.bypassBotBlock ?? existing.bypassBotBlock;
    existing.allowAdmin = params.allowAdmin ?? existing.allowAdmin;
    persistWhitelist(list);
    return existing;
  }

  const newEntry: WhitelistEntry = {
    id: `wl-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    ip,
    label: params.label?.trim() || `IP Whitelist (${ip})`,
    createdAt: Date.now(),
    bypassBotBlock: params.bypassBotBlock ?? true,
    allowAdmin: params.allowAdmin ?? true,
  };

  list.unshift(newEntry);
  persistWhitelist(list);
  return newEntry;
}

export function removeWhitelistEntry(id: string): boolean {
  const list = getWhitelist();
  const initialLength = list.length;
  const filtered = list.filter((e) => e.id !== id);
  if (filtered.length !== initialLength) {
    persistWhitelist(filtered);
    return true;
  }
  return false;
}
