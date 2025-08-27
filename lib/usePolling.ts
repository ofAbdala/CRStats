import { useEffect, useRef } from 'react';

export function usePolling(fn: () => Promise<any> | void, intervalMs: number | string | undefined) {
  const ref = useRef<number | null>(null);

  useEffect(() => {
    const n = Number(intervalMs ?? 0);
    if (!Number.isFinite(n) || n <= 0) return;

    async function tick() { 
      try { 
        await fn(); 
      } catch (error) {
        console.warn('Polling error:', error);
      }
    }
    
    tick();

    ref.current = window.setInterval(() => { void tick(); }, n);

    return () => { 
      if (ref.current) {
        clearInterval(ref.current);
        ref.current = null;
      }
    };
  }, [fn, intervalMs]);
}