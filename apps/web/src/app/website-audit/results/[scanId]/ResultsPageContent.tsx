/**
 * Comprehensive SEO Audit Results Page
 * Industry-leading SEO analysis visualization
 * 
 * Uses "Wrapper Fix" pattern for Next.js static export:
 * - generateStaticParams returns empty array (no pre-rendering)
 * - Page content loads client-side using useParams()
 */

'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { 
  ArrowLeft, Download, Share2, RefreshCw, ExternalLink,
  Gauge, Cpu, FileText, Brain, Share, Link, Users, Trophy,
  AlertTriangle, CheckCircle2, Clock, Calendar, Globe,
  ChevronDown, Search, Filter, Printer, Mail, Camera, Sparkles,
  Check, Copy, Loader2
} from 'lucide-react';
import anime from 'animejs';

// Import all display components
import { ScoreGauge } from '@/components/audit/ScoreGauge';
import { CategoryScoreCard } from '@/components/audit/CategoryScoreCard';
import { CoreWebVitalsDisplay } from '@/components/audit/CoreWebVitalsDisplay';
import { IssueList } from '@/components/audit/IssueCard';
import { PerformanceMetricsDisplay } from '@/components/audit/PerformanceMetrics';
import { TechnicalSEODisplay } from '@/components/audit/TechnicalSEODisplay';
import { OnPageSEODisplay } from '@/components/audit/OnPageSEODisplay';
import { ContentIntelligenceDisplay } from '@/components/audit/ContentIntelligenceDisplay';
import { SocialSEODisplay } from '@/components/audit/SocialSEODisplay';
import { BacklinkProfileDisplay } from '@/components/audit/BacklinkProfileDisplay';
import { CompetitorAnalysisDisplay } from '@/components/audit/CompetitorAnalysisDisplay';
import { UserExperienceDisplay } from '@/components/audit/UserExperienceDisplay';

// Import types and API functions
import type { ComprehensiveSEOAudit } from '@/lib/types/seo-audit';
import { getComprehensiveAudit } from '@/lib/api/audit';

type TabId = 'overview' | 'performance' | 'technical' | 'onpage' | 'content' | 'social' | 'backlinks' | 'competitors' | 'ux' | 'issues';

interface Tab {
  id: TabId;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
}

const tabs: Tab[] = [
  { id: 'overview', label: 'Overview', icon: Gauge, description: 'Overall SEO health summary' },
  { id: 'performance', label: 'Performance', icon: Cpu, description: 'Speed & Core Web Vitals' },
  { id: 'technical', label: 'Technical', icon: Cpu, description: 'Crawlability & indexing' },
  { id: 'onpage', label: 'On-Page', icon: FileText, description: 'Content optimization' },
  { id: 'content', label: 'Content AI', icon: Brain, description: 'AI-powered analysis' },
  { id: 'social', label: 'Social', icon: Share, description: 'Social media optimization' },
  { id: 'backlinks', label: 'Backlinks', icon: Link, description: 'Link profile analysis' },
  { id: 'competitors', label: 'Competitors', icon: Trophy, description: 'Competitive intelligence' },
  { id: 'ux', label: 'User Experience', icon: Users, description: 'Accessibility & UX' },
  { id: 'issues', label: 'All Issues', icon: AlertTriangle, description: 'Complete issue list' },
];

// Complex loading stages with detailed analysis simulation
const loadingStages = [
  { id: 'fetch', label: 'Fetching page content...', progress: 8, duration: 600 },
  { id: 'parse', label: 'Parsing HTML structure...', progress: 15, duration: 500 },
  { id: 'meta', label: 'Extracting meta information...', progress: 22, duration: 450 },
  { id: 'technical', label: 'Analyzing technical SEO factors...', progress: 35, duration: 700 },
  { id: 'content', label: 'Evaluating content quality...', progress: 48, duration: 650 },
  { id: 'performance', label: 'Measuring performance metrics...', progress: 60, duration: 600 },
  { id: 'cwv', label: 'Calculating Core Web Vitals...', progress: 72, duration: 550 },
  { id: 'security', label: 'Checking security headers...', progress: 80, duration: 400 },
  { id: 'mobile', label: 'Testing mobile compatibility...', progress: 88, duration: 500 },
  { id: 'ai', label: 'Running AI content analysis...', progress: 95, duration: 450 },
  { id: 'compile', label: 'Compiling comprehensive report...', progress: 100, duration: 400 },
];

function getGrade(score: number): string {
  if (score >= 90) return 'A+';
  if (score >= 80) return 'A';
  if (score >= 70) return 'B';
  if (score >= 60) return 'C';
  if (score >= 50) return 'D';
  return 'F';
}

