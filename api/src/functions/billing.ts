/**
 * Billing API Functions
 * 
 * Azure Functions endpoints for Stripe billing operations:
 * - Checkout session creation
 * - Billing portal access
 * - Subscription status
 * - Coupon validation
 * 
 * SECURITY: All endpoints require Azure SWA authentication.
 * User identity is validated via x-ms-client-principal header.
 */

import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import {
  createCheckoutSession,
  createBillingPortalSession,
  getActiveSubscription,
  validateCoupon,
  cancelSubscription,
  reactivateSubscription
} from "../lib/subscription";
import { checkRateLimit, RATE_LIMIT_CONFIGS, getClientIp } from "../lib/rate-limit";
import { prisma } from "../lib/prisma";
import { getAuthenticatedUserFromSWA, getCorsHeaders, unauthorizedResponse } from "../lib/swa-auth";

// =============================================================================
// CORS HEADERS
// =============================================================================

const CORS_HEADERS = getCorsHeaders();

// =============================================================================
// AUTH HELPER
// =============================================================================

/**
 * Get authenticated user from Azure SWA client principal.
 * Returns user info synced/fetched from our database.
 */
async function getAuthenticatedUser(request: HttpRequest): Promise<{ id: string; email: string } | null> {
  const swaUser = getAuthenticatedUserFromSWA(request);
  
  if (!swaUser) {
    return null;
  }

  // Find user in our database by email (SWA userId is opaque)
  try {
    const user = await prisma.user.findUnique({
      where: { email: swaUser.email }
    });

    if (!user) {
      // User authenticated with SWA but not synced to our DB yet
      // This shouldn't happen if auth-sync is working, but handle gracefully
      return null;
    }

    return {
      id: user.id,
      email: user.email
    };
  } catch (error) {
    console.error('Failed to fetch user from database:', error);
    return null;
  }
}

// =============================================================================
// CREATE CHECKOUT SESSION
// =============================================================================

export async function createCheckout(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  context.log('Create checkout session request received');

  if (request.method === 'OPTIONS') {
    return { status: 204, headers: CORS_HEADERS };
  }

  // Rate limit
  const rateLimitResult = checkRateLimit(request, RATE_LIMIT_CONFIGS.api);
  if (!rateLimitResult.allowed) {
    return rateLimitResult.response!;
  }

  // Auth required
  const user = await getAuthenticatedUser(request);
  if (!user) {
    return {
      status: 401,
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
      jsonBody: { error: 'Authentication required' }
    };
  }

  try {
    const body = await request.json() as {
      planName?: 'pro' | 'enterprise';
      billingCycle?: 'monthly' | 'yearly';
      couponCode?: string;
      successUrl?: string;
      cancelUrl?: string;
    };

    const { planName, billingCycle, couponCode, successUrl, cancelUrl } = body;

    if (!planName || !['pro', 'enterprise'].includes(planName)) {
      return {
        status: 400,
        headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
        jsonBody: { error: 'Invalid plan name. Must be "pro" or "enterprise".' }
      };
    }

    if (!billingCycle || !['monthly', 'yearly'].includes(billingCycle)) {
      return {
        status: 400,
        headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
        jsonBody: { error: 'Invalid billing cycle. Must be "monthly" or "yearly".' }
      };
    }

    const result = await createCheckoutSession({
      userId: user.id,
      email: user.email,
      planName,
      billingCycle,
      couponCode,
      successUrl,
      cancelUrl
    });

    return {
      status: 200,
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
      jsonBody: result
    };

  } catch (error) {
    context.error('Error creating checkout session:', error);

    return {
      status: 500,
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
      jsonBody: { 
        error: 'Failed to create checkout session. Please try again or contact support.'
      }
    };
  }
}

// =============================================================================
// BILLING PORTAL
// =============================================================================

export async function billingPortal(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  context.log('Billing portal request received');

  if (request.method === 'OPTIONS') {
    return { status: 204, headers: CORS_HEADERS };
  }

  const user = await getAuthenticatedUser(request);
  if (!user) {
    return {
      status: 401,
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
      jsonBody: { error: 'Authentication required' }
    };
  }

  try {
    const body = await request.json() as { returnUrl?: string };
    const url = await createBillingPortalSession(user.id, body.returnUrl);

    return {
      status: 200,
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
      jsonBody: { url }
    };

  } catch (error) {
    context.error('Error creating billing portal session:', error);

    return {
      status: 500,
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
      jsonBody: { 
        error: 'Failed to access billing portal. Please try again or contact support.'
      }
    };
  }
}

