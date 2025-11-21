import { NextResponse } from 'next/server';
import { authHeaders, baseURL, encodeTag } from '@/lib/supercell';
import { normalizeBattleRow } from '@/lib/normalize';
import { fetchWithRetry } from '@/lib/fetcher';
import { logger } from '@/lib/logger';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(req: Request, { params }: { params: { tag: string } }) {
  try {
    const { searchParams } = new URL(req.url);
    const last = Math.max(1, Math.min(50, parseInt(searchParams.get('last') || '25', 10)));
    const url = `${baseURL()}/players/${encodeTag(params.tag)}/battlelog`;
    logger.api('GET /api/player/[tag]/battles', { tag: params.tag, last });

    const r = await fetchWithRetry(url, { headers: authHeaders() });
    if (!r.ok) {
      const msg = await r.text().catch(() => '');
      logger.error('Supercell API error', { status: r.status, tag: params.tag });
      return NextResponse.json({ error: true, status: r.status, body: msg || r.statusText }, { status: r.status });
    }
    const data = await r.json();

    const rows = data.slice(0, last).map(normalizeBattleRow);

    const res = NextResponse.json(rows);
    res.headers.set('Cache-Control', 'private, max-age=15');
    return res;
  } catch (e: any) {
    logger.error('Failed to fetch battles', e);
    return NextResponse.json({ code: 500, message: e.message || 'Internal error' }, { status: 500 });
  }
}