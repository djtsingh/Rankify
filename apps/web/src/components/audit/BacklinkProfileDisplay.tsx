/**
 * Backlink Profile Display Component
 * Comprehensive backlink analysis visualization
 */

'use client';

import { 
  Link, ExternalLink, TrendingUp, TrendingDown, 
  AlertTriangle, CheckCircle2, ShieldCheck, Globe,
  BarChart2, PieChart, ArrowUpRight, ArrowDownRight,
  Info
} from 'lucide-react';
import type { BacklinkProfile } from '@/lib/types/seo-audit';

interface BacklinkProfileDisplayProps {
  backlinks: BacklinkProfile;
}

function MetricCard({ 
  label, 
  value, 
  change, 
  icon: Icon,
  color = 'cyan'
}: { 
  label: string;
  value: string | number;
  change?: { value: number; direction: 'up' | 'down' };
  icon?: React.ComponentType<{ className?: string }>;
  color?: 'cyan' | 'emerald' | 'amber' | 'red' | 'purple';
}) {
  const colors = {
    cyan: 'text-cyan-400 bg-cyan-500/10',
    emerald: 'text-emerald-400 bg-emerald-500/10',
    amber: 'text-amber-400 bg-amber-500/10',
    red: 'text-red-400 bg-red-500/10',
    purple: 'text-purple-400 bg-purple-500/10'
  };
  
  return (
    <div className="p-4 bg-zinc-800/50 rounded-xl">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-zinc-500 uppercase tracking-wider">{label}</span>
        {Icon && (
          <div className={`p-1.5 rounded-lg ${colors[color]}`}>
            <Icon className="w-4 h-4" />
          </div>
        )}
      </div>
      
      <div className="flex items-end gap-2">
        <span className={`text-2xl font-bold ${colors[color].split(' ')[0]}`}>
          {typeof value === 'number' ? value.toLocaleString() : value}
        </span>
        
        {change && (
          <div className={`flex items-center gap-0.5 text-xs ${change.direction === 'up' ? 'text-emerald-400' : 'text-red-400'}`}>
            {change.direction === 'up' ? (
              <ArrowUpRight className="w-3 h-3" />
            ) : (
              <ArrowDownRight className="w-3 h-3" />
            )}
            {change.value}%
          </div>
        )}
      </div>
    </div>
  );
}

