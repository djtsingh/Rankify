/**
 * Quota API Endpoints
 * 
 * Endpoints for checking and recording usage quotas.
 * Used by the frontend before performing rate-limited actions.
 */

import { app, HttpRequest, HttpResponseInit, InvocationContext, Timer } from "@azure/functions";
import { checkQuota, recordUsage, resetDailyGuestCounters, flagPotentialAbuse, UsageAction } from "../lib/usage-tracking";
import { getCorsHeaders } from "../lib/swa-auth";
import { hashIpAddress } from "../lib/privacy";

const CORS_HEADERS = getCorsHeaders();
const CORS_ORIGIN = process.env.CORS_ORIGIN || 'https://rankify.page';

// =============================================================================
// CHECK QUOTA
// =============================================================================

interface QuotaCheckRequest {
  userId?: string;
  fingerprint?: string;
  action: UsageAction;
}

export async function checkQuotaEndpoint(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  context.log('Checking quota');

  try {
    const body = await request.json() as QuotaCheckRequest;

    if (!body.action) {
      return {
        status: 400,
        headers: { 
          'Content-Type': 'application/json',
          ...CORS_HEADERS
        },
        jsonBody: { error: 'Action is required' }
      };
    }

    // Must have either userId or fingerprint
    if (!body.userId && !body.fingerprint) {
      return {
        status: 400,
        headers: { 
          'Content-Type': 'application/json',
          ...CORS_HEADERS
        },
        jsonBody: { error: 'Either userId or fingerprint is required' }
      };
    }

    const quota = await checkQuota(body.action, {
      userId: body.userId,
      fingerprint: body.fingerprint,
      ipAddress: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'
    });

    return {
      status: 200,
      headers: { 
        'Content-Type': 'application/json',
        ...CORS_HEADERS
      },
      jsonBody: quota
    };

  } catch (error) {
    context.error('Error checking quota:', error);
    return {
      status: 500,
      headers: { 
        'Content-Type': 'application/json',
        ...CORS_HEADERS
      },
      jsonBody: { error: 'Failed to check quota' }
    };
  }
}

// =============================================================================
// RECORD USAGE
// =============================================================================

interface RecordUsageRequest {
  userId?: string;
  fingerprint?: string;
  action: UsageAction;
  metadata?: Record<string, unknown>;
}

export async function recordUsageEndpoint(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  context.log('Recording usage');

  try {
    const body = await request.json() as RecordUsageRequest;

    if (!body.action) {
      return {
        status: 400,
        headers: { 
          'Content-Type': 'application/json',
          ...CORS_HEADERS
        },
        jsonBody: { error: 'Action is required' }
      };
    }

    if (!body.userId && !body.fingerprint) {
      return {
        status: 400,
        headers: { 
          'Content-Type': 'application/json',
          ...CORS_HEADERS
        },
        jsonBody: { error: 'Either userId or fingerprint is required' }
      };
    }

    // Check quota first
    const ipAddress = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
    
    const quotaBefore = await checkQuota(body.action, {
      userId: body.userId,
      fingerprint: body.fingerprint,
      ipAddress
    });

    if (!quotaBefore.allowed) {
      return {
        status: 429,
        headers: { 
          'Content-Type': 'application/json',
          ...CORS_HEADERS,
          'Retry-After': Math.ceil((quotaBefore.resetAt.getTime() - Date.now()) / 1000).toString()
        },
        jsonBody: {
          error: 'Quota exceeded',
          quota: quotaBefore
        }
      };
    }

    // Record the usage
    await recordUsage(body.action, {
      userId: body.userId,
      fingerprint: body.fingerprint,
      ipAddress,
      metadata: body.metadata
    });

    // Get updated quota
    const quotaAfter = await checkQuota(body.action, {
      userId: body.userId,
      fingerprint: body.fingerprint,
      ipAddress
    });

    return {
      status: 200,
      headers: { 
        'Content-Type': 'application/json',
        ...CORS_HEADERS
      },
      jsonBody: {
        recorded: true,
        quota: quotaAfter
      }
    };

  } catch (error) {
    context.error('Error recording usage:', error);
    return {
      status: 500,
      headers: { 
        'Content-Type': 'application/json',
        ...CORS_HEADERS
      },
      jsonBody: { error: 'Failed to record usage' }
    };
  }
}

