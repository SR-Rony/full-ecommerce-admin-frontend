const removeImports = require("next-remove-imports")();

/** @type {import('next').NextConfig} */
module.exports = removeImports({
  eslint: {
    ignoreDuringBuilds: true,
  },

  reactStrictMode: true,
  trailingSlash: true,
  swcMinify: true,

  images: {
    domains: [
      "res.cloudinary.com",
      "cdn.hammerandbell.shop",
      "localhost",
    ],
  },

  transpilePackages: ["react-md-editor"],
  experimental: {
    esmExternals: true,
  },
});
