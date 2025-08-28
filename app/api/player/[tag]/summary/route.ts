import { NextResponse } from 'next/server';
import { authHeaders, baseURL, encodeTag } from '@/lib/supercell';
import { normalizeBattleRow, computeSummary } from '@/lib/normalize';
import { fetchWithRetry } from '@/lib/fetcher';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(req: Request, { params }: { params: { tag: string } }) {
  try {
    const { searchParams } = new URL(req.url);
    const last = Math.max(1, Math.min(50, parseInt(searchParams.get('last') || '20', 10)));
    const tagEnc = encodeTag(params.tag);

    console.log('Fetching player and battles for summary:', `${baseURL()}/players/${tagEnc}`);
    console.log('BaseURL', baseURL(), process.env.USE_PROXY, !!process.env.SUPERCELL_TOKEN);
    
    const [p, b] = await Promise.all([
      fetchWithRetry(`${baseURL()}/players/${tagEnc}`, { headers: authHeaders() }),
      fetchWithRetry(`${baseURL()}/players/${tagEnc}/battlelog`, { headers: authHeaders() })
    ]);

    if (!p.ok) {
      const msg = await p.text().catch(() => '');
      console.error('Player API error', p.status, msg);
      return NextResponse.json({ error: true, status: p.status, body: msg || p.statusText }, { status: p.status });
    }
    if (!b.ok) {
      const msg = await b.text().catch(() => '');
      console.error('Battles API error', b.status, msg);
      return NextResponse.json({ error: true, status: b.status, body: msg || b.statusText }, { status: b.status });
    }

    const player  = await p.json();
    const battles = (await b.json()).slice(0, last).map(normalizeBattleRow);

    const summary = computeSummary(player, battles);

    const res = NextResponse.json(summary);
    res.headers.set('Cache-Control', 'private, max-age=30');
    return res;
  } catch (e: any) {
    console.error('Summary route crash', e);
    return NextResponse.json({ code: 500, message: e.message || 'Internal error' }, { status: 500 });
  }
}