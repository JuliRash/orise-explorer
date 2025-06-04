/** @type {import('next').NextConfig} */
const nextConfig = {
  // Disable static export to fix build issues
  // output: 'export',
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Disable TypeScript checking during build
    ignoreBuildErrors: true,
  },
  images: { unoptimized: true },
};

module.exports = nextConfig;
