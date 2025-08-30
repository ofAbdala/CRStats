/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'api-assets.clashroyale.com' },
      { protocol: 'https', hostname: 'cdn.royaleapi.com' },
      { protocol: 'https', hostname: 'raw.githubusercontent.com' }
    ],
  },
};

export default nextConfig;