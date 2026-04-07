/**
 * Rate Limiting Module for Azure Functions
 * 
 * Implements IP-based rate limiting to prevent API abuse.
 * Uses in-memory storage with cleanup for serverless functions.
 * For production at scale, consider Redis or Azure Table Storage.
 * 
 * @module lib/rate-limit
 */

import { HttpRequest, HttpResponseInit } from "@azure/functions";

// CORS configuration
const CORS_ORIGIN = process.env.CORS_ORIGIN || 'https://rankify.page';

// =============================================================================
// TYPES & CONFIGURATION
// =============================================================================

export interface RateLimitConfig {
  windowMs: number;       // Time window in milliseconds
  maxRequests: number;    // Max requests per window per IP
  message?: string;       // Custom error message
  keyPrefix?: string;     // Prefix for rate limit keys
  skipFailedRequests?: boolean; // Don't count failed requests
  standardHeaders?: boolean;    // Return rate limit info in headers
}

interface RateLimitEntry {
  count: number;
  firstRequest: number;
  blocked: boolean;
  blockedUntil?: number;
}

// Default configurations for different endpoints
export const RATE_LIMIT_CONFIGS = {
  // Scan endpoint - more restrictive
  scan: {
    windowMs: 15 * 60 * 1000,  // 15 minutes
    maxRequests: 10,           // 10 scans per 15 min for anonymous
    message: 'Too many scan requests. Please try again later.',
    standardHeaders: true,
  },
  
  // General API endpoints
  api: {
    windowMs: 60 * 1000,       // 1 minute
    maxRequests: 60,           // 60 requests per minute
    message: 'Too many requests. Please slow down.',
    standardHeaders: true,
  },
  
  // Health check - very permissive
  health: {
    windowMs: 60 * 1000,       
    maxRequests: 100,
    message: 'Too many health check requests.',
    standardHeaders: false,
  },
  
  // Auth endpoints - strict to prevent brute force
  auth: {
    windowMs: 15 * 60 * 1000,  // 15 minutes
    maxRequests: 5,            // 5 attempts per 15 min
    message: 'Too many authentication attempts. Please wait 15 minutes.',
    standardHeaders: true,
  },
} as const;


// =============================================================================
// IN-MEMORY STORE
// =============================================================================

// In-memory store for rate limiting
// Note: In a multi-instance serverless environment, consider using Redis or Azure Table Storage
const store = new Map<string, RateLimitEntry>();
let lastCleanup = Date.now();
const CLEANUP_INTERVAL = 60 * 1000; // Cleanup every minute


/**
 * Clean up expired entries to prevent memory leaks
 */
function cleanupExpiredEntries(windowMs: number): void {
  const now = Date.now();
  
  // Only cleanup periodically to avoid performance impact
  if (now - lastCleanup < CLEANUP_INTERVAL) return;
  
  lastCleanup = now;
  
  for (const [key, entry] of store.entries()) {
    // Remove if window has passed and not blocked
    if (now - entry.firstRequest > windowMs && !entry.blocked) {
      store.delete(key);
    }
    // Remove if block period has passed
    if (entry.blockedUntil && now > entry.blockedUntil) {
      store.delete(key);
    }
  }
}


// =============================================================================
// RATE LIMIT FUNCTIONS
// =============================================================================

/**
 * Extract client IP from Azure Functions request
 */
export function getClientIp(request: HttpRequest): string {
  // Azure Functions behind load balancer/proxy
  const forwardedFor = request.headers.get('x-forwarded-for');
  if (forwardedFor) {
    // x-forwarded-for can contain multiple IPs, take the first (original client)
    return forwardedFor.split(',')[0].trim();
  }
  
  // Try other common headers
  const realIp = request.headers.get('x-real-ip');
  if (realIp) return realIp;
  
  const cfConnectingIp = request.headers.get('cf-connecting-ip');
  if (cfConnectingIp) return cfConnectingIp;
  
  // Fallback - this will often be the load balancer IP
  return 'unknown';
}


/**
 * Generate rate limit key from IP and optional prefix
 */
function getRateLimitKey(ip: string, prefix?: string): string {
  return prefix ? `${prefix}:${ip}` : ip;
}


/**
 * Check if request should be rate limited
 * Returns null if allowed, HttpResponseInit if blocked
 */