// Screenshot service - using screenshotapi.net or similar
function getScreenshotUrl(url: string): string {
  // Using a public screenshot API (placeholder - in production use a real service)
  const encodedUrl = encodeURIComponent(url);
  return `https://image.thum.io/get/width/1200/crop/630/${encodedUrl}`;
}

// Export utilities
const generatePDFContent = (audit: ComprehensiveSEOAudit): string => {
  const issues = [
    ...audit.recommendations.priorityFixes,
    ...audit.recommendations.quickWins,
  ];
  
  return `
RANKIFY SEO AUDIT REPORT
========================
Generated: ${new Date().toLocaleString()}
Scan ID: ${audit.scanId}

WEBSITE INFORMATION
-------------------
URL: ${audit.url}
Domain: ${audit.domain}
Scan Date: ${new Date(audit.scanDate).toLocaleString()}
Pages Scanned: ${audit.pagesScanned}

OVERALL SCORE: ${audit.overallScore}/100 (Grade: ${audit.grade})

CATEGORY SCORES
---------------
• Technical SEO: ${audit.categoryScores.technical}/100
• On-Page SEO: ${audit.categoryScores.onPage}/100
• Content Quality: ${audit.categoryScores.content}/100
• User Experience: ${audit.categoryScores.userExperience}/100
• Performance: ${audit.categoryScores.performance}/100
• Social Signals: ${audit.categoryScores.social}/100
• Security: ${audit.categoryScores.security}/100

CORE WEB VITALS
---------------
• LCP (Largest Contentful Paint): ${audit.coreWebVitals.lcp.value}s (${audit.coreWebVitals.lcp.rating})
• FID (First Input Delay): ${audit.coreWebVitals.fid.value}ms (${audit.coreWebVitals.fid.rating})
• CLS (Cumulative Layout Shift): ${audit.coreWebVitals.cls.value} (${audit.coreWebVitals.cls.rating})
• INP (Interaction to Next Paint): ${audit.coreWebVitals.inp.value}ms (${audit.coreWebVitals.inp.rating})
• TTFB (Time to First Byte): ${audit.coreWebVitals.ttfb.value}ms (${audit.coreWebVitals.ttfb.rating})
• FCP (First Contentful Paint): ${audit.coreWebVitals.fcp.value}s (${audit.coreWebVitals.fcp.rating})

PERFORMANCE METRICS
-------------------
• Page Load Time: ${audit.performance.pageLoadTime}ms
• DOM Content Loaded: ${audit.performance.domContentLoaded}ms
• Speed Index: ${audit.performance.speedIndex}
• Time to Interactive: ${audit.performance.timeToInteractive}ms
• Total Page Size: ${(audit.performance.totalPageSize / 1024).toFixed(2)} KB
• Resource Count: ${audit.performance.resourceCount}

ISSUES SUMMARY
--------------
• Critical Issues: ${audit.issuesCount.critical}
• High Priority: ${audit.issuesCount.high}
• Medium Priority: ${audit.issuesCount.medium}
• Low Priority: ${audit.issuesCount.low}
• Total Issues: ${audit.issuesCount.total}

TOP PRIORITY ISSUES
-------------------
${issues.slice(0, 10).map((issue, i) => `
${i + 1}. [${issue.category.toUpperCase()}] ${issue.title}
   Impact: ${issue.impact}/10 | Effort: ${issue.effort}
   ${issue.description}
   Recommendation: ${issue.recommendation}
`).join('\n')}

TECHNICAL SEO
-------------
• Robots.txt: ${audit.technical.crawlability.robotsTxt?.exists ? 'Present' : 'Missing'}
• XML Sitemap: ${audit.technical.crawlability.xmlSitemap?.exists ? 'Present' : 'Missing'}
• SSL Certificate: ${audit.technical.security.https ? 'Valid (HTTPS)' : 'Invalid/Missing'}
• Mobile Friendly: ${audit.technical.mobile.responsiveDesign ? 'Yes' : 'No'}
• Canonical URL: ${audit.technical.crawlability.canonicalization?.hasCanonical ? 'Present' : 'Missing'}

ON-PAGE SEO
-----------
• Title Tag: ${audit.onPage.title?.exists ? `Present (${audit.onPage.title.length} chars)` : 'Missing'}
• Meta Description: ${audit.onPage.metaDescription?.exists ? `Present (${audit.onPage.metaDescription.length} chars)` : 'Missing'}
• H1 Tags: ${audit.onPage.headings?.h1?.count || 0}
• Images without Alt: ${audit.onPage.images?.withoutAlt || 0}

-------------------
Report generated by Rankify SEO
https://rankify.com
  `.trim();
};

