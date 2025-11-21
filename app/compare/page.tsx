'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Swords, Trophy, Crown, Zap, Shield, BarChart2, Layers } from 'lucide-react';
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
        <div className="min-h-screen bg-black text-white flex">
            <AppSidebar activeSection="compare" />

            <div className="flex-1 min-w-0 flex flex-col p-6 lg:p-8 overflow-y-auto h-screen">
                <div className="max-w-7xl mx-auto space-y-8 w-full">
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
                        <div className="space-y-8">
                            {/* Summary Banner */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-gradient-to-r from-blue-900/40 to-purple-900/40 border border-blue-500/20 rounded-2xl p-8 text-center relative overflow-hidden"
                            >
                                <div className="absolute inset-0 bg-grid-white/[0.02] bg-[length:20px_20px]" />
                                <div className="relative z-10 flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16">
                                    <div className="text-center">
                                        <h2 className="text-3xl font-bold text-white mb-1">{player1.name}</h2>
                                        <p className="text-blue-400 font-medium">#{player1.tag}</p>
                                        <p className="text-sm text-gray-500 mt-1">{player1.clan?.name || 'Sem Clã'}</p>
                                    </div>

                                    <div className="flex flex-col items-center">
                                        <div className="text-4xl font-black text-yellow-500 mb-2">VS</div>
                                        {player1.trophies > player2.trophies ? (
                                            <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-xs font-bold border border-blue-500/30">
                                                {player1.name} Lidera
                                            </span>
                                        ) : player2.trophies > player1.trophies ? (
                                            <span className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full text-xs font-bold border border-purple-500/30">
                                                {player2.name} Lidera
                                            </span>
                                        ) : (
                                            <span className="px-3 py-1 bg-gray-700 text-gray-300 rounded-full text-xs font-bold">
                                                Empate
                                            </span>
                                        )}
                                    </div>

                                    <div className="text-center">
                                        <h2 className="text-3xl font-bold text-white mb-1">{player2.name}</h2>
                                        <p className="text-purple-400 font-medium">#{player2.tag}</p>
                                        <p className="text-sm text-gray-500 mt-1">{player2.clan?.name || 'Sem Clã'}</p>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Stats Comparison Table */}
                            <div className="bg-gray-900/50 border border-gray-800 rounded-2xl overflow-hidden">
                                <div className="grid grid-cols-3 bg-gray-900/80 border-b border-gray-800 p-4 text-sm font-medium text-gray-400 uppercase tracking-wider text-center">
                                    <div>{player1.name}</div>
                                    <div>Métrica</div>
                                    <div>{player2.name}</div>
                                </div>
                                <div className="divide-y divide-gray-800">
                                    <ComparisonRow
                                        label="Troféus Atuais"
                                        value1={player1.trophies}
                                        value2={player2.trophies}
                                        format={(v: number) => v.toLocaleString()}
                                        icon={Trophy}
                                    />
                                    <ComparisonRow
                                        label="Recorde de Troféus"
                                        value1={player1.bestTrophies}
                                        value2={player2.bestTrophies}
                                        format={(v: number) => v.toLocaleString()}
                                        icon={Crown}
                                    />
                                    <ComparisonRow
                                        label="Nível de Experiência"
                                        value1={player1.expLevel}
                                        value2={player2.expLevel}
                                        icon={Zap}
                                    />
                                    <ComparisonRow
                                        label="Total de Vitórias"
                                        value1={player1.wins}
                                        value2={player2.wins}
                                        format={(v: number) => v.toLocaleString()}
                                        icon={Swords}
                                    />
                                    <ComparisonRow
                                        label="Taxa de Vitória (Estimada)"
                                        value1={((player1.wins / (player1.wins + player1.losses || 1)) * 100)}
                                        value2={((player2.wins / (player2.wins + player2.losses || 1)) * 100)}
                                        format={(v: number) => `${v.toFixed(1)}%`}
                                        icon={BarChart2}
                                    />
                                    <ComparisonRow
                                        label="Três Coroas"
                                        value1={player1.threeCrownWins}
                                        value2={player2.threeCrownWins}
                                        format={(v: number) => v.toLocaleString()}
                                        icon={Crown}
                                    />
                                    <ComparisonRow
                                        label="Total de Doações"
                                        value1={player1.totalDonations}
                                        value2={player2.totalDonations}
                                        format={(v: number) => v.toLocaleString()}
                                        icon={Shield}
                                    />
                                </div>
                            </div>

                            {/* Decks Comparison */}
                            <div className="grid md:grid-cols-2 gap-6">
                                <DeckPreview player={player1} color="blue" />
                                <DeckPreview player={player2} color="purple" />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

function ComparisonRow({ label, value1, value2, format = (v: any) => v, icon: Icon }: any) {
    const isV1Better = value1 > value2;
    const isV2Better = value2 > value1;
    const isEqual = value1 === value2;

    return (
        <div className="grid grid-cols-3 p-4 hover:bg-gray-800/30 transition-colors items-center">
            <div className={`text-center font-medium ${isV1Better ? 'text-green-400' : isEqual ? 'text-white' : 'text-gray-500'}`}>
                {format(value1)}
                {isV1Better && <span className="ml-2 text-xs bg-green-500/10 text-green-400 px-1.5 py-0.5 rounded">+{format(value1 - value2)}</span>}
            </div>
            <div className="flex flex-col items-center justify-center gap-1">
                <div className="p-2 bg-gray-800 rounded-full text-gray-400">
                    <Icon className="w-4 h-4" />
                </div>
                <span className="text-xs text-gray-500 font-medium text-center">{label}</span>
            </div>
            <div className={`text-center font-medium ${isV2Better ? 'text-green-400' : isEqual ? 'text-white' : 'text-gray-500'}`}>
                {format(value2)}
                {isV2Better && <span className="ml-2 text-xs bg-green-500/10 text-green-400 px-1.5 py-0.5 rounded">+{format(value2 - value1)}</span>}
            </div>
        </div>
    );
}

function DeckPreview({ player, color }: { player: any, color: 'blue' | 'purple' }) {
    const borderColor = color === 'blue' ? 'border-blue-500/30' : 'border-purple-500/30';
    const titleColor = color === 'blue' ? 'text-blue-400' : 'text-purple-400';

    return (
        <div className={`bg-gray-900/50 border ${borderColor} rounded-2xl p-6`}>
            <h3 className={`text-lg font-bold ${titleColor} mb-4 flex items-center gap-2`}>
                <Layers className="w-5 h-5" />
                Deck Atual de {player.name}
            </h3>
            {player.currentDeck && player.currentDeck.length > 0 ? (
                <div className="grid grid-cols-4 gap-2">
                    {player.currentDeck.map((card: any) => (
                        <div key={card.id} className="aspect-[3/4] relative bg-gray-800 rounded-lg overflow-hidden border border-gray-700">
                            <Image
                                src={card.iconUrls?.medium || ''}
                                alt={card.name}
                                fill
                                className="object-contain p-1"
                            />
                            <div className="absolute bottom-0 inset-x-0 bg-black/60 text-[10px] text-center text-white py-0.5">
                                Lvl {14 - (card.maxLevel - card.level)}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-8 text-gray-500">
                    Deck não disponível
                </div>
            )}
            <div className="mt-4 flex justify-between text-sm text-gray-400">
                <span>Custo Médio: {(player.currentDeck?.reduce((acc: number, c: any) => acc + (c.elixirCost || 0), 0) / 8).toFixed(1)}</span>
            </div>
        </div>
    );
}
