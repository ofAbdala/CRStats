// Sistema oficial de arenas do Clash Royale 2025
const ARENAS = [
  // Arenas Fixas (0 a 10.000 troféus)
  { id: 0, name: "Training Camp", minTrophies: 0, maxTrophies: 299, icon: "🏕️", color: "from-gray-400 to-gray-600", type: "fixed" },
  { id: 1, name: "Goblin Stadium", minTrophies: 0, maxTrophies: 299, icon: "👹", color: "from-green-400 to-green-600", type: "fixed" },
  { id: 2, name: "Bone Pit", minTrophies: 300, maxTrophies: 599, icon: "💀", color: "from-orange-400 to-orange-600", type: "fixed" },
  { id: 3, name: "Barbarian Bowl", minTrophies: 600, maxTrophies: 999, icon: "🪓", color: "from-red-400 to-red-600", type: "fixed" },
  { id: 4, name: "Spell Valley", minTrophies: 1000, maxTrophies: 1299, icon: "🔮", color: "from-purple-400 to-purple-600", type: "fixed" },
  { id: 5, name: "Builder's Workshop", minTrophies: 1300, maxTrophies: 1599, icon: "🔨", color: "from-amber-400 to-amber-600", type: "fixed" },
  { id: 6, name: "P.E.K.K.A's Playhouse", minTrophies: 1600, maxTrophies: 1999, icon: "🤖", color: "from-purple-500 to-purple-700", type: "fixed" },
  { id: 7, name: "Royal Arena", minTrophies: 2000, maxTrophies: 2299, icon: "👑", color: "from-blue-400 to-blue-600", type: "fixed" },
  { id: 8, name: "Frozen Peak", minTrophies: 2300, maxTrophies: 2599, icon: "🏔️", color: "from-cyan-400 to-cyan-600", type: "fixed" },
  { id: 9, name: "Jungle Arena", minTrophies: 2600, maxTrophies: 2999, icon: "🌿", color: "from-green-500 to-green-700", type: "fixed" },
  { id: 10, name: "Hog Mountain", minTrophies: 3000, maxTrophies: 3399, icon: "🐗", color: "from-orange-500 to-orange-700", type: "fixed" },
  { id: 11, name: "Electro Valley", minTrophies: 3400, maxTrophies: 3799, icon: "⚡", color: "from-yellow-400 to-yellow-600", type: "fixed" },
  { id: 12, name: "Spooky Town", minTrophies: 3800, maxTrophies: 4199, icon: "🎃", color: "from-purple-600 to-purple-800", type: "fixed" },
  { id: 13, name: "Rascal's Hideout", minTrophies: 4200, maxTrophies: 4599, icon: "🏴‍☠️", color: "from-red-500 to-red-700", type: "fixed" },
  { id: 14, name: "Serenity Peak", minTrophies: 4600, maxTrophies: 4999, icon: "🏯", color: "from-indigo-400 to-indigo-600", type: "fixed" },
  { id: 15, name: "Miner's Mine", minTrophies: 5000, maxTrophies: 5499, icon: "⛏️", color: "from-amber-500 to-amber-700", type: "fixed" },
  { id: 16, name: "Executioner's Kitchen", minTrophies: 5500, maxTrophies: 5999, icon: "🪓", color: "from-red-600 to-red-800", type: "fixed" },
  { id: 17, name: "Royal Crypt", minTrophies: 6000, maxTrophies: 6499, icon: "⚰️", color: "from-gray-600 to-gray-800", type: "fixed" },
  { id: 18, name: "Silent Sanctuary", minTrophies: 6500, maxTrophies: 6999, icon: "🕯️", color: "from-blue-600 to-blue-800", type: "fixed" },
  { id: 19, name: "Dragon Spa", minTrophies: 7000, maxTrophies: 7499, icon: "🐲", color: "from-green-600 to-green-800", type: "fixed" },
  { id: 20, name: "Boot Camp", minTrophies: 7500, maxTrophies: 7999, icon: "🥾", color: "from-brown-500 to-brown-700", type: "fixed" },
  { id: 21, name: "Clash Fest", minTrophies: 8000, maxTrophies: 8499, icon: "🎪", color: "from-pink-500 to-pink-700", type: "fixed" },
  { id: 22, name: "PANCAKES!", minTrophies: 8500, maxTrophies: 8999, icon: "🥞", color: "from-yellow-500 to-orange-500", type: "fixed" },
  { id: 23, name: "Valkalla", minTrophies: 9000, maxTrophies: 9499, icon: "⚔️", color: "from-blue-500 to-purple-500", type: "fixed" },
  { id: 24, name: "Legendary Arena", minTrophies: 9500, maxTrophies: 9999, icon: "🏆", color: "from-gold to-yellow-600", type: "fixed" },
  
  // Arenas Sazonais (10.000 a 15.000+ troféus)
  { id: 25, name: "Lumberlove", minTrophies: 10000, maxTrophies: 10999, icon: "🪓", color: "from-green-500 to-brown-500", type: "seasonal", seasonNumber: 1 },
  { id: 26, name: "Magic Academy", minTrophies: 11000, maxTrophies: 11999, icon: "🎓", color: "from-purple-500 to-indigo-500", type: "seasonal", seasonNumber: 2 },
  { id: 27, name: "Rune Reliquary", minTrophies: 12000, maxTrophies: 13499, icon: "🔮", color: "from-violet-500 to-purple-600", type: "seasonal", seasonNumber: 3 },
  { id: 28, name: "Ultimate Clash", minTrophies: 13500, maxTrophies: 14999, icon: "⚡", color: "from-orange-500 to-red-500", type: "seasonal", seasonNumber: 4 },
  { id: 29, name: "Queen's Palace", minTrophies: 15000, maxTrophies: 99999, icon: "👸", color: "from-pink-400 to-purple-500", type: "seasonal", seasonNumber: 5 }
];

