/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,

  /**
   * Image Optimization Configuration
   *
   * SECURITY: Only allow images from trusted domains
   * Add your CDN, storage providers, etc. to this list
   */
  images: {
    domains: ['localhost'],
    remotePatterns: [
      // Local development
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8000',
        pathname: '/storage/**',
      },
      // Add your production domains here
      // Example for AWS S3:
      // {
      //   protocol: 'https',
      //   hostname: '*.s3.amazonaws.com',
      //   pathname: '/tundua-uploads/**',
      // },
      // Example for Cloudinary:
      // {
      //   protocol: 'https',
      //   hostname: 'res.cloudinary.com',
      //   pathname: '/your-cloud-name/**',
      // },
    ],
    formats: ['image/avif', 'image/webp'], // Modern image formats
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840], // Responsive breakpoints
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384], // Icon sizes
  },

  // Environment variables exposed to the browser
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  },

  /**
   * Compiler Options
   * Remove console.logs and debugger in production
   */
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn'], // Keep error and warn logs
    } : false,
  },

  /**
   * Headers Configuration
   * Additional security headers (middleware handles most)
   */
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
        ],
      },
    ];
  },
};

export default nextConfig;
