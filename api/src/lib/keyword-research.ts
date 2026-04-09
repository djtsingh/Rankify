/**
 * Keyword Research & Content Intelligence Module
 * Integrates with DataForSEO API for keyword data
 * Provides keyword suggestions, content briefs, scoring
 */

interface KeywordData {
  keyword: string;
  searchVolume: number;
  difficulty: number;
  cpc: number;
  trend: string;
}

interface ContentBrief {
  keyword: string;
  intent: string;
  targetLength: number;
  topicClusters: string[];
  contentGaps: string[];
  recommendedStructure: string[];
}

interface OnPageScore {
  keyword: string;
  density: number;
  titleMatch: boolean;
  h1Match: boolean;
  metaMatch: boolean;
  imageAltMatch: boolean;
  internalLinks: number;
  externalLinks: number;
  score: number;
}

/**
 * Fetch keyword data from DataForSEO
 * API docs: https://docs.dataforseo.com/api/v3/
 */
async function fetchKeywordData(keyword: string): Promise<KeywordData | null> {
  try {
    const apiUrl = "https://api.dataforseo.com/v3/keywords_data/google_ads/search_volume";
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      auth: {
        username: process.env.DATAFORSEO_LOGIN || '',
        password: process.env.DATAFORSEO_PASSWORD || '',
      },
      json: {
        keywords: [keyword],
        language_code: 'en',
        location_code: 2840, // US
      },
    } as any);

    if (!response.ok) {
      return null;
    }

    const data = await response.json() as any;
    const result = data.tasks?.[0]?.result?.[0];

    if (!result) {
      return null;
    }

    return {
      keyword,
      searchVolume: result.search_volume || 0,
      difficulty: result.keyword_difficulty || 0,
      cpc: result.avg_cost_per_click || 0,
      trend: result.search_trend || 'stable',
    };
  } catch (error) {
    console.error('Failed to fetch keyword data:', error);
    return null;
  }
}

/**
 * Generate content brief for keyword
 */
export async function generateContentBrief(keyword: string, domain: string): Promise<ContentBrief> {
  const keywordData = await fetchKeywordData(keyword);

  return {
    keyword,
    intent: classifySearchIntent(keyword),
    targetLength: Math.max(1500, (keywordData?.searchVolume || 0) * 5), // Heuristic
    topicClusters: generateTopicClusters(keyword),
    contentGaps: identifyContentGaps(keyword),
    recommendedStructure: [
      "Introduction with keyword",
      "Problem statement",
      "3-5 main solution sections",
      "Comparison table",
      "FAQ section",
      "Conclusion with CTA",
    ],
  };
}

/**
 * Classify search intent (informational, commercial, navigational, transactional)
 */
function classifySearchIntent(keyword: string): string {
  const intentKeywords = {
    informational: ['how', 'what', 'why', 'learn', 'guide', 'tutorial', 'best', 'top'],
    commercial: ['best', 'cheap', 'discount', 'deals', 'price', 'review', 'comparison'],
    navigational: ['login', 'app', 'site', 'platform', 'dashboard'],
    transactional: ['buy', 'order', 'subscribe', 'sign up', 'get', 'download'],
  };

  const lowerKeyword = keyword.toLowerCase();
  
  for (const [intent, words] of Object.entries(intentKeywords)) {
    if (words.some(word => lowerKeyword.includes(word))) {
      return intent;
    }
  }

  return 'informational';
}

/**
 * Generate topic clusters for keyword
 */
function generateTopicClusters(keyword: string): string[] {
  // Simplified - in production use NLP or DataForSEO topic clustering
  return [
    `${keyword} overview`,
    `${keyword} benefits`,
    `${keyword} comparison`,
    `${keyword} tools`,
    `${keyword} best practices`,
  ];
}

/**
 * Identify content gaps in existing content
 */
function identifyContentGaps(keyword: string): string[] {
  return [
    `Missing statistics on ${keyword}`,
    `No comparison table for alternatives`,
    `Insufficient FAQ coverage`,
    `Limited case studies`,
  ];
}

/**
 * Score on-page content for keyword
 */
export function scoreOnPageContent(
  keyword: string,
  content: {
    title: string;
    h1: string;
    meta: string;
    body: string;
    images: Array<{ alt: string }>;
    links: Array<{ href: string }>;
  }
): OnPageScore {
  const keywordLower = keyword.toLowerCase();
  const bodyLower = content.body.toLowerCase();
  
  // Calculate keyword density
  const keywordCount = (bodyLower.match(new RegExp(keywordLower, 'g')) || []).length;
  const wordCount = bodyLower.split(/\s+/).length;
  const density = (keywordCount / wordCount) * 100;

  // Check keyword placement
  const titleMatch = content.title.toLowerCase().includes(keywordLower);
  const h1Match = content.h1.toLowerCase().includes(keywordLower);
  const metaMatch = content.meta.toLowerCase().includes(keywordLower);
  
  // Check image alt text
  const imageAltMatch = content.images.some(img => 
    img.alt.toLowerCase().includes(keywordLower)
  );

  // Count links
  const internalLinks = content.links.filter(l => !l.href.startsWith('http')).length;
  const externalLinks = content.links.filter(l => l.href.startsWith('http')).length;

  // Calculate score (0-100)
  let score = 0;
  score += titleMatch ? 20 : 0;
  score += h1Match ? 15 : 0;
  score += metaMatch ? 15 : 0;
  score += imageAltMatch ? 10 : 0;
  score += Math.min(40, (density * 10)); // 0-40 based on density

  return {
    keyword,
    density: parseFloat(density.toFixed(2)),
    titleMatch,
    h1Match,
    metaMatch,
    imageAltMatch,
    internalLinks,
    externalLinks,
    score: Math.min(100, score),
  };
}

/**
 * Suggest keywords based on domain + top pages
 */
export async function suggestKeywords(domain: string, topKeywords: string[]): Promise<KeywordData[]> {
  const suggestions: KeywordData[] = [];

  for (const keyword of topKeywords) {
    const data = await fetchKeywordData(keyword);
    if (data) {
      suggestions.push(data);
    }
  }

  return suggestions.sort((a, b) => b.searchVolume - a.searchVolume);
}
