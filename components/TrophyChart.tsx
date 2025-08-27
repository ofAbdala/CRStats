'use client';

import dynamic from 'next/dynamic';
const ReLineChart = dynamic(() => import('./_TrophyChartImpl'), { ssr: false });

export default function TrophyChart({ series }: { series: any[] }) {
  return (
    <div className="bg-card-dark border border-border-dark rounded-xl p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-br from-gold to-yellow-500 rounded-xl flex items-center justify-center">
          <span className="text-black font-bold">📊</span>
        </div>
        <div>
          <h2 className="font-bold text-lg text-white">Progresso de Troféus</h2>
          <p className="text-sm text-gray-400">Evolução durante a sessão</p>
        </div>
      </div>
      
      <div className="h-64 bg-bg-dark/30 rounded-lg p-4">
        <ReLineChart data={series} />
      </div>
    </div>
  );
}