import type { Metadata } from 'next';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: 'website' | 'article';
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  section?: string;
  tags?: string[];
}

export function generateSEO(props: SEOProps): Metadata {
  const {
    title,
    description,
    keywords = [],
    image = '/og-image.png',
    url,
    type = 'website',
    publishedTime,
    modifiedTime,
    author,
    section,
    tags = []
  } = props;

  const baseTitle = title || 'Rankify | Make Your Rankings Fly.';
  const baseDescription = description || 'Free, powerful SEO tools to analyze, optimize, and improve your website rankings. URL analyzer, keyword density checker, meta tag generator, and more. No hidden fees, instant results.';
  const baseKeywords = [
    'SEO tools', 'free SEO analyzer', 'website optimization',
    'keyword density checker', 'meta tag generator', 'URL analyzer',
    'SEO audit', 'search engine optimization', 'website SEO checker',
    'free SEO tools', ...keywords
  ];

  const metadata: Metadata = {
    title: baseTitle,
    description: baseDescription,
    keywords: baseKeywords,

    authors: [{ name: author || 'Rankify' }],
    creator: 'Rankify',
    publisher: 'Rankify',

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

    openGraph: {
      type,
      locale: 'en_US',
      url: url || 'https://www.rankify.page',
      siteName: 'Rankify',
      title: baseTitle,
      description: baseDescription,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: baseTitle,
          type: 'image/png',
        },
      ],
    },

    twitter: {
      card: 'summary_large_image',
      title: baseTitle,
      description: baseDescription,
      creator: '@rankify',
      images: [image],
    },

    alternates: {
      canonical: url || 'https://www.rankify.page',
    },

    other: Object.fromEntries(
      ([
        author && ['article:author', author],
        section && ['article:section', section],
        tags.length > 0 && ['article:tag', tags.join(',')],
        publishedTime && ['article:published_time', publishedTime],
        modifiedTime && ['article:modified_time', modifiedTime],
      ].filter(Boolean) as [string, string][])
    ),
  };

  return metadata;
}