function getCurrentArena(trophies: number) {
  // Encontra a arena baseada nos troféus
  for (let i = ARENAS.length - 1; i >= 0; i--) {
    const arena = ARENAS[i];
    if (trophies >= arena.minTrophies) {
      return arena;
    }
  }
  return ARENAS[1]; // Goblin Stadium como fallback
}

function getNextArena(trophies: number) {
  const currentArena = getCurrentArena(trophies);
  const currentIndex = ARENAS.findIndex(arena => arena.id === currentArena.id);
  return currentIndex < ARENAS.length - 1 ? ARENAS[currentIndex + 1] : null;
}

function getTrophiesUntilNext(trophies: number) {
  const nextArena = getNextArena(trophies);
  return nextArena ? nextArena.minTrophies - trophies : 0;
}

function getArenaProgress(trophies: number) {
  const currentArena = getCurrentArena(trophies);
  if (currentArena.maxTrophies === 99999) return 100; // Arena máxima
  
  const progress = ((trophies - currentArena.minTrophies) / (currentArena.maxTrophies - currentArena.minTrophies)) * 100;
  return Math.min(100, Math.max(0, progress));
}

function getTrophyChangeRate(trophies: number) {
  // Arenas sazonais têm ±150 troféus por partida
  if (trophies >= 10000 && trophies < 15000) {
    return "±150 LP por partida";
  }
  // Arenas normais têm ±30 troféus
  return "±30 LP por partida";
}

interface LeagueInfoProps {
  player: any;
}

