'use client';

import { Clock, Trophy, TrendingUp, TrendingDown, Calendar, Target } from 'lucide-react';

// Função para agrupar batalhas por sessões (baseado em gaps de tempo)
function groupBattlesBySessions(battles: any[]) {
  if (!battles.length) return [];
  
  const sessions = [];
  let currentSession = [];
  const SESSION_GAP_HOURS = 2; // 2 horas de gap = nova sessão
  
  for (let i = 0; i < battles.length; i++) {
    const battle = battles[i];
    const battleTime = new Date(battle.battleTime + 'Z');
    
    if (currentSession.length === 0) {
      currentSession.push(battle);
    } else {
      const lastBattle = currentSession[currentSession.length - 1];
      const lastBattleTime = new Date(lastBattle.battleTime + 'Z');
      const timeDiff = (lastBattleTime.getTime() - battleTime.getTime()) / (1000 * 60 * 60);
      
      if (timeDiff > SESSION_GAP_HOURS) {
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
    
    const startTime = new Date(sessionBattles[sessionBattles.length - 1].battleTime + 'Z');
    const endTime = new Date(sessionBattles[0].battleTime + 'Z');
    const duration = endTime.getTime() - startTime.getTime();
    
    const daysAgo = Math.floor((Date.now() - endTime.getTime()) / (1000 * 60 * 60 * 24));
    
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

function formatDuration(ms: number) {
  const hours = Math.floor(ms / (1000 * 60 * 60));
  const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
  
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
}

function formatTimeAgo(daysAgo: number) {
  if (daysAgo === 0) return 'Hoje';
  if (daysAgo === 1) return '1 dia atrás';
  return `${daysAgo} dias atrás`;
}

function getGameModeColor(mode: string) {
  const colors: { [key: string]: string } = {
    'Ladder': 'from-royal to-blue-600',
    'Classic Challenge': 'from-gold to-yellow-600',
    'Grand Challenge': 'from-purple to-indigo-600',
    'Tournament': 'from-green-500 to-green-700',
    'Party': 'from-orange-500 to-red-500',
    'Draft': 'from-cyan-500 to-blue-500',
    'Triple Draft': 'from-pink-500 to-purple-500',
    'Sudden Death': 'from-red-500 to-red-700'
  };
  
  return colors[mode] || 'from-gray-500 to-gray-700';
}

function getMostPlayedMode(battles: any[]) {
  const modes: { [key: string]: number } = {};
  battles.forEach(battle => {
    const mode = battle.gameMode || 'Unknown';
    modes[mode] = (modes[mode] || 0) + 1;
  });
  
  return Object.entries(modes).sort(([,a], [,b]) => b - a)[0]?.[0] || 'Unknown';
}

interface SessionHistoryProps {
  battles: any[];
}

export default function SessionHistory({ battles }: SessionHistoryProps) {
  const sessions = groupBattlesBySessions(battles);
  
  if (sessions.length === 0) {
    return (
      <div className="bg-card-dark border border-border-dark rounded-xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
            <Clock className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="font-bold text-lg text-white">Histórico de Sessões</h2>
            <p className="text-sm text-gray-400">Nenhuma sessão encontrada</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card-dark border border-border-dark rounded-xl p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
          <Clock className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="font-bold text-lg text-white">Histórico de Sessões</h2>
          <p className="text-sm text-gray-400">{sessions.length} sessões de jogo</p>
        </div>
      </div>
      
      <div className="space-y-4">
        {sessions.map((session) => {
          const mostPlayedMode = getMostPlayedMode(session.battles);
          const modeColor = getGameModeColor(mostPlayedMode);
          
          return (
            <div key={session.id} className="bg-bg-dark/50 border border-border-dark/50 rounded-lg p-4 hover:border-royal/30 transition-all duration-200">
              {/* Header da Sessão */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 bg-gradient-to-br ${modeColor} rounded-lg flex items-center justify-center`}>
                    <Target className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <div className="font-semibold text-white">{mostPlayedMode}</div>
                    <div className="text-xs text-gray-400">{formatTimeAgo(session.daysAgo)}</div>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className={`text-lg font-bold ${session.trophyChange >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {session.trophyChange >= 0 ? '+' : ''}{session.trophyChange}
                  </div>
                  <div className="text-xs text-gray-400">troféus</div>
                </div>
              </div>
              
              {/* Stats da Sessão */}
              <div className="grid grid-cols-4 gap-4 mb-3">
                <div className="text-center">
                  <div className="text-lg font-bold text-white">{session.total}</div>
                  <div className="text-xs text-gray-400">Jogos</div>
                </div>
                
                <div className="text-center">
                  <div className="text-lg font-bold text-emerald-400">{session.wins}</div>
                  <div className="text-xs text-gray-400">Wins</div>
                </div>
                
                <div className="text-center">
                  <div className="text-lg font-bold text-rose-400">{session.losses}</div>
                  <div className="text-xs text-gray-400">Loss</div>
                </div>
                
                <div className="text-center">
                  <div className={`text-lg font-bold ${session.winRate >= 60 ? 'text-emerald-400' : session.winRate >= 50 ? 'text-gold' : 'text-rose-400'}`}>
                    {session.winRate}%
                  </div>
                  <div className="text-xs text-gray-400">WR</div>
                </div>
              </div>
              
              {/* Duração e Horário */}
              <div className="flex items-center justify-between text-xs text-gray-500 pt-3 border-t border-border-dark/30">
                <div className="flex items-center gap-2">
                  <Clock className="w-3 h-3" />
                  <span>Duração: {formatDuration(session.duration)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-3 h-3" />
                  <span>
                    {session.startTime.toLocaleString('pt-BR', { 
                      timeZone: 'America/Sao_Paulo',
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })} - {session.endTime.toLocaleString('pt-BR', { 
                      timeZone: 'America/Sao_Paulo',
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </span>
                </div>
              </div>
              
              {/* Barra de Win Rate */}
              <div className="mt-3">
                <div className="h-2 bg-bg-dark rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-500 ${session.winRate >= 60 ? 'bg-emerald-500' : session.winRate >= 50 ? 'bg-gold' : 'bg-rose-500'}`}
                    style={{ width: `${session.winRate}%` }}
                  ></div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}