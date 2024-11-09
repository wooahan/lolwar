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

    // tsx 및 jsx 파일에 대한 babel-loader 설정 추가
    config.module.rules.push({
      test: /\.(js|jsx|ts|tsx)$/,
      exclude: /node_modules/,
      use: {
        loader: 'babel-loader',
        options: {
          presets: [
            'next/babel', // next.js를 위한 babel 프리셋 추가
            '@babel/preset-env',
            '@babel/preset-react',
            '@babel/preset-typescript',
          ],
          plugins: [
            '@babel/plugin-transform-runtime', // 빌드 최적화 플러그인 추가
          ],
        },
      },
    });

    // 빌드에 필요한 확장자 추가
    config.resolve.extensions.push('.ts', '.tsx', '.js', '.jsx');

    // 클라이언트와 서버에서 다르게 동작할 수 있는 문제 방지
    if (!isServer) {
      config.resolve.alias['react/jsx-runtime'] = require.resolve('react/jsx-runtime');
      config.resolve.alias['react/jsx-dev-runtime'] = require.resolve('react/jsx-dev-runtime');
    }

    return config;
  },
});

module.exports = nextConfig;
