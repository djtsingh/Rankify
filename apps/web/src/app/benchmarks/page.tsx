import Link from 'next/link';

export default function BenchmarksPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground px-4 py-12">
      <div className="text-center space-y-6 max-w-md w-full">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white dark:text-white">
          Industry Benchmarks
        </h1>
        <p className="text-base sm:text-lg text-muted-foreground dark:text-muted-foreground">
          Sign in to see how your site compares to industry leaders.
        </p>
        <Link 
          href="/login" 
          className="rankify-button inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base w-full sm:w-auto"
        >
          Sign In to Continue
        </Link>
      </div>
    </div>
  );
}
