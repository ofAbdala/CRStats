'use client';

import dynamic from 'next/dynamic';
const ReLineChart = dynamic(() => import('./_TrophyChartImpl'), { ssr: false });

export default function TrophyChart({ series }: { series: any[] }) {
  return (
    <div className="glass-dark float p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-gradient-to-br from-gold/80 to-yellow-500/80 rounded-2xl flex items-center justify-center">
          <span className="text-white font-bold text-lg">📊</span>
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white">Progresso de Troféus</h2>
          <p className="text-white/70">Evolução durante a sessão</p>
        </div>
      </div>
      
      <div className="h-64 glass rounded-2xl p-4">
        <ReLineChart data={series} />
      </div>
    </div>
  );
}