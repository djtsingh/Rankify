/**
 * Website Audit API
 * Handles scan creation and result fetching
 */

import { get, post } from './client';
import { transformToComprehensiveAudit } from './transform-audit';
import type { ComprehensiveSEOAudit } from '@/lib/types/seo-audit';

// ==================== Types ====================

export interface ScanMetrics {
  // Meta Information
  url: string;
  title?: string;
  title_length: number;
  meta_description?: string;
  meta_description_length: number;
  
  // Heading Structure
  h1_tags: string[];
  h1_count: number;
  h2_count: number;
  h3_count: number;
  
  // Content Metrics
  word_count: number;
  paragraph_count: number;
  text_to_html_ratio: number;
  
  // Images
  image_count: number;
  images_without_alt: number;
  images_optimized: number;
  
  // Links
  internal_links_count: number;
  external_links_count: number;
  broken_links_count: number;
  
  // Security & Technical
  https_enabled: boolean;
  has_canonical: boolean;
  canonical_url?: string;
  has_og_tags: boolean;
  has_twitter_cards: boolean;
  has_structured_data: boolean;
  has_robots_txt: boolean;
  has_sitemap: boolean;
  
  // Performance
  page_load_time_ms?: number;
  page_size_kb?: number;
  requests_count?: number;
  
  // Mobile
  mobile_friendly?: boolean;
  viewport_configured: boolean;
  
  // Additional
  language?: string;
  charset?: string;
  [key: string]: any;
}

export interface ScanIssue {
  id: string;
  type: string;
  category: 'critical' | 'important' | 'moderate' | 'minor';
  severity: 'critical' | 'warning' | 'info';
  title: string;
  description: string;
  recommendation: string;
  impact_score: number;
  expected_improvement: string;
  time_to_fix_hours: number;
  priority: number;
  affected_elements?: string[];
  data?: Record<string, any>;
}

export type ScanStatus = 'pending' | 'processing' | 'completed' | 'failed';

export interface ScanResult {
  scan_id: string;
  url: string;
  status: ScanStatus;
  score?: number;
  grade?: 'A+' | 'A' | 'B' | 'C' | 'D' | 'F';
  created_at: string;
  completed_at?: string;
  processing_time_ms?: number;
  error?: string;
  metrics?: ScanMetrics;
  issues?: ScanIssue[];
  categoryScores?: {
    performance?: number;
    technical?: number;
    content?: number;
    ux?: number;
    security?: number;
    social?: number;
  };
  summary?: {
    critical_issues: number;
    warnings: number;
    passed_checks: number;
    total_checks: number;
  };
}

export interface CreateScanRequest {
  url: string;
  options?: {
    include_performance?: boolean;
    include_mobile?: boolean;
    include_security?: boolean;
  };
}

export interface CreateScanResponse {
  scan_id: string;
  status: 'pending';
  message: string;
  url: string;
  estimated_time_seconds: number;
}

// ==================== API Functions ====================

/**
 * Create a new website audit scan
 */
export async function createAuditScan(
  url: string,
  options?: CreateScanRequest['options']
): Promise<CreateScanResponse> {
  // Real API call to create scan
  return post<CreateScanResponse>('/api/v1/scans', {
    url,
    options,
  });
}

/**
 * Transform backend API response to frontend ScanResult format
 */
function transformApiResponse(apiResponse: any): ScanResult {
  // Handle both wrapped {data: {...}} and unwrapped responses
  const data = apiResponse.data || apiResponse;
  
  // Map status: backend may use 'complete' or 'completed'
  let status: ScanStatus = data.status;
  if (data.status === 'complete') status = 'completed';
  
  // Transform to ScanResult format
  const result: ScanResult = {
    scan_id: data.id || data.scan_id,
    url: data.url,
    status: status,
    score: data.score,
    grade: data.grade,
    created_at: data.createdAt || data.created_at,
    completed_at: data.completedAt || data.completed_at,
    error: data.errorMessage || data.error,
    metrics: data.results ? transformMetrics(data.results) : undefined,
    issues: data.issues ? transformIssues(data.issues) : undefined,
    summary: data.summary ? {
      critical_issues: data.summary.criticalIssues || data.summary.critical_issues || 0,
      warnings: data.summary.warnings || 0,
      passed_checks: data.summary.passedChecks || data.summary.passed_checks || 0,
      total_checks: data.summary.totalChecks || data.summary.total_checks || 50,
    } : undefined,
  };
  
  // Store full results for comprehensive view
  if (data.results) {
    (result as any).fullResults = data.results;
  }
  
  return result;
}