// =============================================================================
// GET SUBSCRIPTION STATUS
// =============================================================================

export async function getSubscription(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  context.log('Get subscription request received');

  if (request.method === 'OPTIONS') {
    return { status: 204, headers: CORS_HEADERS };
  }

  const user = await getAuthenticatedUser(request);
  if (!user) {
    return {
      status: 401,
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
      jsonBody: { error: 'Authentication required' }
    };
  }

  try {
    const subscription = await getActiveSubscription(user.id);

    if (!subscription) {
      return {
        status: 200,
        headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
        jsonBody: {
          subscription: null,
          isActive: false,
          isTrial: false,
          daysRemaining: null,
          plan: 'free'
        }
      };
    }

    // Calculate days remaining
    let daysRemaining: number | null = null;
    const now = new Date();

    if (subscription.status === 'trialing' && subscription.trialEndDate) {
      daysRemaining = Math.ceil(
        (subscription.trialEndDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
      );
    } else if (subscription.currentPeriodEnd) {
      daysRemaining = Math.ceil(
        (subscription.currentPeriodEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
      );
    }

    return {
      status: 200,
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
      jsonBody: {
        subscription: {
          id: subscription.id,
          planId: subscription.planId,
          planName: subscription.plan.name,
          status: subscription.status,
          billingCycle: subscription.billingCycle,
          currentPeriodStart: subscription.currentPeriodStart,
          currentPeriodEnd: subscription.currentPeriodEnd,
          cancelAtPeriodEnd: subscription.cancelAtPeriodEnd,
          trialEndDate: subscription.trialEndDate
        },
        plan: {
          name: subscription.plan.name,
          displayName: subscription.plan.displayName,
          limits: {
            scansPerDay: subscription.plan.scansPerDay,
            concurrentScans: subscription.plan.concurrentScans,
            historyDays: subscription.plan.historyDays,
            maxProjects: subscription.plan.maxProjects,
            maxTeamMembers: subscription.plan.maxTeamMembers,
            apiCallsPerMonth: subscription.plan.apiCallsPerMonth
          },
          features: {
            hasPdfExport: subscription.plan.hasPdfExport,
            hasWhiteLabel: subscription.plan.hasWhiteLabel,
            hasCompetitors: subscription.plan.hasCompetitors,
            hasApiAccess: subscription.plan.hasApiAccess,
            hasPrioritySupport: subscription.plan.hasPrioritySupport
          }
        },
        isActive: ['active', 'trialing'].includes(subscription.status),
        isTrial: subscription.status === 'trialing',
        daysRemaining
      }
    };

  } catch (error) {
    context.error('Error getting subscription:', error);

    return {
      status: 500,
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
      jsonBody: { error: 'Failed to get subscription' }
    };
  }
}

// =============================================================================
// CANCEL SUBSCRIPTION
// =============================================================================

export async function cancelSub(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  context.log('Cancel subscription request received');

  if (request.method === 'OPTIONS') {
    return { status: 204, headers: CORS_HEADERS };
  }

  const user = await getAuthenticatedUser(request);
  if (!user) {
    return {
      status: 401,
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
      jsonBody: { error: 'Authentication required' }
    };
  }

  try {
    const body = await request.json() as { immediately?: boolean };
    await cancelSubscription(user.id, body.immediately || false);

    return {
      status: 200,
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
      jsonBody: { 
        success: true,
        message: body.immediately 
          ? 'Subscription cancelled immediately' 
          : 'Subscription will be cancelled at the end of the billing period'
      }
    };

  } catch (error) {
    context.error('Error cancelling subscription:', error);

    return {
      status: 500,
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
      jsonBody: { error: 'Failed to cancel subscription' }
    };
  }
}

// =============================================================================
// REACTIVATE SUBSCRIPTION
// =============================================================================

export async function reactivateSub(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  context.log('Reactivate subscription request received');

  if (request.method === 'OPTIONS') {
    return { status: 204, headers: CORS_HEADERS };
  }

  const user = await getAuthenticatedUser(request);
  if (!user) {
    return {
      status: 401,
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
      jsonBody: { error: 'Authentication required' }
    };
  }

  try {
    await reactivateSubscription(user.id);

    return {
      status: 200,
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
      jsonBody: { 
        success: true,
        message: 'Subscription reactivated successfully'
      }
    };

  } catch (error) {
    context.error('Error reactivating subscription:', error);

    return {
      status: 500,
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
      jsonBody: { error: 'Failed to reactivate subscription' }
    };
  }
}

// =============================================================================
// VALIDATE COUPON
// =============================================================================

export async function validateCouponCode(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  context.log('Validate coupon request received');

  if (request.method === 'OPTIONS') {
    return { status: 204, headers: CORS_HEADERS };
  }

  try {
    const body = await request.json() as { code?: string; planName?: string };
    const { code, planName } = body;

    if (!code) {
      return {
        status: 400,
        headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
        jsonBody: { error: 'Coupon code is required' }
      };
    }

    const user = await getAuthenticatedUser(request);
    const result = await validateCoupon(code, planName || 'pro', user?.id);

    return {
      status: result.valid ? 200 : 400,
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
      jsonBody: result
    };

  } catch (error) {
    context.error('Error validating coupon:', error);

    return {
      status: 500,
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
      jsonBody: { error: 'Failed to validate coupon' }
    };
  }
}

// =============================================================================
// GET PLANS
// =============================================================================

export async function getPlans(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  context.log('Get plans request received');

  if (request.method === 'OPTIONS') {
    return { status: 204, headers: CORS_HEADERS };
  }

  try {
    const plans = await prisma.plan.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' }
    });

    const formattedPlans = plans.map(plan => ({
      id: plan.id,
      name: plan.name,
      displayName: plan.displayName,
      description: plan.description,
      price: {
        monthly: Number(plan.priceMonthly),
        yearly: Number(plan.priceYearly)
      },
      limits: {
        scansPerDay: plan.scansPerDay,
        concurrentScans: plan.concurrentScans,
        historyDays: plan.historyDays,
        maxProjects: plan.maxProjects,
        maxTeamMembers: plan.maxTeamMembers,
        apiCallsPerMonth: plan.apiCallsPerMonth
      },
      features: {
        hasPdfExport: plan.hasPdfExport,
        hasWhiteLabel: plan.hasWhiteLabel,
        hasCompetitors: plan.hasCompetitors,
        hasApiAccess: plan.hasApiAccess,
        hasPrioritySupport: plan.hasPrioritySupport
      }
    }));

    return {
      status: 200,
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
      jsonBody: { plans: formattedPlans }
    };

  } catch (error) {
    context.error('Error getting plans:', error);

    return {
      status: 500,
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
      jsonBody: { error: 'Failed to get plans' }
    };
  }
}

