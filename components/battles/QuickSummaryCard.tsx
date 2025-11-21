import { motion } from 'framer-motion';
import { TrendingUp, Trophy, Swords, Zap, AlertTriangle } from 'lucide-react';
import { analyzeTilt } from '@/lib/tilt_analysis';
import { Battle } from '@/lib/types';

interface QuickSummaryCardProps {
    summary: {
        wins: number;
        losses: number;
        draws: number;
        winrate: number;
        trophyDeltaTotal: number;
        maxWinStreak: number;
    };
    battles: Battle[];
}

export default function QuickSummaryCard({ summary, battles }: QuickSummaryCardProps) {
    const winrateColor = summary.winrate >= 60 ? 'text-green-400' : summary.winrate >= 45 ? 'text-yellow-400' : 'text-red-400';
    const trophyColor = summary.trophyDeltaTotal > 0 ? 'text-green-400' : summary.trophyDeltaTotal < 0 ? 'text-red-400' : 'text-gray-400';

    const tiltAlert = analyzeTilt(battles);

    return (
        <div className="space-y-4 mb-8">
            {/* Tilt Alert Banner */}
            {tiltAlert && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className={`rounded-2xl p-4 border flex items-start gap-4 ${tiltAlert.severity === 'high'
                            ? 'bg-red-500/10 border-red-500/30'
                            : 'bg-orange-500/10 border-orange-500/30'
                        }`}
                >
                    <div className={`p-2 rounded-full ${tiltAlert.severity === 'high' ? 'bg-red-500/20' : 'bg-orange-500/20'
                        }`}>
                        <AlertTriangle className={`w-6 h-6 ${tiltAlert.severity === 'high' ? 'text-red-400' : 'text-orange-400'
                            }`} />
                    </div>
                    <div>
                        <h4 className={`font-bold text-lg ${tiltAlert.severity === 'high' ? 'text-red-400' : 'text-orange-400'
                            }`}>
                            {tiltAlert.severity === 'high' ? 'ALERTA DE TILT CRÍTICO' : 'Alerta de Tilt'}
                        </h4>
                        <p className="text-gray-300 text-sm mt-1 leading-relaxed">
                            {tiltAlert.message}
                        </p>
                    </div>
                </motion.div>
            )}

            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid grid-cols-2 md:grid-cols-4 gap-4"
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
        </div>
    );
}
