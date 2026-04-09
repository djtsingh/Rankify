import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { prisma } from "../lib/prisma";
import { verifyAuth } from "../lib/jwt-auth";
import { generateContentBrief, scoreOnPageContent, suggestKeywords } from "../lib/keyword-research";
import { checkRateLimit, RATE_LIMIT_CONFIGS, addRateLimitHeaders } from "../lib/rate-limit";

/**
 * Stage 3: Keyword Research & Content Intelligence
 * Endpoints for keyword research, content briefs, on-page scoring
 */

// GET keyword research for a URL
export async function getKeywordResearch(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  try {
    const projectId = request.params.projectId;
    const auth = verifyAuth(request);

    if (!auth) {
      return {
        status: 401,
        headers: { "Content-Type": "application/json" },
        jsonBody: { error: "Unauthorized" }
      };
    }

    // Verify project ownership
    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project || project.userId !== auth.userId) {
      return {
        status: 404,
        headers: { "Content-Type": "application/json" },
        jsonBody: { error: "Project not found" }
      };
    }

    // Get top keywords for the domain (from Scan results if available)
    const topKeywords = ["rankify", "seo tool", "website audit"]; // Placeholder

    const suggestions = await suggestKeywords(project.domain, topKeywords);

    const response: HttpResponseInit = {
      status: 200,
      headers: { "Content-Type": "application/json" },
      jsonBody: { data: suggestions }
    };

    return addRateLimitHeaders(response, RATE_LIMIT_CONFIGS.api.maxRequests, 59, Date.now() + 60000);

  } catch (error) {
    context.error('Error fetching keyword research:', error);
    return {
      status: 500,
      headers: { "Content-Type": "application/json" },
      jsonBody: { error: "Failed to fetch keyword research" }
    };
  }
}

// POST generate content brief for keyword
export async function generateBrief(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  try {
    const projectId = request.params.projectId;
    const auth = verifyAuth(request);

    if (!auth) {
      return {
        status: 401,
        headers: { "Content-Type": "application/json" },
        jsonBody: { error: "Unauthorized" }
      };
    }

    const body = await request.json() as { keyword?: string };
    const keyword = body.keyword;

    if (!keyword) {
      return {
        status: 400,
        headers: { "Content-Type": "application/json" },
        jsonBody: { error: "Keyword required" }
      };
    }

    // Verify project ownership
    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project || project.userId !== auth.userId) {
      return {
        status: 404,
        headers: { "Content-Type": "application/json" },
        jsonBody: { error: "Project not found" }
      };
    }

    const brief = await generateContentBrief(keyword, project.domain);

    const response: HttpResponseInit = {
      status: 200,
      headers: { "Content-Type": "application/json" },
      jsonBody: { data: brief }
    };

    return response;

  } catch (error) {
    context.error('Error generating brief:', error);
    return {
      status: 500,
      headers: { "Content-Type": "application/json" },
      jsonBody: { error: "Failed to generate content brief" }
    };
  }
}

// POST score on-page content
export async function scoreContent(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  try {
    const projectId = request.params.projectId;
    const auth = verifyAuth(request);

    if (!auth) {
      return {
        status: 401,
        headers: { "Content-Type": "application/json" },
        jsonBody: { error: "Unauthorized" }
      };
    }

    const body = await request.json() as {
      keyword?: string;
      title?: string;
      h1?: string;
      meta?: string;
      body?: string;
    };

    if (!body.keyword || !body.body) {
      return {
        status: 400,
        headers: { "Content-Type": "application/json" },
        jsonBody: { error: "Keyword and body content required" }
      };
    }

    // Verify project ownership
    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project || project.userId !== auth.userId) {
      return {
        status: 404,
        headers: { "Content-Type": "application/json" },
        jsonBody: { error: "Project not found" }
      };
    }

    const score = scoreOnPageContent(body.keyword, {
      title: body.title || "",
      h1: body.h1 || "",
      meta: body.meta || "",
      body: body.body,
      images: [],
      links: [],
    });

    const response: HttpResponseInit = {
      status: 200,
      headers: { "Content-Type": "application/json" },
      jsonBody: { data: score }
    };

    return response;

  } catch (error) {
    context.error('Error scoring content:', error);
    return {
      status: 500,
      headers: { "Content-Type": "application/json" },
      jsonBody: { error: "Failed to score content" }
    };
  }
}

// Register routes
app.http('getKeywordResearch', {
  methods: ['GET'],
  authLevel: 'anonymous',
  route: 'v1/projects/{projectId}/keywords',
  handler: getKeywordResearch,
});

app.http('generateBrief', {
  methods: ['POST'],
  authLevel: 'anonymous',
  route: 'v1/projects/{projectId}/content-brief',
  handler: generateBrief,
});

app.http('scoreContent', {
  methods: ['POST'],
  authLevel: 'anonymous',
  route: 'v1/projects/{projectId}/content-score',
  handler: scoreContent,
});
