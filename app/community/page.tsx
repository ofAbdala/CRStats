'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Globe, Users, Layers, Trophy } from 'lucide-react';
import GlobalLeaderboard from '@/components/community/GlobalLeaderboard';
import CountryLeaderboard from '@/components/community/CountryLeaderboard';
import ClanLeaderboard from '@/components/community/ClanLeaderboard';
import MetaDeckList from '@/components/community/MetaDeckList';
import ProFeatureGate from '@/components/ProFeatureGate';

// Mock Data (Replace with API calls later)
const MOCK_PLAYERS = Array(10).fill(null).map((_, i) => ({
    tag: `#PLAYER${i}`,
    name: `Player ${i + 1}`,
    rank: i + 1,
    trophies: 9000 - (i * 100),
    clan: { tag: '#CLAN', name: 'Nova Esports', badgeId: 16000000 },
    arena: { id: 1, name: 'Legendary Arena' }
}));

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
    const [country, setCountry] = useState('BR');

    const tabs = [
        { id: 'global', label: 'Rank Global', icon: Trophy },
        { id: 'country', label: 'Rank por País', icon: Globe },
        { id: 'clans', label: 'Top Clãs', icon: Users },
        { id: 'meta', label: 'Meta Decks', icon: Layers },
    ];

    return (
        <div className="min-h-screen bg-black text-white p-6 lg:p-8">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Comunidade</h1>
                    <p className="text-gray-400">Explore os melhores jogadores, clãs e decks do momento.</p>
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
                    {activeTab === 'global' && <GlobalLeaderboard players={MOCK_PLAYERS} />}

                    {activeTab === 'country' && (
                        <CountryLeaderboard
                            players={MOCK_PLAYERS}
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
        </div>
    );
}
