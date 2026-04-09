/**
 * Input Validation & Sanitization
 * 
 * Validates all user inputs against expected schemas
 */

export interface ScanRequest {
  url: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export function validateScanRequest(data: any): { valid: boolean; error?: string; data?: ScanRequest } {
  if (!data || typeof data !== 'object') {
    return { valid: false, error: 'Request body must be JSON object' };
  }

  const { url } = data;

  if (!url) {
    return { valid: false, error: 'URL is required' };
  }

  if (typeof url !== 'string') {
    return { valid: false, error: 'URL must be a string' };
  }

  if (url.length < 5 || url.length > 2048) {
    return { valid: false, error: 'URL must be between 5 and 2048 characters' };
  }

  return { valid: true, data: { url: url.trim() } };
}

export function validateRegisterRequest(data: any): { valid: boolean; error?: string; data?: RegisterRequest } {
  if (!data || typeof data !== 'object') {
    return { valid: false, error: 'Request body must be JSON object' };
  }

  const { email, password, name } = data;

  // Email validation
  if (!email || typeof email !== 'string') {
    return { valid: false, error: 'Valid email is required' };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { valid: false, error: 'Invalid email format' };
  }

  if (email.length > 254) {
    return { valid: false, error: 'Email too long' };
  }

  // Password validation
  if (!password || typeof password !== 'string') {
    return { valid: false, error: 'Password is required' };
  }

  if (password.length < 8) {
    return { valid: false, error: 'Password must be at least 8 characters' };
  }

  if (password.length > 128) {
    return { valid: false, error: 'Password too long' };
  }

  // Name validation (optional)
  if (name !== undefined) {
    if (typeof name !== 'string') {
      return { valid: false, error: 'Name must be a string' };
    }

    if (name.length > 255) {
      return { valid: false, error: 'Name too long' };
    }
  }

  return { valid: true, data: { email: email.toLowerCase().trim(), password, name: name?.trim() } };
}

export function validateLoginRequest(data: any): { valid: boolean; error?: string; data?: LoginRequest } {
  if (!data || typeof data !== 'object') {
    return { valid: false, error: 'Request body must be JSON object' };
  }

  const { email, password } = data;

  if (!email || typeof email !== 'string') {
    return { valid: false, error: 'Email is required' };
  }

  if (!password || typeof password !== 'string') {
    return { valid: false, error: 'Password is required' };
  }

  return { valid: true, data: { email: email.toLowerCase().trim(), password } };
}
