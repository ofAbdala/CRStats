'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { AlertCircle, Home } from 'lucide-react';
import { trackEvent } from '@/lib/analytics';
import { useFavoritePlayers } from '@/lib/useFavoritePlayers';
import AppSidebar from '@/components/AppSidebar';
import UserMenuPlaceholder from '@/components/UserMenuPlaceholder';
import Dashboard from '@/components/Dashboard';
import ShareProfile from '@/components/ShareProfile';

interface PublicProfileClientProps {
    tag: string;
}

export default function PublicProfileClient({ tag }: PublicProfileClientProps) {
    const router = useRouter();
    const { addFavorite, isFavorite } = useFavoritePlayers();

    const [player, setPlayer] = useState<any>(null);
    const [summary, setSummary] = useState<any>(null);
    const [battles, setBattles] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [activeTab, setActiveTab] = useState('overview');

    // Fetch player data
    useEffect(() => {
        async function fetchData() {
            setLoading(true);
            setError(null);

            try {
                const [playerRes, summaryRes, battlesRes] = await Promise.all([
                    fetch(`/api/player/${tag}`, { cache: 'no-store' }),
                    fetch(`/api/player/${tag}/summary?last=100`, { cache: 'no-store' }),
                    fetch(`/api/player/${tag}/battles?last=100`, { cache: 'no-store' })
                ]);

                if (!playerRes.ok) {
                    throw new Error('Jogador não encontrado');
                }

                const [playerData, summaryData, battlesData] = await Promise.all([
                    playerRes.json(),
                    summaryRes.json(),
                    battlesRes.json()
                ]);

                setPlayer(playerData);
                setSummary(summaryData);
                setBattles(battlesData);
                setLastUpdated(new Date());

                // Track public profile view
                trackEvent('public_profile_view', {
                    tag,
                    playerName: playerData.name
                });
            } catch (err: any) {
                setError(err.message || 'Erro ao carregar perfil');
                trackEvent('public_profile_error', { tag, error: err.message });
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, [tag]);

    // Refresh data
    async function refreshData() {
        if (isRefreshing) return;

        setIsRefreshing(true);
        try {
            const [playerRes, summaryRes, battlesRes] = await Promise.all([
                fetch(`/api/player/${tag}`, { cache: 'no-store' }),
                fetch(`/api/player/${tag}/summary?last=100`, { cache: 'no-store' }),
                fetch(`/api/player/${tag}/battles?last=100`, { cache: 'no-store' })
            ]);

            const [playerData, summaryData, battlesData] = await Promise.all([
                playerRes.json(),
                summaryRes.json(),
                battlesRes.json()
            ]);

            setPlayer(playerData);
            setSummary(summaryData);
            setBattles(battlesData);
            setLastUpdated(new Date());

            trackEvent('player_refresh', { tag });
        } catch (err) {
            console.error('Failed to refresh data:', err);
        } finally {
            setIsRefreshing(false);
        }
    }

    function handleSavePlayer() {
        if (player) {
            addFavorite(player.tag, player.name, player.trophies);
        }
    }

    function handleTabChange(tab: string) {
        trackEvent('tab_change', { tab, source: 'public_profile' });
        setActiveTab(tab);
    }

    function handlePlayerSelect(selectedTag: string) {
        router.push(`/${selectedTag}`);
    }

    // Loading state
    if (loading) {
        return (
            <div className="min-h-screen bg-black text-white flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-gray-400">Carregando perfil...</p>
                </div>
            </div>
        );
    }

    // Error state
    if (error || !player) {
        return (
            <div className="min-h-screen bg-black text-white flex items-center justify-center p-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-md w-full premium-gradient border border-gray-800 p-8 rounded-3xl text-center"
                >
                    <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-4">
                        <AlertCircle className="w-8 h-8 text-red-400" />
                    </div>

                    <h1 className="text-2xl font-medium text-white mb-2">
                        Jogador não encontrado
                    </h1>
                    <p className="text-gray-400 mb-6">
                        Não conseguimos encontrar um jogador com a tag <span className="font-mono text-white">#{tag}</span>
                    </p>

                    <button
                        onClick={() => router.push('/')}
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-white text-black font-medium hover:bg-gray-100 transition-all duration-300"
                    >
                        <Home className="w-5 h-5" />
                        Voltar ao início
                    </button>
                </motion.div>
            </div>
        );
    }

    // Success state - render dashboard
    return (
        <div className="min-h-screen bg-black text-white flex">
            {/* Sidebar */}
            <AppSidebar
                activeSection={activeTab}
                onSectionChange={handleTabChange}
            />

            {/* Main Content */}
            <div className="flex-1 min-w-0">
                {/* Header */}
                <header className="sticky top-0 z-40 h-20 border-b border-gray-800"
                    style={{
                        backgroundColor: 'rgba(0, 0, 0, 0.95)',
                        backdropFilter: 'blur(10px)'
                    }}
                >
                    <div className="h-full px-8 flex items-center justify-between">
                        <div>
                            <h1 className="text-xl font-semibold text-white">Perfil Público</h1>
                            <p className="text-xs text-gray-400">#{tag}</p>
                        </div>

                        <div className="flex items-center gap-4">
                            {/* Save Player Button */}
                            {!isFavorite(player.tag) && (
                                <button
                                    onClick={handleSavePlayer}
                                    className="px-4 py-2 rounded-2xl border border-gray-700 text-sm font-medium text-white hover:bg-gray-900 transition-all duration-300"
                                >
                                    Salvar Jogador
                                </button>
                            )}

                            <UserMenuPlaceholder />
                        </div>
                    </div>
                </header>

                {/* Dashboard Content */}
                <div className="p-8 space-y-8">
                    {/* Share Profile Component */}
                    <ShareProfile tag={tag} playerName={player.name} />

                    {/* Dashboard */}
                    <Dashboard
                        player={player}
                        summary={summary}
                        battles={battles}
                        activeTab={activeTab}
                        setActiveTab={handleTabChange}
                    />
                </div>
            </div>
        </div>
    );
}
