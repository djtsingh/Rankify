/**
 * Results Page - Dynamic SSR Route
 *
 * Supports both patterns:
 * - /website-audit/results/[scanId] - dynamic route SSR
 * - /website-audit/results?scan=123&url=example.com - query param fallback
 * 
 * Server-side rendering ensures:
 * - Real crawlable content for search engines
 * - No hydration flashes (content on first paint)
 * - Dynamic metadata for each audit
 */

import { Suspense } from 'react';
import type { Metadata } from 'next';
import ResultsPageContent from './ResultsPageContent';

// Force dynamic rendering for real-time audit data
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'SEO Audit Results | Rankify',
  description: 'Your comprehensive SEO audit results with actionable insights and recommendations',
};

// Loading skeleton while client component hydrates
function LoadingSkeleton() {
  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
      <div className="text-center">
        <div className="relative w-24 h-24 mx-auto mb-6">
          <div className="absolute inset-0 border-4 border-cyan-500/20 rounded-full" />
          <div className="absolute inset-0 border-4 border-transparent border-t-cyan-500 rounded-full animate-spin" />
        </div>
        <p className="text-zinc-400 text-lg">Loading audit results...</p>
      </div>
    </div>
  );
}

export default function ResultsPage() {
  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <ResultsPageContent />
    </Suspense>
  );
}