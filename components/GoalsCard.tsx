import { useState, useEffect } from 'react';
import { Trophy, Target, CheckCircle2, Lock, Plus, Trash2 } from 'lucide-react';
import { Battle } from '@/lib/types';
import ProFeatureGate from '@/components/ProFeatureGate';
import { PlayerGoal, loadGoals, saveGoals, addGoal, deleteGoal, getDefaultGoals } from '@/lib/goalsStorage';
import { trackEvent } from '@/lib/analytics';

interface GoalsCardProps {
    battles: Battle[];
    currentTrophies: number;
    playerTag: string;
}

export default function GoalsCard({ battles, currentTrophies, playerTag }: GoalsCardProps) {
    const [goals, setGoals] = useState<PlayerGoal[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);

    // Load goals on mount
    useEffect(() => {
        if (!playerTag) return;

        const savedGoals = loadGoals(playerTag);
        if (savedGoals.length === 0) {
            const defaults = getDefaultGoals(currentTrophies) as any[]; // Cast to any to avoid strict type issues with Omit
            // Initialize with defaults
            const initialized = defaults.map(g => addGoal(playerTag, g));
            setGoals(initialized);
        } else {
            setGoals(savedGoals);
        }
        setIsLoaded(true);
    }, [playerTag, currentTrophies]);

    const nextLeague = Math.ceil((currentTrophies + 1) / 1000) * 1000;
    const leagueProgress = ((currentTrophies % 1000) / 1000) * 100;

    const dailyWins = battles.filter(b => {
        if (!b.team || !b.team[0] || !b.opponent || !b.opponent[0]) return false;
        const isWin = b.team[0].crowns > b.opponent[0].crowns;
        const isToday = new Date(b.battleTime).toDateString() === new Date().toDateString();
        return isWin && isToday;
    }).length;

    const handleDeleteGoal = (goalId: string) => {
        if (deleteGoal(playerTag, goalId)) {
            setGoals(prev => prev.filter(g => g.id !== goalId));
            trackEvent('goal_delete', { goalId });
        }
    };

    const [showAddModal, setShowAddModal] = useState(false);
    const [newGoalLabel, setNewGoalLabel] = useState('');
    const [newGoalTarget, setNewGoalTarget] = useState('');

    const handleAddGoal = () => {
        if (!newGoalLabel || !newGoalTarget) return;

        const target = parseInt(newGoalTarget);
        if (isNaN(target)) return;

        const newGoal = addGoal(playerTag, {
            label: newGoalLabel,
            target: target,
            current: 0, // Default starting point, could be improved to auto-detect based on type
            type: 'custom'
        });

        setGoals(prev => [...prev, newGoal]);
        trackEvent('goal_create', { label: newGoalLabel });

        // Reset and close
        setNewGoalLabel('');
        setNewGoalTarget('');
        setShowAddModal(false);
    };

    if (!isLoaded) return null;

    return (
        <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6 relative">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                        <Target className="w-5 h-5 text-green-400" />
                    </div>
                    <h3 className="text-lg font-medium text-white">Metas e Objetivos</h3>
                </div>
                <button
                    onClick={() => setShowAddModal(true)}
                    className="p-2 hover:bg-gray-800 rounded-lg transition-colors text-gray-400 hover:text-white"
                    title="Adicionar Meta"
                >
                    <Plus className="w-5 h-5" />
                </button>
            </div>

            <div className="space-y-6">
                {/* League Goal (Always visible) */}
                <div>
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-400">Próxima Liga</span>
                        <span className="text-sm font-medium text-white">{currentTrophies} / {nextLeague}</span>
                    </div>
                    <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-green-500 rounded-full transition-all duration-500"
                            style={{ width: `${leagueProgress}%` }}
                        />
                    </div>
                </div>

                {/* Daily Wins Goal (Always visible) */}
                <div className="flex items-center justify-between p-3 bg-gray-800/30 rounded-xl border border-gray-800">
                    <div className="flex items-center gap-3">
                        <CheckCircle2 className={`w-5 h-5 ${dailyWins >= 5 ? 'text-green-500' : 'text-gray-600'}`} />
                        <span className="text-sm text-gray-300">5 Vitórias Diárias</span>
                    </div>
                    <span className="text-sm font-medium text-white">{Math.min(dailyWins, 5)}/5</span>
                </div>

                {/* Custom Goals (Persisted) */}
                {goals.filter(g => g.type === 'custom').map(goal => (
                    <div key={goal.id} className="flex items-center justify-between p-3 bg-gray-800/30 rounded-xl border border-gray-800 group">
                        <div className="flex items-center gap-3">
                            <Target className="w-5 h-5 text-blue-400" />
                            <span className="text-sm text-gray-300">{goal.label}</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="text-sm font-medium text-white">{goal.current}/{goal.target}</span>
                            <button
                                onClick={() => handleDeleteGoal(goal.id)}
                                className="opacity-0 group-hover:opacity-100 transition-opacity text-red-400 hover:text-red-300"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                ))}

                {/* PRO Goals */}
                <ProFeatureGate label="Crie metas personalizadas ilimitadas com o plano PRO.">
                    <div className="space-y-3 opacity-50 pointer-events-none">
                        <div className="flex items-center justify-between p-3 bg-gray-800/30 rounded-xl border border-gray-700 border-dashed">
                            <div className="flex items-center gap-3">
                                <Lock className="w-4 h-4 text-yellow-500" />
                                <span className="text-sm text-gray-300">Chegar a 7000 Troféus</span>
                            </div>
                            <span className="text-xs text-yellow-500 font-medium">PRO</span>
                        </div>
                    </div>
                </ProFeatureGate>
            </div>

            {/* Add Goal Modal */}
            {showAddModal && (
                <div className="absolute inset-0 bg-gray-900/95 backdrop-blur-sm rounded-2xl flex items-center justify-center z-20 p-6">
                    <div className="w-full space-y-4">
                        <h4 className="text-white font-medium mb-4">Nova Meta</h4>

                        <div>
                            <label className="text-xs text-gray-500 mb-1 block">Nome da Meta</label>
                            <input
                                type="text"
                                value={newGoalLabel}
                                onChange={(e) => setNewGoalLabel(e.target.value)}
                                placeholder="Ex: Chegar na Arena 15"
                                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
                            />
                        </div>

                        <div>
                            <label className="text-xs text-gray-500 mb-1 block">Alvo (Número)</label>
                            <input
                                type="number"
                                value={newGoalTarget}
                                onChange={(e) => setNewGoalTarget(e.target.value)}
                                placeholder="Ex: 5000"
                                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
                            />
                        </div>

                        <div className="flex gap-2 pt-2">
                            <button
                                onClick={() => setShowAddModal(false)}
                                className="flex-1 px-3 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg text-sm transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleAddGoal}
                                disabled={!newGoalLabel || !newGoalTarget}
                                className="flex-1 px-3 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg text-sm transition-colors font-medium"
                            >
                                Criar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
