/**
 * Structured Data (JSON-LD) Schema Generators
 * Generate rich structured data for better SERP appearance
 */

import { siteConfig } from '@/config/seo.config';

/**
 * Organization Schema
 * Shows organization info in search results
 */
export function generateOrganizationSchema() {
  const { name, url, description, images, email, organization, twitter } = siteConfig;
  
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${url}/#organization`,
    name,
    url,
    logo: {
      '@type': 'ImageObject',
      url: `${url}${images.logo}`,
      width: 512,
      height: 128,
    },
    image: `${url}${images.ogDefault}`,
    description,
    foundingDate: organization.foundingDate,
    sameAs: [
      `https://twitter.com/${twitter.replace('@', '')}`,
    ].filter(Boolean),
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      email: email.support,
      availableLanguage: ['English'],
    },
  };
}

/**
 * Website Schema with SearchAction
 * Enables sitelinks search box in Google
 */
export function generateWebsiteSchema() {
  const { name, url, description } = siteConfig;
  
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${url}/#website`,
    url,
    name,
    description,
    publisher: {
      '@id': `${url}/#organization`,
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${url}/website-audit?url={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

/**
 * SoftwareApplication Schema
 * Rich display for software/SaaS products
 */
export function generateSoftwareApplicationSchema(options?: {
  aggregateRating?: {
    ratingValue: number;
    ratingCount: number;
  };
}) {
  const { name, url, description } = siteConfig;
  
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    '@id': `${url}/#software`,
    name: `${name} SEO Tools`,
    applicationCategory: 'WebApplication',
    applicationSubCategory: 'SEO Tool',
    operatingSystem: 'Web Browser',
    browserRequirements: 'Requires JavaScript. Requires HTML5.',
    url,
    description,
    offers: {
      '@type': 'AggregateOffer',
      lowPrice: 0,
      highPrice: 99,
      priceCurrency: 'USD',
      offerCount: 3,
      offers: [
        {
          '@type': 'Offer',
          name: 'Free Plan',
          price: 0,
          priceCurrency: 'USD',
          description: 'Perfect for trying out Rankify',
        },
        {
          '@type': 'Offer',
          name: 'Pro Plan',
          price: 29,
          priceCurrency: 'USD',
          priceSpecification: {
            '@type': 'UnitPriceSpecification',
            price: 29,
            priceCurrency: 'USD',
            billingDuration: 'P1M',
          },
        },
        {
          '@type': 'Offer',
          name: 'Agency Plan',
          price: 99,
          priceCurrency: 'USD',
          priceSpecification: {
            '@type': 'UnitPriceSpecification',
            price: 99,
            priceCurrency: 'USD',
            billingDuration: 'P1M',
          },
        },
      ],
    },
    ...(options?.aggregateRating && {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: options.aggregateRating.ratingValue,
        ratingCount: options.aggregateRating.ratingCount,
        bestRating: 5,
        worstRating: 1,
      },
    }),
    featureList: [
      'Website SEO Audit',
      'Meta Tag Analysis',
      'Performance Scoring',
      'Mobile-Friendliness Check',
      'Security Analysis',
      'Keyword Optimization Tips',
    ],
    screenshot: `${url}/images/screenshot-dashboard.png`,
    author: {
      '@id': `${url}/#organization`,
    },
  };
}

/**
 * Breadcrumb Schema
 * Better navigation display in SERPs
 */
export function generateBreadcrumbSchema(
  items: Array<{ name: string; url: string }>
) {
  const { url: siteUrl } = siteConfig;
  
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url.startsWith('http') ? item.url : `${siteUrl}${item.url}`,
    })),
  };
}

/**
 * FAQ Schema
 * Rich FAQ display in search results
 */
export function generateFAQSchema(
  faqs: Array<{ question: string; answer: string }>
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

/**
 * HowTo Schema
 * Step-by-step guide display
 */
export function generateHowToSchema(options: {
  name: string;
  description: string;
  totalTime?: string; // ISO 8601 duration, e.g., 'PT2M' for 2 minutes
  steps: Array<{
    name: string;
    text: string;
    image?: string;
  }>;
}) {
  const { url } = siteConfig;
  
  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: options.name,
    description: options.description,
    ...(options.totalTime && { totalTime: options.totalTime }),
    step: options.steps.map((step, index) => ({
      '@type': 'HowToStep',
      position: index + 1,
      name: step.name,
      text: step.text,
      ...(step.image && {
        image: {
          '@type': 'ImageObject',
          url: step.image.startsWith('http') ? step.image : `${url}${step.image}`,
        },
      }),
    })),
  };
}

/**
 * WebPage Schema
 * General page info for any page type
 */
export function generateWebPageSchema(options: {
  title: string;
  description: string;
  url: string;
  datePublished?: string;
  dateModified?: string;
}) {
  const { name, url: siteUrl } = siteConfig;
  const pageUrl = options.url.startsWith('http') ? options.url : `${siteUrl}${options.url}`;
  
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `${pageUrl}/#webpage`,
    url: pageUrl,
    name: options.title,
    description: options.description,
    isPartOf: {
      '@id': `${siteUrl}/#website`,
    },
    about: {
      '@id': `${siteUrl}/#organization`,
    },
    ...(options.datePublished && { datePublished: options.datePublished }),
    ...(options.dateModified && { dateModified: options.dateModified }),
    inLanguage: 'en-US',
    publisher: {
      '@type': 'Organization',
      name,
      url: siteUrl,
    },
  };
}

/**
 * Combined schemas for homepage
 * Includes Organization, Website, SoftwareApplication, and FAQ
 */
export function generateHomePageSchemas() {
  // Import FAQ data from config
  const faqs = siteConfig.homepageFAQs;
  
  return [
    generateOrganizationSchema(),
    generateWebsiteSchema(),
    generateSoftwareApplicationSchema(),
    generateFAQSchema(faqs.map(faq => ({ question: faq.question, answer: faq.answer }))),
  ];
}
