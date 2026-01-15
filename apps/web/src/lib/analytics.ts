/**
 * Rankify Analytics System
 * Comprehensive analytics implementation for GA4, user behavior tracking, and performance monitoring
 */

import { useEffect, useCallback } from 'react';

// Analytics Configuration
export const ANALYTICS_CONFIG = {
  GA4_ID: process.env.NEXT_PUBLIC_GA4_ID || 'G-XXXXXXXXXX', // Replace with actual GA4 ID
  CLARITY_ID: process.env.NEXT_PUBLIC_CLARITY_ID || 'XXXXXXXXXX', // Replace with actual Clarity ID
  SENTRY_DSN: process.env.NEXT_PUBLIC_SENTRY_DSN, // For error tracking
};

// Event Types
export type AnalyticsEvent =
  | 'page_view'
  | 'audit_start'
  | 'audit_complete'
  | 'audit_error'
  | 'view_full_report'
  | 'login'
  | 'login_error'
  | 'sign_up'
  | 'sign_up_error'
  | 'logout'
  | 'button_click'
  | 'link_click'
  | 'form_interaction'
  | 'form_view'
  | 'form_field_interaction'
  | 'form_submit'
  | 'form_abandon'
  | 'page_hidden'
  | 'page_visible'
  | 'signup_start'
  | 'signup_complete'
  | 'feature_interaction'
  | 'performance_metric'
  | 'api_response';

// Event Parameters
export interface EventParams {
  category?: string;
  label?: string;
  value?: number;
  custom_parameters?: Record<string, any>;
  user_properties?: Record<string, any>;
}

// Google Analytics 4 Implementation
class GA4Analytics {
  private initialized = false;

  init() {
    if (this.initialized || typeof window === 'undefined') return;

    // Script is now loaded via @next/third-parties GoogleAnalytics in layout.tsx
    // Just initialize gtag configuration
    if (window.gtag) {
      window.gtag('config', ANALYTICS_CONFIG.GA4_ID, {
        send_page_view: false, // We'll handle page views manually
        enhanced_measurement: {
          scroll: true,  // Automatically tracks 90% scroll depth
          clicks: true,  // Automatically tracks outbound clicks
          file_downloads: true, // Automatically tracks file downloads
        },
        custom_map: {
          dimension1: 'user_type',
          dimension2: 'subscription_tier',
          dimension3: 'feature_used',
        },
        custom_parameters: {
          user_id: null,
          user_properties: {},
        },
      });
    }

    this.initialized = true;
  }

  trackEvent(event: AnalyticsEvent, params: EventParams = {}) {
    if (!this.initialized || !window.gtag) return;

    const eventData = {
      event_category: params.category || 'engagement',
      event_label: params.label,
      value: params.value,
      custom_parameters: params.custom_parameters || {},
      ...params.user_properties,
    };

    window.gtag('event', event, eventData);
  }

  trackPageView(page_title?: string, page_location?: string) {
    if (!this.initialized || !window.gtag) return;

    window.gtag('event', 'page_view', {
      page_title: page_title || document.title,
      page_location: page_location || window.location.href,
    });
  }

  setUserProperties(properties: Record<string, any>) {
    if (!this.initialized || !window.gtag) return;

    window.gtag('config', ANALYTICS_CONFIG.GA4_ID, {
      custom_parameters: {
        user_properties: properties,
      },
    });
  }

  setUserId(userId: string) {
    if (!this.initialized || !window.gtag) return;

    window.gtag('config', ANALYTICS_CONFIG.GA4_ID, {
      user_id: userId,
    });
  }
}

// Microsoft Clarity Implementation
class ClarityAnalytics {
  private initialized = false;

  init() {
    if (this.initialized || typeof window === 'undefined') return;

    // Script is now loaded via @next/third-parties in layout.tsx
    // Just mark as initialized since the script will be available
    this.initialized = true;
  }
}

// Performance Monitoring
class PerformanceAnalytics {
  trackWebVitals() {
    if (typeof window === 'undefined') return;

    // Core Web Vitals tracking
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.entryType === 'measure') continue;

        const metric = {
          name: entry.name,
          value: entry.startTime,
          rating: this.getRating(entry.name, entry.startTime),
        };

        // Send to analytics
        analytics.trackEvent('performance_metric', {
          category: 'web_vitals',
          label: entry.name,
          value: Math.round(entry.startTime),
          custom_parameters: { rating: metric.rating },
        });
      }
    });

    observer.observe({ entryTypes: ['measure', 'navigation', 'resource'] });
  }

  private getRating(metric: string, value: number): 'good' | 'needs-improvement' | 'poor' {
    switch (metric) {
      case 'LCP':
        return value <= 2500 ? 'good' : value <= 4000 ? 'needs-improvement' : 'poor';
      case 'FID':
        return value <= 100 ? 'good' : value <= 300 ? 'needs-improvement' : 'poor';
      case 'CLS':
        return value <= 0.1 ? 'good' : value <= 0.25 ? 'needs-improvement' : 'poor';
      default:
        return 'good';
    }
  }

  trackAPIResponse(endpoint: string, responseTime: number, status: number) {
    analytics.trackEvent('api_response', {
      category: 'performance',
      label: endpoint,
      value: responseTime,
      custom_parameters: { status_code: status },
    });
  }
}

// Main Analytics Instance
export const analytics = {
  ga4: new GA4Analytics(),
  clarity: new ClarityAnalytics(),
  performance: new PerformanceAnalytics(),

  init() {
    this.ga4.init();
    this.clarity.init();
    this.performance.trackWebVitals();
  },

  trackEvent(event: AnalyticsEvent, params?: EventParams) {
    this.ga4.trackEvent(event, params);
  },

  trackPageView(page_title?: string, page_location?: string) {
    this.ga4.trackPageView(page_title, page_location);
  },

  setUserId(userId: string) {
    this.ga4.setUserId(userId);
  },

  setUserProperties(properties: Record<string, any>) {
    this.ga4.setUserProperties(properties);
  },
};

// React Hook for Analytics
export function useAnalytics() {
  const trackEvent = useCallback((event: AnalyticsEvent, params?: EventParams) => {
    analytics.trackEvent(event, params);
  }, []);

  const trackPageView = useCallback((page_title?: string, page_location?: string) => {
    analytics.trackPageView(page_title, page_location);
  }, []);

  const setUserId = useCallback((userId: string) => {
    analytics.setUserId(userId);
  }, []);

  const setUserProperties = useCallback((properties: Record<string, any>) => {
    analytics.setUserProperties(properties);
  }, []);

  return {
    trackEvent,
    trackPageView,
    setUserId,
    setUserProperties,
  };
}

// Global type declarations
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    clarity: (...args: any[]) => void;
  }
}