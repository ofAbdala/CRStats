import { useState, useEffect } from 'react';
import { LeaderboardPlayer } from '@/lib/types';
import { Trophy, Globe } from 'lucide-react';
import Link from 'next/link';
import { trackEvent } from '@/lib/analytics';

interface CountryLeaderboardProps {
    players: LeaderboardPlayer[];
}

export default function CountryLeaderboard({ players }: CountryLeaderboardProps) {
    const [selectedCountry, setSelectedCountry] = useState('BR');

    const handleCountryChange = (country: string) => {
        setSelectedCountry(country);
        trackEvent('leaderboard_country_change', { countryCode: country });
    };

    const countries = [
        { code: 'BR', name: 'Brasil' },
        { code: 'US', name: 'Estados Unidos' },
        { code: 'JP', name: 'Japão' },
        { code: 'KR', name: 'Coreia do Sul' },
        { code: 'FR', name: 'França' },
        { code: 'DE', name: 'Alemanha' },
    ];

    return (
        <div className="bg-gray-900/50 border border-gray-800 rounded-2xl overflow-hidden">
            <div className="p-6 border-b border-gray-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h3 className="text-lg font-medium text-white flex items-center gap-2">
                    <Globe className="w-5 h-5 text-blue-400" />
                    Top Jogadores por País
                </h3>

                <select
                    value={selectedCountry}
                    onChange={(e) => handleCountryChange(e.target.value)}
                    className="bg-gray-950 border border-gray-800 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5"
                >
                    {countries.map((c) => (
                        <option key={c.code} value={c.code}>{c.name}</option>
                    ))}
                </select>
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
                        {players.map((player) => (
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
        </div>
    );
}
