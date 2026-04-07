/**
 * Security Configuration Module
 * 
 * Centralized security utilities, constants, and helpers
 * for the Rankify frontend application.
 * 
 * @module security
 */

// =============================================================================
// SECURITY CONSTANTS
// =============================================================================

export const SECURITY_CONFIG = {
  // Session configuration
  session: {
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    refreshThreshold: 24 * 60 * 60 * 1000, // Refresh if < 1 day left
    cookieName: 'rankify_session',
    secureCookie: true,
    sameSite: 'strict' as const,
  },

  // Password requirements
  password: {
    minLength: 12,
    maxLength: 128,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSpecialChars: true,
    specialChars: '!@#$%^&*()_+-=[]{}|;:,.<>?',
    bannedPasswords: [
      'password123', 'qwerty12345', '123456789012',
      'letmein12345', 'welcome12345', 'admin1234567',
    ] as readonly string[],
  },

  // Rate limiting (client-side tracking)
  rateLimit: {
    maxAttempts: 5,
    windowMs: 15 * 60 * 1000, // 15 minutes
    lockoutMs: 30 * 60 * 1000, // 30 minutes
  },

  // Input validation limits
  input: {
    maxUrlLength: 2048,
    maxEmailLength: 254,
    maxNameLength: 100,
    maxMessageLength: 5000,
    maxSearchLength: 500,
  },

  // Allowed domains for external links
  trustedDomains: [
    'rankify.page',
    'www.rankify.page',
    'api.rankify.page',
    'google.com',
    'github.com',
    'twitter.com',
    'linkedin.com',
  ],

  // CSP report endpoint
  cspReportUri: '/api/security/csp-report',
} as const;


// =============================================================================
// INPUT SANITIZATION
// =============================================================================

/**
 * Sanitize HTML to prevent XSS attacks
 * Removes all HTML tags and dangerous characters
 */
