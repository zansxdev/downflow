import { NextRequest, NextResponse } from 'next/server';
import { detectPlatform, extractUrl } from '@/lib/url-detector';
import { NormalizedMediaResult, PlatformId, DownloadOption } from '@/lib/types';
import { recordDownload, recordBotBlocked } from '@/lib/stats';

const BACKEND_URL = process.env.BACKEND_API_URL || 'http://localhost:3050';
const BACKEND_KEY = process.env.BACKEND_API_KEY || 'downflow_internal_secret_2026';

function sanitizeMediaUrl(rawUrl: string): string {
  if (!rawUrl || typeof rawUrl !== 'string') return '';
  const trimmed = rawUrl.trim();

  // Rewrite any local Fastify URLs to the public Next.js streaming proxy
  if (trimmed.includes('localhost:3050') || trimmed.includes('127.0.0.1:3050')) {
    try {
      const parsed = new URL(trimmed);
      const targetParam = parsed.searchParams.get('url') || '';
      if (parsed.pathname.includes('/ytmp3')) {
        return `/api/download/proxy?type=ytmp3&url=${encodeURIComponent(targetParam)}`;
      }
      if (parsed.pathname.includes('/ytmp4')) {
        return `/api/download/proxy?type=ytmp4&url=${encodeURIComponent(targetParam)}`;
      }
    } catch {
      // Fallback
    }
  }

  return trimmed;
}

export async function GET(request: NextRequest) {
  return NextResponse.json(
    {
      status: false,
      code: 418,
      roast: 'NGAPAIN GET KE SINI BANG? WKWKWK! 😂',
      message:
        'Mau ngintip parameter ya? Endpoint ini cuma nerima request resmi dari web DownFlow. Bikin downloader sendiri jangan manja nyolong endpoint orang wkwk.',
      creator: 'zansxart',
      tips: 'Sungkem dulu ke @zansxart di GitHub (https://github.com/zansxart) atau traktir kopi.',
      rickroll: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    },
    {
      status: 418,
      headers: {
        'X-Roast': 'Ngapain nge-probe GET ke downloader endpoint dek wkwk',
      },
    }
  );
}

export async function POST(request: NextRequest) {
  try {
    const userAgent = (request.headers.get('user-agent') || '').toLowerCase();
    const clientFlow = request.headers.get('x-client-flow');

    const isKnownBot =
      userAgent.includes('python') ||
      userAgent.includes('requests') ||
      userAgent.includes('scrapy') ||
      userAgent.includes('aiohttp') ||
      userAgent.includes('go-http') ||
      userAgent.includes('postman') ||
      userAgent.includes('insomnia') ||
      userAgent.includes('curl') ||
      userAgent.includes('wget') ||
      userAgent.includes('httpie') ||
      userAgent.includes('node-fetch') ||
      userAgent.includes('axios');

    // Bot detection: if it's a known scraper and missing legitimate frontend flow header
    if (isKnownBot && clientFlow !== 'downflow-web-v1') {
      const clientIp =
        request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
        request.headers.get('x-real-ip') ||
        'Unknown';
      const detectedBot = userAgent.slice(0, 40) || 'Scraper Script';
      
      recordBotBlocked({
        userAgent,
        ip: clientIp,
        reason: `Blocked scraper bot: ${detectedBot}`,
      });

      return NextResponse.json(
        {
          status: false,
          code: 418,
          roast: 'CIEEE KETAHUAN NGE-SCRAPE PAKE BOT WKWKWK! 😂',
          message: `Lu kira gua gatau lu pake script bot (${detectedBot}) buat nembak endpoint ini? Minimal modal browser lah bjir! Bikin downloader sendiri jangan manja nyolong endpoint orang wkwk.`,
          creator: 'zansxart',
          tips: 'Sungkem dulu ke @zansxart di GitHub (https://github.com/zansxart) atau traktir kopi biar dapet restu.',
          rickroll: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        },
        {
          status: 418,
          headers: {
            'X-Roast': 'Ciee ketahuan nge-scrape pake bot wkwk',
            'X-Anti-Bot': 'Active',
          },
        }
      );
    }

    const body = await request.json().catch(() => ({}));
    let rawUrl = String(body.url || '').trim();
    let requestedPlatform = (body.platform || 'auto') as PlatformId;

    if (!rawUrl) {
      return NextResponse.json(
        { status: false, message: 'URL target tidak boleh kosong.' },
        { status: 400 }
      );
    }

    const cleanUrl = extractUrl(rawUrl);
    const platform = requestedPlatform === 'auto' ? detectPlatform(cleanUrl) : requestedPlatform;

    if (platform === 'auto') {
      return NextResponse.json(
        {
          status: false,
          message:
            'Platform tidak dikenali. Masukkan link TikTok, Instagram, YouTube, X, Facebook, atau Spotify yang valid.',
        },
        { status: 400 }
      );
    }

    let endpoint = '';

    switch (platform) {
      case 'tiktok':
        endpoint = '/api/download/tiktok';
        break;

      case 'instagram':
        endpoint = '/api/download/instagram';
        break;

      case 'youtube':
        endpoint = '/api/download/ytmp4';
        break;

      case 'twitter':
        endpoint = '/api/download/twitter';
        break;

      case 'facebook':
        endpoint = '/api/download/facebook';
        break;

      case 'spotify':
        endpoint = '/api/download/spotify';
        break;

      case 'soundcloud':
        endpoint = '/api/download/soundcloud';
        break;

      case 'capcut':
        endpoint = '/api/download/capcut';
        break;

      case 'threads':
        endpoint = '/api/download/threads';
        break;

      case 'pinterest':
        endpoint = '/api/download/pindl';
        break;

      default:
        endpoint = '/api/download/aio';
    }

    // All Fastify download handlers natively parse query parameters
    const fetchUrl = new URL(endpoint, BACKEND_URL);
    fetchUrl.searchParams.set('url', cleanUrl);

    if (platform === 'youtube') {
      fetchUrl.searchParams.set('preview', 'true');
    }

    const headers: Record<string, string> = {
      'X-API-Key': BACKEND_KEY,
      Accept: 'application/json',
    };

    const response = await fetch(fetchUrl.toString(), {
      method: 'GET',
      headers,
      cache: 'no-store',
      signal: AbortSignal.timeout(30000),
    });

    const data = await response.json().catch(() => null);

    const clientIp =
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      request.headers.get('x-real-ip') ||
      'Unknown';

    if (!response.ok || !data || data.status === false) {
      const errorMsg =
        data?.message ||
        `Gagal mengambil media dari ${platform}. Pastikan konten publik dan dapat diakses.`;

      recordDownload({
        platform,
        url: cleanUrl,
        success: false,
        ip: clientIp,
        userAgent,
      });

      return NextResponse.json(
        { status: false, message: errorMsg },
        { status: response.status >= 400 && response.status < 500 ? response.status : 422 }
      );
    }

    const normalized = normalizeResult(platform, cleanUrl, data);

    recordDownload({
      platform,
      url: cleanUrl,
      title: normalized.title,
      success: true,
      ip: clientIp,
      userAgent,
    });

    return NextResponse.json({
      status: true,
      data: normalized,
    });
  } catch (err: any) {
    console.error('Downloader API error:', err);
    const isTimeout = err?.name === 'TimeoutError' || err?.message?.includes('aborted');
    return NextResponse.json(
      {
        status: false,
        message: isTimeout
          ? 'Waktu proses habis saat menghubungi server. Silakan coba sesaat lagi.'
          : err.message || 'Terjadi kesalahan saat memproses link download.',
      },
      { status: isTimeout ? 504 : 500 }
    );
  }
}

