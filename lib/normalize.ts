export type BattleRow = any;

export function normalizeBattleRow(row: any) {
  const team = row?.team?.[0] ?? {};
  const opp  = row?.opponent?.[0] ?? {};
  const tc   = team.crowns ?? 0, oc = opp.crowns ?? 0;
  const result = tc > oc ? 'WIN' : tc < oc ? 'LOSS' : 'DRAW';

  return {
    battleTime: row.battleTime,        // UTC string
    gameMode: row.gameMode?.name ?? '',
    result,
    crownsFor: tc,
    crownsAgainst: oc,
    opponentName: opp.name ?? '',
    opponentTag: (opp.tag ?? '').replace('#', ''),
    teamDeck: (team.cards || []).map((c: any) => c.name),
    opponentDeck: (opp.cards || []).map((c: any) => c.name),
    trophyChange: team.trophyChange ?? 0
  };
}

export function computeSummary(player: any, battles: any[]) {
  const newestFirst = battles;               // API já retorna do mais novo → mais antigo
  const windowRows  = newestFirst;           // já fatiado no route
  const oldestFirst = [...windowRows].reverse();

  // Reconstrói troféus de início da janela
  let start = player.trophies;
  for (const b of windowRows) start -= (b.trophyChange || 0);

  let t = start;
  const series = [];
  for (const b of oldestFirst) {
    t += (b.trophyChange || 0);
    series.push({
      label: new Date(b.battleTime + 'Z').toLocaleString('pt-BR', {
        timeZone: 'America/Sao_Paulo',
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
  const pushDurationMs = (firstT && lastT)
    ? (new Date(lastT + 'Z').getTime() - new Date(firstT + 'Z').getTime())
    : 0;

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