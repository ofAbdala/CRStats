'use client';

export default function SummaryCards({ player, summary }: { player: any; summary: any }) {
  const Card = ({ title, value, hint, color = 'text-white', icon }: any) => (
    <div className="bg-card-dark border border-border-dark rounded-xl p-5 hover:border-royal/50 transition-all duration-200 group">
      <div className="flex items-center justify-between mb-3">
        <div className="text-xs uppercase text-gray-400 font-medium tracking-wider">{title}</div>
        {icon && <div className="text-gray-500 group-hover:text-royal transition-colors">{icon}</div>}
      </div>
      <div className={`text-3xl font-bold ${color} mb-1`}>{value}</div>
      {hint && <div className="text-xs text-gray-500">{hint}</div>}
    </div>
  );

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <Card 
        title="Win Rate" 
        value={`${summary.winRate}%`} 
        hint={`${summary.wins}W / ${summary.losses}L`}
        color={summary.winRate >= 60 ? 'text-emerald-400' : summary.winRate >= 50 ? 'text-gold' : 'text-rose-400'}
        icon="🏆"
      />
      <Card 
        title="3 Coroas" 
        value={player.threeCrownWins?.toLocaleString() || '0'} 
        color="text-gold"
        icon="👑"
      />
      <Card 
        title="Melhor Temporada" 
        value={player.bestTrophies?.toLocaleString() || '0'} 
        color="text-purple"
        icon="⭐"
      />
      <Card 
        title="Push Atual" 
        value={(summary.trophyDelta > 0 ? '+' : '') + summary.trophyDelta} 
        hint={`${summary.matchesTotal} partidas`}
        color={summary.trophyDelta > 0 ? 'text-emerald-400' : summary.trophyDelta < 0 ? 'text-rose-400' : 'text-gray-400'}
        icon="📈"
      />
    </div>
  );
}