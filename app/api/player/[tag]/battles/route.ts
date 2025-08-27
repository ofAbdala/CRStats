import { NextResponse } from 'next/server';
import { authHeaders, baseURL, encodeTag } from '@/lib/supercell';
import { normalizeBattleRow } from '@/lib/normalize';

export const dynamic = 'force-dynamic';

export async function GET(req: Request, { params }: { params: { tag: string } }) {
  try {
    const { searchParams } = new URL(req.url);
    const last = Math.max(1, Math.min(50, parseInt(searchParams.get('last') || '25', 10)));
    const url  = `${baseURL()}/players/${encodeTag(params.tag)}/battlelog`;
    console.log('Fetching battles from:', url);

    const r = await fetch(url, { headers: authHeaders(), cache: 'no-store' });
    if (!r.ok) {
      const msg = await r.text();
      console.error('Supercell API error', r.status, msg);
      return NextResponse.json({ code: r.status, message: msg || r.statusText }, { status: r.status });
    }
    const data = await r.json();
    
    // Log raw battles data for debugging
    console.log('Raw battles data (first 3):', JSON.stringify(data.slice(0, 3), null, 2));
    
    const rows = data.slice(0, last).map(normalizeBattleRow);
    
    console.log('Normalized battles (first 3):', JSON.stringify(rows.slice(0, 3), null, 2));

    const res = NextResponse.json(rows);
    res.headers.set('Cache-Control', 'private, max-age=30');
    return res;
  } catch (e: any) {
    console.error('Route crash', e);
    return NextResponse.json({ code: 500, message: e.message || 'Internal error' }, { status: 500 });
  }
}