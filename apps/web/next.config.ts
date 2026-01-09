import type { NextConfig } from "next";

// Production-only configuration for Azure Static Web Apps
const nextConfig: NextConfig = {
  // Always use static export for production deployment
  output: 'export',
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
  // Production API URL is set in environment variables
  env: {
    NEXT_PUBLIC_API_URL: 'https://rankify-v1-src.azurewebsites.net',
  },
};

export default nextConfig;
