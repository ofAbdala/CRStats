'use client';

function fmt(ms: number) {
  if (!ms || ms < 0) return '—';
  const s = Math.floor(ms / 1000);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  return `${h}h ${m}m`;
}

export default function CurrentPush({ summary }: { summary: any }) {
  return (
    <div className="bg-card-dark border border-border-dark rounded-xl p-4">
      <div className="font-semibold mb-2">Push Atual</div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
        <div><div className="text-gray-400 text-xs">Partidas</div><div className="text-xl font-bold">{summary.matchesTotal}</div></div>
        <div><div className="text-gray-400 text-xs">Vitórias</div><div className="text-xl font-bold text-emerald-400">{summary.wins}</div></div>
        <div><div className="text-gray-400 text-xs">Derrotas</div><div className="text-xl font-bold text-rose-400">{summary.losses}</div></div>
        <div><div className="text-gray-400 text-xs">Duração</div><div className="text-xl font-bold">{fmt(summary.pushDurationMs)}</div></div>
      </div>
    </div>
  );
}