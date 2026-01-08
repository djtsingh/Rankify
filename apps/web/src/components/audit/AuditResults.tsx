/**
 * Display audit scan results
 */

'use client';

import { useState } from 'react';
import { 
  Share2, Download, RefreshCw, CheckCircle2, AlertCircle, 
  AlertTriangle, TrendingUp, Clock, Target, Sparkles,
  ChevronDown, ChevronRight, ExternalLink
} from 'lucide-react';
import type { ScanResult } from '@/lib/api/audit';
import { formatDate, formatDuration, getScoreColor, getSeverityColor } from '@/lib/utils/format';
import { cleanUrlForDisplay, buildShareableUrl } from '@/lib/utils/url';

interface AuditResultsProps {
  data: ScanResult;
  onNewScan: () => void;
}

export function AuditResults({ data, onNewScan }: AuditResultsProps) {
  const [expandedIssues, setExpandedIssues] = useState<Set<string>>(new Set());
  const [copiedLink, setCopiedLink] = useState(false);

  const score = data.score || 0;
  const grade = data.grade || 'F';
  const scoreColors = getScoreColor(score);

  const toggleIssue = (issueId: string) => {
    setExpandedIssues(prev => {
      const newSet = new Set(prev);
      if (newSet.has(issueId)) {
        newSet.delete(issueId);
      } else {
        newSet.add(issueId);
      }
      return newSet;
    });
  };

  const handleShare = async () => {
    const shareUrl = buildShareableUrl(data.scan_id, data.url);
    
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    } catch (err) {
      console.error('Failed to copy link:', err);
    }
  };

  const criticalIssues = data.issues?.filter(i => i.severity === 'critical') || [];
  const warnings = data.issues?.filter(i => i.severity === 'warning') || [];
  const infos = data.issues?.filter(i => i.severity === 'info') || [];

  return (
    <div className="w-full space-y-6">
      {/* Score Card */}
      <div className="bg-zinc-900/50 backdrop-blur-sm rounded-2xl p-8 border border-zinc-800">
        <div className="flex flex-col lg:flex-row items-center gap-8">
          {/* Score Circle */}
          <div className="relative">
            <svg className="w-40 h-40 transform -rotate-90">
              <circle
                cx="80"
                cy="80"
                r="70"
                stroke="currentColor"
                strokeWidth="12"
                fill="none"
                className="text-zinc-800"
              />
              <circle
                cx="80"
                cy="80"
                r="70"
                stroke="url(#scoreGradient)"
                strokeWidth="12"
                fill="none"
                strokeDasharray={`${(score / 100) * 440} 440`}
                strokeLinecap="round"
                className="transition-all duration-1000"
              />
              <defs>
                <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#F97316" />
                  <stop offset="50%" stopColor="#EC4899" />
                  <stop offset="100%" stopColor="#10B981" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-5xl font-bold text-white">{score}</span>
              <span className={`text-xl font-semibold ${scoreColors.text}`}>{grade}</span>
            </div>
          </div>

          {/* Info */}
          <div className="flex-1 text-center lg:text-left">
            <h2 className="text-3xl font-bold text-white mb-2">
              SEO Audit Complete!
            </h2>
            <p className="text-slate-400 mb-4">
              {cleanUrlForDisplay(data.url)}
            </p>
            
            <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
              <div className="flex items-center gap-2 text-sm">
                <Clock className="w-4 h-4 text-slate-500" />
                <span className="text-slate-400">
                  {data.processing_time_ms ? formatDuration(data.processing_time_ms) : 'N/A'}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Target className="w-4 h-4 text-slate-500" />
                <span className="text-slate-400">
                  {data.summary?.total_checks || 0} checks performed
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <TrendingUp className="w-4 h-4 text-slate-500" />
                <span className="text-slate-400">
                  {formatDate(data.created_at)}
                </span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-3">
            <button
              onClick={handleShare}
              className="px-6 py-3 bg-zinc-800 hover:bg-zinc-700 rounded-xl text-white font-medium transition-all flex items-center gap-2"
            >
              <Share2 className="w-5 h-5" />
              {copiedLink ? 'Link Copied!' : 'Share Results'}
            </button>
            <button
              onClick={onNewScan}
              className="px-6 py-3 bg-gradient-to-r from-coral to-pink hover:shadow-xl hover:shadow-coral/30 rounded-xl text-white font-medium transition-all flex items-center gap-2"
            >
              <RefreshCw className="w-5 h-5" />
              New Scan
            </button>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <SummaryCard
          icon={<AlertCircle className="w-6 h-6" />}
          label="Critical Issues"
          value={criticalIssues.length}
          color="red"
        />
        <SummaryCard
          icon={<AlertTriangle className="w-6 h-6" />}
          label="Warnings"
          value={warnings.length}
          color="yellow"
        />
        <SummaryCard
          icon={<CheckCircle2 className="w-6 h-6" />}
          label="Passed"
          value={data.summary?.passed_checks || 0}
          color="emerald"
        />
      </div>

      {/* Issues List */}
      {data.issues && data.issues.length > 0 && (
        <div className="bg-zinc-900/50 backdrop-blur-sm rounded-2xl p-6 border border-zinc-800">
          <div className="flex items-center gap-3 mb-6">
            <Sparkles className="w-6 h-6 text-coral" />
            <h3 className="text-2xl font-bold text-white">Issues & Recommendations</h3>
          </div>

          <div className="space-y-3">
            {data.issues.map((issue) => {
              const isExpanded = expandedIssues.has(issue.id);
              const colors = getSeverityColor(issue.severity);

              return (
                <div
                  key={issue.id}
                  className="bg-zinc-800/30 border border-zinc-800 rounded-xl overflow-hidden hover:border-zinc-700 transition-all"
                >
                  {/* Header */}
                  <button
                    onClick={() => toggleIssue(issue.id)}
                    className="w-full px-6 py-4 flex items-center gap-4 text-left hover:bg-zinc-800/50 transition-all"
                  >
                    <div className={`w-10 h-10 rounded-lg ${colors.bg} flex items-center justify-center flex-shrink-0`}>
                      <AlertCircle className={`w-5 h-5 ${colors.icon}`} />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="text-white font-semibold truncate">{issue.title}</h4>
                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${colors.bg} ${colors.text}`}>
                          {issue.severity}
                        </span>
                      </div>
                      <p className="text-sm text-slate-400 truncate">{issue.description}</p>
                    </div>

                    <div className="flex items-center gap-4 flex-shrink-0">
                      <div className="text-right">
                        <div className="text-sm font-semibold text-white">
                          +{issue.expected_improvement}
                        </div>
                        <div className="text-xs text-slate-500">
                          {issue.time_to_fix_hours}h fix
                        </div>
                      </div>
                      {isExpanded ? (
                        <ChevronDown className="w-5 h-5 text-slate-400" />
                      ) : (
                        <ChevronRight className="w-5 h-5 text-slate-400" />
                      )}
                    </div>
                  </button>

                  {/* Expanded Content */}
                  {isExpanded && (
                    <div className="px-6 pb-6 space-y-4 border-t border-zinc-800">
                      <div className="pt-4">
                        <h5 className="text-sm font-semibold text-white mb-2">How to Fix</h5>
                        <p className="text-sm text-slate-400 leading-relaxed">
                          {issue.recommendation}
                        </p>
                      </div>
                      
                      {issue.affected_elements && issue.affected_elements.length > 0 && (
                        <div>
                          <h5 className="text-sm font-semibold text-white mb-2">Affected Elements</h5>
                          <div className="space-y-1">
                            {issue.affected_elements.slice(0, 5).map((elem, idx) => (
                              <code key={idx} className="block text-xs bg-black/50 px-3 py-2 rounded text-slate-300 font-mono">
                                {elem}
                              </code>
                            ))}
                            {issue.affected_elements.length > 5 && (
                              <p className="text-xs text-slate-500 mt-2">
                                +{issue.affected_elements.length - 5} more
                              </p>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* No Issues */}
      {(!data.issues || data.issues.length === 0) && (
        <div className="bg-emerald/10 border border-emerald/30 rounded-2xl p-8 text-center">
          <CheckCircle2 className="w-16 h-16 text-emerald mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-white mb-2">Perfect Score!</h3>
          <p className="text-slate-400">
            Your website passes all SEO checks. Great job!
          </p>
        </div>
      )}
    </div>
  );
}

interface SummaryCardProps {
  icon: React.ReactNode;
  label: string;
  value: number;
  color: 'red' | 'yellow' | 'emerald';
}

function SummaryCard({ icon, label, value, color }: SummaryCardProps) {
  const colorClasses = {
    red: 'from-red-500/20 to-red-500/5 border-red-500/30 text-red-500',
    yellow: 'from-yellow-500/20 to-yellow-500/5 border-yellow-500/30 text-yellow-500',
    emerald: 'from-emerald/20 to-emerald/5 border-emerald/30 text-emerald',
  };

  return (
    <div className={`bg-gradient-to-br ${colorClasses[color]} border rounded-xl p-6`}>
      <div className="flex items-center gap-3 mb-2">
        {icon}
        <span className="text-sm font-medium text-slate-400">{label}</span>
      </div>
      <div className="text-4xl font-bold text-white">{value}</div>
    </div>
  );
}
