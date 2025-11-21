import { Battle } from './types';

export interface HeatmapCell {
    count: number;
    wins: number;
    losses: number;
    draws: number;
    winrate: number;
    trophyChange: number;
    battles: Battle[];
}

export interface TimeSlot {
    day: number;
    slot: number;
    dayName: string;
    timeRange: string;
}

export interface PerformanceTime extends TimeSlot {
    winrate: number;
    count: number;
    trophyChange: number;
}

export interface ActivityAnalysis {
    peakHours: PerformanceTime[];
    bestTimes: PerformanceTime[];
    worstTimes: PerformanceTime[];
    weekdayWinrate: number;
    weekendWinrate: number;
    totalBattles: number;
    recommendation: string;
    heatmapData: HeatmapCell[][];
}

const DAYS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
const TIME_SLOTS = ['0h-4h', '4h-8h', '8h-12h', '12h-16h', '16h-20h', '20h-24h'];

export function analyzeActivityPatterns(battles: Battle[]): ActivityAnalysis {
    // Initialize 7x6 grid
    const heatmapData: HeatmapCell[][] = Array(7).fill(0).map(() =>
        Array(6).fill(0).map(() => ({
            count: 0,
            wins: 0,
            losses: 0,
            draws: 0,
            winrate: 0,
            trophyChange: 0,
            battles: []
        }))
    );

    // Filter valid battles
    const validBattles = battles.filter(b =>
        b.team && b.team[0] && b.opponent && b.opponent[0] && b.battleTime
    );

    // Populate heatmap data
    validBattles.forEach(battle => {
        const date = new Date(battle.battleTime);
        if (isNaN(date.getTime())) return;

        const day = date.getDay();
        const hour = date.getHours();
        if (day < 0 || day > 6 || hour < 0 || hour > 23) return;

        const slot = Math.floor(hour / 4);
        const cell = heatmapData[day][slot];

        cell.count++;
        cell.battles.push(battle);
        cell.trophyChange += battle.team[0].trophyChange || 0;

        const myCrowns = battle.team[0].crowns;
        const opponentCrowns = battle.opponent[0].crowns;

        if (myCrowns > opponentCrowns) {
            cell.wins++;
        } else if (myCrowns < opponentCrowns) {
            cell.losses++;
        } else {
            cell.draws++;
        }
    });

    // Calculate winrates
    heatmapData.forEach(row => {
        row.forEach(cell => {
            if (cell.count > 0) {
                cell.winrate = (cell.wins / cell.count) * 100;
            }
        });
    });

    // Find peak hours (most battles)
    const allCells: PerformanceTime[] = [];
    heatmapData.forEach((row, day) => {
        row.forEach((cell, slot) => {
            if (cell.count >= 3) { // Minimum 3 battles for relevance
                allCells.push({
                    day,
                    slot,
                    dayName: DAYS[day],
                    timeRange: TIME_SLOTS[slot],
                    winrate: cell.winrate,
                    count: cell.count,
                    trophyChange: cell.trophyChange
                });
            }
        });
    });

    const peakHours = [...allCells]
        .sort((a, b) => b.count - a.count)
        .slice(0, 3);

    const bestTimes = [...allCells]
        .filter(c => c.count >= 5) // At least 5 battles
        .sort((a, b) => b.winrate - a.winrate)
        .slice(0, 3);

    const worstTimes = [...allCells]
        .filter(c => c.count >= 5)
        .sort((a, b) => a.winrate - b.winrate)
        .slice(0, 3);

    // Weekday vs weekend analysis
    const weekdayBattles = validBattles.filter(b => {
        const day = new Date(b.battleTime).getDay();
        return day >= 1 && day <= 5;
    });

    const weekendBattles = validBattles.filter(b => {
        const day = new Date(b.battleTime).getDay();
        return day === 0 || day === 6;
    });

    const weekdayWins = weekdayBattles.filter(b =>
        b.team[0].crowns > b.opponent[0].crowns
    ).length;

    const weekendWins = weekendBattles.filter(b =>
        b.team[0].crowns > b.opponent[0].crowns
    ).length;

    const weekdayWinrate = weekdayBattles.length > 0
        ? (weekdayWins / weekdayBattles.length) * 100
        : 0;

    const weekendWinrate = weekendBattles.length > 0
        ? (weekendWins / weekendBattles.length) * 100
        : 0;

    // Generate recommendation
    let recommendation = '';
    if (bestTimes.length > 0) {
        const best = bestTimes[0];
        const improvement = best.winrate - (weekdayWinrate + weekendWinrate) / 2;
        if (improvement > 10) {
            recommendation = `Você é ${improvement.toFixed(0)}% mais efetivo jogando ${best.dayName} ${best.timeRange}. Foque nesses horários para push!`;
        } else if (worstTimes.length > 0) {
            const worst = worstTimes[0];
            recommendation = `Evite jogar ${worst.dayName} ${worst.timeRange} (${worst.winrate.toFixed(0)}% WR). Prefira ${best.dayName} ${best.timeRange}.`;
        }
    }

    if (!recommendation && weekdayWinrate > weekendWinrate + 10) {
        recommendation = `Seu desempenho é ${(weekdayWinrate - weekendWinrate).toFixed(0)}% melhor em dias de semana. Foque em jogar Segunda-Sexta.`;
    } else if (!recommendation && weekendWinrate > weekdayWinrate + 10) {
        recommendation = `Você performa melhor nos finais de semana (+${(weekendWinrate - weekdayWinrate).toFixed(0)}%). Aproveite Sábado e Domingo para push!`;
    }

    return {
        peakHours,
        bestTimes,
        worstTimes,
        weekdayWinrate,
        weekendWinrate,
        totalBattles: validBattles.length,
        recommendation: recommendation || 'Continue jogando para coletar mais dados e receber recomendações personalizadas.',
        heatmapData
    };
}

export function getTimeSlotLabel(day: number, slot: number): string {
    return `${DAYS[day]} ${TIME_SLOTS[slot]}`;
}
