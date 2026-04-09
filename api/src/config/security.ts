/**
 * STAGE 1 SECURITY CONFIGURATION
 * 
 * This file centralizes security settings for Stage 1 hardening.
 * Adjust based on your infrastructure and threat model.
 */

// Rate limiting configuration (production values)
export const SECURITY_CONFIG = {
  // Scan endpoint limits
  scan: {
    // Anonymous users: 10 scans per 15 minutes
    // Prevents DOS and resource exhaustion
    maxScansPerWindow: 10,
    windowMs: 15 * 60 * 1000,
  },

  // General API limits
  api: {
    maxRequestsPerMinute: 60,
  },

  // URL validation
  url: {
    maxLength: 2048,
    requireTld: true,
    allowPrivate: false,
  },

  // Scan execution
  scan_execution: {
    // Max concurrent scans per worker
    maxConcurrentScans: 3,
    
    // Timeout for single scan (fail fast if stuck)
    timeoutSeconds: 300, // 5 minutes
    
    // Resource limits
    maxMemoryMb: 512,
    maxCpuPercentage: 80,
  },

  // Logging
  logging: {
    // Log all audit events
    logAllScans: true,
    
    // Log failed scans separately for analysis
    logFailures: true,
    
    // Retention (days)
    retentionDays: 30,
  },

  // Response headers for security
  headers: {
    // Prevent clickjacking
    'X-Frame-Options': 'DENY',
    
    // Prevent MIME sniffing
    'X-Content-Type-Options': 'nosniff',
    
    // Enable XSS protection
    'X-XSS-Protection': '1; mode=block',
    
    // Strict Transport Security (enable after HTTPS is fully tested)
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
    
    // Content Security Policy (restrict to necessary resources)
    'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'",
  }
};

export default SECURITY_CONFIG;
