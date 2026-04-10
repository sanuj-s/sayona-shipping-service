import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  // Proxy API calls to the Express backend
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"}/api/:path*`,
      },
    ];
  },

  // Redirect old .html URLs to clean routes
  async redirects() {
    return [
      { source: "/index.html", destination: "/", permanent: true },
      { source: "/services.html", destination: "/services", permanent: true },
      { source: "/company.html", destination: "/company", permanent: true },
      { source: "/contact.html", destination: "/contact", permanent: true },
      { source: "/tracking.html", destination: "/tracking", permanent: true },
      { source: "/careers.html", destination: "/careers", permanent: true },
      {
        source: "/privacy-policy.html",
        destination: "/privacy-policy",
        permanent: true,
      },
      {
        source: "/industries/textile.html",
        destination: "/industries/textile",
        permanent: true,
      },
      {
        source: "/industries/automotive.html",
        destination: "/industries/automotive",
        permanent: true,
      },
      {
        source: "/industries/hightech.html",
        destination: "/industries/hightech",
        permanent: true,
      },
      {
        source: "/industries/pharma.html",
        destination: "/industries/pharma",
        permanent: true,
      },
      {
        source: "/industries/agri-products.html",
        destination: "/industries/agri-products",
        permanent: true,
      },
      {
        source: "/industries/general-cargo.html",
        destination: "/industries/general-cargo",
        permanent: true,
      },
      {
        source: "/admin/login.html",
        destination: "/admin/login",
        permanent: true,
      },
      {
        source: "/admin/dashboard.html",
        destination: "/admin/dashboard",
        permanent: true,
      },
      {
        source: "/client/login.html",
        destination: "/client/login",
        permanent: true,
      },
      {
        source: "/client/register.html",
        destination: "/client/register",
        permanent: true,
      },
    ];
  },

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
