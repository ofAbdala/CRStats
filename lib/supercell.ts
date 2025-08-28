export function baseURL() {
  // Padrão = proxy (ótimo para Bolt/produção)
  const v = process.env.USE_PROXY;
  if (v === 'false') return 'https://api.clashroyale.com/v1';
  return 'https://proxy.royaleapi.dev/v1';
}

export function encodeTag(tag: string) {
  return `%23${String(tag).replace(/^#/, '').toUpperCase()}`;
}

export function authHeaders() {
  if (!process.env.SUPERCELL_TOKEN) {
    throw new Error('Missing SUPERCELL_TOKEN env');
  }
  return { Authorization: `Bearer ${process.env.SUPERCELL_TOKEN}` };
}