/**
 * Stripe Webhook Handler
 * 
 * Handles all incoming Stripe webhook events for subscription management.
 * 
 * Important: This endpoint must:
 * 1. Verify webhook signatures
 * 2. Process events idempotently
 * 3. Respond quickly (defer heavy processing)
 */

import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { constructWebhookEvent, handleWebhookEvent } from "../lib/subscription";

const CORS_ORIGIN = process.env.CORS_ORIGIN || 'https://rankify.page';
const IS_PRODUCTION = process.env.AZURE_FUNCTIONS_ENVIRONMENT === 'Production' || 
                       process.env.NODE_ENV === 'production';

// =============================================================================
// WEBHOOK HANDLER
// =============================================================================

export async function stripeWebhook(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  context.log('Stripe webhook received');

  // Get the webhook signature
  const signature = request.headers.get('stripe-signature');

  if (!signature) {
    context.warn('Missing Stripe signature header');
    return {
      status: 400,
      body: 'Missing signature'
    };
  }

  // Get raw body for signature verification
  const rawBody = await request.text();

  if (!rawBody) {
    context.warn('Empty webhook body');
    return {
      status: 400,
      body: 'Empty body'
    };
  }

  try {
    // Verify and construct the event
    const event = constructWebhookEvent(rawBody, signature);
    
    context.log(`Processing Stripe event: ${event.type} (${event.id})`);

    // Handle the event
    const result = await handleWebhookEvent(event);

    if (result.handled) {
      context.log(`Successfully handled event: ${event.type}`);
    } else {
      context.log(`Event not handled (no handler): ${event.type}`);
    }

    // Always return 200 to acknowledge receipt
    // (Stripe will retry on non-2xx responses)
    return {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
      jsonBody: {
        received: true,
        eventId: event.id,
        eventType: event.type,
        handled: result.handled
      }
    };

  } catch (error) {
    // Signature verification failed
    if (error instanceof Error && error.message.includes('signature')) {
      context.error('Webhook signature verification failed:', error.message);
      return {
        status: 400,
        body: 'Webhook signature verification failed'
      };
    }

    // Other processing error
    context.error('Error processing webhook:', error);
    
    // Return 500 so Stripe will retry
    return {
      status: 500,
      body: 'Internal error processing webhook'
    };
  }
}

// =============================================================================
// WEBHOOK TEST ENDPOINT (development only)
// =============================================================================

export async function testWebhook(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  // Only allow in non-production environments
  // Check both Azure Functions environment and NODE_ENV for security
  if (IS_PRODUCTION) {
    return {
      status: 404,
      body: 'Not found'
    };
  }

  context.log('Test webhook endpoint called');

  try {
    const body = await request.json() as {
      type: string;
      data: Record<string, unknown>;
    };

    // Simulate a Stripe event structure
    const mockEvent = {
      id: `evt_test_${Date.now()}`,
      type: body.type,
      data: {
        object: body.data
      },
      created: Math.floor(Date.now() / 1000)
    };

    context.log(`Simulating Stripe event: ${mockEvent.type}`);

    return {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
      jsonBody: {
        message: 'Test webhook received',
        event: mockEvent,
        note: 'This endpoint is for development testing only'
      }
    };

  } catch (error) {
    context.error('Error in test webhook:', error);
    return {
      status: 400,
      body: 'Invalid request body'
    };
  }
}

// =============================================================================
// LIST WEBHOOK EVENTS (development only)
// =============================================================================

const SUPPORTED_EVENTS = [
  {
    type: 'checkout.session.completed',
    description: 'Customer completed checkout. Creates subscription record.',
    testPayload: {
      id: 'cs_test_123',
      mode: 'subscription',
      customer: 'cus_test_123',
      subscription: 'sub_test_123',
      metadata: {
        userId: 'user_123',
        planName: 'pro',
        billingCycle: 'monthly'
      }
    }
  },
  {
    type: 'customer.subscription.created',
    description: 'New subscription created. Syncs subscription details.',
    testPayload: {
      id: 'sub_test_123',
      customer: 'cus_test_123',
      status: 'trialing',
      trial_start: Math.floor(Date.now() / 1000),
      trial_end: Math.floor(Date.now() / 1000) + (14 * 24 * 60 * 60),
      current_period_start: Math.floor(Date.now() / 1000),
      current_period_end: Math.floor(Date.now() / 1000) + (30 * 24 * 60 * 60),
      metadata: {
        userId: 'user_123',
        planName: 'pro'
      }
    }
  },
  {
    type: 'customer.subscription.updated',
    description: 'Subscription updated. Syncs changes (plan, status, etc).',
  },
  {
    type: 'customer.subscription.deleted',
    description: 'Subscription cancelled/deleted. Marks subscription as cancelled.',
  },
  {
    type: 'invoice.paid',
    description: 'Payment successful. Records payment and updates status.',
    testPayload: {
      id: 'in_test_123',
      subscription: 'sub_test_123',
      amount_paid: 4900,
      currency: 'usd',
      billing_reason: 'subscription_create',
      payment_intent: 'pi_test_123'
    }
  },
  {
    type: 'invoice.payment_failed',
    description: 'Payment failed. Updates subscription to past_due.',
    testPayload: {
      id: 'in_test_123',
      subscription: 'sub_test_123',
      amount_due: 4900,
      currency: 'usd',
      billing_reason: 'subscription_cycle'
    }
  }
];

export async function listWebhookEvents(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  return {
    status: 200,
    headers: { 
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': CORS_ORIGIN
    },
    jsonBody: {
      webhookUrl: '/api/webhooks/stripe',
      supportedEvents: SUPPORTED_EVENTS.map(e => ({
        type: e.type,
        description: e.description
      })),
      setupInstructions: [
        '1. Go to Stripe Dashboard > Developers > Webhooks',
        '2. Add endpoint: https://api.rankify.page/api/webhooks/stripe',
        '3. Select events: ' + SUPPORTED_EVENTS.map(e => e.type).join(', '),
        '4. Copy the signing secret to STRIPE_WEBHOOK_SECRET env var'
      ]
    }
  };
}

// =============================================================================
// REGISTER FUNCTIONS
// =============================================================================

app.http('webhooks-stripe', {
  methods: ['POST'],
  route: 'webhooks/stripe',
  authLevel: 'anonymous',
  handler: stripeWebhook
});

app.http('webhooks-stripe-test', {
  methods: ['POST'],
  route: 'webhooks/stripe/test',
  authLevel: 'anonymous',
  handler: testWebhook
});

app.http('webhooks-stripe-events', {
  methods: ['GET'],
  route: 'webhooks/stripe/events',
  authLevel: 'anonymous',
  handler: listWebhookEvents
});
