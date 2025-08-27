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
    <div className="bg-card-dark border border-border-dark rounded-xl p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-br from-royal to-purple rounded-xl flex items-center justify-center">
          <span className="text-white font-bold">⚔️</span>
        </div>
        <div>
          <h2 className="font-bold text-lg text-white">Sessão Atual</h2>
          <p className="text-sm text-gray-400">Estatísticas da sessão de jogo</p>
        </div>
      </div>
      
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-bg-dark/50 rounded-lg p-4 border border-border-dark/50">
          <div className="text-gray-400 text-xs uppercase tracking-wider mb-2">Total</div>
          <div className="text-2xl font-bold text-white">{summary.matchesTotal}</div>
          <div className="text-xs text-gray-500">partidas</div>
        </div>
        
        <div className="bg-emerald-900/20 rounded-lg p-4 border border-emerald-900/30">
          <div className="text-emerald-300 text-xs uppercase tracking-wider mb-2">Vitórias</div>
          <div className="text-2xl font-bold text-emerald-400">{summary.wins}</div>
          <div className="text-xs text-emerald-300">{summary.matchesTotal > 0 ? Math.round((summary.wins / summary.matchesTotal) * 100) : 0}%</div>
        </div>
        
        <div className="bg-rose-900/20 rounded-lg p-4 border border-rose-900/30">
          <div className="text-rose-300 text-xs uppercase tracking-wider mb-2">Derrotas</div>
          <div className="text-2xl font-bold text-rose-400">{summary.losses}</div>
          <div className="text-xs text-rose-300">{summary.matchesTotal > 0 ? Math.round((summary.losses / summary.matchesTotal) * 100) : 0}%</div>
        </div>
        
        <div className="bg-zinc-800/20 rounded-lg p-4 border border-zinc-700/30">
          <div className="text-gray-400 text-xs uppercase tracking-wider mb-2">Duração</div>
          <div className="text-2xl font-bold text-gold">{fmt(summary.pushDurationMs)}</div>
          <div className="text-xs text-gray-500">tempo jogado</div>
        </div>
      </div>
    </div>
  );
}