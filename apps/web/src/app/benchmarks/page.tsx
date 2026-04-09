import Link from 'next/link';

export default function BenchmarksPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#080b0f] via-[#0e1318] to-[#080b0f]">
      <div className="text-center space-y-6">
        <h1 className="text-4xl font-bold text-white">Industry Benchmarks</h1>
        <p className="text-slate-400">Sign in to see how your site compares to industry leaders.</p>
        <Link href="/login" className="inline-block px-8 py-3 bg-[#00e5d1] text-black rounded-lg font-semibold hover:bg-[#00d4bd] transition">
          Sign In to Continue
        </Link>
      </div>
    </div>
  );
}
