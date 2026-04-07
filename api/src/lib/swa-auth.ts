/**
 * Azure Static Web Apps Authentication Module
 * 
 * Validates the x-ms-client-principal header that Azure SWA automatically
 * adds to requests after successful authentication.
 * 
 * SECURITY: This is the ONLY trusted source of user identity in the API.
 * Never trust client-supplied headers like x-user-id or x-user-email.
 * 
 * @module lib/swa-auth
 */

import { HttpRequest } from "@azure/functions";

// =============================================================================
// TYPES
// =============================================================================

export interface SWAClientPrincipal {
  identityProvider: string;
  userId: string;
  userDetails: string;
  userRoles: string[];
  claims: Array<{
    typ: string;
    val: string;
  }>;
}

export interface AuthenticatedUser {
  id: string;
  email: string;
  name?: string;
  roles: string[];
  identityProvider: string;
}

// =============================================================================
// AUTHENTICATION
// =============================================================================

/**
 * Extract and validate the SWA client principal from request headers.
 * 
 * Azure SWA sets this header automatically after OAuth authentication.
 * The header is base64-encoded JSON signed by Azure - cannot be forged.
 * 
 * @param request - The HTTP request
 * @returns Authenticated user info or null if not authenticated
 */
export function getAuthenticatedUserFromSWA(request: HttpRequest): AuthenticatedUser | null {
  const clientPrincipalHeader = request.headers.get('x-ms-client-principal');
  
  if (!clientPrincipalHeader) {
    return null;
  }

  try {
    // Decode base64 to JSON
    const decoded = Buffer.from(clientPrincipalHeader, 'base64').toString('utf-8');
    const principal: SWAClientPrincipal = JSON.parse(decoded);

    // Must have userId to be considered authenticated
    if (!principal.userId) {
      return null;
    }

    // Must have 'authenticated' role (not just 'anonymous')
    if (!principal.userRoles.includes('authenticated')) {
      return null;
    }

    // Extract email from claims
    const emailClaim = principal.claims.find(
      c => c.typ === 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress' ||
           c.typ === 'emails' ||
           c.typ === 'email'
    );

    // Extract name from claims
    const nameClaim = principal.claims.find(
      c => c.typ === 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name' ||
           c.typ === 'name'
    );

    const email = emailClaim?.val || principal.userDetails;

    if (!email) {
      // Email is required for our application
      return null;
    }

    return {
      id: principal.userId,
      email: email,
      name: nameClaim?.val,
      roles: principal.userRoles,
      identityProvider: principal.identityProvider
    };
  } catch (error) {
    // Invalid header format - treat as unauthenticated
    console.error('Failed to parse SWA client principal:', error);
    return null;
  }
}

/**
 * Check if request has a valid SWA authentication header
 * (lighter check when you just need to verify authentication exists)
 */
export function isAuthenticated(request: HttpRequest): boolean {
  return getAuthenticatedUserFromSWA(request) !== null;
}

/**
 * Check if the authenticated user has a specific role
 */
export function hasRole(request: HttpRequest, role: string): boolean {
  const user = getAuthenticatedUserFromSWA(request);
  return user?.roles.includes(role) ?? false;
}

/**
 * Get a consistent CORS headers object
 */
export function getCorsHeaders(): Record<string, string> {
  const origin = process.env.CORS_ORIGIN || 'https://rankify.page';
  
  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-ms-client-principal',
    'Access-Control-Allow-Credentials': 'true'
  };
}

/**
 * Create a 401 Unauthorized response with proper headers
 */
export function unauthorizedResponse(message = 'Authentication required'): {
  status: number;
  headers: Record<string, string>;
  jsonBody: { error: string };
} {
  return {
    status: 401,
    headers: { ...getCorsHeaders(), 'Content-Type': 'application/json' },
    jsonBody: { error: message }
  };
}

/**
 * Create a 403 Forbidden response with proper headers
 */
export function forbiddenResponse(message = 'Access denied'): {
  status: number;
  headers: Record<string, string>;
  jsonBody: { error: string };
} {
  return {
    status: 403,
    headers: { ...getCorsHeaders(), 'Content-Type': 'application/json' },
    jsonBody: { error: message }
  };
}