export function sanitizeHtml(input: string): string {
  if (!input || typeof input !== 'string') return '';
  
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
    .replace(/`/g, '&#x60;')
    .replace(/=/g, '&#x3D;');
}

/**
 * Sanitize URL to prevent javascript: and data: injection
 */
export function sanitizeUrl(url: string): string {
  if (!url || typeof url !== 'string') return '';
  
  const trimmed = url.trim().toLowerCase();
  
  // Block dangerous protocols
  const dangerousProtocols = [
    'javascript:',
    'data:',
    'vbscript:',
    'file:',
    'blob:',
  ];
  
  for (const protocol of dangerousProtocols) {
    if (trimmed.startsWith(protocol)) {
      return '';
    }
  }
  
  // Only allow http, https, mailto, tel
  if (!/^(https?:\/\/|mailto:|tel:|\/|#)/.test(trimmed)) {
    // If no protocol, assume it's a path
    if (!trimmed.startsWith('/')) {
      return '/' + url.trim();
    }
  }
  
  return url.trim();
}

/**
 * Sanitize user input for display
 */
export function sanitizeInput(input: string, maxLength?: number): string {
  if (!input || typeof input !== 'string') return '';
  
  let sanitized = input
    .trim()
    .replace(/[\x00-\x1F\x7F]/g, '') // Remove control characters
    .replace(/\s+/g, ' '); // Normalize whitespace
  
  if (maxLength) {
    sanitized = sanitized.slice(0, maxLength);
  }
  
  return sanitized;
}


// =============================================================================
// URL & DOMAIN VALIDATION
// =============================================================================

/**
 * Check if a URL is safe to navigate to
 */
export function isUrlSafe(url: string): boolean {
  try {
    const parsed = new URL(url, window.location.origin);
    
    // Block javascript: and data: URLs
    if (['javascript:', 'data:', 'vbscript:', 'file:'].includes(parsed.protocol)) {
      return false;
    }
    
    return true;
  } catch {
    return false;
  }
}

/**
 * Check if a domain is trusted
 */
export function isTrustedDomain(url: string): boolean {
  try {
    const parsed = new URL(url);
    return SECURITY_CONFIG.trustedDomains.some(
      domain => parsed.hostname === domain || parsed.hostname.endsWith('.' + domain)
    );
  } catch {
    return false;
  }
}

/**
 * Validate URL format
 */
export function isValidUrl(url: string): boolean {
  if (!url || url.length > SECURITY_CONFIG.input.maxUrlLength) return false;
  
  try {
    const parsed = new URL(url);
    return ['http:', 'https:'].includes(parsed.protocol);
  } catch {
    return false;
  }
}


// =============================================================================
// PASSWORD VALIDATION
// =============================================================================

export interface PasswordValidationResult {
  isValid: boolean;
  errors: string[];
  strength: 'weak' | 'fair' | 'good' | 'strong';
  score: number;
}

/**
 * Validate password strength
 */
export function validatePassword(password: string): PasswordValidationResult {
  const errors: string[] = [];
  let score = 0;
  const { minLength, maxLength, requireUppercase, requireLowercase, requireNumbers, requireSpecialChars, specialChars, bannedPasswords } = SECURITY_CONFIG.password;

  // Length checks
  if (password.length < minLength) {
    errors.push(`Password must be at least ${minLength} characters`);
  } else {
    score += 20;
    if (password.length >= 16) score += 10;
    if (password.length >= 20) score += 10;
  }

  if (password.length > maxLength) {
    errors.push(`Password cannot exceed ${maxLength} characters`);
  }

  // Character class checks
  if (requireUppercase && !/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  } else if (requireUppercase) {
    score += 15;
  }

  if (requireLowercase && !/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  } else if (requireLowercase) {
    score += 15;
  }

  if (requireNumbers && !/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number');
  } else if (requireNumbers) {
    score += 15;
  }

  const specialCharsRegex = new RegExp(`[${specialChars.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&')}]`);
  if (requireSpecialChars && !specialCharsRegex.test(password)) {
    errors.push('Password must contain at least one special character');
  } else if (requireSpecialChars) {
    score += 15;
  }

  // Banned passwords
  if (bannedPasswords.includes(password.toLowerCase())) {
    errors.push('This password is too common');
    score = Math.max(0, score - 50);
  }

  // Repetition penalty
  if (/(.)\1{3,}/.test(password)) {
    errors.push('Password contains too many repeated characters');
    score = Math.max(0, score - 20);
  }

  // Sequential characters penalty
  if (/(?:abc|bcd|cde|def|efg|fgh|ghi|hij|ijk|jkl|klm|lmn|mno|nop|opq|pqr|qrs|rst|stu|tuv|uvw|vwx|wxy|xyz|012|123|234|345|456|567|678|789)/i.test(password)) {
    score = Math.max(0, score - 10);
  }

  // Determine strength
  let strength: PasswordValidationResult['strength'];
  if (score >= 80) strength = 'strong';
  else if (score >= 60) strength = 'good';
  else if (score >= 40) strength = 'fair';
  else strength = 'weak';

  return {
    isValid: errors.length === 0,
    errors,
    strength,
    score: Math.min(100, score),
  };
}


// =============================================================================
// EMAIL VALIDATION
// =============================================================================

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  if (!email || email.length > SECURITY_CONFIG.input.maxEmailLength) return false;
  
  // RFC 5322 compliant email regex (simplified)
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  
  return emailRegex.test(email);
}


// =============================================================================
// SECURE STORAGE
// =============================================================================

const STORAGE_PREFIX = 'rankify_';

/**
 * Securely store data in localStorage with expiration
 */
export function secureStore(key: string, value: unknown, expiresInMs?: number): void {
  try {
    const storageData = {
      value,
      timestamp: Date.now(),
      expires: expiresInMs ? Date.now() + expiresInMs : null,
    };
    
    localStorage.setItem(
      STORAGE_PREFIX + key,
      JSON.stringify(storageData)
    );
  } catch {
    console.warn('Failed to store data securely');
  }
}

/**
 * Retrieve securely stored data
 */
export function secureRetrieve<T>(key: string): T | null {
  try {
    const item = localStorage.getItem(STORAGE_PREFIX + key);
    if (!item) return null;
    
    const storageData = JSON.parse(item);
    
    // Check expiration
    if (storageData.expires && Date.now() > storageData.expires) {
      localStorage.removeItem(STORAGE_PREFIX + key);
      return null;
    }
    
    return storageData.value as T;
  } catch {
    return null;
  }
}

/**
 * Remove securely stored data
 */
export function secureRemove(key: string): void {
  try {
    localStorage.removeItem(STORAGE_PREFIX + key);
  } catch {
    // Ignore errors
  }
}

/**
 * Clear all Rankify storage
 */
export function secureClearAll(): void {
  try {
    const keysToRemove: string[] = [];
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith(STORAGE_PREFIX)) {
        keysToRemove.push(key);
      }
    }
    
    keysToRemove.forEach(key => localStorage.removeItem(key));
  } catch {
    // Ignore errors
  }
}


// =============================================================================
// RATE LIMITING (Client-Side)
// =============================================================================

interface RateLimitEntry {
  attempts: number;
  firstAttempt: number;
  lockedUntil: number | null;
}

/**
 * Check if action is rate limited
 */
