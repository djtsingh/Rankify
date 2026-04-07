/**
 * SEO Utilities - Main Exports
 * Centralized exports for all SEO-related functionality
 */

export { generatePageMetadata, generateBaseMetadata, viewport } from './metadata';
export { 
  generateOrganizationSchema,
  generateWebsiteSchema,
  generateSoftwareApplicationSchema,
  generateBreadcrumbSchema,
  generateFAQSchema,
  generateHowToSchema,
  generateWebPageSchema,
  generateHomePageSchemas,
} from './structured-data';
export { siteConfig, getPageUrl, getCanonicalUrl } from '@/config/seo.config';
export type { PageKey, PageConfig, SiteConfig } from '@/config/seo.config';
