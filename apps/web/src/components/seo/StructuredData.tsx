// import { Organization, WebSite, SoftwareApplication, BreadcrumbList, ListItem } from 'schema-dts';

// Temporary type definitions until schema-dts is properly installed
type Organization = any;
type WebSite = any;
type SoftwareApplication = any;
type BreadcrumbList = any;
type ListItem = any;

interface StructuredDataProps {
  type: 'organization' | 'website' | 'software' | 'breadcrumb';
  data: any;
}

export function StructuredData({ type, data }: StructuredDataProps) {
  const getStructuredData = () => {
    switch (type) {
      case 'organization':
        return {
          '@context': 'https://schema.org',
          '@type': 'Organization',
          name: 'Rankify',
          url: 'https://www.rankify.page',
          logo: 'https://www.rankify.page/logo-horizontal.svg',
          description: 'Free, powerful SEO tools to analyze, optimize, and improve your website rankings.',
          foundingDate: '2024',
          contactPoint: {
            '@type': 'ContactPoint',
            contactType: 'customer service',
            email: 'support@rankify.page',
          },
          sameAs: [
            'https://twitter.com/rankify',
            'https://github.com/rankify',
          ],
          ...data,
        } as Organization;

      case 'website':
        return {
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          name: 'Rankify',
          url: 'https://www.rankify.page',
          description: 'Free SEO tools for website optimization and analysis.',
          potentialAction: {
            '@type': 'SearchAction',
            target: 'https://www.rankify.page/website-audit?url={search_term_string}',
            'query-input': 'required name=search_term_string',
          },
          ...data,
        } as WebSite;

      case 'software':
        return {
          '@context': 'https://schema.org',
          '@type': 'SoftwareApplication',
          name: 'Rankify SEO Tools',
          applicationCategory: 'WebApplication',
          operatingSystem: 'Web Browser',
          offers: {
            '@type': 'Offer',
            price: '0',
            priceCurrency: 'USD',
          },
          description: 'Comprehensive SEO analysis and optimization tools.',
          ...data,
        } as SoftwareApplication;

      case 'breadcrumb':
        return {
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: data.map((item: any, index: number) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: item.name,
            item: item.url,
          })),
        } as BreadcrumbList;

      default:
        return null;
    }
  };

  const structuredData = getStructuredData();

  if (!structuredData) return null;

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(structuredData),
      }}
    />
  );
}