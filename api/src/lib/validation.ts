/**
 * Input Validation & Sanitization Module
 * 
 * Provides comprehensive input validation and sanitization
 * to prevent injection attacks and ensure data integrity.
 * 
 * @module lib/validation
 */

// =============================================================================
// TYPES
// =============================================================================

export interface ValidationResult<T = unknown> {
  isValid: boolean;
  value?: T;
  error?: string;
  sanitized?: boolean;
}

export interface UrlValidationOptions {
  allowPrivate?: boolean;      // Allow private/local IPs
  allowedProtocols?: string[]; // Default: ['http:', 'https:']
  maxLength?: number;          // Default: 2048
  requireTld?: boolean;        // Require top-level domain
  blockList?: string[];        // Blocked domains/patterns
}


// =============================================================================
// URL VALIDATION & SANITIZATION
// =============================================================================

// Private/internal IP ranges (should not be scanned)
const PRIVATE_IP_PATTERNS = [
  /^localhost$/i,
  /^127\.\d{1,3}\.\d{1,3}\.\d{1,3}$/,  // 127.x.x.x
  /^10\.\d{1,3}\.\d{1,3}\.\d{1,3}$/,    // 10.x.x.x
  /^172\.(1[6-9]|2\d|3[01])\.\d{1,3}\.\d{1,3}$/, // 172.16-31.x.x
  /^192\.168\.\d{1,3}\.\d{1,3}$/,       // 192.168.x.x
  /^169\.254\.\d{1,3}\.\d{1,3}$/,       // Link-local
  /^0\.0\.0\.0$/,                        // All interfaces
  /^\[?::1\]?$/,                         // IPv6 localhost
  /^\[?fe80:/i,                          // IPv6 link-local
  /^\[?fc00:/i,                          // IPv6 private
  /^\[?fd00:/i,                          // IPv6 private
];

// Blocked domains (expand as needed)
const BLOCKED_DOMAINS = [
  'localhost',
  '127.0.0.1',
  '0.0.0.0',
  '::1',
  'metadata.google.internal',     // GCP metadata
  '169.254.169.254',              // AWS/Azure metadata
  'metadata.azure.internal',      // Azure metadata
];

/**
 * Validate and sanitize a URL for scanning
 */
export function validateScanUrl(
  input: string | undefined | null,
  options: UrlValidationOptions = {}
): ValidationResult<string> {
  const {
    allowPrivate = false,
    allowedProtocols = ['http:', 'https:'],
    maxLength = 2048,
    requireTld = true,
    blockList = [],
  } = options;

  // Check for empty input
  if (!input || typeof input !== 'string') {
    return {
      isValid: false,
      error: 'URL is required',
    };
  }

  // Trim and basic sanitize
  let url = input.trim();

  // Length check
  if (url.length > maxLength) {
    return {
      isValid: false,
      error: `URL exceeds maximum length of ${maxLength} characters`,
    };
  }

  // Remove potentially dangerous characters
  url = url.replace(/[\x00-\x1F\x7F]/g, ''); // Control characters
  url = url.replace(/\s+/g, '');              // Whitespace

  // Add protocol if missing
  if (!url.match(/^[a-zA-Z][a-zA-Z0-9+.-]*:\/\//)) {
    url = 'https://' + url;
  }

  // Parse URL
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return {
      isValid: false,
      error: 'Invalid URL format',
    };
  }

  // Protocol check
  if (!allowedProtocols.includes(parsed.protocol)) {
    return {
      isValid: false,
      error: `Protocol ${parsed.protocol} is not allowed. Use ${allowedProtocols.join(' or ')}`,
    };
  }

  // Block javascript: and data: URLs (even if somehow parsed)
  if (['javascript:', 'data:', 'vbscript:', 'file:'].includes(parsed.protocol.toLowerCase())) {
    return {
      isValid: false,
      error: 'Dangerous protocol detected',
    };
  }

  // Block private/internal IPs unless allowed
  if (!allowPrivate) {
    const hostname = parsed.hostname.toLowerCase();
    
    // Check against private IP patterns
    for (const pattern of PRIVATE_IP_PATTERNS) {
      if (pattern.test(hostname)) {
        return {
          isValid: false,
          error: 'Cannot scan private/internal addresses',
        };
      }
    }

    // Check against blocked domains
    const allBlocked = [...BLOCKED_DOMAINS, ...blockList];
    for (const blocked of allBlocked) {
      if (
        hostname === blocked.toLowerCase() ||
        hostname.endsWith('.' + blocked.toLowerCase())
      ) {
        return {
          isValid: false,
          error: 'This domain cannot be scanned',
        };
      }
    }
  }

  // TLD check
  if (requireTld && !parsed.hostname.includes('.')) {
    // Allow localhost for development
    if (parsed.hostname !== 'localhost' || !allowPrivate) {
      return {
        isValid: false,
        error: 'URL must have a valid domain with TLD',
      };
    }
  }

  // Port check - block commonly dangerous ports
  const dangerousPorts = ['21', '22', '23', '25', '53', '110', '143', '445', '3306', '3389', '5432', '27017'];
  if (parsed.port && dangerousPorts.includes(parsed.port)) {
    return {
      isValid: false,
      error: `Port ${parsed.port} is not allowed`,
    };
  }

  // Reconstruct clean URL (removes any username:password)
  const cleanUrl = `${parsed.protocol}//${parsed.hostname}${parsed.port ? ':' + parsed.port : ''}${parsed.pathname}${parsed.search}`;

  return {
    isValid: true,
    value: cleanUrl,
    sanitized: cleanUrl !== input,
  };
}


// =============================================================================
// EMAIL VALIDATION
// =============================================================================

// =============================================================================
// PASSWORD VALIDATION
// =============================================================================

/**
 * Validate password strength
 */
export function validatePassword(password: string | undefined | null): ValidationResult<string> {
  if (!password || typeof password !== 'string') {
    return {
      isValid: false,
      error: 'Password is required',
    };
  }

  const trimmed = password.trim();

  if (trimmed.length < 8) {
    return {
      isValid: false,
      error: 'Password must be at least 8 characters',
    };
  }

  if (trimmed.length > 128) {
    return {
      isValid: false,
      error: 'Password is too long',
    };
  }

  // Check for at least one uppercase, one lowercase, one digit
  const hasUpperCase = /[A-Z]/.test(trimmed);
  const hasLowerCase = /[a-z]/.test(trimmed);
  const hasDigit = /[0-9]/.test(trimmed);
  const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(trimmed);

  // At least 2 of these must be true
  const strengthScore = [hasUpperCase, hasLowerCase, hasDigit, hasSpecialChar].filter(Boolean).length;
  if (strengthScore < 2) {
    return {
      isValid: false,
      error: 'Password must contain at least 2 of: uppercase letters, lowercase letters, numbers, special characters',
    };
  }

  return {
    isValid: true,
    value: trimmed,
  };
}


// =============================================================================
// EMAIL VALIDATION
// =============================================================================

/**
 * Validate email address
 */
export function validateEmail(email: string | undefined | null): ValidationResult<string> {
  if (!email || typeof email !== 'string') {
    return {
      isValid: false,
      error: 'Email is required',
    };
  }

  const trimmed = email.trim().toLowerCase();

  if (trimmed.length > 254) {
    return {
      isValid: false,
      error: 'Email address is too long',
    };
  }

  // RFC 5322 compliant regex (simplified)
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

  if (!emailRegex.test(trimmed)) {
    return {
      isValid: false,
      error: 'Invalid email format',
    };
  }

  // Check for disposable email domains (optional)
  const disposableDomains = ['tempmail.com', 'throwaway.email', 'guerrillamail.com'];
  const domain = trimmed.split('@')[1];
  if (disposableDomains.includes(domain)) {
    return {
      isValid: false,
      error: 'Disposable email addresses are not allowed',
    };
  }

  return {
    isValid: true,
    value: trimmed,
    sanitized: trimmed !== email,
  };
}


// =============================================================================
// GENERAL INPUT SANITIZATION
// =============================================================================

/**
 * Sanitize text input to prevent XSS
 */
export function sanitizeText(input: string, maxLength = 1000): string {
  if (!input || typeof input !== 'string') return '';

  return input
    .trim()
    .slice(0, maxLength)
    .replace(/[\x00-\x1F\x7F]/g, '')  // Remove control characters
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\\/g, '&#x5C;');
}


/**
 * Sanitize input for SQL (basic, use parameterized queries!)
 * This is a fallback - always prefer parameterized queries
 */
export function sanitizeForSql(input: string): string {
  if (!input || typeof input !== 'string') return '';

  return input
    .replace(/'/g, "''")          // Escape single quotes
    .replace(/\\/g, '\\\\')       // Escape backslashes
    .replace(/[\x00-\x1F\x7F]/g, ''); // Remove control characters
}


/**
 * Validate UUID format
 */
export function isValidUuid(input: string): boolean {
  if (!input || typeof input !== 'string') return false;
  
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(input);
}


/**
 * Extract and validate pagination parameters
 */
export function validatePagination(
  page: unknown,
  limit: unknown,
  defaults = { page: 1, limit: 20, maxLimit: 100 }
): { page: number; limit: number; offset: number } {
  let pageNum = parseInt(String(page), 10);
  let limitNum = parseInt(String(limit), 10);

  if (isNaN(pageNum) || pageNum < 1) pageNum = defaults.page;
  if (isNaN(limitNum) || limitNum < 1) limitNum = defaults.limit;
  if (limitNum > defaults.maxLimit) limitNum = defaults.maxLimit;

  return {
    page: pageNum,
    limit: limitNum,
    offset: (pageNum - 1) * limitNum,
  };
}


// =============================================================================
// REQUEST VALIDATION HELPERS
// =============================================================================

/**
 * Check if request body is valid JSON
 */
export async function parseJsonBody<T = unknown>(
  request: { json: () => Promise<unknown> }
): Promise<ValidationResult<T>> {
  try {
    const body = await request.json();
    
    if (body === null || typeof body !== 'object') {
      return {
        isValid: false,
        error: 'Request body must be a JSON object',
      };
    }

    return {
      isValid: true,
      value: body as T,
    };
  } catch {
    return {
      isValid: false,
      error: 'Invalid JSON in request body',
    };
  }
}
