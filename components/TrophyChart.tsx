'use client';

import { useState } from 'react';
import { parseClashTime } from '@/lib/time';
import dynamic from 'next/dynamic';
import { formatDateTime } from '@/lib/time';
const ReLineChart = dynamic(() => import('./_TrophyChartImpl'), { ssr: false });

type Period = '60D' | '30D' | '15D' | '6D' | 'Today';
export default function TrophyChart({ series, battles, player }: { series: any[]; battles?: any[]; player?: any }) {
  const [selectedPeriod, setSelectedPeriod] = useState<Period>('15D');

  // Reconstrói série de troféus baseado no período selecionado
  const getFilteredData = () => {
    if (!battles || battles.length === 0 || !player) return series;

    const now = new Date();
    let cutoffDate: Date;

    switch (selectedPeriod) {
      case '60D':
        cutoffDate = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);
        break;
      case '30D':
        cutoffDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case '15D':
        cutoffDate = new Date(now.getTime() - 15 * 24 * 60 * 60 * 1000);
        break;
      case '6D':
        cutoffDate = new Date(now.getTime() - 6 * 24 * 60 * 60 * 1000);
        break;
      case 'Today':
        cutoffDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        break;
      default:
        return series;
    }

    // Filtra batalhas pelo período
    const filteredBattles = battles
      .filter(battle => {
        const battleDate = parseClashTime(battle.battleTime);
        return battleDate && battleDate >= cutoffDate;
      })
      .sort((a, b) => {
        const dateA = parseClashTime(a.battleTime);
        const dateB = parseClashTime(b.battleTime);
        if (!dateA || !dateB) return 0;
        return dateA.getTime() - dateB.getTime(); // Mais antiga primeiro
      });

    if (filteredBattles.length === 0) return [];

    // Reconstrói série de troféus para o período
    let currentTrophies = player.trophies;
    
    // Calcula troféus no início do período (subtrai mudanças das batalhas)
    for (const battle of filteredBattles.reverse()) {
      currentTrophies -= (battle.trophyChange || 0);
    }
    
    // Reordena para mais antiga primeiro
    filteredBattles.reverse();
    
    const newSeries = [];
    let trophies = currentTrophies;
    
    // Adiciona ponto inicial se não for "Today"
    if (selectedPeriod !== 'Today') {
      newSeries.push({
        label: formatDateTime(filteredBattles[0]?.battleTime, { 
          day: '2-digit',
          month: '2-digit',
          hour: '2-digit',
          minute: '2-digit'
        }),
        trophies: trophies
      });
    }
    
    // Adiciona pontos para cada batalha
    filteredBattles.forEach(battle => {
      trophies += (battle.trophyChange || 0);
      
      // Formato do label baseado no período
      let label;
      if (selectedPeriod === 'Today') {
        // Para hoje, mostra apenas horário
        label = formatDateTime(battle.battleTime, { 
          dateStyle: undefined,
          timeStyle: 'short'
        });
      } else {
        // Para outros períodos, mostra dia/mês
        label = formatDateTime(battle.battleTime, { 
          day: '2-digit',
          month: '2-digit',
          timeStyle: undefined
        });
      }
      
      newSeries.push({
        label: label,
        trophies: trophies
      });
    });

    return newSeries;
  };

  const periods: { value: Period; label: string }[] = [
    { value: '60D', label: '60 Dias' },
    { value: '30D', label: '30 Dias' },
    { value: '15D', label: '15 Dias' },
    { value: '6D', label: '6 Dias' },
    { value: 'Today', label: 'Hoje' }
  ];

  return (
    <div className="glass-dark float p-4 sm:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4 sm:mb-6">
        <div className="w-10 sm:w-12 h-10 sm:h-12 bg-gradient-to-br from-gold/80 to-yellow-500/80 rounded-xl sm:rounded-2xl flex items-center justify-center">
          <span className="text-white font-bold text-base sm:text-lg">📊</span>
        </div>
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white">Progresso de Troféus</h2>
          <p className="text-sm sm:text-base text-white/70">Evolução no período selecionado</p>
        </div>
      </div>
      
      {/* Period Selector */}
      <div className="mb-4 sm:mb-6">
        <div className="text-xs sm:text-sm text-white/70 mb-2 sm:mb-3">Período:</div>
        <div className="flex flex-wrap items-center gap-2">
        {periods.map((period) => (
          <button
            key={period.value}
            onClick={() => setSelectedPeriod(period.value)}
            className={`px-3 sm:px-3 py-2 sm:py-1.5 text-xs sm:text-sm font-medium rounded-lg transition-all duration-200 ${
              selectedPeriod === period.value
                ? 'bg-cyan-500 text-white shadow-lg'
                : 'bg-white/10 text-white/70 hover:bg-white/20 hover:text-white'
            }`}
          >
            {period.label}
          </button>
        ))}
        </div>
      </div>
      
      <div className="h-56 sm:h-64 glass rounded-xl sm:rounded-2xl p-3 sm:p-4">
        <ReLineChart data={getFilteredData()} />
      </div>
      
      {/* Chart Stats */}
      <div className="grid grid-cols-3 gap-2 sm:gap-4 mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-white/10">
        <div className="text-center">
          <div className="text-sm sm:text-lg font-bold text-cyan-400">{getFilteredData().length}</div>
          <div className="text-xs text-white/60">Pontos no gráfico</div>
        </div>
        <div className="text-center">
          <div className="text-sm sm:text-lg font-bold text-emerald-400">
            {getFilteredData().length > 1 
              ? getFilteredData()[getFilteredData().length - 1]?.trophies - getFilteredData()[0]?.trophies 
              : 0}
          </div>
          <div className="text-xs text-white/60">Variação</div>
        </div>
        <div className="text-center">
          <div className="text-sm sm:text-lg font-bold text-gold">
            {getFilteredData().length > 0 
              ? Math.max(...getFilteredData().map(d => d.trophies))
              : 0}
          </div>
          <div className="text-xs text-white/60">Pico</div>
        </div>
      </div>
    </div>
  );
}