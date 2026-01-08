/**
 * Transform API response to ComprehensiveSEOAudit format
 * Maps backend data structure to frontend display format
 */

import type { ComprehensiveSEOAudit, ActionItem } from '@/lib/types/seo-audit';

/**
 * Transform backend API response to ComprehensiveSEOAudit format
 */
export function transformToComprehensiveAudit(
  apiResponse: any,
  scanId: string,
  url: string
): ComprehensiveSEOAudit {
  // Handle wrapped response
  const data = apiResponse.data || apiResponse;
  const results = data.results || data;
  const issues = data.issues || [];
  
  // Extract domain from URL
  const domain = results.domain || extractDomain(url);
  
  // Get grade from score
  const score = data.score || results.overallScore || 50;
  const grade = data.grade || getGrade(score);
  
  // Use real category scores from API
  const categoryScores = results.categoryScores || {
    technical: 50,
    onPage: 50,
    content: 50,
    userExperience: 50,
    performance: 50,
    social: 50,
    security: 50,
  };
  
  // Use real Core Web Vitals from API
  const coreWebVitals = results.coreWebVitals || {
    lcp: { value: 2.5, rating: 'good', target: 2.5 },
    fid: { value: 100, rating: 'good', target: 100 },
    cls: { value: 0.1, rating: 'good', target: 0.1 },
    inp: { value: 200, rating: 'good', target: 200 },
    ttfb: { value: 800, rating: 'good', target: 800 },
    fcp: { value: 1.8, rating: 'good', target: 1.8 },
  };
  
  // Use real Performance from API
  const performance = results.performance || {
    pageLoadTime: 3000,
    domContentLoaded: 1500,
    fullyLoaded: 4000,
    speedIndex: 3000,
    timeToInteractive: 3500,
    totalBlockingTime: 300,
    serverResponseTime: 200,
    resourceCount: 50,
    totalPageSize: 2000000,
    htmlSize: 50000,
    cssSize: 100000,
    jsSize: 500000,
    imageSize: 1000000,
    fontSize: 50000,
    thirdPartySize: 300000,
    cacheHitRatio: 0.8,
    compressionRatio: 0.7,
  };
  
  // Use real Technical SEO from API
  const technical = results.technical || getDefaultTechnical();
  
  // Use real On-Page SEO from API
  const onPage = results.onPage || getDefaultOnPage(url);
  
  // Use real Content Intelligence from API
  const contentIntelligence = results.contentIntelligence || getDefaultContentIntelligence();
  
  // Use real User Experience from API
  const userExperience = results.userExperience || getDefaultUserExperience();
  
  // Use real Social SEO from API
  const social = results.social || getDefaultSocial();
  
  // Default backlinks (not extracted by current worker)
  const backlinks = getDefaultBacklinks();
  
  // Default competitors (not extracted by current worker)
  const competitors = getDefaultCompetitors();
  
  // Transform issues to action items
  const actionItems = transformIssuesToActionItems(issues, url);
  
  // Use real recommendations from API or build from issues
  const recommendations = buildRecommendations(results.recommendations, actionItems);
  
  // Count issues by severity
  const issuesCount = {
    critical: issues.filter((i: any) => i.category === 'critical' || i.severity === 'error').length,
    high: issues.filter((i: any) => i.category === 'warning' || i.severity === 'warning').length,
    medium: issues.filter((i: any) => i.category === 'improvement').length,
    low: issues.filter((i: any) => i.category === 'info' || i.severity === 'info').length,
    total: issues.length,
  };
  
  return {
    scanId,
    url,
    domain,
    scanDate: results.scanDate || data.createdAt || new Date().toISOString(),
    scanDuration: results.scanDuration || performance.pageLoadTime || 50,
    pagesScanned: results.pagesScanned || 1,
    overallScore: score,
    grade,
    categoryScores,
    coreWebVitals,
    performance,
    technical,
    onPage,
    contentIntelligence,
    userExperience,
    social,
    backlinks,
    competitors,
    recommendations,
    issuesCount,
    previousScans: [],
    exportFormats: ['pdf', 'csv', 'json'],
  };
}

/**
 * Transform backend issues to ActionItem format
 */
