'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Navigation } from '@/components/layout/Navigation';
import { Footer } from '@/components/layout/Footer';
import { Search, Plus, Trash2, TrendingUp, RefreshCw } from 'lucide-react';

export default function KeywordsContent() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [keywords, setKeywords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  useEffect(() => {
    if (status === 'authenticated') {
      setLoading(false);
    }
  }, [status]);

  if (status === 'loading' || !session) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#080b0f] via-[#0e1318] to-[#080b0f]">
        <Navigation />
        <div className="flex items-center justify-center h-screen">
          <RefreshCw className="w-8 h-8 animate-spin text-[#00e5d1]" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#080b0f] via-[#0e1318] to-[#080b0f]">
      <Navigation />
      <main className="max-w-7xl mx-auto px-6 py-16">
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-2">
            <span className="text-[#00e5d1]">Keywords</span>
          </h1>
          <p className="text-[rgba(255,255,255,0.5)]">
            Research and analyze keywords for your projects
          </p>
        </div>

        <div className="p-6 bg-gradient-to-b from-[#141a21] to-[#0e1318] border border-[rgba(255,255,255,0.06)] rounded-xl">
          <div className="flex items-center gap-3 mb-4">
            <Search className="w-5 h-5 text-[#00e5d1]" />
            <h2 className="text-xl font-bold">Keyword Research</h2>
          </div>
          <p className="text-[rgba(255,255,255,0.5)]">
            Discover high-opportunity keywords for your content strategy
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
