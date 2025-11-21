import { motion } from 'framer-motion';
import { TrendingUp, Trophy, Swords, Zap } from 'lucide-react';

interface QuickSummaryCardProps {
    summary: {
        wins: number;
        losses: number;
        draws: number;
        winrate: number;
        trophyDeltaTotal: number;
        maxWinStreak: number;
    };
}

export default function QuickSummaryCard({ summary }: QuickSummaryCardProps) {
    const winrateColor = summary.winrate >= 60 ? 'text-green-400' : summary.winrate >= 45 ? 'text-yellow-400' : 'text-red-400';
    const trophyColor = summary.trophyDeltaTotal > 0 ? 'text-green-400' : summary.trophyDeltaTotal < 0 ? 'text-red-400' : 'text-gray-400';

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
        >
            {/* Winrate */}
            <div className="bg-gray-900/50 border border-gray-800 p-4 rounded-2xl flex flex-col items-center justify-center text-center">
                <div className="text-xs text-gray-500 mb-1 uppercase tracking-wider font-medium">Winrate</div>
                <div className={`text-2xl font-bold ${winrateColor}`}>{summary.winrate.toFixed(1)}%</div>
                <div className="text-xs text-gray-600 mt-1">
                    {summary.wins}V - {summary.losses}D - {summary.draws}E
                </div>
            </div>

            {/* Trophy Delta */}
            <div className="bg-gray-900/50 border border-gray-800 p-4 rounded-2xl flex flex-col items-center justify-center text-center">
                <div className="text-xs text-gray-500 mb-1 uppercase tracking-wider font-medium flex items-center gap-1">
                    <Trophy className="w-3 h-3" /> Saldo
                </div>
                <div className={`text-2xl font-bold ${trophyColor}`}>
                    {summary.trophyDeltaTotal > 0 ? '+' : ''}{summary.trophyDeltaTotal}
                </div>
                <div className="text-xs text-gray-600 mt-1">Troféus</div>
            </div>

            {/* Win Streak */}
            <div className="bg-gray-900/50 border border-gray-800 p-4 rounded-2xl flex flex-col items-center justify-center text-center">
                <div className="text-xs text-gray-500 mb-1 uppercase tracking-wider font-medium flex items-center gap-1">
                    <Zap className="w-3 h-3" /> Streak
                </div>
                <div className="text-2xl font-bold text-yellow-400">{summary.maxWinStreak}</div>
                <div className="text-xs text-gray-600 mt-1">Vitórias seguidas</div>
            </div>

            {/* Total Battles */}
            <div className="bg-gray-900/50 border border-gray-800 p-4 rounded-2xl flex flex-col items-center justify-center text-center">
                <div className="text-xs text-gray-500 mb-1 uppercase tracking-wider font-medium flex items-center gap-1">
                    <Swords className="w-3 h-3" /> Total
                </div>
                <div className="text-2xl font-bold text-white">{summary.wins + summary.losses + summary.draws}</div>
                <div className="text-xs text-gray-600 mt-1">Partidas filtradas</div>
            </div>
        </motion.div>
    );
}
