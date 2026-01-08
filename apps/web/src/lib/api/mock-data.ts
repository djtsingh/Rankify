/**
 * Mock Data for Development Testing
 * Simulates backend API responses for local testing
 */

import type { ScanResult, ScanIssue, ScanMetrics } from './audit';

// Mock scan storage (simulates backend state)
export const mockScans = new Map<string, any>();

// Generate unique scan ID
export function generateMockScanId(): string {
  return `scan_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// Simulate network delay
export const mockDelay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Generate realistic mock scan results
export function generateMockResults(url: string, scanId: string): ScanResult {
  const hostname = new URL(url).hostname;
  const score = Math.floor(Math.random() * 25) + 75; // 75-100
  
  const mockMetrics: ScanMetrics = {
    url,
    title: `${hostname} - Professional SEO Services`,
    title_length: 45,
    meta_description: `Discover how ${hostname} can help improve your online presence with expert SEO strategies and optimization techniques.`,
    meta_description_length: 128,
    
    h1_tags: ['Welcome to Our Professional SEO Services'],
    h1_count: 1,
    h2_count: 5,
    h3_count: 8,
    
    word_count: 1247,
    paragraph_count: 15,
    text_to_html_ratio: 18.5,
    
    image_count: 12,
    images_without_alt: 2,
    images_optimized: 10,
    
    internal_links_count: 24,
    external_links_count: 8,
    broken_links_count: 1,
    
    https_enabled: true,
    has_canonical: true,
    canonical_url: url,
    has_og_tags: true,
    has_twitter_cards: false,
    has_structured_data: true,
    has_robots_txt: true,
    has_sitemap: true,
    
    page_load_time_ms: Math.floor(Math.random() * 2000) + 1000,
    page_size_kb: Math.floor(Math.random() * 500) + 300,
    mobile_friendly: true,
    viewport_configured: true,
    responsive_design: true,
  };
  
  const mockIssues: ScanIssue[] = [
    {
      id: '1',
      type: 'meta-description',
      category: 'moderate',
      severity: 'warning',
      title: 'Meta Description Length',
      description: 'Your meta description is slightly short. Optimal length is 150-160 characters.',
      recommendation: 'Expand your meta description to provide more context to search engines.',
      impact_score: 7,
      expected_improvement: 'Better click-through rates from search results',
      time_to_fix_hours: 0.5,
      priority: 3,
      affected_elements: ['<meta name="description">'],
    },
    {
      id: '2',
      type: 'images-alt',
      category: 'important',
      severity: 'warning',
      title: 'Images Missing Alt Text',
      description: '2 images are missing alt text, which affects accessibility and SEO.',
      recommendation: 'Add descriptive alt text to all images for better SEO and accessibility.',
      impact_score: 8,
      expected_improvement: 'Improved accessibility and image search rankings',
      time_to_fix_hours: 0.25,
      priority: 2,
      affected_elements: ['hero-banner.jpg', 'team-photo.png'],
    },
    {
      id: '3',
      type: 'broken-link',
      category: 'critical',
      severity: 'critical',
      title: 'Broken Link Detected',
      description: '1 broken internal link was found on your page.',
      recommendation: 'Fix or remove the broken link to improve user experience.',
      impact_score: 9,
      expected_improvement: 'Better user experience and crawl efficiency',
      time_to_fix_hours: 0.5,
      priority: 1,
      affected_elements: ['/old-blog-post'],
    },
    {
      id: '4',
      type: 'social-meta',
      category: 'minor',
      severity: 'info',
      title: 'Missing Twitter Cards',
      description: 'Twitter Card meta tags are not implemented.',
      recommendation: 'Add Twitter Card tags to improve social media sharing appearance.',
      impact_score: 4,
      expected_improvement: 'Better social media sharing experience',
      time_to_fix_hours: 1,
      priority: 4,
      affected_elements: ['<head>'],
    },
    {
      id: '5',
      type: 'performance',
      category: 'moderate',
      severity: 'warning',
      title: 'Page Load Time',
      description: `Page load time is ${mockMetrics.page_load_time_ms}ms. Aim for under 2000ms for optimal performance.`,
      recommendation: 'Optimize images, minify CSS/JS, and enable caching to improve load times.',
      impact_score: 7,
      expected_improvement: 'Faster page loads and better user experience',
      time_to_fix_hours: 3,
      priority: 2,
      affected_elements: ['Overall page performance'],
    },
  ];
  
  const criticalCount = mockIssues.filter(i => i.severity === 'critical').length;
  const warningCount = mockIssues.filter(i => i.severity === 'warning').length;
  const infoCount = mockIssues.filter(i => i.severity === 'info').length;
  
  return {
    scan_id: scanId,
    url,
    status: 'completed',
    score: score,
    grade: score >= 95 ? 'A+' : score >= 85 ? 'A' : score >= 70 ? 'B' : score >= 55 ? 'C' : score >= 40 ? 'D' : 'F',
    created_at: new Date(Date.now() - 10000).toISOString(),
    completed_at: new Date().toISOString(),
    processing_time_ms: Math.floor(Math.random() * 5000) + 3000,
    metrics: mockMetrics,
    issues: mockIssues,
    summary: {
      critical_issues: criticalCount,
      warnings: warningCount,
      passed_checks: 23,
      total_checks: 28,
    },
  };
}

// Initialize mock scan with pending status
export function createMockScan(url: string): { scanId: string; startTime: number } {
  const scanId = generateMockScanId();
  const startTime = Date.now();
  
  mockScans.set(scanId, {
    scanId,
    url,
    status: 'pending',
    createdAt: new Date().toISOString(),
    startTime,
  });
  
  // Simulate scan progression
  setTimeout(() => {
    const scan = mockScans.get(scanId);
    if (scan && scan.status === 'pending') {
      scan.status = 'processing';
      scan.progress = 50;
      mockScans.set(scanId, scan);
    }
  }, 3000);
  
  // Complete scan after 8 seconds total
  setTimeout(() => {
    const scan = mockScans.get(scanId);
    if (scan) {
      const results = generateMockResults(url, scanId);
      results.status = 'completed';
      mockScans.set(scanId, results);
    }
  }, 8000);
  
  return { scanId, startTime };
}

// Get mock scan status
export function getMockScan(scanId: string): any {
  const scan = mockScans.get(scanId);
  
  if (!scan) {
    throw new Error('Scan not found');
  }
  
  // If still pending/processing, return partial status
  if (scan.status === 'pending' || scan.status === 'processing') {
    return {
      scan_id: scanId,
      url: scan.url,
      status: scan.status,
      created_at: scan.createdAt,
      grade: 'F',
      score: 0,
    };
  }
  
  // Return completed results
  return scan;
}
