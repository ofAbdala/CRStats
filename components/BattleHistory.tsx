'use client';

import { Clock, Trophy, Crown, Swords } from 'lucide-react';
import { formatAgo, formatDateTime } from '@/lib/time';

function rowColor(result: string) {
  return result === 'WIN' ? 'bg-emerald-900/20 border-emerald-900/30'
       : result === 'LOSS' ? 'bg-rose-900/20 border-rose-900/30'
       : 'bg-zinc-800/20 border-zinc-700/30';
}

function getGameModeIcon(mode: string) {
  if (mode.includes('Ladder')) return '🏆';
  if (mode.includes('Challenge')) return '⚔️';
  if (mode.includes('Tournament')) return '🎯';
  if (mode.includes('Party')) return '🎉';
  if (mode.includes('Draft')) return '📝';
  return '⚡';
}


export default function BattleHistory({ battles }: { battles: any[] }) {
  return (
    <div className="glass-dark float p-4 sm:p-8">
      <div className="flex items-center gap-3 mb-4 sm:mb-6">
        <div className="w-10 sm:w-12 h-10 sm:h-12 bg-gradient-to-br from-purple/80 to-indigo-600/80 rounded-xl sm:rounded-2xl flex items-center justify-center">
          <Swords className="w-6 sm:w-7 h-6 sm:h-7 text-white" />
        </div>
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white">Histórico de Batalhas</h2>
          <p className="text-sm sm:text-base text-white/70">Últimas {battles.length} partidas</p>
        </div>
      </div>
      
      <div className="space-y-3">
        {battles.map((b, i) => (
          <div key={i} className={`${
            b.result === 'WIN' && b.crownsFor === 3
              ? 'match-card win'
              : `glass-dark border-l-4 p-3 sm:p-4 hover-lift ${
                  b.result === 'WIN' ? 'border-l-emerald-500' : 
                  b.result === 'LOSS' ? 'border-l-rose-500' : 
                  'border-l-gray-500'
                }`
          }`}>
            {/* Spotlight effect para 3-crown wins */}
            {b.result === 'WIN' && b.crownsFor === 3 && (
              <div className="spotlight"></div>
            )}
            
            {/* Mobile: Layout vertical compacto */}
            <div className="block sm:hidden">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs ${
                    b.result === 'WIN' ? 'bg-emerald-500 text-white' : 
                    b.result === 'LOSS' ? 'bg-rose-500 text-white' : 
                    'bg-gray-600 text-white'
                  }`}>
                    {b.result === 'WIN' ? '✓' : b.result === 'LOSS' ? '✗' : '='}
                  </div>
                  <div>
                    <div className="font-medium text-white text-sm">{b.gameMode}</div>
                    <div className="text-xs text-white/70">{b.crownsFor} - {b.crownsAgainst} coroas</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-sm font-bold ${b.trophyChange >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {b.trophyChange >= 0 ? '+' : ''}{b.trophyChange}
                  </div>
                  <div className="text-xs text-white/50">{formatAgo(b.battleTime)}</div>
                </div>
              </div>
              <div className="text-xs text-white/60">vs {b.opponentName}</div>
            </div>

            {/* Desktop: Layout horizontal original */}
            <div className="hidden sm:flex items-center gap-4 flex-1">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-sm ${
                b.result === 'WIN' ? 'bg-emerald-500 text-white' : 
                b.result === 'LOSS' ? 'bg-rose-500 text-white' : 
                'bg-gray-600 text-white'
              }`}>
                {b.result === 'WIN' ? '✓' : b.result === 'LOSS' ? '✗' : '='}
              </div>
              
              <div className="flex-1">
                <div className="font-semibold text-white mb-1">{b.gameMode}</div>
                <div className="flex items-center gap-2">
                  <div className="text-sm text-white/70">vs {b.opponentName}</div>
                  <div className="text-xs text-white/50">
                    {b.crownsFor} - {b.crownsAgainst} coroas
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col text-right items-end gap-1">
                <div className={`text-base sm:text-lg font-bold ${b.trophyChange >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {b.trophyChange >= 0 ? '+' : ''}{b.trophyChange}
                </div>
                
                <div className="flex flex-col items-end gap-1">
                  {b.opponentTrophies > 0 && (
                    <div className="flex items-center gap-1 text-xs text-white/50">
                      <Trophy className="w-3 h-3" />
                      <span>{b.opponentTrophies}</span>
                    </div>
                  )}
                  <div className="text-xs text-white/50 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{formatAgo(b.battleTime)}</span>
                  </div>
                  <div className="text-xs text-white/40">
                    {formatDateTime(b.battleTime)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}