import { parseClashTime, formatDateTime, BRAZIL_TZ } from './time';

export type BattleRow = any;

export function normalizeBattleRow(row: any) {
  const team = row?.team?.[0] ?? {};
  const opponent = row?.opponent?.[0] ?? {};
  const tc = team.crowns ?? 0, oc = opponent.crowns ?? 0;
  const result = tc > oc ? 'WIN' : tc < oc ? 'LOSS' : 'DRAW';

  // Usar parser seguro para datas da Supercell API
  const battleTimeFormatted = formatDateTime(row.battleTime);
  
  return {
    battleTime: row.battleTime,        // UTC string
    battleTimeFormatted,               // Formatted for Brazil
    gameMode: row.gameMode?.name ?? '',
    result,
    crownsFor: tc,
    crownsAgainst: oc,
    opponentName: opponent.name ?? '',
    opponentTag: (opponent.tag ?? '').replace('#', ''),
    opponentTrophies: opponent.startingTrophies ?? 0,
    teamDeck: (team.cards || []).map((c: any) => c.name),
    opponentDeck: (opponent.cards || []).map((c: any) => c.name),
    trophyChange: team.trophyChange ?? 0
  };
}

export function computeSummary(player: any, battles: any[]) {
  // Filtrar e ordenar batalhas usando parser seguro
  const validBattles = battles
    .filter(b => parseClashTime(b.battleTime)) // Remove batalhas com data inválida
    .sort((a, b) => {
      const dateA = parseClashTime(a.battleTime);
      const dateB = parseClashTime(b.battleTime);
      if (!dateA || !dateB) return 0;
      return dateB.getTime() - dateA.getTime(); // Mais recente primeiro
    });

  const newestFirst = validBattles;
  const windowRows = newestFirst;
  const oldestFirst = [...windowRows].reverse();

  // Reconstrói troféus de início da janela
  let start = player.trophies;
  for (const b of windowRows) start -= (b.trophyChange || 0);

  let t = start;
  const series = [];
  for (const b of oldestFirst) {
    t += (b.trophyChange || 0);
    series.push({
      label: formatDateTime(b.battleTime, { 
        day: '2-digit',
        month: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      }),
      trophies: t
    });
  }

  const wins   = windowRows.filter(b => b.result === 'WIN').length;
  const losses = windowRows.filter(b => b.result === 'LOSS').length;
  const firstT = oldestFirst[0]?.battleTime;
  const lastT  = oldestFirst[oldestFirst.length - 1]?.battleTime;
  
  let pushDurationMs = 0;
  if (firstT && lastT) {
    const firstDate = parseClashTime(firstT);
    const lastDate = parseClashTime(lastT);
    if (firstDate && lastDate) {
      pushDurationMs = lastDate.getTime() - firstDate.getTime();
    }
  }

  return {
    tag: (player.tag || '').replace('#', ''),
    name: player.name,
    trophiesNow: player.trophies,
    trophiesStart: start,
    trophyDelta: player.trophies - start,
    matchesTotal: windowRows.length,
    wins,
    losses,
    winRate: windowRows.length ? Math.round((wins / windowRows.length) * 100) : 0,
    pushDurationMs,
    series
  };
}