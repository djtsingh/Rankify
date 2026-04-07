/**
 * Centralized SEO Configuration for Rankify
 * Single source of truth for all SEO-related data across the site
 */

export const siteConfig = {
  // Core Identity
  name: 'Rankify',
  tagline: 'Instant SEO Insights',
  description: 'Get a complete SEO analysis in seconds. See what\'s working, what\'s not, and exactly how to fix it. No signup needed to start.',
  
  // URLs
  url: 'https://www.rankify.page',
  apiUrl: 'https://rankify-v1-src.azurewebsites.net',
  
  // Social handles
  twitter: '@rankify',
  
  // Contact emails
  email: {
    support: 'support@rankify.page',
    contact: 'contact@rankify.page',
    privacy: 'privacy@rankify.page',
    legal: 'legal@rankify.page',
  },
  
  // Brand colors
  colors: {
    primary: '#1490df',
    primaryDark: '#0d6ebd',
    accent: '#FF6B6B',
    accentDark: '#E55A5A',
    background: '#000000',
    surface: '#18181B',
  },
  
  // Verification codes - Add your real codes here
  verification: {
    google: '', // Get from Google Search Console > Settings > Ownership verification
    bing: '',   // Get from Bing Webmaster Tools
    yandex: '', // Optional
  },
  
  // Analytics IDs
  analytics: {
    ga4: 'G-B4VYMCS0Z5',
    clarity: 'v0api0xc0z',
  },
  
  // Default images (relative paths, metadataBase will make them absolute)
  // TODO: Create proper OG images at 1200x630 and 1200x600
  images: {
    ogDefault: '/hero-bg.png',           // TODO: Create /images/og-default.png (1200x630)
    twitterDefault: '/hero-bg.png',      // TODO: Create /images/twitter-default.png (1200x600)
    logo: '/logo-horizontal.svg',
    logoIcon: '/favicon.ico',
  },
  
  // Organization info for structured data
  organization: {
    name: 'Rankify',
    legalName: 'Rankify',
    foundingDate: '2024',
    founders: ['Rankify Team'],
  },
  
  // Default keywords - LOW COMPETITION, LONG-TAIL focus
  // Avoiding high-competition terms that big players dominate
  defaultKeywords: [
    'SEO checker no signup',
    'check my site SEO free',
    'website SEO test online',
    'quick SEO audit',
    'instant website analysis',
    'SEO score no login',
  ],
  
  // Page-specific SEO configurations
  // Clean titles without brand suffix (template adds "| Rankify")
  // Use colons for topic clarification, keep titles concise
  pages: {
    home: {
      title: 'Instant SEO Insights for Your Website',
      description: 'Get a complete SEO analysis in seconds. See what\'s working, what\'s not, and exactly how to fix it. No signup needed to start.',
      keywords: ['SEO audit no signup', 'check website SEO free no login', 'instant site analysis', 'quick SEO check online', 'website health check free'],
      path: '',
    },
    websiteAudit: {
      title: 'Free Website SEO Audit',
      description: 'Comprehensive SEO analysis for any website. Meta tags, performance, mobile optimization, security — all in one instant report.',
      keywords: ['website analysis no signup', 'quick site SEO check', 'SEO test my website', 'instant SEO report', 'website audit for bloggers'],
      path: '/website-audit',
    },
    pricing: {
      title: 'Plans & Pricing',
      description: 'Simple, transparent pricing. Start with a free audit — upgrade when you\'re ready. No credit card required.',
      keywords: ['affordable SEO audit tool', 'cheap website analyzer', 'SEO tool free trial', 'budget SEO checker'],
      path: '/pricing',
    },
    about: {
      title: 'About Us',
      description: 'Building SEO tools that actually make sense. No jargon, no complexity — just clear insights to help your website grow.',
      keywords: ['about Rankify', 'Rankify team', 'SEO tool for beginners', 'simple SEO checker'],
      path: '/about',
    },
    contact: {
      title: 'Contact Us',
      description: 'Have a question? We\'re here to help. Reach out and we\'ll get back to you within 24 hours.',
      keywords: ['Rankify help', 'SEO questions', 'website audit help', 'Rankify contact'],
      path: '/contact',
    },
    security: {
      title: 'Security',
      description: 'Enterprise-grade security as standard. Your data is encrypted, protected, and never sold.',
      keywords: ['Rankify security', 'safe SEO tool', 'secure website analyzer', 'privacy focused SEO'],
      path: '/security',
    },
    privacy: {
      title: 'Privacy Policy',
      description: 'Your privacy matters. We collect only what\'s necessary and never share your data with third parties.',
      path: '/privacy',
    },
    terms: {
      title: 'Terms of Service',
      description: 'Clear, fair terms. Understand how Rankify works and what to expect from our platform.',
      path: '/terms',
    },
    cookies: {
      title: 'Cookie Policy',
      description: 'We use minimal, essential cookies. Here\'s exactly what they do and why.',
      path: '/cookies',
    },
    acceptableUse: {
      title: 'Acceptable Use Policy',
      description: 'Guidelines for fair and responsible use of Rankify services. Understand the rules for a safe experience.',
      path: '/acceptable-use',
    },
  },
  
  // Homepage FAQ (for FAQ schema and featured snippets)
  homepageFAQs: [
    {
      question: 'What is an SEO audit?',
      answer: 'An SEO audit is a complete health check of your website\'s search engine optimization. It analyzes factors like page speed, meta tags, mobile-friendliness, security, and content quality to identify what\'s helping or hurting your Google rankings.',
    },
    {
      question: 'How do I check my website\'s SEO for free?',
      answer: 'With Rankify, enter any URL and get an instant SEO score. No account or credit card required for your first audit. You\'ll see a detailed breakdown of 100+ ranking factors with actionable recommendations.',
    },
    {
      question: 'What is a good SEO score?',
      answer: 'An SEO score above 80 is considered good. Scores of 90+ indicate excellent optimization. Anything below 60 needs attention. Rankify breaks down your score by category so you know exactly what to fix.',
    },
    {
      question: 'How often should I audit my website\'s SEO?',
      answer: 'Run an SEO audit monthly, or after any major website changes. Google\'s algorithm updates frequently, and regular audits help you catch issues before they hurt your rankings.',
    },
    {
      question: 'Is Rankify really free?',
      answer: 'Yes – your first audit on each tool is completely free with no signup. After that, choose a plan that fits your needs. No credit card required to start.',
    },
  ],
  
  // Homepage hero copy
  hero: {
    headline: 'Know Your SEO Score in Seconds',
    subheadline: 'Enter any URL. Get a complete analysis of what\'s helping — and hurting — your rankings. No account required.',
    ctaPrimary: 'Analyze My Site',
    ctaSecondary: 'How It Works',
  },
} as const;

// Type exports for type safety
export type SiteConfig = typeof siteConfig;
export type PageKey = keyof typeof siteConfig.pages;
export type PageConfig = typeof siteConfig.pages[PageKey];

// Helper to get full URL for a page
export function getPageUrl(pageKey: PageKey): string {
  const page = siteConfig.pages[pageKey];
  return `${siteConfig.url}${page.path}`;
}

// Helper to get canonical URL
export function getCanonicalUrl(path: string): string {
  // Remove trailing slash for consistency, except for root
  const cleanPath = path === '/' ? '' : path.replace(/\/$/, '');
  return `${siteConfig.url}${cleanPath}`;
}
