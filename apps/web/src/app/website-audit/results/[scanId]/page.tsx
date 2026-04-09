/**
 * Results Page Server Component
 * 
 * Now uses full SSR with dynamic route matching.
 * - No generateStaticParams needed (SSR handles all scanIds dynamically)
 * - ResultsPageContent is server-rendered for proper Next.js App Router support
 * - Metadata generated server-side for real SEO benefit
 */

import { Suspense } from 'react';
import type { Metadata } from 'next';
import ResultsPageContent from './ResultsPageContent';

// Dynamic route segment - no pre-generation needed with SSR
export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ scanId: string }> }): Promise<Metadata> {
  // Server-side metadata generation for proper SEO
  const { scanId } = await params;
  return {
    title: `SEO Audit Results - ${scanId} | Rankify`,
    description: 'Comprehensive SEO audit results with actionable insights',
  };
}

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
