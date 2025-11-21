import { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';
import { Battle } from '@/lib/types';
import { Trophy, Swords, TrendingUp } from 'lucide-react';

interface AdvancedBattleAnalyticsProps {
    battles: Battle[];
}

export default function AdvancedBattleAnalytics({ battles }: AdvancedBattleAnalyticsProps) {
    // Process data for Trophy Progression Chart
    const trophyData = useMemo(() => {
        // Reverse to chronological order (oldest first)
        const sorted = [...battles].reverse();

        // Filter valid battles
        const validBattles = sorted.filter(b => b.team && b.team[0]);

        if (validBattles.length === 0) return [];

        let currentTrophies = validBattles[0]?.team[0].startingTrophies || 0;

        return validBattles.map((battle, index) => {
            const change = battle.team[0].trophyChange || 0;
            // For the chart, we want the trophies AFTER the battle
            // But startingTrophies is usually what we have.
            // Let's assume startingTrophies + change = endingTrophies
            const trophies = battle.team[0].startingTrophies + change;

            return {
                index: index + 1,
                trophies,
                result: change > 0 ? 'win' : change < 0 ? 'loss' : 'draw',
                change
            };
        });
    }, [battles]);

    // Process data for Game Mode Summary
    const modeStats = useMemo(() => {
        const stats: Record<string, { wins: number; losses: number; draws: number; total: number }> = {};

        battles.forEach(battle => {
            // Defensive check
            if (!battle.team || !battle.team[0] || !battle.opponent || !battle.opponent[0]) {
                return;
            }

            const mode = battle.gameMode.name;
            if (!stats[mode]) stats[mode] = { wins: 0, losses: 0, draws: 0, total: 0 };

            const myCrowns = battle.team[0].crowns;
            const oppCrowns = battle.opponent[0].crowns;

            stats[mode].total++;
            if (myCrowns > oppCrowns) stats[mode].wins++;
            else if (myCrowns < oppCrowns) stats[mode].losses++;
            else stats[mode].draws++;
        });

        return Object.entries(stats)
            .map(([name, data]) => ({ name, ...data, winrate: (data.wins / data.total) * 100 }))
            .sort((a, b) => b.total - a.total);
    }, [battles]);

    return (
        <div className="space-y-8">
            {/* Trophy Chart */}
            <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6">
                <h3 className="text-lg font-medium text-white mb-6 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-emerald-400" />
                    Progressão de Troféus
                </h3>
                <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={trophyData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
                            <XAxis dataKey="index" hide />
                            <YAxis
                                domain={['auto', 'auto']}
                                stroke="#9CA3AF"
                                tick={{ fill: '#9CA3AF', fontSize: 12 }}
                                tickLine={false}
                                axisLine={false}
                            />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#111827', borderColor: '#374151', borderRadius: '8px', color: '#fff' }}
                                itemStyle={{ color: '#fff' }}
                                formatter={(value: number) => [`${value} Troféus`, '']}
                                labelFormatter={() => ''}
                            />
                            <Line
                                type="monotone"
                                dataKey="trophies"
                                stroke="#10B981"
                                strokeWidth={2}
                                dot={false}
                                activeDot={{ r: 4, fill: '#10B981' }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Mode Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {modeStats.map((mode) => (
                    <div key={mode.name} className="bg-gray-900/50 border border-gray-800 rounded-xl p-4 flex items-center justify-between">
                        <div>
                            <div className="text-sm font-medium text-white mb-1">{mode.name}</div>
                            <div className="text-xs text-gray-500">{mode.total} partidas</div>
                        </div>
                        <div className="text-right">
                            <div className={`text-lg font-bold ${mode.winrate >= 50 ? 'text-green-400' : 'text-red-400'}`}>
                                {mode.winrate.toFixed(0)}%
                            </div>
                            <div className="text-xs text-gray-500">Winrate</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
