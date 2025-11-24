/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // Ensures Vercel handles the output correctly
  output: 'standalone',
};

export default nextConfig;