import type { Battle, PushSession } from '../types';

const GAP_THRESHOLD = 30 * 60 * 1000; // 30 minutes in ms
const MIN_BATTLES = 3;
const ACTIVE_THRESHOLD = 2 * 60 * 60 * 1000; // 2 hours in ms

export interface SessionDetectionResult {
    sessions: PushSession[];
    singles: Battle[];
}

/**
 * Detects push sessions from battle history
 * 
 * Rules:
 * - Battles are sorted from newest to oldest
 * - Sessions are created when gap between battles <= 30min
 * - Sessions must have >= 3 battles
 * - Sessions with < 3 battles go to singles array
 * - Session is "active" if it ended within the last 2 hours
 */
export function detectSessions(battles: Battle[]): SessionDetectionResult {
    if (!battles || battles.length === 0) {
        return { sessions: [], singles: [] };
    }

    // Filter valid battles
    const validBattles = battles.filter(b =>
        b.battleTime && b.playerTag && b.result
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
            // Save current session and start new one
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
    // Sort chronologically (oldest first) for session stats
    const sorted = [...battles].sort((a, b) =>
        new Date(a.battleTime).getTime() - new Date(b.battleTime).getTime()
    );

    const startTime = new Date(sorted[0].battleTime);
    const endTime = new Date(sorted[sorted.length - 1].battleTime);
    const duration = endTime.getTime() - startTime.getTime();

    const wins = battles.filter(b => b.result === 'win').length;
    const losses = battles.filter(b => b.result === 'loss').length;
    const draws = battles.filter(b => b.result === 'draw').length;

    const trophyDeltaTotal = battles.reduce((sum, b) => sum + (b.trophyChange || 0), 0);

    const now = new Date();
    const isActive = (now.getTime() - endTime.getTime()) < activeThreshold;

    return {
        id: `session-${startTime.getTime()}`,
        playerTag: battles[0].playerTag,
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
        durationMinutes: Math.floor(duration / 60000),
        wins,
        losses,
        draws,
        winrate: battles.length > 0 ? (wins / battles.length) * 100 : 0,
        trophyDeltaTotal,
        isActive,
        battles: sorted
    };
}

/**
 * Generate intelligent message based on session performance
 */
export function getSessionMessage(session: PushSession): {
    emoji: string;
    message: string;
    type: 'success' | 'warning' | 'info' | 'danger';
} {
    const { winrate, trophyDeltaTotal } = session;

    // Excellent performance
    if (winrate >= 60 && trophyDeltaTotal > 0) {
        return {
            emoji: '🔥',
            message: 'Excelente push! Continue assim!',
            type: 'success'
        };
    }

    // Good positive push
    if (trophyDeltaTotal > 0) {
        return {
            emoji: '📈',
            message: `Push positivo! Você ganhou ${trophyDeltaTotal} troféus!`,
            type: 'success'
        };
    }

    // Significant trophy loss (tilt warning)
    if (trophyDeltaTotal <= -50) {
        return {
            emoji: '⚠️',
            message: `Considere fazer uma pausa. Você perdeu ${Math.abs(trophyDeltaTotal)} troféus.`,
            type: 'danger'
        };
    }

    // Negative session
    if (trophyDeltaTotal < 0) {
        return {
            emoji: '📉',
            message: `Sessão negativa. Perdeu ${Math.abs(trophyDeltaTotal)} troféus.`,
            type: 'warning'
        };
    }

    // Neutral session
    return {
        emoji: '⏱️',
        message: 'Sessão neutra. Sem ganhos ou perdas significativas.',
        type: 'info'
    };
}
