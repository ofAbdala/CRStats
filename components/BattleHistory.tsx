'use client';

import { motion } from 'framer-motion';
import { Clock, Trophy, Swords, Target, TrendingUp } from 'lucide-react';
import { formatAgo, formatDateTime } from '@/lib/time';
import { fadeInUp, cardHover } from '@/utils/animations';

export default function BattleHistory({ battles }: { battles: any[] }) {
  return (
    <motion.div 
      {...fadeInUp}
      whileHover={cardHover}
      className="premium-gradient border border-gray-800 p-8 rounded-3xl card-glow gpu-accelerated group"
    >
      <div className="flex items-center gap-4 mb-12">
        <motion.div 
          className="w-12 h-12 bg-gray-900 rounded-2xl flex items-center justify-center group-hover:bg-gray-800 transition-all duration-300"
          whileHover={{ scale: 1.1, rotate: 5 }}
        >
          <Swords className="w-7 h-7 text-white" />
        </motion.div>
        <div>
          <h2 className="text-2xl font-medium text-white group-hover:text-glow transition-all duration-300">
            Battle Analytics
          </h2>
          <p className="text-gray-400 font-light">Últimas {battles.length} partidas de elite</p>
        </div>
      </div>
      
      <div className="space-y-4">
        {battles.map((battle, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05, duration: 0.4 }}
            whileHover={{ scale: 1.01, x: 8 }}
            className={`premium-gradient border rounded-2xl p-6 transition-all duration-300 gpu-accelerated ${
              battle.result === 'WIN' 
                ? 'border-green-400/30 glow-effect' 
                : battle.result === 'LOSS' 
                ? 'border-red-400/30' 
                : 'border-gray-700'
            }`}
          >
            {/* Mobile Layout Premium */}
            <div className="block lg:hidden">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <motion.div 
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center font-medium gpu-accelerated ${
                      battle.result === 'WIN' ? 'bg-green-400 text-black' : 
                      battle.result === 'LOSS' ? 'bg-red-400 text-white' : 
                      'bg-gray-600 text-white'
                    }`}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                  >
                    {battle.result === 'WIN' ? '✓' : battle.result === 'LOSS' ? '✗' : '='}
                  </motion.div>
                  <div>
                    <div className="font-medium text-white">{battle.gameMode}</div>
                    <div className="text-sm text-gray-400 font-light">{battle.crownsFor} - {battle.crownsAgainst} torres</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-lg font-medium ${battle.trophyChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {battle.trophyChange >= 0 ? '+' : ''}{battle.trophyChange}
                  </div>
                  <div className="text-xs text-gray-500 font-light">{formatAgo(battle.battleTime)}</div>
                </div>
              </div>
              <div className="text-sm text-gray-400 font-light">vs {battle.opponentName}</div>
            </div>

            {/* Desktop Layout Premium */}
            <div className="hidden lg:flex items-center gap-8">
              <motion.div 
                className={`w-16 h-16 rounded-2xl flex items-center justify-center font-medium gpu-accelerated ${
                  battle.result === 'WIN' ? 'bg-green-400 text-black' : 
                  battle.result === 'LOSS' ? 'bg-red-400 text-white' : 
                  'bg-gray-600 text-white'
                }`}
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ duration: 0.3 }}
              >
                {battle.result === 'WIN' ? '✓' : battle.result === 'LOSS' ? '✗' : '='}
              </motion.div>
              
              <div className="flex-1">
                <div className="font-medium text-white text-lg mb-2">{battle.gameMode}</div>
                <div className="flex items-center gap-6 text-gray-400 font-light">
                  <span>vs {battle.opponentName}</span>
                  <span className="flex items-center gap-2">
                    <Target className="w-4 h-4" />
                    {battle.crownsFor} - {battle.crownsAgainst} torres
                  </span>
                </div>
              </div>
              
              <div className="text-right space-y-2">
                <div className={`text-2xl font-light ${battle.trophyChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {battle.trophyChange >= 0 ? '+' : ''}{battle.trophyChange}
                </div>
                
                {battle.opponentTrophies > 0 && (
                  <div className="flex items-center gap-2 text-gray-400 justify-end">
                    <Trophy className="w-4 h-4" />
                    <span className="text-sm font-light">{battle.opponentTrophies}</span>
                  </div>
                )}
                
                <div className="text-sm text-gray-500 flex items-center gap-2 justify-end font-light">
                  <Clock className="w-4 h-4" />
                  <span>{formatAgo(battle.battleTime)}</span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Summary Stats Premium */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        className="grid grid-cols-3 gap-8 pt-8 mt-8 border-t border-gray-800"
      >
        <div className="text-center">
          <div className="text-xl font-light text-green-400 mb-2 group-hover:text-glow transition-all duration-300">
            {battles.filter(b => b.result === 'WIN').length}
          </div>
          <div className="text-gray-400 text-sm font-light">Vitórias</div>
        </div>
        <div className="text-center">
          <div className="text-xl font-light text-red-400 mb-2 group-hover:text-glow transition-all duration-300">
            {battles.filter(b => b.result === 'LOSS').length}
          </div>
          <div className="text-gray-400 text-sm font-light">Derrotas</div>
        </div>
        <div className="text-center">
          <div className="text-xl font-light text-white mb-2 group-hover:text-glow transition-all duration-300">
            {recentWinRate}%
          </div>
          <div className="text-gray-400 text-sm font-light">Eficiência</div>
        </div>
      </motion.div>
    </motion.div>
  );
}