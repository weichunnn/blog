const { withContentlayer } = require("next-contentlayer2");

/** @type {import('next').NextConfig} */
const nextConfig = { reactStrictMode: true };

module.exports = withContentlayer({
  ...nextConfig,
  webpack: function (config, options) {
    config.module.rules.push({
      test: /\.md$/,
      use: "raw-loader",
    });

    return config;
  },
  experimental: {
    turbo: {},
  },
});
