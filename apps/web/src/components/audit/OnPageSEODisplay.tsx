/**
 * On-Page SEO Display Component
 * Comprehensive on-page optimization analysis
 */

'use client';

import { 
  Type, FileText, Hash, AlignLeft, Search, Image, Link2,
  Globe, CheckCircle2, XCircle, AlertTriangle, Info,
  ChevronDown, ChevronUp, ExternalLink
} from 'lucide-react';
import { useState } from 'react';
import type { OnPageSEO } from '@/lib/types/seo-audit';

interface OnPageSEODisplayProps {
  onPage: OnPageSEO;
}

function MetaTagPreview({ title, description, url }: { title: string; description: string; url: string }) {
  return (
    <div className="p-4 bg-white rounded-lg">
      <div className="text-blue-700 text-lg font-medium hover:underline cursor-pointer truncate">
        {title || 'Missing Title Tag'}
      </div>
      <div className="text-green-700 text-sm truncate mt-0.5">
        {url}
      </div>
      <div className="text-sm text-gray-600 mt-1 line-clamp-2">
        {description || 'No meta description provided'}
      </div>
    </div>
  );
}

function StatusBadge({ status, size = 'md' }: { status: 'good' | 'warning' | 'error' | 'info'; size?: 'sm' | 'md' }) {
  const config = {
    good: { icon: CheckCircle2, color: 'text-emerald-400 bg-emerald-500/10' },
    warning: { icon: AlertTriangle, color: 'text-amber-400 bg-amber-500/10' },
    error: { icon: XCircle, color: 'text-red-400 bg-red-500/10' },
    info: { icon: Info, color: 'text-cyan-400 bg-cyan-500/10' }
  };
  
  const Icon = config[status].icon;
  const sizeClasses = size === 'sm' ? 'w-4 h-4' : 'w-5 h-5';
  
  return (
    <div className={`p-1.5 rounded-lg ${config[status].color}`}>
      <Icon className={sizeClasses} />
    </div>
  );
}

function ExpandableSection({ 
  title, 
  icon: Icon, 
  children, 
  defaultExpanded = true,
  badge
}: { 
  title: string; 
  icon: React.ComponentType<{ className?: string }>; 
  children: React.ReactNode;
  defaultExpanded?: boolean;
  badge?: { value: string | number; color: string };
}) {
  const [expanded, setExpanded] = useState(defaultExpanded);
  
  return (
    <div className="border border-zinc-800 rounded-xl overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full p-4 flex items-center justify-between bg-zinc-900/50 hover:bg-zinc-800/50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 bg-zinc-800 rounded-lg">
            <Icon className="w-5 h-5 text-zinc-400" />
          </div>
          <span className="text-white font-medium">{title}</span>
          {badge && (
            <span className={`px-2 py-0.5 text-xs rounded-full ${badge.color}`}>
              {badge.value}
            </span>
          )}
        </div>
        {expanded ? (
          <ChevronUp className="w-5 h-5 text-zinc-500" />
        ) : (
          <ChevronDown className="w-5 h-5 text-zinc-500" />
        )}
      </button>
      {expanded && (
        <div className="p-4 bg-zinc-900/30 border-t border-zinc-800">
          {children}
        </div>
      )}
    </div>
  );
}

