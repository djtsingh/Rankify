/**
 * Quota & Trial Tracking Hook
 * 
 * Manages guest fingerprinting, quota checking, and upgrade prompts
 * for the freemium model on the main site.
 */

'use client';

import { useState, useEffect, useCallback, createContext, useContext, ReactNode } from 'react';

// =============================================================================
// TYPES
// =============================================================================

export interface QuotaStatus {
  allowed: boolean;
  used: number;
  limit: number;
  remaining: number;
  resetAt: Date;
  upgradeRequired: boolean;
  message?: string;
}

export interface TrialInfo {
  isGuest: boolean;
  isAuthenticated: boolean;
  plan: 'guest' | 'free' | 'pro' | 'enterprise';
  quota: QuotaStatus | null;
  fingerprint: string | null;
}

export type UpgradeTrigger = 
  | 'quota_exceeded'
  | 'feature_locked'
  | 'soft_wall'
  | 'trial_ended';

export interface UpgradePromptData {
  show: boolean;
  trigger: UpgradeTrigger | null;
  feature?: string;
  message?: string;
}

// =============================================================================
// CONSTANTS
// =============================================================================

const STORAGE_KEY = 'rankify_trial_info';
const FINGERPRINT_KEY = 'rankify_fp';
const GUEST_DAILY_LIMIT = 3;
const FREE_USER_DAILY_LIMIT = 5;

// API base URL
const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

// =============================================================================
// FINGERPRINT GENERATION
// =============================================================================

/**
 * Generate a simple browser fingerprint for guest identification
 * In production, consider using FingerprintJS for more robust fingerprinting
 */
async function generateFingerprint(): Promise<string> {
  const components: string[] = [];

  // Screen info
  components.push(`${screen.width}x${screen.height}x${screen.colorDepth}`);

  // Timezone
  components.push(Intl.DateTimeFormat().resolvedOptions().timeZone);

  // Language
  components.push(navigator.language);

  // Platform
  components.push(navigator.platform);

  // Canvas fingerprint (basic)
  try {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.textBaseline = 'top';
      ctx.font = '14px Arial';
      ctx.fillText('Rankify SEO 🚀', 2, 2);
      components.push(canvas.toDataURL().slice(-50));
    }
  } catch {
    components.push('no-canvas');
  }

  // WebGL renderer
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl');
    if (gl) {
      const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
      if (debugInfo) {
        components.push(gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL));
      }
    }
  } catch {
    components.push('no-webgl');
  }

  // Create hash from components
  const data = components.join('|');
  const encoder = new TextEncoder();
  const dataBuffer = encoder.encode(data);
  
  try {
    const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('').slice(0, 32);
  } catch {
    // Fallback for environments without crypto.subtle
    let hash = 0;
    for (let i = 0; i < data.length; i++) {
      const char = data.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash).toString(16).padStart(32, '0').slice(0, 32);
  }
}

/**
 * Get or create fingerprint, stored in localStorage
 */
async function getOrCreateFingerprint(): Promise<string> {
  if (typeof window === 'undefined') {
    return 'server';
  }

  try {
    const stored = localStorage.getItem(FINGERPRINT_KEY);
    if (stored) {
      return stored;
    }

    const fingerprint = await generateFingerprint();
    localStorage.setItem(FINGERPRINT_KEY, fingerprint);
    return fingerprint;
  } catch {
    // Fallback if localStorage is unavailable
    return await generateFingerprint();
  }
}

// =============================================================================
// QUOTA TRACKING HOOK
// =============================================================================

