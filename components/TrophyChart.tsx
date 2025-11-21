'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, Filter, TrendingUp, Target, Award } from 'lucide-react';
import { parseClashTime, formatDateTime } from '@/lib/time';
import { fadeInUp, cardHover } from '@/utils/animations';
import dynamic from 'next/dynamic';

const ReLineChart = dynamic(() => import('./_TrophyChartImpl'), { ssr: false });

type Period = '60D' | '30D' | '15D' | '6D' | 'Today';

export default function TrophyChart({ series, battles, player }: { series: any[]; battles?: any[]; player?: any }) {
  const [selectedPeriod, setSelectedPeriod] = useState<Period>('15D');

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

    const filteredBattles = battles
      .filter(battle => {
        const battleDate = parseClashTime(battle.battleTime);
        return battleDate && battleDate >= cutoffDate;
      })
      .sort((a, b) => {
        const dateA = parseClashTime(a.battleTime);
        const dateB = parseClashTime(b.battleTime);
        if (!dateA || !dateB) return 0;
        return dateA.getTime() - dateB.getTime();
      });

    if (filteredBattles.length === 0) return [];

    let currentTrophies = player.trophies;

    for (const battle of filteredBattles.reverse()) {
      currentTrophies -= (battle.trophyChange || 0);
    }

    filteredBattles.reverse();

    const newSeries = [];
    let trophies = currentTrophies;

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

    filteredBattles.forEach(battle => {
      trophies += (battle.trophyChange || 0);

      let label;
      if (selectedPeriod === 'Today') {
        label = formatDateTime(battle.battleTime, {
          dateStyle: undefined,
          timeStyle: 'short'
        });
      } else {
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
    { value: '60D', label: '60D' },
    { value: '30D', label: '30D' },
    { value: '15D', label: '15D' },
    { value: '6D', label: '6D' },
    { value: 'Today', label: 'Hoje' }
  ];

  const chartData = getFilteredData();
  const hasVariation = chartData.length > 1 ? chartData[chartData.length - 1]?.trophies - chartData[0]?.trophies : 0;
  const peakTrophies = chartData.length > 0 ? Math.max(...chartData.map(d => d.trophies)) : 0;

  return (
    <motion.div
      initial={fadeInUp.initial}
      animate={fadeInUp.animate}
      transition={fadeInUp.transition}
      whileHover={cardHover}
      className="premium-gradient border border-gray-800 p-8 rounded-3xl card-glow gpu-accelerated group"
    >
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <motion.div
            className="w-12 h-12 bg-gray-900 rounded-2xl flex items-center justify-center group-hover:bg-gray-800 transition-all duration-300"
            whileHover={{ scale: 1.1, rotate: 5 }}
          >
            <BarChart3 className="w-7 h-7 text-white" />
          </motion.div>
          <div>
            <h2 className="text-2xl font-medium text-white group-hover:text-glow transition-all duration-300">
              Performance Analytics
            </h2>
            <p className="text-gray-400 font-light">Evolução premium de troféus</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Filter className="w-5 h-5 text-gray-400" />
          <div className="flex items-center gap-2">
            {periods.map((period) => (
              <motion.button
                key={period.value}
                onClick={() => setSelectedPeriod(period.value)}
                className={`px-4 py-2 text-sm font-medium rounded-xl transition-all duration-300 gpu-accelerated ${selectedPeriod === period.value
                    ? 'bg-white text-black button-glow'
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white border border-gray-700'
                  }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {period.label}
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="h-80 glass-premium rounded-3xl p-6 mb-8 glow-effect"
      >
        <ReLineChart data={chartData} />
      </motion.div>

      {/* Chart Statistics Premium */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        className="grid grid-cols-3 gap-8 pt-8 border-t border-gray-800"
      >
        <div className="text-center">
          <div className="text-xl font-light text-blue-400 mb-2 group-hover:text-glow transition-all duration-300">
            {chartData.length}
          </div>
          <div className="text-gray-400 text-sm font-light">Data Points</div>
        </div>
        <div className="text-center">
          <div className={`text-xl font-light mb-2 group-hover:text-glow transition-all duration-300 ${hasVariation >= 0 ? 'text-green-400' : 'text-red-400'
            }`}>
            {hasVariation >= 0 ? '+' : ''}{hasVariation}
          </div>
          <div className="text-gray-400 text-sm font-light">Variação</div>
        </div>
        <div className="text-center">
          <div className="text-xl font-light text-yellow-400 mb-2 group-hover:text-glow transition-all duration-300">
            {peakTrophies.toLocaleString()}
          </div>
          <div className="text-gray-400 text-sm font-light">Peak Elite</div>
        </div>
      </motion.div>
    </motion.div>
  );
}