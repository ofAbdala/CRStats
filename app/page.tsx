'use client';

import '@/lib/timer-shims';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Search, Trophy, BarChart3, RefreshCw, Clock, TrendingUp, Crown, Target, Zap, ArrowRight, ChevronRight, Shield, Globe, CheckCircle } from 'lucide-react';
import PlayerHeader from '@/components/PlayerHeader';
import TrophyChart from '@/components/TrophyChart';
import BattleHistory from '@/components/BattleHistory';
import LeagueInfo from '@/components/LeagueInfo';
import SessionHistory from '@/components/SessionHistory';
import { usePolling } from '@/lib/usePolling';
import { getArenaByTrophies } from '@/lib/arenas';
import { parseClashTime, formatDateTime } from '@/lib/time';
import { fadeInUp, staggerChildren, buttonHover, cardHover, loadingSpinner } from '@/utils/animations';

async function fetchJson(url: string) {
  try {
    const r = await fetch(url, { cache: 'no-store' });
    if (!r.ok) throw new Error(await r.text());
    return r.json();
  } catch (e: any) {
    if (e?.name === 'AbortError') {
      return null;
    }
    throw e;
  }
}

export default function Page() {
  const defaultTag = 'U9UUCCQ';
  const [scrollY, setScrollY] = useState(0);
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

  // Intersection observers para scroll reveals
  const [heroRef, heroInView] = useInView({ threshold: 0.3, triggerOnce: true });
  const [featuresRef, featuresInView] = useInView({ threshold: 0.2, triggerOnce: true });
  const [statsRef, statsInView] = useInView({ threshold: 0.2, triggerOnce: true });

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  async function load(t: string) {
    setLoading(true); 
    setErr(null);
    try {
      const [p, s, b] = await Promise.all([
        fetchJson(`/api/player/${t}`),
        fetchJson(`/api/player/${t}/summary?last=20`),
        fetchJson(`/api/player/${t}/battles?last=20`)
      ]);
      setPlayer(p); 
      setSummary(s); 
      setBattles(b);
      setShowPlayerData(true);
      setLastUpdated(new Date());
    } catch (e: any) {
      setErr(e.message || 'Falha na análise');
      setShowPlayerData(false);
    } finally { 
      setLoading(false); 
    }
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
      const [p, s, b] = await Promise.all([
        fetchJson(`/api/player/${tag}`),
        fetchJson(`/api/player/${tag}/summary?last=20`),
        fetchJson(`/api/player/${tag}/battles?last=20`)
      ]);
      setPlayer(p); 
      setSummary(s); 
      setBattles(b);
      setLastUpdated(new Date());
    } finally {
      setIsRefreshing(false);
    }
  }

  // Auto-refresh para tab live
  usePolling(async () => {
    if (showPlayerData && tag && !loading && !isRefreshing && activeTab === 'live') {
      await refreshData();
    }
  }, activeTab === 'live' ? 60000 : undefined);

  // Stats de credibilidade X1
  const credibilityStats = [
    { value: "99.9%", label: "Precision", description: "Análise de dados" },
    { value: "<100ms", label: "Response", description: "Velocidade de API" },
    { value: "24/7", label: "Monitor", description: "Disponibilidade" },
    { value: "150+", label: "Players", description: "Base ativa" }
  ];

  const features = [
    {
      icon: <Trophy className="w-6 h-6" />,
      title: "Analytics Avançados",
      description: "Para jogadores que exigem excelência absoluta em dados"
    },
    {
      icon: <BarChart3 className="w-6 h-6" />,
      title: "Performance Tracking",
      description: "Métricas premium com precisão excepcional"
    },
    {
      icon: <Target className="w-6 h-6" />,
      title: "Intelligence Engine",
      description: "AI-powered insights para performance de elite"
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Enterprise Security",
      description: "Proteção premium para dados confidenciais"
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden gpu-accelerated">
      {/* Background Effects Premium */}
      <div className="gradient-bg fixed inset-0 pointer-events-none" />
      
      {/* Elementos Decorativos Geométricos */}
      <div className="absolute top-1/4 left-1/4 w-32 h-32 border border-gray-800 rotate-45 opacity-20 float-animation" />
      <div className="absolute bottom-1/3 right-1/4 w-24 h-24 border border-gray-700 rotate-12 opacity-15 float-animation" style={{ animationDelay: '3s' }} />
      <div className="absolute top-2/3 left-1/3 w-16 h-16 border border-gray-600 opacity-10 float-animation" style={{ animationDelay: '6s' }} />

      <AnimatePresence mode="wait">
        {!showPlayerData ? (
          /* Homepage Premium */
          <motion.main
            key="homepage"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="relative z-10"
          >
            {/* Header Premium */}
            <header className="fixed w-full top-0 z-50 h-20">
              <div 
                style={{ 
                  backgroundColor: scrollY > 100 ? 'rgba(0, 0, 0, 0.95)' : 'transparent',
                  backdropFilter: scrollY > 100 ? 'blur(10px)' : 'none',
                  transition: 'all 0.3s ease'
                }}
                className="h-full border-b border-gray-800"
              >
                <nav className="max-w-7xl mx-auto px-8 h-full flex items-center justify-between">
                  <motion.div 
                    className="flex items-center gap-4"
                    initial={{ x: -50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.6 }}
                  >
                    <motion.div 
                      className="w-10 h-10 bg-white rounded-2xl flex items-center justify-center gpu-accelerated"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Crown className="w-6 h-6 text-black" />
                    </motion.div>
                    <div>
                      <span className="text-xl font-semibold text-glow">Clash Dex</span>
                      <div className="text-xs text-gray-400 font-light">by X1.Payments</div>
                    </div>
                  </motion.div>
                  
                  <motion.div 
                    className="text-sm text-gray-400 font-light hidden lg:block"
                    initial={{ x: 50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                  >
                    Para jogadores que não aceitam menos que a perfeição
                  </motion.div>
                </nav>
              </div>
            </header>

            {/* Hero Section Premium */}
            <section className="h-screen flex items-center justify-center relative overflow-hidden">
              <motion.div 
                ref={heroRef}
                initial={{ opacity: 0, y: 50 }}
                animate={heroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="max-w-4xl mx-auto text-center relative z-10 px-8"
              >
                <motion.div 
                  className="w-32 h-32 bg-white rounded-3xl flex items-center justify-center mx-auto mb-12 card-glow gpu-accelerated"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={heroInView ? { scale: 1, opacity: 1 } : { scale: 0.8, opacity: 0 }}
                  transition={{ delay: 0.3, duration: 0.8 }}
                  whileHover={{ scale: 1.1, y: -10, rotate: 5 }}
                >
                  <Crown className="w-16 h-16 text-black" />
                </motion.div>
                
                <motion.h1 
                  className="text-5xl md:text-7xl font-light mb-8 leading-tight text-glow"
                  initial={{ opacity: 0, y: 30 }}
                  animate={heroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                >
                  Elite Gaming<br/>
                  <span className="font-semibold">Analytics</span>
                </motion.h1>
                
                <motion.p 
                  className="text-xl text-gray-400 mb-6 max-w-2xl mx-auto font-light leading-relaxed"
                  initial={{ opacity: 0 }}
                  animate={heroInView ? { opacity: 1 } : { opacity: 0 }}
                  transition={{ delay: 0.7, duration: 0.8 }}
                >
                  Para jogadores que não aceitam menos que a <span className="text-white font-medium">perfeição absoluta</span>
                </motion.p>
                
                <motion.p 
                  className="text-gray-500 mb-16 font-light"
                  initial={{ opacity: 0 }}
                  animate={heroInView ? { opacity: 1 } : { opacity: 0 }}
                  transition={{ delay: 0.9, duration: 0.8 }}
                >
                  Desenvolvido por <span className="text-gray-300 font-medium">X1.Payments</span> • Performance excepcional garantida
                </motion.p>

                {/* Search Form Premium */}
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={heroInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
                  transition={{ delay: 1.1, duration: 0.6 }}
                  className="max-w-lg mx-auto mb-12"
                >
                  <form onSubmit={onSearch}>
                    <div className="glass-premium glow-effect p-4 rounded-3xl">
                      <div className="relative">
                        <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
                        <input 
                          name="tag" 
                          value={tag}
                          onChange={(e) => setTag(e.target.value)}
                          placeholder="Digite sua TAG (#XXXXXXX)"
                          className="w-full pl-14 pr-4 py-4 bg-transparent text-white placeholder:text-gray-500 focus:outline-none text-center font-medium focus-ring rounded-2xl"
                        />
                      </div>
                    </div>
                    
                    <motion.button 
                      type="submit"
                      disabled={loading}
                      className="group w-full mt-8 bg-white text-black px-8 py-4 rounded-2xl text-sm font-medium hover:bg-gray-100 transition-all duration-300 button-glow gpu-accelerated disabled:opacity-50 flex items-center justify-center"
                      whileHover={!loading ? buttonHover : {}}
                      whileTap={{ scale: 0.98 }}
                    >
                      {loading ? (
                        <div className="flex items-center gap-3">
                          <motion.div
                            {...loadingSpinner}
                            className="w-5 h-5 border-2 border-black border-t-transparent rounded-full"
                          />
                          <span className="font-medium">Processando análise...</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-3">
                          <span>Analisar Performance</span>
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                        </div>
                      )}
                    </motion.button>
                  </form>

                  {/* Demo Link Premium */}
                  <motion.div 
                    className="text-center mt-8"
                    initial={{ opacity: 0 }}
                    animate={heroInView ? { opacity: 1 } : { opacity: 0 }}
                    transition={{ delay: 1.3, duration: 0.6 }}
                  >
                    <button 
                      onClick={loadDefaultPlayer}
                      className="text-gray-400 hover:text-white transition-colors duration-300 font-medium hover:translate-x-1 inline-flex items-center gap-2"
                    >
                      Ver demonstração premium
                      <ChevronRight className="w-4 h-4" />
                    </button>
                    <div className="text-xs text-gray-600 mt-3 font-light">
                      Análise com jogador de elite
                    </div>
                  </motion.div>
                </motion.div>

                {/* Loading State Premium */}
                <AnimatePresence>
                  {loading && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="glass-premium glow-effect px-8 py-6 rounded-3xl inline-block"
                    >
                      <div className="flex items-center gap-4 text-gray-300">
                        <motion.div
                          {...loadingSpinner}
                          className="w-6 h-6 border-2 border-white border-t-transparent rounded-full"
                        />
                        <span className="font-medium">Processando dados premium...</span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
                
                {/* Error State Premium */}
                <AnimatePresence>
                  {err && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="glass-premium border border-red-400/20 bg-red-400/5 p-6 rounded-3xl max-w-md mx-auto"
                    >
                      <div className="font-medium text-red-400 mb-2">Falha na análise</div>
                      <div className="text-sm text-gray-400 font-light">{err}</div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </section>

            {/* Stats Premium Section */}
            <section className="px-8 py-24 border-t border-gray-800 relative">
              <div className="max-w-7xl mx-auto">
                <motion.div 
                  ref={statsRef}
                  initial={{ opacity: 0, y: 50 }}
                  animate={statsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
                  transition={{ duration: 0.8 }}
                  className="text-center mb-16"
                >
                  <h2 className="text-4xl md:text-5xl font-light mb-8 text-glow">
                    Performance <span className="font-semibold">Excepcional</span>
                  </h2>
                  <p className="text-lg text-gray-400 font-light max-w-2xl mx-auto">
                    Métricas que definem a elite dos analytics gaming
                  </p>
                </motion.div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 max-w-5xl mx-auto">
                  {credibilityStats.map((stat, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={statsInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                      transition={{ delay: 0.1 + index * 0.1, duration: 0.6 }}
                      whileHover={cardHover}
                      className="premium-gradient border border-gray-800 p-8 rounded-3xl text-center card-glow gpu-accelerated group"
                    >
                      <motion.div 
                        className="text-3xl md:text-4xl font-light mb-2 text-glow group-hover:scale-110 transition-transform duration-300"
                      >
                        {stat.value}
                      </motion.div>
                      <div className="text-sm text-gray-400 mb-1 font-medium">{stat.label}</div>
                      <div className="text-xs text-gray-500 font-light">{stat.description}</div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </section>

            {/* Features Premium Section */}
            <section className="px-8 py-24 relative">
              <div className="mx-auto max-w-7xl">
                <motion.div 
                  ref={featuresRef}
                  initial={{ opacity: 0, y: 50 }}
                  animate={featuresInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
                  transition={{ duration: 0.8 }}
                  className="text-center mb-24"
                >
                  <h2 className="text-4xl md:text-6xl font-light text-glow mb-8">
                    Tecnologia de <span className="font-semibold">Elite</span>
                  </h2>
                  <p className="text-xl text-gray-400 font-light max-w-3xl mx-auto leading-relaxed">
                    Desenvolvido para jogadores que buscam <span className="text-white font-medium">excelência absoluta</span> em suas análises
                  </p>
                </motion.div>

                <motion.div 
                  className="grid grid-cols-1 md:grid-cols-2 gap-12"
                  variants={staggerChildren}
                  animate={featuresInView ? "animate" : ""}
                >
                  {features.map((feature, index) => (
                    <motion.div
                      key={index}
                      variants={fadeInUp}
                      whileHover={cardHover}
                      className="premium-gradient border border-gray-800 p-8 rounded-3xl card-glow group gpu-accelerated"
                    >
                      <motion.div 
                        className="w-16 h-16 bg-gray-900 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-gray-800 transition-all duration-300 glow-effect"
                        whileHover={{ scale: 1.1, rotate: 5 }}
                      >
                        <div className="text-white group-hover:scale-110 transition-transform duration-300">
                          {feature.icon}
                        </div>
                      </motion.div>
                      <h3 className="text-xl font-medium text-white mb-4 group-hover:text-glow transition-all duration-300">
                        {feature.title}
                      </h3>
                      <p className="text-gray-400 font-light leading-relaxed group-hover:text-gray-300 transition-colors duration-300">
                        {feature.description}
                      </p>
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            </section>
          </motion.main>
        ) : (
          /* Dashboard Premium */
          <motion.main
            key="dashboard"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="relative z-10"
          >
            {/* Header Dashboard */}
            <header className="fixed w-full top-0 z-50 h-20">
              <div 
                style={{ 
                  backgroundColor: 'rgba(0, 0, 0, 0.95)',
                  backdropFilter: 'blur(10px)'
                }}
                className="h-full border-b border-gray-800"
              >
                <nav className="max-w-7xl mx-auto px-8 h-full flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-white rounded-2xl flex items-center justify-center">
                      <Crown className="w-6 h-6 text-black" />
                    </div>
                    <div>
                      <span className="text-xl font-semibold text-glow">Clash Dex</span>
                      <div className="text-xs text-gray-400 font-light">by X1.Payments</div>
                    </div>
                  </div>
                  <motion.button 
                    onClick={() => setShowPlayerData(false)}
                    className="text-gray-400 hover:text-white transition-colors duration-300 font-medium hover:translate-x-1 inline-flex items-center gap-2"
                    whileHover={{ x: -5 }}
                    transition={{ duration: 0.3 }}
                  >
                    ← Voltar ao início
                  </motion.button>
                </nav>
              </div>
            </header>

            <div className="pt-32 px-8">
              <div className="max-w-7xl mx-auto">
                {/* Player Header Premium */}
                {player && (
                  <motion.div 
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="premium-gradient border border-gray-800 p-8 rounded-3xl card-glow mb-12 gpu-accelerated"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
                      <div className="flex items-center gap-8">
                        <motion.div 
                          className="w-32 h-32 rounded-3xl bg-gray-900 flex items-center justify-center text-6xl card-glow gpu-accelerated"
                          whileHover={{ scale: 1.05, rotate: 5 }}
                          transition={{ duration: 0.3 }}
                        >
                          👑
                        </motion.div>
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-col lg:flex-row lg:items-center gap-2 lg:gap-6 mb-4">
                            <h1 className="text-4xl lg:text-6xl font-light text-glow">{player.name}</h1>
                            <span className="text-xl lg:text-2xl text-gray-400 font-mono">#{player.tag}</span>
                          </div>
                          <div className="flex flex-col lg:flex-row lg:items-center gap-2 lg:gap-8 text-base lg:text-lg">
                            <div className="flex items-center gap-3">
                              <div className="w-3 h-3 bg-white rounded-full pulse-glow"></div>
                              <span className="text-gray-300 font-light">{getArenaByTrophies(player.trophies).name}</span>
                            </div>
                            {player.clan && (
                              <div className="flex items-center gap-3">
                                <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                                <span className="text-gray-300 font-light">{player.clan}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex flex-col lg:flex-row lg:items-center gap-8">
                        <div className="text-center lg:text-right">
                          <div className="text-5xl lg:text-6xl font-light text-glow mb-2">{player.trophies.toLocaleString()}</div>
                          <div className="text-gray-400 text-lg mb-2 font-light">Troféus Elite</div>
                          <div className="text-gray-500 font-light">Melhor: {player.bestTrophies.toLocaleString()}</div>
                        </div>
                        
                        <motion.button
                          onClick={refreshData}
                          disabled={isRefreshing}
                          className="border border-white px-6 py-3 text-sm font-medium hover:bg-white hover:text-black transition-all duration-300 rounded-2xl disabled:opacity-50 gpu-accelerated"
                          whileHover={!isRefreshing ? { scale: 1.05 } : {}}
                          whileTap={{ scale: 0.95 }}
                        >
                          <RefreshCw className={`w-5 h-5 ${isRefreshing ? 'animate-spin' : ''}`} />
                        </motion.button>
                      </div>
                    </div>
                    
                    {lastUpdated && (
                      <div className="text-sm text-gray-500 flex items-center gap-3 mt-8 pt-8 border-t border-gray-800 font-light">
                        <Clock className="w-4 h-4" />
                        <span>
                          Última sincronização: {lastUpdated.toLocaleString('pt-BR', {
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
                  </motion.div>
                )}

                {/* Tabs Navigation Premium */}
                <motion.div 
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.6 }}
                  className="glass-premium glow-effect mb-12 p-2 rounded-3xl"
                >
                  <div className="flex overflow-x-auto">
                    {[
                      { id: 'resumo', label: 'Resumo', icon: <BarChart3 className="w-5 h-5" /> },
                      { id: 'historico', label: 'Histórico', icon: <Clock className="w-5 h-5" /> },
                      { id: 'estatisticas', label: 'Estatísticas', icon: <Trophy className="w-5 h-5" /> },
                      { id: 'live', label: 'Ao Vivo', icon: <Zap className="w-5 h-5" /> }
                    ].map((tab) => (
                      <motion.button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-3 px-8 py-4 font-medium transition-all duration-300 rounded-2xl whitespace-nowrap gpu-accelerated ${
                          activeTab === tab.id
                            ? 'bg-white text-black button-glow'
                            : 'text-gray-400 hover:text-white hover:bg-white/5'
                        }`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        {tab.icon}
                        <span>{tab.label}</span>
                      </motion.button>
                    ))}
                  </div>
                </motion.div>

                {/* Tab Content Premium */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.4 }}
                    className="space-y-12"
                  >
                    {activeTab === 'resumo' && player && summary && (
                      <>
                        <LeagueInfo player={player} battles={battles} />
                        <TrophyChart series={summary.series} battles={battles} player={player} />
                        <SessionHistory battles={battles} />
                      </>
                    )}

                    {activeTab === 'historico' && (
                      <BattleHistory battles={battles} />
                    )}

                    {activeTab === 'estatisticas' && player && summary && (
                      <>
                        <TrophyChart series={summary.series} battles={battles} player={player} />
                        
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                          {[
                            { label: "Eficiência", value: `${summary.winRate}%`, color: summary.winRate >= 60 ? "text-green-400" : "text-red-400", icon: <TrendingUp className="w-6 h-6" /> },
                            { label: "Domínio", value: player.threeCrownWins?.toLocaleString() || '0', color: "text-yellow-400", icon: <Crown className="w-6 h-6" /> },
                            { label: "Elite Peak", value: player.bestTrophies?.toLocaleString() || '0', color: "text-blue-400", icon: <Trophy className="w-6 h-6" /> },
                            { label: "Push Power", value: (summary.trophyDelta > 0 ? '+' : '') + summary.trophyDelta, color: summary.trophyDelta > 0 ? "text-green-400" : "text-red-400", icon: <Zap className="w-6 h-6" /> }
                          ].map((stat, index) => (
                            <motion.div
                              key={index}
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: 0.1 + index * 0.1, duration: 0.6 }}
                              whileHover={cardHover}
                              className="premium-gradient border border-gray-800 p-8 rounded-3xl text-center card-glow group gpu-accelerated"
                            >
                              <div className="text-gray-400 mb-4 flex justify-center group-hover:scale-110 transition-transform duration-300">
                                {stat.icon}
                              </div>
                              <div className={`text-3xl font-light mb-2 ${stat.color} group-hover:text-glow transition-all duration-300`}>
                                {stat.value}
                              </div>
                              <div className="text-gray-400 font-light">{stat.label}</div>
                            </motion.div>
                          ))}
                        </div>
                      </>
                    )}

                    {activeTab === 'live' && (
                      <motion.div 
                        className="premium-gradient border border-gray-800 p-12 rounded-3xl text-center card-glow"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8 }}
                      >
                        <motion.div
                          {...loadingSpinner}
                          className="w-16 h-16 border-2 border-white border-t-transparent rounded-full mx-auto mb-8"
                        />
                        <h2 className="text-3xl font-medium text-white mb-6 text-glow">Monitoramento Elite</h2>
                        <p className="text-xl text-gray-400 font-light mb-8">
                          Sistema de tracking premium ativo
                        </p>
                        <div className="flex items-center justify-center gap-2 text-green-400 mb-4">
                          <CheckCircle className="w-5 h-5" />
                          <span className="font-medium">Sistema operacional</span>
                        </div>
                        {lastUpdated && (
                          <div className="text-sm text-gray-500 font-light">
                            Última verificação: {lastUpdated.toLocaleString('pt-BR', {
                              hour: '2-digit',
                              minute: '2-digit',
                              second: '2-digit'
                            })}
                          </div>
                        )}
                      </motion.div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </motion.main>
        )}
      </AnimatePresence>

      {/* Footer Premium */}
      <footer className="relative border-t border-gray-800 bg-black/50 backdrop-blur-md mt-24">
        <div className="max-w-7xl mx-auto px-8 py-12">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.8 }}
            className="flex flex-col md:flex-row items-center justify-between gap-6"
          >
            <div className="text-gray-400 font-light text-center md:text-left">
              <span className="text-white font-medium">X1.ClashDex.com</span> • Powered by <span className="text-gray-300 font-medium">X1.Payments</span>
            </div>
            <div className="text-gray-500 text-sm font-light">
              Elite Analytics • Premium Performance • Exceptional Quality
            </div>
          </motion.div>
        </div>
      </footer>
    </div>
  );
}