export function isRateLimited(action: string): boolean {
  const entry = secureRetrieve<RateLimitEntry>(`ratelimit_${action}`);
  
  if (!entry) return false;
  
  // Check if locked out
  if (entry.lockedUntil && Date.now() < entry.lockedUntil) {
    return true;
  }
  
  // Reset if window expired
  if (Date.now() - entry.firstAttempt > SECURITY_CONFIG.rateLimit.windowMs) {
    secureRemove(`ratelimit_${action}`);
    return false;
  }
  
  return entry.attempts >= SECURITY_CONFIG.rateLimit.maxAttempts;
}

/**
 * Record an attempt for rate limiting
 */
export function recordAttempt(action: string): void {
  const entry = secureRetrieve<RateLimitEntry>(`ratelimit_${action}`) || {
    attempts: 0,
    firstAttempt: Date.now(),
    lockedUntil: null,
  };
  
  // Reset if window expired
  if (Date.now() - entry.firstAttempt > SECURITY_CONFIG.rateLimit.windowMs) {
    entry.attempts = 0;
    entry.firstAttempt = Date.now();
    entry.lockedUntil = null;
  }
  
  entry.attempts++;
  
  // Lock out if exceeded
  if (entry.attempts >= SECURITY_CONFIG.rateLimit.maxAttempts) {
    entry.lockedUntil = Date.now() + SECURITY_CONFIG.rateLimit.lockoutMs;
  }
  
  secureStore(`ratelimit_${action}`, entry, SECURITY_CONFIG.rateLimit.lockoutMs);
}

/**
 * Get remaining lockout time in seconds
 */
export function getRateLimitRemaining(action: string): number {
  const entry = secureRetrieve<RateLimitEntry>(`ratelimit_${action}`);
  
  if (!entry?.lockedUntil) return 0;
  
  const remaining = entry.lockedUntil - Date.now();
  return remaining > 0 ? Math.ceil(remaining / 1000) : 0;
}


// =============================================================================
// CSRF PROTECTION
// =============================================================================

/**
 * Generate a CSRF token
 */
export function generateCsrfToken(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

/**
 * Store CSRF token for later validation
 */
export function storeCsrfToken(): string {
  const token = generateCsrfToken();
  secureStore('csrf_token', token, SECURITY_CONFIG.session.maxAge);
  return token;
}

/**
 * Get stored CSRF token
 */
export function getCsrfToken(): string | null {
  return secureRetrieve<string>('csrf_token');
}


// =============================================================================
// EXTERNAL LINK SAFETY
// =============================================================================

/**
 * Create safe external link attributes
 */
export function getSafeExternalLinkProps(url: string): {
  href: string;
  target: string;
  rel: string;
} {
  const safeUrl = sanitizeUrl(url);
  
  return {
    href: safeUrl,
    target: '_blank',
    rel: 'noopener noreferrer nofollow',
  };
}


// =============================================================================
// SECURITY EVENT LOGGING
// =============================================================================

export type SecurityEventType = 
  | 'login_attempt'
  | 'login_success'
  | 'login_failure'
  | 'logout'
  | 'password_change'
  | 'rate_limit_exceeded'
  | 'suspicious_activity'
  | 'csp_violation';

export interface SecurityEvent {
  type: SecurityEventType;
  timestamp: number;
  details?: Record<string, unknown>;
  userAgent?: string;
}

/**
 * Log security event (for later analysis)
 */
export function logSecurityEvent(event: SecurityEvent): void {
  // In production, this would send to a logging service
  // For now, we store locally for debugging
  const events = secureRetrieve<SecurityEvent[]>('security_events') || [];
  events.push({
    ...event,
    timestamp: Date.now(),
    userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
  });
  
  // Keep only last 100 events
  const trimmed = events.slice(-100);
  secureStore('security_events', trimmed, 7 * 24 * 60 * 60 * 1000); // 7 days
  
  // Log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.log('[Security Event]', event);
  }
}


// =============================================================================
// CONTENT SECURITY
// =============================================================================

/**
 * Check if content contains potential XSS
 */
export function containsPotentialXss(content: string): boolean {
  const xssPatterns = [
    /<script\b[^>]*>[\s\S]*?<\/script>/gi,
    /javascript:/gi,
    /on\w+\s*=/gi, // onclick, onerror, etc.
    /<iframe\b/gi,
    /<embed\b/gi,
    /<object\b/gi,
    /expression\s*\(/gi, // CSS expression
    /eval\s*\(/gi,
    /document\.(cookie|write|location)/gi,
    /window\.(location|open)/gi,
  ];
  
  return xssPatterns.some(pattern => pattern.test(content));
}
