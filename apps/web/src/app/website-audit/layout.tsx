import { Metadata } from 'next';
import { generateSEO } from '@/lib/seo';

export const metadata: Metadata = generateSEO({
  title: 'Free Website SEO Audit Tool',
  description: 'Get a comprehensive SEO audit of your website for free. Check meta tags, performance, mobile-friendliness, security, and more. Instant results, no signup required.',
  keywords: [
    'website audit', 'SEO audit tool', 'free SEO checker', 'website analyzer',
    'meta tag checker', 'performance audit', 'mobile SEO', 'security audit',
    'content analysis', 'SEO score', 'website optimization'
  ],
  url: 'https://www.rankify.page/website-audit',
  type: 'website',
});

export default function WebsiteAuditLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}