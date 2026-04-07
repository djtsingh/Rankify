/**
 * Privacy Utilities
 * 
 * Functions for handling sensitive data in compliance with GDPR and privacy regulations.
 * 
 * @module lib/privacy
 */

import { createHash } from 'crypto';

// Salt for IP hashing - should be set via environment variable
// Do NOT change this value once deployed, or existing hashed IPs won't match
const IP_HASH_SALT = process.env.IP_HASH_SALT || 'rankify-ip-hash-v1';

/**
 * Hash an IP address for privacy-compliant storage.
 * 
 * Uses SHA-256 with a salt to create a consistent but irreversible hash.
 * This allows tracking unique IPs for rate limiting without storing actual addresses.
 * 
 * @param ip - The IP address to hash
 * @returns Hashed IP address (hex string)
 */
export function hashIpAddress(ip: string): string {
  if (!ip || ip === 'unknown') {
    return 'unknown';
  }

  return createHash('sha256')
    .update(IP_HASH_SALT + ip)
    .digest('hex')
    .substring(0, 32); // Truncate to 32 chars for storage efficiency
}

/**
 * Anonymize an IP address by zeroing the last octet (IPv4) or segment (IPv6).
 * 
 * Useful for analytics where you need rough geographic data but not precise identification.
 * 
 * @param ip - The IP address to anonymize
 * @returns Anonymized IP address
 */
export function anonymizeIpAddress(ip: string): string {
  if (!ip || ip === 'unknown') {
    return 'unknown';
  }

  // IPv4: Replace last octet with 0
  if (ip.includes('.') && !ip.includes(':')) {
    const parts = ip.split('.');
    if (parts.length === 4) {
      parts[3] = '0';
      return parts.join('.');
    }
  }

  // IPv6: Replace last segment with 0
  if (ip.includes(':')) {
    const parts = ip.split(':');
    if (parts.length > 0) {
      parts[parts.length - 1] = '0';
      return parts.join(':');
    }
  }

  return 'unknown';
}

/**
 * Sanitize user agent string to remove potentially identifying information.
 * 
 * Keeps browser and OS info, removes unique identifiers.
 * 
 * @param userAgent - The user agent string to sanitize
 * @returns Sanitized user agent
 */
export function sanitizeUserAgent(userAgent: string | null): string {
  if (!userAgent) {
    return 'unknown';
  }

  // Truncate to prevent excessively long strings
  const truncated = userAgent.substring(0, 500);

  // Remove potential tracking tokens (long hex/base64 strings)
  const sanitized = truncated.replace(/[a-fA-F0-9]{32,}/g, '[REDACTED]');

  return sanitized;
}

/**
 * Create metadata object with privacy-safe values.
 * 
 * @param rawMetadata - Raw metadata with potentially sensitive fields
 * @returns Sanitized metadata safe for storage
 */
export function sanitizeMetadata(rawMetadata: {
  userAgent?: string | null;
  ipAddress?: string | null;
  [key: string]: unknown;
}): Record<string, unknown> {
  const sanitized = { ...rawMetadata };

  if (typeof sanitized.ipAddress === 'string') {
    sanitized.ipAddressHash = hashIpAddress(sanitized.ipAddress);
    delete sanitized.ipAddress;
  }

  if (typeof sanitized.userAgent === 'string' || sanitized.userAgent === null) {
    sanitized.userAgent = sanitizeUserAgent(sanitized.userAgent as string | null);
  }

  return sanitized;
}
