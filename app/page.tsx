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
import TrophyChart from '@/components/TrophyChart';
import BattleHistory from '@/components/BattleHistory';
import LeagueInfo from '@/components/LeagueInfo';
import SessionHistory from '@/components/SessionHistory';
import GradientOrbs from '@/components/GradientOrbs';
import { usePolling } from '@/lib/usePolling';
import { getArenaByTrophies } from '@/lib/arenas';

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
      // Comentado para desabilitar auto-refresh
      // await refreshData();
    }
  }, undefined); // Auto-refresh desabilitado

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

  // Extrai jogadores únicos das batalhas carregadas
  const getPopularPlayersFromBattles = () => {
    if (!battles.length) return [];
    
    const uniquePlayers = new Map();
    
    battles.forEach(battle => {
      // Adiciona o oponente se não existir
      if (battle.opponentTag && battle.opponentName && !uniquePlayers.has(battle.opponentTag)) {
        uniquePlayers.set(battle.opponentTag, {
          tag: battle.opponentTag,
          name: battle.opponentName,
          trophies: battle.opponentTrophies ? `${battle.opponentTrophies.toLocaleString()}` : "N/A"
        });
      }
    });
    
    // Retorna até 6 jogadores únicos
    return Array.from(uniquePlayers.values()).slice(0, 6);
  };

  const popularPlayers = getPopularPlayersFromBattles();

  return (
    <div className="relative min-h-screen bg-hero">
      <GradientOrbs />
      
      {!showPlayerData ? (
        /* Homepage */
        <main className="relative">
          {/* Header Navigation */}
          <header className="fixed top-0 inset-x-0 z-50">
            <nav className="mx-auto max-w-7xl px-4 md:px-6">
              <div className="mt-4 nav-glass float flex items-center justify-between px-6 py-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-fuchsia-500 rounded-xl flex items-center justify-center">
                    <Crown className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-lg font-bold tracking-wide text-white/95">ClashDex</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-white/70">Clash Royale Stats</span>
                </div>
              </div>
            </nav>
          </header>

          {/* Hero Section */}
          <section className="relative pt-[8rem] md:pt-[10rem] pb-16 px-6">
            <div className="mx-auto max-w-7xl">
              <div className="max-w-4xl mx-auto text-center">
                <div className="mb-8">
                  <div className="w-24 h-24 bg-gradient-to-br from-cyan-400 to-fuchsia-500 rounded-3xl flex items-center justify-center mx-auto mb-8 float floaty">
                    <Crown className="w-12 h-12 text-white" />
                  </div>
                  <h1 className="text-gradient text-6xl md:text-8xl font-extrabold leading-[1.05] mb-6">
                    Clash<span className="text-cyan-400">Dex</span>
                  </h1>
                  <p className="text-xl md:text-2xl text-white/70 mb-12 max-w-3xl mx-auto leading-relaxed">
                    Analise suas estatísticas do Clash Royale com progresso em tempo real. by X1.Payments
                  </p>
                </div>

                {/* Search Form */}
                <div className="max-w-lg mx-auto mb-8 sm:mb-12">
                  <form onSubmit={onSearch}>
                    <div className="glass float p-2">
                      <div className="relative">
                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/50 w-5 h-5" />
                        <input 
                          name="tag" 
                          value={tag}
                          onChange={(e) => setTag(e.target.value)}
                          placeholder="Digite sua TAG (#XXXXXXX)"
                          className="w-full pl-12 pr-4 py-3 sm:py-4 bg-transparent text-white placeholder:text-white/50 focus:outline-none text-center text-base sm:text-lg"
                        />
                      </div>
                    </div>
                    <button 
                      type="submit"
                      disabled={loading}
                      className="w-full mt-3 sm:mt-4 glass float px-6 sm:px-8 py-3 sm:py-4 text-white font-semibold transition-all duration-200 hover:brightness-110 disabled:opacity-50"
                    >
                      {loading ? 'Buscando...' : 'Buscar Jogador'}
                    </button>
                  </form>

                  {/* Quick Demo Button */}
                  <div className="text-center mt-4 sm:mt-6">
                    <button 
                      onClick={loadDefaultPlayer}
                      className="text-cyan-400 hover:text-cyan-300 transition-colors font-medium"
                    >
                      Ver exemplo com jogador demo →
                    </button>
                    <div className="text-xs sm:text-sm text-white/50 mt-2">
                      Ou digite qualquer TAG de jogador (ex: #2PP, #8QU8J9LP)
                    </div>
                  </div>
                </div>

                {loading && (
                  <div className="flex items-center justify-center py-8">
                    <div className="glass float px-6 py-4">
                      <div className="flex items-center gap-3 text-white/70">
                        <div className="w-5 h-5 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
                        <span>Carregando dados do jogador...</span>
                      </div>
                    </div>
                  </div>
                )}
                
                {err && (
                  <div className="glass float p-6 text-rose-400 max-w-md mx-auto mt-6 border-rose-500/20">
                    <div className="font-medium">Erro ao carregar dados</div>
                    <div className="text-sm text-rose-300 mt-1">{err}</div>
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* Features Section */}
          <section className="relative py-20 px-6">
            <div className="mx-auto max-w-7xl">
              <div className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Recursos Principais</h2>
                <p className="text-xl text-white/70 max-w-3xl mx-auto">
                  Descubra tudo o que o ClashDex oferece para melhorar sua experiência no Clash Royale
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {features.map((feature, index) => (
                  <div key={index} className="glass-dark float hover-lift p-8">
                    <div className="w-16 h-16 bg-gradient-to-br from-cyan-400/20 to-fuchsia-500/20 rounded-2xl flex items-center justify-center mb-6 floaty">
                      <div className="text-cyan-400">
                        {feature.icon}
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                    <p className="text-white/70">{feature.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Popular Players Section */}
          {popularPlayers.length > 0 && (
            <section className="relative py-20 px-6">
              <div className="mx-auto max-w-7xl">
                <div className="text-center mb-16">
                  <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Jogadores Recentes</h2>
                  <p className="text-xl text-white/70">Oponentes encontrados nas últimas batalhas</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {popularPlayers.map((player, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setTag(player.tag);
                        load(player.tag);
                      }}
                      className="glass-dark float hover-lift p-6 text-left"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-gradient-to-br from-gold/80 to-yellow-400/80 rounded-2xl flex items-center justify-center">
                          <span className="text-2xl">👤</span>
                        </div>
                        <div>
                          <div className="text-lg font-semibold text-white">
                            {player.name}
                          </div>
                          <div className="text-white/60">#{player.tag}</div>
                          <div className="text-sm text-gold">{player.trophies !== "N/A" ? `${player.trophies} troféus` : "Troféus não disponíveis"}</div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* Stats Preview */}
          <section className="relative py-20 px-6">
            <div className="mx-auto max-w-7xl">
              <div className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Estatísticas Detalhadas</h2>
                <p className="text-xl text-white/70">Veja um preview do que você encontrará ao buscar um jogador</p>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
                <div className="glass-dark float p-8 text-center floaty">
                  <TrendingUp className="w-10 h-10 text-emerald-400 mx-auto mb-4" />
                  <div className="text-3xl font-bold text-emerald-400 mb-2">65%</div>
                  <div className="text-white/70">Win Rate</div>
                </div>
                <div className="glass-dark float p-8 text-center floaty" style={{ animationDelay: '1s' }}>
                  <Crown className="w-10 h-10 text-gold mx-auto mb-4" />
                  <div className="text-3xl font-bold text-gold mb-2">1,247</div>
                  <div className="text-white/70">3 Coroas</div>
                </div>
                <div className="glass-dark float p-8 text-center floaty" style={{ animationDelay: '2s' }}>
                  <Trophy className="w-10 h-10 text-fuchsia-400 mx-auto mb-4" />
                  <div className="text-3xl font-bold text-fuchsia-400 mb-2">6,543</div>
                  <div className="text-white/70">Melhor Temporada</div>
                </div>
                <div className="glass-dark float p-8 text-center floaty" style={{ animationDelay: '3s' }}>
                  <Zap className="w-10 h-10 text-cyan-400 mx-auto mb-4" />
                  <div className="text-3xl font-bold text-cyan-400 mb-2">+127</div>
                  <div className="text-white/70">Push Atual</div>
                </div>
              </div>
            </div>
          </section>
        </main>
      ) : (
        /* Player Data View */
        <main className="relative">
          {/* Header Navigation */}
          <header className="fixed top-0 inset-x-0 z-50">
            <nav className="mx-auto max-w-7xl px-4 md:px-6">
              <div className="mt-4 nav-glass float flex items-center justify-between px-6 py-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-fuchsia-500 rounded-xl flex items-center justify-center">
                    <Crown className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-lg font-bold tracking-wide text-white/95">ClashDex</span>
                </div>
                <button 
                  onClick={() => setShowPlayerData(false)}
                  className="btn-ios"
                >
                  ← Voltar ao Início
                </button>
              </div>
            </nav>
          </header>

          <div className="pt-[7rem] px-6">
            <div className="max-w-7xl mx-auto">
              {/* Player Header */}
              {player && (
                <div className="glass-dark float p-4 sm:p-8 mb-8">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-6 mb-6">
                    <div className="flex items-center gap-3 sm:gap-6">
                      <div className="w-16 sm:w-24 h-16 sm:h-24 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-cyan-400 to-fuchsia-500 flex items-center justify-center text-2xl sm:text-4xl border-2 border-white/10 float">
                        👑
                      </div>
                      <div>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 mb-2 sm:mb-3">
                          <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold text-white">{player.name}</h1>
                          <div className="flex items-center gap-2">
                            <span className="text-base sm:text-xl text-white/60 font-mono">#{player.tag}</span>
                            <Star className="w-4 sm:w-6 h-4 sm:h-6 text-gold" />
                          </div>
                        </div>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 text-sm sm:text-lg">
                          <div className="flex items-center gap-2">
                            <div className="w-2 sm:w-3 h-2 sm:h-3 bg-cyan-400 rounded-full"></div>
                            <span className="text-white/80">{getArenaByTrophies(player.trophies).name}</span>
                          </div>
                          {player.clan && (
                            <div className="flex items-center gap-2">
                              <div className="w-2 sm:w-3 h-2 sm:h-3 bg-fuchsia-400 rounded-full"></div>
                              <span className="text-white/80">{player.clan}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6">
                      <div className="text-center sm:text-right flex-shrink-0">
                        <div className="text-3xl sm:text-4xl md:text-6xl font-bold text-gradient mb-1 sm:mb-2">{player.trophies.toLocaleString()}</div>
                        <div className="text-white/70 text-sm sm:text-base lg:text-lg">Troféus Atuais</div>
                        <div className="text-white/50 text-xs sm:text-sm mt-1 sm:mt-2">Melhor: {player.bestTrophies.toLocaleString()}</div>
                      </div>
                      
                      <button
                        onClick={refreshData}
                        disabled={isRefreshing}
                        className="btn-ios flex items-center justify-center gap-2 w-full sm:w-auto"
                      >
                        <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                        {isRefreshing ? 'Atualizando...' : 'Atualizar'}
                      </button>
                    </div>
                  </div>
                  
                  {lastUpdated && (
                    <div className="text-xs sm:text-sm text-white/50 flex items-center justify-center sm:justify-start gap-2">
                      <Clock className="w-4 h-4" />
                      <span>
                        Atualização: {lastUpdated.toLocaleString('pt-BR', {
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
              <div className="glass float mb-8">
                <div className="flex overflow-x-auto">
                  {[
                    { id: 'resumo', label: 'Resumo', icon: <BarChart3 className="w-5 h-5" /> },
                    { id: 'historico', label: 'Histórico', icon: <Calendar className="w-5 h-5" /> },
                    { id: 'estatisticas', label: 'Estatísticas', icon: <Trophy className="w-5 h-5" /> },
                    { id: 'live', label: 'Ao Vivo', icon: <Zap className="w-5 h-5" /> }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center gap-2 sm:gap-3 px-4 sm:px-6 lg:px-8 py-3 sm:py-4 font-medium transition-all duration-200 rounded-2xl whitespace-nowrap ${
                        activeTab === tab.id
                          ? 'bg-white/10 text-white'
                          : 'text-white/60 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      {tab.icon}
                      <span className="text-sm sm:text-base">{tab.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Tab Content */}
              {activeTab === 'resumo' && player && summary && (
                <div className="space-y-8">
                  <LeagueInfo player={player} battles={battles} />
                  <SessionHistory battles={battles} />
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <TrophyChart series={summary.series} battles={battles} player={player} />
                    <div className="glass-dark float p-8">
                      <div className="flex items-center gap-4 mb-8">
                        <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-2xl flex items-center justify-center">
                          <Award className="w-7 h-7 text-white" />
                        </div>
                        <div>
                          <h2 className="text-2xl font-bold text-white">Conquistas Recentes</h2>
                          <p className="text-white/70">Últimos marcos alcançados</p>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="glass p-6 hover-lift">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-gold rounded-2xl flex items-center justify-center text-lg">🏆</div>
                            <div>
                              <div className="text-lg font-semibold text-white">Novo Recorde Pessoal</div>
                              <div className="text-white/70">{player.bestTrophies.toLocaleString()} troféus</div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="glass p-6 hover-lift">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center text-lg">👑</div>
                            <div>
                              <div className="text-lg font-semibold text-white">3 Coroas Master</div>
                              <div className="text-white/70">{player.threeCrownWins?.toLocaleString() || 0} vitórias com 3 coroas</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'historico' && (
                <div className="space-y-8">
                  <BattleHistory battles={battles} />
                </div>
              )}

              {activeTab === 'estatisticas' && player && summary && (
                <div className="space-y-8">
                  {/* Gráfico de Avanço dos Troféus */}
                  <TrophyChart series={summary.series} battles={battles} player={player} />
                  
                  {/* Grid de Estatísticas */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
                    <div className="glass-dark float p-4 sm:p-6 lg:p-8 text-center">
                      <TrendingUp className="w-6 sm:w-8 lg:w-10 h-6 sm:h-8 lg:h-10 text-emerald-400 mx-auto mb-2 sm:mb-4" />
                      <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-emerald-400 mb-1 sm:mb-2">{summary.winRate}%</div>
                      <div className="text-white/70">Win Rate</div>
                      <div className="text-xs sm:text-sm text-white/50 mt-1 sm:mt-2">{summary.wins}W / {summary.losses}L</div>
                    </div>
                    <div className="glass-dark float p-4 sm:p-6 lg:p-8 text-center">
                      <Crown className="w-6 sm:w-8 lg:w-10 h-6 sm:h-8 lg:h-10 text-gold mx-auto mb-2 sm:mb-4" />
                      <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-gold mb-1 sm:mb-2">{player.threeCrownWins?.toLocaleString() || '0'}</div>
                      <div className="text-white/70">3 Coroas</div>
                    </div>
                    <div className="glass-dark float p-4 sm:p-6 lg:p-8 text-center">
                      <Trophy className="w-6 sm:w-8 lg:w-10 h-6 sm:h-8 lg:h-10 text-fuchsia-400 mx-auto mb-2 sm:mb-4" />
                      <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-fuchsia-400 mb-1 sm:mb-2">{player.bestTrophies?.toLocaleString() || '0'}</div>
                      <div className="text-white/70">Melhor Temporada</div>
                    </div>
                    <div className="glass-dark float p-4 sm:p-6 lg:p-8 text-center">
                      <Zap className="w-6 sm:w-8 lg:w-10 h-6 sm:h-8 lg:h-10 text-cyan-400 mx-auto mb-2 sm:mb-4" />
                      <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-cyan-400 mb-1 sm:mb-2">{(summary.trophyDelta > 0 ? '+' : '') + summary.trophyDelta}</div>
                      <div className="text-white/70">Push Atual</div>
                      <div className="text-xs sm:text-sm text-white/50 mt-1 sm:mt-2">{summary.matchesTotal} partidas</div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'live' && (
                <div className="glass-dark float p-12">
                  <div className="text-center">
                    <Zap className="w-20 h-20 text-cyan-400 mx-auto mb-6 floaty" />
                    <h3 className="text-3xl font-bold text-white mb-4">Modo Ao Vivo</h3>
                    <p className="text-xl text-white/70 mb-8 max-w-md mx-auto">
                      Acompanhe partidas em tempo real e estatísticas ao vivo
                    </p>
                    <div className="glass p-6 max-w-md mx-auto">
                      <div className="flex items-center justify-center gap-3 text-emerald-400">
                        <div className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse"></div>
                        <span>Monitoramento ativo</span>
                      </div>
                      <div className="text-sm text-white/50 mt-3">
                        Dados atualizados automaticamente a cada 2 minutos
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      )}

      {/* Footer */}
      <footer className="relative border-t hairline bg-black/20 backdrop-blur-md mt-20">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="flex items-center justify-between">
            <div className="text-white/60">
              Powered by <span className="text-cyan-400">Supercell API</span> • Inspired by Apple Design
            </div>
            <div className="text-white/40 text-sm">
              Next.js • Tailwind CSS • Recharts
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}