export function useQuotaTracking() {
  const [trialInfo, setTrialInfo] = useState<TrialInfo>({
    isGuest: true,
    isAuthenticated: false,
    plan: 'guest',
    quota: null,
    fingerprint: null
  });

  const [upgradePrompt, setUpgradePrompt] = useState<UpgradePromptData>({
    show: false,
    trigger: null
  });

  const [isLoading, setIsLoading] = useState(true);

  // Initialize fingerprint on mount
  useEffect(() => {
    async function init() {
      setIsLoading(true);
      
      try {
        const fingerprint = await getOrCreateFingerprint();
        
        // Check for stored trial info
        const stored = localStorage.getItem(STORAGE_KEY);
        let storedInfo: Partial<TrialInfo> = {};
        
        if (stored) {
          try {
            storedInfo = JSON.parse(stored);
          } catch {
            // Invalid stored data, ignore
          }
        }

        // Check if quota was reset (new day)
        const resetAt = storedInfo.quota?.resetAt 
          ? new Date(storedInfo.quota.resetAt)
          : null;
        
        const isNewDay = !resetAt || resetAt < new Date();

        setTrialInfo({
          isGuest: !storedInfo.isAuthenticated,
          isAuthenticated: storedInfo.isAuthenticated || false,
          plan: storedInfo.plan || 'guest',
          quota: isNewDay ? {
            allowed: true,
            used: 0,
            limit: GUEST_DAILY_LIMIT,
            remaining: GUEST_DAILY_LIMIT,
            resetAt: getNextMidnight(),
            upgradeRequired: false
          } : storedInfo.quota || null,
          fingerprint
        });

      } catch (error) {
        console.error('Error initializing quota tracking:', error);
      } finally {
        setIsLoading(false);
      }
    }

    init();
  }, []);

  // Save trial info to localStorage when it changes
  useEffect(() => {
    if (!isLoading && trialInfo.fingerprint) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(trialInfo));
      } catch {
        // localStorage unavailable
      }
    }
  }, [trialInfo, isLoading]);

  /**
   * Check if user can perform an action (e.g., run a scan)
   */
  const checkQuota = useCallback(async (): Promise<QuotaStatus> => {
    const fingerprint = trialInfo.fingerprint || await getOrCreateFingerprint();

    // If authenticated, check with API
    if (trialInfo.isAuthenticated) {
      try {
        const response = await fetch(`${API_URL}/api/quota/check`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({ action: 'scan_created' })
        });

        if (response.ok) {
          return await response.json();
        }
      } catch (error) {
        console.error('Error checking quota:', error);
      }
    }

    // For guests, check local quota
    const currentQuota = trialInfo.quota;
    const limit = trialInfo.plan === 'free' ? FREE_USER_DAILY_LIMIT : GUEST_DAILY_LIMIT;
    
    const used = currentQuota?.used || 0;
    const remaining = Math.max(0, limit - used);
    const allowed = remaining > 0;

    const quota: QuotaStatus = {
      allowed,
      used,
      limit,
      remaining,
      resetAt: getNextMidnight(),
      upgradeRequired: !allowed,
      message: allowed 
        ? undefined 
        : trialInfo.plan === 'guest'
          ? "You've used all your free scans. Sign up for more!"
          : "You've reached your daily limit. Upgrade for unlimited scans!"
    };

    return quota;
  }, [trialInfo]);

  /**
   * Record usage after a successful action
   */
  const recordUsage = useCallback(async (action: string = 'scan_created') => {
    const fingerprint = trialInfo.fingerprint || await getOrCreateFingerprint();

    // Update local state
    setTrialInfo(prev => {
      const newUsed = (prev.quota?.used || 0) + 1;
      const limit = prev.plan === 'free' ? FREE_USER_DAILY_LIMIT : GUEST_DAILY_LIMIT;
      const remaining = Math.max(0, limit - newUsed);

      return {
        ...prev,
        quota: {
          allowed: remaining > 0,
          used: newUsed,
          limit,
          remaining,
          resetAt: getNextMidnight(),
          upgradeRequired: remaining <= 0
        }
      };
    });

    // Report to API for server-side tracking
    try {
      await fetch(`${API_URL}/api/quota/record`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Fingerprint': fingerprint
        },
        credentials: 'include',
        body: JSON.stringify({ action })
      });
    } catch (error) {
      console.error('Error recording usage:', error);
    }
  }, [trialInfo.fingerprint]);

  /**
   * Show upgrade prompt with specific trigger
   */
  const showUpgradePrompt = useCallback((
    trigger: UpgradeTrigger,
    feature?: string,
    message?: string
  ) => {
    setUpgradePrompt({
      show: true,
      trigger,
      feature,
      message
    });
  }, []);

  /**
   * Hide upgrade prompt
   */
  const hideUpgradePrompt = useCallback(() => {
    setUpgradePrompt({
      show: false,
      trigger: null
    });
  }, []);

  /**
   * Set authentication state (call after login)
   */
  const setAuthenticated = useCallback((
    authenticated: boolean,
    plan: 'free' | 'pro' | 'enterprise' = 'free'
  ) => {
    setTrialInfo(prev => ({
      ...prev,
      isGuest: !authenticated,
      isAuthenticated: authenticated,
      plan: authenticated ? plan : 'guest',
      quota: {
        allowed: true,
        used: 0,
        limit: plan === 'pro' || plan === 'enterprise' ? -1 : FREE_USER_DAILY_LIMIT,
        remaining: plan === 'pro' || plan === 'enterprise' ? -1 : FREE_USER_DAILY_LIMIT,
        resetAt: getNextMidnight(),
        upgradeRequired: false
      }
    }));
  }, []);

  return {
    trialInfo,
    upgradePrompt,
    isLoading,
    checkQuota,
    recordUsage,
    showUpgradePrompt,
    hideUpgradePrompt,
    setAuthenticated,
    fingerprint: trialInfo.fingerprint
  };
}

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

function getNextMidnight(): Date {
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setUTCDate(tomorrow.getUTCDate() + 1);
  tomorrow.setUTCHours(0, 0, 0, 0);
  return tomorrow;
}

// =============================================================================
// QUOTA CONTEXT (for app-wide access)
// =============================================================================

type QuotaContextType = ReturnType<typeof useQuotaTracking>;

const QuotaContext = createContext<QuotaContextType | undefined>(undefined);

export function QuotaProvider({ children }: { children: ReactNode }) {
  const quota = useQuotaTracking();

  return (
    <QuotaContext.Provider value={quota}>
      {children}
    </QuotaContext.Provider>
  );
}

export function useQuota() {
  const context = useContext(QuotaContext);
  if (context === undefined) {
    throw new Error('useQuota must be used within a QuotaProvider');
  }
  return context;
}
