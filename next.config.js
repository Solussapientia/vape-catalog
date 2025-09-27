/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'thpcdtctcfsaykkgjvaa.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
}
 
module.exports = nextConfig 