/**
 * Metadata Generation Utilities
 * Type-safe, consistent metadata generation for all pages
 */

import type { Metadata, Viewport } from 'next';
import { siteConfig, PageKey, getCanonicalUrl } from '@/config/seo.config';

/**
 * Metadata overrides that can be passed to generatePageMetadata
 */
interface MetadataOverrides {
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
  noIndex?: boolean;
  noFollow?: boolean;
  canonical?: string;
  openGraph?: Partial<Metadata['openGraph']>;
  twitter?: Partial<Metadata['twitter']>;
  alternates?: Partial<Metadata['alternates']>;
  other?: Record<string, string>;
}

/**
 * Generate viewport configuration
 * Exported separately per Next.js 14+ requirements
 */
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: siteConfig.colors.primary,
};

/**
 * Generate base metadata shared across all pages
 * Used in root layout
 */
export function generateBaseMetadata(): Metadata {
  const { name, description, url, images, verification, colors, defaultKeywords } = siteConfig;
  
  return {
    metadataBase: new URL(url),
    
    // Default title template
    title: {
      default: `${name} | ${siteConfig.tagline}`,
      template: `%s | ${name}`,
    },
    
    description,
    keywords: [...defaultKeywords],
    
    // Author info
    authors: [{ name }],
    creator: name,
    publisher: name,
    
    // Default robots
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    
    // Default OpenGraph
    openGraph: {
      type: 'website',
      locale: 'en_US',
      url,
      siteName: name,
      title: `${name}: Free SEO Analysis Tools`,
      description,
      images: [
        {
          url: images.ogDefault,
          width: 1200,
          height: 630,
          alt: `${name}: ${siteConfig.tagline}`,
          type: 'image/png',
        },
      ],
    },
    
    // Default Twitter
    twitter: {
      card: 'summary_large_image',
      site: siteConfig.twitter,
      creator: siteConfig.twitter,
      title: `${name}: Free SEO Analysis Tools`,
      description,
      images: [images.twitterDefault],
    },
    
    // Canonical
    alternates: {
      canonical: url,
    },
    
    // Comprehensive favicon/icon setup
    icons: {
      icon: [
        { url: '/favicon.ico', sizes: '32x32', type: 'image/x-icon' },
        { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
        { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      ],
      apple: [
        { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
      ],
      other: [
        { rel: 'mask-icon', url: '/safari-pinned-tab.svg', color: colors.primary },
      ],
    },
    
    // PWA manifest
    manifest: '/manifest.json',
    
    // Search engine verification
    verification: {
      google: verification.google || undefined,
      yandex: verification.yandex || undefined,
      other: verification.bing ? { 'msvalidate.01': verification.bing } : undefined,
    },
    
    // App info
    applicationName: name,
    category: 'Technology',
    
    // Additional meta
    other: {
      'msapplication-TileColor': colors.primary,
    },
  };
}

/**
 * Generate page-specific metadata
 * Merges base metadata with page config and any overrides
 */
export function generatePageMetadata(
  pageKey: PageKey,
  overrides: MetadataOverrides = {}
): Metadata {
  const page = siteConfig.pages[pageKey];
  const { url, name, images, defaultKeywords } = siteConfig;
  
  // Determine final values
  const title = overrides.title || page.title;
  const description = overrides.description || page.description;
  const pageUrl = overrides.canonical || getCanonicalUrl(page.path || '/');
  const image = overrides.image || images.ogDefault;
  
  // Merge keywords
  const keywords = [
    ...defaultKeywords,
    ...('keywords' in page ? page.keywords || [] : []),
    ...(overrides.keywords || []),
  ];
  
  // Remove duplicates
  const uniqueKeywords = [...new Set(keywords)];
  
  const metadata: Metadata = {
    title,
    description,
    keywords: uniqueKeywords,
    
    // Author info
    authors: [{ name }],
    creator: name,
    publisher: name,
    
    // Robots
    robots: {
      index: !overrides.noIndex,
      follow: !overrides.noFollow,
      googleBot: {
        index: !overrides.noIndex,
        follow: !overrides.noFollow,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    
    // OpenGraph
    openGraph: {
      type: 'website',
      locale: 'en_US',
      url: pageUrl,
      siteName: name,
      title,
      description,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title,
          type: 'image/png',
        },
      ],
      ...overrides.openGraph,
    },
    
    // Twitter
    twitter: {
      card: 'summary_large_image',
      site: siteConfig.twitter,
      creator: siteConfig.twitter,
      title,
      description,
      images: [image],
      ...overrides.twitter,
    },
    
    // Canonical
    alternates: {
      canonical: pageUrl,
      ...overrides.alternates,
    },
    
    // Additional meta
    other: overrides.other,
  };
  
  return metadata;
}

/**
 * Generate metadata for dynamic pages (like individual audit results)
 * Use this with generateMetadata() async function in page.tsx
 */
export function generateDynamicMetadata(
  title: string,
  description: string,
  options: {
    path: string;
    image?: string;
    noIndex?: boolean;
    keywords?: string[];
  }
): Metadata {
  const { url, name, images } = siteConfig;
  const pageUrl = getCanonicalUrl(options.path);
  const image = options.image || images.ogDefault;
  
  return {
    title,
    description,
    keywords: options.keywords,
    
    robots: {
      index: !options.noIndex,
      follow: true,
      googleBot: {
        index: !options.noIndex,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    
    openGraph: {
      type: 'website',
      locale: 'en_US',
      url: pageUrl,
      siteName: name,
      title,
      description,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title,
          type: 'image/png',
        },
      ],
    },
    
    twitter: {
      card: 'summary_large_image',
      site: siteConfig.twitter,
      creator: siteConfig.twitter,
      title,
      description,
      images: [image],
    },
    
    alternates: {
      canonical: pageUrl,
    },
  };
}
