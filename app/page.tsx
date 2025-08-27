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
import { Search, TrendingUp, Trophy, Users, Zap, Crown, Target, BarChart3, RefreshCw, Star, Calendar, Clock, Award } from 'lucide-react';
import PlayerHeader from '@/components/PlayerHeader';
import SummaryCards from '@/components/SummaryCards';
import TrophyChart from '@/components/TrophyChart';
import BattleHistory from '@/components/BattleHistory';
import CurrentPush from '@/components/CurrentPush';
import LeagueInfo from '@/components/LeagueInfo';
import SessionHistory from '@/components/SessionHistory';
import { usePolling } from '@/lib/usePolling';

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
  const [activeTab, setActiveTab] = useState<string>('resumo');
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

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
      setLastUpdated(new Date());
    } catch (e: any) {
      setErr(e.message || 'Erro');
      setShowPlayerData(false);
    } finally { setLoading(false); }
  }

  // Auto-load default player on mount
  useEffect(() => {
    if (!player && !loading && !err && !tag) {
      loadDefaultPlayer();
    }
  }, [player, loading, err, tag]);

  function onSearch(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const inputValue = formData.get('tag') as string;
    const clean = inputValue.replace(/^#/, '').trim().toUpperCase();
    if (clean) { 
      setTag(clean); 
      load(clean); 
    }
  }

  function loadDefaultPlayer() {
    setTag(defaultTag);
    load(defaultTag);
  }

  async function refreshData() {
    if (!tag || loading) return;
    setIsRefreshing(true);
    try {
      await load(tag);
    } finally {
      setIsRefreshing(false);
    }
  }

  // Auto-refresh a cada 2 minutos quando há dados carregados
  usePolling(async () => {
    if (showPlayerData && tag && !loading && !isRefreshing) {
      await refreshData();
    }
  }, showPlayerData ? 60000 : undefined); // 1 minuto para ser mais responsivo

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
            <form onSubmit={onSearch} className="max-w-md mx-auto mb-8">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input 
                  name="tag" 
                  value={tag}
                  onChange={(e) => setTag(e.target.value)}
                  placeholder="Digite sua TAG (#XXXXXXX)"
                  className="w-full pl-12 pr-4 py-4 rounded-xl bg-card-dark border border-border-dark text-white focus:border-royal focus:outline-none transition-colors placeholder:text-gray-500 text-center"
                />
              </div>
              <button 
                type="submit"
                disabled={loading}
                className="w-full mt-4 px-8 py-4 rounded-xl bg-gradient-to-r from-royal to-purple hover:from-royal/90 hover:to-purple/90 text-white font-semibold transition-all duration-200 shadow-lg"
              >
                {loading ? 'Buscando...' : 'Buscar Jogador'}
              </button>
            </form>

            {/* Quick Demo Button */}
            <div className="text-center">
              <button 
              onClick={loadDefaultPlayer}
              className="text-royal hover:text-royal/80 transition-colors font-medium"
              >
              Ver exemplo com jogador demo →
              </button>
              <div className="text-xs text-gray-500 mt-2">
                Ou digite qualquer TAG de jogador (ex: #2PP, #8QU8J9LP)
              </div>
            </div>

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
        <main className="max-w-7xl mx-auto p-6">
          {/* Player Header com botão de atualizar */}
          {player && (
            <div className="bg-card-dark border border-border-dark rounded-xl p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-royal to-purple flex items-center justify-center text-3xl border-2 border-border-dark">
                    👑
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h1 className="text-3xl font-bold text-white">{player.name}</h1>
                      <span className="text-lg text-gray-400 font-mono">#{player.tag}</span>
                      <Star className="w-5 h-5 text-gold" />
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-royal rounded-full"></div>
                        <span className="text-gray-300">{player.arena || 'Arena Desconhecida'}</span>
                      </div>
                      {player.clan && (
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-purple rounded-full"></div>
                          <span className="text-gray-300">{player.clan}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-4xl font-bold text-gold mb-1">{player.trophies.toLocaleString()}</div>
                    <div className="text-sm text-gray-400">Troféus Atuais</div>
                    <div className="text-xs text-gray-500 mt-1">Melhor: {player.bestTrophies.toLocaleString()}</div>
                  </div>
                  
                  <button
                    onClick={refreshData}
                    disabled={isRefreshing}
                    className="flex items-center gap-2 px-4 py-2 bg-royal hover:bg-royal/80 text-white rounded-lg transition-colors disabled:opacity-50"
                  >
                    <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                    {isRefreshing ? 'Atualizando...' : 'Atualizar'}
                  </button>
                </div>
              </div>
              
              {lastUpdated && (
                <div className="text-xs text-gray-500 flex items-center gap-2">
                  <Clock className="w-3 h-3" />
                  <span>
                    Atualização mais recente: {lastUpdated.toLocaleString('pt-BR', {
                      timeZone: 'America/Sao_Paulo',
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Tabs Navigation */}
          <div className="bg-card-dark border border-border-dark rounded-xl mb-6">
            <div className="flex border-b border-border-dark">
              {[
                { id: 'resumo', label: 'Resumo', icon: <BarChart3 className="w-4 h-4" /> },
                { id: 'historico', label: 'Histórico', icon: <Calendar className="w-4 h-4" /> },
                { id: 'estatisticas', label: 'Estatísticas', icon: <Trophy className="w-4 h-4" /> },
                { id: 'live', label: 'Ao Vivo', icon: <Zap className="w-4 h-4" /> }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'text-royal border-b-2 border-royal bg-royal/5'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          {activeTab === 'resumo' && player && summary && (
            <div className="space-y-6">
              <LeagueInfo player={player} />
              <SummaryCards player={player} summary={summary} />
              <CurrentPush summary={summary} />
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <TrophyChart series={summary.series} />
                <div className="bg-card-dark border border-border-dark rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center">
                      <Award className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="font-bold text-lg text-white">Conquistas Recentes</h2>
                      <p className="text-sm text-gray-400">Últimos marcos alcançados</p>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="bg-bg-dark/50 rounded-lg p-4 border border-border-dark/50">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gold rounded-lg flex items-center justify-center text-sm">🏆</div>
                        <div>
                          <div className="font-semibold text-white">Novo Recorde Pessoal</div>
                          <div className="text-sm text-gray-400">{player.bestTrophies.toLocaleString()} troféus</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-bg-dark/50 rounded-lg p-4 border border-border-dark/50">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center text-sm">👑</div>
                        <div>
                          <div className="font-semibold text-white">3 Coroas Master</div>
                          <div className="text-sm text-gray-400">{player.threeCrownWins?.toLocaleString() || 0} vitórias com 3 coroas</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'historico' && (
            <div className="space-y-6">
              <SessionHistory battles={battles} />
              <BattleHistory battles={battles} />
            </div>
          )}

          {activeTab === 'estatisticas' && player && summary && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="bg-card-dark border border-border-dark rounded-xl p-6">
                  <h3 className="font-bold text-lg text-white mb-4">Performance Geral</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Total de Vitórias</span>
                      <span className="text-emerald-400 font-bold">{player.wins?.toLocaleString() || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Total de Derrotas</span>
                      <span className="text-rose-400 font-bold">{player.losses?.toLocaleString() || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Win Rate Geral</span>
                      <span className="text-gold font-bold">
                        {player.wins && player.losses ? 
                          Math.round((player.wins / (player.wins + player.losses)) * 100) : 0}%
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-card-dark border border-border-dark rounded-xl p-6">
                  <h3 className="font-bold text-lg text-white mb-4">Sessão Atual</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Partidas Jogadas</span>
                      <span className="text-white font-bold">{summary.matchesTotal}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Troféus Ganhos/Perdidos</span>
                      <span className={`font-bold ${summary.trophyDelta >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {summary.trophyDelta >= 0 ? '+' : ''}{summary.trophyDelta}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Win Rate da Sessão</span>
                      <span className="text-gold font-bold">{summary.winRate}%</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-card-dark border border-border-dark rounded-xl p-6">
                  <h3 className="font-bold text-lg text-white mb-4">Recordes</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Melhor Temporada</span>
                      <span className="text-purple font-bold">{player.bestTrophies?.toLocaleString() || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Nível de Experiência</span>
                      <span className="text-gold font-bold">{player.expLevel}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">3 Coroas</span>
                      <span className="text-gold font-bold">{player.threeCrownWins?.toLocaleString() || 0}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <TrophyChart series={summary.series} />
            </div>
          )}

          {activeTab === 'live' && (
            <div className="bg-card-dark border border-border-dark rounded-xl p-6">
              <div className="text-center py-12">
                <Zap className="w-16 h-16 text-royal mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">Modo Ao Vivo</h3>
                <p className="text-gray-400 mb-6">
                  Acompanhe partidas em tempo real e estatísticas ao vivo
                </p>
                <div className="bg-bg-dark/50 rounded-lg p-4 border border-border-dark/50 max-w-md mx-auto">
                  <div className="flex items-center justify-center gap-2 text-emerald-400">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                    <span className="text-sm">Monitoramento ativo</span>
                  </div>
                  <div className="text-xs text-gray-500 mt-2">
                    Dados atualizados automaticamente a cada 2 minutos
                  </div>
                </div>
              </div>
            </div>
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