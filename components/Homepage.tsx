import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Search, Trophy, BarChart3, Shield, Target, Crown, ArrowRight, ChevronRight } from 'lucide-react';
import { fadeInUp, staggerChildren, buttonHover, cardHover, loadingSpinner } from '@/utils/animations';

interface HomepageProps {
    tag: string;
    setTag: (tag: string) => void;
    onSearch: (e: React.FormEvent<HTMLFormElement>) => void;
    loading: boolean;
    err: string | null;
    loadDefaultPlayer: () => void;
}

export default function Homepage({ tag, setTag, onSearch, loading, err, loadDefaultPlayer }: HomepageProps) {
    const [heroRef, heroInView] = useInView({ threshold: 0.3, triggerOnce: true });
    const [featuresRef, featuresInView] = useInView({ threshold: 0.2, triggerOnce: true });
    const [statsRef, statsInView] = useInView({ threshold: 0.2, triggerOnce: true });

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
        <motion.main
            key="homepage"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="relative z-10"
        >
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
                        Elite Gaming<br />
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
    );
}
