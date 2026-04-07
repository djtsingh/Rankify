'use client';

import Link from 'next/link';

// Google Icon SVG
const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

export default function LoginPage() {
  const handleLogin = () => {
    window.location.href = '/.auth/login/google?post_login_redirect_uri=/dashboard';
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950 px-4 md:px-6 relative overflow-hidden">
      {/* Background gradient effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-coral/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="max-w-md w-full space-y-8 relative z-10">
        {/* Logo */}
        <div className="text-center">
          <Link href="/" className="inline-block group">
            <h1 className="text-4xl font-extrabold text-white tracking-tight">
              <span className="text-coral group-hover:text-coral-light transition-colors">Rank</span>ify
            </h1>
          </Link>
          <h2 className="mt-8 text-2xl md:text-3xl font-bold text-white tracking-tight">
            Welcome back
          </h2>
          <p className="mt-3 text-zinc-400">
            Sign in to your account to continue
          </p>
        </div>

        {/* Sign in Card */}
        <div className="bg-zinc-900/60 backdrop-blur-xl rounded-2xl p-8 border border-zinc-800 shadow-2xl">
          {/* Google Sign In Button */}
          <button
            onClick={handleLogin}
            className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-white text-zinc-900 rounded-xl font-semibold hover:bg-zinc-100 transition-all duration-200 hover:shadow-lg hover:shadow-white/10 hover:scale-[1.02] active:scale-[0.98]"
          >
            <GoogleIcon />
            Continue with Google
          </button>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-zinc-800"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-4 bg-zinc-900/60 text-zinc-500">Secure authentication</span>
            </div>
          </div>

          {/* Trust badges */}
          <div className="flex items-center justify-center gap-6 text-zinc-500 text-sm">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-emerald" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <span>SSL Secured</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4 text-emerald" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <span>Privacy First</span>
            </div>
          </div>

          <p className="mt-8 text-center text-xs text-zinc-500">
            By signing in, you agree to our{' '}
            <Link href="/terms" className="text-coral hover:text-coral-light transition-colors hover:underline">Terms of Service</Link>
            {' '}and{' '}
            <Link href="/privacy" className="text-coral hover:text-coral-light transition-colors hover:underline">Privacy Policy</Link>
          </p>
        </div>

        {/* Back link */}
        <p className="text-center text-sm text-zinc-400">
          <Link href="/" className="inline-flex items-center gap-2 text-coral hover:text-coral-light transition-colors hover:underline">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to home
          </Link>
        </p>
      </div>
    </div>
  );
}
