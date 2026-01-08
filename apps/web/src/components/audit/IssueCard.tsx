/**
 * Issue Card Component
 * Displays individual SEO issues with full details
 */

'use client';

import { useState } from 'react';
import { 
  AlertTriangle, AlertCircle, Info, ChevronDown, ChevronUp, 
  Clock, TrendingUp, ExternalLink, Lightbulb, Wrench, Target
} from 'lucide-react';
import type { ActionItem } from '@/lib/types/seo-audit';

interface IssueCardProps {
  issue: ActionItem;
  expanded?: boolean;
}

export function IssueCard({ issue, expanded: defaultExpanded = false }: IssueCardProps) {
  const [expanded, setExpanded] = useState(defaultExpanded);
  
  const categoryStyles = {
    critical: { 
      bg: 'bg-red-500/10', 
      border: 'border-red-500/30', 
      text: 'text-red-400',
      icon: AlertTriangle,
      badge: 'bg-red-500/20 text-red-400 border-red-500/30'
    },
    high: { 
      bg: 'bg-orange-500/10', 
      border: 'border-orange-500/30', 
      text: 'text-orange-400',
      icon: AlertCircle,
      badge: 'bg-orange-500/20 text-orange-400 border-orange-500/30'
    },
    medium: { 
      bg: 'bg-amber-500/10', 
      border: 'border-amber-500/30', 
      text: 'text-amber-400',
      icon: AlertCircle,
      badge: 'bg-amber-500/20 text-amber-400 border-amber-500/30'
    },
    low: { 
      bg: 'bg-blue-500/10', 
      border: 'border-blue-500/30', 
      text: 'text-blue-400',
      icon: Info,
      badge: 'bg-blue-500/20 text-blue-400 border-blue-500/30'
    },
    opportunity: { 
      bg: 'bg-emerald-500/10', 
      border: 'border-emerald-500/30', 
      text: 'text-emerald-400',
      icon: Lightbulb,
      badge: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
    },
  };
  
  const styles = categoryStyles[issue.category];
  const Icon = styles.icon;
  
  const effortColors = {
    low: 'text-emerald-400',
    medium: 'text-amber-400',
    high: 'text-red-400',
  };
  
  return (
    <div className={`rounded-xl ${styles.bg} border ${styles.border} overflow-hidden transition-all duration-300 hover:shadow-lg`}>
      {/* Header - always visible */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full p-3 sm:p-5 flex items-start gap-3 sm:gap-4 text-left"
      >
        <div className={`p-2 sm:p-2.5 rounded-lg bg-zinc-900/50 ${styles.text} flex-shrink-0`}>
          <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 sm:gap-4">
            <div className="min-w-0 flex-1">
              <h4 className="text-white font-semibold text-sm sm:text-base mb-1 line-clamp-2">{issue.title}</h4>
              <p className="text-xs sm:text-sm text-zinc-400 line-clamp-2">{issue.description}</p>
            </div>
            
            <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
              <div className={`px-2 py-1 rounded-lg text-xs font-medium border ${styles.badge} hidden sm:block`}>
                {issue.category.charAt(0).toUpperCase() + issue.category.slice(1)}
              </div>
              {expanded ? (
                <ChevronUp className="w-4 h-4 sm:w-5 sm:h-5 text-zinc-500" />
              ) : (
                <ChevronDown className="w-4 h-4 sm:w-5 sm:h-5 text-zinc-500" />
              )}
            </div>
          </div>
          
          {/* Quick stats */}
          <div className="flex items-center flex-wrap gap-2 sm:gap-4 mt-2 sm:mt-3 text-xs">
            <span className="flex items-center gap-1 sm:gap-1.5 text-zinc-500">
              <Target className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              Impact: <span className={styles.text}>{issue.impact}/10</span>
            </span>
            <span className="flex items-center gap-1 sm:gap-1.5 text-zinc-500">
              <Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              Effort: <span className={effortColors[issue.effort]}>{issue.effort}</span>
            </span>
            <span className="hidden sm:flex items-center gap-1.5 text-zinc-500">
              <TrendingUp className="w-3.5 h-3.5" />
              {issue.potentialGain}
            </span>
          </div>
        </div>
      </button>
      
      {/* Expanded content */}
      {expanded && (
        <div className="px-3 sm:px-5 pb-3 sm:pb-5 space-y-4 sm:space-y-5 border-t border-zinc-800/50">
          {/* Recommendation */}
          <div className="mt-4 sm:mt-5 p-3 sm:p-4 bg-zinc-900/50 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Lightbulb className="w-4 h-4 text-amber-400" />
              <span className="text-sm font-medium text-white">Recommendation</span>
            </div>
            <p className="text-xs sm:text-sm text-zinc-400">{issue.recommendation}</p>
          </div>
          
          {/* How to fix */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Wrench className="w-4 h-4 text-cyan-400" />
              <span className="text-sm font-medium text-white">How to Fix</span>
            </div>
            <ul className="space-y-2">
              {issue.howToFix.map((step, index) => (
                <li key={index} className="flex items-start gap-2 sm:gap-3 text-xs sm:text-sm">
                  <span className="flex-shrink-0 w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center text-xs font-medium">
                    {index + 1}
                  </span>
                  <span className="text-zinc-400">{step}</span>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Meta info */}
          <div className="grid grid-cols-3 gap-2 sm:gap-4 pt-3 sm:pt-4 border-t border-zinc-800/50">
            <div className="p-2 sm:p-3 bg-zinc-900/30 rounded-lg">
              <span className="text-xs text-zinc-500 block mb-1">Est. Time</span>
              <span className="text-xs sm:text-sm text-white font-medium">{issue.estimatedTime}</span>
            </div>
            <div className="p-2 sm:p-3 bg-zinc-900/30 rounded-lg">
              <span className="text-xs text-zinc-500 block mb-1">Gain</span>
              <span className="text-xs sm:text-sm text-emerald-400 font-medium truncate block">{issue.potentialGain}</span>
            </div>
            <div className="p-2 sm:p-3 bg-zinc-900/30 rounded-lg">
              <span className="text-xs text-zinc-500 block mb-1">Priority</span>
              <span className="text-xs sm:text-sm text-white font-medium">#{issue.priority}</span>
            </div>
          </div>
          
          {/* Resources */}
          {issue.resources && issue.resources.length > 0 && (
            <div>
              <span className="text-xs text-zinc-500 block mb-2">Learn More</span>
              <div className="flex flex-wrap gap-2">
                {issue.resources.map((resource, index) => (
                  <a
                    key={index}
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-xs text-zinc-300 transition-colors"
                  >
                    <ExternalLink className="w-3 h-3" />
                    <span className="truncate max-w-[120px] sm:max-w-none">{resource.title}</span>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Issue List Component
interface IssueListProps {
  issues: ActionItem[];
  maxVisible?: number;
  showFilters?: boolean;
}

export function IssueList({ issues, maxVisible, showFilters = true }: IssueListProps) {
  const [filter, setFilter] = useState<'all' | 'critical' | 'high' | 'medium' | 'low'>('all');
  const [showAll, setShowAll] = useState(false);
  
  const filteredIssues = filter === 'all' 
    ? issues 
    : issues.filter(i => i.category === filter);
  
  const displayedIssues = maxVisible && !showAll 
    ? filteredIssues.slice(0, maxVisible) 
    : filteredIssues;
  
  const counts = {
    all: issues.length,
    critical: issues.filter(i => i.category === 'critical').length,
    high: issues.filter(i => i.category === 'high').length,
    medium: issues.filter(i => i.category === 'medium').length,
    low: issues.filter(i => i.category === 'low').length,
  };
  
  return (
    <div className="space-y-4">
      {showFilters && (
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {(['all', 'critical', 'high', 'medium', 'low'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                filter === f 
                  ? 'bg-coral text-white' 
                  : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)} ({counts[f]})
            </button>
          ))}
        </div>
      )}
      
      <div className="space-y-3">
        {displayedIssues.map((issue) => (
          <IssueCard key={issue.id} issue={issue} />
        ))}
      </div>
      
      {maxVisible && filteredIssues.length > maxVisible && !showAll && (
        <button
          onClick={() => setShowAll(true)}
          className="w-full py-3 bg-zinc-800 hover:bg-zinc-700 rounded-xl text-sm text-zinc-400 transition-colors"
        >
          Show {filteredIssues.length - maxVisible} more issues
        </button>
      )}
    </div>
  );
}
