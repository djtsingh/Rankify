import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { prisma } from "../lib/prisma";
import { verifyAuth } from "../lib/jwt-auth";
import { classifyVertical, recordBenchmarkMetrics, compareToIndustry, getInsightMessage } from "../lib/benchmarking";
import { checkRateLimit, RATE_LIMIT_CONFIGS, addRateLimitHeaders } from "../lib/rate-limit";

/**
 * Stage 4: Benchmarking & Data Moat
 * Endpoints for industry comparisons and proprietary insights
 */

// GET benchmarks for a project
export async function getBenchmarks(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
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

    // Get latest scan for metrics
    const latestScan = await prisma.scanResult.findFirst({
      where: {
        scan: {
          url: project.url,
        },
      },
      orderBy: { createdAt: "desc" },
    });

    if (!latestScan || !latestScan.metrics) {
      return {
        status: 200,
        headers: { "Content-Type": "application/json" },
        jsonBody: {
          data: {
            message: "No scan data available yet. Run an audit to get benchmarks.",
          }
        }
      };
    }

    const vertical = classifyVertical(project.domain);
    const metrics = latestScan.metrics as any;
    const comparison = compareToIndustry(metrics, vertical);
    const insight = getInsightMessage(comparison);

    const response: HttpResponseInit = {
      status: 200,
      headers: { "Content-Type": "application/json" },
      jsonBody: {
        data: {
          vertical,
          yourMetrics: metrics,
          comparison,
          insight,
          timestamp: latestScan.createdAt,
        }
      }
    };

    return addRateLimitHeaders(response, RATE_LIMIT_CONFIGS.api.maxRequests, 59, Date.now() + 60000);

  } catch (error) {
    context.error('Error fetching benchmarks:', error);
    return {
      status: 500,
      headers: { "Content-Type": "application/json" },
      jsonBody: { error: "Failed to fetch benchmarks" }
    };
  }
}

// GET industry averages (public endpoint, no auth)
export async function getIndustryAverages(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  try {
    const vertical = (request.query.get('vertical') || 'general') as string;

    const response: HttpResponseInit = {
      status: 200,
      headers: { "Content-Type": "application/json" },
      jsonBody: {
        data: {
          vertical,
          message: "Industry averages by vertical - proprietary Rankify data",
          // In production, return aggregated data
          // For now, placeholder message
        }
      }
    };

    return response;

  } catch (error) {
    context.error('Error fetching industry averages:', error);
    return {
      status: 500,
      headers: { "Content-Type": "application/json" },
      jsonBody: { error: "Failed to fetch industry averages" }
    };
  }
}

// POST record scan metrics for benchmarking
export async function recordMetrics(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
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

    const body = await request.json() as any;

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

    const vertical = classifyVertical(project.domain);
    const recorded = await recordBenchmarkMetrics(project.domain, body.metrics, vertical);

    return {
      status: recorded ? 200 : 500,
      headers: { "Content-Type": "application/json" },
      jsonBody: {
        data: {
          recorded,
          vertical,
          message: "Metrics recorded for benchmarking",
        }
      }
    };

  } catch (error) {
    context.error('Error recording metrics:', error);
    return {
      status: 500,
      headers: { "Content-Type": "application/json" },
      jsonBody: { error: "Failed to record metrics" }
    };
  }
}

// Register routes
app.http('getBenchmarks', {
  methods: ['GET'],
  authLevel: 'anonymous',
  route: 'v1/projects/{projectId}/benchmarks',
  handler: getBenchmarks,
});

app.http('getIndustryAverages', {
  methods: ['GET'],
  authLevel: 'anonymous',
  route: 'v1/benchmarks/industry',
  handler: getIndustryAverages,
});

app.http('recordMetrics', {
  methods: ['POST'],
  authLevel: 'anonymous',
  route: 'v1/projects/{projectId}/benchmarks/record',
  handler: recordMetrics,
});
