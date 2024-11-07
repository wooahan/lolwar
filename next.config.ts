import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true, // 빌드 시 ESLint 무시
  },
  trailingSlash: false, // 경로 뒤에 슬래시 추가
  reactStrictMode: true, // React Strict Mode 활성화
  /* 다른 설정 옵션이 있다면 여기에 추가하세요 */
};

export default nextConfig;