import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_API_URL || 'http://localhost:3050';
const BACKEND_KEY = process.env.BACKEND_API_KEY || 'downflow_internal_secret_2026';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const targetUrl = searchParams.get('url');
  const type = searchParams.get('type') || 'ytmp4';

  if (!targetUrl) {
    return NextResponse.json({ status: false, message: 'URL is required' }, { status: 400 });
  }

  const endpoint = type === 'ytmp3' ? '/api/download/ytmp3' : '/api/download/ytmp4';
  const streamUrl = new URL(endpoint, BACKEND_URL);
  streamUrl.searchParams.set('url', targetUrl);

  try {
    const upstreamRes = await fetch(streamUrl.toString(), {
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
    return NextResponse.json({ status: false, message: err.message }, { status: 500 });
  }
}
