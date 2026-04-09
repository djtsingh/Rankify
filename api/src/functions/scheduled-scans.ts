import { app, HttpRequest, HttpResponseInit, InvocationContext, Timer } from "@azure/functions";
import { prisma } from "../lib/prisma";
import { randomUUID } from "crypto";
import { verifyAuth } from "../lib/jwt-auth";
import { checkRateLimit, RATE_LIMIT_CONFIGS, addRateLimitHeaders } from "../lib/rate-limit";

/**
 * Scheduled Scans — Runs weekly per project
 * Triggered by Azure Timer Trigger function
 */

// GET scheduled scans for a project
export async function getScheduledScans(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
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

    // Get scheduled scans for this project
    const scans = await prisma.scan.findMany({
      where: {
        // Assuming we add projectId to Scan model
        // For now, filter by URL matching project
        url: { startsWith: new URL(project.url).origin }
      },
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    const response: HttpResponseInit = {
      status: 200,
      headers: { "Content-Type": "application/json" },
      jsonBody: { data: scans }
    };

    return response;

  } catch (error) {
    context.error('Error fetching scheduled scans:', error);
    return {
      status: 500,
      headers: { "Content-Type": "application/json" },
      jsonBody: { error: "Failed to fetch scans" }
    };
  }
}

// Schedule a weekly scan for a project
export async function scheduleWeeklyScan(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
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

    const body = await request.json() as { dayOfWeek?: number; time?: string };

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

    // In production, store schedule in database
    // For now, trigger immediate scan + log schedule intent
    const scanId = randomUUID();
    await prisma.scan.create({
      data: {
        id: scanId,
        url: project.url,
        urlHash: Buffer.from(project.url).toString("base64").substring(0, 64),
        status: "pending",
      },
    });

    return {
      status: 201,
      headers: { "Content-Type": "application/json" },
      jsonBody: {
        data: {
          projectId,
          scanId,
          schedule: {
            dayOfWeek: body.dayOfWeek || 1,
            time: body.time || "09:00",
          },
          message: "Weekly scan scheduled",
        }
      }
    };

  } catch (error) {
    context.error('Error scheduling scan:', error);
    return {
      status: 500,
      headers: { "Content-Type": "application/json" },
      jsonBody: { error: "Failed to schedule scan" }
    };
  }
}

/**
 * Azure Timer Trigger function
 * Runs on schedule (e.g., every Monday at 9 AM)
 */
export async function timerTriggerScheduledScans(myTimer: Timer, context: InvocationContext) {
  context.log("Scheduled scan timer triggered");

  try {
    // Get all active projects
    const projects = await prisma.project.findMany({
      where: { isActive: true },
    });

    context.log(`Found ${projects.length} active projects to scan`);

    // Queue a scan for each project
    for (const project of projects) {
      const scanId = randomUUID();
      await prisma.scan.create({
        data: {
          id: scanId,
          url: project.url,
          urlHash: Buffer.from(project.url).toString("base64").substring(0, 64),
          status: "pending",
        },
      });

      context.log(`Queued scan for project: ${project.id} (scanId: ${scanId})`);
    }

    context.log(`Scheduled ${projects.length} scans successfully`);
  } catch (error) {
    context.error("Error in scheduled scan trigger:", error);
  }
}

// Register HTTP endpoints
app.http('getScheduledScans', {
  methods: ['GET'],
  authLevel: 'anonymous',
  route: 'v1/projects/{projectId}/scans',
  handler: getScheduledScans,
});

app.http('scheduleWeeklyScan', {
  methods: ['POST'],
  authLevel: 'anonymous',
  route: 'v1/projects/{projectId}/schedule',
  handler: scheduleWeeklyScan,
});

// Timer trigger - runs on schedule
app.timer('timerTriggerScheduledScans', {
  schedule: '0 9 * * 1', // Every Monday at 9 AM (cron format)
  handler: timerTriggerScheduledScans,
});
