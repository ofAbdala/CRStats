import { NextRequest, NextResponse } from 'next/server';
import { authHeaders, baseURL } from '@/lib/supercell';
import { fetchWithRetry } from '@/lib/fetcher';
import { logger } from '@/lib/logger';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const locationId = searchParams.get('locationId') || 'global';
        const limit = searchParams.get('limit') || '50';

        const url = `${baseURL()}/locations/${locationId}/rankings/players?limit=${limit}`;
        logger.api('GET /api/leaderboard', { locationId, limit });

        const r = await fetchWithRetry(url, { headers: authHeaders() });
        if (!r.ok) {
            const msg = await r.text().catch(() => '');
            logger.error('Supercell API error (Leaderboard)', { status: r.status, locationId });
            return NextResponse.json({ error: true, status: r.status, body: msg || r.statusText }, { status: r.status });
        }
        const d = await r.json();

        // Format response to match LeaderboardPlayer interface
        const items = d.items || [];
        const formattedItems = items.map((item: any) => ({
            tag: item.tag,
            name: item.name,
            rank: item.rank,
            trophies: item.trophies,
            clan: item.clan ? {
                tag: item.clan.tag,
                name: item.clan.name,
                badgeId: item.clan.badgeId
            } : undefined,
            arena: item.arena ? {
                id: item.arena.id,
                name: item.arena.name
            } : undefined
        }));

        const res = NextResponse.json({ items: formattedItems });
        res.headers.set('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600'); // Cache for 5 mins
        return res;
    } catch (e: any) {
        logger.error('Failed to fetch leaderboard', e);
        return NextResponse.json({ error: true, message: e.message }, { status: 500 });
    }
}
