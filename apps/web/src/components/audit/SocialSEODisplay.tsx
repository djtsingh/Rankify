/**
 * Social SEO Display Component
 * Social media and sharing optimization analysis
 */

'use client';

import { 
  Share2, Facebook, Twitter, Linkedin, Instagram,
  Image, CheckCircle2, XCircle, AlertTriangle,
  ExternalLink, Globe, Copy
} from 'lucide-react';
import { useState } from 'react';
import type { SocialSEO } from '@/lib/types/seo-audit';

interface SocialSEODisplayProps {
  social: SocialSEO;
}

function SocialPreviewCard({ 
  platform, 
  title, 
  description, 
  image, 
  url 
}: { 
  platform: 'facebook' | 'twitter' | 'linkedin';
  title?: string;
  description?: string;
  image?: string;
  url: string;
}) {
  const colors = {
    facebook: 'from-blue-600 to-blue-700',
    twitter: 'from-sky-500 to-sky-600',
    linkedin: 'from-blue-700 to-blue-800'
  };
  
  const icons = {
    facebook: Facebook,
    twitter: Twitter,
    linkedin: Linkedin
  };
  
  const Icon = icons[platform];
  
  return (
    <div className="border border-zinc-800 rounded-xl overflow-hidden">
      <div className={`p-3 bg-gradient-to-r ${colors[platform]} flex items-center gap-2`}>
        <Icon className="w-4 h-4 text-white" />
        <span className="text-white text-sm font-medium capitalize">{platform} Preview</span>
      </div>
      
      <div className="bg-zinc-900/50">
        {/* Image Preview */}
        {image ? (
          <div className="aspect-video bg-zinc-800 relative overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src={image} 
              alt="Social preview" 
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          </div>
        ) : (
          <div className="aspect-video bg-zinc-800 flex items-center justify-center">
            <div className="text-center text-zinc-500">
              <Image className="w-8 h-8 mx-auto mb-2" />
              <p className="text-sm">No image set</p>
            </div>
          </div>
        )}
        
        {/* Content */}
        <div className="p-4">
          <p className="text-xs text-zinc-500 mb-1 uppercase">{new URL(url).hostname}</p>
          <h4 className="text-white font-medium line-clamp-2">
            {title || 'No title set'}
          </h4>
          <p className="text-zinc-400 text-sm mt-1 line-clamp-2">
            {description || 'No description set'}
          </p>
        </div>
      </div>
    </div>
  );
}

