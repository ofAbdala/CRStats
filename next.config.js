/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'api-assets.clashroyale.com' },
      { protocol: 'https', hostname: 'cdn.royaleapi.com' },
    ],
  },
  experimental: {
    serverActions: { allowedOrigins: ['*'] }
  },
  webpack: (config, { dev }) => {
    if (dev) {
      config.cache = false; // força recompilar sem cache para evitar erros ENOENT
    }
    return config;
  }
};

module.exports = nextConfig;