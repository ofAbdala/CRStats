'use client';

import { motion } from 'framer-motion';
import { Trophy, Target, TrendingUp } from 'lucide-react';
import { getArenaByTrophies, getNextArena, getArenaProgress, getArenaEmoji } from '@/lib/arenas';
import { fadeInUp, cardHover } from '@/utils/animations';

interface LeagueInfoProps {
  player: any;
  battles?: any[];
}

export default function LeagueInfo({ player, battles = [] }: LeagueInfoProps) {
  const recentWinRate = battles.length > 0 ? 
    Math.round((battles.filter(b => b.result === 'WIN').length / battles.length) * 100) : 
    (player.wins && player.losses ? Math.round((player.wins / (player.wins + player.losses)) * 100) : 60);

  const avgTrophiesPerMatch = battles.length > 0 ? 
    battles.reduce((sum, battle) => sum + (battle.trophyChange || 0), 0) / battles.length : 
    0;

  const { current: currentArena, next: nextArena, progress } = getArenaProgress(player.trophies);
  const arenaEmoji = getArenaEmoji(currentArena);

  const trophiesNeeded = nextArena ? nextArena.minTrophies - player.trophies : 0;
  
  let estimatedMatches = 0;
  if (nextArena && trophiesNeeded > 0) {
    const avgWinTrophies = 30;
    const avgLossTrophies = -20;
    const expectedTrophiesPerGame = (recentWinRate / 100) * avgWinTrophies + (1 - recentWinRate / 100) * avgLossTrophies;
    
    if (expectedTrophiesPerGame > 0) {
      estimatedMatches = Math.ceil(trophiesNeeded / expectedTrophiesPerGame);
    } else {
      estimatedMatches = 999;
    }
  }
  
  const avgMinutesPerMatch = 4;
  const totalMinutes = estimatedMatches * avgMinutesPerMatch;
  const estimatedTimeHours = totalMinutes / 60;
  
  const formatEstimatedTime = (hours: number) => {
    if (hours > 168) return `${Math.round(hours / 24 / 7)}sem`;
    if (hours < 1) return `${Math.round(hours * 60)}min`;
    if (hours < 24) return `${Math.round(hours)}h`;
    return `${Math.round(hours / 24)}d`;
  };

  return (
    <motion.div 
      {...fadeInUp}
      whileHover={cardHover}
      className="premium-gradient border border-gray-800 p-8 rounded-3xl card-glow gpu-accelerated group"
    >
      {/* Header Premium */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <motion.div 
            className="w-12 h-12 bg-gray-900 rounded-2xl flex items-center justify-center group-hover:bg-gray-800 transition-all duration-300"
            whileHover={{ scale: 1.1, rotate: 5 }}
          >
            <Trophy className="w-7 h-7 text-white" />
          </motion.div>
          <div>
            <h2 className="text-2xl font-medium text-white group-hover:text-glow transition-all duration-300">League Status</h2>
            <p className="text-gray-400 font-light">Performance de elite</p>
          </div>
        </div>
        <div className="text-right text-gray-400 font-light">
          {currentArena.type === 'seasonal' ? 'Seasonal Elite' : 
           currentArena.type === 'competitive' ? 'Competitive Pro' : 'League Standard'}
        </div>
      </div>

      {/* Arena Display Premium */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8 mb-12">
        <div className="flex items-center gap-6">
          <motion.div 
            className="w-24 h-24 bg-gray-900 rounded-3xl flex items-center justify-center text-4xl card-glow gpu-accelerated"
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ duration: 0.3 }}
          >
            {arenaEmoji}
          </motion.div>
          <div>
            <div className="text-3xl font-medium text-white mb-2 group-hover:text-glow transition-all duration-300">
              {currentArena.name}
            </div>
            <div className="text-xl text-gray-400 font-light">{player.trophies.toLocaleString()} troféus</div>
          </div>
        </div>
        
        <div className="text-center lg:text-right">
          <div className="text-2xl font-medium text-white mb-2">Liga {currentArena.id}</div>
          <div className="text-gray-400 font-light">Eficiência {recentWinRate}%</div>
        </div>
      </div>

      {/* Progress Premium */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <span className="text-lg font-medium text-white">{player.trophies.toLocaleString()} troféus</span>
          {nextArena && (
            <span className="text-gray-400 font-light">
              Próximo nível: {nextArena.name} ({nextArena.minTrophies.toLocaleString()})
            </span>
          )}
        </div>
        
        <div className="h-2 bg-gray-900 rounded-full overflow-hidden relative glow-effect">
          <motion.div 
            className="h-full bg-gradient-to-r from-white to-gray-300 rounded-full gpu-accelerated"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 1.2, ease: "easeOut" }}
          />
        </div>
        
        <div className="flex justify-between items-center mt-4">
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-yellow-400" />
            <span className="text-gray-400 text-sm font-light">{currentArena.minTrophies.toLocaleString()}</span>
          </div>
          {nextArena ? (
            <div className="text-right">
              <div className="text-gray-400 text-sm mb-1 font-light">
                Gap: <span className="font-medium text-white">{trophiesNeeded.toLocaleString()}</span> troféus
              </div>
              <div className="flex items-center gap-4 text-xs">
                <div className="text-gray-500 font-light">
                  ~<span className="font-medium text-yellow-400">{estimatedMatches}</span> partidas
                </div>
                {estimatedMatches < 999 && estimatedTimeHours > 0 && (
                  <div className="text-gray-500 font-light">
                    <span className="font-medium text-blue-400">{formatEstimatedTime(estimatedTimeHours)}</span>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="text-yellow-400 font-medium">Elite Máximo</div>
          )}
        </div>
      </div>

      {/* Performance Metrics Premium */}
      <div className="grid grid-cols-3 gap-8 pt-8 border-t border-gray-800">
        <div className="text-center">
          <div className="text-2xl font-light text-green-400 mb-2 group-hover:text-glow transition-all duration-300">
            {avgTrophiesPerMatch > 0 ? '+' : ''}{Math.round(avgTrophiesPerMatch)}
          </div>
          <div className="text-gray-400 text-sm font-light">Média/Match</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-light text-white mb-2 group-hover:text-glow transition-all duration-300">
            {recentWinRate}%
          </div>
          <div className="text-gray-400 text-sm font-light">Win Rate</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-light text-yellow-400 mb-2 group-hover:text-glow transition-all duration-300">
            {battles.filter(b => b.result === 'WIN').length}
          </div>
          <div className="text-gray-400 text-sm font-light">Vitórias</div>
        </div>
      </div>
    </motion.div>
  );
}