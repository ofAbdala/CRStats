'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Globe, Users, Layers, Trophy, Menu } from 'lucide-react';
import GlobalLeaderboard from '@/components/community/GlobalLeaderboard';
import CountryLeaderboard from '@/components/community/CountryLeaderboard';
import ClanLeaderboard from '@/components/community/ClanLeaderboard';
import MetaDeckList from '@/components/community/MetaDeckList';
import ProFeatureGate from '@/components/ProFeatureGate';
import AppSidebar from '@/components/AppSidebar';
import UserMenuPlaceholder from '@/components/UserMenuPlaceholder';
import { LeaderboardPlayer } from '@/lib/types';

// Mock Data for other tabs (keep for now until we implement those APIs)
const MOCK_CLANS = Array(10).fill(null).map((_, i) => ({
    tag: `#CLAN${i}`,
    name: `Clan ${i + 1}`,
    type: 'open',
    description: 'Top clan',
    badgeId: 16000000,
    clanScore: 50000 - (i * 500),
    clanWarTrophies: 3000,
    location: { id: 1, name: 'International', isCountry: false, countryCode: 'INT' },
    requiredTrophies: 6000,
    donationsPerWeek: 10000,
    clanChestStatus: 'inactive',
    clanChestLevel: 1,
    members: Array(45).fill(null)
}));

const MOCK_META_DECKS = Array(6).fill(null).map((_, i) => ({
    id: `deck${i}`,
    cards: Array(8).fill({
        id: 1,
        name: 'Knight',
        level: 14,
        maxLevel: 14,
        iconUrls: { medium: 'https://api-assets.clashroyale.com/cards/300/jAj1Q5rclXxU9kVImGqSJxa4wEMfEhvwNQ_4jiGUuqg.png' }
    }),
    avgElixir: 3.1,
    popularity: 15 - i,
    winrate: 55 - i,
    rank: i + 1,
    mode: i % 2 === 0 ? 'ladder' : 'challenge'
}));

export default function CommunityPage() {
    const [activeTab, setActiveTab] = useState('global');
    const [players, setPlayers] = useState<LeaderboardPlayer[]>([]);
    const [loading, setLoading] = useState(true);

    const tabs = [
        { id: 'global', label: 'Rank Global', icon: Trophy },
        { id: 'country', label: 'Rank por País', icon: Globe },
        { id: 'clans', label: 'Top Clãs', icon: Users },
        { id: 'meta', label: 'Meta Decks', icon: Layers },
    ];

    useEffect(() => {
        async function fetchLeaderboard() {
            try {
                setLoading(true);
                const response = await fetch('/api/leaderboard?limit=50');
                if (response.ok) {
                    const data = await response.json();
                    setPlayers(data.items || []);
                }
            } catch (error) {
                console.error('Failed to fetch leaderboard:', error);
            } finally {
                setLoading(false);
            }
        }

        if (activeTab === 'global') {
            fetchLeaderboard();
        }
    }, [activeTab]);

    return (
        <div className="min-h-screen bg-black text-white flex">
            {/* Sidebar */}
            <AppSidebar activeSection="community" />

            {/* Main Content */}
            <div className="flex-1 min-w-0 flex flex-col">
                {/* Header */}
                <header className="sticky top-0 z-40 h-20 border-b border-gray-800"
                    style={{
                        backgroundColor: 'rgba(0, 0, 0, 0.95)',
                        backdropFilter: 'blur(10px)'
                    }}
                >
                    <div className="h-full px-8 flex items-center justify-between">
                        <div>
                            <h1 className="text-xl font-semibold text-white">Comunidade</h1>
                            <p className="text-xs text-gray-400">Rankings e Meta</p>
                        </div>

                        <div className="flex items-center gap-4">
                            <UserMenuPlaceholder />
                        </div>
                    </div>
                </header>

                <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
                    <div className="max-w-7xl mx-auto space-y-8">
                        {/* Page Header */}
                        <div>
                            <h2 className="text-3xl font-bold text-white mb-2">Explorar</h2>
                            <p className="text-gray-400">Descubra os melhores jogadores, clãs e estratégias do momento.</p>
                        </div>

                        {/* Tabs */}
                        <div className="flex flex-wrap gap-2 border-b border-gray-800 pb-1">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-t-lg transition-colors ${activeTab === tab.id
                                        ? 'bg-gray-900 text-white border-b-2 border-blue-500'
                                        : 'text-gray-500 hover:text-gray-300'
                                        }`}
                                >
                                    <tab.icon className="w-4 h-4" />
                                    {tab.label}
                                </button>
                            ))}
                        </div>

                        {/* Content */}
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            {activeTab === 'global' && (
                                loading ? (
                                    <div className="flex justify-center py-20">
                                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                                    </div>
                                ) : (
                                    <GlobalLeaderboard players={players} />
                                )
                            )}

                            {activeTab === 'country' && (
                                <CountryLeaderboard
                                    players={players.length > 0 ? players : []} // Fallback or fetch specific country data later
                                />
                            )}

                            {activeTab === 'clans' && <ClanLeaderboard clans={MOCK_CLANS} />}

                            {activeTab === 'meta' && (
                                <div className="space-y-8">
                                    <div>
                                        <h3 className="text-xl font-medium text-white mb-4">Top 3 Decks da Temporada</h3>
                                        <MetaDeckList decks={MOCK_META_DECKS.slice(0, 3)} />
                                    </div>

                                    <ProFeatureGate label="Veja a lista completa de Meta Decks com filtros avançados na versão PRO.">
                                        <div className="opacity-50 pointer-events-none">
                                            <h3 className="text-xl font-medium text-white mb-4 mt-8">Outros Decks Populares</h3>
                                            <MetaDeckList decks={MOCK_META_DECKS.slice(3)} />
                                        </div>
                                    </ProFeatureGate>
                                </div>
                            )}
                        </motion.div>
                    </div>
                </main>
            </div>
        </div>
    );
}
