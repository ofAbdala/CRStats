'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Users, Trophy, Crown, TrendingUp, ArrowLeft, Star } from 'lucide-react';
import AppSidebar from '@/components/AppSidebar';
import { Clan } from '@/lib/types';
import { trackEvent } from '@/lib/analytics';

interface ClanPageClientProps {
    tag: string;
}

export default function ClanPageClient({ tag }: ClanPageClientProps) {
    const router = useRouter();
    const [clan, setClan] = useState<Clan | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchClan() {
            try {
                setLoading(true);
                setError(null);

                // Normalize tag (remove # if present)
                const normalizedTag = tag.replace(/^#/, '').toUpperCase();

                const response = await fetch(`https://api.clashroyale.com/v1/clans/%23${normalizedTag}`, {
                    headers: {
                        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_CLASH_API_KEY || ''}`
                    }
                });

                if (!response.ok) {
                    throw new Error('Clã não encontrado');
                }

                const data = await response.json();
                setClan(data);

                trackEvent('clan_view', { clanTag: normalizedTag });
            } catch (err: any) {
                setError(err.message || 'Erro ao carregar clã');
            } finally {
                setLoading(false);
            }
        }

        fetchClan();
    }, [tag]);

    const handleMemberClick = (memberTag: string) => {
        trackEvent('clan_member_click', { clanTag: tag, memberTag });
        router.push(`/${memberTag}`);
    };

    const handleRankingView = () => {
        trackEvent('clan_internal_rank_view', { clanTag: tag });
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-black text-white flex">
                <AppSidebar activeSection="community" />
                <div className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                        <p className="text-gray-400">Carregando clã...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error || !clan) {
        return (
            <div className="min-h-screen bg-black text-white flex">
                <AppSidebar activeSection="community" />
                <div className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                        <Users className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                        <h2 className="text-2xl font-bold text-white mb-2">Clã não encontrado</h2>
                        <p className="text-gray-400 mb-6">{error}</p>
                        <button
                            onClick={() => router.push('/community')}
                            className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl transition-colors"
                        >
                            Voltar para Comunidade
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const members = clan.memberList || clan.members || [];
    const sortedMembers = [...members].sort((a, b) => b.trophies - a.trophies);

    return (
        <div className="min-h-screen bg-black text-white flex">
            <AppSidebar activeSection="community" />

            <div className="flex-1 min-w-0 p-8">
                {/* Header */}
                <div className="mb-8">
                    <button
                        onClick={() => router.back()}
                        className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-4"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Voltar
                    </button>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-gradient-to-br from-purple-900/20 to-blue-900/20 border border-purple-500/20 p-8 rounded-3xl"
                    >
                        <div className="flex items-start gap-6">
                            <div className="w-20 h-20 bg-purple-500/20 rounded-2xl flex items-center justify-center border border-purple-500/30">
                                <Users className="w-10 h-10 text-purple-400" />
                            </div>

                            <div className="flex-1">
                                <h1 className="text-4xl font-bold text-white mb-2">{clan.name}</h1>
                                <p className="text-gray-400 font-mono text-sm mb-4">#{clan.tag}</p>

                                {clan.description && (
                                    <p className="text-gray-300 mb-4">{clan.description}</p>
                                )}

                                <div className="flex flex-wrap gap-4">
                                    <div className="flex items-center gap-2 px-4 py-2 bg-yellow-500/10 border border-yellow-500/20 rounded-xl">
                                        <Trophy className="w-4 h-4 text-yellow-400" />
                                        <span className="text-yellow-400 font-bold">{clan.clanScore?.toLocaleString()}</span>
                                        <span className="text-gray-400 text-sm">Troféus</span>
                                    </div>

                                    <div className="flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-xl">
                                        <Users className="w-4 h-4 text-blue-400" />
                                        <span className="text-blue-400 font-bold">{members.length}/50</span>
                                        <span className="text-gray-400 text-sm">Membros</span>
                                    </div>

                                    {clan.clanWarTrophies !== undefined && (
                                        <div className="flex items-center gap-2 px-4 py-2 bg-red-500/10 border border-red-500/20 rounded-xl">
                                            <Crown className="w-4 h-4 text-red-400" />
                                            <span className="text-red-400 font-bold">{clan.clanWarTrophies?.toLocaleString()}</span>
                                            <span className="text-gray-400 text-sm">Guerra</span>
                                        </div>
                                    )}

                                    <div className="flex items-center gap-2 px-4 py-2 bg-gray-500/10 border border-gray-500/20 rounded-xl">
                                        <TrendingUp className="w-4 h-4 text-gray-400" />
                                        <span className="text-white font-bold">{clan.requiredTrophies?.toLocaleString()}</span>
                                        <span className="text-gray-400 text-sm">Mínimo</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Top Members */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-2xl font-bold text-white">Top Membros</h2>
                        <button
                            onClick={handleRankingView}
                            className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
                        >
                            Ver Ranking Completo
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        {sortedMembers.slice(0, 3).map((member, index) => (
                            <motion.div
                                key={member.tag}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                onClick={() => handleMemberClick(member.tag)}
                                className="bg-gradient-to-br from-yellow-900/20 to-orange-900/20 border border-yellow-500/20 p-6 rounded-2xl cursor-pointer hover:border-yellow-500/40 transition-all group"
                            >
                                <div className="flex items-center gap-4 mb-4">
                                    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold ${index === 0 ? 'bg-yellow-500 text-black' :
                                            index === 1 ? 'bg-gray-400 text-black' :
                                                'bg-orange-600 text-white'
                                        }`}>
                                        {index + 1}
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-lg font-bold text-white group-hover:text-yellow-400 transition-colors">
                                            {member.name}
                                        </h3>
                                        <p className="text-sm text-gray-400">{member.role}</p>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Trophy className="w-4 h-4 text-yellow-400" />
                                        <span className="text-yellow-400 font-bold">{member.trophies.toLocaleString()}</span>
                                    </div>
                                    <div className="text-sm text-gray-400">
                                        Nível {member.expLevel}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* All Members */}
                <div>
                    <h2 className="text-2xl font-bold text-white mb-4">Todos os Membros</h2>

                    <div className="bg-gray-900/50 border border-gray-800 rounded-2xl overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-800/50">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                                            Rank
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                                            Nome
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                                            Função
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                                            Troféus
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                                            Doações
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                                            Nível
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-800">
                                    {sortedMembers.map((member, index) => (
                                        <tr
                                            key={member.tag}
                                            onClick={() => handleMemberClick(member.tag)}
                                            className="hover:bg-gray-800/30 cursor-pointer transition-colors"
                                        >
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    {index < 3 ? (
                                                        <Star className="w-4 h-4 text-yellow-400 mr-2" />
                                                    ) : null}
                                                    <span className="text-white font-medium">{index + 1}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-white">{member.name}</div>
                                                <div className="text-xs text-gray-500">#{member.tag}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${member.role === 'leader' ? 'bg-yellow-500/20 text-yellow-400' :
                                                        member.role === 'coLeader' ? 'bg-orange-500/20 text-orange-400' :
                                                            member.role === 'elder' ? 'bg-purple-500/20 text-purple-400' :
                                                                'bg-gray-500/20 text-gray-400'
                                                    }`}>
                                                    {member.role === 'leader' ? 'Líder' :
                                                        member.role === 'coLeader' ? 'Co-Líder' :
                                                            member.role === 'elder' ? 'Veterano' : 'Membro'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center gap-2">
                                                    <Trophy className="w-4 h-4 text-yellow-400" />
                                                    <span className="text-white font-medium">{member.trophies.toLocaleString()}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                                {member.donations}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                                                {member.expLevel}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
