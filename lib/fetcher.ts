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
      console.log(`Fetch attempt ${attempt + 1}/${retries + 1} to: ${url}`);
      const res = await fetch(url, {
        ...init,
        // evita caches e streaming problemáticos em ambientes restritos
        cache: 'no-store',
        signal: ctrl.signal,
        headers: {
          Accept: 'application/json',
          // um UA explícito ajuda alguns proxies/firewalls
          'User-Agent': 'clash-next/1.0',
          'Connection': 'close',
          ...(init.headers || {}),
        },
      });
      clearTimeout(t);

      if (!res.ok) {
        // status HTTP ruim: não é erro de rede, retorna para tratamento
        console.log(`HTTP ${res.status} response from ${url}`);
        return res;
      }
      console.log(`Successful response from ${url}`);
      return res;
    } catch (err) {
      clearTimeout(t);
      console.error(`Fetch attempt ${attempt + 1} failed:`, err);
      // Erro de rede / timeout: só dá retry se ainda houver tentativas
      if (attempt === retries) throw err;
      // backoff simples com jitter
      const wait = 300 * (attempt + 1) + Math.floor(Math.random() * 200);
      console.log(`Retrying in ${wait}ms...`);
      await new Promise(r => setTimeout(r, wait));
    }
  }
  // nunca chega aqui
  throw new Error('unreachable');
}