/**
 * Comprehensive Mock Data Generator
 * Generates realistic, detailed SEO audit data for development
 */

import type { ComprehensiveSEOAudit, ActionItem } from '@/lib/types/seo-audit';

// Helper to generate random number in range
const rand = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
const randFloat = (min: number, max: number) => parseFloat((Math.random() * (max - min) + min).toFixed(2));

// Helper to pick random items from array
const pickRandom = <T>(arr: T[], count: number): T[] => {
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

// Generate realistic issues
const generateActionItems = (url: string): ActionItem[] => {
  const items: ActionItem[] = [
    {
      id: 'cwv-lcp',
      category: 'critical',
      type: 'performance',
      title: 'Largest Contentful Paint (LCP) Too Slow',
      description: 'LCP is 4.2s, significantly above the 2.5s threshold for a good user experience.',
      impact: 9,
      effort: 'medium',
      priority: 1,
      recommendation: 'Optimize your largest visible content element to load faster.',
      howToFix: [
        'Optimize and compress hero images using WebP format',
        'Implement proper image lazy loading with priority for LCP element',
        'Use a CDN for faster content delivery',
        'Preload critical resources with <link rel="preload">',
        'Reduce server response time (TTFB)'
      ],
      estimatedTime: '2-4 hours',
      potentialGain: '+15-25% improvement in Core Web Vitals score',
      affectedPages: [url],
      resources: [
        { title: 'Optimize LCP - web.dev', url: 'https://web.dev/lcp/' },
        { title: 'Image Optimization Guide', url: 'https://web.dev/fast/#optimize-your-images' }
      ]
    },
    {
      id: 'meta-desc',
      category: 'high',
      type: 'on-page',
      title: 'Meta Description Not Optimized',
      description: 'Your meta description is 89 characters. Optimal length is 150-160 characters for maximum SERP visibility.',
      impact: 7,
      effort: 'low',
      priority: 2,
      recommendation: 'Expand your meta description to include compelling copy with a clear CTA.',
      howToFix: [
        'Write a compelling 150-160 character description',
        'Include your primary keyword naturally',
        'Add a clear call-to-action',
        'Make it unique from other pages',
        'Test with SERP preview tools'
      ],
      estimatedTime: '15-30 minutes',
      potentialGain: '+5-15% improvement in CTR from search results',
      affectedPages: [url],
      resources: [
        { title: 'Meta Description Best Practices', url: 'https://moz.com/learn/seo/meta-description' }
      ]
    },
    {
      id: 'img-alt',
      category: 'high',
      type: 'accessibility',
      title: 'Images Missing Alt Text',
      description: '7 images are missing alt text, impacting accessibility and image SEO.',
      impact: 8,
      effort: 'low',
      priority: 3,
      recommendation: 'Add descriptive alt text to all images for accessibility and SEO.',
      howToFix: [
        'Add descriptive alt text to each image',
        'Include relevant keywords where appropriate',
        'Keep alt text concise (125 characters max)',
        'Describe the image\'s function, not just appearance',
        'Leave decorative images with empty alt=""'
      ],
      estimatedTime: '30-60 minutes',
      potentialGain: 'Improved accessibility score and image search rankings',
      affectedPages: [url],
      resources: [
        { title: 'Alt Text Best Practices', url: 'https://moz.com/learn/seo/alt-text' }
      ]
    },
    {
      id: 'structured-data',
      category: 'medium',
      type: 'technical',
      title: 'Missing Rich Snippet Opportunities',
      description: 'No FAQ, HowTo, or Review schema detected. You\'re missing rich result opportunities.',
      impact: 6,
      effort: 'medium',
      priority: 4,
      recommendation: 'Implement structured data to qualify for rich snippets in search results.',
      howToFix: [
        'Add Organization schema for brand recognition',
        'Implement FAQ schema for common questions',
        'Add BreadcrumbList for navigation context',
        'Use Article schema for blog content',
        'Validate with Google Rich Results Test'
      ],
      estimatedTime: '1-2 hours',
      potentialGain: '+25-35% increase in SERP real estate with rich results',
      affectedPages: [url],
      resources: [
        { title: 'Structured Data Guide', url: 'https://developers.google.com/search/docs/appearance/structured-data' }
      ]
    },
    {
      id: 'internal-links',
      category: 'medium',
      type: 'on-page',
      title: 'Weak Internal Linking Structure',
      description: 'Only 3 internal links found. Pages with strong internal linking rank better.',
      impact: 6,
      effort: 'low',
      priority: 5,
      recommendation: 'Build a stronger internal linking structure to distribute page authority.',
      howToFix: [
        'Add 5-10 relevant internal links per page',
        'Use descriptive anchor text',
        'Link to important pages more frequently',
        'Create content hubs with pillar pages',
        'Fix orphan pages with no internal links'
      ],
      estimatedTime: '1-2 hours',
      potentialGain: 'Better crawlability and page authority distribution',
      affectedPages: [url],
      resources: [
        { title: 'Internal Linking Strategy', url: 'https://ahrefs.com/blog/internal-links-for-seo/' }
      ]
    },
    {
      id: 'security-headers',
      category: 'medium',
      type: 'security',
      title: 'Missing Security Headers',
      description: 'Critical security headers (CSP, X-Frame-Options) are not configured.',
      impact: 5,
      effort: 'low',
      priority: 6,
      recommendation: 'Implement security headers to protect your site and improve trust signals.',
      howToFix: [
        'Add Content-Security-Policy header',
        'Configure X-Frame-Options to prevent clickjacking',
        'Set X-Content-Type-Options: nosniff',
        'Implement Strict-Transport-Security (HSTS)',
        'Add Referrer-Policy header'
      ],
      estimatedTime: '30-60 minutes',
      potentialGain: 'Improved security score and user trust',
      affectedPages: [url],
      resources: [
        { title: 'Security Headers Guide', url: 'https://securityheaders.com/' }
      ]
    },
    {
      id: 'mobile-ux',
      category: 'high',
      type: 'ux',
      title: 'Touch Targets Too Small',
      description: '12 clickable elements are smaller than the recommended 48x48px minimum.',
      impact: 7,
      effort: 'medium',
      priority: 7,
      recommendation: 'Increase touch target sizes for better mobile usability.',
      howToFix: [
        'Ensure all buttons are at least 48x48px',
        'Add padding to small interactive elements',
        'Space out links properly (at least 8px apart)',
        'Test on real mobile devices',
        'Use CSS to increase tap areas without changing visual size'
      ],
      estimatedTime: '1-2 hours',
      potentialGain: 'Improved mobile usability score and user experience',
      affectedPages: [url],
      resources: [
        { title: 'Mobile UX Guidelines', url: 'https://web.dev/accessible-tap-targets/' }
      ]
    },
    {
      id: 'render-blocking',
      category: 'medium',
      type: 'performance',
      title: 'Render-Blocking Resources',
      description: '5 CSS and 3 JavaScript files are blocking the initial render.',
      impact: 6,
      effort: 'high',
      priority: 8,
      recommendation: 'Eliminate render-blocking resources to improve page load speed.',
      howToFix: [
        'Inline critical CSS in the <head>',
        'Defer non-critical CSS with media="print" onload trick',
        'Add async or defer to non-critical JavaScript',
        'Move scripts to the bottom of the page',
        'Use code splitting for JavaScript'
      ],
      estimatedTime: '3-5 hours',
      potentialGain: '+20-40% improvement in First Contentful Paint',
      affectedPages: [url],
      resources: [
        { title: 'Render-Blocking Resources', url: 'https://web.dev/render-blocking-resources/' }
      ]
    },
    {
      id: 'content-depth',
      category: 'low',
      type: 'content',
      title: 'Content Depth Could Be Improved',
      description: 'Word count is 847. Top-ranking pages average 1,500-2,500 words for this topic.',
      impact: 5,
      effort: 'high',
      priority: 9,
      recommendation: 'Expand content to provide more comprehensive coverage of the topic.',
      howToFix: [
        'Research competitor content depth',
        'Add FAQ section with common questions',
        'Include expert quotes and statistics',
        'Add visual content (infographics, charts)',
        'Cover subtopics competitors miss'
      ],
      estimatedTime: '4-8 hours',
      potentialGain: 'Better topical authority and ranking potential',
      affectedPages: [url],
      resources: [
        { title: 'Content Depth Study', url: 'https://backlinko.com/content-study' }
      ]
    },
    {
      id: 'og-image',
      category: 'low',
      type: 'social',
      title: 'Open Graph Image Not Optimal',
      description: 'OG image is 600x315px. Recommended size is 1200x630px for best display.',
      impact: 4,
      effort: 'low',
      priority: 10,
      recommendation: 'Create an optimized Open Graph image for better social sharing.',
      howToFix: [
        'Create a 1200x630px image',
        'Include your brand and key message',
        'Use contrasting colors for visibility',
        'Test across different social platforms',
        'Keep text minimal (less than 20% of image)'
      ],
      estimatedTime: '30-60 minutes',
      potentialGain: 'Better click-through rates from social shares',
      affectedPages: [url],
      resources: [
        { title: 'OG Image Best Practices', url: 'https://ogp.me/' }
      ]
    }
  ];
  
  return items;
};

// Helper to safely parse URL
function safeParseUrl(url: string): { hostname: string; isValid: boolean } {
  try {
    // Add protocol if missing
    let normalizedUrl = url;
    if (!/^https?:\/\//i.test(url)) {
      normalizedUrl = `https://${url}`;
    }
    const parsed = new URL(normalizedUrl);
    return { hostname: parsed.hostname, isValid: true };
  } catch {
    // Fallback: extract domain-like string from input
    const match = url.match(/(?:https?:\/\/)?(?:www\.)?([^\/\s]+)/i);
    return { hostname: match?.[1] || url || 'example.com', isValid: false };
  }
}

// Main generator function
export function generateComprehensiveAudit(url: string, scanId: string): ComprehensiveSEOAudit {
  const { hostname: domain } = safeParseUrl(url);
  const overallScore = rand(65, 92);
  
  return {
    // Meta
    scanId,
    url,
    domain,
    scanDate: new Date().toISOString(),
    scanDuration: rand(8000, 15000),
    pagesScanned: rand(1, 50),
    
    // Scores
    overallScore,
    grade: overallScore >= 90 ? 'A' : overallScore >= 80 ? 'B+' : overallScore >= 70 ? 'B' : overallScore >= 60 ? 'C+' : 'C',
    categoryScores: {
      technical: rand(60, 95),
      onPage: rand(55, 90),
      content: rand(60, 92),
      userExperience: rand(65, 95),
      performance: rand(45, 88),
      social: rand(50, 85),
      security: rand(70, 98),
    },
    
    // Core Web Vitals
    coreWebVitals: {
      lcp: { value: randFloat(1.8, 4.5), rating: Math.random() > 0.5 ? 'good' : 'needs-improvement', target: 2.5 },
      fid: { value: rand(50, 200), rating: Math.random() > 0.5 ? 'good' : 'needs-improvement', target: 100 },
      cls: { value: randFloat(0.05, 0.25), rating: Math.random() > 0.6 ? 'good' : 'needs-improvement', target: 0.1 },
      inp: { value: rand(100, 400), rating: Math.random() > 0.5 ? 'good' : 'needs-improvement', target: 200 },
      ttfb: { value: rand(200, 800), rating: Math.random() > 0.6 ? 'good' : 'needs-improvement', target: 800 },
      fcp: { value: randFloat(1.0, 3.0), rating: Math.random() > 0.5 ? 'good' : 'needs-improvement', target: 1.8 },
    },
    
    // Performance
    performance: {
      pageLoadTime: rand(1500, 5000),
      domContentLoaded: rand(800, 2500),
      fullyLoaded: rand(2000, 6000),
      speedIndex: rand(2000, 5500),
      timeToInteractive: rand(2500, 6000),
      totalBlockingTime: rand(100, 600),
      serverResponseTime: rand(150, 600),
      resourceCount: rand(30, 120),
      totalPageSize: rand(800, 4000) * 1024,
      htmlSize: rand(20, 100) * 1024,
      cssSize: rand(50, 300) * 1024,
      jsSize: rand(200, 1500) * 1024,
      imageSize: rand(300, 2000) * 1024,
      fontSize: rand(20, 100) * 1024,
      thirdPartySize: rand(100, 800) * 1024,
      cacheHitRatio: randFloat(0.6, 0.95),
      compressionRatio: randFloat(0.65, 0.85),
    },
    
    // Technical SEO
    technical: {
      crawlability: {
        score: rand(70, 98),
        robotsTxt: { exists: true, valid: Math.random() > 0.2, issues: Math.random() > 0.7 ? ['Blocking important CSS/JS'] : [] },
        xmlSitemap: { exists: true, valid: Math.random() > 0.3, urlCount: rand(10, 500), lastModified: new Date(Date.now() - rand(1, 30) * 24 * 60 * 60 * 1000).toISOString() },
        indexability: { indexable: Math.random() > 0.1, blockers: [] },
        canonicalization: { hasCanonical: true, selfReferencing: Math.random() > 0.3, conflicts: [] },
      },
      rendering: {
        jsRendering: 'full',
        criticalRenderingPath: rand(800, 2500),
        renderBlockingResources: rand(2, 8),
        dynamicContent: Math.random() > 0.5,
        hydrationTime: rand(100, 500),
      },
      mobile: {
        mobileFirst: true,
        responsiveDesign: true,
        viewportConfigured: true,
        touchTargets: { adequate: Math.random() > 0.4, issues: rand(0, 15) },
        fontSizes: { readable: Math.random() > 0.3, issues: rand(0, 5) },
        contentWidth: { fits: true, overflow: Math.random() > 0.8 },
      },
      security: {
        https: true,
        hsts: Math.random() > 0.5,
        mixedContent: { count: rand(0, 3), urls: [] },
        securityHeaders: {
          contentSecurityPolicy: Math.random() > 0.6,
          xFrameOptions: Math.random() > 0.4,
          xContentTypeOptions: Math.random() > 0.5,
          referrerPolicy: Math.random() > 0.5,
          permissionsPolicy: Math.random() > 0.7,
        },
        sslCertificate: {
          valid: true,
          issuer: 'Let\'s Encrypt',
          expiresAt: new Date(Date.now() + rand(30, 90) * 24 * 60 * 60 * 1000).toISOString(),
          daysUntilExpiry: rand(30, 90),
        },
      },
      internationalization: {
        hreflangTags: { exists: Math.random() > 0.7, valid: true, languages: ['en'] },
        languageDeclaration: true,
        contentLanguage: 'en',
        regionTargeting: ['US'],
      },
      structuredData: {
        present: Math.random() > 0.4,
        types: pickRandom(['Organization', 'WebSite', 'WebPage', 'Article', 'BreadcrumbList', 'FAQPage', 'Product'], rand(1, 4)),
        valid: Math.random() > 0.3,
        errors: rand(0, 3),
        warnings: rand(0, 5),
        richResultsEligible: pickRandom(['Breadcrumbs', 'FAQ', 'Site Links', 'Logo'], rand(0, 3)),
      },
    },
    
    // On-Page SEO
    onPage: {
      title: {
        exists: true,
        content: `${domain} - Professional SEO & Digital Marketing Services`,
        length: rand(45, 70),
        optimal: Math.random() > 0.4,
        keywordPresent: Math.random() > 0.3,
        brandingPosition: 'end',
        emotionalTriggers: pickRandom(['Professional', 'Best', 'Leading', 'Trusted', 'Expert'], rand(0, 2)),
        powerWords: pickRandom(['Free', 'New', 'Proven', 'Exclusive', 'Ultimate'], rand(0, 2)),
        uniqueOnSite: true,
      },
      metaDescription: {
        exists: true,
        content: 'Professional SEO services to help your business grow online. Get more traffic, leads, and sales.',
        length: rand(80, 165),
        optimal: Math.random() > 0.5,
        keywordPresent: Math.random() > 0.4,
        callToAction: Math.random() > 0.5,
        uniqueOnSite: true,
      },
      headings: {
        h1: { count: 1, content: ['Welcome to Our Professional SEO Services'], optimal: true },
        h2: { count: rand(3, 8), content: ['Our Services', 'Why Choose Us', 'Client Results', 'Get Started'] },
        h3: { count: rand(5, 15), content: ['SEO Audit', 'Keyword Research', 'Link Building'] },
        h4: { count: rand(2, 8), content: [] },
        h5: { count: rand(0, 3), content: [] },
        h6: { count: rand(0, 2), content: [] },
        hierarchy: { valid: Math.random() > 0.3, issues: Math.random() > 0.7 ? ['Skipped heading level (H2 to H4)'] : [] },
        keywordDistribution: rand(60, 90),
      },
      content: {
        wordCount: rand(600, 2500),
        paragraphCount: rand(8, 30),
        sentenceCount: rand(40, 150),
        avgWordsPerSentence: randFloat(12, 22),
        avgSentencesPerParagraph: randFloat(3, 6),
        readabilityScore: rand(50, 80),
        readabilityGrade: pickRandom(['6th Grade', '8th Grade', '10th Grade', 'College'], 1)[0],
        fleschKincaid: randFloat(40, 75),
        gunningFog: randFloat(8, 14),
        uniqueWords: rand(200, 800),
        contentDepth: pickRandom(['moderate', 'comprehensive', 'expert'], 1)[0] as any,
      },
      keywords: {
        primary: { keyword: 'SEO services', density: randFloat(1.0, 3.5), count: rand(5, 20), inTitle: true, inH1: true, inMeta: true },
        secondary: [
          { keyword: 'digital marketing', density: randFloat(0.5, 2.0), count: rand(2, 10) },
          { keyword: 'search engine optimization', density: randFloat(0.3, 1.5), count: rand(1, 8) },
          { keyword: 'website audit', density: randFloat(0.2, 1.0), count: rand(1, 5) },
        ],
        lsiKeywords: ['organic traffic', 'Google rankings', 'keyword research', 'backlink analysis', 'on-page SEO', 'technical SEO'],
        keywordStuffing: Math.random() > 0.9,
        topicRelevance: rand(70, 95),
      },
      images: {
        total: rand(5, 25),
        withAlt: rand(3, 20),
        withoutAlt: rand(0, 8),
        optimized: rand(2, 15),
        lazyLoaded: rand(0, 15),
        webpFormat: rand(0, 10),
        avgSize: rand(50, 500) * 1024,
        largestImage: { url: '/images/hero-banner.jpg', size: rand(200, 1500) * 1024 },
        missingDimensions: rand(0, 5),
      },
      links: {
        internal: { count: rand(5, 30), unique: rand(4, 25), broken: rand(0, 3) },
        external: { count: rand(3, 15), unique: rand(2, 12), nofollow: rand(0, 5), sponsored: 0, ugc: 0 },
        anchors: { descriptive: rand(5, 25), generic: rand(1, 8), naked: rand(0, 3) },
        depth: rand(1, 4),
        orphanPages: rand(0, 5),
      },
      urls: {
        current: url,
        length: url.length,
        optimal: url.length < 75,
        hasKeyword: Math.random() > 0.5,
        parameters: 0,
        depth: (url.match(/\//g) || []).length - 2,
        readable: true,
        httpsRedirect: true,
        trailingSlash: url.endsWith('/'),
        lowercase: url === url.toLowerCase(),
      },
    },
    
    // Content Intelligence
    contentIntelligence: {
      sentiment: {
        overall: 'positive',
        score: randFloat(0.6, 0.9),
        breakdown: { positive: rand(60, 80), neutral: rand(15, 30), negative: rand(0, 10) },
      },
      topics: {
        primary: 'Search Engine Optimization',
        secondary: ['Digital Marketing', 'Content Strategy', 'Technical SEO', 'Link Building'],
        entities: [
          { name: 'Google', type: 'Organization', relevance: 0.85 },
          { name: 'SEO', type: 'Concept', relevance: 0.95 },
          { name: 'Website', type: 'Product', relevance: 0.78 },
        ],
        categories: [
          { name: 'Business Services', confidence: 0.92 },
          { name: 'Technology', confidence: 0.78 },
          { name: 'Marketing', confidence: 0.95 },
        ],
      },
      eeat: {
        experience: { score: rand(60, 90), signals: ['Case studies present', 'Client testimonials', 'Real examples shown'] },
        expertise: { score: rand(55, 88), signals: ['Industry terminology used', 'In-depth explanations', 'Technical accuracy'] },
        authoritativeness: { score: rand(50, 85), signals: ['Brand mentions', 'External citations', 'Industry recognition'] },
        trustworthiness: { score: rand(65, 92), signals: ['HTTPS enabled', 'Contact information visible', 'Privacy policy present'] },
        overallScore: rand(55, 85),
      },
      aiReadiness: {
        score: rand(50, 85),
        voiceSearchOptimized: Math.random() > 0.6,
        featuredSnippetPotential: rand(30, 80),
        questionAnswering: { questions: ['What is SEO?', 'How does SEO work?', 'Why is SEO important?'], answered: Math.random() > 0.5 },
        conversationalReady: Math.random() > 0.5,
        structuredContent: Math.random() > 0.4,
      },
      contentGaps: {
        missingTopics: ['Local SEO strategies', 'Voice search optimization', 'AI in SEO', 'Video SEO'],
        competitorAdvantages: ['More case studies', 'Pricing transparency', 'Free tools offered'],
        suggestedAdditions: ['Add FAQ section', 'Include video content', 'Create comparison tables'],
        relatedQuestions: ['How long does SEO take?', 'What does SEO cost?', 'Is SEO worth it?', 'SEO vs PPC?'],
      },
      plagiarism: {
        uniquenessScore: rand(85, 99),
        matchedSources: [],
        duplicateContent: false,
      },
    },
    
    // User Experience
    userExperience: {
      accessibility: {
        score: rand(60, 95),
        wcagLevel: Math.random() > 0.6 ? 'AA' : 'A',
        issues: [
          { type: 'Missing alt text', count: rand(0, 8), severity: 'serious' },
          { type: 'Low contrast', count: rand(0, 5), severity: 'moderate' },
          { type: 'Missing form labels', count: rand(0, 3), severity: 'serious' },
        ],
        colorContrast: { passes: rand(20, 50), fails: rand(0, 8) },
        ariaLabels: { present: rand(10, 30), missing: rand(0, 10) },
        keyboardNav: Math.random() > 0.3,
        screenReaderFriendly: Math.random() > 0.5,
      },
      navigation: {
        menuPresent: true,
        breadcrumbs: Math.random() > 0.5,
        searchFunction: Math.random() > 0.6,
        footerLinks: true,
        siteDepth: rand(2, 5),
        clicksToContent: rand(1, 4),
      },
      engagement: {
        estimatedReadTime: rand(3, 12),
        scrollDepthPotential: rand(60, 95),
        interactiveElements: rand(2, 15),
        ctaCount: rand(1, 8),
        ctaVisibility: rand(60, 95),
        formPresent: Math.random() > 0.4,
        bounceRate: rand(25, 65),
        avgTimeOnPage: rand(30, 180),
      },
      pageExperience: {
        coreWebVitalsPass: Math.random() > 0.5,
        mobileUsability: Math.random() > 0.6,
        safeBrowsing: true,
        noIntrusiveInterstitials: Math.random() > 0.7,
        httpsSecure: true,
      },
    },
    
    // Social SEO
    social: {
      openGraph: {
        present: true,
        title: `${domain} - Professional SEO Services`,
        description: 'Expert SEO services to grow your online presence.',
        image: { url: 'https://placehold.co/1200x630/1a1a2e/00bcd4?text=OG+Image+Preview', dimensions: { width: rand(600, 1200), height: rand(315, 630) }, valid: true },
        type: 'website',
        url: url,
        siteName: domain,
      },
      twitterCards: {
        present: Math.random() > 0.4,
        cardType: Math.random() > 0.5 ? 'summary_large_image' : 'summary',
        title: `${domain} - SEO Services`,
        description: 'Professional SEO services for your business.',
        image: 'https://placehold.co/1200x600/1a1a2e/00bcd4?text=Twitter+Card+Preview',
        creator: '@' + domain.split('.')[0],
      },
      socialProfiles: {
        facebook: Math.random() > 0.3,
        twitter: Math.random() > 0.4,
        linkedin: Math.random() > 0.5,
        instagram: Math.random() > 0.6,
        youtube: Math.random() > 0.7,
        pinterest: Math.random() > 0.8,
        tiktok: Math.random() > 0.9,
      },
      shareability: {
        score: rand(50, 90),
        socialProof: Math.random() > 0.5,
        shareButtons: Math.random() > 0.4,
        viralPotential: rand(20, 70),
      },
    },
    
    // Backlinks
    backlinks: {
      totalBacklinks: rand(50, 5000),
      uniqueDomains: rand(20, 500),
      domainAuthority: rand(15, 70),
      pageAuthority: rand(10, 60),
      trustFlow: rand(10, 50),
      citationFlow: rand(15, 55),
      spamScore: rand(1, 20),
      topReferringDomains: [
        { domain: 'example.com', authority: rand(30, 80), links: rand(1, 20) },
        { domain: 'blog.industry.com', authority: rand(25, 70), links: rand(1, 15) },
        { domain: 'news.tech.com', authority: rand(40, 85), links: rand(1, 10) },
      ],
      anchorTextDistribution: [
        { text: 'branded', percentage: rand(30, 50) },
        { text: 'partial match', percentage: rand(15, 30) },
        { text: 'exact match', percentage: rand(5, 15) },
        { text: 'naked URL', percentage: rand(10, 25) },
        { text: 'generic', percentage: rand(5, 15) },
      ],
      linkTypes: { dofollow: rand(60, 85), nofollow: rand(15, 40) },
      newLinks30Days: rand(0, 50),
      lostLinks30Days: rand(0, 20),
      competitorComparison: [
        { competitor: 'competitor1.com', backlinks: rand(100, 10000), domains: rand(50, 1000) },
        { competitor: 'competitor2.com', backlinks: rand(50, 8000), domains: rand(30, 800) },
      ],
    },
    
    // Competitors
    competitors: {
      competitors: [
        { url: 'https://competitor1.com', domain: 'competitor1.com', overallScore: rand(70, 95), domainAuthority: rand(40, 80), organicTraffic: rand(5000, 100000), keywords: rand(500, 10000), backlinks: rand(1000, 50000) },
        { url: 'https://competitor2.com', domain: 'competitor2.com', overallScore: rand(65, 90), domainAuthority: rand(35, 75), organicTraffic: rand(3000, 80000), keywords: rand(300, 8000), backlinks: rand(500, 30000) },
        { url: 'https://competitor3.com', domain: 'competitor3.com', overallScore: rand(60, 88), domainAuthority: rand(30, 70), organicTraffic: rand(2000, 60000), keywords: rand(200, 5000), backlinks: rand(300, 20000) },
      ],
      gaps: {
        keywords: [
          { keyword: 'local seo services', competitorRank: 3, difficulty: 45, volume: 2400 },
          { keyword: 'seo audit tool', competitorRank: 5, difficulty: 52, volume: 1900 },
          { keyword: 'technical seo checklist', competitorRank: 8, difficulty: 38, volume: 1200 },
        ],
        content: [
          { topic: 'SEO Case Studies', competitors: ['competitor1.com', 'competitor2.com'] },
          { topic: 'Free SEO Tools', competitors: ['competitor1.com'] },
        ],
        backlinks: [
          { domain: 'authoritative-site.com', authority: 75, competitors: ['competitor1.com', 'competitor3.com'] },
        ],
      },
      advantages: {
        uniqueKeywords: ['rankify seo', 'ai seo audit', 'instant seo score'],
        contentStrengths: ['Comprehensive guides', 'Unique methodology', 'Original research'],
        technicalAdvantages: ['Faster load times', 'Better mobile experience'],
      },
      serpFeatures: {
        featuredSnippets: { eligible: Math.random() > 0.5, currentOwner: 'competitor1.com' },
        peopleAlsoAsk: ['What is SEO?', 'How much does SEO cost?', 'Is SEO dead?', 'How long for SEO results?'],
        localPack: Math.random() > 0.6,
        knowledgePanel: Math.random() > 0.8,
        imageResults: Math.random() > 0.5,
        videoResults: Math.random() > 0.7,
      },
    },
    
    // Recommendations - generate once and distribute to avoid duplicate IDs
    recommendations: (() => {
      const allItems = generateActionItems(url);
      const quickWins = allItems.filter(i => i.effort === 'low').slice(0, 3);
      const usedIds = new Set(quickWins.map(i => i.id));
      
      const priorityFixes = allItems
        .filter(i => !usedIds.has(i.id) && (i.category === 'critical' || i.category === 'high'))
        .slice(0, 4);
      priorityFixes.forEach(i => usedIds.add(i.id));
      
      const longTermImprovements = allItems
        .filter(i => !usedIds.has(i.id) && i.effort === 'high')
        .slice(0, 3);
      longTermImprovements.forEach(i => usedIds.add(i.id));
      
      const opportunities = allItems
        .filter(i => !usedIds.has(i.id) && (i.category === 'opportunity' || i.category === 'medium'))
        .slice(0, 3);
      
      return {
        quickWins,
        priorityFixes,
        longTermImprovements,
        opportunities,
        totalImpactScore: rand(60, 95),
        estimatedTrafficGain: `+${rand(15, 50)}% organic traffic`,
        estimatedTimeToFix: `${rand(10, 40)} hours`,
      };
    })(),
    
    // Issues Count
    issuesCount: {
      critical: rand(1, 5),
      high: rand(2, 8),
      medium: rand(3, 12),
      low: rand(2, 10),
      total: rand(10, 35),
    },
    
    // Historical
    previousScans: [
      { date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), score: rand(55, 85), issuesFixed: rand(0, 5) },
      { date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(), score: rand(50, 80), issuesFixed: rand(0, 8) },
      { date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), score: rand(45, 75), issuesFixed: rand(0, 10) },
    ],
    
    // Export
    exportFormats: ['pdf', 'csv', 'json', 'html'],
  };
}

// Export for use in mock-data.ts
export { generateActionItems };
