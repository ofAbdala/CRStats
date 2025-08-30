'use client';

import { getArenaByTrophies, getNextArena, getArenaProgress, getArenaEmoji } from '@/lib/arenas';
import { parseClashTime } from '@/lib/time';

interface LeagueInfoProps {
  player: any;
  battles?: any[];
}

export default function LeagueInfo({ player, battles = [] }: LeagueInfoProps) {
  // Calcula win rate real das últimas batalhas (mais preciso que o total)
  const recentWinRate = battles.length > 0 ? 
    Math.round((battles.filter(b => b.result === 'WIN').length / battles.length) * 100) : 
    (player.wins && player.losses ? Math.round((player.wins / (player.wins + player.losses)) * 100) : 60);

  // Calcula média de troféus por partida baseada nas batalhas recentes
  const avgTrophiesPerMatch = battles.length > 0 ? 
    battles.reduce((sum, battle) => sum + (battle.trophyChange || 0), 0) / battles.length : 
    0;

  const { current: currentArena, next: nextArena, progress } = getArenaProgress(player.trophies);
  const arenaEmoji = getArenaEmoji(currentArena);

  // Calcula estimativas para próxima arena
  const trophiesNeeded = nextArena ? nextArena.minTrophies - player.trophies : 0;
  
  // Calcula partidas estimadas baseado no win rate
  let estimatedMatches = 0;
  if (nextArena && trophiesNeeded > 0) {
    // Usa win rate para estimar quantas vitórias são necessárias
    // Assume média de +30 troféus por vitória e -20 por derrota
    const avgWinTrophies = 30;
    const avgLossTrophies = -20;
    const expectedTrophiesPerGame = (recentWinRate / 100) * avgWinTrophies + (1 - recentWinRate / 100) * avgLossTrophies;
    
    if (expectedTrophiesPerGame > 0) {
      estimatedMatches = Math.ceil(trophiesNeeded / expectedTrophiesPerGame);
    } else {
      estimatedMatches = 999; // Impossível subir com win rate muito baixo
    }
  }
  
  // Calcula tempo estimado (média de 4 minutos por partida)
  const avgMinutesPerMatch = 4; // Tempo médio por partida do Clash Royale
  const totalMinutes = estimatedMatches * avgMinutesPerMatch;
  
  const estimatedTimeHours = totalMinutes / 60;
  
  // Função para formatar tempo estimado
  const formatEstimatedTime = (hours: number) => {
    if (hours > 168) { // Mais de 1 semana
      return `${Math.round(hours / 24 / 7)}sem`;
    }
    if (hours < 1) {
      return `${Math.round(hours * 60)}min`;
    } else if (hours < 24) {
      return `${Math.round(hours)}h`;
    } else {
      return `${Math.round(hours / 24)}d`;
    }
  };

  return (
    <div className="glass-dark float p-4 sm:p-6 lg:p-8">
      {/* Header com Solo */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0 mb-4 sm:mb-6">
        <div className="text-white/90 font-medium text-lg sm:text-lg">Solo</div>
        <div className="text-xs sm:text-sm text-white/50 text-left sm:text-right">
          {currentArena.type === 'seasonal' ? 'Arena Sazonal' : 
           currentArena.type === 'competitive' ? 'Competitivo' : 'Arena Fixa'}
        </div>
      </div>

      {/* Arena Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-6 mb-6 sm:mb-8">
        <div className="flex items-center gap-3 sm:gap-4">
          <div className={`w-14 sm:w-16 h-14 sm:h-16 ${currentArena.colors.bg} rounded-2xl flex items-center justify-center float`}>
            <span className="text-white text-2xl sm:text-2xl">{arenaEmoji}</span>
          </div>
          <div>
            <div className={`${currentArena.colors.text} font-bold text-base sm:text-xl lg:text-2xl`}>{currentArena.name}</div>
            <div className="text-white/70 text-sm sm:text-base lg:text-lg">{player.trophies.toLocaleString()} troféus</div>
          </div>
        </div>
        <div className="text-center sm:text-right">
          <div className={`${currentArena.colors.text} font-bold text-base sm:text-xl`}>Arena {currentArena.id}</div>
          <div className="text-white/70 text-sm sm:text-base">Win Rate {recentWinRate}%</div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-4 sm:mb-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-2 mb-3">
          <span className={`${currentArena.colors.text} font-bold text-sm sm:text-lg`}>{player.trophies.toLocaleString()} troféus</span>
          {nextArena && (
            <span className="text-white/60 text-xs sm:text-base">
              Próxima: {nextArena.name} ({nextArena.minTrophies.toLocaleString()})
            </span>
          )}
        </div>
        
        <div className="h-3 sm:h-4 bg-white/10 rounded-full overflow-hidden relative">
          <div 
            className={`h-full bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full transition-all duration-700 ease-out relative`} 
            style={{ width: `${progress}%` }}
          >
            {progress > 20 && (
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xs font-bold text-white/90">
                  {Math.round(progress)}%
                </span>
              </div>
            )}
          </div>
          {progress <= 20 && progress > 0 && (
            <div className="absolute left-1 sm:left-2 top-1/2 transform -translate-y-1/2">
              <span className="text-xs font-bold text-white/70">
                {Math.round(progress)}%
              </span>
            </div>
          )}
        </div>
        
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-0 mt-2 sm:mt-3">
          <div className="flex items-center gap-2">
            <span className="text-gold text-base sm:text-lg">🏆</span>
            <span className="text-white/60 text-xs sm:text-base">{currentArena.minTrophies.toLocaleString()} troféus</span>
          </div>
          {nextArena ? (
            <div className="text-left sm:text-right space-y-1">
              <div className="text-white/60 text-xs sm:text-sm">
                Faltam: <span className="font-bold text-cyan-400">{(nextArena.minTrophies - player.trophies).toLocaleString()}</span> troféus
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-end gap-1 sm:gap-2">
                <div className="text-white/50 text-xs">
                  ~<span className="font-bold text-orange-400">{estimatedMatches}</span> partidas
                </div>
                {estimatedMatches < 999 && estimatedTimeHours > 0 && (
                  <>
                    <span className="hidden sm:inline text-white/30">•</span>
                    <div className="text-white/50 text-xs">
                      <span className="font-bold text-blue-400">{formatEstimatedTime(estimatedTimeHours)}</span>
                    </div>
                  </>
                )}
                {estimatedMatches >= 999 && (
                  <div className="text-rose-400 text-xs font-bold">
                    Melhore win rate para subir
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="text-gold text-center sm:text-right">🎯 Arena Máxima!</div>
          )}
        </div>
      </div>

      {/* Arena Type Info */}
      <div className="glass p-3 sm:p-4">
        <div className="mb-3">
          <div className="text-white/70">
            {currentArena.type === 'seasonal' && (
              <span className="text-orange-400 text-xs sm:text-base">
                ⚡ Arena Sazonal: ±150 troféus por vitória/derrota
              </span>
            )}
            {currentArena.type === 'competitive' && (
              <span className="text-fuchsia-400 text-xs sm:text-base">
                💎 Modo Competitivo: Sistema ranqueado avançado
              </span>
            )}
            {currentArena.type === 'fixed' && (
              <span className="text-xs sm:text-base">
                📊 Arena Fixa: ±30 troféus por vitória/derrota
              </span>
            )}
          </div>
        </div>
        
        {/* Stats adicionais */}
        <div className="grid grid-cols-3 gap-2 sm:gap-4 mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-white/10">
          <div className="text-center">
            <div className="text-sm sm:text-lg font-bold text-emerald-400">
              {avgTrophiesPerMatch > 0 ? '+' : ''}{Math.round(avgTrophiesPerMatch)}
            </div>
            <div className="text-xs text-white/60">Média/Partida</div>
          </div>
          <div className="text-center">
            <div className="text-sm sm:text-lg font-bold text-cyan-400">{recentWinRate}%</div>
            <div className="text-xs text-white/60">Win Rate</div>
          </div>
          <div className="text-center">
            <div className="text-sm sm:text-lg font-bold text-gold">
              {battles.filter(b => b.result === 'WIN').length}
            </div>
            <div className="text-xs text-white/60">Vitórias Rec.</div>
          </div>
        </div>
      </div>
    </div>
  );
}