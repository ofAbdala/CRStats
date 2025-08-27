'use client';

import dynamic from 'next/dynamic';
const ReLineChart = dynamic(() => import('./_TrophyChartImpl'), { ssr: false });

export default function TrophyChart({ series }: { series: any[] }) {
  return (
    <div className="bg-card-dark border border-border-dark rounded-xl p-4">
      <div className="font-semibold mb-2 text-gold">Progresso de Troféus</div>
      <div className="h-56">
        <ReLineChart data={series} />
      </div>
    </div>
  );
}