/**
 * Transform backend metrics to frontend format
 */
function transformMetrics(results: any): ScanMetrics {
  const onPage = results.onPage || {};
  const technical = results.technical || {};
  const performance = results.performance || {};
  
  return {
    url: results.url || '',
    title: onPage.title?.content,
    title_length: onPage.title?.length || 0,
    meta_description: onPage.metaDescription?.content,
    meta_description_length: onPage.metaDescription?.length || 0,
    h1_tags: onPage.headings?.h1?.content ? [onPage.headings.h1.content] : [],
    h1_count: onPage.headings?.h1?.count || 0,
    h2_count: onPage.headings?.h2?.count || 0,
    h3_count: onPage.headings?.h3?.count || 0,
    word_count: onPage.content?.wordCount || 0,
    paragraph_count: onPage.content?.paragraphCount || 0,
    text_to_html_ratio: 0.5, // Not provided by backend
    image_count: onPage.images?.total || 0,
    images_without_alt: onPage.images?.withoutAlt || 0,
    images_optimized: onPage.images?.optimized || 0,
    internal_links_count: onPage.links?.internal?.count || 0,
    external_links_count: onPage.links?.external?.count || 0,
    broken_links_count: onPage.links?.internal?.broken || 0,
    https_enabled: technical.security?.https || false,
    has_canonical: technical.crawlability?.canonicalization?.hasCanonical || false,
    canonical_url: undefined,
    has_og_tags: results.social?.openGraph?.present || false,
    has_twitter_cards: results.social?.twitterCards?.present || false,
    has_structured_data: technical.structuredData?.present || false,
    has_robots_txt: technical.crawlability?.robotsTxt?.exists || false,
    has_sitemap: technical.crawlability?.xmlSitemap?.exists || false,
    page_load_time_ms: performance.pageLoadTime,
    page_size_kb: performance.totalPageSize ? performance.totalPageSize / 1024 : undefined,
    requests_count: performance.resourceCount,
    mobile_friendly: technical.mobile?.responsiveDesign || false,
    viewport_configured: technical.mobile?.viewportConfigured || false,
    language: technical.internationalization?.contentLanguage,
    charset: 'UTF-8',
  };
}

/**
 * Transform backend issues to frontend format
 */
function transformIssues(issues: any[]): ScanIssue[] {
  return issues.map(issue => ({
    id: issue.id,
    type: issue.type || 'issue',
    category: mapCategory(issue.category),
    severity: mapSeverity(issue.severity),
    title: issue.title,
    description: issue.description || issue.title,
    recommendation: issue.recommendation || '',
    impact_score: issue.impact_score || 50,
    expected_improvement: issue.expected_improvement || '',
    time_to_fix_hours: issue.time_to_fix_hours || 1,
    priority: issue.priority || 50,
    affected_elements: [],
    data: issue.data,
  }));
}

function mapCategory(category: string): 'critical' | 'important' | 'moderate' | 'minor' {
  const mapping: Record<string, 'critical' | 'important' | 'moderate' | 'minor'> = {
    'critical': 'critical',
    'error': 'critical',
    'high': 'important',
    'warning': 'moderate',
    'medium': 'moderate',
    'improvement': 'moderate',
    'info': 'minor',
    'low': 'minor',
  };
  return mapping[category?.toLowerCase()] || 'moderate';
}

