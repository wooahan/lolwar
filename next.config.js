const path = require('path');
const withTM = require('next-transpile-modules')([
  'react-dnd',
  'dnd-core',
  '@react-dnd/invariant',
  '@react-dnd/asap',
  '@react-dnd/shallowequal',
]);

const nextConfig = withTM({
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true, // 빌드 중 eslint 경고 무시
  },
  webpack: (config, { isServer }) => {
    // 기본적인 alias 설정 추가
    config.resolve.alias['@'] = path.resolve(__dirname);

    // Webpack 설정 변경 - fallback 설정에서 사용되지 않는 Node API 모듈 제거
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      http2: false,
    };

    // 빌드에 필요한 모든 파일 포함
    config.module.rules.push({
      test: /\.(js|jsx|ts|tsx)$/,
      exclude: /node_modules/,
      use: {
        loader: 'babel-loader',
      },
    });

    return config;
  },
});

module.exports = nextConfig;
