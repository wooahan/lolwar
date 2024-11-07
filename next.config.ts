import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true, // 빌드 시 ESLint 무시
  },
  /* 다른 설정 옵션이 있다면 여기에 추가하세요 */
};

export default nextConfig;