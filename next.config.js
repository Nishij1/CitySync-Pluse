/** @type {import('next').NextConfig} */
const nextConfig = {
  swcMinify: true,
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }
    return config;
  },
  // Only use static export for production builds
  ...(process.env.NODE_ENV === 'production' && {
    output: 'export',
    trailingSlash: true,
    distDir: 'out',
    images: {
      unoptimized: true
    },
    skipMiddlewareUrlNormalize: true,
    skipTrailingSlashRedirect: true,
  }),
  // For development, use standard Next.js configuration
  ...(process.env.NODE_ENV !== 'production' && {
    images: {
      unoptimized: true
    },
  }),
}

module.exports = nextConfig
