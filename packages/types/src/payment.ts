/**
 * Payment & Subscription Types
 * 
 * Core TypeScript types for the Rankify payment and monetization system.
 * These types are shared between frontend and API.
 */

// =============================================================================
// PLAN TYPES
// =============================================================================

export type PlanName = 'free' | 'pro' | 'enterprise';
export type BillingCycle = 'monthly' | 'yearly';

export interface PlanLimits {
  scansPerDay: number;       // -1 = unlimited
  concurrentScans: number;
  historyDays: number;       // -1 = unlimited
  maxProjects: number;       // -1 = unlimited
  maxTeamMembers: number;    // -1 = unlimited
  apiCallsPerMonth: number;  // -1 = unlimited
}

export interface PlanFeatures {
  hasPdfExport: boolean;
  hasWhiteLabel: boolean;
  hasCompetitors: boolean;
  hasApiAccess: boolean;
  hasPrioritySupport: boolean;
}

export interface Plan {
  id: string;
  stripeProductId: string | null;
  stripePriceIdMonthly: string | null;
  stripePriceIdYearly: string | null;
  name: PlanName;
  displayName: string;
  description: string | null;
  priceMonthly: number;
  priceYearly: number;
  limits: PlanLimits;
  features: PlanFeatures;
  isActive: boolean;
  sortOrder: number;
}

// =============================================================================
// SUBSCRIPTION TYPES
// =============================================================================

export type SubscriptionStatus = 
  | 'active' 
  | 'trialing' 
  | 'past_due' 
  | 'cancelled' 
  | 'expired'
  | 'incomplete'
  | 'incomplete_expired';

