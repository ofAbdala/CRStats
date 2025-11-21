import { LeaderboardPlayer } from '@/lib/types';
import { Trophy, Crown, Search } from 'lucide-react';
import { useEffect, useState } from 'react';
import { trackEvent } from '@/lib/analytics';
import Link from 'next/link';

interface GlobalLeaderboardProps {
    players: LeaderboardPlayer[];
}

export default function GlobalLeaderboard({ players }: GlobalLeaderboardProps) {
    useEffect(() => {
        trackEvent('leaderboard_global_view');
    }, []);

    const [displayCount, setDisplayCount] = useState(10);
    const [searchQuery, setSearchQuery] = useState('');

    const filteredPlayers = players.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.tag.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const displayedPlayers = filteredPlayers.slice(0, displayCount);

    const handleLoadMore = () => {
        setDisplayCount(prev => prev + 10);
        trackEvent('leaderboard_load_more');
    };

    return (
        <div className="bg-gray-900/50 border border-gray-800 rounded-2xl overflow-hidden">
            <div className="p-6 border-b border-gray-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h3 className="text-lg font-medium text-white flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-yellow-500" />
                    Top Jogadores Globais
                </h3>

                <div className="relative">
                    <Search className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                        type="text"
                        placeholder="Buscar jogador..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="bg-gray-900 border border-gray-700 text-white text-sm rounded-lg pl-9 pr-4 py-2 focus:outline-none focus:border-blue-500 w-full sm:w-64"
                    />
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead className="bg-gray-900 text-gray-400 font-medium">
                        <tr>
                            <th className="px-6 py-3 w-16">#</th>
                            <th className="px-6 py-3">Jogador</th>
                            <th className="px-6 py-3">Clã</th>
                            <th className="px-6 py-3 text-right">Troféus</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800">
                        {displayedPlayers.map((player) => (
                            <tr
                                key={player.tag}
                                className="hover:bg-gray-800/50 transition-colors group"
                            >
                                <td className="px-6 py-4 font-medium text-gray-500 group-hover:text-white">
                                    {player.rank}
                                </td>
                                <td className="px-6 py-4">
                                    <Link href={`/${player.tag}`} className="flex items-center gap-3 hover:text-blue-400 transition-colors">
                                        <div className="font-medium text-white">{player.name}</div>
                                    </Link>
                                </td>
                                <td className="px-6 py-4 text-gray-400">
                                    {player.clan ? (
                                        <Link href={`/clan/${player.clan.tag}`} className="hover:text-white transition-colors">
                                            {player.clan.name}
                                        </Link>
                                    ) : (
                                        <span className="text-gray-600">-</span>
                                    )}
                                </td>
                                <td className="px-6 py-4 text-right font-medium text-yellow-500">
                                    <div className="flex items-center justify-end gap-1">
                                        <Trophy className="w-4 h-4" />
                                        {player.trophies.toLocaleString()}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {displayCount < filteredPlayers.length && (
                <div className="p-4 border-t border-gray-800 flex justify-center">
                    <button
                        onClick={handleLoadMore}
                        className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg text-sm transition-colors"
                    >
                        Carregar Mais
                    </button>
                </div>
            )}
        </div>
    );
}
