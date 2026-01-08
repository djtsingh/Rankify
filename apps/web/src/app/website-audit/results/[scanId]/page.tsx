/**
 * Results Page Server Wrapper
 * 
 * This implements the "Wrapper Fix" pattern for Next.js static export:
 * - generateStaticParams returns a placeholder to satisfy static export
 * - ResultsPageContent is a client component that handles everything
 * - The client component reads scanId from URL using useParams()
 */

import { Suspense } from 'react';
import ResultsPageContent from './ResultsPageContent';

// For static export - we must return at least one param
// The actual scanId is read client-side via useParams()
// This "placeholder" route enables the pattern to work
export function generateStaticParams() {
  return [
    { scanId: 'placeholder' }
  ];
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
