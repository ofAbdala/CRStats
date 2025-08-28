'use client';

import { Clock, Trophy, TrendingUp, TrendingDown, Calendar, Target, Crown, Swords } from 'lucide-react';
import { parseClashTime, formatDateTime, calculateDuration, formatAgo } from '@/lib/time';

// Função para agrupar batalhas por sessões (baseado em gaps de tempo)
function groupBattlesBySessions(battles: any[]) {
  if (!battles.length) return [];
  
  const sessions = [];
  let currentSession = [];
  const SESSION_GAP_HOURS = 2; // 2 horas de gap = nova sessão
  
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

function getGameModeIcon(mode: string) {
  if (mode.includes('Ladder')) return '🏆';
  if (mode.includes('Challenge')) return '⚔️';
  if (mode.includes('Tournament')) return '🎯';
  if (mode.includes('Party')) return '🎉';
  if (mode.includes('Draft')) return '📝';
  return '⚡';
}

function formatDuration(ms: number) {
  const minutes = Math.floor(ms / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

function getCardIcon(cardName: string) {
  // Mapeamento básico de cartas para emojis
  const cardIcons: { [key: string]: string } = {
    'Knight': '🛡️',
    'Archers': '🏹',
    'Goblins': '👹',
    'Giant': '🗿',
    'P.E.K.K.A': '🤖',
    'Minions': '🦇',
    'Balloon': '🎈',
    'Witch': '🧙‍♀️',
    'Barbarians': '🪓',
    'Golem': '🗿',
    'Skeleton Army': '💀',
    'Valkyrie': '⚔️',
    'Skeleton': '💀',
    'Wall Breakers': '💣',
    'Fireball': '🔥',
    'Arrows': '🏹',
    'Lightning': '⚡',
    'Zap': '⚡',
    'Poison': '☠️',
    'Freeze': '❄️',
    'Tornado': '🌪️',
    'Clone': '👥',
    'Rage': '😡',
    'Mirror': '🪞',
    'Elixir Collector': '💜',
    'Inferno Tower': '🔥',
    'Bomb Tower': '💣',
    'Barbarian Hut': '🏠',
    'Goblin Hut': '🏠',
    'X-Bow': '🏹',
    'Mortar': '💥',
    'Rocket': '🚀',
    'Goblin Barrel': '🛢️',
    'Graveyard': '⚰️',
    'The Log': '🪵',
    'Miner': '⛏️',
    'Princess': '👸',
    'Ice Wizard': '🧙‍♂️',
    'Lumberjack': '🪓',
    'Sparky': '⚡',
    'Lava Hound': '🌋',
    'Ice Spirit': '❄️',
    'Fire Spirit': '🔥',
    'Bowler': '🎳',
    'Lumber Jack': '🪓',
    'Inferno Dragon': '🐲',
    'Ice Golem': '🧊',
    'Mega Minion': '🦇',
    'Dart Goblin': '🎯',
    'Goblin Gang': '👹',
    'Electro Wizard': '⚡',
    'Elite Barbarians': '🪓',
    'Hunter': '🔫',
    'Executioner': '🪓',
    'Bandit': '🗡️',
    'Ram Rider': '🐏',
    'Magic Archer': '🏹',
    'Night Witch': '🧙‍♀️',
    'Mega Knight': '👑',
    'Royal Ghost': '👻',
    'Dark Prince': '🖤',
    'Prince': '🤴',
    'Baby Dragon': '🐲',
    'Wizard': '🧙‍♂️',
    'Musketeer': '🔫',
    'Mini P.E.K.K.A': '🤖',
    'Hog Rider': '🐗',
    'Three Musketeers': '🔫',
    'Royal Giant': '👑',
    'Guards': '🛡️',
    'Dark Prince': '🖤',
    'Cannon': '💥',
    'Tesla': '⚡',
    'Tombstone': '⚰️',
    'Furnace': '🔥',
    'Barbarian Barrel': '🛢️',
    'Flying Machine': '🚁',
    'Rascals': '👦',
    'Royal Recruits': '👑',
    'Zappies': '⚡',
    'Cannon Cart': '🛒',
    'Mega Minion': '🦇',
    'Ice Spirit': '❄️',
    'Heal Spirit': '💚',
    'Skeletons': '💀',
    'Bats': '🦇',
    'Spear Goblins': '🗡️',
    'Fire Cracker': '🧨',
    'Royal Delivery': '📦',
    'Earthquake': '🌍',
    'Snowball': '⛄',
    'Giant Snowball': '⛄',
    'Barbarian Barrel': '🛢️',
    'Heal': '💚',
    'Electro Dragon': '🐲',
    'Fisherman': '🎣',
    'Earthquake': '🌍',
    'Wall Breakers': '💣',
    'Elixir Golem': '💜',
    'Battle Healer': '💚',
    'Firecracker': '🧨',
    'Mighty Miner': '⛏️',
    'Royal Champion': '👑',
    'Archer Queen': '👸',
    'Golden Knight': '🏅',
    'Skeleton King': '💀',
    'Phoenix': '🔥',
    'Monk': '🧘‍♂️'
  };
  
  return cardIcons[cardName] || '🃏';
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
      
      <div className="space-y-6">
        {sessions.map((session) => (
          <div key={session.id} className="space-y-3">
            {/* Header da Sessão */}
            <div className="flex items-center gap-4 text-sm text-gray-400">
              <span>{formatTimeAgo(session.daysAgo)}</span>
              <span>{session.total} Jogos</span>
              <span>{session.wins}V {session.losses}L</span>
              <span>{session.winRate}%</span>
              <span className={`font-bold ${session.trophyChange >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {session.trophyChange >= 0 ? '+' : ''}{session.trophyChange}
              </span>
              <span>Challenger</span>
              <span>{calculateDuration(session.startTime, session.endTime)}</span>
            </div>
            
            {/* Batalhas da Sessão */}
            <div className="space-y-2">
              {session.battles.map((battle, battleIndex) => (
                <div 
                  key={battleIndex} 
                  className={`rounded-lg border-l-4 p-4 ${
                    battle.result === 'WIN' 
                      ? 'bg-emerald-900/10 border-l-emerald-500' 
                      : 'bg-rose-900/10 border-l-rose-500'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    {/* Lado Esquerdo - Info da Partida */}
                    <div className="flex items-center gap-4">
                      {/* Modo de Jogo */}
                      <div className="flex flex-col items-center min-w-[80px]">
                        <div className="text-xs text-gray-400 mb-1">Ranked Solo</div>
                        <div className="text-xs text-gray-500">{formatTimeAgo(0)}</div>
                      </div>
                      
                      {/* Resultado */}
                      <div className="flex flex-col items-center min-w-[60px]">
                        <div className={`text-sm font-bold ${
                          battle.result === 'WIN' ? 'text-emerald-400' : 'text-rose-400'
                        }`}>
                          {battle.result === 'WIN' ? 'Win' : 'Lose'}
                        </div>
                        <div className="text-xs text-gray-500">
                          {formatDuration(Math.random() * 300000 + 60000)} {/* Duração simulada */}
                        </div>
                      </div>
                      
                      {/* Avatar do Jogador */}
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-royal to-purple flex items-center justify-center">
                        <Crown className="w-5 h-5 text-white" />
                      </div>
                      
                      {/* Deck do Jogador */}
                      <div className="flex gap-1">
                        {battle.teamDeck.slice(0, 8).map((card: string, cardIndex: number) => (
                          <div 
                            key={cardIndex}
                            className="w-8 h-8 bg-gray-800 rounded border border-gray-700 flex items-center justify-center text-xs"
                            title={card}
                          >
                            {getCardIcon(card)}
                          </div>
                        ))}
                      </div>
                      
                      {/* Score */}
                      <div className="flex flex-col items-center min-w-[60px]">
                        <div className="text-sm font-bold text-white">
                          {battle.crownsFor}/{battle.crownsAgainst}
                        </div>
                        <div className="text-xs text-gray-500">
                          Torres destruídas
                        </div>
                      </div>
                    </div>
                    
                    {/* Lado Direito - Oponentes */}
                    <div className="flex items-center gap-4">
                      {/* AI-Score */}
                      <div className="flex flex-col items-center">
                        <div className="text-xs text-gray-400 mb-1">AI-Score</div>
                        <div className={`text-lg font-bold px-2 py-1 rounded ${getAIScoreColor(calculateAIScore(battle))}`}>
                          {calculateAIScore(battle)}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">Performance</div>
                      </div>
                      
                      {/* Oponentes */}
                      <div className="flex items-center">
                        <span className="text-sm text-blue-400">{battle.opponentName}</span>
                      </div>
                      
                      {/* Deck dos Oponentes */}
                      <div className="flex flex-col gap-1">
                        <div className="flex gap-1">
                          {battle.opponentDeck.slice(0, 4).map((card: string, cardIndex: number) => (
                            <div 
                              key={cardIndex}
                              className="w-6 h-6 bg-gray-800 rounded border border-gray-700 flex items-center justify-center text-xs"
                              title={card}
                            >
                              {getCardIcon(card)}
                            </div>
                          ))}
                        </div>
                        <div className="flex gap-1">
                          {battle.opponentDeck.slice(4, 8).map((card: string, cardIndex: number) => (
                            <div 
                              key={cardIndex}
                              className="w-6 h-6 bg-gray-800 rounded border border-gray-700 flex items-center justify-center text-xs"
                              title={card}
                            >
                              {getCardIcon(card)}
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      {/* Dropdown */}
                      <div className="text-gray-500">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
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