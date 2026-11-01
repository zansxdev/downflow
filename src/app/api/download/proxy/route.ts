import { NextRequest, NextResponse } from 'next/server';
import { spawn } from 'child_process';
import { Readable } from 'stream';

const BACKEND_URL = process.env.BACKEND_API_URL || 'http://localhost:3050';
const BACKEND_KEY = process.env.BACKEND_API_KEY || 'downflow_internal_secret_2026';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const targetUrl = searchParams.get('url');
  const type = searchParams.get('type') || 'ytmp4';

  if (!targetUrl) {
    return NextResponse.json({ status: false, message: 'URL is required' }, { status: 400 });
  }

  // 1. Dynamic on-the-fly audio extraction (MP3) from ANY video stream via ffmpeg
  if (type === 'audio') {
    const rawTitle = searchParams.get('title') || 'audio_track';
    const cleanTitle = rawTitle
      .replace(/[^a-zA-Z0-9_\-\s]/g, '')
      .trim()
      .substring(0, 60) || 'media_audio';

    try {
      const ffmpeg = spawn('ffmpeg', [
        '-reconnect', '1',
        '-reconnect_at_eof', '1',
        '-reconnect_streamed', '1',
        '-user_agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        '-i', targetUrl,
        '-vn',                   // strip video
        '-acodec', 'libmp3lame', // encode mp3
        '-b:a', '192k',          // high quality bitrate
        '-ar', '44100',          // 44.1kHz sample rate
        '-f', 'mp3',             // force mp3 container
        'pipe:1',
      ]);

      // Kill ffmpeg process cleanly if the client aborts/disconnects
      request.signal.addEventListener('abort', () => {
        try {
          ffmpeg.kill('SIGTERM');
        } catch {
          // Ignored
        }
      });

      // Ignore stderr noise
      ffmpeg.stderr.on('data', () => {});

      const webStream = Readable.toWeb(ffmpeg.stdout);

      return new Response(webStream as unknown as ReadableStream, {
        status: 200,
        headers: {
          'Content-Type': 'audio/mpeg',
          'Content-Disposition': `attachment; filename="${cleanTitle}.mp3"`,
          'Cache-Control': 'public, max-age=86400',
          'X-Extractor': 'DownFlow-FFmpeg-Audio-Engine',
        },
      });
    } catch (err: any) {
      console.error('Audio conversion error:', err);
      return NextResponse.json(
        { status: false, message: 'Gagal mengekstrak audio dari video: ' + err.message },
        { status: 500 }
      );
    }
  }

  // 2. Upstream YouTube streaming proxy
  const endpoint = type === 'ytmp3' ? '/api/download/ytmp3' : '/api/download/ytmp4';
  const streamUrl = new URL(endpoint, BACKEND_URL);
  streamUrl.searchParams.set('url', targetUrl);

  try {
    const upstreamRes = await fetch(streamUrl.toString(), {
      signal: request.signal,
      headers: {
        'X-API-Key': BACKEND_KEY,
      },
    });

    if (!upstreamRes.ok) {
      const err = await upstreamRes.text();
      return NextResponse.json({ status: false, message: err }, { status: upstreamRes.status });
    }

    const headers = new Headers();
    upstreamRes.headers.forEach((value, key) => {
      headers.set(key, value);
    });

    return new Response(upstreamRes.body, {
      status: upstreamRes.status,
      headers,
    });
  } catch (err: any) {
    if (err.name === 'AbortError' || err.code === 'UND_ERR_ABORTED') {
      return new Response(null, { status: 499 });
    }
    return NextResponse.json({ status: false, message: err.message }, { status: 500 });
  }
}
