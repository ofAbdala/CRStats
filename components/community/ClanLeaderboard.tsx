import { Clan } from '@/lib/types';
import { Users, Trophy, Crown } from 'lucide-react';
import { useEffect } from 'react';
import { trackEvent } from '@/lib/analytics';
import Link from 'next/link';

interface ClanLeaderboardProps {
    clans: Clan[];
}

export default function ClanLeaderboard({ clans }: ClanLeaderboardProps) {
    useEffect(() => {
        trackEvent('leaderboard_clan_view');
    }, []);

    return (
        <div className="bg-gray-900/50 border border-gray-800 rounded-2xl overflow-hidden">
            <div className="p-6 border-b border-gray-800">
                <h3 className="text-lg font-medium text-white flex items-center gap-2">
                    <Users className="w-5 h-5 text-purple-400" />
                    Top Clãs
                </h3>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead className="bg-gray-900 text-gray-400 font-medium">
                        <tr>
                            <th className="px-6 py-3 w-16">#</th>
                            <th className="px-6 py-3">Clã</th>
                            <th className="px-6 py-3">Membros</th>
                            <th className="px-6 py-3 text-right">Troféus</th>
                            <th className="px-6 py-3 text-right">Guerra</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800">
                        {clans.map((clan, index) => (
                            <tr
                                key={clan.tag}
                                className="hover:bg-gray-800/50 transition-colors group cursor-pointer"
                                onClick={() => {
                                    trackEvent('leaderboard_clan_click', { clanTag: clan.tag });
                                    window.location.href = `/clan/${clan.tag}`;
                                }}
                            >
                                <td className="px-6 py-4 font-medium text-gray-500 group-hover:text-white">
                                    {index + 1}
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="font-medium text-white group-hover:text-purple-400 transition-colors">
                                            {clan.name}
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-gray-400">
                                    {clan.members?.length || clan.memberList?.length || 0}/50
                                </td>
                                <td className="px-6 py-4 text-right font-medium text-yellow-500">
                                    <div className="flex items-center justify-end gap-1">
                                        <Trophy className="w-4 h-4" />
                                        {clan.clanScore?.toLocaleString()}
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-right font-medium text-red-400">
                                    <div className="flex items-center justify-end gap-1">
                                        <Crown className="w-4 h-4" />
                                        {clan.clanWarTrophies?.toLocaleString()}
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
