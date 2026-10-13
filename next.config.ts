import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // สั่งให้ข้ามการจับผิด Type และ ESLint ตอนเอาเว็บขึ้น Vercel
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;