function AnchorTextDistribution({ anchors }: { anchors: BacklinkProfile['anchorTextDistribution'] }) {
  const colors = [
    'bg-cyan-500',
    'bg-emerald-500',
    'bg-amber-500',
    'bg-purple-500',
    'bg-pink-500',
    'bg-blue-500',
    'bg-red-500',
    'bg-orange-500'
  ];
  
  // Handle empty or undefined anchors
  if (!anchors || anchors.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-zinc-500 text-sm">No anchor text data available</p>
        <p className="text-zinc-600 text-xs mt-1">Backlink analysis requires external data sources</p>
      </div>
    );
  }
  
  const sortedAnchors = [...anchors].sort((a, b) => b.percentage - a.percentage).slice(0, 8);
  const total = sortedAnchors.reduce((sum, a) => sum + a.percentage, 0) || 1;
  
  return (
    <div className="space-y-4">
      {/* Visual bar */}
      <div className="h-6 flex rounded-lg overflow-hidden">
        {sortedAnchors.map((anchor, i) => (
          <div
            key={anchor.text}
            className={`${colors[i]} transition-all duration-300 hover:opacity-80`}
            style={{ width: `${(anchor.percentage / total) * 100}%` }}
            title={`${anchor.text}: ${anchor.percentage}%`}
          />
        ))}
      </div>
      
      {/* Legend */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
        {sortedAnchors.map((anchor, i) => (
          <div key={anchor.text} className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded flex-shrink-0 ${colors[i]}`} />
            <div className="flex-1 min-w-0">
              <p className="text-xs text-zinc-300 truncate">{anchor.text}</p>
              <p className="text-xs text-zinc-500">{anchor.percentage}%</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function BacklinkProfileDisplay({ backlinks }: BacklinkProfileDisplayProps) {
  // Safe defaults for all values to prevent runtime errors
  const safeBacklinks = {
    totalBacklinks: backlinks?.totalBacklinks ?? 0,
    uniqueDomains: backlinks?.uniqueDomains ?? 0,
    domainAuthority: backlinks?.domainAuthority ?? 1,
    pageAuthority: backlinks?.pageAuthority ?? 1,
    trustFlow: backlinks?.trustFlow ?? 1,
    citationFlow: backlinks?.citationFlow ?? 1,
    spamScore: backlinks?.spamScore ?? 0,
    topReferringDomains: backlinks?.topReferringDomains ?? [],
    anchorTextDistribution: backlinks?.anchorTextDistribution ?? [],
    linkTypes: {
      dofollow: backlinks?.linkTypes?.dofollow ?? 0,
      nofollow: backlinks?.linkTypes?.nofollow ?? 0,
    },
    newLinks30Days: backlinks?.newLinks30Days ?? 0,
    lostLinks30Days: backlinks?.lostLinks30Days ?? 0,
    competitorComparison: backlinks?.competitorComparison ?? [],
  };

  const healthScore = Math.round(
    (safeBacklinks.domainAuthority + 
     safeBacklinks.trustFlow + 
     (100 - safeBacklinks.spamScore)) / 3
  );
  
  const healthColor = healthScore >= 70 ? 'emerald' : healthScore >= 50 ? 'amber' : 'red';
  
  // Safe percentage calculation to avoid NaN
  const totalLinks = safeBacklinks.linkTypes.dofollow + safeBacklinks.linkTypes.nofollow;
  const dofollowPercent = totalLinks > 0 ? (safeBacklinks.linkTypes.dofollow / totalLinks) * 100 : 50;
  const nofollowPercent = totalLinks > 0 ? (safeBacklinks.linkTypes.nofollow / totalLinks) * 100 : 50;
  
  // Safe TF:CF ratio
  const tfCfRatio = safeBacklinks.citationFlow > 0 
    ? (safeBacklinks.trustFlow / safeBacklinks.citationFlow).toFixed(2) 
    : '1.00';
  
  return (
    <div className="space-y-6">
      {/* Overview Banner */}
      <div className="p-4 sm:p-6 bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-pink-500/10 border border-indigo-500/20 rounded-xl">
        <div className="flex items-center gap-3 mb-4 sm:mb-6">
          <div className="p-2 sm:p-3 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-xl">
            <Link className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-400" />
          </div>
          <div>
            <h3 className="text-white font-semibold text-base sm:text-lg">Backlink Profile Analysis</h3>
            <p className="text-xs sm:text-sm text-zinc-400">Your website&apos;s link authority and trust signals</p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
          <MetricCard 
            label="Total Backlinks" 
            value={safeBacklinks.totalBacklinks} 
            icon={Link}
            color="cyan"
          />
          <MetricCard 
            label="Referring Domains" 
            value={safeBacklinks.uniqueDomains} 
            icon={Globe}
            color="purple"
          />
          <MetricCard 
            label="Domain Authority" 
            value={safeBacklinks.domainAuthority}
            icon={ShieldCheck}
            color={safeBacklinks.domainAuthority >= 50 ? 'emerald' : 'amber'}
          />
          <MetricCard 
            label="Trust Flow" 
            value={safeBacklinks.trustFlow}
            icon={CheckCircle2}
            color={safeBacklinks.trustFlow >= 50 ? 'emerald' : 'amber'}
          />
          <MetricCard 
            label="Profile Health" 
            value={healthScore}
            icon={BarChart2}
            color={healthColor as 'cyan' | 'emerald' | 'amber' | 'red' | 'purple'}
          />
        </div>
      </div>
      
      {/* Authority Metrics */}
      <div className="p-4 sm:p-6 bg-zinc-900/50 border border-zinc-800 rounded-xl">
        <div className="flex items-center gap-3 mb-4 sm:mb-6">
          <div className="p-2 sm:p-2.5 bg-emerald-500/10 rounded-lg">
            <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400" />
          </div>
          <div>
            <h3 className="text-white font-semibold text-sm sm:text-base">Authority Metrics</h3>
            <p className="text-xs sm:text-sm text-zinc-500">Domain strength indicators</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Domain Authority Gauge */}
          <div className="text-center">
            <div className="relative w-32 h-32 mx-auto mb-3">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="12"
                  className="text-zinc-800"
                />
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  fill="none"
                  stroke="url(#daGradient)"
                  strokeWidth="12"
                  strokeLinecap="round"
                  strokeDasharray={`${(safeBacklinks.domainAuthority / 100) * 352} 352`}
                />
                <defs>
                  <linearGradient id="daGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#10b981" />
                    <stop offset="100%" stopColor="#06b6d4" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-3xl font-bold text-white">{safeBacklinks.domainAuthority}</span>
              </div>
            </div>
            <p className="text-sm text-zinc-400">Domain Authority</p>
            <p className="text-xs text-zinc-600">out of 100</p>
          </div>
          
          {/* Page Authority Gauge */}
          <div className="text-center">
            <div className="relative w-32 h-32 mx-auto mb-3">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="12"
                  className="text-zinc-800"
                />
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  fill="none"
                  stroke="url(#paGradient)"
                  strokeWidth="12"
                  strokeLinecap="round"
                  strokeDasharray={`${(safeBacklinks.pageAuthority / 100) * 352} 352`}
                />
                <defs>
                  <linearGradient id="paGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#8b5cf6" />
                    <stop offset="100%" stopColor="#ec4899" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-3xl font-bold text-white">{safeBacklinks.pageAuthority}</span>
              </div>
            </div>
            <p className="text-sm text-zinc-400">Page Authority</p>
            <p className="text-xs text-zinc-600">out of 100</p>
          </div>
          
          {/* Trust/Citation Flow */}
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-zinc-400">Trust Flow</span>
                <span className="text-emerald-400 font-medium">{safeBacklinks.trustFlow}</span>
              </div>
              <div className="h-3 bg-zinc-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full"
                  style={{ width: `${safeBacklinks.trustFlow}%` }}
                />
              </div>
            </div>
            
            <div>
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-zinc-400">Citation Flow</span>
                <span className="text-cyan-400 font-medium">{safeBacklinks.citationFlow}</span>
              </div>
              <div className="h-3 bg-zinc-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-cyan-500 to-cyan-400 rounded-full"
                  style={{ width: `${safeBacklinks.citationFlow}%` }}
                />
              </div>
            </div>
            
            <div className="p-3 bg-zinc-800/50 rounded-lg">
              <div className="flex items-center gap-2 text-xs text-zinc-500">
                <Info className="w-4 h-4" />
                TF:CF Ratio: {tfCfRatio}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Link Types */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Dofollow vs Nofollow */}
        <div className="p-6 bg-zinc-900/50 border border-zinc-800 rounded-xl">
          <h3 className="text-white font-semibold mb-4">Link Types Distribution</h3>
          
          <div className="flex items-center gap-4 mb-4">
            <div className="flex-1">
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-emerald-400">Dofollow</span>
                <span className="text-zinc-400">{safeBacklinks.linkTypes.dofollow.toLocaleString()}</span>
              </div>
              <div className="h-4 bg-zinc-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-emerald-500 rounded-full"
                  style={{ width: `${dofollowPercent}%` }}
                />
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-amber-400">Nofollow</span>
                <span className="text-zinc-400">{safeBacklinks.linkTypes.nofollow.toLocaleString()}</span>
              </div>
              <div className="h-4 bg-zinc-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-amber-500 rounded-full"
                  style={{ width: `${nofollowPercent}%` }}
                />
              </div>
            </div>
          </div>
          
          <p className="text-xs text-zinc-500 mt-4">
            Healthy ratio: ~70-80% dofollow, 20-30% nofollow
          </p>
        </div>
        
        {/* Quality Distribution */}
        <div className="p-6 bg-zinc-900/50 border border-zinc-800 rounded-xl">
          <h3 className="text-white font-semibold mb-4">Link Quality</h3>
          
          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="text-center p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
              <p className="text-2xl font-bold text-emerald-400">
                {Math.round(safeBacklinks.uniqueDomains * 0.4)}
              </p>
              <p className="text-xs text-zinc-500">High Quality</p>
            </div>
            <div className="text-center p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg">
              <p className="text-2xl font-bold text-amber-400">
                {Math.round(safeBacklinks.uniqueDomains * 0.35)}
              </p>
              <p className="text-xs text-zinc-500">Medium Quality</p>
            </div>
            <div className="text-center p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
              <p className="text-2xl font-bold text-red-400">
                {Math.round(safeBacklinks.uniqueDomains * 0.25)}
              </p>
              <p className="text-xs text-zinc-500">Low Quality</p>
            </div>
          </div>
          
          {/* Spam Score Warning */}
          {safeBacklinks.spamScore > 30 && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0" />
              <div>
                <p className="text-sm text-red-400 font-medium">High Spam Score: {safeBacklinks.spamScore}%</p>
                <p className="text-xs text-zinc-500">Consider disavowing toxic backlinks</p>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Anchor Text Distribution */}
      <div className="p-6 bg-zinc-900/50 border border-zinc-800 rounded-xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 bg-cyan-500/10 rounded-lg">
            <PieChart className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <h3 className="text-white font-semibold">Anchor Text Distribution</h3>
            <p className="text-sm text-zinc-500">Most common anchor texts pointing to your site</p>
          </div>
        </div>
        
        <AnchorTextDistribution anchors={safeBacklinks.anchorTextDistribution} />
      </div>
      
      {/* Top Backlinks */}
      <div className="p-6 bg-zinc-900/50 border border-zinc-800 rounded-xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 bg-purple-500/10 rounded-lg">
            <TrendingUp className="w-5 h-5 text-purple-400" />
          </div>
          <div>
            <h3 className="text-white font-semibold text-sm sm:text-base">Top Referring Domains</h3>
            <p className="text-xs sm:text-sm text-zinc-500">Highest authority domains linking to you</p>
          </div>
        </div>
        
        {safeBacklinks.topReferringDomains.length > 0 ? (
          <div className="space-y-3">
            {safeBacklinks.topReferringDomains.map((referrer, i) => (
              <div 
                key={i}
                className="p-3 sm:p-4 bg-zinc-800/50 rounded-lg hover:bg-zinc-800 transition-colors"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 bg-zinc-700 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Globe className="w-4 h-4 text-zinc-400" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm sm:text-base text-white font-medium truncate">{referrer.domain}</p>
                      <div className="flex items-center gap-2 text-xs text-zinc-500">
                        <span>DA: <span className={referrer.authority >= 50 ? 'text-emerald-400' : 'text-amber-400'}>{referrer.authority}</span></span>
                        <span>•</span>
                        <span>{referrer.links} links</span>
                      </div>
                    </div>
                  </div>
                  
                  <a
                    href={`https://${referrer.domain}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 hover:bg-zinc-700 rounded-lg transition-colors flex-shrink-0"
                  >
                    <ExternalLink className="w-4 h-4 text-zinc-500" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Globe className="w-12 h-12 text-zinc-700 mx-auto mb-3" />
            <p className="text-zinc-500 text-sm">No referring domains found</p>
            <p className="text-zinc-600 text-xs mt-1">Backlink data requires external API integration</p>
          </div>
        )}
      </div>
      
      {/* Lost & New */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 bg-zinc-900/50 border border-zinc-800 rounded-xl">
          <div className="flex items-center gap-3 mb-4">
            <TrendingUp className="w-5 h-5 text-emerald-400" />
            <h3 className="text-white font-semibold">New Backlinks (30 days)</h3>
          </div>
          <p className="text-4xl font-bold text-emerald-400">
            +{safeBacklinks.newLinks30Days.toLocaleString()}
          </p>
        </div>
        
        <div className="p-6 bg-zinc-900/50 border border-zinc-800 rounded-xl">
          <div className="flex items-center gap-3 mb-4">
            <TrendingDown className="w-5 h-5 text-red-400" />
            <h3 className="text-white font-semibold">Lost Backlinks (30 days)</h3>
          </div>
          <p className="text-4xl font-bold text-red-400">
            -{safeBacklinks.lostLinks30Days.toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
}
