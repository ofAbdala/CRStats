import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Clock, TrendingUp, TrendingDown, Trophy, Target } from 'lucide-react';
import { Battle } from '@/lib/types';

interface PushSummaryProps {
    battles: Battle[];
}

export default function PushSummary({ battles }: PushSummaryProps) {
    const pushData = useMemo(() => {
        if (battles.length < 3) return null;

        // Filter valid battles
        const validBattles = battles.filter(b =>
            b.team && b.team[0] && b.opponent && b.opponent[0] && b.battleTime
        );

        if (validBattles.length < 3) return null;

        // Sort by time (most recent first)
        const sorted = [...validBattles].sort((a, b) =>
            new Date(b.battleTime).getTime() - new Date(a.battleTime).getTime()
        );

        // Detect push session (battles within 2 hours)
        const TWO_HOURS = 2 * 60 * 60 * 1000;
        const now = new Date();
        const pushBattles = [];

        for (const battle of sorted) {
            const battleTime = new Date(battle.battleTime);
            const timeDiff = now.getTime() - battleTime.getTime();

            if (timeDiff <= TWO_HOURS) {
                pushBattles.push(battle);
            } else {
                break; // Stop when we hit old battles
            }
        }

        if (pushBattles.length < 3) return null;

        // Calculate push stats
        const wins = pushBattles.filter(b => b.team[0].crowns > b.opponent[0].crowns).length;
        const losses = pushBattles.filter(b => b.team[0].crowns < b.opponent[0].crowns).length;
        const draws = pushBattles.filter(b => b.team[0].crowns === b.opponent[0].crowns).length;

        const trophyChange = pushBattles.reduce((sum, b) => {
            return sum + (b.team[0].trophyChange || 0);
        }, 0);

        const firstBattle = pushBattles[pushBattles.length - 1];
        const lastBattle = pushBattles[0];
        const duration = new Date(lastBattle.battleTime).getTime() - new Date(firstBattle.battleTime).getTime();
        const durationMinutes = Math.floor(duration / 60000);

        const winrate = ((wins / pushBattles.length) * 100).toFixed(1);

        return {
            totalGames: pushBattles.length,
            wins,
            losses,
            draws,
            winrate: parseFloat(winrate),
            trophyChange,
            durationMinutes,
            isPositive: trophyChange > 0
        };
    }, [battles]);

    if (!pushData) return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-purple-900/30 to-blue-900/30 border border-purple-700/50 rounded-2xl p-6 mb-6"
        >
            <div className="flex items-center gap-2 mb-4">
                <Clock className="w-5 h-5 text-purple-400" />
                <h3 className="text-lg font-bold text-white">Sessão de Push Ativa</h3>
                <span className="text-sm text-gray-400">({pushData.durationMinutes} min)</span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {/* Total Games */}
                <div className="bg-black/30 rounded-xl p-4 text-center">
                    <div className="text-2xl font-bold text-white mb-1">{pushData.totalGames}</div>
                    <div className="text-xs text-gray-400">Partidas</div>
                </div>

                {/* Winrate */}
                <div className="bg-black/30 rounded-xl p-4 text-center">
                    <div className={`text-2xl font-bold mb-1 ${pushData.winrate >= 50 ? 'text-green-400' : 'text-red-400'
                        }`}>
                        {pushData.winrate}%
                    </div>
                    <div className="text-xs text-gray-400">Winrate</div>
                </div>

                {/* W/L */}
                <div className="bg-black/30 rounded-xl p-4 text-center">
                    <div className="text-2xl font-bold text-white mb-1">
                        <span className="text-green-400">{pushData.wins}</span>
                        <span className="text-gray-500">/</span>
                        <span className="text-red-400">{pushData.losses}</span>
                    </div>
                    <div className="text-xs text-gray-400">V/D</div>
                </div>

                {/* Trophy Change */}
                <div className="bg-black/30 rounded-xl p-4 text-center">
                    <div className={`text-2xl font-bold mb-1 flex items-center justify-center gap-1 ${pushData.isPositive ? 'text-green-400' : 'text-red-400'
                        }`}>
                        {pushData.isPositive ? (
                            <TrendingUp className="w-5 h-5" />
                        ) : (
                            <TrendingDown className="w-5 h-5" />
                        )}
                        {pushData.trophyChange > 0 ? '+' : ''}{pushData.trophyChange}
                    </div>
                    <div className="text-xs text-gray-400">Troféus</div>
                </div>
            </div>

            {/* Performance Message */}
            <div className="mt-4 p-3 bg-black/30 rounded-lg">
                {pushData.isPositive && pushData.winrate >= 60 ? (
                    <p className="text-sm text-green-400 flex items-center gap-2">
                        <Target className="w-4 h-4" />
                        Excelente push! Continue assim! 🔥
                    </p>
                ) : pushData.isPositive ? (
                    <p className="text-sm text-blue-400 flex items-center gap-2">
                        <Trophy className="w-4 h-4" />
                        Push positivo! Você está subindo! 📈
                    </p>
                ) : pushData.trophyChange < -50 ? (
                    <p className="text-sm text-red-400 flex items-center gap-2">
                        <TrendingDown className="w-4 h-4" />
                        Considere fazer uma pausa. Você perdeu {Math.abs(pushData.trophyChange)} troféus.
                    </p>
                ) : (
                    <p className="text-sm text-yellow-400 flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        Continue focado! Você está em uma sessão de {pushData.totalGames} partidas.
                    </p>
                )}
            </div>
        </motion.div>
    );
}
