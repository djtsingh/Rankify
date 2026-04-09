import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs";

// Production configuration for Azure Container Apps with SSR
const nextConfig: NextConfig = {
  // Enable Server-Side Rendering (SSR) for dynamic content and real SEO
  // output: 'export' removed - Container Apps supports Node.js server runtime
  images: {
    // Enable next/image optimization with remote image handling
    unoptimized: false,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  // SSR doesn't require trailing slashes; disabled for cleaner URLs
  // Environment variables - use Container Apps env config at runtime
};

export default withSentryConfig(nextConfig, {
  // For all available options, see:
  // https://github.com/getsentry/sentry-webpack-plugin#options

  org: "djtsingh",
  project: "javascript-nextjs",

  // Only print logs for uploading source maps in CI
  silent: !process.env.CI,

  // For all available options, see:
  // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

  // Upload a larger set of source maps for prettier stack traces (increases build time)
  widenClientFileUpload: true,

  // SSR mode enables full server-side features including Sentry tunneling if needed
  // tunnelRoute can now be configured for enhanced error reporting

  // Disable source map uploading
  sourcemaps: {
    disable: true,
  },

  webpack: {
    // Automatically annotate React components to show their full name in breadcrumbs and session replay
    reactComponentAnnotation: {
      enabled: true,
    },

    // Automatically tree-shake Sentry logger statements to reduce bundle size
    treeshake: {
      removeDebugLogging: true,
    },

    // Enables automatic instrumentation of Vercel Cron Monitors. (Does not yet work with App Router route handlers.)
    // See the following for more information:
    // https://docs.sentry.io/product/crons/
    // https://vercel.com/docs/cron-jobs
    automaticVercelMonitors: true,
  },
});
