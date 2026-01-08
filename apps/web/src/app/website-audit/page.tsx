"use client";

import { Suspense, useState, useEffect, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Navigation } from "@/components/layout/Navigation";
import { Footer } from "@/components/layout/Footer";
import { useAudit } from "@/lib/hooks/useAudit";
import { 
  Chrome, FileText, Link2, Target, CheckCircle2, AlertCircle, 
  Clock, Zap, ArrowRight, Lock, Unlock, Sparkles, Globe, 
  Search, BarChart3, TrendingUp, Shield, Eye, Layers,
  AlertTriangle, CheckCheck, XCircle, ArrowDown,
  Download, Share2, Star, Users, Timer, Gauge, Activity, Cpu,
  ChevronRight, ChevronDown, RefreshCw, PieChart, Type, ImageIcon, LinkIcon,
  Heading1, Play, ExternalLink, History
} from "lucide-react";
import anime from 'animejs';

const URL_SUGGESTIONS = [
  'amazon.com',
  'google.com',
  'facebook.com',
  'twitter.com',
  'instagram.com',
  'linkedin.com',
  'youtube.com',
  'reddit.com',
  'github.com',
  'medium.com',
  'shopify.com',
  'wordpress.org',
  'squarespace.com',
  'wix.com',
];

function WebsiteAuditContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const scanIdParam = searchParams.get('scan');
  const urlParam = searchParams.get('url');

  // Use the audit hook for query parameter support
  const {
    state: auditState,
    progress: scanProgress,
    currentStep: currentCheck,
    error: auditError,
    results: auditResults,
    startScan,
    reset,
    isLoading,
    scanId,
  } = useAudit(scanIdParam);

  // Local UI state
  const [url, setUrl] = useState(urlParam || "");
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);
  const [recentUrls, setRecentUrls] = useState<string[]>([]);
  
  // Refs for animations
  const viewReportButtonRef = useRef<HTMLButtonElement>(null);
  const resultsCardRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Load recent URLs from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('recentAuditUrls');
    if (stored) {
      try {
        setRecentUrls(JSON.parse(stored).slice(0, 5));
      } catch {
        // Ignore parse errors
      }
    }
  }, []);

  // Save URL to recent when scan completes
  useEffect(() => {
    if (auditState === 'complete' && url) {
      const normalizedUrl = url.replace(/^https?:\/\//, '').replace(/\/$/, '');
      const updated = [normalizedUrl, ...recentUrls.filter(u => u !== normalizedUrl)].slice(0, 5);
      setRecentUrls(updated);
      localStorage.setItem('recentAuditUrls', JSON.stringify(updated));
    }
  }, [auditState, url]);

  // Pulsing animation for View Full Report button
  useEffect(() => {
    if (auditResults && auditState === 'complete' && viewReportButtonRef.current) {
      // Start pulsing animation to draw attention
      const pulseAnimation = anime({
        targets: viewReportButtonRef.current,
        scale: [1, 1.05, 1],
        boxShadow: [
          '0 0 0 0 rgba(16, 185, 129, 0)',
          '0 0 30px 15px rgba(16, 185, 129, 0.4)',
          '0 0 0 0 rgba(16, 185, 129, 0)',
        ],
        duration: 2000,
        easing: 'easeInOutSine',
        loop: true,
      });

      return () => pulseAnimation.pause();
    }
  }, [auditResults, auditState]);

  // Results card entrance animation
  useEffect(() => {
    if (auditResults && auditState === 'complete' && resultsCardRef.current) {
      anime({
        targets: resultsCardRef.current,
        opacity: [0, 1],
        translateY: [30, 0],
        scale: [0.95, 1],
        duration: 800,
        easing: 'easeOutBack',
      });
    }
  }, [auditResults, auditState]);

  // URL autocomplete filtering
  useEffect(() => {
    if (url.length > 0) {
      const input = url.replace(/^https?:\/\//, '').toLowerCase();
      const combined = [...new Set([...recentUrls, ...URL_SUGGESTIONS])];
      const filtered = combined.filter(s => 
        s.toLowerCase().includes(input) && s.toLowerCase() !== input
      ).slice(0, 6);
      setFilteredSuggestions(filtered);
      setShowSuggestions(filtered.length > 0);
    } else {
      // Show recent URLs when input is focused but empty
      setFilteredSuggestions(recentUrls);
      setShowSuggestions(false);
    }
  }, [url, recentUrls]);

  // Handle URL selection from autocomplete
  const handleSelectSuggestion = (suggestion: string) => {
    setUrl(`https://${suggestion}`);
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  // Navigate to full results
  const handleViewFullReport = () => {
    const scanParam = scanId || searchParams.get('scan') || 'demo';
    const urlParam = url || searchParams.get('url') || '';
    // Use returnUrl to enable back navigation with state
    const returnUrl = encodeURIComponent(`/website-audit?scan=${scanParam}&url=${encodeURIComponent(urlParam)}`);
    // Use query parameters instead of dynamic routes for static export compatibility
    router.push(`/website-audit/results?scan=${scanParam}&url=${encodeURIComponent(urlParam)}&returnUrl=${returnUrl}`);
  };

  // Update URL input when param changes
  useEffect(() => {
    if (urlParam && !url) {
      setUrl(urlParam);
    }
  }, [urlParam, url]);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleScan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url || isLoading) return;
    await startScan(url);
  };

  // Derive scanning state from audit hook
  const isScanning = isLoading;
  const canScan = auditState === 'idle' || auditState === 'complete' || auditState === 'error';

  // Comprehensive audit categories based on backend
  const auditCategories = [
    {
      id: "title-tags",
      icon: Type,
      title: "Title Tags",
      subtitle: "First impression in search results",
      color: "coral",
      bgColor: "bg-coral/10",
      borderColor: "border-coral/30",
      textColor: "text-coral",
      checks: [
        { name: "Existence Check", desc: "Detect pages with missing titles", severity: "critical" },
        { name: "Length Validation", desc: "Optimal 30-60 characters for SERPs", severity: "warning" },
        { name: "Keyword Presence", desc: "Target keywords in title tags", severity: "info" },
        { name: "Duplicate Detection", desc: "Find duplicate titles across pages", severity: "critical" },
        { name: "SERP Truncation", desc: "Preview how titles appear in Google", severity: "warning" },
        { name: "Indexing Status", desc: "Check if titles are blocked", severity: "critical" },
      ]
    },
    {
      id: "meta-descriptions",
      icon: FileText,
      title: "Meta Descriptions",
      subtitle: "Your click-through rate booster",
      color: "cyan",
      bgColor: "bg-cyan/10",
      borderColor: "border-cyan/30",
      textColor: "text-cyan",
      checks: [
        { name: "Existence Check", desc: "Find pages missing meta descriptions", severity: "critical" },
        { name: "Length Optimization", desc: "120-160 characters for best display", severity: "warning" },
        { name: "Keyword Inclusion", desc: "Target terms in descriptions", severity: "info" },
        { name: "Duplicate Detection", desc: "Unique descriptions per page", severity: "warning" },
        { name: "Compelling Copy", desc: "Clickable, actionable language", severity: "info" },
      ]
    },
    {
      id: "heading-structure",
      icon: Heading1,
      title: "Heading Structure",
      subtitle: "Content hierarchy & semantics",
      color: "pink",
      bgColor: "bg-pink/10",
      borderColor: "border-pink/30",
      textColor: "text-pink",
      checks: [
        { name: "H1 Existence", desc: "Every page needs exactly one H1", severity: "critical" },
        { name: "Multiple H1 Detection", desc: "Flag pages with multiple H1 tags", severity: "critical" },
        { name: "Hierarchy Validation", desc: "Proper H1→H2→H3 sequence", severity: "warning" },
        { name: "Keyword Optimization", desc: "Keywords in headings", severity: "info" },
        { name: "Length Analysis", desc: "Optimal heading length", severity: "info" },
        { name: "Empty Headings", desc: "Detect headings with no content", severity: "warning" },
      ]
    },
    {
      id: "content-quality",
      icon: Target,
      title: "Content Quality",
      subtitle: "The heart of your SEO",
      color: "emerald",
      bgColor: "bg-emerald/10",
      borderColor: "border-emerald/30",
      textColor: "text-emerald",
      checks: [
        { name: "Word Count Analysis", desc: "Flag thin pages under 300 words", severity: "warning" },
        { name: "Duplicate Content", desc: "Detect copied or similar text", severity: "critical" },
        { name: "Readability Scores", desc: "Flesch-Kincaid & other metrics", severity: "info" },
        { name: "Keyword Density", desc: "Optimal keyword distribution", severity: "warning" },
        { name: "Keyword Stuffing", desc: "Detect over-optimization", severity: "critical" },
        { name: "GEO Optimization", desc: "AI search readiness check", severity: "info" },
      ]
    },
    {
      id: "image-optimization",
      icon: ImageIcon,
      title: "Image Optimization",
      subtitle: "Speed & accessibility combined",
      color: "yellow",
      bgColor: "bg-yellow-500/10",
      borderColor: "border-yellow-500/30",
      textColor: "text-yellow-500",
      checks: [
        { name: "Alt Text Check", desc: "Missing alt attributes", severity: "critical" },
        { name: "File Size Analysis", desc: "Large images slowing pages", severity: "warning" },
        { name: "Format Optimization", desc: "WebP vs JPEG/PNG comparison", severity: "info" },
        { name: "Broken Images", desc: "404 and failed image loads", severity: "critical" },
        { name: "Dimension Analysis", desc: "Proper width/height attributes", severity: "warning" },
        { name: "Lazy Loading", desc: "Implementation verification", severity: "info" },
      ]
    },
    {
      id: "url-structure",
      icon: LinkIcon,
      title: "URL Structure",
      subtitle: "Clean, readable, optimized",
      color: "purple",
      bgColor: "bg-purple-500/10",
      borderColor: "border-purple-500/30",
      textColor: "text-purple-500",
      checks: [
        { name: "URL Complexity", desc: "Length and parameter analysis", severity: "warning" },
        { name: "Readability Check", desc: "Human-friendly URL structure", severity: "info" },
        { name: "Keyword in URL", desc: "Target terms in URL paths", severity: "info" },
        { name: "Separator Analysis", desc: "Hyphens vs underscores", severity: "warning" },
        { name: "Canonical URLs", desc: "Proper canonical implementation", severity: "critical" },
        { name: "Parameter Handling", desc: "Query string optimization", severity: "warning" },
      ]
    },
    {
      id: "internal-linking",
      icon: Link2,
      title: "Internal Linking",
      subtitle: "Site architecture & flow",
      color: "coral",
      bgColor: "bg-coral/10",
      borderColor: "border-coral/30",
      textColor: "text-coral",
      checks: [
        { name: "Broken Links", desc: "Internal 404 errors", severity: "critical" },
        { name: "Anchor Text Quality", desc: "Descriptive link text", severity: "warning" },
        { name: "Link Distribution", desc: "Pages with too few/many links", severity: "info" },
        { name: "Orphan Pages", desc: "Pages with no internal links", severity: "critical" },
        { name: "Crawl Depth", desc: "Pages >3 clicks from home", severity: "warning" },
        { name: "Link Equity Flow", desc: "PageRank distribution analysis", severity: "info" },
      ]
    },
  ];

  const stats = [
    { value: "50+", label: "SEO Checks", icon: CheckCheck, color: "coral" },
    { value: "<30s", label: "Analysis Time", icon: Timer, color: "cyan" },
    { value: "7", label: "Categories", icon: Layers, color: "emerald" },
    { value: "100%", label: "Free Daily", icon: Sparkles, color: "pink" },
  ];

  const trustIndicators = [
    { icon: Users, value: "50,000+", label: "Websites Analyzed" },
    { icon: Star, value: "4.9/5", label: "User Rating" },
    { icon: Shield, value: "100%", label: "Privacy Protected" },
    { icon: Zap, value: "99.9%", label: "Uptime" },
  ];

  return (
    <div className="min-h-screen bg-black">
      <Navigation />
      
      {/* Hero Section - Epic Design */}
      <section className="relative min-h-[90vh] flex items-center justify-center pt-24 pb-20 px-4 overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 -z-10">
          {/* Grid pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(249,115,22,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(249,115,22,0.03)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
          
          {/* Gradient orbs */}
          <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-coral/20 rounded-full blur-[120px] animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-cyan/15 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-pink/10 rounded-full blur-[150px] animate-pulse" style={{ animationDelay: '2s' }}></div>
          
          {/* Floating elements */}
          <div className="absolute top-20 left-[10%] p-3 bg-zinc-900/80 backdrop-blur-sm border border-zinc-800 rounded-xl animate-bounce" style={{ animationDuration: '3s' }}>
            <CheckCircle2 className="w-6 h-6 text-emerald" />
          </div>
          <div className="absolute top-40 right-[15%] p-3 bg-zinc-900/80 backdrop-blur-sm border border-zinc-800 rounded-xl animate-bounce" style={{ animationDuration: '3.5s', animationDelay: '0.5s' }}>
            <AlertTriangle className="w-6 h-6 text-yellow-500" />
          </div>
          <div className="absolute bottom-32 left-[20%] p-3 bg-zinc-900/80 backdrop-blur-sm border border-zinc-800 rounded-xl animate-bounce" style={{ animationDuration: '4s', animationDelay: '1s' }}>
            <TrendingUp className="w-6 h-6 text-coral" />
          </div>
          <div className="absolute bottom-40 right-[10%] p-3 bg-zinc-900/80 backdrop-blur-sm border border-zinc-800 rounded-xl animate-bounce" style={{ animationDuration: '3s', animationDelay: '1.5s' }}>
            <BarChart3 className="w-6 h-6 text-cyan" />
          </div>
        </div>

        <div className={`container max-w-5xl mx-auto text-center transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          {/* Top Badge */}
          <div className="inline-flex items-center gap-3 px-5 py-2.5 bg-zinc-900/90 backdrop-blur-xl border border-coral/40 rounded-full mb-8 shadow-lg shadow-coral/10">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-emerald rounded-full animate-pulse"></div>
              <span className="text-xs text-emerald font-medium">Live</span>
            </div>
            <div className="w-px h-4 bg-zinc-700"></div>
            <Chrome className="w-4 h-4 text-coral" />
            <span className="text-sm text-slate-300">Professional SEO Audit Tool</span>
            <div className="w-px h-4 bg-zinc-700"></div>
            <span className="text-xs text-cyan font-medium">v2.0</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold mb-6 leading-[1.1] tracking-tight">
            <span className="text-white">Uncover Every </span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-coral via-pink to-cyan">SEO Issue </span>
            <span className="text-white">In Seconds</span>
          </h1>

          {/* Subheadline */}
          <p className="text-lg sm:text-xl lg:text-2xl text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            Deep-dive into <span className="text-coral font-semibold">50+ ranking factors</span> across 
            <span className="text-cyan font-semibold"> 7 critical categories</span>. 
            Get actionable fixes that actually move the needle.
          </p>

          {/* Main Audit Form */}
          <form onSubmit={handleScan} className="max-w-2xl mx-auto mb-10">
            <div className="relative group">
              {/* Subtle glow on focus/hover */}
              <div className="absolute -inset-0.5 bg-gradient-to-r from-coral/50 via-pink/50 to-cyan/50 rounded-2xl blur opacity-0 group-hover:opacity-20 group-focus-within:opacity-30 transition-opacity duration-300"></div>
              
              <div className="relative flex flex-col sm:flex-row bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
                {/* URL Input Section */}
                <div className="flex-1 relative flex items-center">
                  <div className="pl-4 sm:pl-5">
                    <Globe className="w-5 h-5 text-slate-500" />
                  </div>
                  <input
                    ref={inputRef}
                    type="text"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    onFocus={() => {
                      if (recentUrls.length > 0 && !url) {
                        setFilteredSuggestions(recentUrls);
                        setShowSuggestions(true);
                      }
                    }}
                    onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                    placeholder="example.com"
                    className="flex-1 px-3 py-4 sm:py-5 bg-transparent text-white text-base sm:text-lg placeholder-slate-600 outline-none"
                    required
                    disabled={!canScan || isScanning}
                    autoComplete="off"
                  />
                  {url && (
                    <button
                      type="button"
                      onClick={() => setUrl("")}
                      className="pr-3 text-slate-500 hover:text-slate-300 transition-colors"
                    >
                      <XCircle className="w-5 h-5" />
                    </button>
                  )}
                  
                  {/* URL Autocomplete Dropdown */}
                  {showSuggestions && filteredSuggestions.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-zinc-900 border border-zinc-800 rounded-xl shadow-xl overflow-hidden z-50">
                      {recentUrls.length > 0 && filteredSuggestions.some(s => recentUrls.includes(s)) && (
                        <div className="px-4 py-2 text-xs text-slate-500 border-b border-zinc-800 flex items-center gap-2">
                          <History className="w-3 h-3" />
                          Recent searches
                        </div>
                      )}
                      {filteredSuggestions.map((suggestion, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => handleSelectSuggestion(suggestion)}
                          className="w-full px-4 py-3 text-left text-slate-300 hover:bg-zinc-800 hover:text-white transition-colors flex items-center gap-3"
                        >
                          {recentUrls.includes(suggestion) ? (
                            <History className="w-4 h-4 text-cyan" />
                          ) : (
                            <Globe className="w-4 h-4 text-slate-600" />
                          )}
                          <span className="text-sm">{suggestion}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                
                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={!canScan || isScanning || !url}
                  className={`px-6 sm:px-8 py-4 sm:py-5 bg-gradient-to-r from-coral to-pink font-semibold text-white flex items-center justify-center gap-2 sm:gap-3 transition-all duration-200 ${
                    (!canScan || isScanning || !url) ? 'opacity-50 cursor-not-allowed' : 'hover:from-coral-dark hover:to-pink-dark'
                  }`}
                >
                  {isScanning ? (
                    <>
                      <RefreshCw className="w-5 h-5 animate-spin" />
                      <span>Analyzing...</span>
                    </>
                  ) : (
                    <>
                      <Search className="w-5 h-5" />
                      <span>Start Deep Audit</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Progress Bar (during scan) */}
            {isScanning && (
              <div className="mt-6 space-y-3">
                <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-coral to-cyan transition-all duration-300 rounded-full"
                    style={{ width: `${scanProgress}%` }}
                  ></div>
                </div>
                <div className="flex items-center justify-center gap-2 text-sm text-slate-400">
                  <Activity className="w-4 h-4 text-coral animate-pulse" />
                  <span>{currentCheck || 'Processing...'}</span>
                </div>
              </div>
            )}

            {/* Error Message */}
            {auditError && (
              <div className="mt-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
                <div className="flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-red-500 font-semibold mb-1">Audit Failed</p>
                    <p className="text-sm text-slate-400">{auditError}</p>
                  </div>
                  <button
                    onClick={reset}
                    className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg text-red-500 font-medium transition-all"
                  >
                    Try Again
                  </button>
                </div>
              </div>
            )}

            {/* Success Results Preview */}
            {auditResults && auditState === 'complete' && (
              <div 
                ref={resultsCardRef}
                className="mt-8 w-full max-w-6xl mx-auto p-6 md:p-8 lg:p-10 bg-gradient-to-br from-emerald-900/20 via-zinc-900/50 to-cyan-900/20 border border-emerald-500/30 rounded-2xl backdrop-blur-sm opacity-0"
              >
                {/* Header with Score and Website Preview */}
                <div className="flex flex-col lg:flex-row items-start justify-between gap-6 mb-6">
                  {/* Left: Score Display */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 bg-emerald-500/20 rounded-xl animate-pulse">
                        <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                      </div>
                      <div>
                        <h3 className="text-xl md:text-2xl font-bold text-white">Audit Complete!</h3>
                        <p className="text-sm text-slate-400">Your comprehensive SEO analysis is ready</p>
                      </div>
                    </div>
                    
                    {/* Main Score Display */}
                    <div className="flex items-center gap-6 p-5 bg-zinc-900/70 rounded-xl border border-zinc-800">
                      <div className="relative">
                        {/* Circular Score Gauge */}
                        <svg className="w-24 h-24 transform -rotate-90">
                          <circle cx="48" cy="48" r="42" fill="none" stroke="currentColor" strokeWidth="8" className="text-zinc-800" />
                          <circle 
                            cx="48" cy="48" r="42" fill="none" 
                            stroke="url(#scoreGradient)" 
                            strokeWidth="8" 
                            strokeLinecap="round"
                            strokeDasharray={`${((auditResults.score || 0) / 100) * 264} 264`}
                          />
                          <defs>
                            <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                              <stop offset="0%" stopColor="#10b981" />
                              <stop offset="100%" stopColor="#06b6d4" />
                            </linearGradient>
                          </defs>
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <span className="text-3xl font-bold text-white">{auditResults.score || 0}</span>
                          <span className="text-xs text-zinc-500">/ 100</span>
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className={`text-4xl font-bold ${
                            (auditResults.score || 0) >= 80 ? 'text-emerald-400' :
                            (auditResults.score || 0) >= 60 ? 'text-yellow-400' :
                            'text-red-400'
                          }`}>
                            {auditResults.grade || 'N/A'}
                          </span>
                          <span className="text-xs px-2 py-1 rounded-full bg-zinc-800 text-zinc-400">Grade</span>
                        </div>
                        <p className="text-sm text-zinc-400">
                          {(auditResults.score || 0) >= 80 ? '🎉 Excellent! Your site is well-optimized' :
                           (auditResults.score || 0) >= 60 ? '👍 Good, but room for improvement' :
                           '⚠️ Needs attention - critical issues found'}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Right: Quick Category Scores */}
                  <div className="w-full lg:w-80 p-4 bg-zinc-900/70 rounded-xl border border-zinc-800">
                    <h4 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-cyan-400" />
                      Category Breakdown
                    </h4>
                    <div className="space-y-2">
                      {[
                        { name: 'Performance', score: auditResults.categoryScores?.performance || 70, color: 'cyan' },
                        { name: 'Technical SEO', score: auditResults.categoryScores?.technical || 65, color: 'emerald' },
                        { name: 'Content Quality', score: auditResults.categoryScores?.content || 60, color: 'purple' },
                        { name: 'User Experience', score: auditResults.categoryScores?.ux || 75, color: 'amber' },
                      ].map((cat) => (
                        <div key={cat.name} className="flex items-center gap-3">
                          <span className="text-xs text-zinc-400 w-24 truncate">{cat.name}</span>
                          <div className="flex-1 h-2 bg-zinc-800 rounded-full overflow-hidden">
                            <div 
                              className={`h-full rounded-full transition-all duration-500 ${
                                cat.color === 'cyan' ? 'bg-cyan-500' :
                                cat.color === 'emerald' ? 'bg-emerald-500' :
                                cat.color === 'purple' ? 'bg-purple-500' :
                                'bg-amber-500'
                              }`}
                              style={{ width: `${cat.score}%` }}
                            />
                          </div>
                          <span className="text-xs font-medium text-white w-8">{cat.score}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                {/* Metrics Grid - Enhanced */}
                {auditResults.metrics && (
                  <div className="grid grid-cols-3 md:grid-cols-6 gap-3 mb-6">
                    <div className="text-center p-3 md:p-4 bg-zinc-900/50 rounded-xl border border-zinc-800 hover:border-cyan-500/30 transition-colors">
                      <div className="text-xl md:text-2xl font-bold text-cyan-400 mb-1">{auditResults.metrics.word_count}</div>
                      <div className="text-xs text-slate-400">Words</div>
                    </div>
                    <div className="text-center p-3 md:p-4 bg-zinc-900/50 rounded-xl border border-zinc-800 hover:border-emerald-500/30 transition-colors">
                      <div className="text-xl md:text-2xl font-bold text-emerald-400 mb-1">{auditResults.metrics.h1_count}</div>
                      <div className="text-xs text-slate-400">H1 Tags</div>
                    </div>
                    <div className="text-center p-3 md:p-4 bg-zinc-900/50 rounded-xl border border-zinc-800 hover:border-purple-500/30 transition-colors">
                      <div className="text-xl md:text-2xl font-bold text-purple-400 mb-1">{auditResults.metrics.image_count}</div>
                      <div className="text-xs text-slate-400">Images</div>
                    </div>
                    <div className="text-center p-3 md:p-4 bg-zinc-900/50 rounded-xl border border-zinc-800 hover:border-amber-500/30 transition-colors">
                      <div className="text-xl md:text-2xl font-bold text-amber-400 mb-1">{auditResults.metrics.internal_links_count}</div>
                      <div className="text-xs text-slate-400">Internal</div>
                    </div>
                    <div className="text-center p-3 md:p-4 bg-zinc-900/50 rounded-xl border border-zinc-800 hover:border-pink-500/30 transition-colors">
                      <div className="text-xl md:text-2xl font-bold text-pink-400 mb-1">{auditResults.metrics.external_links_count}</div>
                      <div className="text-xs text-slate-400">External</div>
                    </div>
                    <div className="text-center p-3 md:p-4 bg-zinc-900/50 rounded-xl border border-zinc-800 hover:border-emerald-500/30 transition-colors">
                      <div className={`text-xl md:text-2xl font-bold ${auditResults.metrics.https_enabled ? 'text-emerald-400' : 'text-red-400'} mb-1`}>
                        {auditResults.metrics.https_enabled ? '✓' : '✗'}
                      </div>
                      <div className="text-xs text-slate-400">HTTPS</div>
                    </div>
                  </div>
                )}
                
                {/* Issues Summary + Enhanced CTA */}
                {auditResults.summary && (
                  <div className="flex flex-col gap-4 p-5 bg-gradient-to-r from-zinc-900/90 to-zinc-800/50 rounded-xl border border-zinc-700">
                    {/* Issues Count Row */}
                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 md:gap-6">
                      <div className="flex items-center gap-2 px-4 py-2 bg-red-500/10 rounded-lg border border-red-500/20">
                        <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                        <span className="text-sm font-medium text-red-400">
                          {auditResults.summary.critical_issues} Critical
                        </span>
                      </div>
                      <div className="flex items-center gap-2 px-4 py-2 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
                        <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                        <span className="text-sm font-medium text-yellow-400">
                          {auditResults.summary.warnings} Warnings
                        </span>
                      </div>
                      <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                        <span className="text-sm font-medium text-emerald-400">
                          {auditResults.summary.passed_checks} Passed
                        </span>
                      </div>
                    </div>
                    
                    {/* Full Report CTA Section */}
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-4 border-t border-zinc-700">
                      <div className="text-center md:text-left">
                        <p className="text-white font-semibold mb-1">Unlock Your Full SEO Report</p>
                        <p className="text-sm text-zinc-400">Includes 8 analysis categories, actionable fixes, and expert recommendations</p>
                      </div>
                      
                      {/* Enhanced CTA Button */}
                      <button 
                        type="button"
                        ref={viewReportButtonRef}
                        onClick={handleViewFullReport}
                        className="group relative px-8 py-4 bg-gradient-to-r from-emerald-500 via-cyan-500 to-emerald-500 bg-[length:200%_100%] text-white font-semibold rounded-xl transition-all hover:scale-105 flex items-center gap-3 animate-gradient-x shadow-lg shadow-emerald-500/20"
                      >
                        <Sparkles className="w-5 h-5" />
                        <span>View Full Detailed Report</span>
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        {/* Animated ring */}
                        <div className="absolute inset-0 rounded-xl border-2 border-emerald-400 animate-ping opacity-20"></div>
                      </button>
                    </div>
                  </div>
                )}
                
                {/* Top Issues Preview */}
                {auditResults.issues && auditResults.issues.length > 0 && (
                  <div className="mt-6 space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-lg font-semibold text-white flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5 text-amber-400" />
                        Top Issues Found
                      </h4>
                      <span className="text-xs px-3 py-1 bg-zinc-800 rounded-full text-zinc-400">
                        Preview - {auditResults.issues.length} total
                      </span>
                    </div>
                    {auditResults.issues.slice(0, 3).map((issue, idx) => (
                      <div key={issue.id || idx} className="p-4 bg-zinc-900/50 rounded-xl border border-zinc-800 hover:border-zinc-700 transition-colors">
                        <div className="flex items-start gap-3">
                          <div className={`p-2 rounded-lg flex-shrink-0 ${
                            issue.severity === 'critical' ? 'bg-red-500/20 text-red-400' :
                            issue.severity === 'warning' ? 'bg-yellow-500/20 text-yellow-400' :
                            'bg-blue-500/20 text-blue-400'
                          }`}>
                            {issue.severity === 'critical' ? <AlertTriangle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h5 className="font-semibold text-white mb-1">{issue.title}</h5>
                            <p className="text-sm text-slate-400 mb-2 line-clamp-2">{issue.description}</p>
                            <p className="text-xs text-emerald-400 font-medium">💡 {issue.recommendation}</p>
                          </div>
                          <div className="flex flex-col items-end gap-1 flex-shrink-0">
                            <div className="text-xs font-semibold px-3 py-1 rounded-full bg-zinc-800 text-slate-300">
                              Impact: {issue.impact_score}/10
                            </div>
                            <span className="text-xs text-zinc-500">~{issue.time_to_fix_hours || 1}h to fix</span>
                          </div>
                        </div>
                      </div>
                    ))}
                    {auditResults.issues.length > 3 && (
                      <button 
                        type="button"
                        onClick={handleViewFullReport}
                        className="w-full py-3 text-center text-sm text-cyan-400 hover:text-cyan-300 bg-zinc-900/50 rounded-xl border border-zinc-800 hover:border-cyan-500/30 transition-all"
                      >
                        View all {auditResults.issues.length} issues in full report →
                      </button>
                    )}
                  </div>
                )}
                
                {/* What's Included Teaser */}
                <div className="mt-6 p-4 bg-zinc-900/50 rounded-xl border border-zinc-800">
                  <p className="text-xs text-zinc-500 text-center mb-3">Your full report includes:</p>
                  <div className="flex flex-wrap items-center justify-center gap-2">
                    {['Performance', 'Technical SEO', 'On-Page', 'Content AI', 'Social', 'Backlinks', 'Competitors', 'UX'].map((item) => (
                      <span key={item} className="px-3 py-1 text-xs bg-zinc-800 text-zinc-400 rounded-full">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Status Messages */}
            {!isScanning && !auditError && (
              <div className="mt-5 flex items-center justify-center gap-6 text-sm">
                <span className="flex items-center gap-2 text-emerald">
                  <Unlock className="w-4 h-4" />
                  Free audit available
                </span>
                <span className="text-zinc-600">•</span>
                <span className="flex items-center gap-2 text-slate-500">
                  <Shield className="w-4 h-4" />
                  No signup required
                </span>
              </div>
            )}
          </form>

          {/* Stats Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div 
                  key={index}
                  className="group p-4 bg-zinc-900/50 backdrop-blur-sm border border-zinc-800 rounded-xl hover:border-zinc-700 transition-all hover:scale-105"
                >
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <Icon className={`w-5 h-5 text-${stat.color}`} />
                    <span className={`text-2xl md:text-3xl font-bold text-${stat.color}`}>{stat.value}</span>
                  </div>
                  <p className="text-sm text-slate-500">{stat.label}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <ArrowDown className="w-6 h-6 text-slate-500" />
        </div>
      </section>

      {/* Trust Indicators Bar */}
      <section className="py-8 px-4 border-y border-zinc-800 bg-zinc-950/50">
        <div className="container max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {trustIndicators.map((item, index) => {
              const Icon = item.icon;
              return (
                <div key={index} className="flex items-center justify-center gap-3">
                  <Icon className="w-5 h-5 text-coral" />
                  <div>
                    <div className="text-lg font-bold text-white">{item.value}</div>
                    <div className="text-xs text-slate-500">{item.label}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* What We Analyze - Tabbed Interface */}
      <section className="py-24 px-4">
        <div className="container max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-cyan/10 border border-cyan/30 rounded-full mb-6">
              <Layers className="w-4 h-4 text-cyan" />
              <span className="text-sm text-cyan font-medium">Deep Analysis Engine</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              7 Critical SEO Categories
            </h2>
            <p className="text-xl text-slate-400 max-w-3xl mx-auto">
              Our AI-powered engine examines every corner of your website, from technical foundations to content excellence
            </p>
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap justify-center gap-2 mb-12">
            {auditCategories.map((cat, index) => {
              const Icon = cat.icon;
              return (
                <button
                  key={index}
                  onClick={() => setActiveTab(index)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all ${
                    activeTab === index
                      ? `${cat.bgColor} ${cat.borderColor} border ${cat.textColor}`
                      : 'bg-zinc-900/50 border border-zinc-800 text-slate-400 hover:text-white hover:border-zinc-700'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{cat.title}</span>
                </button>
              );
            })}
          </div>

          {/* Active Category Detail */}
          <div className="grid lg:grid-cols-2 gap-8 items-start">
            {/* Left: Category Info */}
            <div className={`p-8 rounded-3xl ${auditCategories[activeTab].bgColor} border ${auditCategories[activeTab].borderColor}`}>
              <div className="flex items-center gap-4 mb-6">
                <div className={`p-4 ${auditCategories[activeTab].bgColor} rounded-2xl border ${auditCategories[activeTab].borderColor}`}>
                  {(() => {
                    const Icon = auditCategories[activeTab].icon;
                    return <Icon className={`w-8 h-8 ${auditCategories[activeTab].textColor}`} />;
                  })()}
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">{auditCategories[activeTab].title}</h3>
                  <p className="text-slate-400">{auditCategories[activeTab].subtitle}</p>
                </div>
              </div>

              <div className="space-y-3">
                {auditCategories[activeTab].checks.map((check, i) => (
                  <div 
                    key={i}
                    className="flex items-start gap-3 p-4 bg-zinc-900/50 rounded-xl border border-zinc-800 hover:border-zinc-700 transition-colors"
                  >
                    <div className={`mt-0.5 ${
                      check.severity === 'critical' ? 'text-red-400' :
                      check.severity === 'warning' ? 'text-yellow-500' : 'text-cyan'
                    }`}>
                      {check.severity === 'critical' ? <AlertCircle className="w-5 h-5" /> :
                       check.severity === 'warning' ? <AlertTriangle className="w-5 h-5" /> :
                       <CheckCircle2 className="w-5 h-5" />}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-white">{check.name}</h4>
                        <span className={`px-2 py-0.5 rounded-full text-xs ${
                          check.severity === 'critical' ? 'bg-red-500/20 text-red-400' :
                          check.severity === 'warning' ? 'bg-yellow-500/20 text-yellow-500' :
                          'bg-cyan/20 text-cyan'
                        }`}>
                          {check.severity}
                        </span>
                      </div>
                      <p className="text-sm text-slate-400">{check.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Visual Preview */}
            <div className="relative">
              <div className="sticky top-24 p-8 bg-zinc-900/80 backdrop-blur-xl rounded-3xl border border-zinc-800">
                <div className="text-center mb-8">
                  <div className={`inline-flex items-center justify-center w-20 h-20 ${auditCategories[activeTab].bgColor} rounded-2xl mb-4`}>
                    {(() => {
                      const Icon = auditCategories[activeTab].icon;
                      return <Icon className={`w-10 h-10 ${auditCategories[activeTab].textColor}`} />;
                    })()}
                  </div>
                  <h4 className="text-xl font-bold text-white mb-2">
                    {auditCategories[activeTab].checks.length} Checks
                  </h4>
                  <p className="text-slate-400">In this category</p>
                </div>

                {/* Mini Report Preview */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-red-500/10 border border-red-500/30 rounded-xl">
                    <span className="text-sm text-red-400">Critical Issues</span>
                    <span className="text-lg font-bold text-red-400">
                      {auditCategories[activeTab].checks.filter(c => c.severity === 'critical').length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-xl">
                    <span className="text-sm text-yellow-500">Warnings</span>
                    <span className="text-lg font-bold text-yellow-500">
                      {auditCategories[activeTab].checks.filter(c => c.severity === 'warning').length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-cyan/10 border border-cyan/30 rounded-xl">
                    <span className="text-sm text-cyan">Optimizations</span>
                    <span className="text-lg font-bold text-cyan">
                      {auditCategories[activeTab].checks.filter(c => c.severity === 'info').length}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  className="w-full mt-6 py-3 bg-gradient-to-r from-coral to-pink rounded-xl font-semibold text-white flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-coral/30 transition-all"
                >
                  <Search className="w-5 h-5" />
                  <span>Run Full Audit</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works - Timeline - Card Overlay Style */}
      <section className="py-20 md:py-24 px-4 relative overflow-hidden">
        <div className="container max-w-6xl mx-auto relative">
          {/* Card overlay */}
          <div className="relative bg-zinc-900/60 backdrop-blur-xl border border-zinc-800 rounded-3xl p-8 md:p-12 lg:p-16 shadow-2xl">
            {/* Subtle glow effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-emerald/5 via-transparent to-cyan/5 rounded-3xl pointer-events-none"></div>
            
            <div className="relative text-center mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald/10 border border-emerald/30 rounded-full mb-6">
                <Play className="w-4 h-4 text-emerald" />
                <span className="text-sm text-emerald font-medium">Simple Process</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                How It Works
              </h2>
              <p className="text-xl text-slate-400 max-w-2xl mx-auto">
                From URL to actionable insights in under 30 seconds
              </p>
            </div>

            <div className="relative">
              {/* Connection Line */}
              <div className="hidden md:block absolute top-1/2 left-8 right-8 h-0.5 bg-gradient-to-r from-coral via-cyan to-emerald -translate-y-1/2 opacity-30"></div>
              
              <div className="grid md:grid-cols-4 gap-8">
                {[
                  { step: 1, icon: Globe, title: "Enter URL", desc: "Paste your website URL into our analyzer", color: "coral" },
                  { step: 2, icon: Cpu, title: "AI Analysis", desc: "Our engine scans 50+ ranking factors", color: "cyan" },
                  { step: 3, icon: PieChart, title: "Generate Report", desc: "Issues categorized by priority", color: "coral" },
                  { step: 4, icon: TrendingUp, title: "Take Action", desc: "Follow fixes to boost rankings", color: "emerald" },
                ].map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <div key={index} className="relative text-center">
                      <div className={`relative z-10 w-20 h-20 bg-zinc-800 border border-zinc-700 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg`}>
                        <Icon className={`w-8 h-8 text-${item.color}`} />
                        <div className={`absolute -top-2 -right-2 w-8 h-8 bg-${item.color} rounded-full flex items-center justify-center text-sm font-bold text-white shadow-lg`}>
                          {item.step}
                        </div>
                      </div>
                      <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                      <p className="text-slate-400">{item.desc}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Results Preview - macOS Style */}
      <section id="results-preview" className="py-24 px-4">
        <div className="container max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-pink/10 border border-pink/30 rounded-full mb-6">
              <Eye className="w-4 h-4 text-pink" />
              <span className="text-sm text-pink font-medium">Report Preview</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Beautiful, Actionable Reports
            </h2>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto">
              Clear visualizations and prioritized recommendations you can actually use
            </p>
          </div>

          {/* macOS Window */}
          <div className="relative">
            {/* Glow effect */}
            <div className="absolute -inset-4 bg-gradient-to-r from-coral/20 via-pink/20 to-cyan/20 rounded-3xl blur-2xl opacity-50"></div>
            
            <div className="relative bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-800 overflow-hidden">
              {/* Title Bar */}
              <div className="bg-zinc-800/90 backdrop-blur-sm px-4 py-3 flex items-center justify-between border-b border-zinc-700">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500 hover:brightness-110 transition-all cursor-pointer"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500 hover:brightness-110 transition-all cursor-pointer"></div>
                  <div className="w-3 h-3 rounded-full bg-emerald hover:brightness-110 transition-all cursor-pointer"></div>
                </div>
                <div className="flex items-center gap-2 px-4 py-1.5 bg-zinc-900 rounded-lg">
                  <Lock className="w-3 h-3 text-emerald" />
                  <span className="text-sm text-slate-400">rankify.page/audit/results</span>
                </div>
                <div className="flex items-center gap-2">
                  <button className="p-1.5 hover:bg-zinc-700 rounded transition-colors">
                    <Share2 className="w-4 h-4 text-slate-400" />
                  </button>
                  <button className="p-1.5 hover:bg-zinc-700 rounded transition-colors">
                    <Download className="w-4 h-4 text-slate-400" />
                  </button>
                </div>
              </div>

              {/* Report Content */}
              <div className="p-8 space-y-8">
                {/* Score Header */}
                <div className="flex flex-col md:flex-row items-center gap-8 p-8 bg-zinc-800/50 rounded-2xl">
                  <div className="relative">
                    <svg className="w-40 h-40 transform -rotate-90">
                      <circle cx="80" cy="80" r="70" fill="none" stroke="#27272a" strokeWidth="12" />
                      <circle 
                        cx="80" cy="80" r="70" fill="none" 
                        stroke="url(#scoreGradient)" 
                        strokeWidth="12" 
                        strokeLinecap="round"
                        strokeDasharray={`${87 * 4.4} 440`}
                      />
                      <defs>
                        <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#10B981" />
                          <stop offset="100%" stopColor="#06B6D4" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <span className="text-5xl font-bold text-white">87</span>
                        <span className="text-lg text-slate-400">/100</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex-1 text-center md:text-left">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald/20 text-emerald rounded-full text-sm font-medium mb-3">
                      <TrendingUp className="w-4 h-4" />
                      Good Score
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">Your website is performing well!</h3>
                    <p className="text-slate-400 mb-4">Address the critical issues below to reach 95+ and dominate search results.</p>
                    <div className="flex flex-wrap gap-4">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                        <span className="text-sm text-slate-400">3 Critical</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                        <span className="text-sm text-slate-400">8 Warnings</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-emerald rounded-full"></div>
                        <span className="text-sm text-slate-400">24 Passed</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Category Scores */}
                <div className="grid md:grid-cols-4 gap-4">
                  {[
                    { name: "Title & Meta", score: 92, color: "emerald" },
                    { name: "Content", score: 78, color: "yellow-500" },
                    { name: "Images", score: 85, color: "emerald" },
                    { name: "Links", score: 95, color: "emerald" },
                  ].map((cat, i) => (
                    <div key={i} className="p-4 bg-zinc-800/30 rounded-xl border border-zinc-700">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-slate-400">{cat.name}</span>
                        <span className={`text-lg font-bold text-${cat.color}`}>{cat.score}</span>
                      </div>
                      <div className="h-2 bg-zinc-700 rounded-full overflow-hidden">
                        <div 
                          className={`h-full bg-${cat.color} rounded-full`}
                          style={{ width: `${cat.score}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Sample Issues */}
                <div className="space-y-3">
                  <h4 className="text-lg font-semibold text-white flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-red-400" />
                    Priority Issues to Fix
                  </h4>
                  
                  {[
                    { icon: FileText, title: "5 pages missing meta descriptions", severity: "critical", impact: "High impact on CTR" },
                    { icon: ImageIcon, title: "12 images without alt text", severity: "critical", impact: "Accessibility & SEO issue" },
                    { icon: Link2, title: "3 broken internal links found", severity: "critical", impact: "Poor user experience" },
                    { icon: Type, title: "2 pages have duplicate titles", severity: "warning", impact: "Indexing confusion" },
                    { icon: Gauge, title: "Large images slowing page load", severity: "warning", impact: "Core Web Vitals" },
                  ].map((issue, i) => {
                    const Icon = issue.icon;
                    return (
                      <div key={i} className="flex items-center gap-4 p-4 bg-zinc-800/30 rounded-xl border border-zinc-700 hover:border-coral/50 transition-colors group cursor-pointer">
                        <div className={`p-2.5 rounded-xl ${issue.severity === 'critical' ? 'bg-red-500/10' : 'bg-yellow-500/10'}`}>
                          <Icon className={`w-5 h-5 ${issue.severity === 'critical' ? 'text-red-400' : 'text-yellow-500'}`} />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h5 className="font-medium text-white">{issue.title}</h5>
                            <span className={`px-2 py-0.5 rounded-full text-xs ${
                              issue.severity === 'critical' ? 'bg-red-500/20 text-red-400' : 'bg-yellow-500/20 text-yellow-500'
                            }`}>
                              {issue.severity}
                            </span>
                          </div>
                          <p className="text-sm text-slate-500">{issue.impact}</p>
                        </div>
                        <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-coral group-hover:translate-x-1 transition-all" />
                      </div>
                    );
                  })}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-4 pt-4 border-t border-zinc-800">
                  <button className="flex-1 py-3 bg-gradient-to-r from-coral to-pink rounded-xl font-semibold text-white flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-coral/30 transition-all">
                    <Download className="w-5 h-5" />
                    <span>Download PDF Report</span>
                  </button>
                  <button className="flex-1 py-3 bg-zinc-800 border border-zinc-700 rounded-xl font-semibold text-white flex items-center justify-center gap-2 hover:bg-zinc-700 transition-colors">
                    <Share2 className="w-5 h-5" />
                    <span>Share Results</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section - Card Overlay Style */}
      <section className="py-20 md:py-24 px-4 relative overflow-hidden">
        <div className="container max-w-4xl mx-auto relative">
          {/* Card overlay */}
          <div className="relative bg-zinc-900/60 backdrop-blur-xl border border-zinc-800 rounded-3xl p-8 md:p-12 shadow-2xl">
            {/* Subtle glow effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-coral/5 via-transparent to-cyan/5 rounded-3xl pointer-events-none"></div>
            
            <div className="relative text-center mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-coral/10 border border-coral/30 rounded-full mb-6">
                <CheckCheck className="w-4 h-4 text-coral" />
                <span className="text-sm text-coral font-medium">Got Questions?</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Frequently Asked Questions
              </h2>
            </div>

            <div className="relative space-y-4">
              {[
                {
                  q: "How does the 24-hour limit work?",
                  a: "Each user can run one comprehensive free audit every 24 hours. This ensures fair access for everyone while maintaining our server performance. A countdown timer shows exactly when your next audit becomes available. Need unlimited scans? Check out our Pro plan."
                },
                {
                  q: "What makes this different from other SEO tools?",
                  a: "We analyze 50+ ranking factors across 7 critical categories in under 30 seconds. Our AI engine provides not just issues, but prioritized, actionable fixes with clear impact explanations. Plus, it's beautifully designed and actually free."
                },
                {
                  q: "Can I audit competitor websites?",
                  a: "Absolutely! You can audit any publicly accessible website. This makes it perfect for competitive analysis - see what your competitors are doing right (or wrong) and apply those insights to your own strategy."
                },
                {
                  q: "How accurate are the results?",
                  a: "Our audit tool uses the same standards as Google's own guidelines and is constantly updated to reflect algorithm changes. We combine automated analysis with AI-powered recommendations for industry-leading accuracy."
                },
                {
                  q: "Do I need technical skills to understand the report?",
                  a: "Not at all! Every issue comes with plain-English explanations, severity ratings, and step-by-step fix guides. Whether you're a developer or a marketing manager, you'll know exactly what to do."
                },
                {
                  q: "Is my website data kept private?",
                  a: "100%. We don't store your website content, audit results, or any personal data. Everything is processed in real-time and immediately discarded. Your privacy is our priority."
                },
              ].map((faq, index) => (
                <div
                  key={index}
                  className="bg-zinc-800/50 border border-zinc-700 rounded-2xl overflow-hidden hover:border-coral/30 transition-all"
                >
                  <button
                    onClick={() => setOpenFaq(openFaq === index ? null : index)}
                    className="w-full px-6 py-5 flex items-center justify-between text-left group"
                  >
                    <span className="text-lg font-semibold text-white group-hover:text-coral transition-colors pr-4">
                      {faq.q}
                    </span>
                    <div className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                      openFaq === index ? 'bg-coral text-white rotate-180' : 'bg-zinc-700 text-slate-400'
                    }`}>
                      <ChevronDown className="w-5 h-5" />
                    </div>
                  </button>
                  <div className={`overflow-hidden transition-all duration-300 ${openFaq === index ? 'max-h-96' : 'max-h-0'}`}>
                    <div className="px-6 pb-6 text-slate-400 leading-relaxed">
                      {faq.a}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 px-4">
        <div className="container max-w-4xl mx-auto">
          <div className="relative">
            {/* Background glow */}
            <div className="absolute inset-0 bg-gradient-to-r from-coral/30 via-pink/30 to-cyan/30 rounded-3xl blur-3xl opacity-50"></div>
            
            <div className="relative p-12 md:p-16 bg-zinc-900/90 backdrop-blur-xl border border-zinc-800 rounded-3xl text-center overflow-hidden">
              {/* Decorative elements */}
              <div className="absolute top-0 left-0 w-32 h-32 bg-coral/20 rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 right-0 w-32 h-32 bg-cyan/20 rounded-full blur-3xl"></div>
              
              <div className="relative">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-coral to-pink rounded-2xl mb-8 shadow-lg shadow-coral/30">
                  <Sparkles className="w-10 h-10 text-white" />
                </div>
                
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                  Ready to Dominate Search?
                </h2>
                <p className="text-xl text-slate-400 mb-10 max-w-2xl mx-auto">
                  Join 50,000+ websites that improved their rankings with our free audit tool. 
                  Your competitors are already using it.
                </p>
                
                <button
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  className="px-12 py-5 bg-gradient-to-r from-coral to-pink rounded-xl font-bold text-lg text-white flex items-center gap-3 mx-auto hover:shadow-xl hover:shadow-coral/30 hover:scale-105 transition-all"
                >
                  <Search className="w-6 h-6" />
                  <span>Start Your Free Audit Now</span>
                </button>
                
                <p className="mt-6 text-sm text-slate-500">
                  No signup required • Results in 30 seconds • 100% free
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

// Main export with Suspense wrapper for query params
export default function WebsiteAuditPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-coral/30 border-t-coral rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-400">Loading audit tool...</p>
        </div>
      </div>
    }>
      <WebsiteAuditContent />
    </Suspense>
  );
}
