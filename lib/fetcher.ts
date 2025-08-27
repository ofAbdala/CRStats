// lib/fetcher.ts
export async function fetchWithRetry(
  url: string,
  init: RequestInit = {},
  opts: { timeoutMs?: number; retries?: number } = {}
) {
  const timeoutMs = opts.timeoutMs ?? 10000; // 10s
  const retries = opts.retries ?? 2;

  for (let attempt = 0; attempt <= retries; attempt++) {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), timeoutMs);

    try {
      const res = await fetch(url, {
        ...init,
        // evita caches e streaming problemáticos em ambientes restritos
        cache: 'no-store',
        signal: ctrl.signal,
        headers: {
          Accept: 'application/json',
          // um UA explícito ajuda alguns proxies/firewalls
          'User-Agent': 'clash-next/1.0',
          ...(init.headers || {}),
        },
      });
      clearTimeout(t);

      if (!res.ok) {
        // status HTTP ruim: não é erro de rede, retorna para tratamento
        return res;
      }
      return res;
    } catch (err) {
      clearTimeout(t);
      // Erro de rede / timeout: só dá retry se ainda houver tentativas
      if (attempt === retries) throw err;
      // backoff simples com jitter
      const wait = 300 * (attempt + 1) + Math.floor(Math.random() * 200);
      await new Promise(r => setTimeout(r, wait));
    }
  }
  // nunca chega aqui
  throw new Error('unreachable');
}