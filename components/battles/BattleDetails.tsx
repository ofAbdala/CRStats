'use client';

import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Crown, Trophy, Swords, Clock, Copy, Zap } from 'lucide-react';
import { Battle } from '@/lib/types';
import { trackEvent } from '@/lib/analytics';
import { useToast } from '@/components/Toast';

interface BattleDetailsProps {
    battle: Battle;
    isExpanded: boolean;
}

export default function BattleDetails({ battle, isExpanded }: BattleDetailsProps) {
    const { showToast } = useToast();
    // Defensive check for battle structure
    if (!battle.team || !battle.team[0] || !battle.opponent || !battle.opponent[0]) {
        return null; // Skip rendering invalid battles
    }

    const myTeam = battle.team[0];
    const opponent = battle.opponent[0];

    // Calculate average elixir (mock logic if elixirCost is missing, ideally backend provides this)
    const calculateAvgElixir = (cards: any[]) => {
        const total = cards.reduce((acc, card) => acc + (card.elixirCost || 3.5), 0); // Fallback 3.5
        return (total / cards.length).toFixed(1);
    };

    const myAvgElixir = calculateAvgElixir(myTeam.cards);
    const oppAvgElixir = calculateAvgElixir(opponent.cards);

    const handleCopyDeck = async () => {
        const { copyDeckLink } = await import('@/lib/deckDeepLink');
        const result = await copyDeckLink(myTeam.cards, 'battle_history');

        if (result.success) {
            showToast('Link do deck copiado!');
        } else {
            showToast('Erro ao copiar link do deck.', 'error');
        }
    };

    return (
        <AnimatePresence>
            {isExpanded && (
                <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    className="overflow-hidden bg-black/40 border-t border-gray-800/50"
                >
                    <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* My Deck */}
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-2">
                                    <h4 className="text-sm font-medium text-white">Seu Deck</h4>
                                    <span className="text-xs text-gray-500 bg-gray-800 px-2 py-0.5 rounded-full">
                                        {myAvgElixir} Elixir
                                    </span>
                                </div>
                                <button
                                    onClick={handleCopyDeck}
                                    className="text-xs flex items-center gap-1 text-blue-400 hover:text-blue-300 transition-colors"
                                >
                                    <Copy className="w-3 h-3" /> Copiar
                                </button>
                            </div>
                            <div className="grid grid-cols-4 gap-2">
                                {myTeam.cards.map((card) => (
                                    <div key={card.id} className="relative aspect-[3/4] bg-gray-800/50 rounded-lg overflow-hidden border border-gray-700/50 group">
                                        <Image
                                            src={card.iconUrls?.medium || ''}
                                            alt={card.name}
                                            fill
                                            className="object-contain p-1"
                                        />
                                        <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-[10px] text-center text-white py-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                            Lvl {14 - (card.maxLevel - card.level)}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Opponent Deck */}
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-2">
                                    <h4 className="text-sm font-medium text-white">Oponente</h4>
                                    <span className="text-xs text-gray-500 bg-gray-800 px-2 py-0.5 rounded-full">
                                        {oppAvgElixir} Elixir
                                    </span>
                                </div>
                                <div className="text-xs text-gray-400">
                                    {opponent.name}
                                </div>
                            </div>
                            <div className="grid grid-cols-4 gap-2">
                                {opponent.cards.map((card) => (
                                    <div key={card.id} className="relative aspect-[3/4] bg-gray-800/50 rounded-lg overflow-hidden border border-gray-700/50 group">
                                        <Image
                                            src={card.iconUrls?.medium || ''}
                                            alt={card.name}
                                            fill
                                            className="object-contain p-1"
                                        />
                                        <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-[10px] text-center text-white py-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                            Lvl {14 - (card.maxLevel - card.level)}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Battle Stats Footer */}
                    <div className="bg-gray-900/30 px-6 py-3 border-t border-gray-800/50 flex items-center justify-between text-xs text-gray-400">
                        <div className="flex items-center gap-4">
                            <span className="flex items-center gap-1">
                                <Crown className="w-3 h-3 text-yellow-500" />
                                {myTeam.crowns} - {opponent.crowns}
                            </span>
                            <span className="flex items-center gap-1">
                                <Trophy className="w-3 h-3 text-blue-400" />
                                {myTeam.trophyChange > 0 ? '+' : ''}{myTeam.trophyChange}
                            </span>
                        </div>
                        <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {new Date(battle.battleTime).toLocaleString()}
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
