"use client";

import { useEffect } from 'react';
import { analytics } from '@/lib/analytics';
import { UserBehaviorTracker } from './UserBehaviorTracker';

export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Initialize all analytics services
    analytics.init();

    // Track initial page view
    analytics.trackPageView();
  }, []);

  return (
    <>
      <UserBehaviorTracker />
      {children}
    </>
  );
}