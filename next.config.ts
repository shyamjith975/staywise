import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: [
    "*.trycloudflare.com",
    "*.loca.lt",
    "*.lhr.life",
    "*.pinggy.link",
    "192.168.1.25",
    "localhost",
  ],
};

export default nextConfig;
