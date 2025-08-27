'use client';

export default function SummaryCards({ player, summary }: { player: any; summary: any }) {
  const Card = ({ title, value, hint }: any) => (
    <div className="bg-card-dark border border-border-dark rounded-xl p-4">
      <div className="text-xs uppercase text-gray-400">{title}</div>
      <div className="text-2xl font-bold mt-1">{value}</div>
      {hint && <div className="text-xs text-gray-500 mt-1">{hint}</div>}
    </div>
  );

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      <Card title="Win Rate (janela)" value={`${summary.winRate}%`} hint={`${summary.wins}W / ${summary.losses}L`} />
      <Card title="3 Coroas (total)" value={player.threeCrownWins} />
      <Card title="Melhor" value={player.bestTrophies} />
      <Card title="Δ Push" value={(summary.trophyDelta > 0 ? '+' : '') + summary.trophyDelta} hint={`${summary.matchesTotal} partidas`} />
    </div>
  );
}