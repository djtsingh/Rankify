/**
 * User Experience Display Component
 * Accessibility and UX metrics visualization
 */

'use client';

import { 
  Accessibility, Navigation, Users, Smartphone,
  CheckCircle2, XCircle, AlertTriangle, Info,
  Eye, MousePointer, Keyboard, Volume2, Clock
} from 'lucide-react';
import type { UserExperience } from '@/lib/types/seo-audit';

interface UserExperienceDisplayProps {
  ux: UserExperience;
}

function WCAGBadge({ level }: { level: 'A' | 'AA' | 'AAA' | 'none' | 'None' }) {
  const normalizedLevel = level === 'none' ? 'None' : level;
  const colors = {
    'AAA': 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    'AA': 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
    'A': 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    'None': 'bg-red-500/20 text-red-400 border-red-500/30'
  };
  
  return (
    <span className={`px-3 py-1 text-sm font-semibold rounded-lg border ${colors[normalizedLevel]}`}>
      WCAG {normalizedLevel}
    </span>
  );
}

export function UserExperienceDisplay({ ux }: UserExperienceDisplayProps) {
  const accessibilityScore = ux.accessibility.score;
  const scoreColor = accessibilityScore >= 90 ? 'text-emerald-400' : 
                     accessibilityScore >= 70 ? 'text-cyan-400' :
                     accessibilityScore >= 50 ? 'text-amber-400' : 'text-red-400';
  
  return (
    <div className="space-y-6">
      {/* Overview Banner */}
      <div className="p-6 bg-gradient-to-br from-violet-500/10 via-purple-500/10 to-fuchsia-500/10 border border-violet-500/20 rounded-xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-gradient-to-br from-violet-500/20 to-purple-500/20 rounded-xl">
            <Users className="w-6 h-6 text-violet-400" />
          </div>
          <div>
            <h3 className="text-white font-semibold text-lg">User Experience Analysis</h3>
            <p className="text-sm text-zinc-400">Accessibility, navigation, and engagement metrics</p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div className="p-3 sm:p-4 bg-zinc-900/50 rounded-lg text-center">
            <p className={`text-2xl sm:text-3xl font-bold ${scoreColor}`}>{accessibilityScore}</p>
            <p className="text-xs text-zinc-500 mt-1">Accessibility Score</p>
          </div>
          
          <div className="p-3 sm:p-4 bg-zinc-900/50 rounded-lg text-center">
            <WCAGBadge level={ux.accessibility.wcagLevel} />
            <p className="text-xs text-zinc-500 mt-2">Compliance Level</p>
          </div>
          
          <div className="p-3 sm:p-4 bg-zinc-900/50 rounded-lg text-center">
            <p className="text-2xl sm:text-3xl font-bold text-cyan-400">{ux.engagement.bounceRate}%</p>
            <p className="text-xs text-zinc-500 mt-1">Bounce Rate</p>
          </div>
          
          <div className="p-3 sm:p-4 bg-zinc-900/50 rounded-lg text-center">
            <p className="text-2xl sm:text-3xl font-bold text-purple-400">{ux.engagement.avgTimeOnPage}s</p>
            <p className="text-xs text-zinc-500 mt-1">Avg. Time on Page</p>
          </div>
        </div>
      </div>
      
      {/* Accessibility Details */}
      <div className="p-4 sm:p-6 bg-zinc-900/50 border border-zinc-800 rounded-xl">
        <div className="flex items-center gap-3 mb-4 sm:mb-6">
          <div className="p-2 sm:p-2.5 bg-violet-500/10 rounded-lg">
            <Accessibility className="w-4 h-4 sm:w-5 sm:h-5 text-violet-400" />
          </div>
          <div>
            <h3 className="text-white font-semibold text-sm sm:text-base">Accessibility Audit</h3>
            <p className="text-xs sm:text-sm text-zinc-500">WCAG compliance and accessibility features</p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6">
          {[
            { label: 'ARIA Labels', value: ux.accessibility.ariaLabels.present > 0, icon: Info },
            { label: 'Keyboard Navigation', value: ux.accessibility.keyboardNav, icon: Keyboard },
            { label: 'Color Contrast', value: ux.accessibility.colorContrast.passes > ux.accessibility.colorContrast.fails, icon: Eye },
            { label: 'Screen Reader', value: ux.accessibility.screenReaderFriendly, icon: Volume2 },
          ].map((item) => {
            const Icon = item.icon;
            
            return (
              <div 
                key={item.label}
                className={`p-4 rounded-lg border ${
                  item.value 
                    ? 'bg-emerald-500/10 border-emerald-500/20' 
                    : 'bg-red-500/10 border-red-500/20'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <Icon className={`w-4 h-4 ${item.value ? 'text-emerald-400' : 'text-red-400'}`} />
                  {item.value ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <XCircle className="w-4 h-4 text-red-400" />
                  )}
                </div>
                <p className="text-sm text-zinc-300">{item.label}</p>
              </div>
            );
          })}
        </div>
        
        {/* Accessibility Issues */}
        {ux.accessibility.issues.length > 0 && (
          <div className="mt-6">
            <h4 className="text-sm text-zinc-500 mb-3 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              Accessibility Issues Found
            </h4>
            <div className="space-y-2">
              {ux.accessibility.issues.map((issue, i) => (
                <div 
                  key={i}
                  className={`p-3 rounded-lg border ${
                    issue.severity === 'critical' ? 'bg-red-500/10 border-red-500/20' :
                    issue.severity === 'serious' ? 'bg-amber-500/10 border-amber-500/20' :
                    'bg-zinc-800/50 border-zinc-700'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-xs px-2 py-0.5 rounded ${
                          issue.severity === 'critical' ? 'bg-red-500/20 text-red-400' :
                          issue.severity === 'serious' ? 'bg-amber-500/20 text-amber-400' :
                          issue.severity === 'moderate' ? 'bg-cyan-500/20 text-cyan-400' :
                          'bg-zinc-700 text-zinc-400'
                        }`}>
                          {issue.severity}
                        </span>
                      </div>
                      <p className="text-sm text-zinc-300">{issue.type}</p>
                      <p className="text-xs text-zinc-500 mt-1">{issue.count} instances found</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      
      {/* Navigation Analysis */}
      <div className="p-6 bg-zinc-900/50 border border-zinc-800 rounded-xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 bg-cyan-500/10 rounded-lg">
            <Navigation className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <h3 className="text-white font-semibold">Navigation Analysis</h3>
            <p className="text-sm text-zinc-500">Site structure and navigation usability</p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="p-4 bg-zinc-800/50 rounded-lg">
            <p className="text-xs text-zinc-500 mb-1">Site Depth</p>
            <p className={`text-xl sm:text-2xl font-bold ${ux.navigation.siteDepth <= 3 ? 'text-emerald-400' : 'text-amber-400'}`}>
              {ux.navigation.siteDepth}
            </p>
            <p className="text-xs text-zinc-600 mt-1">levels deep</p>
          </div>
          
          <div className="p-3 sm:p-4 bg-zinc-800/50 rounded-lg">
            <p className="text-xs text-zinc-500 mb-1">Breadcrumbs</p>
            <p className={`text-xl sm:text-2xl font-bold ${ux.navigation.breadcrumbs ? 'text-emerald-400' : 'text-amber-400'}`}>
              {ux.navigation.breadcrumbs ? '✓' : '✗'}
            </p>
          </div>
          
          <div className="p-3 sm:p-4 bg-zinc-800/50 rounded-lg">
            <p className="text-xs text-zinc-500 mb-1">Search Function</p>
            <p className={`text-xl sm:text-2xl font-bold ${ux.navigation.searchFunction ? 'text-emerald-400' : 'text-amber-400'}`}>
              {ux.navigation.searchFunction ? '✓' : '✗'}
            </p>
          </div>
          
          <div className="p-3 sm:p-4 bg-zinc-800/50 rounded-lg">
            <p className="text-xs text-zinc-500 mb-1">Clicks to Content</p>
            <p className={`text-xl sm:text-2xl font-bold ${ux.navigation.clicksToContent <= 3 ? 'text-emerald-400' : 'text-amber-400'}`}>
              {ux.navigation.clicksToContent}
            </p>
          </div>
        </div>
      </div>
      
      {/* Engagement Metrics */}
      <div className="p-4 sm:p-6 bg-zinc-900/50 border border-zinc-800 rounded-xl">
        <div className="flex items-center gap-3 mb-4 sm:mb-6">
          <div className="p-2 sm:p-2.5 bg-pink-500/10 rounded-lg">
            <MousePointer className="w-4 h-4 sm:w-5 sm:h-5 text-pink-400" />
          </div>
          <div>
            <h3 className="text-white font-semibold text-sm sm:text-base">Engagement Metrics</h3>
            <p className="text-xs sm:text-sm text-zinc-500">User interaction patterns</p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6">
          <div className="p-3 sm:p-4 bg-zinc-800/50 rounded-lg text-center">
            <p className="text-2xl sm:text-3xl font-bold text-cyan-400">
              {ux.engagement.estimatedReadTime}m
            </p>
            <p className="text-xs text-zinc-500 mt-1">Read Time</p>
          </div>
          
          <div className="p-3 sm:p-4 bg-zinc-800/50 rounded-lg text-center">
            <p className="text-2xl sm:text-3xl font-bold text-purple-400">
              {ux.engagement.scrollDepthPotential}%
            </p>
            <p className="text-xs text-zinc-500 mt-1">Scroll Potential</p>
          </div>
          
          <div className="p-4 bg-zinc-800/50 rounded-lg text-center">
            <p className="text-3xl font-bold text-pink-400">
              {ux.engagement.interactiveElements}
            </p>
            <p className="text-xs text-zinc-500 mt-1">Interactive Elements</p>
          </div>
          
          <div className="p-4 bg-zinc-800/50 rounded-lg text-center">
            <p className="text-3xl font-bold text-emerald-400">
              {ux.engagement.ctaCount}
            </p>
            <p className="text-xs text-zinc-500 mt-1">CTAs</p>
          </div>
        </div>
      </div>
      
      {/* Page Experience */}
      <div className="p-6 bg-zinc-900/50 border border-zinc-800 rounded-xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 bg-emerald-500/10 rounded-lg">
            <Smartphone className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <h3 className="text-white font-semibold">Page Experience Signals</h3>
            <p className="text-sm text-zinc-500">Google&apos;s page experience ranking factors</p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Core Web Vitals', value: ux.pageExperience.coreWebVitalsPass },
            { label: 'Mobile Friendly', value: ux.pageExperience.mobileUsability },
            { label: 'Safe Browsing', value: ux.pageExperience.safeBrowsing },
            { label: 'HTTPS', value: ux.pageExperience.httpsSecure },
            { label: 'No Intrusive Interstitials', value: ux.pageExperience.noIntrusiveInterstitials },
          ].map((item) => (
            <div 
              key={item.label}
              className={`p-4 rounded-lg ${
                item.value 
                  ? 'bg-emerald-500/10 border border-emerald-500/20' 
                  : 'bg-red-500/10 border border-red-500/20'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                {item.value ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-400" />
                )}
              </div>
              <p className="text-sm text-zinc-300">{item.label}</p>
              <p className={`text-xs ${item.value ? 'text-emerald-400' : 'text-red-400'}`}>
                {item.value ? 'Passed' : 'Failed'}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
