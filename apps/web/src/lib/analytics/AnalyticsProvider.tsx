'use client';

import { useEffect, useCallback, createContext, useContext, ReactNode } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { analytics, AnalyticsEventName, EventParameters, AnalyticsUser } from './index';

// ============================================================================
// Context
// ============================================================================

interface AnalyticsContextValue {
  trackEvent: (eventName: AnalyticsEventName, params?: EventParameters) => void;
  trackPageView: (pageTitle?: string, pagePath?: string) => void;
  setUser: (user: AnalyticsUser) => void;
  clearUser: () => void;
  setConsent: (granted: boolean) => void;
}

const AnalyticsContext = createContext<AnalyticsContextValue | null>(null);

// ============================================================================
// Hook
// ============================================================================

export function useAnalytics() {
  const context = useContext(AnalyticsContext);
  
  if (!context) {
    // Return no-op functions if used outside provider
    return {
      trackEvent: () => {},
      trackPageView: () => {},
      setUser: () => {},
      clearUser: () => {},
      setConsent: () => {},
    };
  }
  
  return context;
}

// ============================================================================
// Provider
// ============================================================================

interface AnalyticsProviderProps {
  children: ReactNode;
}

export function AnalyticsProvider({ children }: AnalyticsProviderProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Track page view on route change
  useEffect(() => {
    // Small delay to ensure gtag is ready after navigation
    const timeout = setTimeout(() => {
      analytics.trackPageView();
    }, 100);

    return () => clearTimeout(timeout);
  }, [pathname, searchParams]);

  // Memoized tracking functions
  const trackEvent = useCallback((eventName: AnalyticsEventName, params?: EventParameters) => {
    analytics.trackEvent(eventName, params);
  }, []);

  const trackPageView = useCallback((pageTitle?: string, pagePath?: string) => {
    analytics.trackPageView(pageTitle, pagePath);
  }, []);

  const setUser = useCallback((user: AnalyticsUser) => {
    analytics.setUser(user);
  }, []);

  const clearUser = useCallback(() => {
    analytics.clearUser();
  }, []);

  const setConsent = useCallback((granted: boolean) => {
    analytics.setConsent(granted);
  }, []);

  const value: AnalyticsContextValue = {
    trackEvent,
    trackPageView,
    setUser,
    clearUser,
    setConsent,
  };

  return (
    <AnalyticsContext.Provider value={value}>
      {children}
    </AnalyticsContext.Provider>
  );
}
