import { Battle, DeckStat } from '@/lib/types';

export function buildQuickSummary(battles: Battle[]) {
    let wins = 0;
    let losses = 0;
    let draws = 0;
    let trophyDeltaTotal = 0;
    let currentWinStreak = 0;
    let maxWinStreak = 0;

    battles.forEach((battle) => {
        // Defensive check for battle structure
        if (!battle.team || !battle.team[0] || !battle.opponent || !battle.opponent[0]) {
            return; // Skip invalid battles
        }

        const myTeam = battle.team[0];
        const opponent = battle.opponent[0];

        const isWin = myTeam.crowns > opponent.crowns;
        const isLoss = myTeam.crowns < opponent.crowns;
        const isDraw = myTeam.crowns === opponent.crowns;

        if (isWin) {
            wins++;
            currentWinStreak++;
            maxWinStreak = Math.max(maxWinStreak, currentWinStreak);
        } else {
            currentWinStreak = 0; // Reset streak on loss or draw
            if (isLoss) losses++;
            if (isDraw) draws++;
        }

        if (myTeam.trophyChange) {
            trophyDeltaTotal += myTeam.trophyChange;
        }
    });

    const total = wins + losses + draws;
    const winrate = total > 0 ? (wins / total) * 100 : 0;

    return {
        wins,
        losses,
        draws,
        winrate,
        trophyDeltaTotal,
        maxWinStreak
    };
}

export function buildDeckStats(battles: Battle[]): {
    decks: DeckStat[];
    topDeck: DeckStat | null;
    topDecksByWinrate: DeckStat[];
} {
    const deckMap = new Map<string, DeckStat>();

    battles.forEach(battle => {
        // Defensive check for battle structure
        if (!battle.team || !battle.team[0] || !battle.opponent || !battle.opponent[0]) {
            return; // Skip invalid battles
        }

        const myTeam = battle.team[0];
        // Create a unique key for the deck based on sorted card IDs
        const cardIds = myTeam.cards.map(c => c.id).sort().join(',');

        if (!deckMap.has(cardIds)) {
            const avgElixir = myTeam.cards.reduce((acc, c) => acc + (c.elixirCost || 3.5), 0) / myTeam.cards.length;
            deckMap.set(cardIds, {
                id: cardIds,
                cards: myTeam.cards,
                matches: 0,
                wins: 0,
                losses: 0,
                draws: 0,
                winrate: 0,
                avgElixir: parseFloat(avgElixir.toFixed(1))
            });
        }

        const stat = deckMap.get(cardIds)!;
        stat.matches++;

        const opponent = battle.opponent[0];
        if (myTeam.crowns > opponent.crowns) stat.wins++;
        else if (myTeam.crowns < opponent.crowns) stat.losses++;
        else stat.draws++;
    });

    const decks = Array.from(deckMap.values()).map(deck => ({
        ...deck,
        winrate: (deck.wins / deck.matches) * 100
    }));

    const topDeck = decks.sort((a, b) => b.matches - a.matches)[0] || null;
    const topDecksByWinrate = [...decks]
        .filter(d => d.matches >= 3) // Minimum matches to be considered
        .sort((a, b) => b.winrate - a.winrate);

    return { decks, topDeck, topDecksByWinrate };
}

