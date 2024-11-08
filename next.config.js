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
    ignoreDuringBuilds: true,
  },
  webpack: (config) => {
    config.resolve.alias['@'] = path.resolve(__dirname);
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      http2: false,
    };
    return config;
  },
});

module.exports = nextConfig;
