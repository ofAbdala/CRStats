'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Swords, Award, Users, Layers, Zap, Crown, TrendingUp } from 'lucide-react';
import { Player, Battle } from '@/lib/types';
import BattleHistory from './BattleHistory';
import ClanView from './ClanView';
import DecksView from './DecksView';
import AdvancedBattleAnalytics from './pro/AdvancedBattleAnalytics';
import DeckAnalytics from './pro/DeckAnalytics';
import RuleBasedInsightsCard from './pro/RuleBasedInsightsCard';
import ActivityHeatmap from './pro/ActivityHeatmap';
import GoalsCard from './GoalsCard';
import ProFeatureGate from './ProFeatureGate';
import { buildRuleBasedInsights, buildDeckStats } from '@/lib/stats';
import { useStreamerMode } from '@/lib/useStreamerMode';

interface DashboardProps {
    player: Player;
    summary?: any;
    battles: Battle[];
    activeTab: string;
    setActiveTab: (tab: string) => void;
}

export default function Dashboard({ player, summary, battles, activeTab, setActiveTab }: DashboardProps) {
    const insights = buildRuleBasedInsights(battles);
    const deckStats = buildDeckStats(battles);
    const { isEnabled: streamerMode } = useStreamerMode();

    const renderContent = () => {
        switch (activeTab) {
            case 'overview':
                return (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Left Column - Main Stats */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Hero Stats */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="bg-gray-900/50 border border-gray-800 p-6 rounded-2xl flex flex-col items-center justify-center text-center">
                                    <div className="w-12 h-12 bg-yellow-500/10 rounded-full flex items-center justify-center mb-3">
                                        <Trophy className="w-6 h-6 text-yellow-500" />
                                    </div>
                                    <div className="text-3xl font-bold text-white mb-1">{player.trophies}</div>
                                    <div className="text-sm text-gray-400">Troféus Atuais</div>
                                </div>
                                <div className="bg-gray-900/50 border border-gray-800 p-6 rounded-2xl flex flex-col items-center justify-center text-center">
                                    <div className="w-12 h-12 bg-purple-500/10 rounded-full flex items-center justify-center mb-3">
                                        <Crown className="w-6 h-6 text-purple-500" />
                                    </div>
                                    <div className="text-3xl font-bold text-white mb-1">{player.bestTrophies}</div>
                                    <div className="text-sm text-gray-400">Recorde de Troféus</div>
                                </div>
                                <div className="bg-gray-900/50 border border-gray-800 p-6 rounded-2xl flex flex-col items-center justify-center text-center">
                                    <div className="w-12 h-12 bg-blue-500/10 rounded-full flex items-center justify-center mb-3">
                                        <Swords className="w-6 h-6 text-blue-500" />
                                    </div>
                                    <div className="text-3xl font-bold text-white mb-1">{player.battleCount}</div>
                                    <div className="text-sm text-gray-400">Total de Batalhas</div>
                                </div>
                            </div>

                            {/* PRO: Advanced Analytics Preview */}
                            <ProFeatureGate label="Desbloqueie análises avançadas de batalha e progressão.">
                                <AdvancedBattleAnalytics battles={battles} />
                            </ProFeatureGate>

                            {/* PRO: Activity Heatmap */}
                            <ProFeatureGate label="Veja seus horários de maior atividade e otimize seu tempo de jogo.">
                                <ActivityHeatmap battles={battles} />
                            </ProFeatureGate>
                        </div>

                        {/* Right Column - Side Widgets */}
                        <div className="space-y-6">
                            {/* PRO: Insights */}
                            <ProFeatureGate label="Receba insights personalizados baseados em suas últimas partidas.">
                                <RuleBasedInsightsCard insights={insights} battles={battles} />
                            </ProFeatureGate>

                            {/* Goals */}
                            <GoalsCard battles={battles} currentTrophies={player.trophies} playerTag={player.tag} />

                            {/* League Info */}
                            <div className="bg-gradient-to-br from-blue-900/20 to-purple-900/20 border border-blue-500/20 p-6 rounded-2xl">
                                <h3 className="text-lg font-semibold text-white mb-4">Arena Atual</h3>
                                <div className="flex items-center gap-4">
                                    <div className="w-16 h-16 relative">
                                        {/* Arena Icon Placeholder */}
                                        <div className="absolute inset-0 bg-blue-500/20 rounded-full animate-pulse" />
                                        <Trophy className="w-8 h-8 text-blue-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                                    </div>
                                    <div>
                                        <div className="text-xl font-bold text-white">{player.arena?.name || 'Arena Desconhecida'}</div>
                                        <div className="text-sm text-blue-300">{player.trophies} Troféus</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                );

            case 'battles':
                return (
                    <div className="space-y-6">
                        {/* PRO: Deck Analytics */}
                        <ProFeatureGate label="Analise o desempenho dos seus decks e encontre a melhor estratégia.">
                            <DeckAnalytics decks={deckStats} />
                        </ProFeatureGate>

                        <BattleHistory battles={battles} />
                    </div>
                );

            case 'badges':
                return (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {(player.badges || []).map((badge, index) => (
                            <div key={index} className="bg-gray-900/50 border border-gray-800 p-4 rounded-xl flex flex-col items-center text-center hover:bg-gray-800/50 transition-colors group">
                                <div className="w-16 h-16 relative mb-3 group-hover:scale-110 transition-transform duration-300">
                                    <img src={badge.iconUrls.large} alt={badge.name} className="w-full h-full object-contain" />
                                </div>
                                <div className="text-sm font-medium text-white truncate w-full" title={badge.name}>
                                    {badge.name}
                                </div>
                                <div className="text-xs text-gray-500 mt-1">
                                    Nível {badge.level}/{badge.maxLevel || '?'}
                                </div>
                            </div>
                        ))}
                    </div>
                );

            case 'clan':
                return <ClanView player={player} />;

            case 'decks':
                return <DecksView player={player} />;

            default:
                return null;
        }
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">
                        Olá, <span className={`text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 ${streamerMode ? 'blur-sm select-none' : ''}`}>
                            {streamerMode ? '████████' : player.name}
                        </span>
                    </h1>
                    <p className="text-gray-400">Aqui está o resumo da sua performance hoje.</p>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500 bg-gray-900/50 px-3 py-1.5 rounded-lg border border-gray-800">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    Última atualização: Agora mesmo
                </div>
            </div>

            {/* Content */}
            <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
            >
                {renderContent()}
            </motion.div>
        </div>
    );
}
