/**
 * Upgrade Prompt Modal
 * 
 * Displays contextual upgrade prompts when users hit limits or try
 * to access locked features.
 */

'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { X, Zap, Crown, Sparkles, Lock, Clock, CheckCircle } from 'lucide-react';

// =============================================================================
// TYPES
// =============================================================================

export type UpgradeTrigger = 
  | 'quota_exceeded'
  | 'feature_locked'
  | 'soft_wall'
  | 'trial_ended';

export interface UpgradePromptProps {
  isOpen: boolean;
  onClose: () => void;
  trigger: UpgradeTrigger;
  feature?: string;
  quotaInfo?: {
    used: number;
    limit: number;
    resetAt: Date;
  };
  currentPlan?: 'guest' | 'free' | 'pro' | 'enterprise';
}

// =============================================================================
// UPGRADE CONTENT CONFIG
// =============================================================================

interface UpgradeContent {
  title: string;
  subtitle: string;
  icon: typeof Zap;
  primaryCta: string;
  secondaryCta?: string;
  benefits: string[];
}

const UPGRADE_CONTENT: Record<UpgradeTrigger, UpgradeContent> = {
  quota_exceeded: {
    title: "You've Hit Your Daily Limit",
    subtitle: "Upgrade to Pro for unlimited scans and advanced features.",
    icon: Clock,
    primaryCta: "Upgrade to Pro",
    secondaryCta: "Try again tomorrow",
    benefits: [
      "Unlimited website audits",
      "Advanced SEO analysis",
      "Competitor tracking",
      "Priority support"
    ]
  },
  feature_locked: {
    title: "Unlock This Feature",
    subtitle: "This feature is available on Pro and Enterprise plans.",
    icon: Lock,
    primaryCta: "Upgrade Now",
    secondaryCta: "Learn more",
    benefits: [
      "PDF & CSV exports",
      "White-label reports",
      "API access",
      "Team collaboration"
    ]
  },
  soft_wall: {
    title: "Create a Free Account",
    subtitle: "Sign up to get 5 free scans per day and save your history.",
    icon: Sparkles,
    primaryCta: "Sign Up Free",
    secondaryCta: "Maybe later",
    benefits: [
      "5 free scans per day",
      "7-day audit history",
      "PDF report downloads",
      "Email notifications"
    ]
  },
  trial_ended: {
    title: "Your Trial Has Ended",
    subtitle: "Subscribe to continue using all Pro features.",
    icon: Crown,
    primaryCta: "Subscribe Now",
    secondaryCta: "View pricing",
    benefits: [
      "All Pro features unlocked",
      "14-day money-back guarantee",
      "Cancel anytime",
      "Priority support"
    ]
  }
};

// =============================================================================
// COMPONENT
// =============================================================================

