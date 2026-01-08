/**
 * Technical SEO Analysis Component
 * Comprehensive technical audit visualization
 */

'use client';

import { 
  Bot, Shield, Globe2, FileText, Code2, Smartphone,
  Lock, AlertTriangle, CheckCircle2, XCircle, Info,
  Languages, Layers, ExternalLink
} from 'lucide-react';
import type { TechnicalSEO } from '@/lib/types/seo-audit';

interface TechnicalSEODisplayProps {
  technical: TechnicalSEO;
}

export function TechnicalSEODisplay({ technical }: TechnicalSEODisplayProps) {
  const StatusBadge = ({ status, label }: { status: boolean; label?: string }) => (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium ${
      status 
        ? 'bg-emerald-500/20 text-emerald-400' 
        : 'bg-red-500/20 text-red-400'
    }`}>
      {status ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
      {label || (status ? 'Pass' : 'Fail')}
    </span>
  );
  
  return (
    <div className="space-y-6">
      {/* Crawlability */}
      <div className="p-6 bg-zinc-900/50 border border-zinc-800 rounded-xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 bg-cyan-500/10 rounded-lg">
            <Bot className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <h3 className="text-white font-semibold">Crawlability & Indexing</h3>
            <p className="text-sm text-zinc-500">How search engines access your site</p>
          </div>
          <div className="ml-auto px-3 py-1 bg-cyan-500/10 rounded-lg">
            <span className="text-cyan-400 font-semibold">{technical.crawlability.score}/100</span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          {/* Robots.txt */}
          <div className="p-3 sm:p-4 bg-zinc-800/50 rounded-lg">
            <div className="flex items-center justify-between gap-2 mb-3 flex-wrap">
              <span className="text-sm text-zinc-400 flex items-center gap-2">
                <FileText className="w-4 h-4" /> Robots.txt
              </span>
              <StatusBadge status={technical.crawlability.robotsTxt.exists && technical.crawlability.robotsTxt.valid} />
            </div>
            <ul className="space-y-1 text-xs">
              <li className="flex items-center gap-2">
                <span className={technical.crawlability.robotsTxt.exists ? 'text-emerald-400' : 'text-red-400'}>
                  {technical.crawlability.robotsTxt.exists ? '✓' : '✗'}
                </span>
                <span className="text-zinc-400">File exists</span>
              </li>
              <li className="flex items-center gap-2">
                <span className={technical.crawlability.robotsTxt.valid ? 'text-emerald-400' : 'text-red-400'}>
                  {technical.crawlability.robotsTxt.valid ? '✓' : '✗'}
                </span>
                <span className="text-zinc-400">Valid syntax</span>
              </li>
              {technical.crawlability.robotsTxt.issues.length > 0 && (
                <li className="flex items-center gap-2 text-amber-400">
                  <AlertTriangle className="w-3 h-3" />
                  {technical.crawlability.robotsTxt.issues[0]}
                </li>
              )}
            </ul>
          </div>
          
          {/* XML Sitemap */}
          <div className="p-4 bg-zinc-800/50 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-zinc-400 flex items-center gap-2">
                <Layers className="w-4 h-4" /> XML Sitemap
              </span>
              <StatusBadge status={technical.crawlability.xmlSitemap.exists && technical.crawlability.xmlSitemap.valid} />
            </div>
            <ul className="space-y-1 text-xs">
              <li className="flex items-center gap-2">
                <span className={technical.crawlability.xmlSitemap.exists ? 'text-emerald-400' : 'text-red-400'}>
                  {technical.crawlability.xmlSitemap.exists ? '✓' : '✗'}
                </span>
                <span className="text-zinc-400">Sitemap found</span>
              </li>
              <li className="text-zinc-400">
                {technical.crawlability.xmlSitemap.urlCount} URLs indexed
              </li>
              <li className="text-zinc-400">
                Last modified: {new Date(technical.crawlability.xmlSitemap.lastModified).toLocaleDateString()}
              </li>
            </ul>
          </div>
          
          {/* Indexability */}
          <div className="p-4 bg-zinc-800/50 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-zinc-400 flex items-center gap-2">
                <Globe2 className="w-4 h-4" /> Indexability
              </span>
              <StatusBadge status={technical.crawlability.indexability.indexable} label={technical.crawlability.indexability.indexable ? 'Indexable' : 'Blocked'} />
            </div>
            {technical.crawlability.indexability.blockers.length > 0 ? (
              <ul className="space-y-1 text-xs text-red-400">
                {technical.crawlability.indexability.blockers.map((blocker, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <XCircle className="w-3 h-3" /> {blocker}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-emerald-400">No indexing blockers detected</p>
            )}
          </div>
          
          {/* Canonical */}
          <div className="p-4 bg-zinc-800/50 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-zinc-400 flex items-center gap-2">
                <ExternalLink className="w-4 h-4" /> Canonicalization
              </span>
              <StatusBadge status={technical.crawlability.canonicalization.hasCanonical} />
            </div>
            <ul className="space-y-1 text-xs">
              <li className="flex items-center gap-2">
                <span className={technical.crawlability.canonicalization.hasCanonical ? 'text-emerald-400' : 'text-red-400'}>
                  {technical.crawlability.canonicalization.hasCanonical ? '✓' : '✗'}
                </span>
                <span className="text-zinc-400">Canonical tag present</span>
              </li>
              <li className="flex items-center gap-2">
                <span className={technical.crawlability.canonicalization.selfReferencing ? 'text-emerald-400' : 'text-amber-400'}>
                  {technical.crawlability.canonicalization.selfReferencing ? '✓' : '⚠'}
                </span>
                <span className="text-zinc-400">Self-referencing</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
      
      {/* Mobile Optimization */}
      <div className="p-6 bg-zinc-900/50 border border-zinc-800 rounded-xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 bg-purple-500/10 rounded-lg">
            <Smartphone className="w-5 h-5 text-purple-400" />
          </div>
          <div>
            <h3 className="text-white font-semibold">Mobile Optimization</h3>
            <p className="text-sm text-zinc-500">Mobile-first indexing readiness</p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div className="p-3 sm:p-4 bg-zinc-800/50 rounded-lg text-center">
            <StatusBadge status={technical.mobile.mobileFirst} label={technical.mobile.mobileFirst ? 'Mobile-First' : 'Not Mobile-First'} />
            <p className="text-xs text-zinc-500 mt-2">Mobile-First Ready</p>
          </div>
          
          <div className="p-4 bg-zinc-800/50 rounded-lg text-center">
            <StatusBadge status={technical.mobile.responsiveDesign} />
            <p className="text-xs text-zinc-500 mt-2">Responsive Design</p>
          </div>
          
          <div className="p-4 bg-zinc-800/50 rounded-lg text-center">
            <StatusBadge status={technical.mobile.viewportConfigured} />
            <p className="text-xs text-zinc-500 mt-2">Viewport Meta</p>
          </div>
          
          <div className="p-4 bg-zinc-800/50 rounded-lg text-center">
            <StatusBadge status={technical.mobile.touchTargets.adequate} />
            <p className="text-xs text-zinc-500 mt-2">Touch Targets</p>
            {technical.mobile.touchTargets.issues > 0 && (
              <p className="text-xs text-amber-400 mt-1">{technical.mobile.touchTargets.issues} issues</p>
            )}
          </div>
        </div>
      </div>
      
      {/* Security */}
      <div className="p-6 bg-zinc-900/50 border border-zinc-800 rounded-xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 bg-emerald-500/10 rounded-lg">
            <Shield className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <h3 className="text-white font-semibold">Security</h3>
            <p className="text-sm text-zinc-500">SSL, headers, and security measures</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* SSL Certificate */}
          <div className="p-4 bg-zinc-800/50 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-zinc-400 flex items-center gap-2">
                <Lock className="w-4 h-4" /> SSL Certificate
              </span>
              <StatusBadge status={technical.security.sslCertificate.valid} />
            </div>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-zinc-500">Issuer</span>
                <span className="text-zinc-300">{technical.security.sslCertificate.issuer}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Expires</span>
                <span className={technical.security.sslCertificate.daysUntilExpiry < 30 ? 'text-amber-400' : 'text-emerald-400'}>
                  {technical.security.sslCertificate.daysUntilExpiry} days
                </span>
              </div>
            </div>
          </div>
          
          {/* Security Headers */}
          <div className="p-4 bg-zinc-800/50 rounded-lg">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-sm text-zinc-400">Security Headers</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="flex items-center gap-1.5">
                {technical.security.securityHeaders.contentSecurityPolicy ? 
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" /> : 
                  <XCircle className="w-3 h-3 text-red-400" />}
                <span className="text-zinc-400">CSP</span>
              </div>
              <div className="flex items-center gap-1.5">
                {technical.security.securityHeaders.xFrameOptions ? 
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" /> : 
                  <XCircle className="w-3 h-3 text-red-400" />}
                <span className="text-zinc-400">X-Frame</span>
              </div>
              <div className="flex items-center gap-1.5">
                {technical.security.securityHeaders.xContentTypeOptions ? 
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" /> : 
                  <XCircle className="w-3 h-3 text-red-400" />}
                <span className="text-zinc-400">X-Content</span>
              </div>
              <div className="flex items-center gap-1.5">
                {technical.security.hsts ? 
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" /> : 
                  <XCircle className="w-3 h-3 text-red-400" />}
                <span className="text-zinc-400">HSTS</span>
              </div>
            </div>
          </div>
          
          {/* Mixed Content */}
          <div className="p-4 bg-zinc-800/50 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-zinc-400">Mixed Content</span>
              <StatusBadge status={technical.security.mixedContent.count === 0} label={technical.security.mixedContent.count === 0 ? 'None' : `${technical.security.mixedContent.count} found`} />
            </div>
            {technical.security.mixedContent.count > 0 && (
              <p className="text-xs text-amber-400">
                {technical.security.mixedContent.count} insecure resources detected
              </p>
            )}
          </div>
          
          {/* HTTPS */}
          <div className="p-4 bg-zinc-800/50 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm text-zinc-400">HTTPS Enabled</span>
              <StatusBadge status={technical.security.https} />
            </div>
          </div>
        </div>
      </div>
      
      {/* Structured Data */}
      <div className="p-6 bg-zinc-900/50 border border-zinc-800 rounded-xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 bg-amber-500/10 rounded-lg">
            <Code2 className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <h3 className="text-white font-semibold">Structured Data (Schema)</h3>
            <p className="text-sm text-zinc-500">Rich results eligibility</p>
          </div>
          <StatusBadge status={technical.structuredData.present && technical.structuredData.valid} />
        </div>
        
        {technical.structuredData.present ? (
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {technical.structuredData.types.map((type) => (
                <span key={type} className="px-3 py-1.5 bg-amber-500/10 text-amber-400 text-xs rounded-lg font-medium">
                  {type}
                </span>
              ))}
            </div>
            
            {technical.structuredData.richResultsEligible.length > 0 && (
              <div>
                <p className="text-xs text-zinc-500 mb-2">Rich Results Eligible:</p>
                <div className="flex flex-wrap gap-2">
                  {technical.structuredData.richResultsEligible.map((result) => (
                    <span key={result} className="px-3 py-1.5 bg-emerald-500/10 text-emerald-400 text-xs rounded-lg font-medium">
                      {result}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            {(technical.structuredData.errors > 0 || technical.structuredData.warnings > 0) && (
              <div className="flex gap-4 text-xs">
                {technical.structuredData.errors > 0 && (
                  <span className="text-red-400">{technical.structuredData.errors} errors</span>
                )}
                {technical.structuredData.warnings > 0 && (
                  <span className="text-amber-400">{technical.structuredData.warnings} warnings</span>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
            <p className="text-sm text-red-400 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              No structured data detected. Add schema markup to qualify for rich results.
            </p>
          </div>
        )}
      </div>
      
      {/* Internationalization */}
      <div className="p-6 bg-zinc-900/50 border border-zinc-800 rounded-xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 bg-blue-500/10 rounded-lg">
            <Languages className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <h3 className="text-white font-semibold">Internationalization</h3>
            <p className="text-sm text-zinc-500">Multi-language and region targeting</p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 bg-zinc-800/50 rounded-lg text-center">
            <StatusBadge status={technical.internationalization.languageDeclaration} />
            <p className="text-xs text-zinc-500 mt-2">Language Declaration</p>
          </div>
          
          <div className="p-4 bg-zinc-800/50 rounded-lg text-center">
            <StatusBadge status={technical.internationalization.hreflangTags.exists} />
            <p className="text-xs text-zinc-500 mt-2">Hreflang Tags</p>
          </div>
          
          <div className="p-4 bg-zinc-800/50 rounded-lg text-center">
            <span className="text-lg font-bold text-white">{technical.internationalization.contentLanguage}</span>
            <p className="text-xs text-zinc-500 mt-2">Content Language</p>
          </div>
          
          <div className="p-4 bg-zinc-800/50 rounded-lg text-center">
            <span className="text-lg font-bold text-white">{technical.internationalization.regionTargeting.join(', ')}</span>
            <p className="text-xs text-zinc-500 mt-2">Region Targeting</p>
          </div>
        </div>
      </div>
    </div>
  );
}
