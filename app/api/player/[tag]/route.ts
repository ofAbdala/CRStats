import { NextResponse } from 'next/server';
import { authHeaders, baseURL, encodeTag } from '@/lib/supercell';
import { fetchWithRetry } from '@/lib/fetcher';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(
  _req: Request,
  { params }: { params: { tag: string } }
) {
  try {
    const url = `${baseURL()}/players/${encodeTag(params.tag)}`;
    console.log('Fetching player data from:', url);
    console.log('BaseURL', baseURL(), process.env.USE_PROXY, !!process.env.SUPERCELL_TOKEN);
    
    const r = await fetchWithRetry(url, { headers: authHeaders() });
    if (!r.ok) {
      const msg = await r.text().catch(() => '');
      console.error('Supercell API error', r.status, msg);
      return NextResponse.json({ error: true, status: r.status, body: msg || r.statusText }, { status: r.status });
    }
    const d = await r.json();
    
    // Log raw API response for debugging
    console.log('Raw Supercell API response:', JSON.stringify(d, null, 2));

    const payload = {
      name: d.name,
      tag: (d.tag || '').replace('#', ''),
      trophies: d.trophies,
      bestTrophies: d.bestTrophies,
      expLevel: d.expLevel,
      arena: d.arena?.name || 'Unknown Arena',
      arenaId: d.arena?.id,
      clan: d.clan?.name ?? null,
      clanTag: d.clan?.tag ?? null,
      wins: d.wins,
      losses: d.losses,
      threeCrownWins: d.threeCrownWins,
      donations: d.donations,
      donationsReceived: d.donationsReceived,
      totalDonations: d.totalDonations,
      warDayWins: d.warDayWins,
      clanCardsCollected: d.clanCardsCollected,
      starPoints: d.starPoints,
      expPoints: d.expPoints
    };

    console.log('Processed payload:', JSON.stringify(payload, null, 2));

    const res = NextResponse.json(payload);
    res.headers.set('Cache-Control', 'private, max-age=15'); // Cache menor para dados mais frescos
    return res;
  } catch (e: any) {
    console.error('Route crash', e);
    return NextResponse.json({ code: 500, message: e.message || 'Internal error' }, { status: 500 });
  }
}