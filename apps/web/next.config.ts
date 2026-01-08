import type { NextConfig } from "next";

// Only use static export in production build (for Azure Static Web Apps)
// In development, we need dynamic routing for scan IDs
const isProduction = process.env.NODE_ENV === 'production';

const nextConfig: NextConfig = {
  // Static export ONLY for production builds (Azure Static Web Apps deployment)
  // Disabled in development to allow dynamic routes with runtime scan IDs
  ...(isProduction && { output: 'export' }),
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
  // Don't override NEXT_PUBLIC_API_URL here - it's set in .env.local
  // The client.ts file has its own fallback for local development
};

export default nextConfig;