export function checkRateLimit(
  request: HttpRequest,
  config: RateLimitConfig
): { allowed: boolean; response?: HttpResponseInit; remaining: number; resetTime: number } {
  const ip = getClientIp(request);
  const key = getRateLimitKey(ip, config.keyPrefix);
  const now = Date.now();
  
  // Cleanup expired entries periodically
  cleanupExpiredEntries(config.windowMs);
  
  let entry = store.get(key);
  
  // Check if currently blocked
  if (entry?.blocked && entry.blockedUntil && now < entry.blockedUntil) {
    const retryAfter = Math.ceil((entry.blockedUntil - now) / 1000);
    
    return {
      allowed: false,
      remaining: 0,
      resetTime: entry.blockedUntil,
      response: createRateLimitResponse(config, 0, entry.blockedUntil, retryAfter),
    };
  }
  
  // Start new window if expired or no entry
  if (!entry || now - entry.firstRequest > config.windowMs) {
    entry = {
      count: 0,
      firstRequest: now,
      blocked: false,
    };
  }
  
  // Increment count
  entry.count++;
  
  const remaining = Math.max(0, config.maxRequests - entry.count);
  const resetTime = entry.firstRequest + config.windowMs;
  
  // Check if over limit
  if (entry.count > config.maxRequests) {
    entry.blocked = true;
    entry.blockedUntil = resetTime;
    store.set(key, entry);
    
    const retryAfter = Math.ceil((resetTime - now) / 1000);
    
    return {
      allowed: false,
      remaining: 0,
      resetTime,
      response: createRateLimitResponse(config, 0, resetTime, retryAfter),
    };
  }
  
  // Update store and allow
  store.set(key, entry);
  
  return {
    allowed: true,
    remaining,
    resetTime,
  };
}


/**
 * Create rate limit exceeded response
 */
function createRateLimitResponse(
  config: RateLimitConfig,
  remaining: number,
  resetTime: number,
  retryAfter: number
): HttpResponseInit {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': CORS_ORIGIN,
    'Retry-After': retryAfter.toString(),
  };
  
  if (config.standardHeaders) {
    headers['X-RateLimit-Limit'] = config.maxRequests.toString();
    headers['X-RateLimit-Remaining'] = remaining.toString();
    headers['X-RateLimit-Reset'] = Math.ceil(resetTime / 1000).toString();
  }
  
  return {
    status: 429,
    headers,
    jsonBody: {
      error: 'Too Many Requests',
      message: config.message || 'Rate limit exceeded. Please try again later.',
      retryAfter,
      limit: config.maxRequests,
      remaining,
      resetAt: new Date(resetTime).toISOString(),
    },
  };
}


/**
 * Add rate limit headers to successful response
 */
export function addRateLimitHeaders(
  response: HttpResponseInit,
  limit: number,
  remaining: number,
  resetTime: number
): HttpResponseInit {
  const headers = response.headers as Record<string, string> || {};
  
  return {
    ...response,
    headers: {
      ...headers,
      'X-RateLimit-Limit': limit.toString(),
      'X-RateLimit-Remaining': remaining.toString(),
      'X-RateLimit-Reset': Math.ceil(resetTime / 1000).toString(),
    },
  };
}


/**
 * Rate limit middleware wrapper for Azure Functions
 */
export function withRateLimit(
  config: RateLimitConfig,
  handler: (request: HttpRequest, context: any) => Promise<HttpResponseInit>
) {
  return async (request: HttpRequest, context: any): Promise<HttpResponseInit> => {
    // Skip rate limiting for OPTIONS (CORS preflight)
    if (request.method === 'OPTIONS') {
      return handler(request, context);
    }
    
    const result = checkRateLimit(request, config);
    
    if (!result.allowed) {
      context.log(`Rate limit exceeded for IP: ${getClientIp(request)}`);
      return result.response!;
    }
    
    // Execute the actual handler
    let response: HttpResponseInit;
    try {
      response = await handler(request, context);
    } catch (error) {
      // Don't count failed requests toward rate limit if configured
      if (config.skipFailedRequests) {
        // Note: We can't easily reduce the count in this implementation
        // For proper skip logic, consider a more sophisticated store
      }
      throw error;
    }
    
    // Add rate limit headers to response
    if (config.standardHeaders) {
      return addRateLimitHeaders(
        response,
        config.maxRequests,
        result.remaining,
        result.resetTime
      );
    }
    
    return response;
  };
}


// =============================================================================
// SECURITY & BLOCKING
// =============================================================================

/**
 * Block an IP temporarily (for suspicious activity)
 */
export function blockIp(ip: string, durationMs: number, reason?: string): void {
  const key = `blocked:${ip}`;
  store.set(key, {
    count: 999999,
    firstRequest: Date.now(),
    blocked: true,
    blockedUntil: Date.now() + durationMs,
  });
  
  console.warn(`[Security] IP ${ip} blocked for ${durationMs / 1000}s. Reason: ${reason || 'Unknown'}`);
}


/**
 * Check if an IP is currently blocked
 */
export function isIpBlocked(ip: string): boolean {
  const key = `blocked:${ip}`;
  const entry = store.get(key);
  
  if (!entry) return false;
  
  if (entry.blockedUntil && Date.now() > entry.blockedUntil) {
    store.delete(key);
    return false;
  }
  
  return entry.blocked;
}


/**
 * Get rate limit stats (for monitoring/debugging)
 */
export function getRateLimitStats(): {
  activeKeys: number;
  blockedIps: string[];
} {
  const blockedIps: string[] = [];
  
  for (const [key, entry] of store.entries()) {
    if (entry.blocked && entry.blockedUntil && Date.now() < entry.blockedUntil) {
      blockedIps.push(key.replace('blocked:', ''));
    }
  }
  
  return {
    activeKeys: store.size,
    blockedIps,
  };
}
