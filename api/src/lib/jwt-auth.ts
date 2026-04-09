/**
 * JWT Auth Middleware for Azure Functions
 * Validates Bearer tokens and extracts user context
 */

import { HttpRequest } from "@azure/functions";

export interface AuthContext {
  userId: string;
  email: string;
  iat: number;
  exp: number;
}

/**
 * Extract and validate JWT token from Authorization header
 * Token format: "Bearer <token>"
 */
export function extractToken(request: HttpRequest): string | null {
  const auth = request.headers.get("authorization");
  if (!auth?.startsWith("Bearer ")) {
    return null;
  }
  return auth.slice(7); // Remove "Bearer " prefix
}

/**
 * Decode JWT token (note: this is simplified verification)
 * In production, use a JWT library like jsonwebtoken
 * For now, assume token is valid if it exists and has Bearer prefix
 */
export function decodeToken(token: string): AuthContext | null {
  try {
    // Base64 decode the payload (JWT format: header.payload.signature)
    const parts = token.split(".");
    if (parts.length !== 3) {
      return null;
    }

    const payload = JSON.parse(
      Buffer.from(parts[1], "base64").toString("utf-8")
    );

    // Verify expiry
    if (payload.exp && payload.exp * 1000 < Date.now()) {
      return null; // Token expired
    }

    return {
      userId: payload.sub || payload.id,
      email: payload.email,
      iat: payload.iat,
      exp: payload.exp,
    };
  } catch (error) {
    return null;
  }
}

/**
 * Verify authentication and return user context
 * Returns null if invalid
 */
export function verifyAuth(request: HttpRequest): AuthContext | null {
  const token = extractToken(request);
  if (!token) {
    return null;
  }
  return decodeToken(token);
}

/**
 * Require auth middleware - returns 401 if not authenticated
 */
export function requireAuth(request: HttpRequest): { status: number; jsonBody: any } | null {
  const auth = verifyAuth(request);
  if (!auth) {
    return {
      status: 401,
      jsonBody: {
        error: "Unauthorized",
        message: "Missing or invalid Authorization header",
      },
    };
  }
  return null;
}