function normalizeResult(platform: PlatformId, originalUrl: string, raw: any): NormalizedMediaResult {
  const payload = raw.data || raw.result || raw;
  const downloads: DownloadOption[] = [];

  const title = payload.title || payload.caption || payload.desc || 'Media Download';
  let thumbnail = payload.thumbnail || payload.cover || payload.thumb || '';

  const authorName =
    typeof payload.author === 'string'
      ? payload.author
      : payload.author?.name || payload.author?.nickname || payload.uploader || payload.artis || 'Creator';

  const authorUsername =
    typeof payload.author === 'string'
      ? ''
      : payload.author?.username || payload.author?.unique_id || '';

  const authorAvatar =
    typeof payload.author === 'object'
      ? payload.author?.avatar || payload.author?.avatar_thumb?.url_list?.[0] || ''
      : '';

  const author = {
    name: authorName,
    username: authorUsername,
    avatar: authorAvatar,
  };

  const duration = payload.duration
    ? typeof payload.duration === 'number'
      ? `${payload.duration}s`
      : String(payload.duration)
    : payload.durasi || undefined;

  let images: string[] = [];

  if (platform === 'tiktok') {
    const videoUrl = sanitizeMediaUrl(
      payload.video || (typeof payload.result === 'string' ? payload.result : '')
    );

    if (videoUrl) {
      downloads.push({
        id: 'tt-video-nowm',
        label: 'Video Tanpa Watermark',
        format: 'mp4',
        quality: 'HD',
        url: videoUrl,
        downloadUrl: videoUrl,
      });
    }

    if (payload.audio) {
      const audioUrl = sanitizeMediaUrl(payload.audio);
      downloads.push({
        id: 'tt-audio',
        label: 'Audio Musik (MP3)',
        format: 'mp3',
        url: audioUrl,
        downloadUrl: audioUrl,
      });
    }

    if (payload.images && Array.isArray(payload.images) && payload.images.length > 0) {
      images = payload.images.map(sanitizeMediaUrl);
      images.forEach((imgUrl: string, idx: number) => {
        downloads.push({
          id: `tt-image-${idx + 1}`,
          label: `Foto Slide #${idx + 1}`,
          format: 'jpg',
          url: imgUrl,
          downloadUrl: imgUrl,
        });
      });
    }
  } else if (platform === 'instagram') {
    const list = Array.isArray(payload) ? payload : [payload];
    list.forEach((item: any, idx: number) => {
      const rawMedia = item.url || item.download_url || item.video || item.image || item;
      const mediaUrl = sanitizeMediaUrl(rawMedia);
      const isVideo =
        item.type === 'video' ||
        (typeof mediaUrl === 'string' && (mediaUrl.includes('.mp4') || mediaUrl.includes('video')));

      if (mediaUrl) {
        downloads.push({
          id: `ig-media-${idx + 1}`,
          label: isVideo ? `Video Reels / Post #${idx + 1}` : `Foto Instagram #${idx + 1}`,
          format: isVideo ? 'mp4' : 'jpg',
          quality: 'Original HD',
          url: mediaUrl,
          downloadUrl: mediaUrl,
        });
        if (!thumbnail && !isVideo) {
          thumbnail = mediaUrl;
        }
      }
    });
  } else if (platform === 'youtube') {
    const ytMp4Url = `/api/download/proxy?type=ytmp4&url=${encodeURIComponent(originalUrl)}`;
    const ytMp3Url = `/api/download/proxy?type=ytmp3&url=${encodeURIComponent(originalUrl)}`;

    downloads.push({
      id: 'yt-video-mp4',
      label: 'Video MP4',
      format: 'mp4',
      quality: '720p HD',
      url: ytMp4Url,
      downloadUrl: ytMp4Url,
      isStream: true,
    });

    downloads.push({
      id: 'yt-audio-mp3',
      label: 'Audio MP3',
      format: 'mp3',
      quality: 'HQ 320kbps',
      url: ytMp3Url,
      downloadUrl: ytMp3Url,
      isStream: true,
    });
  } else if (platform === 'twitter') {
    if (Array.isArray(payload)) {
      payload.forEach((v: any, idx: number) => {
        const twUrl = sanitizeMediaUrl(v.url || v);
        if (twUrl) {
          downloads.push({
            id: `tw-video-${idx + 1}`,
            label: v.quality ? `Video (${v.quality})` : `Video MP4 #${idx + 1}`,
            format: 'mp4',
            quality: v.quality || 'HD',
            url: twUrl,
            downloadUrl: twUrl,
          });
        }
      });
    } else if (payload.url || payload.video) {
      const twUrl = sanitizeMediaUrl(payload.url || payload.video);
      downloads.push({
        id: 'tw-video',
        label: 'Video Twitter / X',
        format: 'mp4',
        quality: 'HD',
        url: twUrl,
        downloadUrl: twUrl,
      });
    }
  } else if (platform === 'facebook') {
    if (payload.hd || payload.video_hd) {
      const hdUrl = sanitizeMediaUrl(payload.hd || payload.video_hd);
      downloads.push({
        id: 'fb-video-hd',
        label: 'Video Facebook HD',
        format: 'mp4',
        quality: '1080p HD',
        url: hdUrl,
        downloadUrl: hdUrl,
      });
    }
    if (payload.sd || payload.video_sd) {
      const sdUrl = sanitizeMediaUrl(payload.sd || payload.video_sd);
      downloads.push({
        id: 'fb-video-sd',
        label: 'Video Facebook SD',
        format: 'mp4',
        quality: 'SD Standard',
        url: sdUrl,
        downloadUrl: sdUrl,
      });
    }
  } else if (platform === 'spotify') {
    const rawAudio = payload.download || payload.url || payload.audio;
    if (rawAudio) {
      const spAudio = sanitizeMediaUrl(rawAudio);
      downloads.push({
        id: 'sp-audio-mp3',
        label: 'Audio Spotify (MP3)',
        format: 'mp3',
        quality: '320kbps',
        url: spAudio,
        downloadUrl: spAudio,
      });
    }
    if (payload.image && !thumbnail) {
      thumbnail = payload.image;
    }
  } else {
    const genericUrl = sanitizeMediaUrl(payload.url || payload.video || payload.link);
    if (genericUrl) {
      downloads.push({
        id: 'generic-media',
        label: 'Download Media',
        format: 'mp4',
        url: genericUrl,
        downloadUrl: genericUrl,
      });
    }
  }

  if (downloads.length === 0 && payload.url) {
    const fallbackUrl = sanitizeMediaUrl(payload.url);
    downloads.push({
      id: 'fallback-download',
      label: 'Download File',
      format: 'file',
      url: fallbackUrl,
      downloadUrl: fallbackUrl,
    });
  }

  return {
    id: `dl-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    platform,
    platformName: platform.toUpperCase(),
    title,
    author,
    thumbnail,
    duration,
    description: payload.description || undefined,
    downloads,
    images: images.length > 0 ? images : undefined,
    originalUrl,
    timestamp: Date.now(),
  };
}
