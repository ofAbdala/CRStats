// Sistema completo de arenas do Clash Royale com nomes corretos das arenas
const ARENAS = [
  { id: 1, name: "Training Camp", minTrophies: 0, maxTrophies: 99, icon: "🏕️", color: "from-gray-400 to-gray-600" },
  { id: 2, name: "Goblin Stadium", minTrophies: 100, maxTrophies: 399, icon: "👹", color: "from-green-400 to-green-600" },
  { id: 3, name: "Bone Pit", minTrophies: 400, maxTrophies: 799, icon: "💀", color: "from-orange-400 to-orange-600" },
  { id: 4, name: "Barbarian Bowl", minTrophies: 800, maxTrophies: 1099, icon: "🪓", color: "from-red-400 to-red-600" },
  { id: 5, name: "P.E.K.K.A's Playhouse", minTrophies: 1100, maxTrophies: 1399, icon: "🤖", color: "from-purple-400 to-purple-600" },
  { id: 6, name: "Royal Arena", minTrophies: 1400, maxTrophies: 1699, icon: "👑", color: "from-blue-400 to-blue-600" },
  { id: 7, name: "Frozen Peak", minTrophies: 1700, maxTrophies: 1999, icon: "🏔️", color: "from-cyan-400 to-cyan-600" },
  { id: 8, name: "Jungle Arena", minTrophies: 2000, maxTrophies: 2299, icon: "🌿", color: "from-green-500 to-green-700" },
  { id: 9, name: "Hog Mountain", minTrophies: 2300, maxTrophies: 2599, icon: "🐗", color: "from-orange-500 to-orange-700" },
  { id: 10, name: "Electro Valley", minTrophies: 2600, maxTrophies: 2999, icon: "⚡", color: "from-yellow-400 to-yellow-600" },
  { id: 11, name: "Spooky Town", minTrophies: 3000, maxTrophies: 3299, icon: "🎃", color: "from-purple-500 to-purple-700" },
  { id: 12, name: "Rascal's Hideout", minTrophies: 3300, maxTrophies: 3599, icon: "🏴‍☠️", color: "from-red-500 to-red-700" },
  { id: 13, name: "Serenity Peak", minTrophies: 3600, maxTrophies: 3999, icon: "🏯", color: "from-indigo-400 to-indigo-600" },
  { id: 14, name: "Miner's Mine", minTrophies: 4000, maxTrophies: 4299, icon: "⛏️", color: "from-amber-500 to-amber-700" },
  { id: 15, name: "Executioner's Kitchen", minTrophies: 4300, maxTrophies: 4599, icon: "🪓", color: "from-red-600 to-red-800" },
  { id: 16, name: "Royal Crypt", minTrophies: 4600, maxTrophies: 4999, icon: "⚰️", color: "from-gray-600 to-gray-800" },
  { id: 17, name: "Silent Sanctuary", minTrophies: 5000, maxTrophies: 5299, icon: "🕯️", color: "from-blue-600 to-blue-800" },
  { id: 18, name: "Dragon Spa", minTrophies: 5300, maxTrophies: 5599, icon: "🐲", color: "from-green-600 to-green-800" },
  { id: 19, name: "Electro Wizard's Lair", minTrophies: 5600, maxTrophies: 5999, icon: "🧙‍♂️", color: "from-purple-600 to-purple-800" },
  { id: 20, name: "Legendary Arena", minTrophies: 6000, maxTrophies: 6499, icon: "🏆", color: "from-yellow-500 to-yellow-700" },
  
  // Ligas com nomes das arenas (não ranks)
  { id: 21, name: "Challenger", minTrophies: 6500, maxTrophies: 6999, icon: "⚔️", color: "from-cyan-500 to-cyan-700" },
  { id: 22, name: "Master", minTrophies: 7000, maxTrophies: 7499, icon: "🛡️", color: "from-blue-500 to-blue-700" },
  { id: 23, name: "Champion", minTrophies: 7500, maxTrophies: 7999, icon: "👑", color: "from-purple-500 to-purple-700" },
  { id: 24, name: "Grand Champion", minTrophies: 8000, maxTrophies: 8499, icon: "🏅", color: "from-gold to-yellow-600" },
  { id: 25, name: "Royal Champion", minTrophies: 8500, maxTrophies: 8999, icon: "👑", color: "from-orange-500 to-red-500" },
  { id: 26, name: "Ultimate Champion", minTrophies: 9000, maxTrophies: 9499, icon: "🏆", color: "from-purple-500 to-pink-500" },
  { id: 27, name: "Legendary Champion", minTrophies: 9500, maxTrophies: 99999, icon: "🌟", color: "from-yellow-400 to-orange-500" }
];

