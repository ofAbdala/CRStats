// lib/arenas.ts
export interface Arena {
  id: number;
  name: string;
  minTrophies: number;
  maxTrophies: number;
  type: 'fixed' | 'seasonal' | 'competitive';
  colors: {
    bg: string;
    text: string;
    badge: string;
  };
}

export const ARENAS: Arena[] = [
  // Arenas Fixas (0 a 10.000 troféus)
  { id: 0, name: "Training Camp", minTrophies: 0, maxTrophies: 299, type: 'fixed', colors: { bg: 'bg-gradient-to-br from-gray-600 to-gray-800', text: 'text-gray-400', badge: 'bg-gray-600' } },
  { id: 1, name: "Goblin Stadium", minTrophies: 0, maxTrophies: 299, type: 'fixed', colors: { bg: 'bg-gradient-to-br from-green-500 to-emerald-600', text: 'text-green-400', badge: 'bg-green-500' } },
  { id: 2, name: "Bone Pit", minTrophies: 300, maxTrophies: 599, type: 'fixed', colors: { bg: 'bg-gradient-to-br from-gray-600 to-gray-800', text: 'text-gray-400', badge: 'bg-gray-600' } },
  { id: 3, name: "Barbarian Bowl", minTrophies: 600, maxTrophies: 999, type: 'fixed', colors: { bg: 'bg-gradient-to-br from-orange-500 to-red-600', text: 'text-orange-400', badge: 'bg-orange-500' } },
  { id: 4, name: "Spell Valley", minTrophies: 1000, maxTrophies: 1299, type: 'fixed', colors: { bg: 'bg-gradient-to-br from-purple to-pink-600', text: 'text-purple', badge: 'bg-purple' } },
  { id: 5, name: "Builder's Workshop", minTrophies: 1300, maxTrophies: 1599, type: 'fixed', colors: { bg: 'bg-gradient-to-br from-amber-500 to-orange-600', text: 'text-amber-400', badge: 'bg-amber-500' } },
  { id: 6, name: "P.E.K.K.A's Playhouse", minTrophies: 1600, maxTrophies: 1999, type: 'fixed', colors: { bg: 'bg-gradient-to-br from-gray-600 to-gray-800', text: 'text-gray-400', badge: 'bg-gray-600' } },
  { id: 7, name: "Royal Arena", minTrophies: 2000, maxTrophies: 2299, type: 'fixed', colors: { bg: 'bg-gradient-to-br from-blue-500 to-indigo-600', text: 'text-blue-400', badge: 'bg-blue-500' } },
  { id: 8, name: "Frozen Peak", minTrophies: 2300, maxTrophies: 2599, type: 'fixed', colors: { bg: 'bg-gradient-to-br from-cyan-400 to-blue-600', text: 'text-cyan-400', badge: 'bg-cyan-400' } },
  { id: 9, name: "Jungle Arena", minTrophies: 2600, maxTrophies: 2999, type: 'fixed', colors: { bg: 'bg-gradient-to-br from-green-500 to-emerald-600', text: 'text-green-400', badge: 'bg-green-500' } },
  { id: 10, name: "Hog Mountain", minTrophies: 3000, maxTrophies: 3399, type: 'fixed', colors: { bg: 'bg-gradient-to-br from-orange-500 to-red-600', text: 'text-orange-400', badge: 'bg-orange-500' } },
  { id: 11, name: "Electro Valley", minTrophies: 3400, maxTrophies: 3799, type: 'fixed', colors: { bg: 'bg-gradient-to-br from-cyan-400 to-blue-600', text: 'text-cyan-400', badge: 'bg-cyan-400' } },
  { id: 12, name: "Spooky Town", minTrophies: 3800, maxTrophies: 4199, type: 'fixed', colors: { bg: 'bg-gradient-to-br from-purple to-pink-600', text: 'text-purple', badge: 'bg-purple' } },
  { id: 13, name: "Rascal's Hideout", minTrophies: 4200, maxTrophies: 4599, type: 'fixed', colors: { bg: 'bg-gradient-to-br from-orange-500 to-red-600', text: 'text-orange-400', badge: 'bg-orange-500' } },
  { id: 14, name: "Serenity Peak", minTrophies: 4600, maxTrophies: 4999, type: 'fixed', colors: { bg: 'bg-gradient-to-br from-blue-500 to-indigo-600', text: 'text-blue-400', badge: 'bg-blue-500' } },
  { id: 15, name: "Miner's Mine", minTrophies: 5000, maxTrophies: 5499, type: 'fixed', colors: { bg: 'bg-gradient-to-br from-amber-500 to-orange-600', text: 'text-amber-400', badge: 'bg-amber-500' } },
  { id: 16, name: "Executioner's Kitchen", minTrophies: 5500, maxTrophies: 5999, type: 'fixed', colors: { bg: 'bg-gradient-to-br from-red-600 to-red-800', text: 'text-red-400', badge: 'bg-red-600' } },
  { id: 17, name: "Royal Crypt", minTrophies: 6000, maxTrophies: 6499, type: 'fixed', colors: { bg: 'bg-gradient-to-br from-blue-500 to-indigo-600', text: 'text-blue-400', badge: 'bg-blue-500' } },
  { id: 18, name: "Silent Sanctuary", minTrophies: 6500, maxTrophies: 6999, type: 'fixed', colors: { bg: 'bg-gradient-to-br from-gray-600 to-gray-800', text: 'text-gray-400', badge: 'bg-gray-600' } },
  { id: 19, name: "Dragon Spa", minTrophies: 7000, maxTrophies: 7499, type: 'fixed', colors: { bg: 'bg-gradient-to-br from-red-500 to-red-700', text: 'text-red-400', badge: 'bg-red-500' } },
  { id: 20, name: "Boot Camp", minTrophies: 7500, maxTrophies: 7999, type: 'fixed', colors: { bg: 'bg-gradient-to-br from-green-600 to-green-800', text: 'text-green-400', badge: 'bg-green-600' } },
  { id: 21, name: "Clash Fest", minTrophies: 8000, maxTrophies: 8499, type: 'fixed', colors: { bg: 'bg-gradient-to-br from-pink-500 to-pink-700', text: 'text-pink-400', badge: 'bg-pink-500' } },
  { id: 22, name: "PANCAKES!", minTrophies: 8500, maxTrophies: 8999, type: 'fixed', colors: { bg: 'bg-gradient-to-br from-yellow-400 to-yellow-600', text: 'text-yellow-400', badge: 'bg-yellow-500' } },
  { id: 23, name: "Valkalla", minTrophies: 9000, maxTrophies: 9499, type: 'fixed', colors: { bg: 'bg-gradient-to-br from-violet-500 to-purple', text: 'text-violet-400', badge: 'bg-violet-500' } },
  { id: 24, name: "Legendary Arena", minTrophies: 9500, maxTrophies: 9999, type: 'fixed', colors: { bg: 'bg-gradient-to-br from-gold to-yellow-500', text: 'text-gold', badge: 'bg-gold' } },

  // Arenas Sazonais (10.000+ troféus)
  { id: 25, name: "Lumberlove", minTrophies: 10000, maxTrophies: 10999, type: 'seasonal', colors: { bg: 'bg-gradient-to-br from-green-400 to-green-700', text: 'text-green-400', badge: 'bg-green-500' } },
  { id: 26, name: "Magic Academy", minTrophies: 11000, maxTrophies: 11999, type: 'seasonal', colors: { bg: 'bg-gradient-to-br from-blue-400 to-blue-800', text: 'text-blue-400', badge: 'bg-blue-500' } },
  { id: 27, name: "Rune Reliquary", minTrophies: 12000, maxTrophies: 13499, type: 'seasonal', colors: { bg: 'bg-gradient-to-br from-purple to-indigo-600', text: 'text-purple', badge: 'bg-purple' } },
  { id: 28, name: "Ultimate Clash", minTrophies: 13500, maxTrophies: 14999, type: 'seasonal', colors: { bg: 'bg-gradient-to-br from-red-500 to-red-800', text: 'text-red-400', badge: 'bg-red-500' } },
  { id: 29, name: "Queen's Palace", minTrophies: 15000, maxTrophies: 999999, type: 'competitive', colors: { bg: 'bg-gradient-to-br from-gold to-amber-700', text: 'text-gold', badge: 'bg-gold' } },
];

