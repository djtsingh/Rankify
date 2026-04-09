import { HttpRequest } from "@azure/functions";
import * as jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-key-change-in-prod";

export interface TokenPayload {
  userId: string;
  email: string;
  iat?: number;
  exp?: number;
}

export function extractToken(request: HttpRequest): string | null {
  const auth = request.headers.get("authorization");
  if (!auth?.startsWith("Bearer ")) {
    return null;
  }
  return auth.slice(7);
}

export function verifyToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as TokenPayload;
  } catch {
    return null;
  }
}

export function createToken(userId: string, email: string): string {
  return jwt.sign(
    { userId, email },
    JWT_SECRET,
    { expiresIn: "7d" }
  );
}

// Middleware to verify auth
export function requireAuth(request: HttpRequest): { valid: boolean; userId?: string; email?: string; error?: string } {
  const token = extractToken(request);
  if (!token) {
    return { valid: false, error: "Missing authentication token" };
  }

  const payload = verifyToken(token);
  if (!payload) {
    return { valid: false, error: "Invalid or expired token" };
  }

  return { valid: true, userId: payload.userId, email: payload.email };
}

// Legacy alias for compatibility
export async function verifyAuth(request: HttpRequest): Promise<string | null> {
  const auth = requireAuth(request);
  return auth.valid ? auth.userId || null : null;
}
