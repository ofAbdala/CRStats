'use client';

import { useState, useMemo } from 'react';
import { Battle } from '@/lib/types';
import QuickSummaryCard from './battles/QuickSummaryCard';
import SessionGroup from './battles/SessionGroup';
import BattleList from './battles/BattleList';
import { Calendar, Layers, Filter } from 'lucide-react';
import { buildQuickSummary } from '@/lib/stats';
import { detectSessions } from '@/lib/sessionDetector';
import { trackEvent } from '@/lib/analytics';

interface BattleHistoryProps {
  battles: Battle[];
}

type PeriodFilter = 'today' | '3d' | '7d' | 'season';

export default function BattleHistory({ battles }: BattleHistoryProps) {
  const [showGrouped, setShowGrouped] = useState(true);
  const [period, setPeriod] = useState<PeriodFilter>('7d');

  // Filter battles based on selected period
  const filteredBattles = useMemo(() => {
    const now = new Date();
    return battles.filter(b => {
      const battleDate = new Date(b.battleTime);
      const diffTime = Math.abs(now.getTime() - battleDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      switch (period) {
        case 'today':
          return battleDate.toDateString() === now.toDateString();
        case '3d':
          return diffDays <= 3;
        case '7d':
          return diffDays <= 7;
        case 'season':
          // Simplified season logic: first Monday of current month
          // For now, just return last 30 days as approximation if season logic is complex
          return diffDays <= 30;
        default:
          return true;
      }
    });
  }, [battles, period]);

  // Detect sessions automatically from filtered battles
  const { sessions, singles } = useMemo(() => detectSessions(filteredBattles), [filteredBattles]);

  const summary = useMemo(() => buildQuickSummary(filteredBattles), [filteredBattles]);

  const handleViewModeChange = (mode: 'session' | 'chronological') => {
    setShowGrouped(mode === 'session');
    trackEvent('history_view_mode_change', { mode });
  };

  const handlePeriodChange = (newPeriod: PeriodFilter) => {
    setPeriod(newPeriod);
    trackEvent('history_period_change', { period: newPeriod });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            Histórico de Batalhas
            <span className="text-sm font-normal text-gray-500 bg-gray-900 px-2 py-0.5 rounded-full">
              {filteredBattles.length}
            </span>
          </h2>

          <div className="flex flex-wrap gap-2">
            {/* Period Filter */}
            <div className="flex items-center gap-1 bg-gray-900/50 p-1 rounded-xl border border-gray-800">
              {(['today', '3d', '7d', 'season'] as PeriodFilter[]).map((p) => (
                <button
                  key={p}
                  onClick={() => handlePeriodChange(p)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${period === p
                    ? 'bg-gray-700 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800'
                    }`}
                >
                  {p === 'today' ? 'Hoje' : p === '3d' ? '3 Dias' : p === '7d' ? '7 Dias' : 'Temporada'}
                </button>
              ))}
            </div>

            {/* Toggle View */}
            <div className="flex items-center gap-1 bg-gray-900/50 p-1 rounded-xl border border-gray-800">
              <button
                onClick={() => handleViewModeChange('session')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1 ${showGrouped
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
                  }`}
              >
                <Layers className="w-3 h-3" />
                Por Sessão
              </button>
              <button
                onClick={() => handleViewModeChange('chronological')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1 ${!showGrouped
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
                  }`}
              >
                <Calendar className="w-3 h-3" />
                Cronológico
              </button>
            </div>
          </div>
        </div>
      </div>

      <QuickSummaryCard summary={summary} />

      {/* Session View */}
      {showGrouped ? (
        <div className="space-y-6">
          {/* Active/Recent Pushes Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-purple-500" />
              Pushes Ativos
            </h3>

            {sessions.filter(s => s.isActive).length > 0 ? (
              <div className="space-y-4">
                {sessions.filter(s => s.isActive).map(session => (
                  <SessionGroup key={session.id} session={session} />
                ))}
              </div>
            ) : (
              <div className="bg-gray-900/30 border border-gray-800 rounded-2xl p-6 text-center">
                <div className="w-12 h-12 bg-purple-500/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Layers className="w-6 h-6 text-purple-500" />
                </div>
                <p className="text-gray-400 mb-1">Nenhum push ativo no momento</p>
                <p className="text-sm text-gray-500">Jogue 3+ partidas em menos de 30 minutos para iniciar um push</p>
              </div>
            )}
          </div>

          {/* Historical Pushes Section */}
          {sessions.filter(s => !s.isActive).length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-500" />
                Histórico de Pushes
              </h3>
              <div className="space-y-4">
                {sessions.filter(s => !s.isActive).map(session => (
                  <SessionGroup key={session.id} session={session} />
                ))}
              </div>
            </div>
          )}

          {/* All Sessions Empty State */}
          {sessions.length === 0 && (
            <div className="space-y-4">
              <div className="bg-gray-900/30 border border-gray-800 rounded-2xl p-8 text-center">
                <Layers className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <h4 className="text-xl font-semibold text-white mb-2">Nenhuma sessão de push detectada</h4>
                <p className="text-gray-400 mb-4">Jogue pelo menos 3 partidas em menos de 30 minutos para criar uma sessão</p>
                <div className="bg-gray-800/50 rounded-lg p-4 max-w-md mx-auto">
                  <p className="text-sm text-gray-500 mb-2">💡 Dica: Pushes são detectados quando você joga:</p>
                  <ul className="text-sm text-gray-400 text-left list-disc list-inside space-y-1">
                    <li>3 ou mais partidas seguidas</li>
                    <li>Com menos de 30 minutos entre cada uma</li>
                    <li>Pushes ativos = últimas 2 horas</li>
                  </ul>
                </div>
              </div>

              {/* Show chronological battles when no sessions */}
              {filteredBattles.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-gray-500" />
                    Histórico Cronológico
                  </h3>
                  <BattleList battles={filteredBattles} />
                </div>
              )}
            </div>
          )}

          {/* Ungrouped Battles */}
          {singles.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Filter className="w-5 h-5 text-gray-500" />
                Batalhas Avulsas
              </h3>
              <div className="border border-gray-800 rounded-2xl p-4 bg-gray-900/30">
                <p className="text-sm text-gray-500 mb-3">
                  Batalhas que não formaram push (menos de 3 partidas ou gaps maiores que 30min)
                </p>
                <BattleList battles={singles} />
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Chronological View */
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Calendar className="w-5 h-5 text-blue-500" />
            Visualização Cronológica
          </h3>
          <BattleList battles={filteredBattles} />
        </div>
      )}
    </div>
  );
}