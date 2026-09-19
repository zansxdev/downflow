import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    'IP Misterius';
  const ua = request.headers.get('user-agent') || 'Bot Kang Scrape';

  return NextResponse.json(
    {
      status: false,
      code: 418,
      roast: 'CIEEE NYARI FREE API KEY YA BANG? WKWKWK! 😂',
      message: 'Modal dikit napa bang, jangan cuma nyari gratisan di endpoint orang lain.',
      victim_intel: {
        ip_kamu: ip,
        user_agent: ua,
        level_kepepet: 'Maksimal 9999%',
      },
      creator: 'zansxart',
      pesan: 'Mau API resmi? Kontak langsung @zansxart di GitHub atau Instagram.',
      fake_key: 'sk_live_kamu_tertipu_wkwkwk_zansxart_horeee_69',
      rickroll: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    },
    {
      status: 418,
      headers: {
        'X-Roast': 'Honeypot hit! Jangan copas API orang lain',
      },
    }
  );
}

export async function POST(request: NextRequest) {
  return GET(request);
}
