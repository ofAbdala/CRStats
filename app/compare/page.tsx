'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Swords, Trophy, Crown, Zap, Shield, BarChart2 } from 'lucide-react';
import { usePlayerData } from '@/lib/usePlayerData';
import AppSidebar from '@/components/AppSidebar';
import Image from 'next/image';
import { trackEvent } from '@/lib/analytics';

export default function ComparePage() {
    const [tag1Input, setTag1Input] = useState('');
    const [tag2Input, setTag2Input] = useState('');
    const [comparing, setComparing] = useState(false);

    const player1Hook = usePlayerData('');
    const player2Hook = usePlayerData('');

    useEffect(() => {
        trackEvent('player_compare_view');
    }, []);

    const handleCompare = async (e: React.FormEvent) => {
        e.preventDefault();

        const cleanTag1 = tag1Input.replace(/^#/, '').trim().toUpperCase();
        const cleanTag2 = tag2Input.replace(/^#/, '').trim().toUpperCase();

        if (!cleanTag1 || !cleanTag2) {
            return;
        }

        const [success1, success2] = await Promise.all([
            player1Hook.load(cleanTag1),
            player2Hook.load(cleanTag2)
        ]);

        if (success1 && success2) {
            setComparing(true);
            trackEvent('player_compare_run', { tag1: cleanTag1, tag2: cleanTag2 });
        }
    };

    const loading = player1Hook.loading || player2Hook.loading;
    const hasError = player1Hook.err || player2Hook.err;
    const player1 = player1Hook.player;
    const player2 = player2Hook.player;

    return (
        <>
            <AppSidebar />
            <div className="min-h-screen bg-black text-white p-6 lg:p-8">
                <div className="max-w-7xl mx-auto space-y-8">
                    {/* Header */}
                    <div>
                        <h1 className="text-3xl font-bold text-white mb-2">Comparar Jogadores</h1>
                        <p className="text-gray-400">Compare estatísticas de dois jogadores lado a lado.</p>
                    </div>

                    {/* Search Form */}
                    <form onSubmit={handleCompare} className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6">
                        <div className="grid md:grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">Jogador 1</label>
                                <input
                                    type="text"
                                    value={tag1Input}
                                    onChange={(e) => setTag1Input(e.target.value)}
                                    placeholder="#TAG do jogador 1"
                                    className="w-full bg-gray-950 border border-gray-800 text-white px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">Jogador 2</label>
                                <input
                                    type="text"
                                    value={tag2Input}
                                    onChange={(e) => setTag2Input(e.target.value)}
                                    placeholder="#TAG do jogador 2"
                                    className="w-full bg-gray-950 border border-gray-800 text-white px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                        </div>
                        <button
                            type="submit"
                            disabled={!tag1Input || !tag2Input || loading}
                            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-3 px-6 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            <Swords className="w-5 h-5" />
                            {loading ? 'Carregando...' : 'Comparar Agora'}
                        </button>
                    </form>

                    {/* Loading States */}
                    {loading && (
                        <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-8 text-center">
                            <div className="animate-pulse text-gray-400">Carregando jogadores...</div>
                        </div>
                    )}

                    {/* Error States */}
                    {hasError && (
                        <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6 space-y-2">
                            {player1Hook.err && (
                                <div className="text-red-400">
                                    <strong>Jogador 1:</strong> {player1Hook.err}
                                </div>
                            )}
                            {player2Hook.err && (
                                <div className="text-red-400">
                                    <strong>Jogador 2:</strong> {player2Hook.err}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Empty State */}
                    {!player1 && !player2 && !loading && !hasError && (
                        <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-12 text-center">
                            <Swords className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-white mb-2">Pronto para comparar?</h3>
                            <p className="text-gray-400">Digite as tags dos jogadores acima para começar.</p>
                        </div>
                    )}

                    {/* Comparison Results */}
                    {player1 && player2 && !loading && (
                        <div className="grid md:grid-cols-2 gap-6">
                            {/* Player 1 Card */}
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6 space-y-4"
                            >
                                <div className="text-center mb-4">
                                    <h2 className="text-2xl font-bold text-white mb-1">{player1.name}</h2>
                                    <p className="text-sm text-gray-400">#{player1.tag}</p>
                                    <p className="text-sm text-gray-400">{player1.clan || 'Sem Clã'}</p>
                                </div>

                                <div className="space-y-3">
                                    <StatRow icon={Trophy} label="Troféus" value={player1.trophies.toLocaleString()} />
                                    <StatRow icon={Crown} label="Melhor" value={player1.bestTrophies.toLocaleString()} />
                                    <StatRow icon={Zap} label="Nível" value={player1.expLevel} />
                                    <StatRow icon={Shield} label="Vitórias" value={player1.wins.toLocaleString()} />
                                    <StatRow icon={BarChart2} label="3 Coroas" value={player1.threeCrownWins.toLocaleString()} />
                                </div>
                            </motion.div>

                            {/* Player 2 Card */}
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6 space-y-4"
                            >
                                <div className="text-center mb-4">
                                    <h2 className="text-2xl font-bold text-white mb-1">{player2.name}</h2>
                                    <p className="text-sm text-gray-400">#{player2.tag}</p>
                                    <p className="text-sm text-gray-400">{player2.clan || 'Sem Clã'}</p>
                                </div>

                                <div className="space-y-3">
                                    <StatRow icon={Trophy} label="Troféus" value={player2.trophies.toLocaleString()} />
                                    <StatRow icon={Crown} label="Melhor" value={player2.bestTrophies.toLocaleString()} />
                                    <StatRow icon={Zap} label="Nível" value={player2.expLevel} />
                                    <StatRow icon={Shield} label="Vitórias" value={player2.wins.toLocaleString()} />
                                    <StatRow icon={BarChart2} label="3 Coroas" value={player2.threeCrownWins.toLocaleString()} />
                                </div>
                            </motion.div>
                        </div>
                    )}

                    {/* Comparison Summary */}
                    {player1 && player2 && !loading && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-gradient-to-r from-blue-600/10 to-purple-600/10 border border-blue-500/20 rounded-2xl p-6 text-center"
                        >
                            {player1.trophies > player2.trophies ? (
                                <p className="text-lg">
                                    🏆 {player1.name} está {(player1.trophies - player2.trophies).toLocaleString()} troféus à frente!
                                </p>
                            ) : player2.trophies > player1.trophies ? (
                                <p className="text-lg">
                                    🏆 {player2.name} está {(player2.trophies - player1.trophies).toLocaleString()} troféus à frente!
                                </p>
                            ) : (
                                <p className="text-lg">
                                    ⚖️ Empate! Ambos têm {player1.trophies.toLocaleString()} troféus
                                </p>
                            )}
                        </motion.div>
                    )}
                </div>
            </div>
        </>
    );
}

function StatRow({ icon: Icon, label, value }: { icon: any; label: string; value: string | number }) {
    return (
        <div className="flex items-center justify-between bg-gray-800/30 rounded-lg p-3">
            <div className="flex items-center gap-2">
                <Icon className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-400">{label}</span>
            </div>
            <span className="text-white font-semibold">{value}</span>
        </div>
    );
}
