'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Shield,
  ShieldAlert,
  Activity,
  Download,
  Bot,
  RefreshCw,
  LogOut,
  Trash2,
  Lock,
  CheckCircle2,
  XCircle,
  Server,
  ArrowUpRight,
  Filter,
} from 'lucide-react';
import { AppStats, ActivityLog } from '@/lib/stats';

interface ServerInfo {
  uptimeSeconds: number;
  memoryRssMb: number;
  memoryHeapMb: number;
  nodeVersion: string;
  timestamp: number;
}

export default function AdminPage() {
  const [pin, setPin] = useState('');
  const [isAuth, setIsAuth] = useState<boolean | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  const [stats, setStats] = useState<AppStats | null>(null);
  const [serverInfo, setServerInfo] = useState<ServerInfo | null>(null);
  const [isLoadingStats, setIsLoadingStats] = useState(false);
  const [filterType, setFilterType] = useState<'all' | 'download' | 'bot_blocked' | 'honeypot'>('all');
  const [confirmReset, setConfirmReset] = useState(false);

  const fetchStats = useCallback(async () => {
    setIsLoadingStats(true);
    try {
      const res = await fetch('/api/admin');
      const json = await res.json().catch(() => ({}));
      if (res.ok && json.status) {
        setStats(json.data.stats);
        setServerInfo(json.data.server);
        setIsAuth(true);
      } else {
        setIsAuth(false);
      }
    } catch {
      setIsAuth(false);
    } finally {
      setIsLoadingStats(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pin.trim()) return;

    setIsLoggingIn(true);
    setLoginError(null);

    try {
      const res = await fetch('/api/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'login', pin }),
      });

      const json = await res.json().catch(() => ({}));

      if (res.ok && json.status) {
        setIsAuth(true);
        setPin('');
        fetchStats();
      } else {
        setLoginError(json.message || 'PIN Admin tidak valid.');
      }
    } catch {
      setLoginError('Terjadi kesalahan saat memverifikasi PIN.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'logout' }),
      });
      setIsAuth(false);
      setStats(null);
    } catch {
      setIsAuth(false);
    }
  };

  const handleResetStats = async () => {
    try {
      const res = await fetch('/api/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'reset' }),
      });
      if (res.ok) {
        setConfirmReset(false);
        fetchStats();
      }
    } catch {
      // Failed
    }
  };

  const formatUptime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    if (hrs > 0) return `${hrs}j ${mins}m`;
    if (mins > 0) return `${mins}m ${secs}s`;
    return `${secs}s`;
  };

  // Loading state during initial auth check
  if (isAuth === null) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center text-zinc-500 font-mono text-xs">
        <RefreshCw className="w-4 h-4 animate-spin mr-2" />
        Memeriksa sesi admin...
      </div>
    );
  }

  // 1. PIN Login Screen
  if (!isAuth) {
    return (
      <div className="min-h-screen bg-[#050505] text-[#f4f4f5] flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-sm bg-[#0c0c10] border border-[#202026] rounded-xl p-6 space-y-5 shadow-2xl"
        >
          <div className="text-center space-y-1.5">
            <div className="inline-flex p-3 rounded-full bg-[#161620] text-zinc-300 border border-[#262634] mb-1">
              <Lock className="w-5 h-5" />
            </div>
            <h1 className="font-display text-xl font-bold text-white tracking-tight">
              DownFlow Control Deck
            </h1>
            <p className="text-xs text-zinc-400">
              Masukkan PIN Admin untuk melihat analitik dan log bot.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-3.5">
            <div>
              <input
                type="password"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                placeholder="Masukkan PIN Admin..."
                autoFocus
                className="w-full bg-[#121217] border border-[#242430] focus:border-zinc-400 rounded-lg px-3.5 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none font-mono"
              />
            </div>

            {loginError && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-xs text-red-400 bg-red-950/20 border border-red-900/40 rounded-md p-2 text-center"
              >
                {loginError}
              </motion.div>
            )}

            <button
              type="submit"
              disabled={isLoggingIn || !pin.trim()}
              className="w-full py-2.5 rounded-lg text-xs font-semibold text-black bg-white hover:bg-zinc-200 disabled:bg-zinc-800 disabled:text-zinc-600 transition-colors cursor-pointer"
            >
              {isLoggingIn ? 'Memverifikasi...' : 'Buka Dashboard'}
            </button>
          </form>

          <div className="pt-2 border-t border-[#181820] text-center">
            <a
              href="/"
              className="text-xs text-zinc-500 hover:text-zinc-300 font-mono transition-colors"
            >
              ← Kembali ke Web Downloader
            </a>
          </div>
        </motion.div>
      </div>
    );
  }

  // 2. Authenticated Dashboard
  const filteredLogs = (stats?.recentLogs || []).filter((log) => {
    if (filterType === 'all') return true;
    return log.type === filterType;
  });

  const totalReq = stats?.totalRequests || 0;
  const successRate = totalReq > 0 ? Math.round(((stats?.totalSuccess || 0) / totalReq) * 100) : 100;

  return (
    <div className="min-h-screen bg-[#050505] text-[#f4f4f5] px-4 py-8 max-w-6xl mx-auto space-y-6">
      {/* Top Header */}
      <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-[#181820]">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <h1 className="font-display text-2xl font-bold text-white tracking-tight">
              DownFlow Control Deck
            </h1>
            <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-mono bg-emerald-950/40 text-emerald-400 border border-emerald-800/40">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              LIVE
            </span>
          </div>
          <p className="text-xs text-zinc-400 font-mono">
            Dashboard statistik real-time &amp; pemantauan bot scraper @zansxart
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={fetchStats}
            disabled={isLoadingStats}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium text-zinc-300 bg-[#121218] hover:bg-[#1a1a24] border border-[#242430] transition-colors cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoadingStats ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>

          <button
            type="button"
            onClick={() => setConfirmReset(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium text-red-400 hover:text-red-300 bg-red-950/20 hover:bg-red-950/30 border border-red-900/40 transition-colors cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>

          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 px-3 py-1.5 rounded-md text-xs font-medium text-zinc-400 hover:text-white bg-[#121218] border border-[#242430] transition-colors"
          >
            <span>Buka Web</span>
            <ArrowUpRight className="w-3 h-3" />
          </a>

          <button
            type="button"
            onClick={handleLogout}
            className="p-1.5 rounded-md text-zinc-500 hover:text-white hover:bg-[#181820] transition-colors cursor-pointer"
            title="Keluar"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Confirmation Reset Modal */}
      <AnimatePresence>
        {confirmReset && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-[#0f0f14] border border-red-900/40 rounded-xl p-5 max-w-md w-full space-y-4 shadow-2xl"
            >
              <h3 className="text-sm font-bold text-red-400 flex items-center gap-2">
                <ShieldAlert className="w-4 h-4" />
                Konfirmasi Reset Data Statistik
              </h3>
              <p className="text-xs text-zinc-300 leading-relaxed">
                Apakah Anda yakin ingin menghapus seluruh rekaman statistik unduhan, riwayat bot, dan
                log honeypot? Tindakan ini tidak dapat dibatalkan.
              </p>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setConfirmReset(false)}
                  className="px-3 py-1.5 rounded text-xs text-zinc-400 hover:text-white bg-[#181822] border border-[#242430] cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={handleResetStats}
                  className="px-3 py-1.5 rounded text-xs font-semibold text-white bg-red-600 hover:bg-red-500 cursor-pointer"
                >
                  Ya, Bersihkan Semua
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 4 Big KPI Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="bg-[#0c0c10] border border-[#1e1e26] rounded-xl p-4 space-y-2">
          <div className="flex items-center justify-between text-zinc-500">
            <span className="text-xs font-mono uppercase">Total Unduhan</span>
            <Download className="w-4 h-4 text-zinc-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-white font-display">
            {stats?.totalRequests || 0}
          </div>
          <div className="flex items-center gap-2 text-[11px] font-mono text-zinc-500">
            <span className="text-emerald-400">{stats?.totalSuccess || 0} sukses</span>
            <span>•</span>
            <span className="text-red-400">{stats?.totalFailed || 0} gagal</span>
          </div>
        </div>

        <div className="bg-[#0c0c10] border border-[#1e1e26] rounded-xl p-4 space-y-2">
          <div className="flex items-center justify-between text-zinc-500">
            <span className="text-xs font-mono uppercase">Bot Di-Roast (418)</span>
            <Bot className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-amber-400 font-display">
            {stats?.totalBotsBlocked || 0}
          </div>
          <div className="text-[11px] font-mono text-zinc-500">
            Script python/curl dicegat
          </div>
        </div>

        <div className="bg-[#0c0c10] border border-[#1e1e26] rounded-xl p-4 space-y-2">
          <div className="flex items-center justify-between text-zinc-500">
            <span className="text-xs font-mono uppercase">Honeypot Trapped</span>
            <ShieldAlert className="w-4 h-4 text-red-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-red-400 font-display">
            {stats?.totalHoneypotHits || 0}
          </div>
          <div className="text-[11px] font-mono text-zinc-500">
            Crawler masuk jebakan betmen
          </div>
        </div>

        <div className="bg-[#0c0c10] border border-[#1e1e26] rounded-xl p-4 space-y-2">
          <div className="flex items-center justify-between text-zinc-500">
            <span className="text-xs font-mono uppercase">Tingkat Sukses</span>
            <Activity className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold text-emerald-400 font-display">
            {successRate}%
          </div>
          <div className="text-[11px] font-mono text-zinc-500">
            Rasio ekstraksi media lancar
          </div>
        </div>
      </div>

      {/* Middle Grid: Platform Breakdown + Server Telemetry */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Platform Breakdown (2 Cols) */}
        <div className="lg:col-span-2 bg-[#0c0c10] border border-[#1e1e26] rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-zinc-200 flex items-center gap-2">
              <Activity className="w-4 h-4 text-zinc-400" />
              Statistik Berdasarkan Platform
            </h2>
            <span className="text-xs font-mono text-zinc-500">
              {Object.values(stats?.byPlatform || {}).reduce((a, b) => a + b, 0)} total hit
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {[
              { id: 'youtube', name: 'YouTube', color: '#ef4444' },
              { id: 'tiktok', name: 'TikTok', color: '#00f2fe' },
              { id: 'instagram', name: 'Instagram', color: '#e1306c' },
              { id: 'spotify', name: 'Spotify', color: '#10b981' },
              { id: 'twitter', name: 'Twitter / X', color: '#f4f4f5' },
              { id: 'facebook', name: 'Facebook', color: '#3b82f6' },
            ].map((p) => {
              const count = stats?.byPlatform[p.id] || 0;
              const pct = totalReq > 0 ? Math.round((count / totalReq) * 100) : 0;

              return (
                <div
                  key={p.id}
                  className="bg-[#111116] border border-[#1c1c24] rounded-lg p-3 space-y-1.5"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-zinc-300 font-medium">{p.name}</span>
                    <span className="font-mono text-zinc-500">{pct}%</span>
                  </div>
                  <div className="text-lg font-bold font-display text-white">{count}</div>
                  <div className="w-full h-1 bg-[#1c1c24] rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${pct}%`, backgroundColor: p.color }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Server Telemetry */}
        <div className="bg-[#0c0c10] border border-[#1e1e26] rounded-xl p-5 space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <h2 className="text-sm font-bold text-zinc-200 flex items-center gap-2">
              <Server className="w-4 h-4 text-zinc-400" />
              Telemetri Server
            </h2>

            <div className="space-y-3 font-mono text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-[#181820]">
                <span className="text-zinc-500">Fastify Backend</span>
                <span className="text-emerald-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  Port 3050 OK
                </span>
              </div>

              <div className="flex items-center justify-between pb-2 border-b border-[#181820]">
                <span className="text-zinc-500">Next.js App</span>
                <span className="text-white">Port 3080 (PM2)</span>
              </div>

              <div className="flex items-center justify-between pb-2 border-b border-[#181820]">
                <span className="text-zinc-500">Node.js Runtime</span>
                <span className="text-zinc-300">{serverInfo?.nodeVersion || 'v22.x'}</span>
              </div>

              <div className="flex items-center justify-between pb-2 border-b border-[#181820]">
                <span className="text-zinc-500">Memory RSS / Heap</span>
                <span className="text-zinc-300">
                  {serverInfo?.memoryRssMb || 0} MB / {serverInfo?.memoryHeapMb || 0} MB
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-zinc-500">Server Uptime</span>
                <span className="text-zinc-200">
                  {formatUptime(serverInfo?.uptimeSeconds || 0)}
                </span>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-[#181820] text-[11px] text-zinc-500 font-mono">
            Host: 104.234.26.109 • SSL Let&apos;s Encrypt
          </div>
        </div>
      </div>

      {/* Activity & Bot Traps Log Feed */}
      <div className="bg-[#0c0c10] border border-[#1e1e26] rounded-xl p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#181820]">
          <div>
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Shield className="w-4 h-4 text-zinc-400" />
              Live Activity &amp; Security Logs
            </h2>
            <p className="text-xs text-zinc-500 font-mono">
              Rekaman aktivitas download dan bot scraper yang tertangkap
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto">
            <span className="text-zinc-500 text-xs flex items-center gap-1 pr-1">
              <Filter className="w-3 h-3" />
            </span>
            {[
              { id: 'all', label: 'Semua' },
              { id: 'download', label: 'Unduhan' },
              { id: 'bot_blocked', label: 'Bot 418' },
              { id: 'honeypot', label: 'Honeypot' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setFilterType(tab.id as any)}
                className={`px-2.5 py-1 rounded text-xs font-mono cursor-pointer transition-colors ${
                  filterType === tab.id
                    ? 'bg-white text-black font-bold'
                    : 'bg-[#14141a] text-zinc-400 hover:text-white border border-[#22222a]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Logs Table / List */}
        <div className="overflow-x-auto">
          {filteredLogs.length === 0 ? (
            <div className="py-12 text-center text-zinc-500 font-mono text-xs">
              Belum ada aktivitas yang terekam pada filter ini.
            </div>
          ) : (
            <div className="space-y-2">
              {filteredLogs.map((log: ActivityLog) => {
                const dateStr = new Date(log.timestamp).toLocaleTimeString();

                return (
                  <div
                    key={log.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 rounded-lg bg-[#111116] border border-[#1e1e24] hover:border-zinc-700 transition-colors text-xs font-mono"
                  >
                    <div className="flex items-center gap-2.5 min-w-0 flex-1">
                      {log.type === 'download' && log.success && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      )}
                      {log.type === 'download' && !log.success && (
                        <XCircle className="w-4 h-4 text-red-400 shrink-0" />
                      )}
                      {log.type === 'bot_blocked' && (
                        <Bot className="w-4 h-4 text-amber-400 shrink-0" />
                      )}
                      {log.type === 'honeypot' && (
                        <ShieldAlert className="w-4 h-4 text-red-400 shrink-0" />
                      )}

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase ${
                              log.type === 'download'
                                ? 'bg-zinc-800 text-zinc-300'
                                : log.type === 'bot_blocked'
                                ? 'bg-amber-950/40 text-amber-400 border border-amber-900/40'
                                : 'bg-red-950/40 text-red-400 border border-red-900/40'
                            }`}
                          >
                            {log.type === 'download'
                              ? log.platform || 'MEDIA'
                              : log.type === 'bot_blocked'
                              ? 'BOT 418'
                              : 'HONEYPOT'}
                          </span>

                          <p className="text-zinc-200 truncate font-sans text-xs">
                            {log.title || log.details || log.url}
                          </p>
                        </div>

                        <div className="flex items-center gap-2 text-[10px] text-zinc-500 mt-0.5">
                          <span>IP: {log.ip || 'Unknown'}</span>
                          {log.userAgent && (
                            <>
                              <span>•</span>
                              <span className="truncate max-w-xs">{log.userAgent}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="text-zinc-500 shrink-0 text-[11px]">{dateStr}</div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
