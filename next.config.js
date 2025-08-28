/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: { 
    domains: ['api-assets.clashroyale.com', 'cdn.royaleapi.com'] 
  },
  experimental: {
    serverActions: { allowedOrigins: ['*'] }
  }
};

export default nextConfig;