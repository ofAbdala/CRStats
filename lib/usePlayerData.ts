import { useState, useCallback } from 'react';
import { usePolling } from '@/lib/usePolling';

async function fetchJson(url: string) {
  try {
    const r = await fetch(url, { cache: 'no-store' });
    if (!r.ok) throw new Error(await r.text());
    return r.json();
  } catch (e: any) {
    if (e?.name === 'AbortError') {
      return null;
    }
    throw e;
  }
}

// Normalize player tag (remove # and convert to uppercase)
function normalizeTag(tag: string): string {
  return tag.replace(/^#/, '').toUpperCase();
}

export function usePlayerData(defaultTag: string) {
  const [tag, setTag] = useState<string>('');
  const [player, setPlayer] = useState<any>(null);
  const [summary, setSummary] = useState<any>(null);
  const [battles, setBattles] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [err, setErr] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  const load = useCallback(async (t: string) => {
    setLoading(true);
    setErr(null);
    try {
      const normalizedTag = normalizeTag(t);
      const [p, s, b] = await Promise.all([
        fetchJson(`/api/player/${normalizedTag}`),
        fetchJson(`/api/player/${normalizedTag}/summary?last=20`),
        fetchJson(`/api/player/${normalizedTag}/battles?last=20`)
      ]);
      setPlayer(p);
      setSummary(s);
      setBattles(b);
      setLastUpdated(new Date());
      setTag(normalizedTag);
      return true;
    } catch (e: any) {
      setErr(e.message || 'Falha na análise');
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshData = useCallback(async () => {
    if (!tag || loading) return;
    setIsRefreshing(true);
    try {
      const normalizedTag = normalizeTag(tag);
      const [p, s, b] = await Promise.all([
        fetchJson(`/api/player/${normalizedTag}`),
        fetchJson(`/api/player/${normalizedTag}/summary?last=20`),
        fetchJson(`/api/player/${normalizedTag}/battles?last=20`)
      ]);
      setPlayer(p);
      setSummary(s);
      setBattles(b);
      setLastUpdated(new Date());
    } finally {
      setIsRefreshing(false);
    }
  }, [tag, loading]);

  return {
    tag,
    setTag,
    player,
    summary,
    battles,
    loading,
    err,
    lastUpdated,
    isRefreshing,
    load,
    refreshData
  };
}
