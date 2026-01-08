/**
 * 🐠 Rankify Design System - Page Layout Component
 * 
 * Consistent layout wrapper for all pages with navigation and footer.
 * Uses the shared Navigation component for consistency.
 */

"use client";

import { type ReactNode } from "react";
import { Navigation } from "./Navigation";
import { Footer } from "./Footer";

interface PageLayoutProps {
  /** Page title - displayed as h1 */
  title: string;
  /** Optional description below title */
  description?: string;
  /** Page content */
  children: ReactNode;
  /** Last updated date string */
  lastUpdated?: string;
  /** Whether to show back button */
  showBackButton?: boolean;
  /** Max width of content area */
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '4xl' | '6xl';
}

const maxWidthMap: Record<string, string> = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  '2xl': 'max-w-2xl',
  '4xl': 'max-w-4xl',
  '6xl': 'max-w-6xl',
};

export default function PageLayout({
  title,
  description,
  children,
  lastUpdated,
  showBackButton = true,
  maxWidth = '4xl',
}: PageLayoutProps) {
  return (
    <div className="min-h-screen bg-black text-foreground transition-colors duration-300">
      {/* Use shared navigation component */}
      <Navigation />

      {/* Page Content */}
      <main className="pt-24 md:pt-28 pb-16">
        <article className={`container mx-auto px-4 md:px-6 ${maxWidthMap[maxWidth]}`}>
          {/* Header */}
          <header className="mb-8 md:mb-12">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-white">
              {title}
            </h1>
            {description && (
              <p className="text-lg md:text-xl text-slate-400 leading-relaxed">
                {description}
              </p>
            )}
            {lastUpdated && (
              <p className="text-sm text-slate-500 mt-4">
                Last updated: {lastUpdated}
              </p>
            )}
          </header>

          {/* Content */}
          <div className="prose prose-lg prose-invert max-w-none">
            {children}
          </div>
        </article>
      </main>

      <Footer />
    </div>
  );
}