function getCurrentArena(trophies: number) {
  return ARENAS.find(arena => trophies >= arena.minTrophies && trophies <= arena.maxTrophies) || ARENAS[ARENAS.length - 1];
}

function getNextArena(trophies: number) {
  const currentArena = getCurrentArena(trophies);
  const nextArenaIndex = ARENAS.findIndex(arena => arena.id === currentArena.id) + 1;
  return nextArenaIndex < ARENAS.length ? ARENAS[nextArenaIndex] : null;
}

function getTrophiesUntilNext(trophies: number) {
  const nextArena = getNextArena(trophies);
  return nextArena ? nextArena.minTrophies - trophies : 0;
}

function getArenaProgress(trophies: number) {
  const currentArena = getCurrentArena(trophies);
  const progress = ((trophies - currentArena.minTrophies) / (currentArena.maxTrophies - currentArena.minTrophies)) * 100;
  return Math.min(100, Math.max(0, progress));
}

interface LeagueInfoProps {
  player: any;
}

export default function LeagueInfo({ player }: LeagueInfoProps) {
  const currentArena = getCurrentArena(player.trophies);
  const nextArena = getNextArena(player.trophies);
  const trophiesUntilNext = getTrophiesUntilNext(player.trophies);
  const progress = getArenaProgress(player.trophies);
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
        </div>

        {/* Informações da Arena */}
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-xl font-bold text-white">{currentArena.name}</h3>
            <span className="text-sm text-gray-400">
              {currentArena.minTrophies.toLocaleString()} - {currentArena.maxTrophies === 99999 ? '∞' : currentArena.maxTrophies.toLocaleString()} LP
            </span>
          </div>
          
          <div className="text-lg font-bold text-gold mb-1">
            {player.trophies.toLocaleString()} LP
          </div>

          <div className="flex items-center gap-4 text-sm">
            <span className="text-gray-400">Win Rate {winRate}%</span>
            <span className="text-gray-500">•</span>
            <span className="text-gray-400">Melhor: {player.bestTrophies.toLocaleString()} LP</span>
          </div>
        </div>

        {/* Próxima Arena */}
        <div className="text-right">
          {nextArena ? (
            <>
              <div className="text-sm text-gray-400 mb-1">Próxima Arena</div>
              <div className="flex items-center gap-2 mb-2">
                <div className={`w-8 h-8 bg-gradient-to-br ${nextArena.color} rounded-lg flex items-center justify-center text-sm`}>
                  {nextArena.icon}
                </div>
                <div>
                  <div className="text-sm font-semibold text-white">{nextArena.name}</div>
                  <div className="text-xs text-gray-400">
                    {nextArena.minTrophies.toLocaleString()} LP
                  </div>
                </div>
              </div>
              <div className="text-lg font-bold text-royal">
                {trophiesUntilNext > 0 ? `${trophiesUntilNext} LP` : 'Alcançada!'}
              </div>
            </>
          ) : (
            <div className="text-center">
              <div className="text-sm text-gold mb-1">🏆 Arena Máxima</div>
              <div className="text-lg font-bold text-gold">Legendary Champion</div>
            </div>
          )}
        </div>
      </div>

      {/* Barra de Progresso da Arena */}
      <div className="mt-4">
        <div className="flex justify-between text-xs text-gray-400 mb-2">
          <span>{currentArena.minTrophies.toLocaleString()} LP</span>
          {nextArena && (
            <span>Faltam {trophiesUntilNext} LP para {nextArena.name}</span>
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
    </div>
  );
}