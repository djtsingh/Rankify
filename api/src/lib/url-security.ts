/**
 * URL Security Validation
 * 
 * Prevents SSRF attacks by blocking:
 * - Private IP ranges (10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16, 127.0.0.0/8)
 * - Link-local addresses (169.254.0.0/16) - Azure IMDS endpoint
 * - Loopback (localhost, 0.0.0.0)
 * - Cloud metadata endpoints (gce, aws, azure, aliyun)
 * - File protocols (file://, data:, javascript:)
 */

export interface UrlValidationResult {
  valid: boolean;
  error?: string;
}

const BLOCKED_SCHEMES = ['file:', 'data:', 'javascript:', 'vbscript:', 'about:'];
const BLOCKED_HOSTNAMES = [
  'localhost',
  '127.0.0.1',
  '0.0.0.0',
  '169.254.169.254', // Azure IMDS
  'metadata.google.internal', // GCP IMDS
  '169.254.169.254', // AWS IMDS
  'metadata.aliyun.com' // Aliyun IMDS
];

const BLOCKED_IP_RANGES = [
  { min: ip2int('10.0.0.0'), max: ip2int('10.255.255.255') }, // 10.0.0.0/8
  { min: ip2int('127.0.0.0'), max: ip2int('127.255.255.255') }, // 127.0.0.0/8
  { min: ip2int('169.254.0.0'), max: ip2int('169.254.255.255') }, // 169.254.0.0/16 (Link-local)
  { min: ip2int('172.16.0.0'), max: ip2int('172.31.255.255') }, // 172.16.0.0/12
  { min: ip2int('192.168.0.0'), max: ip2int('192.168.255.255') }, // 192.168.0.0/16
];

function ip2int(ip: string): number {
  const parts = ip.split('.').map(Number);
  return (parts[0] << 24) + (parts[1] << 16) + (parts[2] << 8) + parts[3];
}

function isPrivateIp(hostname: string): boolean {
  // Try to parse as IPv4
  const match = hostname.match(/^(\d+\.)(\d+\.)(\d+\.)(\d+)$/);
  if (!match) return false;

  const ipInt = ip2int(hostname);
  return BLOCKED_IP_RANGES.some(range => ipInt >= range.min && ipInt <= range.max);
}

export function validateScanUrl(url: string): UrlValidationResult {
  try {
    const parsed = new URL(url);

    // Block dangerous schemes
    if (BLOCKED_SCHEMES.some(scheme => parsed.protocol.toLowerCase() === scheme.replace(':', ''))) {
      return { valid: false, error: `Scheme ${parsed.protocol} is not allowed` };
    }

    // Only allow http and https
    if (!['http:', 'https:'].includes(parsed.protocol.toLowerCase())) {
      return { valid: false, error: `Only HTTP(S) protocols are allowed, got ${parsed.protocol}` };
    }

    const hostname = parsed.hostname || '';

    // Block metadata endpoints
    if (BLOCKED_HOSTNAMES.some(h => hostname.toLowerCase() === h.toLowerCase())) {
      return { valid: false, error: `Hostname ${hostname} is not allowed (metadata endpoint)` };
    }

    // Block private IPs
    if (isPrivateIp(hostname)) {
      return { valid: false, error: `Private IP address ${hostname} is not allowed` };
    }

    // Check URL length (prevent DOS with huge URLs)
    if (url.length > 2048) {
      return { valid: false, error: 'URL is too long (max 2048 characters)' };
    }

    return { valid: true };
  } catch (error) {
    return { valid: false, error: `Invalid URL: ${error instanceof Error ? error.message : 'unknown error'}` };
  }
}
