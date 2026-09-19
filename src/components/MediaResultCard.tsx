'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Download,
  Copy,
  Check,
  Film,
  Music,
  Image as ImageIcon,
  ExternalLink,
  User,
  Clock,
} from 'lucide-react';
import { NormalizedMediaResult, DownloadOption } from '@/lib/types';

interface MediaResultCardProps {
  result: NormalizedMediaResult;
  onReset: () => void;
}

export const MediaResultCard: React.FC<MediaResultCardProps> = ({ result, onReset }) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(
    result.images && result.images.length > 0 ? result.images[0] : null
  );

  const handleCopyLink = async (opt: DownloadOption) => {
    try {
      await navigator.clipboard.writeText(opt.url);
      setCopiedId(opt.id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      // Fallback
    }
  };

  const handleDownload = (opt: DownloadOption) => {
    setDownloadingId(opt.id);
    setTimeout(() => setDownloadingId(null), 3000);

    const link = document.createElement('a');
    link.href = opt.downloadUrl || opt.url;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.setAttribute('download', `${result.title.substring(0, 30)}.${opt.format}`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.97 }}
      transition={{ type: 'spring', damping: 20, stiffness: 150 }}
      className="w-full bg-[#0c0c10]/95 backdrop-blur-md border border-[#202026] rounded-xl p-5 sm:p-6 space-y-6 shadow-2xl"
    >
      {/* Media Info */}
      <div className="flex flex-col sm:flex-row gap-5">
        <motion.div
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
          className="relative w-full sm:w-52 h-44 sm:h-52 bg-[#121217] rounded-lg overflow-hidden border border-[#222228] shrink-0 flex items-center justify-center"
        >
          {previewImage || result.thumbnail ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={previewImage || result.thumbnail}
              alt={result.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="flex flex-col items-center gap-1.5 text-zinc-600">
              <Film className="w-8 h-8" />
              <span className="text-xs font-mono">Pratinjau Media</span>
            </div>
          )}

          <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/90 text-[10px] font-mono font-bold text-white uppercase tracking-wider">
            {result.platformName}
          </div>

          {result.duration && (
            <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/90 text-[10px] font-mono text-zinc-300 flex items-center gap-1">
              <Clock className="w-3 h-3 text-zinc-400" />
              <span>{result.duration}</span>
            </div>
          )}
        </motion.div>

        <div className="flex-1 flex flex-col justify-between space-y-3">
          <div className="space-y-2">
            <h2 className="text-base sm:text-lg font-bold text-zinc-100 line-clamp-3 leading-snug">
              {result.title}
            </h2>

            {result.author && (result.author.name || result.author.username) && (
              <div className="flex items-center gap-2 text-xs text-zinc-400">
                {result.author.avatar ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={result.author.avatar}
                    alt={result.author.name || 'Author'}
                    className="w-5 h-5 rounded-full object-cover border border-zinc-700"
                  />
                ) : (
                  <User className="w-3.5 h-3.5 text-zinc-500" />
                )}
                <span className="text-zinc-300 font-medium">{result.author.name}</span>
                {result.author.username && (
                  <span className="text-zinc-500 font-mono">@{result.author.username}</span>
                )}
              </div>
            )}
          </div>

          {result.images && result.images.length > 0 && (
            <div className="space-y-1.5">
              <span className="text-[11px] font-mono text-zinc-400">
                Foto Slide ({result.images.length} item):
              </span>
              <div className="flex items-center gap-1.5 overflow-x-auto py-1 no-scrollbar">
                {result.images.map((imgUrl, i) => (
                  <motion.button
                    key={i}
                    type="button"
                    onClick={() => setPreviewImage(imgUrl)}
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.95 }}
                    className={`relative w-11 h-11 rounded overflow-hidden shrink-0 border cursor-pointer ${
                      previewImage === imgUrl
                        ? 'border-white ring-1 ring-white'
                        : 'border-zinc-800 opacity-60 hover:opacity-100'
                    }`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={imgUrl} alt={`Slide ${i + 1}`} className="w-full h-full object-cover" />
                  </motion.button>
                ))}
              </div>
            </div>
          )}

          <div className="pt-2 flex items-center justify-between border-t border-[#1a1a20]">
            <a
              href={result.originalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs text-zinc-500 hover:text-zinc-300 font-mono transition-colors"
            >
              <span>Sumber Asli</span>
              <ExternalLink className="w-3 h-3" />
            </a>

            <button
              type="button"
              onClick={onReset}
              className="text-xs text-zinc-400 hover:text-white transition-colors cursor-pointer"
            >
              Ganti Link
            </button>
          </div>
        </div>
      </div>

      {/* Download Options List with Stagger */}
      <div className="space-y-2 pt-2 border-t border-[#1a1a20]">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono uppercase text-zinc-400 font-semibold">
            Pilihan Unduhan
          </span>
          <span className="text-[11px] font-mono text-zinc-500">
            {result.downloads.length} opsi tersedia
          </span>
        </div>

        <motion.div
          initial="hidden"
          animate="show"
          variants={{
            hidden: { opacity: 0 },
            show: {
              opacity: 1,
              transition: { staggerChildren: 0.06 },
            },
          }}
          className="grid grid-cols-1 sm:grid-cols-2 gap-2"
        >
          {result.downloads.map((opt) => {
            const isCopied = copiedId === opt.id;
            const isDownloading = downloadingId === opt.id;

            return (
              <motion.div
                key={opt.id}
                variants={{
                  hidden: { opacity: 0, y: 10 },
                  show: { opacity: 1, y: 0 },
                }}
                className="flex items-center justify-between p-3 rounded-lg bg-[#111116] border border-[#1e1e24] hover:border-zinc-700 transition-colors"
              >
                <div className="flex items-center gap-2.5 min-w-0 pr-2">
                  {opt.format === 'mp3' ? (
                    <Music className="w-4 h-4 text-zinc-400 shrink-0" />
                  ) : opt.format === 'jpg' ? (
                    <ImageIcon className="w-4 h-4 text-zinc-400 shrink-0" />
                  ) : (
                    <Film className="w-4 h-4 text-zinc-400 shrink-0" />
                  )}
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-zinc-200 truncate">{opt.label}</p>
                    <div className="flex items-center gap-1.5 text-[10px] font-mono text-zinc-500">
                      <span className="uppercase text-zinc-400">{opt.format}</span>
                      {opt.quality && (
                        <>
                          <span>•</span>
                          <span className="text-zinc-300">{opt.quality}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <motion.button
                    type="button"
                    onClick={() => handleCopyLink(opt)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-1.5 rounded text-zinc-400 hover:text-white bg-[#181820] hover:bg-[#22222a] border border-[#262630] transition-colors cursor-pointer"
                    title="Salin tautan langsung"
                  >
                    {isCopied ? (
                      <Check className="w-3.5 h-3.5 text-zinc-200" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </motion.button>

                  <motion.button
                    type="button"
                    onClick={() => handleDownload(opt)}
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.96 }}
                    className="flex items-center gap-1 px-3 py-1.5 rounded text-xs font-semibold text-black bg-white hover:bg-zinc-200 transition-colors cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>{isDownloading ? 'Membuka...' : 'Unduh'}</span>
                  </motion.button>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </motion.div>
  );
};
