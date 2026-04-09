import { HttpRequest, HttpResponseInit } from "@azure/functions";

const API_KEY_HEADER = 'x-api-key';
const VALID_KEYS = (process.env.API_KEYS || '').split(',').filter(Boolean);

export interface AuthResult {
  authenticated: boolean;
  userId?: string;
  error?: string;
}

export function validateApiKey(request: HttpRequest): AuthResult {
  // Check for JWT Bearer token (for NextAuth)
  const authHeader = request.headers.get('authorization');
  if (authHeader?.startsWith('Bearer ')) {
    const token = authHeader.slice(7);
    // TODO: Verify JWT signature here
    return { authenticated: true };
  }

  // Check for API Key (for direct calls)
  const apiKey = request.headers.get(API_KEY_HEADER);
  if (apiKey && VALID_KEYS.includes(apiKey)) {
    return { authenticated: true };
  }

  return {
    authenticated: false,
    error: 'Missing or invalid API key'
  };
}

export function sendUnauthorized(): HttpResponseInit {
  return {
    status: 401,
    headers: { 'Content-Type': 'application/json' },
    jsonBody: {
      success: false,
      message: 'Unauthorized - valid API key or JWT token required'
    }
  };
}
