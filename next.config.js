/** @type {import('next').NextConfig} */
const path = require('path');

const nextConfig = {
  reactStrictMode: true,
  trailingSlash: false,
  eslint: {
    ignoreDuringBuilds: true, // 빌드 시 ESLint 경고 무시
  },
  typescript: {
    ignoreBuildErrors: true, // 빌드 시 TypeScript 오류 무시
  },
  webpack: (config) => {
    // 절대 경로를 사용할 수 있도록 alias 설정 추가
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(__dirname),
    };
    return config;
  },
};

module.exports = nextConfig;
