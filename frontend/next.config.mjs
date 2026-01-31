import { withSentryConfig } from "@sentry/nextjs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Bundle analyzer - Run with: ANALYZE=true npm run build
const withBundleAnalyzer = (await import('@next/bundle-analyzer')).default({
  enabled: process.env.ANALYZE === 'true',
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // swcMinify is now default in Next.js 15, no need to specify
eslint: {
    ignoreDuringBuilds: true,
  },
  // Turbopack configuration for monorepo
  // Note: When deploying to Vercel with rootDirectory set in vercel.json,
  // these paths should not reference parent directory
  // turbopack: {
  //   root: path.join(__dirname, '..'),
  // },

  // Output file tracing root - set to frontend directory to avoid lockfile confusion
  outputFileTracingRoot: __dirname,

  // Enable experimental features for Next.js 15
  experimental: {
    // ⏸️  DISABLED: Partial Prerendering (PPR) - Only available in canary
    // Uncomment when upgrading to Next.js canary for bleeding-edge performance
    // ppr: 'incremental',

    // ⏸️  DISABLED: React Compiler - Only available in Next.js canary
    // Uncomment when React 19 compiler is stable
    // reactCompiler: true,

    // ✅ Instrumentation enabled by default in Next.js 15 (no longer needs explicit config)

    // ✅ Server Actions enabled by default in Next.js 15
    serverActions: {
      bodySizeLimit: '2mb', // Increase if needed for file uploads
      // Allow both development and production origins
      allowedOrigins: [
        'localhost:3000',
        'localhost:3001',
        'tundua.com',
        'www.tundua.com',
      ],
    },

    // ✅ Enable optimized package imports (stable feature)
    optimizePackageImports: [
      'lucide-react',
      'date-fns',
      'recharts',
      '@sentry/nextjs',
    ],
  },

  /**
   * Image Optimization Configuration
   *
   * SECURITY: Only allow images from trusted domains
   * Add your CDN, storage providers, etc. to this list
   */
  images: {
    remotePatterns: [
      // Local development - frontend
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3000',
        pathname: '/**',
      },
      // Local development - backend API
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8000',
        pathname: '/storage/**',
      },
      // Production - API server (document storage)
      {
        protocol: 'https',
        hostname: 'api.tundua.com',
        pathname: '/storage/**',
      },
      // Production - Main domain
      {
        protocol: 'https',
        hostname: 'tundua.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.tundua.com',
        pathname: '/**',
      },
      // Common image CDNs - uncomment as needed
      // {
      //   protocol: 'https',
      //   hostname: '*.s3.amazonaws.com',
      //   pathname: '/tundua-uploads/**',
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
    // Suppress Sentry warnings during build
    SENTRY_SUPPRESS_GLOBAL_ERROR_HANDLER_FILE_WARNING: '1',
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
      // Tesseract.js worker files - simpler CORS configuration
      {
        source: '/tesseract/:path*',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: '*'
          },
          {
            key: 'Cross-Origin-Resource-Policy',
            value: 'cross-origin'
          },
        ],
      },
    ];
  },
};

// Sentry configuration
const sentryWebpackPluginOptions = {
  // Additional config options for the Sentry Webpack plugin
  silent: true, // Suppresses all logs
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,
  authToken: process.env.SENTRY_AUTH_TOKEN,
};

// Compose all wrappers: Bundle Analyzer -> Sentry
export default withBundleAnalyzer(
  withSentryConfig(nextConfig, sentryWebpackPluginOptions)
);
