import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: [
    "*.trycloudflare.com",
    "*.loca.lt",
    "*.lhr.life",
    "*.pinggy.link",
    "*.ngrok-free.app",
    "*.ngrok.io",
    "192.168.1.25",
    "192.168.1.25:3005",
    "192.168.1.25:3000",
    "192.168.*",
    "192.168.*:*",
    "10.*",
    "10.*:*",
    "172.*",
    "172.*:*",
    "localhost",
    "localhost:3005",
    "localhost:3000",
    "127.0.0.1",
    "127.0.0.1:3005",
    "127.0.0.1:3000"
  ],
  experimental: {
    cpus: 1,
    workerThreads: false,
  },
  serverExternalPackages: ["node:sqlite"],
  async headers() {
    const isHttpsProd = process.env.NODE_ENV === 'production' && process.env.ENABLE_HSTS === 'true';
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "X-DNS-Prefetch-Control",
            value: "on"
          },
          ...(isHttpsProd
            ? [
                {
                  key: "Strict-Transport-Security",
                  value: "max-age=63072000; includeSubDomains; preload"
                }
              ]
            : []),
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN"
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff"
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin"
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()"
          }
        ]
      }
    ];
  }
};

export default nextConfig;
