/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: { 
    domains: ['api-assets.clashroyale.com', 'cdn.royaleapi.com'] 
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

export default nextConfig;