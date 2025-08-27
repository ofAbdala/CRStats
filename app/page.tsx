'use client';

// Timer shims to prevent t._onTimeout errors in Bolt environment
if (typeof window !== 'undefined') {
  const _setInterval = window.setInterval;
  const _setTimeout = window.setTimeout;

  window.setInterval = ((handler: TimerHandler, timeout?: number, ...args: any[]) => {
    if (typeof handler !== 'function') {
      const fn = () => (handler as any)?.();
      return _setInterval(fn, Number(timeout) || 0, ...args);
    }
    return _setInterval(handler, Number(timeout) || 0, ...args);
  }) as typeof window.setInterval;

  window.setTimeout = ((handler: TimerHandler, timeout?: number, ...args: any[]) => {
    if (typeof handler !== 'function') {
      const fn = () => (handler as any)?.();
      return _setTimeout(fn, Number(timeout) || 0, ...args);
    }
    return _setTimeout(handler, Number(timeout) || 0, ...args);
  }) as typeof window.setTimeout;
}

import { useEffect, useState } from 'react';
import PlayerHeader from '@/components/PlayerHeader';
import SummaryCards from '@/components/SummaryCards';
import TrophyChart from '@/components/TrophyChart';
import BattleHistory from '@/components/BattleHistory';
import CurrentPush from '@/components/CurrentPush';

async function fetchJson(url: string) {
  const r = await fetch(url, { cache: 'no-store' });
  if (!r.ok) throw new Error(await r.text());
  return r.json();
}

export default function Page() {
  const defaultTag = 'U9UUCCQ';
  const [tag, setTag] = useState<string>(defaultTag);
  const [player, setPlayer] = useState<any>(null);
  const [summary, setSummary] = useState<any>(null);
  const [battles, setBattles] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [err, setErr] = useState<string | null>(null);

  async function load(t: string) {
    setLoading(true); setErr(null);
    try {
      const [p, s, b] = await Promise.all([
        fetchJson(`/api/player/${t}`),
        fetchJson(`/api/player/${t}/summary?last=20`),
        fetchJson(`/api/player/${t}/battles?last=20`)
      ]);
      setPlayer(p); setSummary(s); setBattles(b);
    } catch (e: any) {
      setErr(e.message || 'Erro');
    } finally { setLoading(false); }
  }

  useEffect(() => { load(tag); }, []);

  function onSearch(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const input = form.querySelector('input[name="tag"]') as HTMLInputElement;
    const clean = input.value.replace(/^#/, '').trim().toUpperCase();
    if (clean) { setTag(clean); load(clean); }
  }

  return (
    <div className="min-h-screen bg-bg-dark">
      {/* Header Navigation */}
      <header className="border-b border-border-dark bg-card-dark/95 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 py-4 px-6">
            <div className="w-8 h-8 bg-gradient-to-br from-royal to-purple rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">CR</span>
            </div>
            <div className="font-bold text-xl text-white">ClashDex</div>
          </div>
          
          <form onSubmit={onSearch} className="flex items-center gap-3 py-4 px-6">
            <div className="relative">
              <input 
                name="tag" 
                defaultValue={tag}
                placeholder="Digite a TAG (#XXXXXXX)"
                className="px-4 py-2.5 rounded-lg bg-card-dark border border-border-dark text-white w-80 focus:border-royal focus:outline-none transition-colors placeholder:text-gray-500"
              />
            </div>
            <button className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-royal to-purple hover:from-royal/90 hover:to-purple/90 text-white font-medium transition-all duration-200 shadow-lg">
              Buscar
            </button>
          </form>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-6 space-y-6">
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="flex items-center gap-3 text-gray-400">
              <div className="w-5 h-5 border-2 border-royal border-t-transparent rounded-full animate-spin"></div>
              <span>Carregando dados do jogador...</span>
            </div>
          </div>
        )}
        
        {err && (
          <div className="bg-rose-900/20 border border-rose-900/50 rounded-xl p-4 text-rose-400">
            <div className="font-medium">Erro ao carregar dados</div>
            <div className="text-sm text-rose-300 mt-1">{err}</div>
          </div>
        )}

        {player && <PlayerHeader player={player} />}
        {player && summary && (
          <>
            <SummaryCards player={player} summary={summary} />
            <CurrentPush summary={summary} />
            <TrophyChart series={summary.series} />
            <BattleHistory battles={battles} />
          </>
        )}
      </main>

      <footer className="border-t border-border-dark bg-card-dark/50 mt-12">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-400">
              Powered by <span className="text-royal">Supercell API</span> • Inspired by deep.gg
            </div>
            <div className="text-xs text-gray-500">
              Next.js • Tailwind CSS • Recharts
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}