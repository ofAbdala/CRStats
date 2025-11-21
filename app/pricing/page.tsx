'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
    Crown,
    Check,
    Sparkles,
    TrendingUp,
    Users,
    Layers,
    Zap,
    ArrowLeft
} from 'lucide-react';
import { trackEvent, trackPageView } from '@/lib/analytics';
import { useEffect } from 'react';

export default function PricingPage() {
    const [email, setEmail] = useState('');
    const [submitted, setSubmitted] = useState(false);

    useEffect(() => {
        trackPageView('/pricing');
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // TODO: Future integration
        // - Send to email service (Beehiiv/ConvertKit/etc)
        // - Store in database
        // - Send confirmation email
        console.log('[Pricing] Email submitted:', email);

        trackEvent('pricing_cta_click', { action: 'waitlist_submit', email });
        setSubmitted(true);
        setEmail('');
    };

    const freePlanFeatures = [
        'Dashboard básico de estatísticas',
        'Últimas 20 batalhas',
        'Badges e conquistas',
        'Gráfico de troféus',
        'Histórico de sessões',
        'Atualização manual de dados'
    ];

    const proPlanFeatures = [
        'Histórico completo ilimitado',
        'Múltiplos jogadores favoritos',
        'Insights avançados com IA',
        'Painel completo do clã',
        'Análise de decks e meta',
        'Atualização automática',
        'Estatísticas comparativas',
        'Exportação de dados',
        'Suporte prioritário'
    ];

    return (
        <div className="min-h-screen bg-black text-white">
            {/* Header */}
            <header className="fixed w-full top-0 z-50 h-20 border-b border-gray-800"
                style={{
                    backgroundColor: 'rgba(0, 0, 0, 0.95)',
                    backdropFilter: 'blur(10px)'
                }}
            >
                <nav className="max-w-7xl mx-auto px-8 h-full flex items-center justify-between">
                    <Link
                        href="/"
                        className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        <span className="font-medium">Voltar ao Dashboard</span>
                    </Link>

                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-white rounded-2xl flex items-center justify-center">
                            <Crown className="w-6 h-6 text-black" />
                        </div>
                        <div>
                            <span className="text-xl font-semibold text-glow">CR Status PRO</span>
                            <div className="text-xs text-gray-400 font-light">Recursos Premium</div>
                        </div>
                    </div>
                </nav>
            </header>

            {/* Hero */}
            <section className="pt-32 pb-20 px-8">
                <div className="max-w-4xl mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-8">
                            <Sparkles className="w-4 h-4 text-emerald-400" />
                            <span className="text-sm text-emerald-400 font-medium">Em breve</span>
                        </div>

                        <h1 className="text-5xl md:text-7xl font-light mb-6 leading-tight">
                            Leve suas análises para o
                            <span className="block font-semibold bg-gradient-to-r from-emerald-400 to-emerald-600 bg-clip-text text-transparent">
                                próximo nível
                            </span>
                        </h1>

                        <p className="text-xl text-gray-400 font-light max-w-2xl mx-auto">
                            Desbloqueie recursos avançados e insights profundos para dominar o Clash Royale
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Pricing Cards */}
            <section className="pb-20 px-8">
                <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8">
                    {/* Free Plan */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.6 }}
                        className="premium-gradient border border-gray-800 p-8 rounded-3xl"
                    >
                        <div className="mb-8">
                            <h3 className="text-2xl font-medium text-white mb-2">Free</h3>
                            <p className="text-gray-400 font-light">Para começar sua jornada</p>
                        </div>

                        <div className="mb-8">
                            <div className="text-5xl font-light text-white mb-2">R$ 0</div>
                            <div className="text-sm text-gray-500">Grátis para sempre</div>
                        </div>

                        <div className="space-y-4 mb-8">
                            {freePlanFeatures.map((feature, index) => (
                                <div key={index} className="flex items-start gap-3">
                                    <Check className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                                    <span className="text-gray-300 font-light">{feature}</span>
                                </div>
                            ))}
                        </div>

                        <Link
                            href="/"
                            className="block w-full py-3 px-6 rounded-2xl border border-gray-700 text-center text-white font-medium hover:bg-gray-900 transition-all duration-300"
                        >
                            Usar versão Free
                        </Link>
                    </motion.div>

                    {/* PRO Plan */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.6 }}
                        className="relative premium-gradient border-2 border-emerald-500/50 p-8 rounded-3xl shadow-2xl shadow-emerald-500/20"
                    >
                        {/* Popular Badge */}
                        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                            <div className="px-4 py-1.5 rounded-full bg-gradient-to-r from-emerald-500 to-emerald-600 text-white text-sm font-medium">
                                Em breve
                            </div>
                        </div>

                        <div className="mb-8">
                            <h3 className="text-2xl font-medium text-white mb-2 flex items-center gap-2">
                                <Crown className="w-6 h-6 text-emerald-400" />
                                PRO
                            </h3>
                            <p className="text-gray-400 font-light">Para jogadores sérios</p>
                        </div>

                        <div className="mb-8">
                            <div className="text-5xl font-light text-white mb-2">R$ 19,90</div>
                            <div className="text-sm text-gray-500">por mês</div>
                        </div>

                        <div className="space-y-4 mb-8">
                            {proPlanFeatures.map((feature, index) => (
                                <div key={index} className="flex items-start gap-3">
                                    <Check className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                                    <span className="text-white font-light">{feature}</span>
                                </div>
                            ))}
                        </div>

                        <div className="space-y-4">
                            {submitted ? (
                                <div className="py-3 px-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-center">
                                    <div className="flex items-center justify-center gap-2 text-emerald-400">
                                        <Check className="w-5 h-5" />
                                        <span className="font-medium">Obrigado! Você será avisado em breve.</span>
                                    </div>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-3">
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="seu@email.com"
                                        required
                                        className="w-full px-4 py-3 rounded-2xl bg-gray-900 border border-gray-800 text-white placeholder:text-gray-500 focus:outline-none focus:border-emerald-500/50 transition-colors"
                                    />
                                    <button
                                        type="submit"
                                        className="w-full py-3 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white font-medium transition-all duration-300 shadow-lg hover:shadow-emerald-500/50"
                                    >
                                        Quero ser avisado quando lançar
                                    </button>
                                </form>
                            )}
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Features Grid */}
            <section className="py-20 px-8 border-t border-gray-800">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-light mb-4">
                            Recursos <span className="font-semibold">Exclusivos</span> PRO
                        </h2>
                        <p className="text-gray-400 font-light">
                            Tudo que você precisa para dominar o jogo
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: TrendingUp,
                                title: 'Insights Avançados',
                                description: 'IA analisa suas partidas e sugere melhorias'
                            },
                            {
                                icon: Users,
                                title: 'Painel do Clã',
                                description: 'Acompanhe todos os membros do seu clã'
                            },
                            {
                                icon: Layers,
                                title: 'Análise de Decks',
                                description: 'Descubra os melhores decks do meta atual'
                            },
                            {
                                icon: Zap,
                                title: 'Atualização Automática',
                                description: 'Dados sempre atualizados em tempo real'
                            },
                            {
                                icon: Sparkles,
                                title: 'Estatísticas Comparativas',
                                description: 'Compare seu desempenho com outros jogadores'
                            },
                            {
                                icon: Crown,
                                title: 'Suporte Prioritário',
                                description: 'Atendimento rápido e personalizado'
                            }
                        ].map((feature, index) => {
                            const Icon = feature.icon;
                            return (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.1 * index, duration: 0.6 }}
                                    className="premium-gradient border border-gray-800 p-6 rounded-2xl hover:border-emerald-500/30 transition-all duration-300"
                                >
                                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500/20 to-emerald-600/20 flex items-center justify-center mb-4">
                                        <Icon className="w-6 h-6 text-emerald-400" />
                                    </div>
                                    <h3 className="text-lg font-medium text-white mb-2">{feature.title}</h3>
                                    <p className="text-gray-400 font-light text-sm">{feature.description}</p>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </section>
        </div>
    );
}
