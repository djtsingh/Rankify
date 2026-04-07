/**
 * Stripe Subscription Service
 * 
 * Handles all Stripe-related operations including:
 * - Customer management
 * - Checkout session creation
 * - Subscription management
 * - Webhook handling
 * - Billing portal
 */

import Stripe from 'stripe';
import { prisma } from './prisma';

// =============================================================================
// CONFIGURATION
// =============================================================================

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET;
const APP_URL = process.env.APP_URL || 'https://rankify.page';
const DASHBOARD_URL = process.env.DASHBOARD_URL || 'https://app.rankify.page';

// Initialize Stripe client (only if key is available)
let stripe: Stripe | null = null;

function getStripe(): Stripe {
  if (!stripe) {
    if (!STRIPE_SECRET_KEY) {
      throw new Error('STRIPE_SECRET_KEY is not configured');
    }
    stripe = new Stripe(STRIPE_SECRET_KEY, {
      apiVersion: '2023-10-16',
      typescript: true
    });
  }
  return stripe;
}

// Trial period in days
const TRIAL_DAYS = 14;

// =============================================================================
// TYPES
// =============================================================================

export interface CreateCheckoutParams {
  userId: string;
  email: string;
  planName: 'pro' | 'enterprise';
  billingCycle: 'monthly' | 'yearly';
  couponCode?: string;
  successUrl?: string;
  cancelUrl?: string;
}

export interface CheckoutResult {
  sessionId: string;
  url: string;
}

export interface WebhookResult {
  handled: boolean;
  event: string;
  message?: string;
}

// =============================================================================
// CUSTOMER MANAGEMENT
// =============================================================================

/**
 * Get or create a Stripe customer for a user
 */
export async function getOrCreateStripeCustomer(
  userId: string,
  email: string,
  name?: string
): Promise<string> {
  // Check if user already has a Stripe customer ID
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { stripeCustomerId: true, email: true, name: true }
  });

  if (user?.stripeCustomerId) {
    return user.stripeCustomerId;
  }

  // Create new Stripe customer
  const stripeClient = getStripe();
  const customer = await stripeClient.customers.create({
    email: email || user?.email,
    name: name || user?.name || undefined,
    metadata: {
      userId: userId,
      source: 'rankify'
    }
  });

  // Save customer ID to user record
  await prisma.user.update({
    where: { id: userId },
    data: { stripeCustomerId: customer.id }
  });

  return customer.id;
}

// =============================================================================
// CHECKOUT SESSIONS
// =============================================================================

/**
 * Create a Stripe Checkout session for subscription
 */