function mapSeverity(severity: string): 'critical' | 'warning' | 'info' {
  const mapping: Record<string, 'critical' | 'warning' | 'info'> = {
    'critical': 'critical',
    'error': 'critical',
    'high': 'critical',
    'warning': 'warning',
    'medium': 'warning',
    'info': 'info',
    'low': 'info',
  };
  return mapping[severity?.toLowerCase()] || 'warning';
}

/**
 * Get scan results by ID
 */
export async function getScanResults(scanId: string): Promise<ScanResult> {
  // Fetch and transform response from real API
  const response = await get<any>(`/api/v1/scans/${scanId}`);
  return transformApiResponse(response);
}

/**
 * Get comprehensive audit data for results page
 * Transforms API response to ComprehensiveSEOAudit format
 */
export async function getComprehensiveAudit(
  scanId: string, 
  url: string
): Promise<ComprehensiveSEOAudit> {
  // Fetch the raw API response
  const response = await get<any>(`/api/v1/scans/${scanId}`);
  
  // Transform to comprehensive format
  return transformToComprehensiveAudit(response, scanId, url);
}

/**
 * Poll for scan results until complete or failed
 */
export async function pollScanResults(
  scanId: string,
  options: {
    interval?: number;
    maxAttempts?: number;
    onProgress?: (attempt: number, maxAttempts: number) => void;
  } = {}
): Promise<ScanResult> {
  const {
    interval = 2000,
    maxAttempts = 60,
    onProgress,
  } = options;

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    if (onProgress) {
      onProgress(attempt + 1, maxAttempts);
    }

    const result = await getScanResults(scanId);

    if (result.status === 'completed' || result.status === 'failed') {
      return result;
    }

    // Wait before next poll
    await new Promise(resolve => setTimeout(resolve, interval));
  }

  throw new Error('Scan timed out - exceeded maximum polling attempts');
}

/**
 * Calculate SEO score from metrics
 */
export function calculateSEOScore(metrics: ScanMetrics, issues: ScanIssue[]): number {
  let score = 100;

  // Deduct points for issues
  issues.forEach(issue => {
    switch (issue.severity) {
      case 'critical':
        score -= 10;
        break;
      case 'warning':
        score -= 5;
        break;
      case 'info':
        score -= 2;
        break;
    }
  });

  // Bonus points for good practices
  if (metrics.https_enabled) score += 5;
  if (metrics.has_canonical) score += 3;
  if (metrics.has_og_tags) score += 3;
  if (metrics.has_structured_data) score += 5;
  if (metrics.mobile_friendly) score += 5;

  return Math.max(0, Math.min(100, score));
}

/**
 * Get grade from score
 */
export function getGradeFromScore(score: number): ScanResult['grade'] {
  if (score >= 95) return 'A+';
  if (score >= 85) return 'A';
  if (score >= 70) return 'B';
  if (score >= 55) return 'C';
  if (score >= 40) return 'D';
  return 'F';
}

/**
 * Format scan duration
 */
export function formatScanDuration(ms: number): string {
  if (ms < 1000) return `${ms}ms`;
  const seconds = Math.round(ms / 1000);
  if (seconds < 60) return `${seconds}s`;
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}m ${remainingSeconds}s`;
}

/**
 * Group issues by category
 */
export function groupIssuesByCategory(issues: ScanIssue[]): Record<string, ScanIssue[]> {
  return issues.reduce((acc, issue) => {
    const category = issue.category || 'other';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(issue);
    return acc;
  }, {} as Record<string, ScanIssue[]>);
}

/**
 * Sort issues by priority
 */
export function sortIssuesByPriority(issues: ScanIssue[]): ScanIssue[] {
  return [...issues].sort((a, b) => {
    // First by severity
    const severityOrder = { critical: 0, warning: 1, info: 2 };
    const severityDiff = severityOrder[a.severity] - severityOrder[b.severity];
    if (severityDiff !== 0) return severityDiff;
    
    // Then by impact score
    return b.impact_score - a.impact_score;
  });
}
