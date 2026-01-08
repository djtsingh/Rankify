/**
 * Comprehensive SEO Audit Types
 * Industry-leading data structures for complete website analysis
 */

// ============================================================================
// Core Web Vitals & Performance
// ============================================================================

export interface CoreWebVitals {
  lcp: { value: number; rating: 'good' | 'needs-improvement' | 'poor'; target: number };
  fid: { value: number; rating: 'good' | 'needs-improvement' | 'poor'; target: number };
  cls: { value: number; rating: 'good' | 'needs-improvement' | 'poor'; target: number };
  inp: { value: number; rating: 'good' | 'needs-improvement' | 'poor'; target: number };
  ttfb: { value: number; rating: 'good' | 'needs-improvement' | 'poor'; target: number };
  fcp: { value: number; rating: 'good' | 'needs-improvement' | 'poor'; target: number };
}

export interface PerformanceMetrics {
  pageLoadTime: number;
  domContentLoaded: number;
  fullyLoaded: number;
  speedIndex: number;
  timeToInteractive: number;
  totalBlockingTime: number;
  serverResponseTime: number;
  resourceCount: number;
  totalPageSize: number;
  htmlSize: number;
  cssSize: number;
  jsSize: number;
  imageSize: number;
  fontSize: number;
  thirdPartySize: number;
  cacheHitRatio: number;
  compressionRatio: number;
}

// ============================================================================
// Technical SEO
// ============================================================================

export interface TechnicalSEO {
  crawlability: {
    score: number;
    robotsTxt: { exists: boolean; valid: boolean; issues: string[] };
    xmlSitemap: { exists: boolean; valid: boolean; urlCount: number; lastModified: string };
    indexability: { indexable: boolean; blockers: string[] };
    canonicalization: { hasCanonical: boolean; selfReferencing: boolean; conflicts: string[] };
  };
  
  rendering: {
    jsRendering: 'full' | 'partial' | 'none';
    criticalRenderingPath: number;
    renderBlockingResources: number;
    dynamicContent: boolean;
    hydrationTime: number;
  };
  
  mobile: {
    mobileFirst: boolean;
    responsiveDesign: boolean;
    viewportConfigured: boolean;
    touchTargets: { adequate: boolean; issues: number };
    fontSizes: { readable: boolean; issues: number };
    contentWidth: { fits: boolean; overflow: boolean };
  };
  
  security: {
    https: boolean;
    hsts: boolean;
    mixedContent: { count: number; urls: string[] };
    securityHeaders: {
      contentSecurityPolicy: boolean;
      xFrameOptions: boolean;
      xContentTypeOptions: boolean;
      referrerPolicy: boolean;
      permissionsPolicy: boolean;
    };
    sslCertificate: {
      valid: boolean;
      issuer: string;
      expiresAt: string;
      daysUntilExpiry: number;
    };
  };
  
  internationalization: {
    hreflangTags: { exists: boolean; valid: boolean; languages: string[] };
    languageDeclaration: boolean;
    contentLanguage: string;
    regionTargeting: string[];
  };
  
  structuredData: {
    present: boolean;
    types: string[];
    valid: boolean;
    errors: number;
    warnings: number;
    richResultsEligible: string[];
  };
}

// ============================================================================
// On-Page SEO
// ============================================================================

export interface OnPageSEO {
  title: {
    exists: boolean;
    content: string;
    length: number;
    optimal: boolean;
    keywordPresent: boolean;
    brandingPosition: 'start' | 'end' | 'none';
    emotionalTriggers: string[];
    powerWords: string[];
    uniqueOnSite: boolean;
  };
  
  metaDescription: {
    exists: boolean;
    content: string;
    length: number;
    optimal: boolean;
    keywordPresent: boolean;
    callToAction: boolean;
    uniqueOnSite: boolean;
  };
  
  headings: {
    h1: { count: number; content: string[]; optimal: boolean };
    h2: { count: number; content: string[] };
    h3: { count: number; content: string[] };
    h4: { count: number; content: string[] };
    h5: { count: number; content: string[] };
    h6: { count: number; content: string[] };
    hierarchy: { valid: boolean; issues: string[] };
    keywordDistribution: number;
  };
  
  content: {
    wordCount: number;
    paragraphCount: number;
    sentenceCount: number;
    avgWordsPerSentence: number;
    avgSentencesPerParagraph: number;
    readabilityScore: number;
    readabilityGrade: string;
    fleschKincaid: number;
    gunningFog: number;
    uniqueWords: number;
    contentDepth: 'thin' | 'moderate' | 'comprehensive' | 'expert';
  };
  
