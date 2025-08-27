'use client';

export default function PlayerHeader({ player }: { player: any }) {
  return (
    <div className="bg-gradient-to-r from-card-dark to-card-dark/80 border border-border-dark rounded-2xl p-6 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-royal/10 to-transparent rounded-full -translate-y-8 translate-x-8"></div>
      
      <div className="relative flex items-center gap-6">
        <div className="relative">
          <div className="w-24 h-24 rounded-2xl border-2 border-border-dark shadow-xl bg-gradient-to-br from-royal to-purple flex items-center justify-center">
            <div className="text-4xl">🏟️</div>
          </div>
          <div className="absolute -bottom-2 -right-2 bg-gradient-to-r from-gold to-yellow-400 text-black text-xs font-bold px-2 py-1 rounded-lg shadow-lg">
            {player.expLevel}
          </div>
        </div>
        
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold text-white">{player.name}</h1>
            <span className="text-lg text-gray-400 font-mono">#{player.tag}</span>
          </div>
          
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-royal rounded-full"></div>
              <span className="text-gray-300">{player.arena || 'Arena Desconhecida'}</span>
            </div>
            {player.clan && (
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple rounded-full"></div>
                <span className="text-gray-300">{player.clan}</span>
              </div>
            )}
          </div>
        </div>
        
        <div className="text-right">
          <div className="text-4xl font-bold text-gold mb-1">{player.trophies.toLocaleString()}</div>
          <div className="text-sm text-gray-400">Troféus Atuais</div>
          <div className="text-xs text-gray-500 mt-1">Melhor: {player.bestTrophies.toLocaleString()}</div>
          <div className="text-xs text-gray-500 mt-2">
            Atualizado: {new Date().toLocaleString('pt-BR', { 
              timeZone: 'America/Sao_Paulo',
              day: '2-digit',
              month: '2-digit', 
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </div>
        </div>
      </div>
    </div>
  );
}