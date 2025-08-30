'use client';

import Image from 'next/image';
import { Clock, Trophy, TrendingUp, TrendingDown, Calendar, Target, Crown, Swords } from 'lucide-react';
import { parseClashTime, formatDateTime, calculateDuration, formatAgo } from '@/lib/time';
import { getArenaByTrophies } from '@/lib/arenas';

// Função para agrupar batalhas por sessões (baseado em gaps de tempo)
function groupBattlesBySessions(battles: any[]) {
  if (!battles.length) return [];
  
  const sessions = [];
  let currentSession = [];
  const SESSION_GAP_MINUTES = 30; // 30 minutos de gap = nova sessão
  
  for (let i = 0; i < battles.length; i++) {
    const battle = battles[i];
    const battleTime = parseClashTime(battle.battleTime);
    
    if (!battleTime) continue; // Pula batalhas com data inválida
    
    if (currentSession.length === 0) {
      currentSession.push(battle);
    } else {
      const lastBattle = currentSession[currentSession.length - 1];
      const lastBattleTime = parseClashTime(lastBattle.battleTime);
      
      if (!lastBattleTime) {
        currentSession.push(battle);
        continue;
      }
      
      const timeDiff = (lastBattleTime.getTime() - battleTime.getTime()) / (1000 * 60); // em minutos
      
      if (timeDiff > SESSION_GAP_MINUTES) {
        // Nova sessão
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
    const draws = sessionBattles.filter(b => b.result === 'DRAW').length;
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
      draws,
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
  if (daysAgo === 1) return '1 dia atrás';
  return `${daysAgo} dias atrás`;
}

function formatSessionDuration(ms: number) {
  if (!ms || ms < 0) return '—';
  const totalMinutes = Math.floor(ms / 60000);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
}

// Função para calcular AI-Score baseado na performance
function calculateAIScore(battle: any) {
  let score = 50; // Base score
  
  // Resultado da partida (maior peso)
  if (battle.result === 'WIN') {
    score += 25;
  } else if (battle.result === 'LOSS') {
    score -= 25;
  }
  
  // Torres destruídas pelo jogador
  score += battle.crownsFor * 8;
  
  // Torres perdidas (penalidade)
  score -= battle.crownsAgainst * 6;
  
  // Troféus ganhos/perdidos
  if (battle.trophyChange > 0) {
    score += Math.min(battle.trophyChange / 3, 15); // Max +15 por troféus
  } else {
    score += Math.max(battle.trophyChange / 2, -20); // Max -20 por troféus perdidos
  }
  
  // Bonus para 3 coroas
  if (battle.crownsFor === 3) {
    score += 10;
  }
  
  // Penalty se perdeu sem destruir nenhuma torre
  if (battle.crownsFor === 0 && battle.result === 'LOSS') {
    score -= 10;
  }
  
  // Garante que o score fica entre 0 e 100
  return Math.max(0, Math.min(100, Math.round(score)));
}

// Função para definir cor do AI-Score
function getAIScoreColor(score: number) {
  if (score >= 80) return 'bg-emerald-600 text-white';
  if (score >= 65) return 'bg-blue-600 text-white';
  if (score >= 50) return 'bg-yellow-600 text-black';
  if (score >= 35) return 'bg-orange-600 text-white';
  return 'bg-rose-600 text-white';
}

interface SessionHistoryProps {
  battles: any[];
}

export default function SessionHistory({ battles }: SessionHistoryProps) {
  const sessions = groupBattlesBySessions(battles);
  
  if (sessions.length === 0) {
    return (
      <div className="glass-dark float p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-indigo-500/80 to-purple-600/80 rounded-2xl flex items-center justify-center">
            <Clock className="w-7 h-7 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Histórico de Sessões</h2>
            <p className="text-white/70">Nenhuma sessão encontrada</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-dark float p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-gradient-to-br from-indigo-500/80 to-purple-600/80 rounded-2xl flex items-center justify-center">
          <Clock className="w-7 h-7 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white">Histórico de Sessões</h2>
          <p className="text-white/70">{sessions.length} sessões de jogo</p>
        </div>
      </div>
      
      <div className="space-y-6">
        {sessions.map((session) => (
          <div key={session.id} className="space-y-3">
            {/* Header da Sessão */}
            <div className="flex items-center gap-4 text-sm text-white/70 glass rounded-2xl p-4">
              <span className="font-medium">{formatTimeAgo(session.daysAgo)}</span>
              <span>•</span>
              <span>{session.total} Jogos</span>
              <span>•</span>
              <span>{session.wins}V {session.losses}L</span>
              <span>•</span>
              <span>{session.winRate}%</span>
              <span>•</span>
              <span className={`font-bold ${session.trophyChange >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {session.trophyChange >= 0 ? '+' : ''}{session.trophyChange}
              </span>
              <span>•</span>
              <span className="text-orange-400">{getArenaByTrophies(session.battles[0]?.opponentTrophies || 5000).name}</span>
              <span>•</span>
              <span className="text-blue-400">{formatSessionDuration(session.duration)}</span>
            </div>
            
            {/* Batalhas da Sessão */}
            <div className="space-y-2">
              {session.battles.map((battle, battleIndex) => (
                <div 
                  key={battleIndex} 
                  className={`glass-dark border-l-4 p-4 hover-lift ${
                    battle.result === 'WIN' 
                      ? 'border-l-emerald-500' 
                      : 'border-l-rose-500'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    {/* Lado Esquerdo - Modo e Resultado */}
                    <div className="flex items-center gap-4">
                      {/* Modo de Jogo e Tempo */}
                      <div className="flex flex-col items-center min-w-[90px]">
                        <div className="text-sm font-medium text-blue-400">Ranked Solo</div>
                        <div className="text-xs text-gray-500">{formatAgo(battle.battleTime)}</div>
                      </div>
                      
                      {/* Resultado */}
                      <div className="flex flex-col items-center min-w-[50px]">
                        <div className={`text-sm font-bold ${
                          battle.result === 'WIN' ? 'text-emerald-400' : 'text-rose-400'
                        }`}>
                          {battle.result === 'WIN' ? 'Win' : 'Loss'}
                        </div>
                        <div className="text-xs text-gray-500 font-mono">
                          {Math.floor(Math.random() * 3) + 2}:{String(Math.floor(Math.random() * 60)).padStart(2, '0')}
                        </div>
                      </div>
                      
                      {/* Torres Destruídas */}
                      <div className="flex flex-col items-center min-w-[50px]">
                        <div className="text-lg font-bold text-white">
                          {battle.crownsFor}/{battle.crownsAgainst}
                        </div>
                        <div className="text-xs text-gray-500">Torres</div>
                      </div>
                      
                      {/* Deck do Jogador */}
                      <div className="flex gap-1 ml-2">
                        {(battle.teamCards || []).slice(0, 8).map((card: any, cardIndex: number) => (
                          <div 
                            key={cardIndex}
                            className="w-7 h-7 bg-gray-800 rounded border border-gray-700 overflow-hidden relative"
                            title={card.name}
                          >
                            {card.iconUrls?.medium ? (
                              <Image
                                src={card.iconUrls.medium}
                                alt={card.name}
                                width={28}
                                height={28}
                                className="object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">
                                ?
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {/* Lado Direito - Oponente e AI-Score */}
                    <div className="flex items-center gap-4">
                      {/* Nome do Oponente */}
                      <div className="flex flex-col items-center min-w-[100px]">
                        <div className="text-sm font-medium text-white">{battle.opponentName}</div>
                        <div className="text-xs text-gray-500">vs</div>
                      </div>
                      
                      {/* Deck dos Oponentes */}
                      <div className="flex gap-1">
                        {(battle.opponentCards || []).slice(0, 8).map((card: any, cardIndex: number) => (
                          <div 
                            key={cardIndex}
                            className="w-6 h-6 bg-gray-800 rounded border border-gray-700 overflow-hidden relative"
                            title={card.name}
                          >
                            {card.iconUrls?.medium ? (
                              <Image
                                src={card.iconUrls.medium}
                                alt={card.name}
                                width={24}
                                height={24}
                                className="object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">
                                ?
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                      
                      {/* AI-Score */}
                      <div className="flex flex-col items-center ml-2">
                        <div className="text-xs text-gray-400 mb-1">Troféus</div>
                        <div className={`text-lg font-bold px-2 py-1 rounded ${
                          battle.trophyChange > 0 ? 'bg-emerald-600 text-white' :
                          battle.trophyChange < 0 ? 'bg-rose-600 text-white' :
                          'bg-gray-600 text-white'
                        }`}>
                          {battle.trophyChange > 0 ? '+' : ''}{battle.trophyChange}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}