export function SocialSEODisplay({ social }: SocialSEODisplayProps) {
  const [copiedTag, setCopiedTag] = useState<string | null>(null);
  
  const copyToClipboard = (text: string, tag: string) => {
    navigator.clipboard.writeText(text);
    setCopiedTag(tag);
    setTimeout(() => setCopiedTag(null), 2000);
  };
  
  const ogComplete = social.openGraph.title && social.openGraph.description && social.openGraph.image.valid;
  const tcComplete = social.twitterCards.cardType !== 'none' && social.twitterCards.title && social.twitterCards.description;
  
  return (
    <div className="space-y-6">
      {/* Social Score Overview */}
      <div className="p-4 sm:p-6 bg-gradient-to-br from-pink-500/10 via-purple-500/10 to-cyan-500/10 border border-pink-500/20 rounded-xl">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 sm:p-3 bg-gradient-to-br from-pink-500/20 to-purple-500/20 rounded-xl">
            <Share2 className="w-5 h-5 sm:w-6 sm:h-6 text-pink-400" />
          </div>
          <div>
            <h3 className="text-white font-semibold text-base sm:text-lg">Social Media Optimization</h3>
            <p className="text-xs sm:text-sm text-zinc-400">How your content appears when shared</p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div className="p-3 sm:p-4 bg-zinc-900/50 rounded-lg text-center">
            <div className={`text-xl sm:text-2xl font-bold ${social.shareability.score >= 80 ? 'text-emerald-400' : social.shareability.score >= 60 ? 'text-amber-400' : 'text-red-400'}`}>
              {social.shareability.score}
            </div>
            <p className="text-xs text-zinc-500 mt-1">Shareability Score</p>
          </div>
          
          <div className="p-3 sm:p-4 bg-zinc-900/50 rounded-lg text-center">
            <div className={`text-xl sm:text-2xl font-bold ${ogComplete ? 'text-emerald-400' : 'text-amber-400'}`}>
              {ogComplete ? '✓' : '!'}
            </div>
            <p className="text-xs text-zinc-500 mt-1">Open Graph</p>
          </div>
          
          <div className="p-3 sm:p-4 bg-zinc-900/50 rounded-lg text-center">
            <div className={`text-xl sm:text-2xl font-bold ${tcComplete ? 'text-emerald-400' : 'text-amber-400'}`}>
              {tcComplete ? '✓' : '!'}
            </div>
            <p className="text-xs text-zinc-500 mt-1">Twitter Cards</p>
          </div>
          
          <div className="p-3 sm:p-4 bg-zinc-900/50 rounded-lg text-center">
            <div className="text-xl sm:text-2xl font-bold text-cyan-400">
              {Object.values(social.socialProfiles).filter(Boolean).length}
            </div>
            <p className="text-xs text-zinc-500 mt-1">Social Profiles</p>
          </div>
        </div>
      </div>
      
      {/* Preview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        <SocialPreviewCard
          platform="facebook"
          title={social.openGraph.title}
          description={social.openGraph.description}
          image={social.openGraph.image.url}
          url={social.openGraph.url || 'https://example.com'}
        />
        
        <SocialPreviewCard
          platform="twitter"
          title={social.twitterCards.title}
          description={social.twitterCards.description}
          image={social.twitterCards.image}
          url={social.openGraph.url || 'https://example.com'}
        />
        
        <SocialPreviewCard
          platform="linkedin"
          title={social.openGraph.title}
          description={social.openGraph.description}
          image={social.openGraph.image.url}
          url={social.openGraph.url || 'https://example.com'}
        />
      </div>
      
      {/* Open Graph Details */}
      <div className="p-6 bg-zinc-900/50 border border-zinc-800 rounded-xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 bg-blue-500/10 rounded-lg">
            <Globe className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <h3 className="text-white font-semibold">Open Graph Tags</h3>
            <p className="text-sm text-zinc-500">Used by Facebook, LinkedIn, and other platforms</p>
          </div>
        </div>
        
        <div className="space-y-3">
          {[
            { key: 'og:title', value: social.openGraph.title, required: true },
            { key: 'og:description', value: social.openGraph.description, required: true },
            { key: 'og:image', value: social.openGraph.image.url, required: true },
            { key: 'og:type', value: social.openGraph.type, required: false },
            { key: 'og:url', value: social.openGraph.url, required: true },
            { key: 'og:site_name', value: social.openGraph.siteName, required: false },
          ].map((tag) => (
            <div 
              key={tag.key}
              className="flex items-start gap-3 p-3 bg-zinc-800/50 rounded-lg"
            >
              <div className="flex-shrink-0 mt-0.5">
                {tag.value ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                ) : tag.required ? (
                  <XCircle className="w-4 h-4 text-red-400" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-mono text-cyan-400">{tag.key}</span>
                  {tag.required && !tag.value && (
                    <span className="text-xs text-red-400">(required)</span>
                  )}
                </div>
                <p className="text-sm text-zinc-400 truncate mt-0.5">
                  {tag.value || <span className="text-zinc-600 italic">Not set</span>}
                </p>
              </div>
              
              {tag.value && (
                <button
                  onClick={() => copyToClipboard(tag.value!, tag.key)}
                  className="flex-shrink-0 p-1.5 hover:bg-zinc-700 rounded transition-colors"
                >
                  <Copy className={`w-4 h-4 ${copiedTag === tag.key ? 'text-emerald-400' : 'text-zinc-500'}`} />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
      
      {/* Twitter Card Details */}
      <div className="p-6 bg-zinc-900/50 border border-zinc-800 rounded-xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 bg-sky-500/10 rounded-lg">
            <Twitter className="w-5 h-5 text-sky-400" />
          </div>
          <div>
            <h3 className="text-white font-semibold">Twitter Card Tags</h3>
            <p className="text-sm text-zinc-500">Enhanced previews for Twitter/X</p>
          </div>
        </div>
        
        <div className="space-y-3">
          {[
            { key: 'twitter:card', value: social.twitterCards.cardType, required: true },
            { key: 'twitter:title', value: social.twitterCards.title, required: true },
            { key: 'twitter:description', value: social.twitterCards.description, required: true },
            { key: 'twitter:image', value: social.twitterCards.image, required: true },
            { key: 'twitter:creator', value: social.twitterCards.creator, required: false },
          ].map((tag) => (
            <div 
              key={tag.key}
              className="flex items-start gap-3 p-3 bg-zinc-800/50 rounded-lg"
            >
              <div className="flex-shrink-0 mt-0.5">
                {tag.value ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                ) : tag.required ? (
                  <XCircle className="w-4 h-4 text-red-400" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-mono text-sky-400">{tag.key}</span>
                  {tag.required && !tag.value && (
                    <span className="text-xs text-red-400">(required)</span>
                  )}
                </div>
                <p className="text-sm text-zinc-400 truncate mt-0.5">
                  {tag.value || <span className="text-zinc-600 italic">Not set</span>}
                </p>
              </div>
              
              {tag.value && (
                <button
                  onClick={() => copyToClipboard(tag.value!, tag.key)}
                  className="flex-shrink-0 p-1.5 hover:bg-zinc-700 rounded transition-colors"
                >
                  <Copy className={`w-4 h-4 ${copiedTag === tag.key ? 'text-emerald-400' : 'text-zinc-500'}`} />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
      
      {/* Social Profiles */}
      {Object.values(social.socialProfiles).some(Boolean) && (
        <div className="p-6 bg-zinc-900/50 border border-zinc-800 rounded-xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2.5 bg-purple-500/10 rounded-lg">
              <Share2 className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <h3 className="text-white font-semibold">Linked Social Profiles</h3>
              <p className="text-sm text-zinc-500">Social accounts connected to this website</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {(Object.entries(social.socialProfiles) as [string, boolean][]).filter(([, connected]) => connected).map(([platform]) => {
              const platformIcons: Record<string, React.ComponentType<{ className?: string }>> = {
                facebook: Facebook,
                twitter: Twitter,
                linkedin: Linkedin,
                instagram: Instagram,
              };
              
              const Icon = platformIcons[platform.toLowerCase()] || Globe;
              
              return (
                <div
                  key={platform}
                  className="flex items-center gap-3 p-4 bg-zinc-800/50 rounded-lg"
                >
                  <Icon className="w-5 h-5 text-zinc-400" />
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-medium capitalize">{platform}</p>
                    <p className="text-xs text-emerald-400">Connected</p>
                  </div>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                </div>
              );
            })}
          </div>
        </div>
      )}
      
      {/* Shareability Factors */}
      <div className="p-6 bg-zinc-900/50 border border-zinc-800 rounded-xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 bg-emerald-500/10 rounded-lg">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <h3 className="text-white font-semibold">Shareability Factors</h3>
            <p className="text-sm text-zinc-500">Optimize these for better social engagement</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-3 p-3 bg-zinc-800/30 rounded-lg">
            {social.shareability.socialProof ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0" />
            )}
            <div>
              <p className="text-sm text-zinc-300">Social Proof</p>
              <p className="text-xs text-zinc-500">Testimonials, reviews, and trust signals</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-3 bg-zinc-800/30 rounded-lg">
            {social.shareability.shareButtons ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0" />
            )}
            <div>
              <p className="text-sm text-zinc-300">Share Buttons</p>
              <p className="text-xs text-zinc-500">Easy social sharing functionality</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-3 bg-zinc-800/30 rounded-lg">
            <div className="p-1.5 rounded-lg bg-cyan-500/10">
              <Share2 className="w-4 h-4 text-cyan-400" />
            </div>
            <div>
              <p className="text-sm text-zinc-300">Viral Potential</p>
              <p className="text-xs text-zinc-500">{social.shareability.viralPotential}% likelihood of sharing</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 p-3 bg-zinc-800/30 rounded-lg">
            <div className="p-1.5 rounded-lg bg-purple-500/10">
              <Share2 className="w-4 h-4 text-purple-400" />
            </div>
            <div>
              <p className="text-sm text-zinc-300">Overall Score</p>
              <p className="text-xs text-zinc-500">{social.shareability.score}/100 shareability rating</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