export default function LeagueInfo({ player }: LeagueInfoProps) {
  const currentArena = getCurrentArena(player.trophies);
  const nextArena = getNextArena(player.trophies);
  const trophiesUntilNext = getTrophiesUntilNext(player.trophies);
  const progress = getArenaProgress(player.trophies);
  const trophyChangeRate = getTrophyChangeRate(player.trophies);
  const winRate = player.wins && player.losses ? 
    Math.round((player.wins / (player.wins + player.losses)) * 100) : 0;

  return (
    <div className="bg-card-dark border border-border-dark rounded-xl p-6">
      <div className="flex items-center gap-4">
        {/* Arena Icon e Info */}
        <div className="relative">
          <div className={`w-16 h-16 bg-gradient-to-br ${currentArena.color} rounded-xl flex items-center justify-center text-2xl shadow-lg border-2 border-border-dark`}>
            {currentArena.icon}
          </div>
          <div className="absolute -bottom-1 -right-1 bg-gold text-black text-xs font-bold px-2 py-1 rounded-lg shadow-lg">
            {player.expLevel}
          </div>
          {currentArena.type === 'seasonal' && (
            <div className="absolute -top-1 -left-1 bg-purple-600 text-white text-xs font-bold px-1 py-0.5 rounded-md shadow-lg">
              S{currentArena.seasonNumber}
            </div>
          )}
        </div>

        {/* Informações da Arena */}
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-xl font-bold text-white">{currentArena.name}</h3>
            {currentArena.type === 'seasonal' && (
              <span className="text-xs bg-purple-600 text-white px-2 py-1 rounded-full font-bold">
                SAZONAL
              </span>
            )}
            <span className="text-sm text-gray-400">
              Arena {currentArena.id}
            </span>
          </div>
          
          <div className="text-lg font-bold text-gold mb-1">
            {player.trophies.toLocaleString()} LP
          </div>

          <div className="flex items-center gap-4 text-sm">
            <span className="text-gray-400">Win Rate {winRate}%</span>
            <span className="text-gray-500">•</span>
            <span className="text-gray-400">Melhor: {player.bestTrophies.toLocaleString()} LP</span>
            <span className="text-gray-500">•</span>
            <span className="text-gray-400">{trophyChangeRate}</span>
          </div>
        </div>

        {/* Próxima Arena */}
        <div className="text-right">
          {nextArena ? (
            <>
              <div className="text-sm text-gray-400 mb-1">Próxima Arena</div>
              <div className="flex items-center gap-2 mb-2">
                <div className={`w-8 h-8 bg-gradient-to-br ${nextArena.color} rounded-lg flex items-center justify-center text-sm relative`}>
                  {nextArena.icon}
                  {nextArena.type === 'seasonal' && (
                    <div className="absolute -top-1 -right-1 bg-purple-600 text-white text-xs font-bold w-4 h-4 rounded-full flex items-center justify-center">
                      S
                    </div>
                  )}
                </div>
                <div>
                  <div className="text-sm font-semibold text-white">{nextArena.name}</div>
                  <div className="text-xs text-gray-400">
                    {nextArena.minTrophies.toLocaleString()} LP
                  </div>
                </div>
              </div>
              <div className="text-lg font-bold text-royal">
                {trophiesUntilNext > 0 ? `${trophiesUntilNext.toLocaleString()} LP` : 'Alcançada!'}
              </div>
            </>
          ) : (
            <div className="text-center">
              <div className="text-sm text-gold mb-1">👸 Arena Máxima</div>
              <div className="text-lg font-bold text-gold">Queen's Palace</div>
              <div className="text-xs text-purple-400 mt-1">Modo Ranqueado Desbloqueado</div>
            </div>
          )}
        </div>
      </div>

      {/* Barra de Progresso da Arena */}
      <div className="mt-4">
        <div className="flex justify-between text-xs text-gray-400 mb-2">
          <span>{currentArena.minTrophies.toLocaleString()} LP</span>
          {nextArena && (
            <span>Faltam {trophiesUntilNext.toLocaleString()} LP para {nextArena.name}</span>
          )}
          <span>{currentArena.maxTrophies === 99999 ? '∞' : currentArena.maxTrophies.toLocaleString()} LP</span>
        </div>
        <div className="h-3 bg-bg-dark rounded-full overflow-hidden border border-border-dark">
          <div 
            className={`h-full bg-gradient-to-r ${currentArena.color} rounded-full transition-all duration-500 relative`}
            style={{ width: `${progress}%` }}
          >
            <div className="absolute inset-0 bg-white/20 rounded-full"></div>
          </div>
        </div>
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>{currentArena.name}</span>
          {nextArena && (
            <span>{nextArena.name}</span>
          )}
        </div>
      </div>

      {/* Informação especial para arenas sazonais */}
      {currentArena.type === 'seasonal' && (
        <div className="mt-4 bg-purple-900/20 border border-purple-900/50 rounded-lg p-3">
          <div className="flex items-center gap-2 text-purple-300 text-sm">
            <span className="text-purple-400">⚡</span>
            <span className="font-semibold">Arena Sazonal Ativa</span>
          </div>
          <div className="text-xs text-purple-200 mt-1">
            Ganhe/perca ±150 LP por partida • Rotaciona a cada temporada
          </div>
          {currentArena.seasonNumber === 5 && (
            <div className="text-xs text-gold mt-1">
              🏆 Modo Ranqueado desbloqueado em 15.000+ LP
            </div>
          )}
        </div>
      )}
    </div>
  );
}