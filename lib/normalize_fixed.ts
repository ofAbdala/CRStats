// lib/normalize.ts
import { parseClashTime, sortByDate } from './time';

export interface BattleSummary {
  playerTag: string;
  playerName: string;
  totalBattles: number;
  wins: number;
  losses: number;
  draws: number;
  winRate: number;
  avgCrowns: number;
  avgOpponentCrowns: number;
  mostUsedCards: string[];
  battleModes: { [key: string]: number };
}

export interface Battle {
  type: string;
  battleTime: string;
  isLadderTournament?: boolean;
  team: Array<{
    tag: string;
    name: string;
    startingTrophies?: number;
    trophyChange?: number;
    crowns: number;
    kingTowerHitPoints?: number;
    princessTowersHitPoints?: number[];
    cards: Array<{
      name: string;
      id: number;
      level: number;
      maxLevel: number;
      iconUrls: {
        medium: string;
      };
    }>;
  }>;
  opponent: Array<{
    tag: string;
    name: string;
    startingTrophies?: number;
    trophyChange?: number;
    crowns: number;
    kingTowerHitPoints?: number;
    princessTowersHitPoints?: number[];
    cards: Array<{
      name: string;
      id: number;
      level: number;
      maxLevel: number;
      iconUrls: {
        medium: string;
      };
    }>;
  }>;
}

export function computeSummary(player: any, battles: Battle[]): BattleSummary {
  let wins = 0;
  let losses = 0;
  let draws = 0;
  let totalPlayerCrowns = 0;
  let totalOpponentCrowns = 0;
  
  const cardUsage: { [key: string]: number } = {};
  const battleModes: { [key: string]: number } = {};

  // Filtra e ordena batalhas por data (mais recente primeiro)
  const validBattles = battles
    .filter(battle => parseClashTime(battle.battleTime)) // Remove batalhas com data inválida
    .sort((a, b) => {
      const dateA = parseClashTime(a.battleTime);
      const dateB = parseClashTime(b.battleTime);
      if (!dateA || !dateB) return 0;
      return dateB.getTime() - dateA.getTime(); // Mais recente primeiro
    });

  validBattles.forEach(battle => {
    // Pega os dados do jogador e oponente da batalha
    const playerData = battle.team?.[0];
    const opponent = battle.opponent?.[0]; // ✅ Aqui estava o problema!
    
    if (!playerData || !opponent) return;

    const playerCrowns = playerData.crowns ?? 0;
    const opponentCrowns = opponent.crowns ?? 0;

    // Calcula resultado da batalha
    if (playerCrowns > opponentCrowns) {
      wins++;
    } else if (playerCrowns < opponentCrowns) {
      losses++;
    } else {
      draws++;
    }

    // Acumula crowns para média
    totalPlayerCrowns += playerCrowns;
    totalOpponentCrowns += opponentCrowns;

    // Conta uso de cartas
    playerData.cards?.forEach(card => {
      cardUsage[card.name] = (cardUsage[card.name] || 0) + 1;
    });

    // Conta modos de batalha
    const battleType = battle.type || 'Unknown';
    battleModes[battleType] = (battleModes[battleType] || 0) + 1;
  });

  // Encontra as cartas mais usadas
  const mostUsedCards = Object.entries(cardUsage)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 8)
    .map(([card]) => card);

  const totalBattles = validBattles.length;

  return {
    playerTag: player.tag,
    playerName: player.name,
    totalBattles,
    wins,
    losses,
    draws,
    winRate: totalBattles > 0 ? Math.round((wins / totalBattles) * 100 * 100) / 100 : 0,
    avgCrowns: totalBattles > 0 ? Math.round((totalPlayerCrowns / totalBattles) * 100) / 100 : 0,
    avgOpponentCrowns: totalBattles > 0 ? Math.round((totalOpponentCrowns / totalBattles) * 100) / 100 : 0,
    mostUsedCards,
    battleModes,
  };
}

// Função auxiliar para normalizar dados do jogador
export function normalizePlayer(playerData: any) {
  return {
    tag: playerData.tag,
    name: playerData.name,
    expLevel: playerData.expLevel,
    trophies: playerData.trophies,
    bestTrophies: playerData.bestTrophies,
    wins: playerData.wins,
    losses: playerData.losses,
    battleCount: playerData.battleCount,
    threeCrownWins: playerData.threeCrownWins,
    challengeCardsWon: playerData.challengeCardsWon,
    challengeMaxWins: playerData.challengeMaxWins,
    tournamentCardsWon: playerData.tournamentCardsWon,
    tournamentBattleCount: playerData.tournamentBattleCount,
    role: playerData.role,
    donations: playerData.donations,
    donationsReceived: playerData.donationsReceived,
    totalDonations: playerData.totalDonations,
    warDayWins: playerData.warDayWins,
    clanCardsCollected: playerData.clanCardsCollected,
    clan: playerData.clan,
    arena: playerData.currentPathOfLegendSeasonResult?.trophies || playerData.trophies,
    leagueStatistics: playerData.leagueStatistics,
  };
}

// Função para normalizar dados de batalhas
export function normalizeBattles(battlesData: any[]): Battle[] {
  return battlesData.map(battle => ({
    type: battle.type,
    battleTime: battle.battleTime,
    isLadderTournament: battle.isLadderTournament,
    team: battle.team || [],
    opponent: battle.opponent || [],
  }));
}