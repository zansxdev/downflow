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
      roast: 'SELAMAT! ANDA BERHASIL MASUK PERANGKAP HONEYPOT WKWKWK! 🤡',
      message: 'Niat amat nyari secret admin leak dek. Ketahuan kan mau nge-scrape atau nyari celah!',
      victim_intel: {
        ip_kamu: ip,
        user_agent: ua,
        status: 'Hacker Modal F12 & Python Requests',
      },
      creator: 'zansxart',
      pesan: 'Mending tidur bang daripada nyari celah di web orang, besok kerja/sekolah wkwk.',
      traktir_kopi: 'https://github.com/zansxart',
      bonus_special: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    },
    {
      status: 418,
      headers: {
        'X-Roast': 'Kena jebakan betmen lu dek wkwk',
        'X-Honeypot': 'Triggered',
      },
    }
  );
}

export async function POST(request: NextRequest) {
  return GET(request);
}
