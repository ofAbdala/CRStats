import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, Clock, TrendingUp, TrendingDown, Trophy, Target, Zap } from 'lucide-react';
import { PushSession } from '@/lib/sessionDetector';
import { trackEvent } from '@/lib/analytics';
import BattleList from './BattleList';

interface SessionGroupProps {
    session: PushSession;
}

export default function SessionGroup({ session }: SessionGroupProps) {
    const [isExpanded, setIsExpanded] = useState(session.isActive);

    const handleToggle = () => {
        const newState = !isExpanded;
        setIsExpanded(newState);

        trackEvent(newState ? 'session_expand' : 'session_collapse', {
            sessionId: session.id,
            battles: session.battles.length,
            trophyDelta: session.trophyDeltaTotal
        });
    };

    const getTimeAgo = () => {
        const now = new Date();
        const diff = now.getTime() - session.endTime.getTime();
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

        if (session.isActive) {
            return 'SESSÃO ATIVA';
        } else if (hours < 1) {
            return `Há ${minutes} min`;
        } else if (hours < 24) {
            return `Há ${hours}h`;
        } else {
            const days = Math.floor(hours / 24);
            return `Há ${days}d`;
        }
    };

    const getPerformanceMessage = () => {
        if (session.winrate >= 60 && session.trophyDeltaTotal > 0) {
            return { icon: Target, text: '🔥 Excelente push! Continue assim!', color: 'text-green-400' };
        } else if (session.trophyDeltaTotal > 0) {
            return { icon: Trophy, text: '📈 Push positivo! Você está subindo!', color: 'text-blue-400' };
        } else if (session.trophyDeltaTotal <= -50) {
            return {
                icon: TrendingDown,
                text: `⚠️ Considere fazer uma pausa. Você perdeu ${Math.abs(session.trophyDeltaTotal)} troféus.`,
                color: 'text-red-400'
            };
        } else if (session.trophyDeltaTotal < 0) {
            return { icon: TrendingDown, text: '⚠️ Sessão negativa', color: 'text-yellow-400' };
        } else {
            return { icon: Zap, text: '⏱️ Sessão neutra', color: 'text-gray-400' };
        }
    };

    const performance = getPerformanceMessage();
    const Icon = performance.icon;

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`rounded-2xl border overflow-hidden ${session.isActive
                ? 'border-purple-700/50 bg-gradient-to-br from-purple-900/30 to-blue-900/30'
                : 'border-gray-800 bg-gray-900/30'
                }`}
        >
            {/* Header - Always Visible */}
            <button
                onClick={handleToggle}
                className="w-full p-6 text-left hover:bg-white/5 transition-colors"
            >
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        {session.isActive ? (
                            <div className="w-3 h-3 bg-purple-500 rounded-full animate-pulse" />
                        ) : (
                            <div className="w-3 h-3 bg-gray-600 rounded-full" />
                        )}
                        <span className={`font-bold ${session.isActive ? 'text-purple-400' : 'text-gray-400'}`}>
                            {getTimeAgo()}
                        </span>
                        <span className="text-gray-500">•</span>
                        <span className="text-gray-400 text-sm flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {session.durationMinutes} min
                        </span>
                    </div>
                    {isExpanded ? (
                        <ChevronUp className="w-5 h-5 text-gray-400" />
                    ) : (
                        <ChevronDown className="w-5 h-5 text-gray-400" />
                    )}
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-4 gap-3 mb-4">
                    {/* Total Games */}
                    <div className="bg-black/30 rounded-lg p-3 text-center">
                        <div className="text-xl font-bold text-white">{session.battles.length}</div>
                        <div className="text-xs text-gray-500">Partidas</div>
                    </div>

                    {/* Winrate */}
                    <div className="bg-black/30 rounded-lg p-3 text-center">
                        <div className={`text-xl font-bold ${session.winrate >= 50 ? 'text-green-400' : 'text-red-400'
                            }`}>
                            {session.winrate.toFixed(0)}%
                        </div>
                        <div className="text-xs text-gray-500">WR</div>
                    </div>

                    {/* W/L */}
                    <div className="bg-black/30 rounded-lg p-3 text-center">
                        <div className="text-xl font-bold text-white">
                            <span className="text-green-400">{session.wins}</span>
                            <span className="text-gray-600">/</span>
                            <span className="text-red-400">{session.losses}</span>
                        </div>
                        <div className="text-xs text-gray-500">V/D</div>
                    </div>

                    {/* Trophy Change */}
                    <div className="bg-black/30 rounded-lg p-3 text-center">
                        <div className={`text-xl font-bold flex items-center justify-center gap-1 ${session.trophyDeltaTotal > 0 ? 'text-green-400' : session.trophyDeltaTotal < 0 ? 'text-red-400' : 'text-gray-400'
                            }`}>
                            {session.trophyDeltaTotal > 0 ? (
                                <TrendingUp className="w-4 h-4" />
                            ) : session.trophyDeltaTotal < 0 ? (
                                <TrendingDown className="w-4 h-4" />
                            ) : null}
                            {session.trophyDeltaTotal > 0 ? '+' : ''}{session.trophyDeltaTotal}
                        </div>
                        <div className="text-xs text-gray-500">Troféus</div>
                    </div>
                </div>

                {/* Performance Message */}
                <div className="bg-black/30 rounded-lg p-3">
                    <p className={`text-sm flex items-center gap-2 ${performance.color}`}>
                        <Icon className="w-4 h-4" />
                        {performance.text}
                    </p>
                </div>
            </button>

            {/* Battle List - Collapsible */}
            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="border-t border-gray-800"
                    >
                        <div className="p-4">
                            <BattleList battles={session.battles} />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}
