/**
 * Site-wide constants for Rankify
 */

// Ocean Reef Color System - Single Source of Truth
export const COLORS = {
  // Primary Colors
  primary: {
    emerald: '#10B981',
    cyan: '#06B6D4',
    coral: '#F97316',
    pink: '#EC4899',
  },
  // Backgrounds
  background: {
    black: '#000000',
    zinc: {
      900: '#18181b',
      800: '#27272a',
      700: '#3f3f46',
    }
  },
  // Text
  text: {
    white: '#ffffff',
    slate: {
      300: '#cbd5e1',
      400: '#94a3b8',
      500: '#64748b',
    }
  },
  // Status Colors
  status: {
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    info: '#3B82F6',
  }
} as const;

// Typography
export const TYPOGRAPHY = {
  fonts: {
    primary: 'var(--font-satoshi)',
  },
  sizes: {
    xs: '0.75rem',    // 12px
    sm: '0.875rem',   // 14px
    base: '1rem',     // 16px
    lg: '1.125rem',   // 18px
    xl: '1.25rem',    // 20px
    '2xl': '1.5rem',  // 24px
    '3xl': '1.875rem',// 30px
    '4xl': '2.25rem', // 36px
    '5xl': '3rem',    // 48px
  }
} as const;

// Site Configuration
export const SITE_CONFIG = {
  domain: 'rankify.page',
  name: 'Rankify',
  tagline: 'Make Your Rankings Fly',
  description: 'Dominate search rankings with AI-powered insights',
  url: 'https://rankify.page',
  
  social: {
    twitter: 'https://twitter.com/rankify',
    github: 'https://github.com/rankify',
    discord: 'https://discord.gg/rankify',
    linkedin: 'https://linkedin.com/company/rankify',
  },
  
  email: {
    support: 'support@rankify.page',
    contact: 'contact@rankify.page',
    hello: 'hello@rankify.page',
  },
  
  urls: {
    app: 'https://app.rankify.page',
    docs: 'https://docs.rankify.page',
    blog: 'https://rankify.page/blog',
  }
} as const;

// Navigation Routes
export const ROUTES = {
  home: '/',
  websiteAudit: '/website-audit',
  pricing: '/#pricing',
  about: '/about',
  contact: '/contact',
  
  // Legal
  privacy: '/privacy',
  terms: '/terms',
  cookies: '/cookies',
  security: '/security',
} as const;

// Feature Services
export const FEATURES = [
  {
    id: 'website-audit',
    name: 'Website Audit',
    description: 'Complete SEO health check with actionable insights',
    icon: 'Chrome',
    color: 'coral',
    href: '/website-audit',
    active: true,
  },
  {
    id: 'keyword-intelligence',
    name: 'Keyword Intelligence',
    description: 'Discover high-value keywords with search intent analysis',
    icon: 'Target',
    color: 'cyan',
    href: '#',
    active: false,
  },
  {
    id: 'rank-monitoring',
    name: 'Rank Monitoring',
    description: 'Track keyword positions across search engines',
    icon: 'TrendingUp',
    color: 'emerald',
    href: '#',
    active: false,
  },
  {
    id: 'competitor-analysis',
    name: 'Competitor Analysis',
    description: 'Spy on competitors\' SEO strategies',
    icon: 'BarChart3',
    color: 'pink',
    href: '#',
    active: false,
  },
  {
    id: 'backlink-monitor',
    name: 'Backlink Monitor',
    description: 'Track your link profile growth',
    icon: 'LinkIcon',
    color: 'purple',
    href: '#',
    active: false,
  },
  {
    id: 'content-optimizer',
    name: 'Content Optimizer',
    description: 'AI-powered content suggestions',
    icon: 'FileText',
    color: 'yellow',
    href: '#',
    active: false,
  },
  {
    id: 'speed-insights',
    name: 'Speed Insights',
    description: 'Core Web Vitals monitoring',
    icon: 'Zap',
    color: 'coral',
    href: '#',
    active: false,
  },
  {
    id: 'schema-generator',
    name: 'Schema Generator',
    description: 'Structured data made simple',
    icon: 'Code',
    color: 'cyan',
    href: '#',
    active: false,
  },
] as const;

// Animation Durations (in ms)
export const ANIMATION = {
  fast: 200,
  normal: 300,
  slow: 500,} as const;