import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { prisma } from "../lib/prisma";
import { randomUUID } from "crypto";
import * as bcrypt from "bcryptjs";
import * as jwt from "jsonwebtoken";
import { checkRateLimit, RATE_LIMIT_CONFIGS, addRateLimitHeaders } from "../lib/rate-limit";
import { validateEmail, validatePassword } from "../lib/validation";

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-key-change-in-prod";
const JWT_EXPIRY = "7d";

// Register endpoint
app.post("register", registerHandler);
export async function registerHandler(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  try {
    // Rate limit
    const rateLimitResult = checkRateLimit(request, RATE_LIMIT_CONFIGS.auth);
    if (!rateLimitResult.allowed) {
      return rateLimitResult.response!;
    }

    const body = await request.json() as { email?: string; password?: string };

    // Validate email
    if (!body.email) {
      return {
        status: 400,
        headers: { "Content-Type": "application/json" },
        jsonBody: { error: "Missing email" }
      };
    }

    const emailValidation = validateEmail(body.email);
    if (!emailValidation.isValid) {
      return {
        status: 400,
        headers: { "Content-Type": "application/json" },
        jsonBody: { error: "Invalid email format" }
      };
    }

    // Validate password
    if (!body.password) {
      return {
        status: 400,
        headers: { "Content-Type": "application/json" },
        jsonBody: { error: "Missing password" }
      };
    }

    const passwordValidation = validatePassword(body.password);
    if (!passwordValidation.isValid) {
      return {
        status: 400,
        headers: { "Content-Type": "application/json" },
        jsonBody: { error: "Password must be at least 8 characters" }
      };
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email: body.email }
    });

    if (existingUser) {
      return {
        status: 409,
        headers: { "Content-Type": "application/json" },
        jsonBody: { error: "User already exists" }
      };
    }

    // Hash password
    const passwordHash = await bcrypt.hash(body.password, 10);

    // Create user
    const userId = randomUUID();
    const user = await prisma.user.create({
      data: {
        id: userId,
        email: body.email,
        password: passwordHash,
      }
    });

    // Generate JWT
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRY }
    );

    const response: HttpResponseInit = {
      status: 201,
      headers: { "Content-Type": "application/json" },
      jsonBody: {
        data: {
          userId: user.id,
          email: user.email,
          token
        }
      }
    };

    return addRateLimitHeaders(response, RATE_LIMIT_CONFIGS.auth.maxRequests, rateLimitResult.remaining, rateLimitResult.resetTime);

  } catch (error) {
    context.error("Error registering user:", error);
    return {
      status: 500,
      headers: { "Content-Type": "application/json" },
      jsonBody: { error: "Registration failed" }
    };
  }
}

// Login endpoint
app.post("login", loginHandler);
export async function loginHandler(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  try {
    // Rate limit
    const rateLimitResult = checkRateLimit(request, RATE_LIMIT_CONFIGS.auth);
    if (!rateLimitResult.allowed) {
      return rateLimitResult.response!;
    }

    const body = await request.json() as { email?: string; password?: string };

    if (!body.email || !body.password) {
      return {
        status: 400,
        headers: { "Content-Type": "application/json" },
        jsonBody: { error: "Missing email or password" }
      };
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { email: body.email }
    });

    if (!user) {
      return {
        status: 401,
        headers: { "Content-Type": "application/json" },
        jsonBody: { error: "Invalid credentials" }
      };
    }

    // Verify password
    const passwordMatch = await bcrypt.compare(body.password, user.password || "");
    if (!passwordMatch) {
      return {
        status: 401,
        headers: { "Content-Type": "application/json" },
        jsonBody: { error: "Invalid credentials" }
      };
    }

    // Generate JWT
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRY }
    );

    const response: HttpResponseInit = {
      status: 200,
      headers: { "Content-Type": "application/json" },
      jsonBody: {
        data: {
          userId: user.id,
          email: user.email,
          token
        }
      }
    };

    return addRateLimitHeaders(response, RATE_LIMIT_CONFIGS.auth.maxRequests, rateLimitResult.remaining, rateLimitResult.resetTime);

  } catch (error) {
    context.error("Error logging in:", error);
    return {
      status: 500,
      headers: { "Content-Type": "application/json" },
      jsonBody: { error: "Login failed" }
    };
  }
}

// Verify token endpoint
app.get("verify-token", verifyTokenHandler);
export async function verifyTokenHandler(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  try {
    const auth = request.headers.get("authorization");
    if (!auth?.startsWith("Bearer ")) {
      return {
        status: 401,
        headers: { "Content-Type": "application/json" },
        jsonBody: { error: "Missing token" }
      };
    }

    const token = auth.slice(7);
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; email: string };

    return {
      status: 200,
      headers: { "Content-Type": "application/json" },
      jsonBody: { data: decoded }
    };

  } catch (error) {
    return {
      status: 401,
      headers: { "Content-Type": "application/json" },
      jsonBody: { error: "Invalid token" }
    };
  }
}
