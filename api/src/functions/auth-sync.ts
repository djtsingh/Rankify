/**
 * Auth Sync Function
 * 
 * Called by the frontend after successful SWA OAuth sign-in.
 * Creates or updates the user in the database and returns user data.
 * 
 * SECURITY: This endpoint validates the SWA client principal to ensure
 * the email being synced matches the authenticated user.
 */

import { app, HttpRequest, HttpResponseInit, InvocationContext } from '@azure/functions';
import { prisma } from '../lib/prisma';
import { getAuthenticatedUserFromSWA, getCorsHeaders } from '../lib/swa-auth';

const CORS_HEADERS = getCorsHeaders();

interface SyncUserRequest {
  email: string;
  name?: string;
  image?: string;
  provider: string;
  providerAccountId: string;
}

export async function authSync(
  request: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  context.log('Auth sync request received');

  // Handle CORS preflight
  if (request.method === 'OPTIONS') {
    return { status: 204, headers: CORS_HEADERS };
  }

  // Only allow POST
  if (request.method !== 'POST') {
    return {
      status: 405,
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
      jsonBody: { error: 'Method not allowed' }
    };
  }

  // SECURITY: Validate SWA authentication
  const swaUser = getAuthenticatedUserFromSWA(request);
  if (!swaUser) {
    context.warn('Auth sync called without valid SWA authentication');
    return {
      status: 401,
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
      jsonBody: { error: 'Authentication required' }
    };
  }

  try {
    const body = await request.json() as SyncUserRequest;
    
    // SECURITY: Validate that the email in the request matches the SWA user
    // This prevents an attacker from syncing a different user's email
    if (body.email && body.email.toLowerCase() !== swaUser.email.toLowerCase()) {
      context.warn(`Auth sync email mismatch: body=${body.email}, swa=${swaUser.email}`);
      return {
        status: 403,
        headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
        jsonBody: { error: 'Email mismatch' }
      };
    }

    // Use the SWA email as the source of truth
    const email = swaUser.email;
    const name = body.name || swaUser.name;

    // Find or create user
    let user = await prisma.user.findUnique({
      where: { email: email },
      include: {
        subscriptions: {
          where: { status: 'active' },
          include: { plan: true },
          take: 1
        }
      }
    });

    if (!user) {
      // Create new user
      user = await prisma.user.create({
        data: {
          email: email,
          name: name,
          image: body.image,
          emailVerified: new Date(), // OAuth users are verified
        },
        include: {
          subscriptions: {
            where: { status: 'active' },
            include: { plan: true },
            take: 1
          }
        }
      });
      
      context.log(`New user created: ${user.email}`);
    } else {
      // Update existing user if needed
      if (name && !user.name || body.image && !user.image) {
        user = await prisma.user.update({
          where: { id: user.id },
          data: {
            name: name || user.name,
            image: body.image || user.image,
          },
          include: {
            subscriptions: {
              where: { status: 'active' },
              include: { plan: true },
              take: 1
            }
          }
        });
      }
      context.log(`User synced: ${user.email}`);
    }

    // Determine user's current plan
    const activeSub = user.subscriptions[0];
    const plan = activeSub?.plan?.name || 'free';

    return {
      status: 200,
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
      jsonBody: {
        userId: user.id,
        email: user.email,
        name: user.name,
        image: user.image,
        plan: plan,
        stripeCustomerId: user.stripeCustomerId,
      }
    };

  } catch (error) {
    context.error('Auth sync error:', error);
    return {
      status: 500,
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
      jsonBody: { error: 'Failed to sync user. Please try again.' }
    };
  }
}

app.http('authSync', {
  methods: ['POST', 'OPTIONS'],
  authLevel: 'anonymous',
  route: 'auth/sync',
  handler: authSync
});
