'use client';

import { useState } from 'react';
import { parseClashTime } from '@/lib/time';
import dynamic from 'next/dynamic';
const ReLineChart = dynamic(() => import('./_TrophyChartImpl'), { ssr: false });

type Period = '60D' | '30D' | '15D' | '6D' | 'Today';
export default function TrophyChart({ series, battles }: { series: any[]; battles?: any[] }) {
  const [selectedPeriod, setSelectedPeriod] = useState<Period>('15D');

  // Filtra dados baseado no período selecionado
  const getFilteredData = () => {
    if (!battles || battles.length === 0) return series;

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

    // Filtra séries baseado na data de corte
    const filteredSeries = series.filter(point => {
      // Tenta extrair a data do label da série
      const battle = battles.find(b => {
        const battleDate = parseClashTime(b.battleTime);
        if (!battleDate) return false;
        const battleLabel = battleDate.toLocaleString('pt-BR', {
          day: '2-digit',
          month: '2-digit',
          hour: '2-digit',
          minute: '2-digit'
        });
        return point.label === battleLabel;
      });
      
      if (battle) {
        const battleDate = parseClashTime(battle.battleTime);
        return battleDate && battleDate >= cutoffDate;
      }
      
      return true; // Mantém pontos que não conseguimos associar
    });

    return filteredSeries.length > 0 ? filteredSeries : series;
  };

  const periods: { value: Period; label: string }[] = [
    { value: '60D', label: '60 Dias' },
    { value: '30D', label: '30 Dias' },
    { value: '15D', label: '15 Dias' },
    { value: '6D', label: '6 Dias' },
    { value: 'Today', label: 'Hoje' }
  ];

  return (
    <div className="glass-dark float p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-gradient-to-br from-gold/80 to-yellow-500/80 rounded-2xl flex items-center justify-center">
          <span className="text-white font-bold text-lg">📊</span>
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white">Progresso de Troféus</h2>
          <p className="text-white/70">Evolução no período selecionado</p>
        </div>
      </div>
      
      {/* Period Selector */}
      <div className="flex items-center gap-2 mb-6">
        <span className="text-sm text-white/70 mr-2">Período:</span>
        {periods.map((period) => (
          <button
            key={period.value}
            onClick={() => setSelectedPeriod(period.value)}
            className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-all duration-200 ${
              selectedPeriod === period.value
                ? 'bg-cyan-500 text-white shadow-lg'
                : 'bg-white/10 text-white/70 hover:bg-white/20 hover:text-white'
            }`}
          >
            {period.label}
          </button>
        ))}
      </div>
      
      <div className="h-64 glass rounded-2xl p-4">
        <ReLineChart data={getFilteredData()} />
      </div>
      
      {/* Chart Stats */}
      <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-white/10">
        <div className="text-center">
          <div className="text-lg font-bold text-cyan-400">{getFilteredData().length}</div>
          <div className="text-xs text-white/60">Pontos no gráfico</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-emerald-400">
            {getFilteredData().length > 1 
              ? getFilteredData()[getFilteredData().length - 1]?.trophies - getFilteredData()[0]?.trophies 
              : 0}
          </div>
          <div className="text-xs text-white/60">Variação no período</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-gold">
            {getFilteredData().length > 0 
              ? Math.max(...getFilteredData().map(d => d.trophies))
              : 0}
          </div>
          <div className="text-xs text-white/60">Pico no período</div>
        </div>
      </div>
    </div>
  );
}