'use client';

function rowColor(result: string) {
  return result === 'WIN' ? 'bg-emerald-900/20'
       : result === 'LOSS' ? 'bg-rose-900/20'
       : 'bg-zinc-800/20';
}

export default function BattleHistory({ battles }: { battles: any[] }) {
  return (
    <div className="bg-card-dark border border-border-dark rounded-xl p-4">
      <div className="font-semibold mb-3">Histórico de Partidas</div>
      <div className="space-y-2">
        {battles.map((b, i) => (
          <div key={i} className={`rounded-lg border border-border-dark p-3 flex items-center justify-between ${rowColor(b.result)}`}>
            <div>
              <div className="font-semibold text-sm">{b.result}</div>
              <div className="text-xs text-gray-400">vs {b.opponentName} • {b.gameMode}</div>
            </div>
            <div className="flex items-center gap-4 text-sm">
              <div className={b.trophyChange >= 0 ? 'text-emerald-400' : 'text-rose-400'}>
                {b.trophyChange >= 0 ? '+' : ''}{b.trophyChange}
              </div>
              <div className="text-gray-400">{new Date(b.battleTime + 'Z').toLocaleString()}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}