export async function createCheckoutSession(
  params: CreateCheckoutParams
): Promise<CheckoutResult> {
  const { userId, email, planName, billingCycle, couponCode, successUrl, cancelUrl } = params;

  // Get plan from database
  const plan = await prisma.plan.findUnique({
    where: { name: planName }
  });

  if (!plan) {
    throw new Error(`Plan not found: ${planName}`);
  }

  // Get the appropriate price ID
  const priceId = billingCycle === 'yearly' 
    ? plan.stripePriceIdYr 
    : plan.stripePriceIdMo;

  if (!priceId) {
    throw new Error(`No Stripe price configured for ${planName} ${billingCycle}`);
  }

  // Get or create Stripe customer
  const customerId = await getOrCreateStripeCustomer(userId, email);

  // Build checkout session parameters
  const stripeClient = getStripe();
  const sessionParams: Stripe.Checkout.SessionCreateParams = {
    customer: customerId,
    mode: 'subscription',
    payment_method_types: ['card'],
    line_items: [
      {
        price: priceId,
        quantity: 1
      }
    ],
    subscription_data: {
      trial_period_days: TRIAL_DAYS,
      metadata: {
        userId,
        planName,
        billingCycle
      }
    },
    success_url: successUrl || `${DASHBOARD_URL}/billing?success=true&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: cancelUrl || `${APP_URL}/pricing?cancelled=true`,
    metadata: {
      userId,
      planName,
      billingCycle
    },
    allow_promotion_codes: true,
    billing_address_collection: 'auto',
    customer_update: {
      address: 'auto',
      name: 'auto'
    }
  };

  // Apply coupon if provided
  if (couponCode) {
    const coupon = await prisma.coupon.findUnique({
      where: { code: couponCode.toUpperCase() }
    });

    if (coupon?.stripeCouponId && coupon.isActive) {
      sessionParams.discounts = [{ coupon: coupon.stripeCouponId }];
    }
  }

  // Create checkout session
  const session = await stripeClient.checkout.sessions.create(sessionParams);

  return {
    sessionId: session.id,
    url: session.url!
  };
}

// =============================================================================
// BILLING PORTAL
// =============================================================================

/**
 * Create a billing portal session for subscription management
 */
export async function createBillingPortalSession(
  userId: string,
  returnUrl?: string
): Promise<string> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { stripeCustomerId: true }
  });

  if (!user?.stripeCustomerId) {
    throw new Error('User does not have a Stripe customer ID');
  }

  const stripeClient = getStripe();
  const session = await stripeClient.billingPortal.sessions.create({
    customer: user.stripeCustomerId,
    return_url: returnUrl || `${DASHBOARD_URL}/billing`
  });

  return session.url;
}

// =============================================================================
// SUBSCRIPTION MANAGEMENT
// =============================================================================

/**
 * Get user's active subscription
 */
export async function getActiveSubscription(userId: string) {
  const subscription = await prisma.subscription.findFirst({
    where: {
      userId,
      status: { in: ['active', 'trialing'] }
    },
    include: {
      plan: true
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  return subscription;
}

/**
 * Cancel a subscription at period end
 */
export async function cancelSubscription(
  userId: string,
  immediately: boolean = false
): Promise<void> {
  const subscription = await getActiveSubscription(userId);

  if (!subscription?.stripeSubscriptionId) {
    throw new Error('No active subscription found');
  }

  const stripeClient = getStripe();

  if (immediately) {
    // Cancel immediately
    await stripeClient.subscriptions.cancel(subscription.stripeSubscriptionId);
    
    await prisma.subscription.update({
      where: { id: subscription.id },
      data: {
        status: 'cancelled',
        cancelledAt: new Date()
      }
    });
  } else {
    // Cancel at end of billing period
    await stripeClient.subscriptions.update(subscription.stripeSubscriptionId, {
      cancel_at_period_end: true
    });

    await prisma.subscription.update({
      where: { id: subscription.id },
      data: {
        cancelAtPeriodEnd: true
      }
    });
  }
}

/**
 * Reactivate a cancelled subscription (if still in period)
 */
export async function reactivateSubscription(userId: string): Promise<void> {
  const subscription = await prisma.subscription.findFirst({
    where: {
      userId,
      cancelAtPeriodEnd: true
    }
  });

  if (!subscription?.stripeSubscriptionId) {
    throw new Error('No cancelled subscription found to reactivate');
  }

  const stripeClient = getStripe();
  await stripeClient.subscriptions.update(subscription.stripeSubscriptionId, {
    cancel_at_period_end: false
  });

  await prisma.subscription.update({
    where: { id: subscription.id },
    data: {
      cancelAtPeriodEnd: false
    }
  });
}

// =============================================================================
// WEBHOOK HANDLERS
// =============================================================================

/**
 * Verify and construct Stripe webhook event
 */
export function constructWebhookEvent(
  payload: string | Buffer,
  signature: string
): Stripe.Event {
  if (!STRIPE_WEBHOOK_SECRET) {
    throw new Error('STRIPE_WEBHOOK_SECRET is not configured');
  }

  const stripeClient = getStripe();
  return stripeClient.webhooks.constructEvent(
    payload,
    signature,
    STRIPE_WEBHOOK_SECRET
  );
}

/**
 * Handle Stripe webhook events
 */
export async function handleWebhookEvent(event: Stripe.Event): Promise<WebhookResult> {
  const eventType = event.type;

  try {
    switch (eventType) {
      case 'checkout.session.completed':
        await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session);
        break;

      case 'customer.subscription.created':
      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object as Stripe.Subscription);
        break;

      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
        break;

      case 'invoice.paid':
        await handleInvoicePaid(event.data.object as Stripe.Invoice);
        break;

      case 'invoice.payment_failed':
        await handleInvoicePaymentFailed(event.data.object as Stripe.Invoice);
        break;

      default:
        return { handled: false, event: eventType, message: 'Event type not handled' };
    }

    return { handled: true, event: eventType };

  } catch (error) {
    console.error(`Error handling webhook event ${eventType}:`, error);
    throw error;
  }
}

/**
 * Handle successful checkout completion
 */
async function handleCheckoutCompleted(session: Stripe.Checkout.Session): Promise<void> {
  const userId = session.metadata?.userId;
  const planName = session.metadata?.planName;
  const billingCycle = session.metadata?.billingCycle;

  if (!userId || !planName) {
    console.warn('Checkout session missing required metadata');
    return;
  }

  // Get plan
  const plan = await prisma.plan.findUnique({
    where: { name: planName }
  });

  if (!plan) {
    console.error(`Plan not found: ${planName}`);
    return;
  }

  // Subscription will be created via customer.subscription.created event
  // Just log the checkout completion
  console.log(`Checkout completed for user ${userId}, plan ${planName}`);
}

/**
 * Handle subscription created or updated
 */
async function handleSubscriptionUpdated(subscription: Stripe.Subscription): Promise<void> {
  const userId = subscription.metadata?.userId;
  if (!userId) {
    console.warn('Subscription missing userId in metadata');
    return;
  }

  const planName = subscription.metadata?.planName || 'pro';
  const plan = await prisma.plan.findUnique({
    where: { name: planName }
  });

  if (!plan) {
    console.error(`Plan not found: ${planName}`);
    return;
  }

  // Map Stripe status to our status
  const statusMap: Record<string, string> = {
    'active': 'active',
    'trialing': 'trialing',
    'past_due': 'past_due',
    'canceled': 'cancelled',
    'unpaid': 'past_due',
    'incomplete': 'incomplete',
    'incomplete_expired': 'expired'
  };

  const status = statusMap[subscription.status] || 'active';

  // Upsert subscription record
  await prisma.subscription.upsert({
    where: {
      stripeSubscriptionId: subscription.id
    },
    create: {
      userId,
      planId: plan.id,
      stripeSubscriptionId: subscription.id,
      status,
      billingCycle: subscription.metadata?.billingCycle || 'monthly',
      trialStartDate: subscription.trial_start 
        ? new Date(subscription.trial_start * 1000) 
        : null,
      trialEndDate: subscription.trial_end 
        ? new Date(subscription.trial_end * 1000) 
        : null,
      currentPeriodStart: new Date(subscription.current_period_start * 1000),
      currentPeriodEnd: new Date(subscription.current_period_end * 1000),
      cancelAtPeriodEnd: subscription.cancel_at_period_end
    },
    update: {
      status,
      currentPeriodStart: new Date(subscription.current_period_start * 1000),
      currentPeriodEnd: new Date(subscription.current_period_end * 1000),
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
      cancelledAt: subscription.canceled_at 
        ? new Date(subscription.canceled_at * 1000) 
        : null
    }
  });
}

/**
 * Handle subscription deletion
 */
async function handleSubscriptionDeleted(subscription: Stripe.Subscription): Promise<void> {
  await prisma.subscription.updateMany({
    where: {
      stripeSubscriptionId: subscription.id
    },
    data: {
      status: 'cancelled',
      cancelledAt: new Date()
    }
  });
}

/**
 * Handle successful invoice payment
 */
async function handleInvoicePaid(invoice: Stripe.Invoice): Promise<void> {
  if (!invoice.subscription || typeof invoice.subscription !== 'string') {
    return;
  }

  const subscription = await prisma.subscription.findUnique({
    where: {
      stripeSubscriptionId: invoice.subscription
    }
  });

  if (!subscription) {
    console.warn(`Subscription not found for invoice: ${invoice.id}`);
    return;
  }

  // Record payment
  await prisma.payment.create({
    data: {
      subscriptionId: subscription.id,
      stripePaymentIntentId: typeof invoice.payment_intent === 'string' 
        ? invoice.payment_intent 
        : invoice.payment_intent?.id,
      stripeInvoiceId: invoice.id,
      amount: invoice.amount_paid / 100, // Convert from cents
      currency: invoice.currency,
      status: 'succeeded',
      billingReason: invoice.billing_reason || undefined,
      invoiceUrl: invoice.hosted_invoice_url || undefined,
      receiptUrl: invoice.invoice_pdf || undefined
    }
  });

  // Update subscription status to active if it was past_due
  if (subscription.status === 'past_due') {
    await prisma.subscription.update({
      where: { id: subscription.id },
      data: { status: 'active' }
    });
  }
}

/**
 * Handle failed invoice payment
 */
async function handleInvoicePaymentFailed(invoice: Stripe.Invoice): Promise<void> {
  if (!invoice.subscription || typeof invoice.subscription !== 'string') {
    return;
  }

  const subscription = await prisma.subscription.findUnique({
    where: {
      stripeSubscriptionId: invoice.subscription
    }
  });

  if (!subscription) {
    return;
  }

  // Record failed payment
  await prisma.payment.create({
    data: {
      subscriptionId: subscription.id,
      stripeInvoiceId: invoice.id,
      amount: invoice.amount_due / 100,
      currency: invoice.currency,
      status: 'failed',
      billingReason: invoice.billing_reason || undefined,
      failureReason: 'Payment failed'
    }
  });

  // Update subscription status
  await prisma.subscription.update({
    where: { id: subscription.id },
    data: { status: 'past_due' }
  });

  // TODO: Send email notification about failed payment
}

// =============================================================================
// COUPON MANAGEMENT
// =============================================================================

/**
 * Validate a coupon code
 */
export async function validateCoupon(
  code: string,
  planName: string,
  userId?: string
): Promise<{
  valid: boolean;
  coupon?: {
    code: string;
    discountType: string;
    discountValue: number;
    durationMonths: number | null;
  };
  error?: string;
}> {
  const coupon = await prisma.coupon.findUnique({
    where: { code: code.toUpperCase() }
  });

  if (!coupon) {
    return { valid: false, error: 'Coupon code not found' };
  }

  if (!coupon.isActive) {
    return { valid: false, error: 'This coupon is no longer active' };
  }

  const now = new Date();
  if (coupon.validUntil && coupon.validUntil < now) {
    return { valid: false, error: 'This coupon has expired' };
  }

  if (coupon.validFrom > now) {
    return { valid: false, error: 'This coupon is not yet valid' };
  }

  if (coupon.maxUses && coupon.usedCount >= coupon.maxUses) {
    return { valid: false, error: 'This coupon has reached its usage limit' };
  }

  if (coupon.applicablePlans.length > 0 && !coupon.applicablePlans.includes(planName)) {
    return { valid: false, error: 'This coupon is not valid for the selected plan' };
  }

  // Check per-user limit
  if (userId && coupon.maxUsesPerUser > 0) {
    const userUsageCount = await prisma.couponUsage.count({
      where: {
        couponId: coupon.id,
        userId
      }
    });

    if (userUsageCount >= coupon.maxUsesPerUser) {
      return { valid: false, error: 'You have already used this coupon' };
    }
  }

  return {
    valid: true,
    coupon: {
      code: coupon.code,
      discountType: coupon.discountType,
      discountValue: Number(coupon.discountValue),
      durationMonths: coupon.durationMonths
    }
  };
}
