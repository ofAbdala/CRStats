'use client';

import { getArenaByTrophies, getNextArena, getArenaProgress, getArenaEmoji } from '@/lib/arenas';

interface LeagueInfoProps {
  player: any;
  battles?: any[];
}

export default function LeagueInfo({ player, battles = [] }: LeagueInfoProps) {
  const winRate = player.wins && player.losses ? 
    Math.round((player.wins / (player.wins + player.losses)) * 100) : 0;

  const { current: currentArena, next: nextArena, progress } = getArenaProgress(player.trophies);
  const arenaEmoji = getArenaEmoji(currentArena);

  // Calcula média de troféus por vitória baseado nas últimas batalhas
  const recentWins = battles.filter(b => b.result === 'WIN' && b.trophyChange > 0);
  const avgTrophiesPerWin = recentWins.length > 0 
    ? Math.round(recentWins.reduce((sum, b) => sum + b.trophyChange, 0) / recentWins.length)
    : 30; // Fallback padrão

  // Calcula quantas partidas faltam (assumindo 60% win rate)
  const trophiesNeeded = nextArena ? nextArena.minTrophies - player.trophies : 0;
  const estimatedMatchesNeeded = trophiesNeeded > 0 
    ? Math.ceil(trophiesNeeded / (avgTrophiesPerWin * 0.6)) // 60% win rate
    : 0;
  return (
    <div className="glass-dark float p-8">
      {/* Header com Solo */}
      <div className="flex items-center justify-between mb-6">
        <div className="text-white/90 font-medium text-lg">Solo</div>
        <div className="text-sm text-white/50">
          {currentArena.type === 'seasonal' ? 'Arena Sazonal' : 
           currentArena.type === 'competitive' ? 'Competitivo' : 'Arena Fixa'}
        </div>
      </div>

      {/* Arena Badge */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className={`w-16 h-16 ${currentArena.colors.bg} rounded-2xl flex items-center justify-center float`}>
            <span className="text-white text-2xl">{arenaEmoji}</span>
          </div>
          <div>
            <div className={`${currentArena.colors.text} font-bold text-2xl`}>{currentArena.name}</div>
            <div className="text-white/70 text-lg">{player.trophies.toLocaleString()} troféus</div>
          </div>
        </div>
        <div className="text-right">
          <div className={`${currentArena.colors.text} font-bold text-xl`}>Arena {currentArena.id}</div>
          <div className="text-white/70">Win Rate {winRate}%</div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-3">
          <span className={`${currentArena.colors.text} font-bold text-lg`}>{player.trophies.toLocaleString()} troféus</span>
          {nextArena && (
            <span className="text-white/60">
              Próxima: {nextArena.name} ({nextArena.minTrophies.toLocaleString()})
            </span>
          )}
        </div>
        
        <div className="h-4 bg-white/10 rounded-full overflow-hidden relative">
          <div 
            className={`h-full bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full transition-all duration-700 ease-out relative`} 
            style={{ width: `${progress}%` }}
          >
            {progress > 15 && (
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xs font-bold text-white/90">
                  {Math.round(progress)}%
                </span>
              </div>
            )}
          </div>
          {progress <= 15 && progress > 0 && (
            <div className="absolute left-2 top-1/2 transform -translate-y-1/2">
              <span className="text-xs font-bold text-white/70">
                {Math.round(progress)}%
              </span>
            </div>
          )}
        </div>
        
        <div className="flex justify-between items-center mt-3">
          <div className="flex items-center gap-2">
            <span className="text-gold text-lg">🏆</span>
            <span className="text-white/60">{currentArena.minTrophies.toLocaleString()} troféus</span>
          </div>
          {nextArena ? (
            <div className="text-right">
              <div className="text-white/60 text-sm">
                Faltam: <span className="font-bold text-cyan-400">{trophiesNeeded.toLocaleString()}</span> troféus
              </div>
              <div className="text-white/50 text-xs mt-1">
                ~<span className="font-bold text-orange-400">{estimatedMatchesNeeded}</span> partidas (60% WR)
              </div>
            </div>
          ) : (
            <div className="text-gold">🎯 Arena Máxima!</div>
          )}
        </div>
      </div>

      {/* Arena Type Info */}
      <div className="glass p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="text-white/70">
            {currentArena.type === 'seasonal' && (
              <span className="text-orange-400">
                ⚡ Arena Sazonal: ±150 troféus por vitória/derrota
              </span>
            )}
            {currentArena.type === 'competitive' && (
              <span className="text-fuchsia-400">
                💎 Modo Competitivo: Sistema ranqueado avançado
              </span>
            )}
            {currentArena.type === 'fixed' && (
              <span>
                📊 Arena Fixa: ±30 troféus por vitória/derrota
              </span>
            )}
          </div>
        </div>
        
        {/* Stats adicionais */}
        <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-white/10">
          <div className="text-center">
            <div className="text-lg font-bold text-emerald-400">+{avgTrophiesPerWin}</div>
            <div className="text-xs text-white/60">Média/Vitória</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-cyan-400">{winRate}%</div>
            <div className="text-xs text-white/60">Win Rate</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-gold">{recentWins.length}</div>
            <div className="text-xs text-white/60">Vitórias Recentes</div>
          </div>
        </div>
      </div>
    </div>
  );
}