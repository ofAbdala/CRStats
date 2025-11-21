import { Battle } from './types';

export interface PushSession {
    id: string;
    battles: Battle[];
    startTime: Date;
    endTime: Date;
    durationMinutes: number;
    wins: number;
    losses: number;
    draws: number;
    winrate: number;
    trophyDeltaTotal: number;
    isActive: boolean;
}

export interface SessionDetectionResult {
    sessions: PushSession[];
    singles: Battle[];
}

const GAP_THRESHOLD = 30 * 60 * 1000; // 30 minutes
const MIN_BATTLES = 3;
const ACTIVE_THRESHOLD = 2 * 60 * 60 * 1000; // 2 hours

export function detectSessions(battles: Battle[]): SessionDetectionResult {
    if (!battles || battles.length === 0) {
        return { sessions: [], singles: [] };
    }

    // Filter valid battles
    const validBattles = battles.filter(b =>
        b.team && b.team[0] && b.opponent && b.opponent[0] && b.battleTime
    );

    if (validBattles.length === 0) {
        return { sessions: [], singles: [] };
    }

    // Sort by time (newest first)
    const sorted = [...validBattles].sort((a, b) =>
        new Date(b.battleTime).getTime() - new Date(a.battleTime).getTime()
    );

    const tempSessions: Battle[][] = [];
    let currentSession: Battle[] = [];

    for (let i = 0; i < sorted.length; i++) {
        const battle = sorted[i];

        if (currentSession.length === 0) {
            currentSession.push(battle);
            continue;
        }

        const lastBattle = currentSession[currentSession.length - 1];
        const gap = new Date(lastBattle.battleTime).getTime() -
            new Date(battle.battleTime).getTime();

        if (gap > GAP_THRESHOLD) {
            // Save current session
            tempSessions.push([...currentSession]);
            currentSession = [battle];
        } else {
            currentSession.push(battle);
        }
    }

    // Don't forget last session
    if (currentSession.length > 0) {
        tempSessions.push(currentSession);
    }

    // Separate valid sessions (3+ battles) from singles
    const validSessions: PushSession[] = [];
    const singles: Battle[] = [];

    for (const sessionBattles of tempSessions) {
        if (sessionBattles.length >= MIN_BATTLES) {
            validSessions.push(createSession(sessionBattles, ACTIVE_THRESHOLD));
        } else {
            singles.push(...sessionBattles);
        }
    }

    return {
        sessions: validSessions,
        singles
    };
}

function createSession(battles: Battle[], activeThreshold: number): PushSession {
    // Sort chronologically (oldest first)
    const sorted = [...battles].sort((a, b) =>
        new Date(a.battleTime).getTime() - new Date(b.battleTime).getTime()
    );

    const startTime = new Date(sorted[0].battleTime);
    const endTime = new Date(sorted[sorted.length - 1].battleTime);
    const duration = endTime.getTime() - startTime.getTime();

    const wins = battles.filter(b =>
        b.team && b.team[0] && b.opponent && b.opponent[0] &&
        b.team[0].crowns > b.opponent[0].crowns
    ).length;

    const losses = battles.filter(b =>
        b.team && b.team[0] && b.opponent && b.opponent[0] &&
        b.team[0].crowns < b.opponent[0].crowns
    ).length;

    const draws = battles.filter(b =>
        b.team && b.team[0] && b.opponent && b.opponent[0] &&
        b.team[0].crowns === b.opponent[0].crowns
    ).length;

    const trophyDeltaTotal = battles.reduce((sum, b) => {
        if (!b.team || !b.team[0]) return sum;
        return sum + (b.team[0].trophyChange || 0);
    }, 0);

    const now = new Date();
    const isActive = (now.getTime() - endTime.getTime()) < activeThreshold;

    return {
        id: `session-${startTime.getTime()}`,
        battles: sorted,
        startTime,
        endTime,
        durationMinutes: Math.floor(duration / 60000),
        wins,
        losses,
        draws,
        winrate: battles.length > 0 ? (wins / battles.length) * 100 : 0,
        trophyDeltaTotal,
        isActive
    };
}
