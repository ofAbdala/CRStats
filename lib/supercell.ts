export function baseURL() {
  console.log('Using proxy:', process.env.USE_PROXY, 'Base URL will be:', process.env.USE_PROXY === 'true' ? 'https://proxy.royaleapi.dev/v1' : 'https://api.clashroyale.com/v1');
  return process.env.USE_PROXY === 'true'
    ? 'https://proxy.royaleapi.dev/v1'
    : 'https://api.clashroyale.com/v1';
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