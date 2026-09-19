import { NextRequest, NextResponse } from 'next/server';
import { getStats, resetAllStats } from '@/lib/stats';
import {
  getWhitelist,
  addWhitelistEntry,
  removeWhitelistEntry,
  getClientIpFromHeaders,
} from '@/lib/whitelist';

const ADMIN_PIN = process.env.ADMIN_PIN || 'zansxart2026';
const AUTH_COOKIE_NAME = 'downflow_admin_auth';

function isAuthenticated(request: NextRequest): boolean {
  const token = request.cookies.get(AUTH_COOKIE_NAME)?.value;
  if (token && token === `auth_${ADMIN_PIN}`) return true;

  // Also support X-Admin-Key header
  const headerKey = request.headers.get('x-admin-key');
  if (headerKey && headerKey === ADMIN_PIN) return true;

  return false;
}

export async function GET(request: NextRequest) {
  if (!isAuthenticated(request)) {
    return NextResponse.json(
      { status: false, message: 'Unauthorized. PIN admin diperlukan.' },
      { status: 401 }
    );
  }

  const stats = getStats();
  const memory = process.memoryUsage();
  const whitelist = getWhitelist();
  const clientIp = getClientIpFromHeaders(request.headers);

  return NextResponse.json({
    status: true,
    data: {
      stats,
      whitelist,
      clientIp,
      server: {
        uptimeSeconds: Math.floor(process.uptime()),
        memoryRssMb: Math.round((memory.rss / 1024 / 1024) * 10) / 10,
        memoryHeapMb: Math.round((memory.heapUsed / 1024 / 1024) * 10) / 10,
        nodeVersion: process.version,
        timestamp: Date.now(),
      },
    },
  });
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}));
  const action = body.action || 'login';

  if (action === 'login') {
    const pin = String(body.pin || '').trim();
    if (pin === ADMIN_PIN) {
      const response = NextResponse.json({
        status: true,
        message: 'Login admin berhasil.',
      });

      response.cookies.set(AUTH_COOKIE_NAME, `auth_${ADMIN_PIN}`, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 * 7, // 7 days
      });

      return response;
    }

    return NextResponse.json(
      { status: false, message: 'PIN Admin salah.' },
      { status: 401 }
    );
  }

  if (action === 'logout') {
    const response = NextResponse.json({
      status: true,
      message: 'Logout berhasil.',
    });
    response.cookies.delete(AUTH_COOKIE_NAME);
    return response;
  }

  if (action === 'reset') {
    if (!isAuthenticated(request)) {
      return NextResponse.json(
        { status: false, message: 'Unauthorized.' },
        { status: 401 }
      );
    }
    resetAllStats();
    return NextResponse.json({
      status: true,
      message: 'Seluruh data statistik berhasil direset.',
    });
  }

  if (action === 'add_whitelist') {
    if (!isAuthenticated(request)) {
      return NextResponse.json(
        { status: false, message: 'Unauthorized.' },
        { status: 401 }
      );
    }

    try {
      const rawIp = String(body.ip || '').trim();
      if (!rawIp) {
        return NextResponse.json(
          { status: false, message: 'Alamat IP tidak boleh kosong.' },
          { status: 400 }
        );
      }

      const entry = addWhitelistEntry({
        ip: rawIp,
        label: body.label,
        bypassBotBlock: body.bypassBotBlock ?? true,
        allowAdmin: body.allowAdmin ?? true,
      });

      return NextResponse.json({
        status: true,
        message: `IP ${entry.ip} berhasil ditambahkan ke whitelist.`,
        data: entry,
      });
    } catch (err: any) {
      return NextResponse.json(
        { status: false, message: err.message || 'Gagal menambahkan IP.' },
        { status: 400 }
      );
    }
  }

  if (action === 'remove_whitelist') {
    if (!isAuthenticated(request)) {
      return NextResponse.json(
        { status: false, message: 'Unauthorized.' },
        { status: 401 }
      );
    }

    const id = String(body.id || '').trim();
    if (!id) {
      return NextResponse.json(
        { status: false, message: 'ID whitelist diperlukan.' },
        { status: 400 }
      );
    }

    const success = removeWhitelistEntry(id);
    if (success) {
      return NextResponse.json({
        status: true,
        message: 'IP berhasil dihapus dari whitelist.',
      });
    }

    return NextResponse.json(
      { status: false, message: 'IP tidak ditemukan dalam daftar whitelist.' },
      { status: 404 }
    );
  }

  return NextResponse.json(
    { status: false, message: 'Aksi tidak dikenali.' },
    { status: 400 }
  );
}