export function UpgradePromptModal({
  isOpen,
  onClose,
  trigger,
  feature,
  quotaInfo,
  currentPlan = 'guest'
}: UpgradePromptProps) {
  const [isClosing, setIsClosing] = useState(false);

  // Handle close with animation
  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      onClose();
    }, 200);
  };

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const content = UPGRADE_CONTENT[trigger];
  const Icon = content.icon;

  // Determine CTAs based on trigger and current plan
  const primaryUrl = trigger === 'soft_wall' 
    ? '/login?mode=signup' 
    : '/pricing';

  const secondaryUrl = trigger === 'soft_wall'
    ? undefined
    : '/pricing';

  // Calculate time until reset
  const getTimeUntilReset = () => {
    if (!quotaInfo?.resetAt) return null;
    
    const now = new Date();
    const reset = new Date(quotaInfo.resetAt);
    const diff = reset.getTime() - now.getTime();
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${hours}h ${minutes}m`;
  };

  return (
    <div 
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-opacity duration-200 ${
        isClosing ? 'opacity-0' : 'opacity-100'
      }`}
      onClick={handleClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

      {/* Modal */}
      <div 
        className={`relative w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl transform transition-all duration-200 ${
          isClosing ? 'scale-95' : 'scale-100'
        }`}
        onClick={e => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-white transition-colors rounded-lg hover:bg-zinc-800"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Content */}
        <div className="p-6 pt-8">
          {/* Icon */}
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-full bg-coral/10 border border-coral/30 flex items-center justify-center">
              <Icon className="w-8 h-8 text-coral" />
            </div>
          </div>

          {/* Title & Subtitle */}
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-white mb-2">
              {content.title}
            </h2>
            <p className="text-zinc-400">
              {feature ? `${feature} requires an upgrade.` : content.subtitle}
            </p>

            {/* Quota info */}
            {trigger === 'quota_exceeded' && quotaInfo && (
              <div className="mt-4 p-3 bg-zinc-800/50 rounded-lg">
                <p className="text-sm text-zinc-300">
                  You've used <span className="text-coral font-semibold">{quotaInfo.used}/{quotaInfo.limit}</span> scans today.
                </p>
                <p className="text-xs text-zinc-500 mt-1">
                  Resets in {getTimeUntilReset()}
                </p>
              </div>
            )}
          </div>

          {/* Benefits */}
          <div className="space-y-3 mb-6">
            {content.benefits.map((benefit, index) => (
              <div key={index} className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                <span className="text-zinc-300">{benefit}</span>
              </div>
            ))}
          </div>

          {/* CTAs */}
          <div className="space-y-3">
            <Link
              href={primaryUrl}
              className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-coral hover:bg-coral-hover text-white font-semibold rounded-xl transition-colors"
            >
              <Zap className="w-5 h-5" />
              {content.primaryCta}
            </Link>

            {content.secondaryCta && (
              <button
                onClick={handleClose}
                className="w-full py-3 px-4 text-zinc-400 hover:text-white font-medium transition-colors"
              >
                {content.secondaryCta}
              </button>
            )}
          </div>

          {/* Current plan indicator */}
          {currentPlan !== 'guest' && (
            <p className="text-center text-xs text-zinc-500 mt-4">
              Current plan: <span className="capitalize">{currentPlan}</span>
            </p>
          )}
        </div>

        {/* Pro badge */}
        {trigger !== 'soft_wall' && (
          <div className="px-6 py-4 bg-gradient-to-r from-coral/10 to-transparent border-t border-zinc-800 rounded-b-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Crown className="w-5 h-5 text-coral" />
                <span className="text-sm font-medium text-white">Pro Plan</span>
              </div>
              <span className="text-sm text-zinc-400">
                Starting at <span className="text-white font-semibold">$49/mo</span>
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// =============================================================================
// INLINE UPGRADE BANNER (for embedding in pages)
// =============================================================================

interface UpgradeBannerProps {
  variant: 'warning' | 'info' | 'upgrade';
  title: string;
  description: string;
  ctaText: string;
  ctaUrl: string;
  onDismiss?: () => void;
  showDismiss?: boolean;
}

export function UpgradeBanner({
  variant,
  title,
  description,
  ctaText,
  ctaUrl,
  onDismiss,
  showDismiss = true
}: UpgradeBannerProps) {
  const variantStyles = {
    warning: 'bg-amber-500/10 border-amber-500/30 text-amber-200',
    info: 'bg-cyan-500/10 border-cyan-500/30 text-cyan-200',
    upgrade: 'bg-coral/10 border-coral/30 text-coral-light'
  };

  return (
    <div className={`rounded-xl border p-4 ${variantStyles[variant]}`}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <h4 className="font-semibold text-white mb-1">{title}</h4>
          <p className="text-sm opacity-80">{description}</p>
        </div>
        
        <div className="flex items-center gap-2 flex-shrink-0">
          <Link
            href={ctaUrl}
            className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-sm font-medium rounded-lg transition-colors"
          >
            {ctaText}
          </Link>
          
          {showDismiss && onDismiss && (
            <button
              onClick={onDismiss}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// =============================================================================
// QUOTA DISPLAY COMPONENT
// =============================================================================

interface QuotaDisplayProps {
  used: number;
  limit: number;
  label?: string;
  showUpgradeLink?: boolean;
}

export function QuotaDisplay({
  used,
  limit,
  label = 'Scans today',
  showUpgradeLink = true
}: QuotaDisplayProps) {
  const percentage = limit > 0 ? Math.min((used / limit) * 100, 100) : 0;
  const isNearLimit = percentage >= 80;
  const isAtLimit = used >= limit;

  return (
    <div className="inline-flex items-center gap-3 px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-xl">
      <div className="flex-1">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs text-zinc-400">{label}</span>
          <span className={`text-sm font-medium ${
            isAtLimit ? 'text-red-400' : isNearLimit ? 'text-amber-400' : 'text-white'
          }`}>
            {used}/{limit === -1 ? '∞' : limit}
          </span>
        </div>
        
        {/* Progress bar */}
        <div className="w-24 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
          <div 
            className={`h-full rounded-full transition-all duration-300 ${
              isAtLimit ? 'bg-red-500' : isNearLimit ? 'bg-amber-500' : 'bg-emerald-500'
            }`}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>

      {showUpgradeLink && isAtLimit && (
        <Link
          href="/pricing"
          className="text-xs text-coral hover:text-coral-light font-medium"
        >
          Upgrade
        </Link>
      )}
    </div>
  );
}
