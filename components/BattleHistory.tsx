'use client';

function rowColor(result: string) {
  return result === 'WIN' ? 'bg-emerald-900/20 border-emerald-900/30'
       : result === 'LOSS' ? 'bg-rose-900/20 border-rose-900/30'
       : 'bg-zinc-800/20 border-zinc-700/30';
}

export default function BattleHistory({ battles }: { battles: any[] }) {
  return (
    <div className="bg-card-dark border border-border-dark rounded-xl p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-br from-purple to-indigo-600 rounded-xl flex items-center justify-center">
          <span className="text-white font-bold">⚔️</span>
        </div>
        <div>
          <h2 className="font-bold text-lg text-white">Histórico de Batalhas</h2>
          <p className="text-sm text-gray-400">Últimas {battles.length} partidas</p>
        </div>
      </div>
      
      <div className="space-y-3">
        {battles.map((b, i) => (
          <div key={i} className={`rounded-lg border p-4 flex items-center justify-between hover:scale-[1.02] transition-all duration-200 ${rowColor(b.result)}`}>
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-sm ${
                b.result === 'WIN' ? 'bg-emerald-500 text-white' : 
                b.result === 'LOSS' ? 'bg-rose-500 text-white' : 
                'bg-gray-600 text-white'
              }`}>
                {b.result === 'WIN' ? '✓' : b.result === 'LOSS' ? '✗' : '='}
              </div>
              
              <div>
                <div className="font-semibold text-white mb-1">{b.gameMode}</div>
                <div className="text-sm text-gray-400">vs {b.opponentName}</div>
                <div className="text-xs text-gray-500 mt-1">
                  {b.crownsFor} - {b.crownsAgainst} coroas
                </div>
              </div>
            </div>
            
            <div className="text-right">
              <div className={`text-lg font-bold ${b.trophyChange >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {b.trophyChange >= 0 ? '+' : ''}{b.trophyChange}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {new Date(b.battleTime + 'Z').toLocaleTimeString('pt-BR', { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}