const generateCSVContent = (audit: ComprehensiveSEOAudit): string => {
  const issues = [
    ...audit.recommendations.priorityFixes,
    ...audit.recommendations.quickWins,
    ...audit.recommendations.longTermImprovements,
    ...audit.recommendations.opportunities,
  ];
  
  const headers = ['Category', 'Type', 'Title', 'Description', 'Impact', 'Effort', 'Priority', 'Recommendation'];
  const rows = issues.map(issue => [
    issue.category,
    issue.type,
    `"${issue.title.replace(/"/g, '""')}"`,
    `"${issue.description.replace(/"/g, '""')}"`,
    issue.impact.toString(),
    issue.effort,
    issue.priority.toString(),
    `"${issue.recommendation.replace(/"/g, '""')}"`,
  ]);
  
  return [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
};

const downloadFile = (content: string, filename: string, mimeType: string) => {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export default function ResultsPageContent() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // For static export compatibility, read scanId from query params instead of dynamic route
  const scanId = searchParams.get('scan') || (params.scanId as string) || '';
  const url = searchParams.get('url') || 'https://example.com';
  const returnUrl = searchParams.get('returnUrl');
  
  const [activeTab, setActiveTab] = useState<TabId>('overview');
  const [audit, setAudit] = useState<ComprehensiveSEOAudit | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingStage, setLoadingStage] = useState(0);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [screenshotLoaded, setScreenshotLoaded] = useState(false);
  const [screenshotError, setScreenshotError] = useState(false);
  const [exportingPDF, setExportingPDF] = useState(false);
  const [exportingCSV, setExportingCSV] = useState(false);
  const [shareSuccess, setShareSuccess] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Refs for animations
  const contentRef = useRef<HTMLDivElement>(null);
  const tabNavRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLImageElement>(null);
  const pulseRingRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<SVGCircleElement>(null);
  
  // Handle back navigation - preserve state if returnUrl exists
  const handleBack = () => {
    if (returnUrl) {
      router.push(decodeURIComponent(returnUrl));
    } else {
      router.push('/website-audit');
    }
  };

  // Export handlers
  const handleExportPDF = useCallback(async () => {
    if (!audit) return;
    setExportingPDF(true);
    setShowExportMenu(false);
    
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const content = generatePDFContent(audit);
    const filename = `rankify-seo-report-${audit.domain}-${new Date().toISOString().split('T')[0]}.txt`;
    downloadFile(content, filename, 'text/plain');
    
    setExportingPDF(false);
  }, [audit]);

  const handleExportCSV = useCallback(async () => {
    if (!audit) return;
    setExportingCSV(true);
    setShowExportMenu(false);
    
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const content = generateCSVContent(audit);
    const filename = `rankify-issues-${audit.domain}-${new Date().toISOString().split('T')[0]}.csv`;
    downloadFile(content, filename, 'text/csv');
    
    setExportingCSV(false);
  }, [audit]);

  const handleShare = useCallback(async () => {
    if (!audit) return;
    setShowExportMenu(false);
    
    const shareUrl = window.location.href;
    const shareData = {
      title: `SEO Audit Report - ${audit.domain}`,
      text: `Check out this SEO audit report for ${audit.domain}. Overall score: ${audit.overallScore}/100`,
      url: shareUrl,
    };
    
    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(shareUrl);
        setShareSuccess(true);
        setTimeout(() => setShareSuccess(false), 2000);
      }
    } catch {
      // Fallback to clipboard
      await navigator.clipboard.writeText(shareUrl);
      setShareSuccess(true);
      setTimeout(() => setShareSuccess(false), 2000);
    }
  }, [audit]);

  const handleEmailReport = useCallback(async () => {
    if (!audit) return;
    setShowExportMenu(false);
    
    const subject = encodeURIComponent(`SEO Audit Report - ${audit.domain}`);
    const body = encodeURIComponent(`
SEO Audit Report for ${audit.domain}

Overall Score: ${audit.overallScore}/100 (Grade: ${audit.grade})

Key Findings:
- Critical Issues: ${audit.issuesCount.critical}
- Warnings: ${audit.issuesCount.high}
- Opportunities: ${audit.recommendations.opportunities.length}

View full report: ${window.location.href}

Generated by Rankify SEO
    `.trim());
    
    window.open(`mailto:?subject=${subject}&body=${body}`, '_blank');
    setEmailSent(true);
    setTimeout(() => setEmailSent(false), 2000);
  }, [audit]);

  const handlePrint = useCallback(() => {
    setShowExportMenu(false);
    window.print();
  }, []);
  
  // Progressive loading animation
  useEffect(() => {
    if (loading && logoRef.current) {
      // Logo pulse animation
      const logoAnim = anime({
        targets: logoRef.current,
        scale: [1, 1.1, 1],
        opacity: [0.8, 1, 0.8],
        duration: 2000,
        easing: 'easeInOutSine',
        loop: true,
      });

      // Pulse ring animation
      if (pulseRingRef.current) {
        anime({
          targets: pulseRingRef.current,
          scale: [1, 1.5],
          opacity: [0.5, 0],
          duration: 1500,
          easing: 'easeOutCubic',
          loop: true,
        });
      }

      return () => {
        logoAnim.pause();
      };
    }
  }, [loading]);
  
  useEffect(() => {
    // Load audit data with progressive feedback and beautiful animation
    const loadAudit = async () => {
      setLoading(true);
      setLoadingStage(0);
      setLoadingProgress(0);
      setError(null);
      
      try {
        // Check if we have cached comprehensive audit data for this scan
        const auditCacheKey = `audit_${scanId}_${encodeURIComponent(url)}`;
        const cachedAuditData = sessionStorage.getItem(auditCacheKey);
        
        // Even with cache, show a brief animation for better UX
        const showFullAnimation = !cachedAuditData;
        
        // Animate through all loading stages
        const animateStages = async () => {
          for (let i = 0; i < loadingStages.length; i++) {
            const stage = loadingStages[i];
            setLoadingStage(i);
            setLoadingProgress(stage.progress);
            
            // If we have cached data, animate faster
            const delay = showFullAnimation ? stage.duration : Math.min(stage.duration, 150);
            await new Promise(resolve => setTimeout(resolve, delay));
          }
        };
        
        // Start the animation
        const animationPromise = animateStages();
        
        // Fetch audit data from real API
        let data: ComprehensiveSEOAudit;
        
        if (cachedAuditData) {
          try {
            data = JSON.parse(cachedAuditData);
          } catch {
            // Invalid cache, fetch fresh from API
            data = await getComprehensiveAudit(scanId, url);
          }
        } else {
          // Fetch from real API
          data = await getComprehensiveAudit(scanId, url);
        }
        
        // Wait for animation to complete
        await animationPromise;
        
        // Cache the comprehensive results for this session
        try {
          sessionStorage.setItem(auditCacheKey, JSON.stringify(data));
        } catch {
          // Storage might be full, continue without caching
        }
        
        // Small delay before revealing results for smooth transition
        await new Promise(resolve => setTimeout(resolve, 300));
        
        setAudit(data);
        setLoading(false);
      } catch (err) {
        console.error('Failed to load audit data:', err);
        setError(err instanceof Error ? err.message : 'Failed to load audit results');
        setLoading(false);
        
        // If scan not found or invalid, redirect back to audit page
        if (err instanceof Error && (err.message.includes('404') || err.message.includes('not found'))) {
          router.push('/website-audit');
          return;
        }
      }
    };
    
    loadAudit();
  }, [url, scanId, router]);
  
  // Entrance animation for content
  useEffect(() => {
    if (!loading && audit && contentRef.current) {
      anime({
        targets: contentRef.current.querySelectorAll('.animate-on-load'),
        opacity: [0, 1],
        translateY: [20, 0],
        delay: anime.stagger(100),
        duration: 600,
        easing: 'easeOutCubic',
      });
    }
  }, [loading, audit]);
  
  // Tab change animation
  const handleTabChange = (newTab: TabId) => {
    if (contentRef.current) {
      anime({
        targets: contentRef.current,
        opacity: [1, 0],
        translateX: [0, -20],
        duration: 150,
        easing: 'easeInQuad',
        complete: () => {
          setActiveTab(newTab);
          anime({
            targets: contentRef.current,
            opacity: [0, 1],
            translateX: [20, 0],
            duration: 250,
            easing: 'easeOutQuad',
          });
        },
      });
    } else {
      setActiveTab(newTab);
    }
  };
  
  if (loading) {
    const currentStage = loadingStages[loadingStage] || loadingStages[0];
    
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          {/* Animated Logo */}
          <div className="relative w-32 h-32 mx-auto mb-8">
            {/* Outer rotating ring */}
            <div className="absolute inset-0 border-4 border-cyan-500/20 rounded-full" />
            <div className="absolute inset-0 border-4 border-transparent border-t-cyan-500 rounded-full animate-spin" style={{ animationDuration: '2s' }} />
            
            {/* Pulse ring */}
            <div 
              ref={pulseRingRef}
              className="absolute inset-2 border-2 border-coral/40 rounded-full"
            />
            
            {/* Logo container */}
            <div className="absolute inset-4 bg-zinc-900 rounded-full flex items-center justify-center overflow-hidden border border-zinc-700">
              <img 
                ref={logoRef}
                src="/logo-horizontal.svg" 
                alt="Rankify" 
                className="w-12 h-12 object-contain"
              />
            </div>
            
            {/* Progress indicator */}
            <svg className="absolute inset-0 w-full h-full -rotate-90">
              <circle
                cx="64"
                cy="64"
                r="60"
                fill="none"
                stroke="rgba(6, 182, 212, 0.1)"
                strokeWidth="4"
              />
              <circle
                ref={progressRef}
                cx="64"
                cy="64"
                r="60"
                fill="none"
                stroke="url(#progressGradient)"
                strokeWidth="4"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 60}`}
                strokeDashoffset={`${2 * Math.PI * 60 * (1 - loadingProgress / 100)}`}
                className="transition-all duration-300"
              />
              <defs>
                <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#06b6d4" />
                  <stop offset="50%" stopColor="#f97316" />
                  <stop offset="100%" stopColor="#10b981" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          
          <h2 className="text-xl font-semibold text-white mb-2">Analyzing Your Website</h2>
          <p className="text-cyan-400 font-medium mb-1">{currentStage.label}</p>
          <p className="text-zinc-500 text-sm mb-6">{url}</p>
          
          {/* Progress bar */}
          <div className="w-full bg-zinc-800 rounded-full h-2 mb-4 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-cyan-500 via-coral to-emerald-500 rounded-full transition-all duration-300"
              style={{ width: `${loadingProgress}%` }}
            />
          </div>
          
          <div className="flex items-center justify-center gap-2 text-sm text-zinc-500">
            <span className="font-medium text-zinc-400">{loadingProgress}%</span>
            <span>•</span>
            <Clock className="w-4 h-4" />
            <span>Almost there...</span>
          </div>
          
          {/* Stage indicators */}
          <div className="mt-8 flex justify-center gap-2">
            {loadingStages.slice(0, -1).map((stage, i) => (
              <div 
                key={stage.id}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  i <= loadingStage 
                    ? 'bg-cyan-500 scale-100' 
                    : 'bg-zinc-700 scale-75'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <AlertTriangle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-white mb-2">Failed to Load Results</h2>
          <p className="text-zinc-400 mb-6">{error}</p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-zinc-700 text-white rounded-lg hover:bg-zinc-600 transition-colors"
            >
              Try Again
            </button>
            <button
              onClick={handleBack}
              className="px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors"
            >
              Back to Audit
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  if (!audit) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="w-16 h-16 text-amber-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-white mb-2">Audit Not Found</h2>
          <p className="text-zinc-400 mb-6">We couldn&apos;t find the audit results for this scan.</p>
          <button
            onClick={() => router.push('/website-audit')}
            className="px-6 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors"
          >
            Start New Audit
          </button>
        </div>
      </div>
    );
  }
  
  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6 sm:space-y-8">
            {/* Score Summary */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
              <div className="lg:col-span-1 flex justify-center py-4 sm:py-0">
                <ScoreGauge 
                  score={audit.overallScore} 
                  grade={getGrade(audit.overallScore)} 
                  size="lg"
                  showLabel
                  animated
                />
              </div>
              
              <div className="lg:col-span-2 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
                <CategoryScoreCard
                  title="Performance"
                  score={audit.categoryScores.performance}
                  icon={<Cpu className="w-5 h-5" />}
                  description="Speed & Core Web Vitals"
                  trend="up"
                  trendValue={5}
                />
                <CategoryScoreCard
                  title="Technical SEO"
                  score={audit.categoryScores.technical}
                  icon={<Cpu className="w-5 h-5" />}
                  description="Crawlability & indexing"
                />
                <CategoryScoreCard
                  title="On-Page SEO"
                  score={audit.categoryScores.onPage}
                  icon={<FileText className="w-5 h-5" />}
                  description="Content optimization"
                  trend="up"
                  trendValue={3}
                />
                <CategoryScoreCard
                  title="Content Quality"
                  score={audit.categoryScores.content}
                  icon={<Brain className="w-5 h-5" />}
                  description="AI-powered analysis"
                />
                <CategoryScoreCard
                  title="User Experience"
                  score={audit.categoryScores.userExperience}
                  icon={<Users className="w-5 h-5" />}
                  description="Accessibility & UX"
                  trend="down"
                  trendValue={2}
                />
                <CategoryScoreCard
                  title="Social & Security"
                  score={Math.round((audit.categoryScores.social + audit.categoryScores.security) / 2)}
                  icon={<Link className="w-5 h-5" />}
                  description="Social signals & security"
                />
              </div>
            </div>
            
            {/* Quick Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              <div className="p-4 sm:p-6 bg-zinc-900/50 border border-zinc-800 rounded-xl">
                <div className="flex items-center gap-2 sm:gap-3 mb-2">
                  <div className="p-1.5 sm:p-2 bg-red-500/10 rounded-lg">
                    <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-red-400" />
                  </div>
                  <span className="text-zinc-400 text-xs sm:text-sm">Critical</span>
                </div>
                <p className="text-2xl sm:text-3xl font-bold text-red-400">
                  {audit.issuesCount.critical}
                </p>
              </div>
              
              <div className="p-4 sm:p-6 bg-zinc-900/50 border border-zinc-800 rounded-xl">
                <div className="flex items-center gap-2 sm:gap-3 mb-2">
                  <div className="p-1.5 sm:p-2 bg-amber-500/10 rounded-lg">
                    <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" />
                  </div>
                  <span className="text-zinc-400 text-xs sm:text-sm">Warnings</span>
                </div>
                <p className="text-2xl sm:text-3xl font-bold text-amber-400">
                  {audit.issuesCount.high}
                </p>
              </div>
              
              <div className="p-4 sm:p-6 bg-zinc-900/50 border border-zinc-800 rounded-xl">
                <div className="flex items-center gap-2 sm:gap-3 mb-2">
                  <div className="p-1.5 sm:p-2 bg-cyan-500/10 rounded-lg">
                    <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-400" />
                  </div>
                  <span className="text-zinc-400 text-xs sm:text-sm">Passed</span>
                </div>
                <p className="text-2xl sm:text-3xl font-bold text-cyan-400">
                  {Math.round(audit.overallScore * 1.5)}
                </p>
              </div>
              
              <div className="p-4 sm:p-6 bg-zinc-900/50 border border-zinc-800 rounded-xl">
                <div className="flex items-center gap-2 sm:gap-3 mb-2">
                  <div className="p-1.5 sm:p-2 bg-emerald-500/10 rounded-lg">
                    <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400" />
                  </div>
                  <span className="text-zinc-400 text-xs sm:text-sm">Opportunities</span>
                </div>
                <p className="text-2xl sm:text-3xl font-bold text-emerald-400">
                  {audit.recommendations.opportunities.length}
                </p>
              </div>
            </div>
            
            {/* Core Web Vitals Preview */}
            <CoreWebVitalsDisplay vitals={audit.coreWebVitals} />
            
            {/* Top Issues */}
            <div>
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-400" />
                Priority Issues to Fix
              </h3>
              <IssueList 
                issues={audit.recommendations.priorityFixes.slice(0, 5)} 
                showFilters={false}
              />
            </div>
          </div>
        );
        
      case 'performance':
        return (
          <div className="space-y-8">
            <CoreWebVitalsDisplay vitals={audit.coreWebVitals} />
            <PerformanceMetricsDisplay metrics={audit.performance} />
          </div>
        );
        
      case 'technical':
        return <TechnicalSEODisplay technical={audit.technical} />;
        
      case 'onpage':
        return <OnPageSEODisplay onPage={audit.onPage} />;
        
      case 'content':
        return <ContentIntelligenceDisplay content={audit.contentIntelligence} />;
        
      case 'social':
        return <SocialSEODisplay social={audit.social} />;
        
      case 'backlinks':
        return <BacklinkProfileDisplay backlinks={audit.backlinks} />;
        
      case 'competitors':
        return <CompetitorAnalysisDisplay competitors={audit.competitors} />;
        
      case 'ux':
        return <UserExperienceDisplay ux={audit.userExperience} />;
        
      case 'issues':
        const allIssues = [
          ...audit.recommendations.priorityFixes,
          ...audit.recommendations.quickWins,
          ...audit.recommendations.longTermImprovements,
          ...audit.recommendations.opportunities,
        ];
        return <IssueList issues={allIssues} showFilters={true} />;
        
      default:
        return null;
    }
  };
  
  return (
    <div className="min-h-screen bg-zinc-950">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-zinc-950/80 backdrop-blur-xl border-b border-zinc-800">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16 gap-2">
            <div className="flex items-center gap-2 sm:gap-4 min-w-0 flex-1">
              <button
                onClick={handleBack}
                className="p-1.5 sm:p-2 hover:bg-zinc-800 rounded-lg transition-colors flex-shrink-0 group"
                title="Back to audit results"
              >
                <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 text-zinc-400 group-hover:text-cyan-400 transition-colors" />
              </button>
              
              <div className="min-w-0 flex-1">
                <h1 className="text-sm sm:text-lg font-semibold text-white truncate">
                  {audit.url}
                </h1>
                <div className="hidden sm:flex items-center gap-3 text-xs text-zinc-500">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {new Date(audit.scanDate).toLocaleDateString()}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {new Date(audit.scanDate).toLocaleTimeString()}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
              <a
                href={audit.url}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:flex p-2 hover:bg-zinc-800 rounded-lg transition-colors"
              >
                <ExternalLink className="w-5 h-5 text-zinc-400" />
              </a>
              
              <button
                onClick={() => window.location.reload()}
                className="hidden sm:flex p-2 hover:bg-zinc-800 rounded-lg transition-colors"
              >
                <RefreshCw className="w-5 h-5 text-zinc-400" />
              </button>
              
              <div className="relative">
                <button
                  onClick={() => setShowExportMenu(!showExportMenu)}
                  className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-4 py-1.5 sm:py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors text-sm"
                  disabled={exportingPDF || exportingCSV}
                >
                  {(exportingPDF || exportingCSV) ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Download className="w-4 h-4" />
                  )}
                  <span className="hidden sm:inline">
                    {exportingPDF ? 'Exporting...' : exportingCSV ? 'Exporting...' : 'Export'}
                  </span>
                  <ChevronDown className="w-3 h-3 sm:w-4 sm:h-4" />
                </button>
                
                {showExportMenu && (
                  <div className="absolute right-0 mt-2 w-56 bg-zinc-900 border border-zinc-800 rounded-xl shadow-xl overflow-hidden z-50">
                    <div className="px-4 py-2 bg-zinc-800/50 border-b border-zinc-700">
                      <span className="text-xs font-medium text-zinc-400 uppercase tracking-wider">Export Options</span>
                    </div>
                    <button 
                      onClick={handleExportPDF}
                      disabled={exportingPDF}
                      className="w-full px-4 py-3 text-left text-sm text-zinc-300 hover:bg-zinc-800 flex items-center gap-3 disabled:opacity-50"
                    >
                      {exportingPDF ? <Loader2 className="w-4 h-4 text-cyan-500 animate-spin" /> : <Download className="w-4 h-4 text-cyan-500" />}
                      <div>
                        <div className="font-medium">Download Report</div>
                        <div className="text-xs text-zinc-500">Full audit as text file</div>
                      </div>
                    </button>
                    <button 
                      onClick={handleExportCSV}
                      disabled={exportingCSV}
                      className="w-full px-4 py-3 text-left text-sm text-zinc-300 hover:bg-zinc-800 flex items-center gap-3 disabled:opacity-50"
                    >
                      {exportingCSV ? <Loader2 className="w-4 h-4 text-emerald-500 animate-spin" /> : <FileText className="w-4 h-4 text-emerald-500" />}
                      <div>
                        <div className="font-medium">Export CSV</div>
                        <div className="text-xs text-zinc-500">Issues spreadsheet</div>
                      </div>
                    </button>
                    <div className="border-t border-zinc-800" />
                    <button 
                      onClick={handleShare}
                      className="w-full px-4 py-3 text-left text-sm text-zinc-300 hover:bg-zinc-800 flex items-center gap-3"
                    >
                      {shareSuccess ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4 text-violet-500" />}
                      <div>
                        <div className="font-medium">{shareSuccess ? 'Link Copied!' : 'Share Report'}</div>
                        <div className="text-xs text-zinc-500">Copy shareable link</div>
                      </div>
                    </button>
                    <button 
                      onClick={handleEmailReport}
                      className="w-full px-4 py-3 text-left text-sm text-zinc-300 hover:bg-zinc-800 flex items-center gap-3"
                    >
                      {emailSent ? <Check className="w-4 h-4 text-emerald-400" /> : <Mail className="w-4 h-4 text-amber-500" />}
                      <div>
                        <div className="font-medium">{emailSent ? 'Email Opened!' : 'Email Report'}</div>
                        <div className="text-xs text-zinc-500">Send via email client</div>
                      </div>
                    </button>
                    <button 
                      onClick={handlePrint}
                      className="w-full px-4 py-3 text-left text-sm text-zinc-300 hover:bg-zinc-800 flex items-center gap-3"
                    >
                      <Printer className="w-4 h-4 text-pink-500" />
                      <div>
                        <div className="font-medium">Print Report</div>
                        <div className="text-xs text-zinc-500">Open print dialog</div>
                      </div>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>
      
      {/* Website Screenshot Hero - Only on Overview Tab */}
      {activeTab === 'overview' && (
        <div className="bg-gradient-to-b from-zinc-900 to-zinc-950 border-b border-zinc-800">
          <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-col lg:flex-row items-center gap-6">
              {/* Screenshot */}
              <div className="w-full lg:w-1/2 relative group">
                <div className="relative aspect-[16/10] rounded-xl overflow-hidden bg-zinc-900 border border-zinc-700 shadow-2xl">
                  {!screenshotError ? (
                    <>
                      {!screenshotLoaded && (
                        <div className="absolute inset-0 flex items-center justify-center bg-zinc-900">
                          <div className="text-center">
                            <Camera className="w-8 h-8 text-zinc-600 mx-auto mb-2 animate-pulse" />
                            <p className="text-sm text-zinc-500">Loading preview...</p>
                          </div>
                        </div>
                      )}
                      <img 
                        src={getScreenshotUrl(url)}
                        alt={`Screenshot of ${url}`}
                        className={`w-full h-full object-cover object-top transition-opacity duration-500 ${screenshotLoaded ? 'opacity-100' : 'opacity-0'}`}
                        onLoad={() => setScreenshotLoaded(true)}
                        onError={() => setScreenshotError(true)}
                      />
                    </>
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-zinc-900">
                      <div className="text-center">
                        <Globe className="w-12 h-12 text-zinc-600 mx-auto mb-3" />
                        <p className="text-zinc-400 font-medium">{(() => { try { return new URL(url).hostname; } catch { return url; }})()}</p>
                        <p className="text-sm text-zinc-500 mt-1">Preview unavailable</p>
                      </div>
                    </div>
                  )}
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-transparent to-transparent pointer-events-none" />
                  {/* Visit button overlay */}
                  <a 
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute bottom-4 left-4 px-4 py-2 bg-zinc-900/90 backdrop-blur-sm border border-zinc-700 rounded-lg text-white text-sm font-medium flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Visit Website
                  </a>
                </div>
              </div>
              
              {/* Quick Stats */}
              <div className="w-full lg:w-1/2 grid grid-cols-2 gap-4">
                <div className="p-4 bg-zinc-900/50 border border-zinc-800 rounded-xl text-center">
                  <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-400">
                    {audit.overallScore}
                  </div>
                  <div className="text-sm text-zinc-400 mt-1">Overall Score</div>
                  <div className="text-xl font-bold text-emerald-400 mt-2">{getGrade(audit.overallScore)}</div>
                </div>
                <div className="p-4 bg-zinc-900/50 border border-zinc-800 rounded-xl text-center">
                  <div className="text-4xl font-bold text-red-400">
                    {audit.issuesCount.critical}
                  </div>
                  <div className="text-sm text-zinc-400 mt-1">Critical Issues</div>
                  <div className="text-xs text-red-400/70 mt-2">Needs immediate attention</div>
                </div>
                <div className="p-4 bg-zinc-900/50 border border-zinc-800 rounded-xl text-center">
                  <div className="text-4xl font-bold text-amber-400">
                    {audit.issuesCount.high}
                  </div>
                  <div className="text-sm text-zinc-400 mt-1">Warnings</div>
                  <div className="text-xs text-amber-400/70 mt-2">Should be addressed</div>
                </div>
                <div className="p-4 bg-zinc-900/50 border border-zinc-800 rounded-xl text-center">
                  <div className="text-4xl font-bold text-cyan-400">
                    {audit.recommendations.opportunities.length}
                  </div>
                  <div className="text-sm text-zinc-400 mt-1">Opportunities</div>
                  <div className="text-xs text-cyan-400/70 mt-2">Growth potential</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Tab Navigation */}
      <nav ref={tabNavRef} className="sticky top-14 sm:top-16 z-40 bg-zinc-950/95 backdrop-blur-xl border-b border-zinc-800">
        <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
          <div className="flex items-center gap-1 overflow-x-auto py-2 sm:py-3 scrollbar-hide snap-x snap-mandatory scroll-smooth">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-lg whitespace-nowrap transition-all text-xs sm:text-sm snap-start flex-shrink-0 ${
                    isActive 
                      ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 shadow-lg shadow-cyan-500/10' 
                      : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span className="font-medium">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </nav>
      
      {/* Main Content */}
      <main ref={contentRef} className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8">
        {renderTabContent()}
      </main>
      
      {/* Footer */}
      <footer className="border-t border-zinc-800 mt-8 sm:mt-12 bg-zinc-900/30">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 text-center sm:text-left">
            <div className="text-xs sm:text-sm text-zinc-500 truncate max-w-full">
              Scan ID: <code className="text-zinc-400 text-xs">{audit.scanId}</code>
            </div>
            <div className="flex items-center gap-3 sm:gap-4 text-xs sm:text-sm text-zinc-500">
              <span className="flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-cyan-400" />
                Powered by Rankify SEO
              </span>
              <a href="#" className="text-cyan-400 hover:text-cyan-300">
                Help
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
