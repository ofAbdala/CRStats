'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LayoutDashboard,
    Swords,
    Award,
    Users,
    Layers,
    Star,
    X,
    Menu,
    ChevronRight,
    Monitor,
    Globe,
    Trophy,
    Trash2
} from 'lucide-react';
import { useFavoritePlayers } from '@/lib/useFavoritePlayers';
import { useStreamerMode } from '@/lib/useStreamerMode';
import { trackEvent } from '@/lib/analytics';

interface AppSidebarProps {
    activeSection?: string;
    onSectionChange?: (section: string) => void;
}

/**
 * Main application sidebar with navigation
 * 
 * Features:
 * - Main navigation (Overview, Battles, Badges)
 * - Coming soon items (Clan, Decks)
 * - Favorite players list
 * - Responsive: collapsible on mobile
 * 
 * TODO: Future enhancements
 * - Add keyboard shortcuts
 * - Add search for favorites
 * - Add player groups/folders
 * - Sync favorites with backend when authenticated
 */
export default function AppSidebar({
    activeSection = 'overview',
    onSectionChange
}: AppSidebarProps) {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();
    const router = useRouter();
    const { favorites, removeFavorite } = useFavoritePlayers();
    const { isEnabled: isStreamerMode, toggle: toggleStreamerMode } = useStreamerMode();

    if (isStreamerMode) {
        return (
            <button
                onClick={toggleStreamerMode}
                className="fixed bottom-4 left-4 z-50 bg-gray-900/80 p-2 rounded-full text-gray-400 hover:text-white transition-colors"
                title="Sair do Modo Streamer"
            >
                <Monitor className="w-5 h-5" />
            </button>
        );
    }

    const navItems = [
        { id: 'overview', label: 'Visão Geral', icon: LayoutDashboard, active: true, comingSoon: false },
        { id: 'battles', label: 'Batalhas', icon: Swords, active: true, comingSoon: false },
        { id: 'badges', label: 'Badges', icon: Award, active: true, comingSoon: false },
        { id: 'clan', label: 'Clã', icon: Users, active: true, comingSoon: false },
        { id: 'decks', label: 'Decks', icon: Layers, active: true, comingSoon: false },
    ];

    const communityItems = [
        { id: 'community', label: 'Comunidade', icon: Globe, href: '/community' },
        { id: 'compare', label: 'Comparar Jogadores', icon: Swords, href: '/compare' },
    ];

    const handleSectionClick = (id: string, active: boolean) => {
        if (!active) return;

        trackEvent('tab_change', { section: id });

        if (onSectionChange) {
            onSectionChange(id);
        } else {
            // If we are not in the dashboard (no onSectionChange), navigate to home
            router.push('/');
        }

        setIsOpen(false); // Close mobile menu
    };

    const sidebarContent = (
        <div className="flex flex-col h-full p-6">
            {/* Logo */}
            <div className="flex items-center gap-3 mb-10 px-2">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center shadow-lg shadow-blue-900/20">
                    <Trophy className="w-6 h-6 text-white" />
                </div>
                <span className="font-bold text-2xl tracking-tight text-white">
                    CR<span className="text-blue-500">Stats</span>
                </span>
            </div>

            {/* Navigation */}
            <nav className="space-y-1 flex-1">
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4 px-2">
                    Menu Principal
                </div>
                {navItems.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => handleSectionClick(item.id, item.active)}
                        disabled={!item.active}
                        className={`
                            w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 group
                            ${activeSection === item.id
                                ? 'bg-blue-600/10 text-blue-500'
                                : 'text-gray-400 hover:bg-gray-900 hover:text-white'
                            }
                            ${!item.active && 'opacity-50 cursor-not-allowed'}
                        `}
                    >
                        <div className="flex items-center gap-3">
                            <item.icon className={`w-5 h-5 transition-colors ${activeSection === item.id ? 'text-blue-500' : 'text-gray-500 group-hover:text-white'}`} />
                            <span className="font-medium">{item.label}</span>
                        </div>
                        {item.comingSoon && (
                            <span className="text-[10px] font-bold bg-gray-800 text-gray-400 px-2 py-0.5 rounded-full border border-gray-700">
                                EM BREVE
                            </span>
                        )}
                    </button>
                ))}

                <div className="mt-8 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4 px-2">
                    Comunidade
                </div>
                {communityItems.map((item) => {
                    const isActive = pathname === item.href || activeSection === item.id;
                    return (
                        <Link
                            key={item.id}
                            href={item.href}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${isActive
                                ? 'bg-blue-600/10 text-blue-500'
                                : 'text-gray-400 hover:bg-gray-900 hover:text-white'
                                }`}
                        >
                            <item.icon className={`w-5 h-5 transition-colors ${isActive ? 'text-blue-500' : 'text-gray-500 group-hover:text-white'}`} />
                            <span className="font-medium">{item.label}</span>
                        </Link>
                    );
                })}
            </nav>

            {/* Favorites Section */}
            <div className="mt-8 pt-8 border-t border-gray-800">
                <div className="flex items-center justify-between px-2 mb-4">
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Favoritos
                    </span>
                    <span className="text-xs text-gray-600 bg-gray-900 px-2 py-0.5 rounded-full">
                        {favorites.length}
                    </span>
                </div>

                <div className="space-y-1 max-h-48 overflow-y-auto custom-scrollbar">
                    {favorites.length === 0 ? (
                        <div className="px-2 py-4 text-sm text-gray-600 text-center bg-gray-900/30 rounded-xl border border-gray-800/50 border-dashed">
                            Nenhum favorito
                        </div>
                    ) : (
                        favorites.map((fav) => (
                            <Link
                                key={fav.tag}
                                href={`/${fav.tag}`}
                                className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-400 hover:bg-gray-900 hover:text-white transition-all group"
                            >
                                <div className="w-8 h-8 rounded-lg bg-gray-800 flex items-center justify-center text-xs font-bold text-gray-500 group-hover:text-white group-hover:bg-gray-700 transition-colors">
                                    {(fav as any).expLevel || '?'}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="text-sm font-medium truncate">{fav.name}</div>
                                    <div className="text-xs text-gray-600 truncate">#{fav.tag}</div>
                                </div>
                                <button
                                    onClick={(e) => {
                                        e.preventDefault();
                                        removeFavorite(fav.tag);
                                    }}
                                    className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-red-500/10 hover:text-red-400 rounded-md transition-all"
                                >
                                    <Trash2 className="w-3.5 h-3.5" />
                                </button>
                            </Link>
                        ))
                    )}
                </div>
            </div>

            {/* Streamer Mode Toggle */}
            <div className="mt-4 pt-4 border-t border-gray-800">
                <button
                    onClick={toggleStreamerMode}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:bg-gray-900 hover:text-white transition-all duration-200 group"
                >
                    <Monitor className="w-5 h-5 text-gray-500 group-hover:text-purple-400 transition-colors" />
                    <span className="font-medium">Modo Streamer</span>
                </button>
            </div>
        </div>
    );

    return (
        <>
            {/* Mobile Menu Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-xl bg-gray-900 border border-gray-800 text-white"
            >
                {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            {/* Desktop Sidebar */}
            <aside className="hidden lg:block w-72 h-screen sticky top-0 bg-black border-r border-gray-800">
                {sidebarContent}
            </aside>

            {/* Mobile Sidebar */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                            className="lg:hidden fixed inset-0 bg-black/80 backdrop-blur-sm z-40"
                        />

                        {/* Sidebar */}
                        <motion.aside
                            initial={{ x: -300 }}
                            animate={{ x: 0 }}
                            exit={{ x: -300 }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="lg:hidden fixed top-0 left-0 w-72 h-screen bg-black border-r border-gray-800 z-50"
                        >
                            {sidebarContent}
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
