/**
 * Results Page - Static Route for Static Export Compatibility
 *
 * Uses query parameters instead of dynamic routes for Next.js static export:
 * - /website-audit/results?scan=123&url=example.com
 * - Compatible with Azure Static Web Apps deployment
 */

import { Suspense } from 'react';
import ResultsPageContent from './ResultsPageContent';

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