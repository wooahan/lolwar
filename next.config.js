// next.config.js

const path = require('path'); // 추가

const withTM = require('next-transpile-modules')([
  'react-dnd',
  'dnd-core',
  '@react-dnd/invariant',
  '@react-dnd/asap',
  '@react-dnd/shallowequal',
]);

const nextConfig = withTM({
  reactStrictMode: true,
  trailingSlash: false,
  eslint: {
    ignoreDuringBuilds: true,
  },
  webpack: (config, { isServer }) => {
    config.resolve.alias['@'] = path.resolve(__dirname);
    config.resolve.alias = {
      ...config.resolve.alias,
      'react/jsx-runtime.js': require.resolve('react/jsx-runtime'),
      'react/jsx-dev-runtime.js': require.resolve('react/jsx-dev-runtime'),
    };
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      http2: false,
    };

    // 서버와 클라이언트 각각에 대해 다른 설정을 추가할 수 있음
    if (!isServer) {
      config.resolve.alias['@components'] = path.resolve(__dirname, 'components');
    }

    return config;
  },
});

module.exports = nextConfig;
