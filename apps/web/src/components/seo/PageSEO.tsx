import { Metadata } from 'next';
import { generateSEO } from '@/lib/seo';
import { StructuredData } from '@/components/seo/StructuredData';

interface PageSEOProps {
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
  structuredData?: {
    type: 'organization' | 'website' | 'software' | 'breadcrumb';
    data: any;
  };
  children: React.ReactNode;
}

export function PageSEO({
  title,
  description,
  keywords,
  image,
  url,
  type = 'website',
  publishedTime,
  modifiedTime,
  author,
  section,
  tags,
  structuredData,
  children,
}: PageSEOProps) {
  // Generate metadata for this page
  const metadata = generateSEO({
    title,
    description,
    keywords,
    image,
    url,
    type,
    publishedTime,
    modifiedTime,
    author,
    section,
    tags,
  });

  return (
    <>
      {/* Next.js metadata (handled by page metadata export) */}
      {children}

      {/* Structured Data */}
      {structuredData && (
        <StructuredData type={structuredData.type} data={structuredData.data} />
      )}
    </>
  );
}

// Helper function to create page metadata
export function createPageMetadata(props: Omit<PageSEOProps, 'children' | 'structuredData'>): Metadata {
  return generateSEO(props);
}