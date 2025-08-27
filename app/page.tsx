'use client';

// Timer shims to prevent t._onTimeout errors in Bolt environment
if (typeof window !== 'undefined') {
  const _setInterval = window.setInterval;
  const _setTimeout = window.setTimeout;

  window.setInterval = ((handler: TimerHandler, timeout?: number, ...args: any[]) => {
    if (typeof handler !== 'function') {
      const fn = () => (handler as any)?.();
      return _setInterval(fn, Number(timeout) || 0, ...args);
    }
    return _setInterval(handler, Number(timeout) || 0, ...args);
  }) as typeof window.setInterval;

  window.setTimeout = ((handler: TimerHandler, timeout?: number, ...args: any[]) => {
    if (typeof handler !== 'function') {
      const fn = () => (handler as any)?.();
      return _setTimeout(fn, Number(timeout) || 0, ...args);
    }
    return _setTimeout(handler, Number(timeout) || 0, ...args);
  }) as typeof window.setTimeout;
}

import { useEffect, useState } from 'react';
import { Search, TrendingUp, Trophy, Users, Zap, Crown, Target, BarChart3 } from 'lucide-react';
import PlayerHeader from '@/components/PlayerHeader';
import SummaryCards from '@/components/SummaryCards';
import TrophyChart from '@/components/TrophyChart';
import BattleHistory from '@/components/BattleHistory';
import CurrentPush from '@/components/CurrentPush';
import LeagueInfo from '@/components/LeagueInfo';

async function fetchJson(url: string) {
  const r = await fetch(url, { cache: 'no-store' });
  if (!r.ok) throw new Error(await r.text());
  return r.json();
}

