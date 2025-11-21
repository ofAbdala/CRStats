import Link from 'next/link';
import { Trophy, ArrowRight, Zap, Target, BarChart3 } from 'lucide-react';

export default function Home() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-900">
            {/* Header */}
            <header className="container mx-auto px-6 py-8">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                            <Trophy className="w-7 h-7 text-white" />
                        </div>
                        <span className="text-2xl font-bold text-white">CR Status</span>
                    </div>
                    <Link
                        href="/login"
                        className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                    >
                        Entrar
                    </Link>
                </div>
            </header>

            {/* Hero */}
            <main className="container mx-auto px-6 py-20">
                <div className="max-w-4xl mx-auto text-center">
                    <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
                        Domine o{' '}
                        <span className="bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
                            Clash Royale
                        </span>
                    </h1>
                    <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto">
                        Acompanhe seu desempenho, detecte pushes automaticamente e alcance suas metas de troféus com analytics avançados.
                    </p>

                    <Link
                        href="/login"
                        className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl font-semibold text-lg transition-all shadow-lg shadow-blue-900/50"
                    >
                        Começar Agora
                        <ArrowRight className="w-5 h-5" />
                    </Link>
                </div>

                {/* Features Grid */}
                <div className="grid md:grid-cols-3 gap-8 mt-24">
                    <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-8">
                        <div className="w-12 h-12 bg-blue-600/10 rounded-xl flex items-center justify-center mb-4">
                            <Zap className="w-6 h-6 text-blue-500" />
                        </div>
                        <h3 className="text-xl font-semibold text-white mb-2">Push Sessions</h3>
                        <p className="text-gray-400">
                            Detecção automática de sessões de push com estatísticas detalhadas e alertas inteligentes.
                        </p>
                    </div>

                    <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-8">
                        <div className="w-12 h-12 bg-purple-600/10 rounded-xl flex items-center justify-center mb-4">
                            <Target className="w-6 h-6 text-purple-500" />
                        </div>
                        <h3 className="text-xl font-semibold text-white mb-2">Metas Personalizadas</h3>
                        <p className="text-gray-400">
                            Defina e acompanhe suas metas de troféus com progresso em tempo real.
                        </p>
                    </div>

                    <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-8">
                        <div className="w-12 h-12 bg-green-600/10 rounded-xl flex items-center justify-center mb-4">
                            <BarChart3 className="w-6 h-6 text-green-500" />
                        </div>
                        <h3 className="text-xl font-semibold text-white mb-2">Analytics Avançados</h3>
                        <p className="text-gray-400">
                            Visualize padrões, identifique pontos fortes e melhore seu desempenho.
                        </p>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="container mx-auto px-6 py-8 mt-24 border-t border-gray-800">
                <div className="text-center text-gray-500">
                    <p>© 2024 CR Status. Powered by Supabase.</p>
                </div>
            </footer>
        </div>
    );
}
