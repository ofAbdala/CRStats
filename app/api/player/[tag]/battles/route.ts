import { NextResponse } from 'next/server';
import { authHeaders, baseURL, encodeTag } from '@/lib/supercell';
import { normalizeBattleRow } from '@/lib/normalize';
import { fetchWithRetry } from '@/lib/fetcher';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(req: Request, { params }: { params: { tag: string } }) {
  try {
    const { searchParams } = new URL(req.url);
    const last = Math.max(1, Math.min(50, parseInt(searchParams.get('last') || '25', 10)));
    const url  = `${baseURL()}/players/${encodeTag(params.tag)}/battlelog`;
    console.log('Fetching battles from:', url);
    console.log('BaseURL', baseURL(), process.env.USE_PROXY, !!process.env.SUPERCELL_TOKEN);

    const r = await fetchWithRetry(url, { headers: authHeaders() }, { timeoutMs: 10000, retries: 2 });
    if (!r.ok) {
      const msg = await r.text().catch(() => '');
      console.error('Supercell API error', r.status, msg);
      return NextResponse.json({ error: true, status: r.status, body: msg || r.statusText }, { status: r.status });
    }
    const data = await r.json();
    
    // Log raw battles data for debugging
    console.log(`Fetched ${data.length} battles for ${params.tag}`);
    console.log('Latest battle time:', data[0]?.battleTime);
    
    const rows = data.slice(0, last).map(normalizeBattleRow);
    
    console.log('Normalized battles count:', rows.length);
    console.log('Latest normalized battle:', rows[0]?.battleTimeFormatted);

    const res = NextResponse.json(rows);
    res.headers.set('Cache-Control', 'private, max-age=15'); // Cache menor para dados mais frescos
    return res;
  } catch (e: any) {
    console.error('Route crash', e);
    return NextResponse.json({ code: 500, message: e.message || 'Internal error' }, { status: 500 });
  }
}