export async function fetchWithRetry(
  url: string,
  init: RequestInit = {},
  opts: { timeoutMs?: number; retries?: number } = {}
) {
  const timeoutMs = opts.timeoutMs ?? 10000;
  const retries = opts.retries ?? 2;

  for (let attempt = 0; attempt <= retries; attempt++) {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), timeoutMs);
    try {
      const res = await fetch(url, {
        ...init,
        cache: 'no-store',
        signal: ctrl.signal,
        headers: {
          Accept: 'application/json',
          'User-Agent': 'clash-next/1.0',
          ...(init.headers || {}),
        },
      });
      clearTimeout(t);
      return res;
    } catch (e) {
      clearTimeout(t);
      if (attempt === retries) throw e;
      const wait = 300 * (attempt + 1) + Math.floor(Math.random() * 200);
      await new Promise((r) => setTimeout(r, wait));
    }
  }
  throw new Error('unreachable');
}