import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",

  // Prevent TypeScript errors from blocking production builds
  typescript: {
    ignoreBuildErrors: true,
  },



  // NOTE: rewrites() and redirects() removed — incompatible with output: 'export'

  // Image optimization
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "sayonashipping.me",
      },
    ],
  },
};

export default nextConfig;