  keywords: {
    primary: { keyword: string; density: number; count: number; inTitle: boolean; inH1: boolean; inMeta: boolean };
    secondary: Array<{ keyword: string; density: number; count: number }>;
    lsiKeywords: string[];
    keywordStuffing: boolean;
    topicRelevance: number;
  };
  
  images: {
    total: number;
    withAlt: number;
    withoutAlt: number;
    optimized: number;
    lazyLoaded: number;
    webpFormat: number;
    avgSize: number;
    largestImage: { url: string; size: number };
    missingDimensions: number;
  };
  
  links: {
    internal: { count: number; unique: number; broken: number };
    external: { count: number; unique: number; nofollow: number; sponsored: number; ugc: number };
    anchors: { descriptive: number; generic: number; naked: number };
    depth: number;
    orphanPages: number;
  };
  
  urls: {
    current: string;
    length: number;
    optimal: boolean;
    hasKeyword: boolean;
    parameters: number;
    depth: number;
    readable: boolean;
    httpsRedirect: boolean;
    trailingSlash: boolean;
    lowercase: boolean;
  };
}

// ============================================================================
// Content Intelligence (AI-Powered)
// ============================================================================

export interface ContentIntelligence {
  sentiment: {
    overall: 'positive' | 'neutral' | 'negative';
    score: number;
    breakdown: { positive: number; neutral: number; negative: number };
  };
  
  topics: {
    primary: string;
    secondary: string[];
    entities: Array<{ name: string; type: string; relevance: number }>;
    categories: Array<{ name: string; confidence: number }>;
  };
  
  eeat: {
    experience: { score: number; signals: string[] };
    expertise: { score: number; signals: string[] };
    authoritativeness: { score: number; signals: string[] };
    trustworthiness: { score: number; signals: string[] };
    overallScore: number;
  };
  
  aiReadiness: {
    score: number;
    voiceSearchOptimized: boolean;
    featuredSnippetPotential: number;
    questionAnswering: { questions: string[]; answered: boolean };
    conversationalReady: boolean;
    structuredContent: boolean;
  };
  
  contentGaps: {
    missingTopics: string[];
    competitorAdvantages: string[];
    suggestedAdditions: string[];
    relatedQuestions: string[];
  };
  
  plagiarism: {
    uniquenessScore: number;
    matchedSources: Array<{ url: string; matchPercentage: number }>;
    duplicateContent: boolean;
  };
}

// ============================================================================
// User Experience
// ============================================================================

export interface UserExperience {
  accessibility: {
    score: number;
    wcagLevel: 'A' | 'AA' | 'AAA' | 'none';
    issues: Array<{ type: string; count: number; severity: 'critical' | 'serious' | 'moderate' | 'minor' }>;
    colorContrast: { passes: number; fails: number };
    ariaLabels: { present: number; missing: number };
    keyboardNav: boolean;
    screenReaderFriendly: boolean;
  };
  
  navigation: {
    menuPresent: boolean;
    breadcrumbs: boolean;
    searchFunction: boolean;
    footerLinks: boolean;
    siteDepth: number;
    clicksToContent: number;
  };
  
  engagement: {
    estimatedReadTime: number;
    scrollDepthPotential: number;
    interactiveElements: number;
    ctaCount: number;
    ctaVisibility: number;
    formPresent: boolean;
    bounceRate: number;
    avgTimeOnPage: number;
  };
  
  pageExperience: {
    coreWebVitalsPass: boolean;
    mobileUsability: boolean;
    safeBrowsing: boolean;
    noIntrusiveInterstitials: boolean;
    httpsSecure: boolean;
  };
}

// ============================================================================
// Social & Off-Page
// ============================================================================

export interface SocialSEO {
  openGraph: {
    present: boolean;
    title: string;
    description: string;
    image: { url: string; dimensions: { width: number; height: number }; valid: boolean };
    type: string;
    url: string;
    siteName: string;
  };
  
  twitterCards: {
    present: boolean;
    cardType: 'summary' | 'summary_large_image' | 'player' | 'app' | 'none';
    title: string;
    description: string;
    image: string;
    creator: string;
  };
  
  socialProfiles: {
    facebook: boolean;
    twitter: boolean;
    linkedin: boolean;
    instagram: boolean;
    youtube: boolean;
    pinterest: boolean;
    tiktok: boolean;
  };
  
