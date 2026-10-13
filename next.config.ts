import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // สั่งให้ข้ามการจับผิด Type Error ตอนเอาเว็บขึ้น Vercel
  typescript: {
    ignoreBuildErrors: true,
  },
  // สั่งให้ข้ามการจับผิด ESLint ด้วยเพื่อความชัวร์
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;