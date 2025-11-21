import Image from 'next/image';
import { MetaDeck } from '@/lib/types';
import { Copy, TrendingUp } from 'lucide-react';
import { useEffect } from 'react';
import { trackEvent } from '@/lib/analytics';

interface MetaDeckListProps {
    decks: MetaDeck[];
}

export default function MetaDeckList({ decks }: MetaDeckListProps) {
    useEffect(() => {
        trackEvent('meta_decks_view');
    }, []);

    const handleCopyDeck = (deck: MetaDeck) => {
        // Mock link generation - assuming deckId is a comma-separated list of card IDs or similar
        // Real format: https://link.clashroyale.com/deck/en?deck=26000000;26000001;...
        const link = `https://link.clashroyale.com/deck/en?deck=${deck.id.replace(/,/g, ';')}`;

        trackEvent('deck_copy_link', { source: 'meta', deckId: deck.id });
        window.open(link, '_blank');
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {decks.map((deck, index) => (
                <div
                    key={index}
                    className="bg-gray-900/50 border border-gray-800 rounded-2xl p-5 hover:border-gray-700 transition-all duration-300 group"
                >
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${index < 3 ? 'bg-yellow-500 text-black' : 'bg-gray-800 text-gray-400'
                                }`}>
                                {deck.rank}
                            </div>
                            <div className="text-sm font-medium text-white">
                                {deck.mode === 'ladder' ? 'Ladder' : 'Desafio'}
                            </div>
                        </div>
                        <button
                            onClick={() => handleCopyDeck(deck)}
                            className="text-gray-500 hover:text-blue-400 transition-colors"
                        >
                            <Copy className="w-4 h-4" />
                        </button>
                    </div>

                    <div className="grid grid-cols-4 gap-2 mb-4">
                        {deck.cards.map((card) => (
                            <div key={card.id} className="relative aspect-[3/4] bg-gray-800/50 rounded-lg overflow-hidden">
                                <Image
                                    src={card.iconUrls?.medium || ''}
                                    alt={card.name}
                                    fill
                                    className="object-contain p-0.5"
                                />
                            </div>
                        ))}
                    </div>

                    <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-4">
                            <div>
                                <div className="text-xs text-gray-500 mb-0.5">Winrate</div>
                                <div className={`font-bold ${deck.winrate >= 50 ? 'text-green-400' : 'text-red-400'}`}>
                                    {deck.winrate.toFixed(1)}%
                                </div>
                            </div>
                            <div>
                                <div className="text-xs text-gray-500 mb-0.5">Popularidade</div>
                                <div className="text-white font-medium">{deck.popularity.toFixed(1)}%</div>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="text-xs text-gray-500 mb-0.5">Elixir</div>
                            <div className="text-white font-medium">{deck.avgElixir}</div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
