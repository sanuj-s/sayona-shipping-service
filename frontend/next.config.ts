import type { NextConfig } from "next";
import withBundleAnalyzer from "@next/bundle-analyzer";

const nextConfig: NextConfig = {
  output: "export",

  // Prevent TypeScript errors from blocking production builds
  typescript: {
    ignoreBuildErrors: true,
  },

  turbopack: {
    root: __dirname,
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

const analyzer = withBundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

export default analyzer(nextConfig);
