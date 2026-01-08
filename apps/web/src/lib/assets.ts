/**
 * Asset paths and static file references
 * Single source of truth for all images, videos, and media
 */

// Images
export const IMAGES = {
  logo: '/rankify-logo.png',
  favicon: '/favicon.png',
  heroBg: '/hero-bg.png',
  ogImage: '/og-image.png',
  twitterImage: '/twitter-image.png',
} as const;

// Brand Assets
export const BRAND = {
  logo: {
    path: '/rankify-logo.png',
    alt: 'Rankify',
    sizes: {
      sm: 'h-7 w-7',      // 28px
      md: 'h-8 w-8',      // 32px
      lg: 'h-10 w-10',    // 40px
      xl: 'h-12 w-12',    // 48px
    }
  }
} as const;

// Placeholder for future video assets
export const VIDEOS = {
  // demo: '/videos/demo.mp4',
} as const;

// External CDN assets (if any)
export const CDN = {
  // fonts: 'https://cdn.example.com/fonts',
} as const;