export interface Subscription {
  id: string;
  userId: string;
  planId: string;
  plan: Plan;
  stripeSubscriptionId: string | null;
  status: SubscriptionStatus;
  billingCycle: BillingCycle;
  trialStartDate: Date | null;
  trialEndDate: Date | null;
  currentPeriodStart: Date | null;
  currentPeriodEnd: Date | null;
  cancelledAt: Date | null;
  cancelAtPeriodEnd: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface SubscriptionWithPlan extends Subscription {
  plan: Plan;
}

// =============================================================================
// PAYMENT TYPES
// =============================================================================

export type PaymentStatus = 'succeeded' | 'pending' | 'failed' | 'refunded';
export type BillingReason = 
  | 'subscription_create' 
  | 'subscription_cycle' 
  | 'subscription_update'
  | 'manual';

export interface Payment {
  id: string;
  subscriptionId: string;
  stripePaymentIntentId: string | null;
  stripeInvoiceId: string | null;
  amount: number;
  currency: string;
  status: PaymentStatus;
  billingReason: BillingReason | null;
  invoiceUrl: string | null;
  receiptUrl: string | null;
  failureReason: string | null;
  createdAt: Date;
}

// =============================================================================
// USAGE TRACKING TYPES
// =============================================================================

export type UsageAction = 
  | 'scan_created'
  | 'scan_completed'
  | 'pdf_generated'
  | 'api_call'
  | 'competitor_analysis'
  | 'project_created'
  | 'team_member_added';

export interface UsageRecord {
  id: string;
  userId: string | null;
  guestId: string | null;
  action: UsageAction;
  resourceId: string | null;
  date: Date;
  hour: number | null;
  ipAddress: string | null;
  userAgent: string | null;
  metadata: Record<string, unknown> | null;
  createdAt: Date;
}

export interface DailyUsageSummary {
  date: Date;
  scans: number;
  pdfExports: number;
  apiCalls: number;
  competitorAnalyses: number;
}

// =============================================================================
// GUEST FINGERPRINT TYPES
// =============================================================================

export interface GuestFingerprint {
  id: string;
  fingerprint: string;
  ipAddresses: string[];
  scansToday: number;
  lastScanDate: Date | null;
  abuseScore: number;
  isBlocked: boolean;
  blockReason: string | null;
  createdAt: Date;
  updatedAt: Date;
}

// =============================================================================
// COUPON TYPES
// =============================================================================

export type DiscountType = 'percent' | 'fixed_amount';

export interface Coupon {
  id: string;
  code: string;
  stripeCouponId: string | null;
  discountType: DiscountType;
  discountValue: number;
  applicablePlans: PlanName[];
  minPurchaseAmount: number | null;
  maxUses: number | null;
  maxUsesPerUser: number;
  usedCount: number;
  durationMonths: number | null;
  validFrom: Date;
  validUntil: Date | null;
  isActive: boolean;
  createdAt: Date;
}

export interface CouponUsage {
  id: string;
  couponId: string;
  userId: string;
  subscriptionId: string | null;
  appliedAt: Date;
  discountAmount: number;
}

// =============================================================================
// QUOTA & LIMIT TYPES
// =============================================================================

export interface QuotaStatus {
  /** Action being tracked (e.g., 'scan_created') */
  action: UsageAction;
  /** Number of uses today */
  used: number;
  /** Maximum allowed per day (-1 = unlimited) */
  limit: number;
  /** Remaining uses today (-1 = unlimited) */
  remaining: number;
  /** When the quota resets (next midnight UTC) */
  resetAt: Date;
  /** Whether the user is at or over limit */
  isExceeded: boolean;
}

export interface UserQuotaInfo {
  plan: PlanName;
  billingCycle: BillingCycle | null;
  quotas: {
    scans: QuotaStatus;
    pdfExports: QuotaStatus;
    apiCalls: QuotaStatus;
  };
  /** Active concurrent scans */
  concurrentScans: {
    current: number;
    limit: number;
  };
}

// =============================================================================
// CHECKOUT & BILLING TYPES
// =============================================================================

export interface CheckoutSessionRequest {
  planName: PlanName;
  billingCycle: BillingCycle;
  couponCode?: string;
  successUrl: string;
  cancelUrl: string;
}

export interface CheckoutSessionResponse {
  sessionId: string;
  url: string;
}

export interface BillingPortalRequest {
  returnUrl: string;
}

export interface BillingPortalResponse {
  url: string;
}

// =============================================================================
// UPGRADE PROMPT TYPES
// =============================================================================

export type UpgradeTrigger = 
  | 'quota_exceeded'
  | 'feature_locked'
  | 'trial_ended'
  | 'soft_wall'
  | 'concurrent_limit';

export interface UpgradePromptData {
  trigger: UpgradeTrigger;
  feature?: string;
  currentPlan: PlanName | 'guest';
  quotaInfo?: QuotaStatus;
  suggestedPlan: PlanName;
  message: string;
  ctaText: string;
  ctaUrl: string;
}

// =============================================================================
// API RESPONSE TYPES
// =============================================================================

export interface QuotaCheckResponse {
  allowed: boolean;
  quotaStatus: QuotaStatus;
  upgradePrompt?: UpgradePromptData;
}

export interface SubscriptionResponse {
  subscription: SubscriptionWithPlan | null;
  isActive: boolean;
  isTrial: boolean;
  daysRemaining: number | null;
}

// =============================================================================
// STRIPE WEBHOOK TYPES
// =============================================================================

export interface StripeWebhookEvent {
  id: string;
  type: string;
  data: {
    object: Record<string, unknown>;
  };
  created: number;
}

export type StripeWebhookEventType =
  | 'checkout.session.completed'
  | 'customer.subscription.created'
  | 'customer.subscription.updated'
  | 'customer.subscription.deleted'
  | 'invoice.paid'
  | 'invoice.payment_failed'
  | 'customer.updated';

// =============================================================================
// CONSTANTS
// =============================================================================

export const GUEST_DAILY_SCAN_LIMIT = 3;
export const FREE_USER_DAILY_SCAN_LIMIT = 5;
export const TRIAL_DAYS = 14;

export const PLAN_DEFAULTS: Record<PlanName, PlanLimits & PlanFeatures & { price: { monthly: number; yearly: number } }> = {
  free: {
    scansPerDay: 5,
    concurrentScans: 2,
    historyDays: 7,
    maxProjects: 1,
    maxTeamMembers: 1,
    apiCallsPerMonth: 0,
    hasPdfExport: true,
    hasWhiteLabel: false,
    hasCompetitors: false,
    hasApiAccess: false,
    hasPrioritySupport: false,
    price: { monthly: 0, yearly: 0 }
  },
  pro: {
    scansPerDay: -1,
    concurrentScans: 5,
    historyDays: 90,
    maxProjects: 10,
    maxTeamMembers: 3,
    apiCallsPerMonth: 1000,
    hasPdfExport: true,
    hasWhiteLabel: true,
    hasCompetitors: true,
    hasApiAccess: true,
    hasPrioritySupport: false,
    price: { monthly: 49, yearly: 468 }
  },
  enterprise: {
    scansPerDay: -1,
    concurrentScans: 20,
    historyDays: -1,
    maxProjects: -1,
    maxTeamMembers: -1,
    apiCallsPerMonth: -1,
    hasPdfExport: true,
    hasWhiteLabel: true,
    hasCompetitors: true,
    hasApiAccess: true,
    hasPrioritySupport: true,
    price: { monthly: 199, yearly: 1908 }
  }
};