export function buildRuleBasedInsights(battles: Battle[]): string[] {
    const insights: string[] = [];

    // Defensive check
    if (!battles || battles.length === 0) return insights;

    const validBattles = battles.filter(b =>
        b.team && b.team[0] && b.opponent && b.opponent[0]
    );

    if (validBattles.length === 0) return insights;

    // === PERFORMANCE INSIGHTS ===

    // 1. Recent Performance Trend
    const recent20 = validBattles.slice(0, Math.min(20, validBattles.length));
    const previous20 = validBattles.slice(20, Math.min(40, validBattles.length));

    if (recent20.length >= 10 && previous20.length >= 10) {
        const recentWins = recent20.filter(b => b.team[0].crowns > b.opponent[0].crowns).length;
        const previousWins = previous20.filter(b => b.team[0].crowns > b.opponent[0].crowns).length;
        const recentWR = (recentWins / recent20.length) * 100;
        const previousWR = (previousWins / previous20.length) * 100;
        const improvement = recentWR - previousWR;

        if (improvement > 15) {
            insights.push(`📈 Seu winrate subiu ${improvement.toFixed(0)}% nos últimos ${recent20.length} jogos! Continue assim!`);
        } else if (improvement < -15) {
            insights.push(`📉 Cuidado: seu winrate caiu ${Math.abs(improvement).toFixed(0)}% recentemente. Considere mudar de estratégia.`);
        }
    }

    // 2. Win/Loss Streaks
    let currentStreak = 0;
    let streakType: 'win' | 'loss' | null = null;

    for (const battle of recent20) {
        const isWin = battle.team[0].crowns > battle.opponent[0].crowns;
        if (streakType === null) {
            streakType = isWin ? 'win' : 'loss';
            currentStreak = 1;
        } else if ((streakType === 'win' && isWin) || (streakType === 'loss' && !isWin)) {
            currentStreak++;
        } else {
            break;
        }
    }

    if (currentStreak >= 5 && streakType === 'win') {
        insights.push(`🔥 Sequência de ${currentStreak} vitórias! Você está em ótima forma!`);
    } else if (currentStreak >= 5 && streakType === 'loss') {
        insights.push(`⚠️ ${currentStreak} derrotas seguidas. Faça uma pausa de 15-30min para evitar tilt.`);
    }

    // 3. Trophy Change Analysis
    const trophyChange = recent20.reduce((sum, b) => sum + (b.team[0].trophyChange || 0), 0);

    if (trophyChange > 50) {
        insights.push(`🏆 Excelente! Você ganhou ${trophyChange} troféus recentemente. Continue o push!`);
    } else if (trophyChange < -50) {
        insights.push(`⚠️ Você perdeu ${Math.abs(trophyChange)} troféus. Hora de parar ou trocar de deck.`);
    }

    // === GAME MODE INSIGHTS ===

    const ladderBattles = validBattles.filter(b =>
        b.type === 'PvP' || b.gameMode.name.toLowerCase().includes('ladder')
    );
    const challengeBattles = validBattles.filter(b =>
        b.gameMode.name.toLowerCase().includes('challenge') ||
        b.gameMode.name.toLowerCase().includes('tournament')
    );

    if (ladderBattles.length >= 10 && challengeBattles.length >= 10) {
        const ladderWins = ladderBattles.filter(b => b.team[0].crowns > b.opponent[0].crowns).length;
        const challengeWins = challengeBattles.filter(b => b.team[0].crowns > b.opponent[0].crowns).length;
        const ladderWR = (ladderWins / ladderBattles.length) * 100;
        const challengeWR = (challengeWins / challengeBattles.length) * 100;

        if (ladderWR > challengeWR + 15) {
            insights.push(`🎯 Seu desempenho em Ladder é ${(ladderWR - challengeWR).toFixed(0)}% melhor. Foque em subir troféus!`);
        } else if (challengeWR > ladderWR + 15) {
            insights.push(`🏅 Você domina Desafios (+${(challengeWR - ladderWR).toFixed(0)}% WR). Considere Grand Challenges!`);
        }
    }

    // === DECK INSIGHTS ===

    // Find most used deck
    const deckMap = new Map<string, { battles: Battle[], wins: number }>();

    validBattles.forEach(battle => {
        if (!battle.team[0].cards) return;
        const deckKey = battle.team[0].cards.map(c => c.id).sort().join(',');
        const existing = deckMap.get(deckKey) || { battles: [], wins: 0 };
        existing.battles.push(battle);
        if (battle.team[0].crowns > battle.opponent[0].crowns) {
            existing.wins++;
        }
        deckMap.set(deckKey, existing);
    });

    const decks = Array.from(deckMap.entries())
        .map(([key, data]) => ({
            key,
            count: data.battles.length,
            wins: data.wins,
            winrate: (data.wins / data.battles.length) * 100
        }))
        .filter(d => d.count >= 5)
        .sort((a, b) => b.winrate - a.winrate);

    if (decks.length >= 2) {
        const best = decks[0];
        const worst = decks[decks.length - 1];

        if (best.winrate > 60) {
            insights.push(`🃏 Seu deck principal tem ${best.winrate.toFixed(0)}% de winrate! Use-o para push.`);
        }

        if (worst.winrate < 40 && worst.count >= 10) {
            insights.push(`❌ Um de seus decks tem apenas ${worst.winrate.toFixed(0)}% WR. Considere substituí-lo.`);
        }
    }

    // === CROWN INSIGHTS ===

    const total3Crowns = validBattles.filter(b =>
        b.team[0].crowns === 3 && b.opponent[0].crowns < 3
    ).length;

    const total0Crowns = validBattles.filter(b =>
        b.team[0].crowns === 0
    ).length;

    if (total3Crowns >= validBattles.length * 0.3) {
        insights.push(`👑 ${((total3Crowns / validBattles.length) * 100).toFixed(0)}% das suas vitórias são 3 coroas! Deck agressivo forte.`);
    }

    if (total0Crowns >= validBattles.length * 0.2) {
        insights.push(`🛡️ ${((total0Crowns / validBattles.length) * 100).toFixed(0)}% de Clean Sheets do oponente. Trabalhe na defesa.`);
    }

    // === TIME-BASED INSIGHTS ===

    // Recent activity
    if (validBattles.length > 0) {
        const lastBattle = new Date(validBattles[0].battleTime);
        const now = new Date();
        const hoursSinceLastBattle = (now.getTime() - lastBattle.getTime()) / (1000 * 60 * 60);

        if (hoursSinceLastBattle < 1 && recent20.length >= 10) {
            const recentWins = recent20.filter(b => b.team[0].crowns > b.opponent[0].crowns).length;
            const sessionWR = (recentWins / recent20.length) * 100;

            if (sessionWR < 40) {
                insights.push(`⏸️ Você jogou muito recentemente com ${sessionWR.toFixed(0)}% WR. Faça uma pausa!`);
            }
        }
    }

    // === STRATEGIC INSIGHTS ===

    // Consistent winrate
    const overallWins = validBattles.filter(b => b.team[0].crowns > b.opponent[0].crowns).length;
    const overallWR = (overallWins / validBattles.length) * 100;

    if (overallWR >= 55) {
        insights.push(`✨ ${overallWR.toFixed(0)}% de winrate geral. Você está pronto para climbar ladder!`);
    } else if (overallWR <= 45) {
        insights.push(`💭 Winrate de ${overallWR.toFixed(0)}%. Foque em melhorar matchups e timing.`);
    }

    // No insights fallback
    if (insights.length === 0) {
        insights.push("Continue jogando para receber insights personalizados baseados no seu desempenho.");
    }

    return insights.slice(0, 8); // Maximum 8 insights
}
