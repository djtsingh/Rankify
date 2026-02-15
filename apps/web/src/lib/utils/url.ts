/**
 * URL utilities for validation and normalization
 */

export interface URLValidationResult {
  valid: boolean;
  error?: string;
  normalizedUrl?: string;
}

/**
 * Validate and normalize a URL
 */
export function validateAndNormalizeUrl(input: string): URLValidationResult {
  // Remove whitespace
  const trimmed = input.trim();

  if (!trimmed) {
    return { valid: false, error: 'Please enter a URL' };
  }

  // Add https:// if no protocol specified
  let url = trimmed;
  if (!url.match(/^https?:\/\//i)) {
    url = `https://${url}`;
  }

  try {
    const parsed = new URL(url);

    // Validate protocol
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      return {
        valid: false,
        error: 'URL must use HTTP or HTTPS protocol',
      };
    }

    // Validate hostname
    if (!parsed.hostname || parsed.hostname.length < 3) {
      return {
        valid: false,
        error: 'Invalid domain name - hostname is too short',
      };
    }

    // Check for localhost (optional: remove in production)
    if (parsed.hostname === 'localhost' || parsed.hostname === '127.0.0.1') {
      return {
        valid: false,
        error: 'Cannot audit local websites. Please use a public URL.',
      };
    }

    // Check for valid TLD (basic check)
    const parts = parsed.hostname.split('.');
    
    // Allow IP addresses (which have 4 numeric parts)
    const isIPAddress = parts.length === 4 && parts.every(p => !isNaN(Number(p)) && Number(p) >= 0 && Number(p) <= 255);
    
    if (!isIPAddress && parts.length < 2) {
      return {
        valid: false,
        error: `Invalid domain format. Expected format: example.com (got: ${parsed.hostname})`,
      };
    }
    
    // Check that the TLD is at least 2 characters (e.g., .me, .io, .com)
    if (!isIPAddress && parts[parts.length - 1].length < 2) {
      return {
        valid: false,
        error: 'Invalid top-level domain (TLD)',
      };
    }

    return {
      valid: true,
      normalizedUrl: parsed.toString(),
    };
  } catch (error) {
    return {
      valid: false,
      error: 'Invalid URL format. Please enter a valid website address.',
    };
  }
}

/**
 * Extract domain from URL
 */
export function extractDomain(url: string): string {
  try {
    const parsed = new URL(url);
    return parsed.hostname;
  } catch {
    return url;
  }
}

/**
 * Check if URL is HTTPS
 */
export function isHttps(url: string): boolean {
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

/**
 * Build shareable URL with query parameters
 */
export function buildShareableUrl(scanId: string, url: string): string {
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
  const params = new URLSearchParams({
    scan: scanId,
    url: url,
  });
  return `${baseUrl}/website-audit?${params.toString()}`;
}

/**
 * Parse query parameters from URL
 */
export function parseAuditParams(searchParams: URLSearchParams): {
  scanId: string | null;
  url: string | null;
} {
  return {
    scanId: searchParams.get('scan'),
    url: searchParams.get('url'),
  };
}

/**
 * Clean URL for display (remove query params, hash, trailing slash)
 */
export function cleanUrlForDisplay(url: string): string {
  try {
    const parsed = new URL(url);
    let cleanUrl = `${parsed.protocol}//${parsed.hostname}`;
    if (parsed.port && !['80', '443'].includes(parsed.port)) {
      cleanUrl += `:${parsed.port}`;
    }
    if (parsed.pathname !== '/') {
      cleanUrl += parsed.pathname.replace(/\/$/, '');
    }
    return cleanUrl;
  } catch {
    return url;
  }
}