// =============================================================================
// GET QUOTA STATUS (for display)
// =============================================================================

export async function getQuotaStatus(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  const userId = request.query.get('userId');
  const fingerprint = request.query.get('fingerprint');
  const action = (request.query.get('action') || 'scan') as UsageAction;

  if (!userId && !fingerprint) {
    return {
      status: 400,
      headers: { 
        'Content-Type': 'application/json',
        ...CORS_HEADERS
      },
      jsonBody: { error: 'Either userId or fingerprint query param is required' }
    };
  }

  try {
    const ipAddress = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
    
    const quota = await checkQuota(action, {
      userId: userId || undefined,
      fingerprint: fingerprint || undefined,
      ipAddress
    });

    return {
      status: 200,
      headers: { 
        'Content-Type': 'application/json',
        ...CORS_HEADERS
      },
      jsonBody: quota
    };

  } catch (error) {
    context.error('Error getting quota status:', error);
    return {
      status: 500,
      headers: { 
        'Content-Type': 'application/json',
        ...CORS_HEADERS
      },
      jsonBody: { error: 'Failed to get quota status' }
    };
  }
}

// =============================================================================
// RESET GUEST COUNTERS (CRON JOB)
// =============================================================================

export async function resetGuestCountersCron(myTimer: Timer, context: InvocationContext): Promise<void> {
  context.log('Running daily guest counter reset');
  context.log(`Timer triggered at: ${myTimer.scheduleStatus?.last || 'unknown'}`);
  
  try {
    const resetCount = await resetDailyGuestCounters();
    context.log(`Reset ${resetCount} guest counters`);
  } catch (error) {
    context.error('Error resetting guest counters:', error);
    throw error;
  }
}

// =============================================================================
// REPORT ABUSE
// =============================================================================

interface AbuseReportRequest {
  fingerprint: string;
  reason: string;
  evidence?: Record<string, unknown>;
}

export async function reportAbuse(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  // This endpoint is for internal use only
  const apiKey = request.headers.get('x-admin-key');
  if (apiKey !== process.env.ADMIN_API_KEY) {
    return {
      status: 401,
      body: 'Unauthorized'
    };
  }

  try {
    const body = await request.json() as AbuseReportRequest;

    if (!body.fingerprint || !body.reason) {
      return {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
        jsonBody: { error: 'Fingerprint and reason are required' }
      };
    }

    await flagPotentialAbuse(body.fingerprint, body.reason);

    return {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
      jsonBody: {
        flagged: true,
        fingerprint: body.fingerprint,
        reason: body.reason
      }
    };

  } catch (error) {
    context.error('Error flagging abuse:', error);
    return {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
      jsonBody: { error: 'Failed to flag abuse' }
    };
  }
}

// =============================================================================
// CORS PREFLIGHT
// =============================================================================

export async function quotaCors(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  return {
    status: 204,
    headers: {
      ...CORS_HEADERS,
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': '86400'
    }
  };
}

// =============================================================================
// REGISTER FUNCTIONS
// =============================================================================

app.http('quota-check', {
  methods: ['POST'],
  route: 'quota/check',
  authLevel: 'anonymous',
  handler: checkQuotaEndpoint
});

app.http('quota-record', {
  methods: ['POST'],
  route: 'quota/record',
  authLevel: 'anonymous',
  handler: recordUsageEndpoint
});

app.http('quota-status', {
  methods: ['GET'],
  route: 'quota/status',
  authLevel: 'anonymous',
  handler: getQuotaStatus
});

app.http('quota-report-abuse', {
  methods: ['POST'],
  route: 'quota/abuse',
  authLevel: 'anonymous',
  handler: reportAbuse
});

app.http('quota-cors', {
  methods: ['OPTIONS'],
  route: 'quota/{*path}',
  authLevel: 'anonymous',
  handler: quotaCors
});

// Timer function for daily reset (runs at midnight UTC)
app.timer('quota-reset-daily', {
  schedule: '0 0 0 * * *', // Every day at midnight UTC
  handler: resetGuestCountersCron,
  runOnStartup: false
});
