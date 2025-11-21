'use client';

import { useState, useMemo } from 'react';
import { detectSessions, getSessionMessage, type Player, type Battle } from '@crstatus/shared';
import { Trophy, Calendar, TrendingUp, Clock, Target, Zap } from 'lucide-react';
import Link from 'next/link';

interface PlayerClientProps {
    player: Player | null;
    battles: Battle[];
}

export default function PlayerClient({ player, battles }: PlayerClientProps) {
    const [viewMode, setViewMode] = useState<'sessions' | 'chrono'>('sessions');

    const sessionData = useMemo(() => {
        return detectSessions(battles);
    }, [battles]);

    if (!player && battles.length === 0) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-900 flex items-center justify-center">
                <div className="text-center">
                    <Trophy className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-white mb-2">Player não encontrado</h2>
                    <p className="text-gray-400 mb-6">
                        Este jogador ainda não foi sincronizado. Faça a primeira sincronização via API.
                    </p>
                    <Link
                        href="/dashboard"
                        className="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                    >
                        Voltar ao Dashboard
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-900">
            {/* Header */}
            <header className="border-b border-gray-800">
                <div className="container mx-auto px-6 py-4">
                    <Link href="/dashboard" className="text-gray-400 hover:text-white transition-colors">
                        ← Voltar
                    </Link>
                </div>
            </header>

            {/* Player Info */}
            {player && (
                <div className="container mx-auto px-6 py-8">
                    <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 rounded-2xl p-8 mb-8">
                        <div className="flex items-start justify-between">
                            <div>
                                <h1 className="text-4xl font-bold text-white mb-2">{player.name}</h1>
                                <p className="text-gray-400 mb-4">#{player.tag}</p>
                                <div className="flex items-center gap-6">
                                    <div className="flex items-center gap-2">
                                        <Trophy className="w-5 h-5 text-yellow-500" />
                                        <span className="text-2xl font-bold text-white">{player.trophies.toLocaleString()}</span>
                                    </div>
                                    {player.bestTrophies && (
                                        <div className="flex items-center gap-2 text-gray-400">
                                            <TrendingUp className="w-4 h-4" />
                                            <span>PB: {player.bestTrophies.toLocaleString()}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Battle History */}
            <div className="container mx-auto px-6 pb-12">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-white">Histórico de Batalhas</h2>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setViewMode('sessions')}
                            className={`px-4 py-2 rounded-lg font-medium transition-colors ${viewMode === 'sessions'
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-800 text-gray-400 hover:text-white'
                                }`}
                        >
                            <Zap className="w-4 h-4 inline mr-2" />
                            Por Sessão
                        </button>
                        <button
                            onClick={() => setViewMode('chrono')}
                            className={`px-4 py-2 rounded-lg font-medium transition-colors ${viewMode === 'chrono'
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-800 text-gray-400 hover:text-white'
                                }`}
                        >
                            <Calendar className="w-4 h-4 inline mr-2" />
                            Cronológico
                        </button>
                    </div>
                </div>

                {viewMode === 'sessions' ? (
                    <div className="space-y-6">
                        {/* Active Sessions */}
                        {sessionData.sessions.filter(s => s.isActive).map((session) => {
                            const msg = getSessionMessage(session);
                            return (
                                <div
                                    key={session.id}
                                    className="bg-gradient-to-r from-green-600/20 to-blue-600/20 border border-green-500/30 rounded-2xl p-6"
                                >
                                    <div className="flex items-start justify-between mb-4">
                                        <div>
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className="text-2xl">{msg.emoji}</span>
                                                <h3 className="text-xl font-bold text-white">Sessão Ativa</h3>
                                            </div>
                                            <p className="text-green-400">{msg.message}</p>
                                        </div>
                                        <div className={`px-3 py-1 rounded-lg text-sm font-medium ${session.trophyDeltaTotal > 0
                                                ? 'bg-green-500/20 text-green-400'
                                                : session.trophyDeltaTotal < 0
                                                    ? 'bg-red-500/20 text-red-400'
                                                    : 'bg-gray-500/20 text-gray-400'
                                            }`}>
                                            {session.trophyDeltaTotal > 0 && '+'}
                                            {session.trophyDeltaTotal} troféus
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                                        <div>
                                            <p className="text-gray-400 text-sm">Vitórias</p>
                                            <p className="text-xl font-bold text-green-400">{session.wins}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-400 text-sm">Derrotas</p>
                                            <p className="text-xl font-bold text-red-400">{session.losses}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-400 text-sm">Winrate</p>
                                            <p className="text-xl font-bold text-white">{session.winrate.toFixed(0)}%</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-400 text-sm">Duração</p>
                                            <p className="text-xl font-bold text-white">{session.durationMinutes}min</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-gray-400">
                                        <Clock className="w-4 h-4" />
                                        <span>
                                            {new Date(session.startTime).toLocaleString('pt-BR')} - {new Date(session.endTime).toLocaleString('pt-BR')}
                                        </span>
                                    </div>
                                </div>
                            );
                        })}

                        {/* Past Sessions */}
                        {sessionData.sessions.filter(s => !s.isActive).map((session) => {
                            const msg = getSessionMessage(session);
                            return (
                                <div
                                    key={session.id}
                                    className="bg-gray-900/50 border border-gray-800 rounded-xl p-6"
                                >
                                    <div className="flex items-start justify-between mb-4">
                                        <div>
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className="text-xl">{msg.emoji}</span>
                                                <h3 className="text-lg font-semibold text-white">
                                                    {session.wins + session.losses + session.draws} batalhas
                                                </h3>
                                            </div>
                                            <p className={`text-sm ${msg.type === 'success' ? 'text-green-400' :
                                                    msg.type === 'danger' ? 'text-red-400' :
                                                        msg.type === 'warning' ? 'text-yellow-400' :
                                                            'text-gray-400'
                                                }`}>
                                                {msg.message}
                                            </p>
                                        </div>
                                        <div className={`px-3 py-1 rounded-lg text-sm font-medium ${session.trophyDeltaTotal > 0
                                                ? 'bg-green-500/20 text-green-400'
                                                : session.trophyDeltaTotal < 0
                                                    ? 'bg-red-500/20 text-red-400'
                                                    : 'bg-gray-500/20 text-gray-400'
                                            }`}>
                                            {session.trophyDeltaTotal > 0 && '+'}
                                            {session.trophyDeltaTotal}
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-4 gap-4 text-center text-sm">
                                        <div>
                                            <p className="text-gray-400">W</p>
                                            <p className="text-white font-semibold">{session.wins}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-400">L</p>
                                            <p className="text-white font-semibold">{session.losses}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-400">WR</p>
                                            <p className="text-white font-semibold">{session.winrate.toFixed(0)}%</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-400">Min</p>
                                            <p className="text-white font-semibold">{session.durationMinutes}</p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}

                        {/* Singles */}
                        {sessionData.singles.length > 0 && (
                            <div className="bg-gray-900/30 border border-gray-800 rounded-xl p-6">
                                <h3 className="text-lg font-semibold text-white mb-4">
                                    Batalhas Avulsas ({sessionData.singles.length})
                                </h3>
                                <div className="space-y-2">
                                    {sessionData.singles.slice(0, 5).map((battle) => (
                                        <div key={battle.id} className="flex items-center justify-between p-3 bg-gray-950 rounded-lg">
                                            <div>
                                                <p className="text-white font-medium">{battle.gameMode}</p>
                                                <p className="text-sm text-gray-400">
                                                    {new Date(battle.battleTime).toLocaleString('pt-BR')}
                                                </p>
                                            </div>
                                            <div className={`px-3 py-1 rounded-lg text-sm font-medium ${battle.result === 'win'
                                                    ? 'bg-green-500/20 text-green-400'
                                                    : battle.result === 'loss'
                                                        ? 'bg-red-500/20 text-red-400'
                                                        : 'bg-gray-500/20 text-gray-400'
                                                }`}>
                                                {battle.result.toUpperCase()}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="space-y-3">
                        {battles.map((battle) => (
                            <div
                                key={battle.id}
                                className="bg-gray-900/50 border border-gray-800 rounded-lg p-4 flex items-center justify-between"
                            >
                                <div>
                                    <p className="text-white font-medium">{battle.gameMode}</p>
                                    <p className="text-sm text-gray-400">
                                        {new Date(battle.battleTime).toLocaleString('pt-BR')}
                                    </p>
                                    {battle.opponentName && (
                                        <p className="text-sm text-gray-500">vs {battle.opponentName}</p>
                                    )}
                                </div>
                                <div className="text-right">
                                    <div className={`px-3 py-1 rounded-lg text-sm font-medium mb-1 ${battle.result === 'win'
                                            ? 'bg-green-500/20 text-green-400'
                                            : battle.result === 'loss'
                                                ? 'bg-red-500/20 text-red-400'
                                                : 'bg-gray-500/20 text-gray-400'
                                        }`}>
                                        {battle.result.toUpperCase()}
                                    </div>
                                    <p className={`text-sm font-medium ${battle.trophyChange > 0 ? 'text-green-400' :
                                            battle.trophyChange < 0 ? 'text-red-400' :
                                                'text-gray-400'
                                        }`}>
                                        {battle.trophyChange > 0 && '+'}{battle.trophyChange}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
