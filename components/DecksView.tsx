import { motion } from 'framer-motion';
import Image from 'next/image';
import { Zap, Shield, Sword, BarChart2, Copy, ExternalLink } from 'lucide-react';
import { Player } from '@/lib/types';
import { trackEvent } from '@/lib/analytics';

interface DecksViewProps {
    player: Player;
}

export default function DecksView({ player }: DecksViewProps) {
    const deck = player.currentDeck;

    if (!deck || deck.length === 0) {
        return (
            <div className="text-center py-12 text-gray-500">
                Nenhum deck encontrado para este jogador.
            </div>
        );
    }

    // Calculate average elixir if available (mocking for now if missing)
    const averageElixir = deck.reduce((acc, card) => acc + (card.elixirCost || 0), 0) / deck.length;

    const handleCopyDeck = () => {
        // Generate deep link (mock logic as we need card IDs)
        // Real format: https://link.clashroyale.com/deck/en?deck=26000000;26000001;...
        const cardIds = deck.map(card => card.id).join(';');
        const deepLink = `https://link.clashroyale.com/deck/en?deck=${cardIds}`;

        trackEvent('deck_copy_link', { location: 'decks_view' });
        window.open(deepLink, '_blank');
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
        >
            <div className="premium-gradient border border-gray-800 p-8 rounded-3xl card-glow">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                    <div>
                        <h2 className="text-2xl font-light text-white text-glow">Deck Atual</h2>
                        <p className="text-gray-400 font-light">Deck utilizado na última batalha</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 px-4 py-2 bg-purple-500/10 border border-purple-500/20 rounded-xl">
                            <Zap className="w-4 h-4 text-purple-400" />
                            <span className="text-purple-400 font-medium">{averageElixir > 0 ? averageElixir.toFixed(1) : '?'} Elixir</span>
                        </div>
                        <button
                            onClick={handleCopyDeck}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl transition-colors font-medium shadow-lg shadow-blue-900/20"
                        >
                            <Copy className="w-4 h-4" />
                            Copiar Deck
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-4 gap-4 md:gap-6">
                    {deck.map((card, index) => (
                        <motion.div
                            key={card.id}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ scale: 1.05, y: -5 }}
                            className="relative aspect-[3/4] group"
                        >
                            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60 rounded-xl z-10" />
                            <Image
                                src={card.iconUrls?.medium || ''}
                                alt={card.name}
                                fill
                                className="object-contain drop-shadow-2xl"
                            />
                            <div className="absolute bottom-2 left-2 right-2 z-20">
                                <div className="text-xs text-white font-medium text-center bg-black/50 backdrop-blur-sm rounded-lg py-1 border border-white/10">
                                    Lvl {14 - (card.maxLevel - card.level)}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Deck Stats Analysis */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="premium-gradient border border-gray-800 p-6 rounded-3xl">
                    <div className="flex items-center gap-3 mb-4">
                        <Sword className="w-5 h-5 text-red-400" />
                        <h3 className="text-lg font-light text-white">Ofensiva</h3>
                    </div>
                    <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                        {/* Heuristic: Higher levels = better offense potential (simplified) */}
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${Math.min(100, (deck.reduce((acc, c) => acc + (14 - (c.maxLevel - c.level)), 0) / (deck.length * 14)) * 100)}%` }}
                            transition={{ duration: 1, delay: 0.5 }}
                            className="h-full bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]"
                        />
                    </div>
                    <p className="text-xs text-gray-500 mt-2">Baseado no nível das cartas</p>
                </div>

                <div className="premium-gradient border border-gray-800 p-6 rounded-3xl">
                    <div className="flex items-center gap-3 mb-4">
                        <Shield className="w-5 h-5 text-blue-400" />
                        <h3 className="text-lg font-light text-white">Defensiva</h3>
                    </div>
                    <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                        {/* Heuristic: Higher elixir cost often implies heavier/control decks */}
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${Math.min(100, (averageElixir / 5.0) * 100)}%` }}
                            transition={{ duration: 1, delay: 0.7 }}
                            className="h-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]"
                        />
                    </div>
                    <p className="text-xs text-gray-500 mt-2">Baseado no custo de elixir (Controle)</p>
                </div>

                <div className="premium-gradient border border-gray-800 p-6 rounded-3xl">
                    <div className="flex items-center gap-3 mb-4">
                        <BarChart2 className="w-5 h-5 text-green-400" />
                        <h3 className="text-lg font-light text-white">Versatilidade</h3>
                    </div>
                    <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                        {/* Heuristic: Lower elixir cost = faster cycle = more versatile */}
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${Math.min(100, (1 - (averageElixir / 6.0)) * 100 + 30)}%` }}
                            transition={{ duration: 1, delay: 0.9 }}
                            className="h-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]"
                        />
                    </div>
                    <p className="text-xs text-gray-500 mt-2">Baseado na velocidade de ciclo</p>
                </div>
            </div>
        </motion.div>
    );
}
