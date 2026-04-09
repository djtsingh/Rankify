import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs";

// Production configuration for Azure Container Apps with SSR
const nextConfig: NextConfig = {
  // Enable Server-Side Rendering (SSR) for dynamic content and real SEO
  // output: 'export' removed - Container Apps supports Node.js server runtime
  images: {
    unoptimized: false,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  // SSR doesn't require trailing slashes; disabled for cleaner URLs
};

export default withSentryConfig(nextConfig, {
  org: "djtsingh",
  project: "javascript-nextjs",
  silent: !process.env.CI,
  widenClientFileUpload: true,
  sourcemaps: {
    disable: true,
  },
  webpack: {
    reactComponentAnnotation: {
      enabled: true,
    },
    treeshake: {
      removeDebugLogging: true,
    },
    automaticVercelMonitors: true,
  },
});