export function OnPageSEODisplay({ onPage }: OnPageSEODisplayProps) {
  const titleStatus = onPage.title.optimal && onPage.title.length >= 30 && onPage.title.length <= 60 ? 'good' : 
                      onPage.title.length > 0 ? 'warning' : 'error';
                      
  const metaStatus = onPage.metaDescription.optimal && onPage.metaDescription.length >= 120 && onPage.metaDescription.length <= 160 ? 'good' :
                     onPage.metaDescription.length > 0 ? 'warning' : 'error';
  
  return (
    <div className="space-y-6">
      {/* SERP Preview */}
      <div className="p-6 bg-zinc-900/50 border border-zinc-800 rounded-xl">
        <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
          <Search className="w-5 h-5 text-cyan-400" />
          Google Search Preview
        </h3>
        <MetaTagPreview 
          title={onPage.title.content}
          description={onPage.metaDescription.content}
          url={onPage.urls.current}
        />
        <p className="text-xs text-zinc-500 mt-3">
          This is how your page may appear in Google search results
        </p>
      </div>
      
      {/* Title Tag Analysis */}
      <ExpandableSection 
        title="Title Tag" 
        icon={Type}
        badge={{ 
          value: `${onPage.title.length} chars`, 
          color: titleStatus === 'good' ? 'bg-emerald-500/20 text-emerald-400' : 
                 titleStatus === 'warning' ? 'bg-amber-500/20 text-amber-400' : 'bg-red-500/20 text-red-400'
        }}
      >
        <div className="space-y-4">
          <div className="p-4 bg-zinc-800/50 rounded-lg">
            <p className="text-zinc-300 break-words">{onPage.title.content || <span className="text-red-400">No title tag found</span>}</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="p-3 bg-zinc-800/30 rounded-lg">
              <p className="text-xs text-zinc-500 mb-1">Length</p>
              <p className={`font-semibold ${onPage.title.length >= 30 && onPage.title.length <= 60 ? 'text-emerald-400' : 'text-amber-400'}`}>
                {onPage.title.length} / 60
              </p>
            </div>
            <div className="p-3 bg-zinc-800/30 rounded-lg">
              <p className="text-xs text-zinc-500 mb-1">Has Keyword</p>
              <p className={`font-semibold ${onPage.title.keywordPresent ? 'text-emerald-400' : 'text-red-400'}`}>
                {onPage.title.keywordPresent ? 'Yes' : 'No'}
              </p>
            </div>
            <div className="p-3 bg-zinc-800/30 rounded-lg">
              <p className="text-xs text-zinc-500 mb-1">Unique</p>
              <p className={`font-semibold ${onPage.title.uniqueOnSite ? 'text-emerald-400' : 'text-amber-400'}`}>
                {onPage.title.uniqueOnSite ? 'Yes' : 'Duplicate'}
              </p>
            </div>
            <div className="p-3 bg-zinc-800/30 rounded-lg">
              <p className="text-xs text-zinc-500 mb-1">Optimized</p>
              <p className={`font-semibold ${onPage.title.optimal ? 'text-emerald-400' : 'text-amber-400'}`}>
                {onPage.title.optimal ? 'Yes' : 'No'}
              </p>
            </div>
          </div>
        </div>
      </ExpandableSection>
      
      {/* Meta Description Analysis */}
      <ExpandableSection 
        title="Meta Description" 
        icon={FileText}
        badge={{ 
          value: `${onPage.metaDescription.length} chars`, 
          color: metaStatus === 'good' ? 'bg-emerald-500/20 text-emerald-400' : 
                 metaStatus === 'warning' ? 'bg-amber-500/20 text-amber-400' : 'bg-red-500/20 text-red-400'
        }}
      >
        <div className="space-y-4">
          <div className="p-4 bg-zinc-800/50 rounded-lg">
            <p className="text-zinc-300 break-words">{onPage.metaDescription.content || <span className="text-red-400">No meta description found</span>}</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="p-3 bg-zinc-800/30 rounded-lg">
              <p className="text-xs text-zinc-500 mb-1">Length</p>
              <p className={`font-semibold ${onPage.metaDescription.length >= 120 && onPage.metaDescription.length <= 160 ? 'text-emerald-400' : 'text-amber-400'}`}>
                {onPage.metaDescription.length} / 160
              </p>
            </div>
            <div className="p-3 bg-zinc-800/30 rounded-lg">
              <p className="text-xs text-zinc-500 mb-1">Has Keyword</p>
              <p className={`font-semibold ${onPage.metaDescription.keywordPresent ? 'text-emerald-400' : 'text-red-400'}`}>
                {onPage.metaDescription.keywordPresent ? 'Yes' : 'No'}
              </p>
            </div>
            <div className="p-3 bg-zinc-800/30 rounded-lg">
              <p className="text-xs text-zinc-500 mb-1">Unique</p>
              <p className={`font-semibold ${onPage.metaDescription.uniqueOnSite ? 'text-emerald-400' : 'text-amber-400'}`}>
                {onPage.metaDescription.uniqueOnSite ? 'Yes' : 'Duplicate'}
              </p>
            </div>
            <div className="p-3 bg-zinc-800/30 rounded-lg">
              <p className="text-xs text-zinc-500 mb-1">Call to Action</p>
              <p className={`font-semibold ${onPage.metaDescription.callToAction ? 'text-emerald-400' : 'text-amber-400'}`}>
                {onPage.metaDescription.callToAction ? 'Yes' : 'No'}
              </p>
            </div>
          </div>
        </div>
      </ExpandableSection>
      
      {/* Heading Structure */}
      <ExpandableSection 
        title="Heading Structure" 
        icon={Hash}
        badge={{ 
          value: `${onPage.headings.h1.count} H1, ${onPage.headings.h2.count} H2`, 
          color: onPage.headings.h1.count === 1 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
        }}
      >
        <div className="space-y-4">
          {/* Heading Hierarchy */}
          <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
            {(['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] as const).map((tag) => {
              const headingData = onPage.headings[tag];
              const count = headingData.count;
              const isH1Good = tag === 'h1' && count === 1;
              const hasIssue = tag === 'h1' && count !== 1;
              
              return (
                <div key={tag} className="p-3 bg-zinc-800/30 rounded-lg text-center">
                  <p className="text-xs text-zinc-500 uppercase">{tag}</p>
                  <p className={`text-xl font-bold ${isH1Good ? 'text-emerald-400' : hasIssue ? 'text-amber-400' : 'text-zinc-300'}`}>
                    {count}
                  </p>
                </div>
              );
            })}
          </div>
          
          {/* Heading List */}
          <div className="space-y-2">
            <h4 className="text-sm text-zinc-500">H1 Tags</h4>
            <div className="space-y-1 max-h-60 overflow-y-auto">
              {onPage.headings.h1.content.map((content, i) => (
                <div 
                  key={i}
                  className="flex items-start gap-3 p-2 bg-zinc-800/30 rounded"
                >
                  <span className="text-xs font-mono text-cyan-400 flex-shrink-0 w-6">
                    H1
                  </span>
                  <span className="text-sm text-zinc-300 break-words">{content}</span>
                </div>
              ))}
              {onPage.headings.h2.content.slice(0, 5).map((content, i) => (
                <div 
                  key={`h2-${i}`}
                  className="flex items-start gap-3 p-2 bg-zinc-800/30 rounded"
                  style={{ paddingLeft: '20px' }}
                >
                  <span className="text-xs font-mono text-purple-400 flex-shrink-0 w-6">
                    H2
                  </span>
                  <span className="text-sm text-zinc-300 break-words">{content}</span>
                </div>
              ))}
            </div>
            {onPage.headings.hierarchy.issues.length > 0 && (
              <div className="mt-3 p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                <p className="text-sm text-amber-400 font-medium mb-2">Hierarchy Issues</p>
                <ul className="space-y-1">
                  {onPage.headings.hierarchy.issues.map((issue, i) => (
                    <li key={i} className="text-xs text-zinc-400 flex items-start gap-2">
                      <AlertTriangle className="w-3 h-3 text-amber-400 mt-0.5 flex-shrink-0" />
                      {issue}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </ExpandableSection>
      
      {/* Content Analysis */}
      <ExpandableSection 
        title="Content Analysis" 
        icon={AlignLeft}
        badge={{ 
          value: `${onPage.content.wordCount} words`, 
          color: onPage.content.wordCount >= 300 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
        }}
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 bg-zinc-800/30 rounded-lg">
            <p className="text-xs text-zinc-500 mb-2">Word Count</p>
            <p className={`text-2xl font-bold ${onPage.content.wordCount >= 300 ? 'text-emerald-400' : 'text-amber-400'}`}>
              {onPage.content.wordCount.toLocaleString()}
            </p>
            <p className="text-xs text-zinc-500 mt-1">Recommended: 300+</p>
          </div>
          
          <div className="p-4 bg-zinc-800/30 rounded-lg">
            <p className="text-xs text-zinc-500 mb-2">Readability</p>
            <p className={`text-2xl font-bold ${onPage.content.readabilityScore >= 60 ? 'text-emerald-400' : 'text-amber-400'}`}>
              {onPage.content.readabilityScore}
            </p>
            <p className="text-xs text-zinc-500 mt-1">Flesch Score</p>
          </div>
          
          <div className="p-4 bg-zinc-800/30 rounded-lg">
            <p className="text-xs text-zinc-500 mb-2">Avg. Sentence</p>
            <p className="text-2xl font-bold text-cyan-400">
              {onPage.content.avgWordsPerSentence}
            </p>
            <p className="text-xs text-zinc-500 mt-1">words per sentence</p>
          </div>
          
          <div className="p-4 bg-zinc-800/30 rounded-lg">
            <p className="text-xs text-zinc-500 mb-2">Paragraphs</p>
            <p className="text-2xl font-bold text-cyan-400">
              {onPage.content.paragraphCount}
            </p>
            <p className="text-xs text-zinc-500 mt-1">total</p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div className="p-3 bg-zinc-800/30 rounded-lg flex items-center justify-between">
            <span className="text-sm text-zinc-400">Content Depth</span>
            <span className={`text-sm font-medium capitalize ${onPage.content.contentDepth === 'comprehensive' || onPage.content.contentDepth === 'expert' ? 'text-emerald-400' : 'text-amber-400'}`}>
              {onPage.content.contentDepth}
            </span>
          </div>
          <div className="p-3 bg-zinc-800/30 rounded-lg flex items-center justify-between">
            <span className="text-sm text-zinc-400">Grade Level</span>
            <span className="text-sm font-medium text-cyan-400">
              {onPage.content.readabilityGrade}
            </span>
          </div>
        </div>
      </ExpandableSection>
      
      {/* Keyword Analysis */}
      <ExpandableSection 
        title="Keyword Analysis" 
        icon={Search}
        badge={{ 
          value: `${onPage.keywords.primary.keyword}`, 
          color: 'bg-cyan-500/20 text-cyan-400'
        }}
      >
        <div className="space-y-6">
          {/* Primary Keyword */}
          <div className="p-4 bg-gradient-to-br from-cyan-500/10 to-purple-500/10 border border-cyan-500/20 rounded-lg">
            <h4 className="text-sm text-zinc-500 mb-3">Primary Keyword</h4>
            <div className="flex items-center justify-between">
              <span className="text-lg font-semibold text-cyan-400">{onPage.keywords.primary.keyword}</span>
              <span className="text-sm text-zinc-400">Density: {onPage.keywords.primary.density.toFixed(2)}%</span>
            </div>
            <div className="grid grid-cols-3 gap-3 mt-3">
              <div className="text-center">
                <p className="text-xs text-zinc-500">In Title</p>
                <StatusBadge status={onPage.keywords.primary.inTitle ? 'good' : 'warning'} size="sm" />
              </div>
              <div className="text-center">
                <p className="text-xs text-zinc-500">In H1</p>
                <StatusBadge status={onPage.keywords.primary.inH1 ? 'good' : 'warning'} size="sm" />
              </div>
              <div className="text-center">
                <p className="text-xs text-zinc-500">In Meta</p>
                <StatusBadge status={onPage.keywords.primary.inMeta ? 'good' : 'warning'} size="sm" />
              </div>
            </div>
          </div>
          
          {/* LSI Keywords */}
          <div>
            <h4 className="text-sm text-zinc-500 mb-3">LSI Keywords</h4>
            <div className="flex flex-wrap gap-2">
              {onPage.keywords.lsiKeywords.map((kw, i) => (
                <span key={i} className="px-3 py-1.5 bg-zinc-800 text-zinc-300 text-sm rounded-lg">
                  {kw}
                </span>
              ))}
            </div>
          </div>
        </div>
      </ExpandableSection>
      
      {/* Images */}
      <ExpandableSection 
        title="Image Optimization" 
        icon={Image}
        badge={{ 
          value: `${onPage.images.total} images`, 
          color: onPage.images.withAlt === onPage.images.total ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
        }}
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 bg-zinc-800/30 rounded-lg text-center">
            <p className="text-2xl font-bold text-cyan-400">{onPage.images.total}</p>
            <p className="text-xs text-zinc-500 mt-1">Total Images</p>
          </div>
          
          <div className="p-4 bg-zinc-800/30 rounded-lg text-center">
            <p className={`text-2xl font-bold ${onPage.images.withAlt === onPage.images.total ? 'text-emerald-400' : 'text-amber-400'}`}>
              {onPage.images.withAlt}
            </p>
            <p className="text-xs text-zinc-500 mt-1">With Alt Text</p>
          </div>
          
          <div className="p-4 bg-zinc-800/30 rounded-lg text-center">
            <p className="text-2xl font-bold text-cyan-400">{onPage.images.optimized}</p>
            <p className="text-xs text-zinc-500 mt-1">Optimized</p>
          </div>
          
          <div className="p-4 bg-zinc-800/30 rounded-lg text-center">
            <p className="text-2xl font-bold text-cyan-400">{onPage.images.lazyLoaded}</p>
            <p className="text-xs text-zinc-500 mt-1">Lazy Loaded</p>
          </div>
        </div>
        
        {/* Missing Alt */}
        {onPage.images.withAlt < onPage.images.total && (
          <div className="mt-4 p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg">
            <div className="flex items-center gap-2 text-amber-400 mb-2">
              <AlertTriangle className="w-4 h-4" />
              <span className="font-medium">{onPage.images.total - onPage.images.withAlt} images missing alt text</span>
            </div>
            <p className="text-sm text-zinc-400">
              Alt text is important for accessibility and SEO. Add descriptive alt attributes to all images.
            </p>
          </div>
        )}
      </ExpandableSection>
      
      {/* Links */}
      <ExpandableSection 
        title="Link Analysis" 
        icon={Link2}
        badge={{ 
          value: `${onPage.links.internal.count + onPage.links.external.count} links`, 
          color: 'bg-cyan-500/20 text-cyan-400'
        }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Internal Links */}
          <div className="p-4 bg-zinc-800/30 rounded-lg">
            <h4 className="text-sm text-zinc-500 mb-4">Internal Links</h4>
            <div className="grid grid-cols-2 gap-3">
              <div className="text-center p-3 bg-zinc-800/50 rounded-lg">
                <p className="text-xl font-bold text-cyan-400">{onPage.links.internal.count}</p>
                <p className="text-xs text-zinc-500">Total</p>
              </div>
              <div className="text-center p-3 bg-zinc-800/50 rounded-lg">
                <p className="text-xl font-bold text-cyan-400">{onPage.links.internal.unique}</p>
                <p className="text-xs text-zinc-500">Unique</p>
              </div>
            </div>
          </div>
          
          {/* External Links */}
          <div className="p-4 bg-zinc-800/30 rounded-lg">
            <h4 className="text-sm text-zinc-500 mb-4">External Links</h4>
            <div className="grid grid-cols-3 gap-3">
              <div className="text-center p-3 bg-zinc-800/50 rounded-lg">
                <p className="text-xl font-bold text-cyan-400">{onPage.links.external.count}</p>
                <p className="text-xs text-zinc-500">Total</p>
              </div>
              <div className="text-center p-3 bg-zinc-800/50 rounded-lg">
                <p className="text-xl font-bold text-emerald-400">{onPage.links.external.unique}</p>
                <p className="text-xs text-zinc-500">Unique</p>
              </div>
              <div className="text-center p-3 bg-zinc-800/50 rounded-lg">
                <p className="text-xl font-bold text-amber-400">{onPage.links.external.nofollow}</p>
                <p className="text-xs text-zinc-500">Nofollow</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Broken Links */}
        {onPage.links.internal.broken > 0 && (
          <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
            <div className="flex items-center gap-2 text-red-400 mb-3">
              <XCircle className="w-4 h-4" />
              <span className="font-medium">{onPage.links.internal.broken} Broken Internal Links Found</span>
            </div>
            <p className="text-sm text-zinc-400">
              Broken links negatively impact user experience and crawlability. Review and fix broken internal links.
            </p>
          </div>
        )}
      </ExpandableSection>
      
      {/* URL Analysis */}
      <ExpandableSection 
        title="URL Structure" 
        icon={Globe}
        badge={{ 
          value: onPage.urls.optimal ? 'SEO Friendly' : 'Needs Work', 
          color: onPage.urls.optimal ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
        }}
      >
        <div className="space-y-4">
          <div className="p-4 bg-zinc-800/50 rounded-lg">
            <p className="text-sm text-zinc-500 mb-1">Current URL</p>
            <p className="text-cyan-400 break-all">{onPage.urls.current}</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="p-3 bg-zinc-800/30 rounded-lg flex items-center justify-between">
              <span className="text-sm text-zinc-400">Length</span>
              <span className={`font-medium ${onPage.urls.length <= 75 ? 'text-emerald-400' : 'text-amber-400'}`}>
                {onPage.urls.length}
              </span>
            </div>
            <div className="p-3 bg-zinc-800/30 rounded-lg flex items-center justify-between">
              <span className="text-sm text-zinc-400">Depth</span>
              <span className={`font-medium ${onPage.urls.depth <= 3 ? 'text-emerald-400' : 'text-amber-400'}`}>
                {onPage.urls.depth}
              </span>
            </div>
            <div className="p-3 bg-zinc-800/30 rounded-lg flex items-center justify-between">
              <span className="text-sm text-zinc-400">Has Keyword</span>
              <StatusBadge status={onPage.urls.hasKeyword ? 'good' : 'warning'} size="sm" />
            </div>
            <div className="p-3 bg-zinc-800/30 rounded-lg flex items-center justify-between">
              <span className="text-sm text-zinc-400">Lowercase</span>
              <StatusBadge status={onPage.urls.lowercase ? 'good' : 'warning'} size="sm" />
            </div>
          </div>
        </div>
      </ExpandableSection>
    </div>
  );
}
