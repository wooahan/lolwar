import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true, // 빌드 시 ESLint 무시
  },
  trailingSlash: true, // 모든 경로 뒤에 슬래시를 추가
  reactStrictMode: true, // React의 Strict Mode 활성화
  swcMinify: true, // 빌드 속도를 향상시키기 위한 swc 사용
  output: 'standalone', // Vercel의 Docker 배포 호환성 확보를 위해
  /* 다른 설정 옵션이 있다면 여기에 추가하세요 */
};

export default nextConfig;
