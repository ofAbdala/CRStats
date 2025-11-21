import { Lightbulb, AlertTriangle, TrendingUp, TrendingDown, Trophy, Target, Zap, Crown, Shield } from 'lucide-react';
import { motion } from 'framer-motion';
import { analyzeTilt } from '@/lib/tilt_analysis';
import { Battle } from '@/lib/types';

interface RuleBasedInsightsCardProps {
    insights: string[];
    battles?: Battle[];
}

interface CategorizedInsight {
    text: string;
    icon: React.ComponentType<any>;
    color: string;
    bgColor: string;
}

export default function RuleBasedInsightsCard({ insights, battles }: RuleBasedInsightsCardProps) {
    const tiltAlert = battles ? analyzeTilt(battles) : null;

    // Categorize insights by emoji/type
    const categorizeInsight = (insight: string): CategorizedInsight => {
        if (insight.includes('📈') || insight.includes('🔥') || insight.includes('✨')) {
            return { text: insight, icon: TrendingUp, color: 'text-green-400', bgColor: 'bg-green-500/10' };
        } else if (insight.includes('📉') || insight.includes('⚠️') || insight.includes('⏸️')) {
            return { text: insight, icon: AlertTriangle, color: 'text-yellow-400', bgColor: 'bg-yellow-500/10' };
        } else if (insight.includes('🏆') || insight.includes('🎯')) {
            return { text: insight, icon: Trophy, color: 'text-blue-400', bgColor: 'bg-blue-500/10' };
        } else if (insight.includes('🃏')) {
            return { text: insight, icon: Target, color: 'text-purple-400', bgColor: 'bg-purple-500/10' };
        } else if (insight.includes('👑')) {
            return { text: insight, icon: Crown, color: 'text-yellow-400', bgColor: 'bg-yellow-500/10' };
        } else if (insight.includes('🛡️')) {
            return { text: insight, icon: Shield, color: 'text-gray-400', bgColor: 'bg-gray-500/10' };
        } else {
            return { text: insight, icon: Lightbulb, color: 'text-blue-400', bgColor: 'bg-blue-500/10' };
        }
    };

    const categorizedInsights = insights.map(categorizeInsight);

    return (
        <div className="bg-gray-900/50 border border-gray-800 p-6 rounded-2xl">
            <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-yellow-500/20 flex items-center justify-center">
                    <Lightbulb className="w-5 h-5 text-yellow-400" />
                </div>
                <h3 className="text-lg font-medium text-white">Insights do Treinador</h3>
                {insights.length > 0 && (
                    <span className="ml-auto text-xs bg-blue-500/20 text-blue-300 px-2 py-1 rounded-full">
                        {insights.length} {insights.length === 1 ? 'insight' : 'insights'}
                    </span>
                )}
            </div>

            <div className="space-y-3">
                {/* Tilt Alert */}
                {tiltAlert && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`p-4 rounded-xl border ${tiltAlert.severity === 'high'
                                ? 'bg-red-500/10 border-red-500/30'
                                : 'bg-orange-500/10 border-orange-500/30'
                            }`}
                    >
                        <div className="flex items-start gap-3">
                            <AlertTriangle
                                className={`w-5 h-5 mt-0.5 ${tiltAlert.severity === 'high' ? 'text-red-400' : 'text-orange-400'
                                    }`}
                            />
                            <div>
                                <h4
                                    className={`text-sm font-bold mb-1 ${tiltAlert.severity === 'high' ? 'text-red-400' : 'text-orange-400'
                                        }`}
                                >
                                    {tiltAlert.severity === 'high' ? 'ALERTA CRÍTICO' : 'Atenção'}
                                </h4>
                                <p className="text-sm text-gray-300">{tiltAlert.message}</p>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* Categorized Insights */}
                {categorizedInsights.map((insight, index) => {
                    const Icon = insight.icon;
                    return (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className={`flex items-start gap-3 p-4 ${insight.bgColor} rounded-xl border border-${insight.color.replace('text-', '')}/20`}
                        >
                            <Icon className={`w-5 h-5 mt-0.5 ${insight.color} shrink-0`} />
                            <p className="text-sm text-gray-200 leading-relaxed">
                                {insight.text}
                            </p>
                        </motion.div>
                    );
                })}

                {/* Empty State */}
                {insights.length === 0 && !tiltAlert && (
                    <div className="text-center py-8 text-gray-500 text-sm">
                        <Lightbulb className="w-12 h-12 mx-auto mb-3 opacity-20" />
                        <p>Jogue mais partidas para receber insights personalizados.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
