/**
 * Executive Summary Component
 * High-level overview for stakeholders and quick insights
 */

'use client';

import { 
  TrendingUp, TrendingDown, AlertTriangle, CheckCircle2,
  Clock, Zap, Target, Award, Download, Share2,
  ArrowUpRight, ArrowDownRight, Sparkles
} from 'lucide-react';
import type { ComprehensiveSEOAudit } from '@/lib/types/seo-audit';

interface ExecutiveSummaryProps {
  audit: ComprehensiveSEOAudit;
  previousScore?: number;
  industryAverage?: number;
}

function ScoreComparison({ 
  label, 
  score, 
  comparison, 
  change 
}: { 
  label: string;
  score: number;
  comparison: number;
  change?: number;
}) {
  const isAbove = score >= comparison;
  
  return (
    <div className="p-4 bg-zinc-800/50 rounded-xl">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-zinc-400">{label}</span>
        {change !== undefined && (
          <div className={`flex items-center gap-1 text-xs ${change >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
            {change >= 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
            {Math.abs(change)}%
          </div>
        )}
      </div>
      
      <div className="flex items-end gap-2">
        <span className={`text-2xl font-bold ${
          score >= 80 ? 'text-emerald-400' : score >= 60 ? 'text-cyan-400' : 
          score >= 40 ? 'text-amber-400' : 'text-red-400'
        }`}>
          {score}
        </span>
        <span className="text-sm text-zinc-500 mb-0.5">
          vs {comparison} avg
        </span>
      </div>
      
      <div className="mt-2 h-1.5 bg-zinc-700 rounded-full overflow-hidden">
        <div 
          className={`h-full rounded-full transition-all duration-500 ${isAbove ? 'bg-emerald-500' : 'bg-amber-500'}`}
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  );
}

export function ExecutiveSummary({ audit, previousScore, industryAverage = 65 }: ExecutiveSummaryProps) {
  const scoreChange = previousScore ? audit.overallScore - previousScore : undefined;
  
  // Calculate key metrics
  const allRecommendations = [
    ...audit.recommendations.quickWins,
    ...audit.recommendations.priorityFixes,
    ...audit.recommendations.longTermImprovements,
    ...audit.recommendations.opportunities
  ];
  const criticalIssues = audit.issuesCount.critical;
  const highIssues = audit.issuesCount.high;
  const quickWins = audit.recommendations.quickWins.length;
  
  // Health indicators
  const healthIndicators = [
    { 
      label: 'Core Web Vitals', 
      passed: audit.coreWebVitals.lcp.rating === 'good' && audit.coreWebVitals.cls.rating === 'good',
      description: audit.coreWebVitals.lcp.rating === 'good' ? 'All metrics pass' : 'Needs improvement'
    },
    { 
      label: 'Mobile Friendly', 
      passed: audit.technical.mobile.responsiveDesign && audit.technical.mobile.mobileFirst,
      description: audit.technical.mobile.responsiveDesign ? 'Responsive design detected' : 'Mobile issues found'
    },
    { 
      label: 'Security', 
      passed: audit.technical.security.https && audit.technical.security.hsts,
      description: audit.technical.security.https ? 'HTTPS enabled' : 'Security issues'
    },
    { 
      label: 'Indexability', 
      passed: audit.technical.crawlability.indexability.indexable,
      description: audit.technical.crawlability.indexability.indexable ? 'Can be indexed' : 'Indexing blocked'
    },
  ];
  
  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <div className="p-6 bg-gradient-to-br from-zinc-900 via-zinc-900 to-zinc-800 border border-zinc-800 rounded-2xl">
        <div className="flex flex-col lg:flex-row lg:items-center gap-6">
          {/* Main Score */}
          <div className="flex items-center gap-6">
            <div className="relative">
              <svg className="w-32 h-32 transform -rotate-90">
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="8"
                  className="text-zinc-800"
                />
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  fill="none"
                  stroke="url(#scoreGradient)"
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={`${(audit.overallScore / 100) * 352} 352`}
                  className="transition-all duration-1000"
                />
                <defs>
                  <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor={audit.overallScore >= 60 ? '#10b981' : '#f59e0b'} />
                    <stop offset="100%" stopColor={audit.overallScore >= 60 ? '#06b6d4' : '#ef4444'} />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className={`text-4xl font-bold ${
                  audit.overallScore >= 80 ? 'text-emerald-400' : audit.overallScore >= 60 ? 'text-cyan-400' : 
                  audit.overallScore >= 40 ? 'text-amber-400' : 'text-red-400'
                }`}>
                  {audit.overallScore}
                </span>
                <span className="text-xs text-zinc-500">Overall Score</span>
              </div>
            </div>
            
            <div>
              <h2 className="text-2xl font-bold text-white mb-1">
                {audit.overallScore >= 80 ? 'Excellent!' : 
                 audit.overallScore >= 60 ? 'Good, with room to improve' :
                 audit.overallScore >= 40 ? 'Needs Attention' : 'Critical Issues Found'}
              </h2>
              <p className="text-zinc-400 max-w-md">
                {audit.overallScore >= 80 
                  ? 'Your website is well optimized for search engines. Focus on maintaining your position and targeting quick wins.'
                  : audit.overallScore >= 60
                  ? 'Your website has a solid foundation but addressing the identified issues could significantly improve your rankings.'
                  : 'Your website has several areas that need immediate attention to improve search visibility.'}
              </p>
              
              {scoreChange !== undefined && (
                <div className={`flex items-center gap-2 mt-3 ${scoreChange >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                  {scoreChange >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                  <span className="text-sm font-medium">
                    {scoreChange >= 0 ? '+' : ''}{scoreChange} points since last scan
                  </span>
                </div>
              )}
            </div>
          </div>
          
          {/* Quick Actions */}
          <div className="flex lg:flex-col gap-2 lg:ml-auto">
            <button className="flex items-center gap-2 px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors">
              <Download className="w-4 h-4" />
              Export PDF
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-zinc-800 text-white rounded-lg hover:bg-zinc-700 transition-colors">
              <Share2 className="w-4 h-4" />
              Share
            </button>
          </div>
        </div>
      </div>
      
      {/* Key Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-5 h-5 text-red-400" />
            <span className="text-sm text-red-400">Critical Issues</span>
          </div>
          <p className="text-3xl font-bold text-white">{criticalIssues}</p>
          <p className="text-xs text-zinc-500 mt-1">Require immediate attention</p>
        </div>
        
        <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-5 h-5 text-amber-400" />
            <span className="text-sm text-amber-400">High Priority</span>
          </div>
          <p className="text-3xl font-bold text-white">{highIssues}</p>
          <p className="text-xs text-zinc-500 mt-1">Should be addressed soon</p>
        </div>
        
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-5 h-5 text-emerald-400" />
            <span className="text-sm text-emerald-400">Quick Wins</span>
          </div>
          <p className="text-3xl font-bold text-white">{quickWins}</p>
          <p className="text-xs text-zinc-500 mt-1">Low effort, high impact</p>
        </div>
        
        <div className="p-4 bg-cyan-500/10 border border-cyan-500/20 rounded-xl">
          <div className="flex items-center gap-2 mb-2">
            <Target className="w-5 h-5 text-cyan-400" />
            <span className="text-sm text-cyan-400">Total Checks</span>
          </div>
          <p className="text-3xl font-bold text-white">{audit.issuesCount.total}</p>
          <p className="text-xs text-zinc-500 mt-1">Analyzed on this page</p>
        </div>
      </div>
      
      {/* Health Indicators */}
      <div className="p-6 bg-zinc-900/50 border border-zinc-800 rounded-xl">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-cyan-400" />
          Health Indicators
        </h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {healthIndicators.map((indicator) => (
            <div 
              key={indicator.label}
              className={`p-4 rounded-lg border ${
                indicator.passed 
                  ? 'bg-emerald-500/5 border-emerald-500/20' 
                  : 'bg-amber-500/5 border-amber-500/20'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-zinc-300">{indicator.label}</span>
                {indicator.passed ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-amber-400" />
                )}
              </div>
              <p className={`text-xs ${indicator.passed ? 'text-emerald-400' : 'text-amber-400'}`}>
                {indicator.description}
              </p>
            </div>
          ))}
        </div>
      </div>
      
      {/* Category Comparison */}
      <div className="p-6 bg-zinc-900/50 border border-zinc-800 rounded-xl">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Award className="w-5 h-5 text-cyan-400" />
          Category Performance vs Industry Average
        </h3>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <ScoreComparison 
            label="Performance" 
            score={audit.categoryScores.performance} 
            comparison={industryAverage}
          />
          <ScoreComparison 
            label="Technical" 
            score={audit.categoryScores.technical} 
            comparison={industryAverage}
          />
          <ScoreComparison 
            label="On-Page" 
            score={audit.categoryScores.onPage} 
            comparison={industryAverage}
          />
          <ScoreComparison 
            label="Content" 
            score={audit.categoryScores.content} 
            comparison={industryAverage}
          />
          <ScoreComparison 
            label="UX" 
            score={audit.categoryScores.userExperience} 
            comparison={industryAverage}
          />
          <ScoreComparison 
            label="Social" 
            score={audit.categoryScores.social} 
            comparison={industryAverage}
          />
        </div>
      </div>
    </div>
  );
}
