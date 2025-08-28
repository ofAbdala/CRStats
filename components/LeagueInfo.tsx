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

  // Calcula estatísticas das batalhas recentes
  const recentWins = battles.filter(b => b.result === 'WIN').length;
  const recentBattles = battles.length;
  const recentWinRate = recentBattles > 0 ? Math.round((recentWins / recentBattles) * 100) : 60;
  
  // Calcula média de troféus por vitória das batalhas recentes
  const winningBattles = battles.filter(b => b.result === 'WIN' && b.trophyChange > 0);
  const avgTrophiesPerWin = winningBattles.length > 0 
    ? Math.round(winningBattles.reduce((sum, b) => sum + b.trophyChange, 0) / winningBattles.length)
    : 30; // fallback padrão

  // Calcula quantas partidas faltam para a próxima arena
  const trophiesNeeded = nextArena ? nextArena.minTrophies - player.trophies : 0;
  const estimatedMatches = nextArena && avgTrophiesPerWin > 0 
    ? Math.ceil(trophiesNeeded / (avgTrophiesPerWin * (recentWinRate / 100)))
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
          <div className="text-white/70">Win Rate {recentWinRate}%</div>
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
        
        <div className="h-3 bg-white/10 rounded-full overflow-hidden">
          <div 
            className={`h-full bg-gradient-to-r ${currentArena.colors.bg.replace('bg-gradient-to-br', '')} rounded-full transition-all duration-500 relative`} 
            style={{ width: `${progress}%` }}
          >
            <div className="absolute inset-0 bg-white/20 rounded-full animate-pulse"></div>
          </div>
        </div>
        
        <div className="flex justify-between items-center mt-3">
          <div className="flex items-center gap-2">
            <span className="text-gold text-lg">🏆</span>
            <span className="text-white/60">{currentArena.minTrophies.toLocaleString()} troféus</span>
          </div>
          {nextArena ? (
            <div className="text-right">
              <div className="text-white/60">
                Faltam: {trophiesNeeded.toLocaleString()} troféus
              </div>
              <div className="text-cyan-400 text-sm">
                ~{estimatedMatches} partidas
              </div>
            </div>
          ) : (
            <div className="text-gold">🎯 Arena Máxima!</div>
          )}
        </div>
      </div>

      {/* Stats e Arena Type Info */}
      <div className="space-y-4">
        {/* Stats das batalhas recentes */}
        {battles.length > 0 && (
          <div className="glass p-4">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-emerald-400 font-bold text-lg">+{avgTrophiesPerWin}</div>
                <div className="text-white/60 text-xs">Média/Vitória</div>
              </div>
              <div>
                <div className="text-cyan-400 font-bold text-lg">{recentWinRate}%</div>
                <div className="text-white/60 text-xs">Win Rate</div>
              </div>
              <div>
                <div className="text-gold font-bold text-lg">{recentWins}</div>
                <div className="text-white/60 text-xs">Vitórias</div>
              </div>
            </div>
          </div>
        )}
        
        {/* Arena Type Info */}
        <div className="glass p-4 text-white/70">
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
    </div>
  );
}
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
  );
}