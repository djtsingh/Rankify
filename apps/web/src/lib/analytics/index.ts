/**
 * Rankify Analytics System v2.0
 * Robust Google Analytics 4 + Microsoft Clarity implementation
 * 
 * Features:
 * - Proper script loading order
 * - Consent management (GDPR ready)
 * - Web Vitals tracking
 * - Custom event tracking
 * - User behavior analytics
 */

// ============================================================================
// Configuration
// ============================================================================

// Hardcoded for static export reliability
export const GA4_MEASUREMENT_ID = 'G-B4VYMCS0Z5';
export const CLARITY_PROJECT_ID = 'v0api0xc0z';

export const ANALYTICS_CONFIG = {
  GA4_ID: GA4_MEASUREMENT_ID,
  CLARITY_ID: CLARITY_PROJECT_ID,
  DEBUG_MODE: process.env.NODE_ENV === 'development',
  SEND_PAGE_VIEW: true,
  ENHANCED_MEASUREMENT: true,
};

// ============================================================================
// Types
// ============================================================================

export type AnalyticsEventName =
  // Page events
  | 'page_view'
  // Audit events
  | 'audit_start'
  | 'audit_complete'
  | 'audit_error'
  | 'audit_report_view'
  // Auth events
  | 'login'
  | 'login_error'
  | 'sign_up'
  | 'sign_up_error'
  | 'logout'
  // Engagement events
  | 'button_click'
  | 'link_click'
  | 'cta_click'
  | 'scroll_depth'
  // Form events
  | 'form_start'
  | 'form_submit'
  | 'form_error'
  | 'form_abandon'
  // Performance events
  | 'web_vitals'
  | 'api_response_time'
  // Custom events
  | 'feature_used'
  | 'error_occurred';

export interface EventParameters {
  [key: string]: string | number | boolean | undefined;
}

export interface AnalyticsUser {
  userId?: string;
  userType?: 'anonymous' | 'free' | 'premium';
  subscriptionTier?: string;
}

// ============================================================================
// gtag Declaration
// ============================================================================

declare global {
  interface Window {
    gtag: (...args: unknown[]) => void;
    clarity: (...args: unknown[]) => void;
  }
}

// ============================================================================
// Analytics Class
// ============================================================================

class Analytics {
  private initialized = false;
  private consentGranted = true; // Default to true, update based on cookie consent
  private debugMode = ANALYTICS_CONFIG.DEBUG_MODE;

  /**
   * Initialize Google Analytics 4
   * Called after gtag script is loaded
   */
  init(): void {
    if (this.initialized) return;
    if (typeof window === 'undefined') return;

    // Ensure dataLayer exists
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).dataLayer = (window as any).dataLayer || [];

    // Define gtag function if not exists
    if (typeof window.gtag !== 'function') {
      window.gtag = function gtag(...args: unknown[]) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (window as any).dataLayer.push(args);
      };
    }

    // Initialize gtag with timestamp
    window.gtag('js', new Date());

    // Configure GA4
    window.gtag('config', GA4_MEASUREMENT_ID, {
      send_page_view: false, // We'll track manually for SPA
      debug_mode: this.debugMode,
      cookie_flags: 'SameSite=None;Secure',
    });

    this.initialized = true;
    this.log('Analytics initialized with ID:', GA4_MEASUREMENT_ID);
  }

  /**
   * Track a custom event
   */
  trackEvent(eventName: AnalyticsEventName, params: EventParameters = {}): void {
    if (!this.canTrack()) return;

    const eventParams = {
      ...params,
      timestamp: new Date().toISOString(),
      page_location: window.location.href,
      page_path: window.location.pathname,
    };

    window.gtag('event', eventName, eventParams);
    this.log('Event tracked:', eventName, eventParams);
  }

  /**
   * Track page view
   */
  trackPageView(pageTitle?: string, pagePath?: string): void {
    if (!this.canTrack()) return;

    const params = {
      page_title: pageTitle || document.title,
      page_location: window.location.href,
      page_path: pagePath || window.location.pathname,
    };

    window.gtag('event', 'page_view', params);
    this.log('Page view tracked:', params);
  }

  /**
   * Set user properties
   */
  setUser(user: AnalyticsUser): void {
    if (!this.canTrack()) return;

    if (user.userId) {
      window.gtag('config', GA4_MEASUREMENT_ID, {
        user_id: user.userId,
      });
    }

    window.gtag('set', 'user_properties', {
      user_type: user.userType || 'anonymous',
      subscription_tier: user.subscriptionTier || 'free',
    });

    this.log('User set:', user);
  }

  /**
   * Clear user data (on logout)
   */
  clearUser(): void {
    if (!this.canTrack()) return;

    window.gtag('config', GA4_MEASUREMENT_ID, {
      user_id: undefined,
    });

    this.log('User cleared');
  }

  /**
   * Update consent state
   */
  setConsent(granted: boolean): void {
    this.consentGranted = granted;

    if (this.initialized && typeof window !== 'undefined' && window.gtag) {
      window.gtag('consent', 'update', {
        analytics_storage: granted ? 'granted' : 'denied',
      });
    }

    this.log('Consent updated:', granted);
  }

  /**
   * Track Web Vitals metrics
   */
  trackWebVital(metric: { name: string; value: number; rating: string; id: string }): void {
    if (!this.canTrack()) return;

    window.gtag('event', 'web_vitals', {
      event_category: 'Web Vitals',
      event_label: metric.name,
      value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
      metric_id: metric.id,
      metric_rating: metric.rating,
      non_interaction: true,
    });

    this.log('Web Vital tracked:', metric);
  }

  /**
   * Check if tracking is allowed
   */
  private canTrack(): boolean {
    if (typeof window === 'undefined') return false;
    if (!this.initialized) {
      this.log('Analytics not initialized');
      return false;
    }
    if (!this.consentGranted) {
      this.log('Consent not granted');
      return false;
    }
    if (!window.gtag) {
      this.log('gtag not available');
      return false;
    }
    return true;
  }

  /**
   * Debug logging
   */
  private log(...args: unknown[]): void {
    if (this.debugMode) {
      console.log('[Analytics]', ...args);
    }
  }
}

// ============================================================================
// Export Singleton
// ============================================================================

export const analytics = new Analytics();
