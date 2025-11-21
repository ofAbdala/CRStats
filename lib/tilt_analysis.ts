import { Battle } from '@/lib/types';
import { AlertTriangle, TrendingDown } from 'lucide-react';

export interface TiltAlert {
    severity: 'low' | 'medium' | 'high';
    message: string;
    type: 'losing_streak' | 'trophy_drop' | 'low_winrate';
}

export function analyzeTilt(battles: Battle[]): TiltAlert | null {
    if (battles.length < 5) return null;

    const recentBattles = battles.slice(0, 5);

    // Filter out invalid battles
    const validBattles = recentBattles.filter(b =>
        b.team && b.team[0] && b.opponent && b.opponent[0]
    );

    if (validBattles.length < 3) return null; // Not enough valid data

    const losses = validBattles.filter(b => b.team[0].crowns < b.opponent[0].crowns).length;

    // High Severity: 4+ losses in last 5 games
    if (losses >= 4) {
        return {
            severity: 'high',
            message: 'Alerta de Tilt: Você perdeu 4 das últimas 5 partidas. Recomendamos uma pausa de 15 minutos.',
            type: 'losing_streak'
        };
    }

    // Medium Severity: 3 losses in a row
    const streak = validBattles.findIndex(b => b.team[0].crowns > b.opponent[0].crowns);
    if (streak >= 3) {
        return {
            severity: 'medium',
            message: 'Cuidado: Sequência de 3 derrotas detectada. Respire fundo antes da próxima partida.',
            type: 'losing_streak'
        };
    }

    return null;
}
