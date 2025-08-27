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
    <div className="min-h-screen bg-bg-primary">
      {/* Navigation Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-bg-secondary/95 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 px-6 py-4">
            <div className="w-8 h-8 bg-gradient-to-br from-royal to-purple rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">CR</span>
            </div>
            <div className="font-bold text-xl text-text-primary">ClashDex</div>
          </div>
          
          <form onSubmit={onSearch} className="flex items-center gap-3 px-6 py-4">
            <div className="relative">
              <input 
                name="tag" 
                defaultValue={tag}
                placeholder="Digite a TAG (#XXXXXXX)"
                className="px-4 py-2.5 rounded-lg bg-bg-tertiary border border-border text-text-primary placeholder-text-muted w-72 focus:outline-none focus:ring-2 focus:ring-royal focus:border-transparent transition-all"
              />
            </div>
            <button className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-royal to-royal-dark text-white font-medium hover:from-royal-light hover:to-royal transition-all duration-200 shadow-lg">
              Buscar
            </button>
          </form>
          
          <div className="px-6 py-4">
            <div className="text-xs text-text-muted">Supercell API</div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-6 space-y-6">
        {loading && (

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

      <footer className="border-t border-border-dark bg-card-dark px-4 py-5 text-center text-xs text-gray-400">
        UI inspirada no deep.gg • Clash Royale theme • Next.js + Supercell API
      </footer>
    </div>
  );
}