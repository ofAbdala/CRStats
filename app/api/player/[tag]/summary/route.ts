import { NextResponse } from 'next/server';
import { authHeaders, baseURL, encodeTag } from '@/lib/supercell';
import { normalizeBattleRow, computeSummary } from '@/lib/normalize';

export const dynamic = 'force-dynamic';

export async function GET(req: Request, { params }: { params: { tag: string } }) {
  try {
    const { searchParams } = new URL(req.url);
    const last = Math.max(1, Math.min(50, parseInt(searchParams.get('last') || '20', 10)));
    const tagEnc = encodeTag(params.tag);

    console.log('Fetching player and battles for summary:', `${baseURL()}/players/${tagEnc}`);
    const [p, b] = await Promise.all([
      fetch(`${baseURL()}/players/${tagEnc}`, { headers: authHeaders(), cache: 'no-store' }),
      fetch(`${baseURL()}/players/${tagEnc}/battlelog`, { headers: authHeaders(), cache: 'no-store' })
    ]);

    if (!p.ok) {
      const msg = await p.text();
      console.error('Player API error', p.status, msg);
      return NextResponse.json({ code: p.status, message: msg || p.statusText }, { status: p.status });
    }
    if (!b.ok) {
      const msg = await b.text();
      console.error('Battles API error', b.status, msg);
      return NextResponse.json({ code: b.status, message: msg || b.statusText }, { status: b.status });
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