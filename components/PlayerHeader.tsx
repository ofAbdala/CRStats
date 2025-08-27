'use client';

export default function PlayerHeader({ player }: { player: any }) {
  return (
    <div className="bg-card-dark border border-border-dark rounded-2xl p-4 flex items-center gap-4">
      <img src="https://cdn.statsroyale.com/images/arenas/full/arena12.png" alt="arena" className="w-20 h-20 rounded-xl" />
      <div className="flex-1">
        <div className="text-2xl font-bold">{player.name} <span className="text-sm text-gray-400">#{player.tag}</span></div>
        <div className="text-gray-400 text-sm">{player.clan || 'Sem clã'} • {player.arena}</div>
      </div>
      <div className="text-2xl font-bold text-gold">{player.trophies}</div>
    </div>
  );
}