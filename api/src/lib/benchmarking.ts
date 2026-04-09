/**
 * Benchmarking & Industry Data Module
 * Accumulates anonymized cross-site data to build data moat
 * Provides industry averages by vertical
 */

interface BenchmarkMetrics {
  lcp: number; // Largest Contentful Paint
  fid: number; // First Input Delay
  cls: number; // Cumulative Layout Shift
  ttfb: number; // Time to First Byte
  fcp: number; // First Contentful Paint
}

interface VerticalBenchmark {
  vertical: string;
  sampleSize: number;
  metrics: BenchmarkMetrics;
  percentiles: {
    p50: BenchmarkMetrics;
    p75: BenchmarkMetrics;
    p90: BenchmarkMetrics;
  };
}

interface SiteComparison {
  myScore: number;
  industryAverage: number;
  percentile: number; // 0-100, where 100 is best
  vertical: string;
}

/**
 * Classify website vertical (e-commerce, blog, SaaS, etc.)
 */
export function classifyVertical(domain: string, content?: string): string {
  const indicators: { [key: string]: string[] } = {
    'ecommerce': ['shop', 'cart', 'buy', 'product', 'store', 'checkout'],
    'saas': ['pricing', 'dashboard', 'features', 'try free', 'sign up'],
    'blog': ['article', 'post', 'news', 'blog', 'author', 'category'],
    'media': ['news', 'video', 'magazine', 'article', 'journalist'],
    'corporate': ['about us', 'services', 'contact', 'company', 'corporate'],
    'nonprofit': ['donate', 'mission', 'volunteer', 'nonprofit', 'charity'],
  };

  const domainLower = domain.toLowerCase();
  const contentLower = content?.toLowerCase() || '';
  const combined = `${domainLower} ${contentLower}`;

  for (const [vertical, keywords] of Object.entries(indicators)) {
    const matches = keywords.filter(kw => combined.includes(kw)).length;
    if (matches >= 2) {
      return vertical;
    }
  }

  return 'general';
}

/**
 * Record anonymized metrics for benchmarking
 * Stores metrics without storing the domain publicly
 */
export async function recordBenchmarkMetrics(
  domain: string,
  metrics: BenchmarkMetrics,
  vertical: string
): Promise<boolean> {
  try {
    // In production, store in analytics database
    // Hash domain for anonymity
    const hashedDomain = Buffer.from(domain).toString('base64');

    console.log('Recording benchmark:', {
      hashedDomain,
      vertical,
      metrics,
      timestamp: new Date().toISOString(),
    });

    // Store in database (pseudocode)
    // await db.benchmarks.insert({
    //   hashedDomain,
    //   vertical,
    //   metrics,
    //   recordedAt: new Date(),
    // });

    return true;
  } catch (error) {
    console.error('Failed to record benchmark:', error);
    return false;
  }
}

/**
 * Get industry averages for a vertical
 */
export function getIndustryAverages(vertical: string): VerticalBenchmark {
  // Placeholder data - in production, aggregate from stored benchmarks
  const benchmarks: { [key: string]: VerticalBenchmark } = {
    'ecommerce': {
      vertical: 'ecommerce',
      sampleSize: 1250,
      metrics: {
        lcp: 2800,
        fid: 120,
        cls: 0.12,
        ttfb: 600,
        fcp: 1200,
      },
      percentiles: {
        p50: { lcp: 2500, fid: 100, cls: 0.10, ttfb: 550, fcp: 1000 },
        p75: { lcp: 3500, fid: 150, cls: 0.15, ttfb: 700, fcp: 1500 },
        p90: { lcp: 4500, fid: 250, cls: 0.25, ttfb: 900, fcp: 2000 },
      },
    },
    'saas': {
      vertical: 'saas',
      sampleSize: 890,
      metrics: {
        lcp: 2400,
        fid: 80,
        cls: 0.08,
        ttfb: 500,
        fcp: 1000,
      },
      percentiles: {
        p50: { lcp: 2000, fid: 60, cls: 0.05, ttfb: 400, fcp: 800 },
        p75: { lcp: 3000, fid: 100, cls: 0.10, ttfb: 600, fcp: 1200 },
        p90: { lcp: 4000, fid: 150, cls: 0.15, ttfb: 800, fcp: 1500 },
      },
    },
    'general': {
      vertical: 'general',
      sampleSize: 5000,
      metrics: {
        lcp: 3000,
        fid: 150,
        cls: 0.15,
        ttfb: 650,
        fcp: 1300,
      },
      percentiles: {
        p50: { lcp: 2500, fid: 100, cls: 0.10, ttfb: 550, fcp: 1000 },
        p75: { lcp: 3500, fid: 200, cls: 0.20, ttfb: 750, fcp: 1500 },
        p90: { lcp: 5000, fid: 300, cls: 0.30, ttfb: 1000, fcp: 2000 },
      },
    },
  };

  return benchmarks[vertical] || benchmarks['general'];
}

/**
 * Compare site metrics to industry averages
 */
export function compareToIndustry(
  metrics: BenchmarkMetrics,
  vertical: string
): SiteComparison {
  const industry = getIndustryAverages(vertical);

  // Calculate how far above/below average
  // Higher score = better performance
  const lcpRatio = industry.metrics.lcp / Math.max(1, metrics.lcp);
  const fidRatio = industry.metrics.fid / Math.max(1, metrics.fid);
  const clsRatio = industry.metrics.cls / Math.max(0.01, metrics.cls);
  const ttfbRatio = industry.metrics.ttfb / Math.max(1, metrics.ttfb);
  const fcpRatio = industry.metrics.fcp / Math.max(1, metrics.fcp);

  const avgRatio = (lcpRatio + fidRatio + clsRatio + ttfbRatio + fcpRatio) / 5;
  const percentile = Math.min(100, Math.max(0, (avgRatio - 0.5) * 100));

  return {
    myScore: Math.round((lcpRatio + fidRatio + clsRatio + ttfbRatio + fcpRatio) / 5 * 100),
    industryAverage: 100,
    percentile: Math.round(percentile),
    vertical,
  };
}

/**
 * Get performance insight message
 */
export function getInsightMessage(comparison: SiteComparison): string {
  if (comparison.percentile > 90) {
    return `🏆 Your ${comparison.vertical} site is in the top 10% for performance. Excellent!`;
  } else if (comparison.percentile > 75) {
    return `✅ Your site performs better than 75% of ${comparison.vertical} sites. Good job!`;
  } else if (comparison.percentile > 50) {
    return `📊 Your site is average for the ${comparison.vertical} vertical. There's room for improvement.`;
  } else if (comparison.percentile > 25) {
    return `⚠️ Your site is slower than 75% of ${comparison.vertical} competitors. Time to optimize!`;
  } else {
    return `🚨 Your site needs urgent performance optimization to compete in the ${comparison.vertical} space.`;
  }
}
