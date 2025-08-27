import { NextResponse } from 'next/server';
import { authHeaders, baseURL, encodeTag } from '@/lib/supercell';

export const dynamic = 'force-dynamic';

export async function GET(
  _req: Request,
  { params }: { params: { tag: string } }
) {
  try {
    const url = `${baseURL()}/players/${encodeTag(params.tag)}`;
    const r = await fetch(url, { headers: authHeaders(), cache: 'no-store' });
    if (!r.ok) {
      const msg = await r.text();
      return NextResponse.json({ code: r.status, message: msg || r.statusText }, { status: r.status });
    }
    const d = await r.json();

    const payload = {
      name: d.name,
      tag: (d.tag || '').replace('#', ''),
      trophies: d.trophies,
      bestTrophies: d.bestTrophies,
      expLevel: d.expLevel,
      arena: d.arena?.name,
      clan: d.clan?.name ?? null,
      wins: d.wins,
      losses: d.losses,
      threeCrownWins: d.threeCrownWins
    };

    const res = NextResponse.json(payload);
    res.headers.set('Cache-Control', 'private, max-age=30');
    return res;
  } catch (e: any) {
    return NextResponse.json({ code: 500, message: e.message || 'Internal error' }, { status: 500 });
  }
}