// =============================================================================
// REGISTER FUNCTIONS
// =============================================================================

app.http('billing-checkout', {
  methods: ['POST', 'OPTIONS'],
  route: 'billing/checkout',
  authLevel: 'anonymous',
  handler: createCheckout
});

app.http('billing-portal', {
  methods: ['POST', 'OPTIONS'],
  route: 'billing/portal',
  authLevel: 'anonymous',
  handler: billingPortal
});

app.http('billing-subscription', {
  methods: ['GET', 'OPTIONS'],
  route: 'billing/subscription',
  authLevel: 'anonymous',
  handler: getSubscription
});

app.http('billing-cancel', {
  methods: ['POST', 'OPTIONS'],
  route: 'billing/cancel',
  authLevel: 'anonymous',
  handler: cancelSub
});

app.http('billing-reactivate', {
  methods: ['POST', 'OPTIONS'],
  route: 'billing/reactivate',
  authLevel: 'anonymous',
  handler: reactivateSub
});

app.http('billing-validate-coupon', {
  methods: ['POST', 'OPTIONS'],
  route: 'billing/validate-coupon',
  authLevel: 'anonymous',
  handler: validateCouponCode
});

app.http('billing-plans', {
  methods: ['GET', 'OPTIONS'],
  route: 'billing/plans',
  authLevel: 'anonymous',
  handler: getPlans
});