export function getArenaByTrophies(trophies: number): Arena {
  // Encontra a arena baseada nos troféus
  for (let i = ARENAS.length - 1; i >= 0; i--) {
    const arena = ARENAS[i];
    if (trophies >= arena.minTrophies) {
      return arena;
    }
  }
  
  // Fallback para Training Camp se não encontrar
  return ARENAS[0];
}

export function getNextArena(currentTrophies: number): Arena | null {
  const currentArena = getArenaByTrophies(currentTrophies);
  const nextArenaIndex = ARENAS.findIndex(arena => arena.id === currentArena.id) + 1;
  
  if (nextArenaIndex < ARENAS.length) {
    return ARENAS[nextArenaIndex];
  }
  
  return null; // Já está na arena máxima
}

export function getArenaProgress(trophies: number): { current: Arena; next: Arena | null; progress: number } {
  const current = getArenaByTrophies(trophies);
  const next = getNextArena(trophies);
  
  let progress = 0;
  if (next) {
    const rangeSize = next.minTrophies - current.minTrophies;
    const currentProgress = trophies - current.minTrophies;
    progress = Math.min(100, Math.max(0, (currentProgress / rangeSize) * 100));
  } else {
    // Se não há próxima arena, considera 100% de progresso
    progress = 100;
  }
  
  return { current, next, progress };
}

export function getArenaEmoji(arena: Arena): string {
  const name = arena.name.toLowerCase();
  
  if (name.includes('training')) return '🎯';
  if (name.includes('goblin')) return '👺';
  if (name.includes('bone')) return '💀';
  if (name.includes('barbarian')) return '🪓';
  if (name.includes('spell')) return '✨';
  if (name.includes('builder')) return '🔨';
  if (name.includes('pekka')) return '🤖';
  if (name.includes('royal')) return '👑';
  if (name.includes('frozen')) return '❄️';
  if (name.includes('jungle')) return '🌿';
  if (name.includes('hog')) return '🐗';
  if (name.includes('electro')) return '⚡';
  if (name.includes('spooky')) return '👻';
  if (name.includes('rascal')) return '🎭';
  if (name.includes('serenity')) return '🧘';
  if (name.includes('miner')) return '⛏️';
  if (name.includes('executioner')) return '🪓';
  if (name.includes('crypt')) return '⚰️';
  if (name.includes('silent')) return '🤫';
  if (name.includes('dragon')) return '🐲';
  if (name.includes('boot')) return '👢';
  if (name.includes('clash fest')) return '🎪';
  if (name.includes('pancakes')) return '🥞';
  if (name.includes('valkalla')) return '⚔️';
  if (name.includes('legendary')) return '🏆';
  if (name.includes('lumberlove')) return '🪵';
  if (name.includes('magic')) return '🎩';
  if (name.includes('rune')) return '🔮';
  if (name.includes('ultimate')) return '💎';
  if (name.includes('queen')) return '👸';
  
  return '🏟️'; // Default
}