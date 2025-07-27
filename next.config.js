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
  // Configure for static export to Firebase Hosting
  output: 'export',
  trailingSlash: true,
  distDir: 'out',
  images: {
    unoptimized: true
  },
  // Disable middleware for now to avoid manifest issues
  skipMiddlewareUrlNormalize: true,
  skipTrailingSlashRedirect: true,
}

module.exports = nextConfig
