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
  output: 'export', // 정적 HTML 파일 생성 설정 추가
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

    // 클라이언트와 서버에서 다르게 동작할 수 있는 문제를 방지하기 위해 추가 설정
    if (!isServer) {
      config.resolve.alias['react/jsx-runtime'] = require.resolve('react/jsx-runtime');
      config.resolve.alias['react/jsx-dev-runtime'] = require.resolve('react/jsx-dev-runtime');
    }

    return config;
  },
});

module.exports = nextConfig;
