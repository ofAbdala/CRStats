import Image from 'next/image';
import { DeckStat } from '@/lib/types';
import { Layers, Trophy, AlertCircle } from 'lucide-react';
import { useToast } from '@/components/Toast';

interface DeckAnalyticsProps {
    decks: {
        decks: DeckStat[];
        topDeck: DeckStat | null;
        topDecksByWinrate: DeckStat[];
    };
}

export default function DeckAnalytics({ decks }: DeckAnalyticsProps) {
    const { topDeck, topDecksByWinrate } = decks;
    const { showToast } = useToast();

    if (!topDeck) {
        return (
            <div className="text-center py-8 text-gray-500">
                Dados insuficientes para análise de decks.
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Most Played Deck */}
            <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-medium text-white flex items-center gap-2">
                        <Layers className="w-5 h-5 text-blue-400" />
                        Deck Mais Utilizado
                    </h3>
                    <span className="text-sm text-gray-400 bg-gray-800 px-3 py-1 rounded-full">
                        {topDeck.matches} partidas
                    </span>
                </div>

                <div className="grid grid-cols-4 gap-2 mb-4">
                    {topDeck.cards.map((card) => (
                        <div key={card.id} className="relative aspect-[3/4] bg-gray-800/50 rounded-lg overflow-hidden">
                            <Image
                                src={card.iconUrls?.medium || ''}
                                alt={card.name}
                                fill
                                className="object-contain p-1"
                            />
                        </div>
                    ))}
                </div>

                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-800/50">
                    <div className="grid grid-cols-3 gap-4 text-center flex-1">
                        <div className="bg-gray-800/50 rounded-lg p-2">
                            <div className="text-xs text-gray-500 mb-1">Winrate</div>
                            <div className={`font-bold ${topDeck.winrate >= 50 ? 'text-green-400' : 'text-red-400'}`}>
                                {topDeck.winrate.toFixed(1)}%
                            </div>
                        </div>
                        <div className="bg-gray-800/50 rounded-lg p-2">
                            <div className="text-xs text-gray-500 mb-1">Elixir Médio</div>
                            <div className="text-white font-medium">{topDeck.avgElixir}</div>
                        </div>
                        <div className="bg-gray-800/50 rounded-lg p-2">
                            <div className="text-xs text-gray-500 mb-1">Resultado</div>
                            <div className="text-white font-medium text-xs">
                                {topDeck.wins}V - {topDeck.losses}D
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={async () => {
                            const { copyDeckLink } = await import('@/lib/deckDeepLink');
                            const result = await copyDeckLink(topDeck.cards, 'deck_analytics_top');
                            if (result.success) showToast('Link do deck copiado!');
                        }}
                        className="ml-4 p-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl transition-colors flex flex-col items-center justify-center gap-1 min-w-[80px]"
                    >
                        <div className="text-xs font-medium">Copiar</div>
                    </button>
                </div>
            </div>

            {/* Top Decks by Winrate */}
            <div>
                <h3 className="text-lg font-medium text-white mb-4 flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-yellow-500" />
                    Melhores Decks (Winrate)
                </h3>
                <div className="space-y-4">
                    {topDecksByWinrate.slice(0, 3).map((deck, idx) => (
                        <div key={idx} className="bg-gray-900/50 border border-gray-800 rounded-xl p-4 flex items-center gap-4">
                            <div className="flex -space-x-2 overflow-hidden">
                                {deck.cards.slice(0, 4).map((card) => (
                                    <div key={card.id} className="relative w-8 h-10 rounded bg-gray-800 border border-gray-700">
                                        <Image
                                            src={card.iconUrls?.medium || ''}
                                            alt={card.name}
                                            fill
                                            className="object-contain"
                                        />
                                    </div>
                                ))}
                                {deck.cards.length > 4 && (
                                    <div className="relative w-8 h-10 rounded bg-gray-800 border border-gray-700 flex items-center justify-center text-[10px] text-gray-400">
                                        +4
                                    </div>
                                )}
                            </div>

                            <div className="flex-1">
                                <div className="flex items-center gap-2 text-xs text-gray-400 mb-1">
                                    <span>{deck.matches} jogos</span>
                                    <span>•</span>
                                    <span>{deck.avgElixir} elixir</span>
                                </div>
                            </div>

                            <div className="text-right flex flex-col items-end gap-2">
                                <div className="text-lg font-bold text-green-400">{deck.winrate.toFixed(0)}%</div>
                                <button
                                    onClick={async (e) => {
                                        e.stopPropagation();
                                        const { copyDeckLink } = await import('@/lib/deckDeepLink');
                                        const result = await copyDeckLink(deck.cards, 'deck_analytics_list');
                                        if (result.success) showToast('Link do deck copiado!');
                                    }}
                                    className="text-xs text-blue-400 hover:text-blue-300 underline"
                                >
                                    Copiar
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