function transformIssuesToActionItems(issues: any[], url: string): ActionItem[] {
  return issues.map((issue, index) => ({
    id: issue.id || `issue-${index}`,
    category: mapIssueCategory(issue.category, issue.severity),
    type: issue.type || 'general',
    title: issue.title || 'Unknown Issue',
    description: issue.description || issue.title || '',
    impact: issue.impact_score ? Math.round(issue.impact_score / 10) : 5,
    effort: mapEffort(issue.time_to_fix_hours),
    priority: issue.priority || index + 1,
    recommendation: issue.recommendation || '',
    howToFix: issue.recommendation ? [issue.recommendation] : [],
    estimatedTime: issue.time_to_fix_hours ? `${issue.time_to_fix_hours} hours` : '1-2 hours',
    potentialGain: issue.expected_improvement || 'Improved SEO score',
    affectedPages: [url],
    resources: [],
  }));
}

function mapIssueCategory(category: string, severity: string): ActionItem['category'] {
  if (category === 'critical' || severity === 'critical' || severity === 'error') return 'critical';
  if (category === 'high' || category === 'important') return 'high';
  if (category === 'warning' || category === 'moderate') return 'medium';
  if (category === 'opportunity' || category === 'suggestion') return 'opportunity';
  return 'low';
}

function mapEffort(hours?: number): 'low' | 'medium' | 'high' {
  if (!hours || hours <= 1) return 'low';
  if (hours <= 4) return 'medium';
  return 'high';
}

