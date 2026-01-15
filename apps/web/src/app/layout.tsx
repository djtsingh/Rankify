import type { Metadata, Viewport } from "next";
import "./globals.css";
import { satoshi } from "@/fonts";
import { AuthProvider } from "@/lib/auth/auth-context";
import { AnalyticsProvider } from "@/components/analytics/AnalyticsProvider";
import { GoogleAnalytics } from "@next/third-parties/google";
import Script from "next/script";

// Using Satoshi for all text site-wide



// Viewport configuration for responsive design
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#1490df',
};

// Comprehensive SEO metadata following best practices
export const metadata: Metadata = {
  metadataBase: new URL('https://www.rankify.page'),
  
  // Primary metadata
  title: {
    default: 'Rankify | Make Your Rankings Fly.',
    template: '%s | Rankify - Make Your Rankings Fly.',
  },
  description: 'Free, powerful SEO tools to analyze, optimize, and improve your website rankings. URL analyzer, keyword density checker, meta tag generator, and more. No hidden fees, instant results.',
  
  // Keywords for search engines (still used by some engines)
  keywords: [
    'SEO tools',
    'free SEO analyzer',
    'website optimization',
    'keyword density checker',
    'meta tag generator',
    'URL analyzer',
    'SEO audit',
    'search engine optimization',
    'website SEO checker',
    'free SEO tools',
  ],
  
  // Author and creator information
  authors: [{ name: 'Rankify' }],
  creator: 'Rankify',
  publisher: 'Rankify',
  
  // Robots directives
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  
  // OpenGraph metadata for social sharing
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://www.rankify.page',
    siteName: 'Rankify',
    title: 'Rankify - Free SEO Tools for Website Optimization',
    description: 'Free, powerful SEO tools to analyze, optimize, and improve your website rankings. Instant results, no hidden fees.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Rankify - SEO Made Simple',
        type: 'image/png',
      },
    ],
  },
  
  // Twitter Card metadata
  twitter: {
    card: 'summary_large_image',
    title: 'Rankify - Free SEO Tools for Website Optimization',
    description: 'Free, powerful SEO tools to analyze, optimize, and improve your website rankings.',
    creator: '@rankify',
    images: ['/twitter-image.png'],
  },
  
  // Favicon and icons following Google's best practices
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/favicon.ico',
  },

  // PWA manifest
  manifest: '/manifest.json',
  
  // Verification for search engines
  verification: {
    google: 'your-google-verification-code',
    // yandex: 'your-yandex-verification-code',
    // bing: 'your-bing-verification-code',
  },
  
  // Alternate languages (if applicable)
  alternates: {
    canonical: 'https://www.rankify.page',
  },
  
  // Category for app stores and directories
  category: 'Technology',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html 
      lang="en" 
      suppressHydrationWarning
      className={satoshi.variable}
    >
      <head>
        {/* Preconnect to critical domains for faster resource loading */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* Additional favicon support for better browser compatibility */}
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <meta name="theme-color" content="#1490df" />
        <meta name="msapplication-TileColor" content="#1490df" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
      </head>
      <body 
        className="font-sans antialiased bg-black"
        suppressHydrationWarning
      >
        <AnalyticsProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </AnalyticsProvider>
        
        {/* Optimized Analytics Loading */}
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA4_ID || 'G-XXXXXXXXXX'} />
        <Script
          src={`https://www.clarity.ms/tag/${process.env.NEXT_PUBLIC_CLARITY_ID || 'XXXXXXXXXX'}`}
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
