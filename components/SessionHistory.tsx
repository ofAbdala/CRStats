'use client';

import { motion } from 'framer-motion';
import { Clock, Trophy, Calendar, Target, TrendingUp, Zap } from 'lucide-react';
import { parseClashTime, formatDateTime, formatAgo } from '@/lib/time';
import { fadeInUp, cardHover } from '@/utils/animations';

// Group battles by sessions based on time gaps
function groupBattlesBySessions(battles: any[]) {
  if (!battles.length) return [];

  const sessions = [];
  let currentSession = [];
  const SESSION_GAP_MINUTES = 30;

  for (let i = 0; i < battles.length; i++) {
    const battle = battles[i];
    const battleTime = parseClashTime(battle.battleTime);

    if (!battleTime) continue;

    if (currentSession.length === 0) {
      currentSession.push(battle);
    } else {
      const lastBattle = currentSession[currentSession.length - 1];
      const lastBattleTime = parseClashTime(lastBattle.battleTime);

      if (!lastBattleTime) {
        currentSession.push(battle);
        continue;
      }

      const timeDiff = (lastBattleTime.getTime() - battleTime.getTime()) / (1000 * 60);

      if (timeDiff > SESSION_GAP_MINUTES) {
        sessions.push([...currentSession]);
        currentSession = [battle];
      } else {
        currentSession.push(battle);
      }
    }
  }

  if (currentSession.length > 0) {
    sessions.push(currentSession);
  }

  return sessions.map((sessionBattles, index) => {
    const wins = sessionBattles.filter(b => b.result === 'WIN').length;
    const losses = sessionBattles.filter(b => b.result === 'LOSS').length;
    const winRate = sessionBattles.length > 0 ? Math.round((wins / sessionBattles.length) * 100) : 0;
    const trophyChange = sessionBattles.reduce((sum, b) => sum + (b.trophyChange || 0), 0);

    const startTime = parseClashTime(sessionBattles[sessionBattles.length - 1].battleTime);
    const endTime = parseClashTime(sessionBattles[0].battleTime);
    const duration = (startTime && endTime) ? endTime.getTime() - startTime.getTime() : 0;
    const daysAgo = endTime ? Math.floor((Date.now() - endTime.getTime()) / (1000 * 60 * 60 * 24)) : 0;

    return {
      id: index,
      battles: sessionBattles,
      wins,
      losses,
      total: sessionBattles.length,
      winRate,
      trophyChange,
      startTime,
      endTime,
      duration,
      daysAgo
    };
  });
}

function formatTimeAgo(daysAgo: number) {
  if (daysAgo === 0) return 'Hoje';
  if (daysAgo === 1) return 'Ontem';
  return `${daysAgo} dias atrás`;
}

function formatSessionDuration(ms: number) {
  if (!ms || ms < 0) return '—';
  const totalMinutes = Math.floor(ms / 60000);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
}

export default function SessionHistory({ battles }: { battles: any[] }) {
  const sessions = groupBattlesBySessions(battles);

  if (sessions.length === 0) {
    return (
      <motion.div
        initial={fadeInUp.initial}
        animate={fadeInUp.animate}
        transition={fadeInUp.transition}
        className="premium-gradient border border-gray-800 p-12 rounded-3xl text-center card-glow"
      >
        <Calendar className="w-16 h-16 text-gray-600 mx-auto mb-6" />
        <h2 className="text-2xl font-medium text-white mb-4">Aguardando Sessões</h2>
        <p className="text-gray-400 font-light">Dados de sessão serão exibidos aqui</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={fadeInUp.initial}
      animate={fadeInUp.animate}
      transition={fadeInUp.transition}
      whileHover={cardHover}
      className="premium-gradient border border-gray-800 p-8 rounded-3xl card-glow gpu-accelerated group"
    >
      <div className="flex items-center gap-4 mb-12">
        <motion.div
          className="w-12 h-12 bg-gray-900 rounded-2xl flex items-center justify-center group-hover:bg-gray-800 transition-all duration-300"
          whileHover={{ scale: 1.1, rotate: 5 }}
        >
          <Calendar className="w-7 h-7 text-white" />
        </motion.div>
        <div>
          <h2 className="text-2xl font-medium text-white group-hover:text-glow transition-all duration-300">
            Session Analytics
          </h2>
          <p className="text-gray-400 font-light">{sessions.length} sessões de elite analisadas</p>
        </div>
      </div>

      <div className="space-y-8">
        {sessions.map((session, index) => (
          <motion.div
            key={session.id}
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1, duration: 0.6 }}
            className="space-y-4"
          >
            {/* Session Header Premium */}
            <motion.div
              className="glass-premium p-6 rounded-2xl glow-effect gpu-accelerated"
              whileHover={{ scale: 1.01 }}
            >
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="flex items-center gap-6 text-gray-300 font-light">
                  <div className="font-medium text-white">{formatTimeAgo(session.daysAgo)}</div>
                  <div className="text-gray-600">•</div>
                  <div>{session.total} partidas</div>
                  <div className="text-gray-600">•</div>
                  <div>{session.wins}V {session.losses}L</div>
                </div>

                <div className="flex items-center gap-6">
                  <div className={`font-medium ${session.trophyChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {session.trophyChange >= 0 ? '+' : ''}{session.trophyChange} troféus
                  </div>
                  <div className="text-gray-400 font-light">{formatSessionDuration(session.duration)}</div>
                  <div className="text-blue-400 font-medium">{session.winRate}%</div>
                </div>
              </div>
            </motion.div>

            {/* Session Battles Premium */}
            <div className="space-y-3 pl-4">
              {session.battles.slice(0, 5).map((battle, battleIndex) => (
                <motion.div
                  key={battleIndex}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + battleIndex * 0.05, duration: 0.4 }}
                  whileHover={{ scale: 1.01, x: 8 }}
                  className={`premium-gradient border rounded-2xl p-4 transition-all duration-300 gpu-accelerated ${battle.result === 'WIN' ? 'border-green-400/30' : 'border-red-400/30'
                    }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <motion.div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center font-medium gpu-accelerated ${battle.result === 'WIN' ? 'bg-green-400 text-black' : 'bg-red-400 text-white'
                          }`}
                        whileHover={{ scale: 1.1, rotate: 5 }}
                      >
                        {battle.result === 'WIN' ? '✓' : '✗'}
                      </motion.div>

                      <div>
                        <div className="font-medium text-white">{battle.gameMode}</div>
                        <div className="text-sm text-gray-400 font-light">
                          vs {battle.opponentName} • {battle.crownsFor}-{battle.crownsAgainst}
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className={`text-lg font-medium ${battle.trophyChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {battle.trophyChange >= 0 ? '+' : ''}{battle.trophyChange}
                      </div>
                      <div className="text-xs text-gray-500 font-light">{formatAgo(battle.battleTime)}</div>
                    </div>
                  </div>
                </motion.div>
              ))}

              {session.battles.length > 5 && (
                <div className="text-center text-gray-500 text-sm py-2 font-light">
                  +{session.battles.length - 5} partidas adicionais
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}