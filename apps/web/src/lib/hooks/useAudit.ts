/**
 * Custom hook for managing website audit state with query parameters
 */

'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { 
  createAuditScan, 
  pollScanResults, 
  type ScanResult,
  type ScanStatus 
} from '@/lib/api/audit';
import { validateAndNormalizeUrl } from '@/lib/utils/url';
import { analytics } from '@/lib/analytics';

export type AuditState = 'idle' | 'validating' | 'scanning' | 'polling' | 'complete' | 'error';

export interface UseAuditReturn {
  // State
  state: AuditState;
  progress: number;
  currentStep: string;
  error: string | null;
  scanId: string | null;
  results: ScanResult | null;
  
  // Actions
  startScan: (url: string) => Promise<void>;
  reset: () => void;
  retry: () => void;
  viewFullReport: () => void;
  
  // Helpers
  isLoading: boolean;
  canScan: boolean;
}

const SCAN_STEPS = [
  'Validating URL...',
  'Initializing scan...',
  'Fetching page content...',
  'Analyzing meta tags...',
  'Checking heading structure...',
  'Evaluating content quality...',
  'Analyzing images...',
  'Checking links...',
  'Running security checks...',
  'Calculating scores...',
  'Generating report...',
];

export function useAudit(initialScanId?: string | null): UseAuditReturn {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [state, setState] = useState<AuditState>('idle');
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [scanId, setScanId] = useState<string | null>(initialScanId || null);
  const [results, setResults] = useState<ScanResult | null>(null);
  const [lastUrl, setLastUrl] = useState<string>('');

  // Track if we've already processed the initial URL params
  const [hasProcessedInitialParams, setHasProcessedInitialParams] = useState(false);

  const progressInterval = useRef<NodeJS.Timeout | undefined>(undefined);
  const pollingAborted = useRef(false);

  /**
   * Simulate progressive loading with realistic steps
   */
  const simulateProgress = useCallback(() => {
    let stepIndex = 0;
    let currentProgress = 0;

    progressInterval.current = setInterval(() => {
      if (stepIndex < SCAN_STEPS.length) {
        setCurrentStep(SCAN_STEPS[stepIndex]);
        currentProgress = ((stepIndex + 1) / SCAN_STEPS.length) * 90; // Max 90% during scanning
        setProgress(currentProgress);
        stepIndex++;
      } else {
        if (progressInterval.current) {
          clearInterval(progressInterval.current);
        }
      }
    }, 800);
  }, []);

  /**
   * Clear progress simulation
   */
  const clearProgress = useCallback(() => {
    if (progressInterval.current) {
      clearInterval(progressInterval.current);
      progressInterval.current = undefined;
    }
  }, []);

  /**
   * Update URL with query parameters
   */
  const updateUrlParams = useCallback((newScanId: string, url: string) => {
    console.log('[useAudit] Updating URL params:', { newScanId, url });
    const params = new URLSearchParams(searchParams.toString());
    params.set('scan', newScanId);
    params.set('url', url);

    // For static exports, use window.history to avoid router issues
    if (typeof window !== 'undefined') {
      const newUrl = `${window.location.pathname}?${params.toString()}`;
      window.history.replaceState({}, '', newUrl);
    } else {
      // Fallback for SSR
      router.replace(`?${params.toString()}`, { scroll: false });
    }
  }, [router, searchParams]);

  /**
   * Clear URL parameters
   */
  const clearUrlParams = useCallback(() => {
    console.log('[useAudit] Clearing URL params');
    const params = new URLSearchParams(searchParams.toString());
    params.delete('scan');
    params.delete('url');

    // For static exports, use window.history to avoid router issues
    if (typeof window !== 'undefined') {
      const newUrl = `${window.location.pathname}?${params.toString()}`;
      window.history.replaceState({}, '', newUrl);
    } else {
      // Fallback for SSR
      router.replace(`?${params.toString()}`, { scroll: false });
    }
  }, [router, searchParams]);

  /**
   * Start a new audit scan
   */
  const startScan = useCallback(async (url: string) => {
    // Reset state
    setState('validating');
    setProgress(0);
    setError(null);
    setResults(null);
    pollingAborted.current = false;
    clearProgress();

    try {
      // Validate URL
      setCurrentStep('Validating URL...');
      const validation = validateAndNormalizeUrl(url);
      
      if (!validation.valid) {
        throw new Error(validation.error || 'Invalid URL');
      }

      const normalizedUrl = validation.normalizedUrl!;
      setLastUrl(normalizedUrl);

      // Create scan
      setState('scanning');
      setCurrentStep('Initializing scan...');
      setProgress(5);

      const response = await createAuditScan(normalizedUrl);
      
      if (pollingAborted.current) return;

      // Track audit start
      analytics.trackEvent('audit_start', {
        category: 'engagement',
        label: normalizedUrl,
        custom_parameters: {
          scan_id: response.scan_id,
          url: normalizedUrl,
        },
      });

      setScanId(response.scan_id);
      updateUrlParams(response.scan_id, normalizedUrl);

      // Start progress simulation
      simulateProgress();

      // Poll for results
      setState('polling');
      const scanResults = await pollScanResults(response.scan_id, {
        interval: 2000,
        maxAttempts: 60,
        onProgress: (attempt, max) => {
          // Progress is mainly driven by simulateProgress
          // This just ensures we don't get stuck
          const pollingProgress = 90 + (attempt / max) * 10;
          setProgress(Math.max(progress, pollingProgress));
        },
      });

      if (pollingAborted.current) return;

      // Complete - show inline results, don't auto-navigate
      clearProgress();
      setProgress(100);
      setCurrentStep('Complete!');
      setResults(scanResults);
      setState('complete');

      // Track successful audit completion
      analytics.trackEvent('audit_complete', {
        category: 'engagement',
        label: normalizedUrl,
        custom_parameters: {
          scan_id: response.scan_id,
          url: normalizedUrl,
          score: scanResults?.score,
        },
      });
      
      // Cache results for the results page to use immediately
      // This prevents the results page from re-fetching
      try {
        const cacheKey = `scan_results_${response.scan_id}`;
        sessionStorage.setItem(cacheKey, JSON.stringify(scanResults));
      } catch {
        // Storage might be full, continue without caching
      }
      
      // Note: We no longer auto-navigate to results page
      // User will click "View Full Report" button to see comprehensive results
      // This provides a better UX with preview before full report

    } catch (err) {
      clearProgress();
      setState('error');
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(errorMessage);
      console.error('Audit scan error:', err);

      // Track audit failure
      analytics.trackEvent('audit_error', {
        category: 'engagement',
        label: lastUrl || url,
        custom_parameters: {
          error_message: errorMessage,
          url: lastUrl || url,
        },
      });
    }
  }, [progress, simulateProgress, clearProgress, updateUrlParams]);

  /**
   * Reset to initial state
   */
  const reset = useCallback(() => {
    pollingAborted.current = true;
    clearProgress();
    setState('idle');
    setProgress(0);
    setCurrentStep('');
    setError(null);
    setScanId(null);
    setResults(null);
    setLastUrl('');
    clearUrlParams();
  }, [clearProgress, clearUrlParams]);

  /**
   * Retry the last scan
   */
  const retry = useCallback(() => {
    if (lastUrl) {
      startScan(lastUrl);
    }
  }, [lastUrl, startScan]);

  /**
   * Navigate to full report page and track the event
   */
  const viewFullReport = useCallback(() => {
    if (scanId && lastUrl) {
      // Track view full report event
      analytics.trackEvent('view_full_report', {
        category: 'engagement',
        label: lastUrl,
        custom_parameters: {
          scan_id: scanId,
          url: lastUrl,
        },
      });

      // Navigate to results page
      router.push(`/website-audit/results?scan=${scanId}&url=${encodeURIComponent(lastUrl)}`);
    }
  }, [scanId, lastUrl, router]);

  /**
   * Auto-load scan if scanId in URL
   */
  useEffect(() => {
    const scanIdParam = searchParams.get('scan');
    const urlParam = searchParams.get('url');

    // Only load if we have a scanId param, no current scanId, we're in idle state,
    // and we haven't already processed the initial params
    if (scanIdParam && !scanId && state === 'idle' && !hasProcessedInitialParams && scanIdParam !== initialScanId) {
      console.log('[useAudit] Loading existing scan:', scanIdParam);
      setHasProcessedInitialParams(true);
      setScanId(scanIdParam);
      setState('polling');
      setProgress(50);
      setCurrentStep('Loading scan results...');

      pollScanResults(scanIdParam, {
        interval: 2000,
        maxAttempts: 30,
      })
        .then((scanResults) => {
          console.log('[useAudit] Scan results loaded successfully');
          setResults(scanResults);
          setState('complete');
          setProgress(100);
          setCurrentStep('Complete!');
          if (urlParam) {
            setLastUrl(urlParam);
          }
        })
        .catch((err) => {
          console.error('[useAudit] Failed to load scan results:', err);
          setState('error');
          setError(err instanceof Error ? err.message : 'Failed to load scan results');
        });
    }
  }, [searchParams, scanId, state, initialScanId, hasProcessedInitialParams]);

  /**
   * Cleanup on unmount
   */
  useEffect(() => {
    return () => {
      pollingAborted.current = true;
      clearProgress();
    };
  }, [clearProgress]);

  return {
    state,
    progress,
    currentStep,
    error,
    scanId,
    results,
    startScan,
    reset,
    retry,
    viewFullReport,
    isLoading: ['validating', 'scanning', 'polling'].includes(state),
    canScan: state === 'idle' || state === 'complete' || state === 'error',
  };
}
