import { NextRequest, NextResponse } from 'next/server';
import { authHeaders, baseURL, encodeTag } from '@/lib/supercell';
import { fetchWithRetry } from '@/lib/fetcher';
import { logger } from '@/lib/logger';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Helper function to get arena icon URL based on arena ID
function getArenaIconUrl(arenaId?: number): string | null {
  if (!arenaId) return null;

  // Map Supercell arena IDs to RoyaleAPI arena numbers
  // RoyaleAPI uses sequential numbers (0-22) while Supercell uses 54000000-54000022
  const arenaIdMap: Record<number, number> = {
    54000000: 0,  // Training Camp
    54000001: 1,  // Goblin Stadium
    54000002: 2,  // Bone Pit
    54000003: 3,  // Barbarian Bowl
    54000004: 4,  // Spell Valley
    54000005: 5,  // Builder's Workshop
    54000006: 6,  // P.E.K.K.A's Playhouse
    54000007: 7,  // Royal Arena
    54000008: 8,  // Frozen Peak
    54000009: 9,  // Jungle Arena
    54000010: 10, // Hog Mountain
    54000011: 11, // Electro Valley
    54000012: 12, // Spooky Town
    54000013: 13, // Rascal's Hideout
    54000014: 14, // Serenity Peak
    54000015: 15, // Miner's Mine
    54000016: 16, // Executioner's Kitchen
    54000017: 17, // Boot Camp
    54000018: 18, // Clash Fest
    54000019: 19, // PANCAKES!
    54000020: 20, // Valkalla
    54000021: 21, // Legendary Arena
    54000022: 22, // Path of Legend
  };

  const arenaNumber = arenaIdMap[arenaId];
  if (arenaNumber === undefined) return null;

  // RoyaleAPI CDN has arena icons
  return `https://cdn.royaleapi.com/static/img/arenas/arena${arenaNumber}.png`;
}

export async function GET(
  _req: Request,
  { params }: { params: { tag: string } }
) {
  try {
    const url = `${baseURL()}/players/${encodeTag(params.tag)}`;
    logger.api('GET /api/player/[tag]', { tag: params.tag });

    const r = await fetchWithRetry(url, { headers: authHeaders() });
    if (!r.ok) {
      const msg = await r.text().catch(() => '');
      logger.error('Supercell API error', { status: r.status, tag: params.tag });
      return NextResponse.json({ error: true, status: r.status, body: msg || r.statusText }, { status: r.status });
    }
    const d = await r.json();

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
      clanBadgeId: d.clan?.badgeId ?? null,
      arenaIconUrl: getArenaIconUrl(d.arena?.id),
      leagueStatistics: d.leagueStatistics,
      badges: d.badges || [],
      wins: d.wins,
      losses: d.losses,
      threeCrownWins: d.threeCrownWins,
      donations: d.donations,
      donationsReceived: d.donationsReceived,
      totalDonations: d.totalDonations,
      warDayWins: d.warDayWins,
      clanCardsCollected: d.clanCardsCollected,
      starPoints: d.starPoints,
      expPoints: d.expPoints,
      currentDeck: d.currentDeck || [],
      cards: d.cards || []
    };

    const res = NextResponse.json(payload);
    res.headers.set('Cache-Control', 'private, max-age=15'); // Cache menor para dados mais frescos
    return res;
  } catch (e: any) {
    logger.error('Failed to fetch player', e);
    return NextResponse.json({ error: true, message: e.message }, { status: 500 });
  }
}