export default function Page() {
  const defaultTag = 'U9UUCCQ';
  const [tag, setTag] = useState<string>('');
  const [player, setPlayer] = useState<any>(null);
  const [summary, setSummary] = useState<any>(null);
  const [battles, setBattles] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [err, setErr] = useState<string | null>(null);
  const [showPlayerData, setShowPlayerData] = useState<boolean>(false);

  async function load(t: string) {
    setLoading(true); setErr(null);
    try {
      const [p, s, b] = await Promise.all([
        fetchJson(`/api/player/${t}`),
        fetchJson(`/api/player/${t}/summary?last=20`),
        fetchJson(`/api/player/${t}/battles?last=20`)
      ]);
      setPlayer(p); setSummary(s); setBattles(b);
      setShowPlayerData(true);
    } catch (e: any) {
      setErr(e.message || 'Erro');
      setShowPlayerData(false);
    } finally { setLoading(false); }
  }

  function onSearch(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const input = form.querySelector('input[name="tag"]') as HTMLInputElement;
    const clean = input.value.replace(/^#/, '').trim().toUpperCase();
    if (clean) { 
      setTag(clean); 
      load(clean); 
    }
  }

  function loadDefaultPlayer() {
    setTag(defaultTag);
    load(defaultTag);
  }

  const features = [
    {
      icon: <Trophy className="w-6 h-6" />,
      title: "Estatísticas Detalhadas",
      description: "Veja troféus, win rate, 3 coroas e muito mais"
    },
    {
      icon: <BarChart3 className="w-6 h-6" />,
      title: "Gráficos de Progresso",
      description: "Acompanhe sua evolução de troféus em tempo real"
    },
    {
      icon: <Target className="w-6 h-6" />,
      title: "Histórico de Batalhas",
      description: "Analise suas últimas partidas com detalhes completos"
    },
    {
      icon: <Crown className="w-6 h-6" />,
      title: "Sistema de Arenas",
      description: "Veja sua arena atual e progresso para a próxima"
    }
  ];

  const popularPlayers = [
    { tag: "U9UUCCQ", name: "Exemplo 1", trophies: "6500+" },
    { tag: "2PP", name: "Exemplo 2", trophies: "7200+" },
    { tag: "8QU8J9LP", name: "Exemplo 3", trophies: "5800+" }
  ];

  return (
    <div className="min-h-screen bg-bg-dark">
      {/* Header Navigation */}
      <header className="border-b border-border-dark bg-card-dark/95 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-royal to-purple rounded-xl flex items-center justify-center">
              <Crown className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="font-bold text-xl text-white">ClashDex</div>
              <div className="text-xs text-gray-400">Clash Royale Stats</div>
            </div>
          </div>
          
          {showPlayerData && (
            <button 
              onClick={() => setShowPlayerData(false)}
              className="px-4 py-2 rounded-lg bg-card-dark border border-border-dark text-gray-300 hover:text-white hover:border-royal transition-colors"
            >
              ← Voltar ao Início
            </button>
          )}
        </div>
      </header>

      {!showPlayerData ? (
        /* Homepage */
        <main className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <section className="text-center py-20 px-6">
            <div className="mb-8">
              <div className="w-20 h-20 bg-gradient-to-br from-royal to-purple rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Crown className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-5xl font-bold text-white mb-4">
                Clash<span className="text-royal">Dex</span>
              </h1>
              <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
                Analise suas estatísticas do Clash Royale com gráficos detalhados, 
                histórico de batalhas e progresso de troféus em tempo real.
              </p>
            </div>

            {/* Search Form */}
            <form onSearch={onSearch} className="max-w-md mx-auto mb-8">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input 
                  name="tag" 
                  placeholder="Digite sua TAG (#XXXXXXX)"
                  className="w-full pl-12 pr-4 py-4 rounded-xl bg-card-dark border border-border-dark text-white focus:border-royal focus:outline-none transition-colors placeholder:text-gray-500 text-center"
                />
              </div>
              <button 
                type="submit"
                className="w-full mt-4 px-8 py-4 rounded-xl bg-gradient-to-r from-royal to-purple hover:from-royal/90 hover:to-purple/90 text-white font-semibold transition-all duration-200 shadow-lg"
              >
                Buscar Jogador
              </button>
            </form>

            {/* Quick Demo Button */}
            <button 
              onClick={loadDefaultPlayer}
              className="text-royal hover:text-royal/80 transition-colors font-medium"
            >
              Ver exemplo com jogador demo →
            </button>

            {loading && (
              <div className="flex items-center justify-center py-8">
                <div className="flex items-center gap-3 text-gray-400">
                  <div className="w-5 h-5 border-2 border-royal border-t-transparent rounded-full animate-spin"></div>
                  <span>Carregando dados do jogador...</span>
                </div>
              </div>
            )}
            
            {err && (
              <div className="bg-rose-900/20 border border-rose-900/50 rounded-xl p-4 text-rose-400 max-w-md mx-auto mt-6">
                <div className="font-medium">Erro ao carregar dados</div>
                <div className="text-sm text-rose-300 mt-1">{err}</div>
              </div>
            )}
          </section>

          {/* Features Section */}
          <section className="py-16 px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-white mb-4">Recursos Principais</h2>
              <p className="text-gray-400 max-w-2xl mx-auto">
                Descubra tudo o que o ClashDex oferece para melhorar sua experiência no Clash Royale
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature, index) => (
                <div key={index} className="bg-card-dark border border-border-dark rounded-xl p-6 hover:border-royal/50 transition-all duration-200 group">
                  <div className="w-12 h-12 bg-gradient-to-br from-royal/20 to-purple/20 rounded-xl flex items-center justify-center mb-4 group-hover:from-royal/30 group-hover:to-purple/30 transition-all">
                    <div className="text-royal group-hover:text-white transition-colors">
                      {feature.icon}
                    </div>
                  </div>
                  <h3 className="font-semibold text-white mb-2">{feature.title}</h3>
                  <p className="text-sm text-gray-400">{feature.description}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Popular Players Section */}
          <section className="py-16 px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-white mb-4">Jogadores Populares</h2>
              <p className="text-gray-400">Confira as estatísticas de alguns jogadores em destaque</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {popularPlayers.map((player, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setTag(player.tag);
                    load(player.tag);
                  }}
                  className="bg-card-dark border border-border-dark rounded-xl p-6 hover:border-royal/50 transition-all duration-200 group text-left"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-gold to-yellow-500 rounded-xl flex items-center justify-center">
                      <Trophy className="w-6 h-6 text-black" />
                    </div>
                    <div>
                      <div className="font-semibold text-white group-hover:text-royal transition-colors">
                        {player.name}
                      </div>
                      <div className="text-sm text-gray-400">#{player.tag}</div>
                      <div className="text-sm text-gold">{player.trophies} troféus</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </section>

          {/* Stats Preview */}
          <section className="py-16 px-6 bg-card-dark/30">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-white mb-4">Estatísticas Detalhadas</h2>
              <p className="text-gray-400">Veja um preview do que você encontrará ao buscar um jogador</p>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
              <div className="bg-card-dark border border-border-dark rounded-xl p-6 text-center">
                <TrendingUp className="w-8 h-8 text-emerald-400 mx-auto mb-3" />
                <div className="text-2xl font-bold text-emerald-400 mb-1">65%</div>
                <div className="text-sm text-gray-400">Win Rate</div>
              </div>
              <div className="bg-card-dark border border-border-dark rounded-xl p-6 text-center">
                <Crown className="w-8 h-8 text-gold mx-auto mb-3" />
                <div className="text-2xl font-bold text-gold mb-1">1,247</div>
                <div className="text-sm text-gray-400">3 Coroas</div>
              </div>
              <div className="bg-card-dark border border-border-dark rounded-xl p-6 text-center">
                <Trophy className="w-8 h-8 text-purple mx-auto mb-3" />
                <div className="text-2xl font-bold text-purple mb-1">6,543</div>
                <div className="text-sm text-gray-400">Melhor Temporada</div>
              </div>
              <div className="bg-card-dark border border-border-dark rounded-xl p-6 text-center">
                <Zap className="w-8 h-8 text-royal mx-auto mb-3" />
                <div className="text-2xl font-bold text-royal mb-1">+127</div>
                <div className="text-sm text-gray-400">Push Atual</div>
              </div>
            </div>
          </section>
        </main>
      ) : (
        /* Player Data View */
        <main className="max-w-6xl mx-auto p-6 space-y-6">
          {player && <PlayerHeader player={player} />}
          {player && <LeagueInfo player={player} />}
          {player && summary && (
            <>
              <SummaryCards player={player} summary={summary} />
              <CurrentPush summary={summary} />
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <TrophyChart series={summary.series} />
                <BattleHistory battles={battles} />
              </div>
            </>
          )}
        </main>
      )}

      {/* Footer */}
      <footer className="border-t border-border-dark bg-card-dark/50 mt-12">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-400">
              Powered by <span className="text-royal">Supercell API</span> • Inspired by deep.gg
            </div>
            <div className="text-xs text-gray-500">
              Next.js • Tailwind CSS • Recharts
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}