  shareability: {
    score: number;
    socialProof: boolean;
    shareButtons: boolean;
    viralPotential: number;
  };
}

export interface BacklinkProfile {
  totalBacklinks: number;
  uniqueDomains: number;
  domainAuthority: number;
  pageAuthority: number;
  trustFlow: number;
  citationFlow: number;
  spamScore: number;
  topReferringDomains: Array<{ domain: string; authority: number; links: number }>;
  anchorTextDistribution: Array<{ text: string; percentage: number }>;
  linkTypes: { dofollow: number; nofollow: number };
  newLinks30Days: number;
  lostLinks30Days: number;
  competitorComparison: Array<{ competitor: string; backlinks: number; domains: number }>;
}

// ============================================================================
// Competitor Analysis
// ============================================================================

export interface CompetitorAnalysis {
  competitors: Array<{
    url: string;
    domain: string;
    overallScore: number;
    domainAuthority: number;
    organicTraffic: number;
    keywords: number;
    backlinks: number;
  }>;
  
  gaps: {
    keywords: Array<{ keyword: string; competitorRank: number; difficulty: number; volume: number }>;
    content: Array<{ topic: string; competitors: string[] }>;
    backlinks: Array<{ domain: string; authority: number; competitors: string[] }>;
  };
  
  advantages: {
    uniqueKeywords: string[];
    contentStrengths: string[];
    technicalAdvantages: string[];
  };
  
  serpFeatures: {
    featuredSnippets: { eligible: boolean; currentOwner: string };
    peopleAlsoAsk: string[];
    localPack: boolean;
    knowledgePanel: boolean;
    imageResults: boolean;
    videoResults: boolean;
  };
}

// ============================================================================
// Action Items & Recommendations
// ============================================================================

export interface ActionItem {
  id: string;
  category: 'critical' | 'high' | 'medium' | 'low' | 'opportunity';
  type: string;
  title: string;
  description: string;
  impact: number;
  effort: 'low' | 'medium' | 'high';
  priority: number;
  recommendation: string;
  howToFix: string[];
  estimatedTime: string;
  potentialGain: string;
  affectedPages: string[];
  resources: Array<{ title: string; url: string }>;
}

export interface Recommendations {
  quickWins: ActionItem[];
  priorityFixes: ActionItem[];
  longTermImprovements: ActionItem[];
  opportunities: ActionItem[];
  totalImpactScore: number;
  estimatedTrafficGain: string;
  estimatedTimeToFix: string;
}

// ============================================================================
// Complete Audit Result
// ============================================================================

export interface ComprehensiveSEOAudit {
  // Meta
  scanId: string;
  url: string;
  domain: string;
  scanDate: string;
  scanDuration: number;
  pagesScanned: number;
  
  // Scores
  overallScore: number;
  grade: 'A+' | 'A' | 'A-' | 'B+' | 'B' | 'B-' | 'C+' | 'C' | 'C-' | 'D+' | 'D' | 'D-' | 'F';
  categoryScores: {
    technical: number;
    onPage: number;
    content: number;
    userExperience: number;
    performance: number;
    social: number;
    security: number;
  };
  
  // Detailed Analysis
  coreWebVitals: CoreWebVitals;
  performance: PerformanceMetrics;
  technical: TechnicalSEO;
  onPage: OnPageSEO;
  contentIntelligence: ContentIntelligence;
  userExperience: UserExperience;
  social: SocialSEO;
  backlinks: BacklinkProfile;
  competitors: CompetitorAnalysis;
  
  // Action Items
  recommendations: Recommendations;
  issuesCount: {
    critical: number;
    high: number;
    medium: number;
    low: number;
    total: number;
  };
  
  // Historical
  previousScans?: Array<{
    date: string;
    score: number;
    issuesFixed: number;
  }>;
  
  // Export
  exportFormats: ('pdf' | 'csv' | 'json' | 'html')[];
}

// ============================================================================
// Query Parameters
// ============================================================================

export interface AuditQueryParams {
  scan?: string;
  url?: string;
  tab?: string;
  filter?: string;
  sort?: string;
  view?: 'summary' | 'detailed' | 'technical' | 'comparison';
  highlight?: string;
  export?: string;
}

export type AuditTab = 
  | 'overview'
  | 'performance'
  | 'technical'
  | 'onpage'
  | 'content'
  | 'ux'
  | 'social'
  | 'backlinks'
  | 'competitors'
  | 'actions';
