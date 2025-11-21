'use client';

import '@/lib/timer-shims';
import { useEffect, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { usePlayerData } from '@/lib/usePlayerData';
import { useFavoritePlayers } from '@/lib/useFavoritePlayers';
import { trackEvent } from '@/lib/analytics';
import Homepage from '@/components/Homepage';
import Dashboard from '@/components/Dashboard';
import AppSidebar from '@/components/AppSidebar';
import UserMenuPlaceholder from '@/components/UserMenuPlaceholder';

export default function Page() {
  const defaultTag = 'U9UUCCQ';
  const [showPlayerData, setShowPlayerData] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>('overview');
  const { addFavorite, isFavorite } = useFavoritePlayers();

  const {
    tag,
    setTag,
    player,
    summary,
    battles,
    loading,
    err,
    lastUpdated,
    isRefreshing,
    load,
    refreshData
  } = usePlayerData(defaultTag);

  // Auto-refresh para tab live
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (showPlayerData && tag && !loading && !isRefreshing && activeTab === 'live') {
      interval = setInterval(() => {
        refreshData();
      }, 60000);
    }
    return () => clearInterval(interval);
  }, [showPlayerData, tag, loading, isRefreshing, activeTab, refreshData]);

  function onSearch(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const inputValue = formData.get('tag') as string;
    const clean = inputValue.replace(/^#/, '').trim().toUpperCase();
    if (clean) {
      setTag(clean);
      load(clean).then((success) => {
        if (success) {
          // Redirect to public profile page
          window.location.href = `/${clean}`;
          trackEvent('player_search_success', { tag: clean });
        } else {
          trackEvent('player_search_error', { tag: clean });
        }
      });
    }
  }

  function loadDefaultPlayer() {
    setTag(defaultTag);
    load(defaultTag).then((success) => {
      if (success) setShowPlayerData(true);
    });
  }

  function handlePlayerSelect(selectedTag: string) {
    setTag(selectedTag);
    load(selectedTag).then((success) => {
      if (success) setShowPlayerData(true);
    });
  }

  function handleSavePlayer() {
    if (player) {
      addFavorite(player.tag, player.name, player.trophies);
    }
  }

  function handleRefreshData() {
    trackEvent('player_refresh');
    refreshData();
  }

  function handleTabChange(tab: string) {
    trackEvent('tab_change', { tab });
    setActiveTab(tab);
  }

  // If showing player data, use sidebar layout
  if (showPlayerData) {
    return (
      <div className="min-h-screen bg-black text-white flex">
        {/* Sidebar */}
        <AppSidebar
          activeSection={activeTab}
          onSectionChange={handleTabChange}
        />

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          {/* Header with User Menu */}
          <header className="sticky top-0 z-40 h-20 border-b border-gray-800"
            style={{
              backgroundColor: 'rgba(0, 0, 0, 0.95)',
              backdropFilter: 'blur(10px)'
            }}
          >
            <div className="h-full px-8 flex items-center justify-between">
              <div>
                <h1 className="text-xl font-semibold text-white">Dashboard</h1>
                <p className="text-xs text-gray-400">Estatísticas de Elite</p>
              </div>

              <div className="flex items-center gap-4">
                {/* Save Player Button */}
                {player && !isFavorite(player.tag) && (
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
          <div className="p-8">
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

  // Homepage layout (no sidebar)
  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden gpu-accelerated">
      {/* Background Effects Premium */}
      <div className="gradient-bg fixed inset-0 pointer-events-none" />

      {/* Elementos Decorativos Geométricos */}
      <div className="absolute top-1/4 left-1/4 w-32 h-32 border border-gray-800 rotate-45 opacity-20 float-animation" />
      <div className="absolute bottom-1/3 right-1/4 w-24 h-24 border border-gray-700 rotate-12 opacity-15 float-animation" style={{ animationDelay: '3s' }} />
      <div className="absolute top-2/3 left-1/3 w-16 h-16 border border-gray-600 opacity-10 float-animation" style={{ animationDelay: '6s' }} />

      <AnimatePresence mode="wait">
        <Homepage
          key="homepage"
          tag={tag}
          setTag={setTag}
          onSearch={onSearch}
          loading={loading}
          err={err}
          loadDefaultPlayer={loadDefaultPlayer}
        />
      </AnimatePresence>

      <footer className="relative border-t border-gray-800 bg-black/50 backdrop-blur-md mt-24">
        <div className="max-w-7xl mx-auto px-8 py-12">
          <div
            className="flex flex-col md:flex-row items-center justify-between gap-6"
          >
            <div className="text-gray-400 font-light text-center md:text-left">
              <span className="text-white font-medium">X1.ClashDex.com</span> • Powered by <span className="text-gray-300 font-medium">X1.Payments</span>
            </div>
            <div className="text-gray-500 text-sm font-light">
              Elite Analytics • Premium Performance • Exceptional Quality
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}