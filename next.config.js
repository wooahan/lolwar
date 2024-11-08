const withTM = require('next-transpile-modules')([
  'react-dnd',
  'react-dnd-html5-backend',
  'dnd-core',
  '@react-dnd/invariant',
  '@react-dnd/asap',
  '@react-dnd/shallowequal',
]);

module.exports = withTM({
  reactStrictMode: true,
  trailingSlash: false,
  eslint: {
    ignoreDuringBuilds: true,
  },
  webpack: (config) => {
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
    return config;
  },
});