function extractDomain(url: string): string {
  try {
    const parsed = new URL(url.startsWith('http') ? url : `https://${url}`);
    return parsed.hostname.replace('www.', '');
  } catch {
    return url.replace(/^https?:\/\//, '').replace(/\/.*$/, '');
  }
}

function getGrade(score: number): ComprehensiveSEOAudit['grade'] {
  if (score >= 97) return 'A+';
  if (score >= 93) return 'A';
  if (score >= 90) return 'A-';
  if (score >= 87) return 'B+';
  if (score >= 83) return 'B';
  if (score >= 80) return 'B-';
  if (score >= 77) return 'C+';
  if (score >= 73) return 'C';
  if (score >= 70) return 'C-';
  if (score >= 67) return 'D+';
  if (score >= 63) return 'D';
  if (score >= 60) return 'D-';
  return 'F';
}

/**
 * Build recommendations from API data or issues
 */
function buildRecommendations(apiRecommendations: any, actionItems: ActionItem[]) {
  if (apiRecommendations) {
    // Transform API recommendations format
    return {
      quickWins: (apiRecommendations.quickWins || []).map((r: any, i: number) => ({
        id: `quick-${i}`,
        category: 'medium' as const,
        type: 'improvement',
        title: r.issue || r.title || '',
        description: r.recommendation || '',
        impact: r.impact === 'high' ? 8 : r.impact === 'medium' ? 5 : 3,
        effort: r.effort || 'low',
        priority: i + 1,
        recommendation: r.recommendation || '',
        howToFix: [r.recommendation || ''],
        estimatedTime: '30 min - 1 hour',
        potentialGain: 'Quick SEO improvement',
        affectedPages: [],
        resources: [],
      })),
      priorityFixes: (apiRecommendations.priorityFixes || []).map((r: any, i: number) => ({
        id: `priority-${i}`,
        category: 'critical' as const,
        type: 'fix',
        title: r.issue || r.title || '',
        description: r.recommendation || '',
        impact: r.impact === 'high' ? 9 : 7,
        effort: r.effort || 'low',
        priority: i + 1,
        recommendation: r.recommendation || '',
        howToFix: [r.recommendation || ''],
        estimatedTime: '1-2 hours',
        potentialGain: 'Significant SEO improvement',
        affectedPages: [],
        resources: [],
      })),
      longTermImprovements: (apiRecommendations.longTerm || []).map((r: any, i: number) => ({
        id: `longterm-${i}`,
        category: 'low' as const,
        type: 'suggestion',
        title: r.issue || r.title || '',
        description: r.recommendation || '',
        impact: r.impact === 'high' ? 8 : 5,
        effort: r.effort || 'high',
        priority: i + 1,
        recommendation: r.recommendation || '',
        howToFix: [r.recommendation || ''],
        estimatedTime: '4+ hours',
        potentialGain: 'Long-term SEO gains',
        affectedPages: [],
        resources: [],
      })),
      opportunities: actionItems.filter(i => i.category === 'opportunity'),
      totalImpactScore: apiRecommendations.totalIssues ? apiRecommendations.totalIssues * 10 : actionItems.reduce((sum, i) => sum + i.impact, 0),
      estimatedTrafficGain: `${Math.round((apiRecommendations.totalIssues || actionItems.length) * 2)}%`,
      estimatedTimeToFix: `${Math.round((apiRecommendations.totalIssues || actionItems.length) * 0.5)} hours`,
    };
  }
  
  // Build from action items if no API recommendations
  return {
    quickWins: actionItems.filter(i => i.effort === 'low' && i.category !== 'critical'),
    priorityFixes: actionItems.filter(i => i.category === 'critical' || i.category === 'high'),
    longTermImprovements: actionItems.filter(i => i.effort === 'high'),
    opportunities: actionItems.filter(i => i.category === 'opportunity'),
    totalImpactScore: actionItems.reduce((sum, i) => sum + i.impact, 0),
    estimatedTrafficGain: `${Math.round(actionItems.length * 2)}%`,
    estimatedTimeToFix: `${Math.round(actionItems.length * 0.5)} hours`,
  };
}

// Default helper functions for missing data
function getDefaultTechnical() {
  return {
    crawlability: {
      score: 70,
      robotsTxt: { exists: true, valid: true, issues: [] },
      xmlSitemap: { exists: false, valid: false, urlCount: 0, lastModified: '' },
      indexability: { indexable: true, blockers: [] },
      canonicalization: { hasCanonical: false, selfReferencing: false, conflicts: [] },
    },
    rendering: {
      jsRendering: 'full',
      criticalRenderingPath: 500,
      renderBlockingResources: 3,
      dynamicContent: false,
      hydrationTime: 200,
    },
    mobile: {
      mobileFirst: true,
      responsiveDesign: false,
      viewportConfigured: false,
      touchTargets: { adequate: true, issues: 0 },
      fontSizes: { readable: true, issues: 0 },
      contentWidth: { fits: true, overflow: false },
    },
    security: {
      https: true,
      hsts: false,
      mixedContent: { count: 0, urls: [] },
      securityHeaders: {
        contentSecurityPolicy: false,
        xFrameOptions: false,
        xContentTypeOptions: false,
        referrerPolicy: false,
        permissionsPolicy: false,
      },
      sslCertificate: {
        valid: true,
        issuer: 'Unknown',
        expiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
        daysUntilExpiry: 90,
      },
    },
    internationalization: {
      hreflangTags: { exists: false, valid: true, languages: ['en'] },
      languageDeclaration: false,
      contentLanguage: 'en',
      regionTargeting: [],
    },
    structuredData: {
      present: false,
      types: [],
      valid: true,
      errors: 0,
      warnings: 0,
      richResultsEligible: [],
    },
  };
}

function getDefaultOnPage(url: string) {
  return {
    title: {
      exists: false,
      content: '',
      length: 0,
      optimal: false,
      keywordPresent: false,
      brandingPosition: 'none',
      emotionalTriggers: [],
      powerWords: [],
      uniqueOnSite: true,
    },
    metaDescription: {
      exists: false,
      content: '',
      length: 0,
      optimal: false,
      keywordPresent: false,
      callToAction: false,
      uniqueOnSite: true,
    },
    headings: {
      h1: { count: 0, content: [], optimal: false },
      h2: { count: 0, content: [] },
      h3: { count: 0, content: [] },
      h4: { count: 0, content: [] },
      h5: { count: 0, content: [] },
      h6: { count: 0, content: [] },
      hierarchy: { valid: true, issues: [] },
      keywordDistribution: 0,
    },
    content: {
      wordCount: 0,
      paragraphCount: 0,
      sentenceCount: 0,
      avgWordsPerSentence: 0,
      avgSentencesPerParagraph: 0,
      readabilityScore: 50,
      readabilityGrade: '10th Grade',
      fleschKincaid: 50,
      gunningFog: 10,
      uniqueWords: 0,
      contentDepth: 'thin',
    },
    keywords: {
      primary: { keyword: '', density: 0, count: 0, inTitle: false, inH1: false, inMeta: false },
      secondary: [],
      lsiKeywords: [],
      keywordStuffing: false,
      topicRelevance: 0,
    },
    images: {
      total: 0,
      withAlt: 0,
      withoutAlt: 0,
      optimized: 0,
      lazyLoaded: 0,
      webpFormat: 0,
      avgSize: 0,
      largestImage: { url: '', size: 0 },
      missingDimensions: 0,
    },
    links: {
      internal: { count: 0, unique: 0, broken: 0 },
      external: { count: 0, unique: 0, nofollow: 0, sponsored: 0, ugc: 0 },
      anchors: { descriptive: 0, generic: 0, naked: 0 },
      depth: 1,
      orphanPages: 0,
    },
    urls: {
      current: url,
      length: url.length,
      optimal: url.length < 100,
      hasKeyword: false,
      parameters: 0,
      depth: 1,
      readable: true,
      httpsRedirect: true,
      trailingSlash: false,
      lowercase: true,
    },
  };
}

function getDefaultContentIntelligence() {
  return {
    eeat: {
      expertise: { score: 50, signals: [] },
      experience: { score: 50, signals: [] },
      authoritativeness: { score: 50, signals: [] },
      trustworthiness: { score: 50, signals: [] },
      overallScore: 50,
    },
    topics: {
      primary: 'Unknown',
      secondary: [],
      entities: [],
      categories: [],
    },
    sentiment: {
      overall: 'neutral',
      score: 0.5,
      breakdown: { positive: 33, neutral: 34, negative: 33 },
    },
    plagiarism: {
      uniquenessScore: 100,
      duplicateContent: false,
      matchedSources: [],
    },
    aiReadiness: {
      score: 50,
      voiceSearchOptimized: false,
      featuredSnippetPotential: 30,
      conversationalReady: false,
      structuredContent: false,
      questionAnswering: { answered: false, questions: [] },
    },
    contentGaps: {
      missingTopics: [],
      suggestedAdditions: [],
      competitorAdvantages: [],
      relatedQuestions: [],
    },
  };
}

function getDefaultUserExperience() {
  return {
    accessibility: {
      score: 70,
      wcagLevel: 'A',
      issues: [],
      ariaLabels: { present: 0, missing: 0 },
      colorContrast: { passes: 80, fails: 5 },
      keyboardNav: true,
      screenReaderFriendly: true,
    },
    navigation: {
      menuPresent: false,
      breadcrumbs: false,
      searchFunction: false,
      footerLinks: false,
      siteDepth: 1,
      clicksToContent: 1,
    },
    engagement: {
      estimatedReadTime: 1,
      scrollDepthPotential: 50,
      interactiveElements: 0,
      ctaCount: 0,
      ctaVisibility: 50,
      formPresent: false,
      bounceRate: 50,
      avgTimeOnPage: 60,
    },
    pageExperience: {
      coreWebVitalsPass: true,
      mobileUsability: false,
      httpsSecure: true,
      noIntrusiveInterstitials: true,
      safeBrowsing: true,
    },
  };
}

function getDefaultSocial() {
  return {
    openGraph: {
      present: false,
      title: '',
      description: '',
      image: { url: '', valid: false, dimensions: null },
      type: 'website',
      url: '',
      siteName: '',
    },
    twitterCards: {
      present: false,
      cardType: 'summary',
      title: '',
      description: '',
      image: '',
      creator: '',
    },
    socialProfiles: {
      facebook: false,
      twitter: false,
      linkedin: false,
      instagram: false,
      youtube: false,
      pinterest: false,
      tiktok: false,
    },
    shareability: {
      score: 30,
      shareButtons: false,
      socialProof: false,
      viralPotential: 30,
    },
  };
}

function getDefaultBacklinks(): ComprehensiveSEOAudit['backlinks'] {
  return {
    totalBacklinks: 0,
    uniqueDomains: 0,
    domainAuthority: 1,
    pageAuthority: 1,
    trustFlow: 1,
    citationFlow: 1,
    spamScore: 0,
    topReferringDomains: [],
    anchorTextDistribution: [],
    linkTypes: { dofollow: 0, nofollow: 0 },
    newLinks30Days: 0,
    lostLinks30Days: 0,
    competitorComparison: [],
  };
}

function getDefaultCompetitors() {
  return {
    competitors: [],
    gaps: {
      keywords: [],
      content: [],
      backlinks: [],
    },
    advantages: {
      uniqueKeywords: [],
      contentStrengths: [],
      technicalAdvantages: [],
    },
    serpFeatures: {
      featuredSnippets: { eligible: false, currentOwner: '' },
      peopleAlsoAsk: [],
      localPack: false,
      knowledgePanel: false,
      imageResults: false,
      videoResults: false,
    },
  };
}
