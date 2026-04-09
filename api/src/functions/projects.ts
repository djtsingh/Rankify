import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { prisma } from "../lib/prisma";
import { randomUUID } from "crypto";
import { checkRateLimit, RATE_LIMIT_CONFIGS, getClientIp, addRateLimitHeaders } from "../lib/rate-limit";
import { validateScanUrl } from "../lib/validation";
import { verifyAuth } from "../lib/jwt-auth";

// CREATE project
app.post("createProject", async (request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> => {
  try {
    // Rate limit
    const rateLimitResult = checkRateLimit(request, RATE_LIMIT_CONFIGS.api);
    if (!rateLimitResult.allowed) {
      return rateLimitResult.response!;
    }

    // Auth check
    const userId = await verifyAuth(request);
    if (!userId) {
      return {
        status: 401,
        headers: { "Content-Type": "application/json" },
        jsonBody: { error: "Unauthorized", message: "Missing or invalid auth token" }
      };
    }

    const body = await request.json() as { name?: string; domain?: string; url?: string };
    
    if (!body.name || !body.url) {
      return {
        status: 400,
        headers: { "Content-Type": "application/json" },
        jsonBody: { error: "Missing fields", message: "name and url are required" }
      };
    }

    // Validate URL
    const urlValidation = validateScanUrl(body.url, { allowPrivate: false });
    if (!urlValidation.isValid) {
      return {
        status: 400,
        headers: { "Content-Type": "application/json" },
        jsonBody: { error: "Invalid URL", message: urlValidation.error }
      };
    }

    const projectId = randomUUID();
    const project = await prisma.project.create({
      data: {
        id: projectId,
        userId,
        name: body.name,
        domain: new URL(body.url).hostname,
        url: urlValidation.value!,
        isActive: true,
      },
    });

    const response: HttpResponseInit = {
      status: 201,
      headers: { "Content-Type": "application/json" },
      jsonBody: { data: project }
    };

    return addRateLimitHeaders(response, RATE_LIMIT_CONFIGS.api.maxRequests, rateLimitResult.remaining, rateLimitResult.resetTime);

  } catch (error) {
    context.error('Error creating project:', error);
    return {
      status: 500,
      headers: { "Content-Type": "application/json" },
      jsonBody: { error: "Failed to create project", message: error instanceof Error ? error.message : "Unknown error" }
    };
  }
}

// GET projects (list)
export async function getProjects(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  try {
    // Rate limit
    const rateLimitResult = checkRateLimit(request, RATE_LIMIT_CONFIGS.api);
    if (!rateLimitResult.allowed) {
      return rateLimitResult.response!;
    }

    // Auth check
    const userId = await verifyAuth(request);
    if (!userId) {
      return {
        status: 401,
        headers: { "Content-Type": "application/json" },
        jsonBody: { error: "Unauthorized" }
      };
    }

    const projects = await prisma.project.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    const response: HttpResponseInit = {
      status: 200,
      headers: { "Content-Type": "application/json" },
      jsonBody: { data: projects }
    };

    return addRateLimitHeaders(response, RATE_LIMIT_CONFIGS.api.maxRequests, rateLimitResult.remaining, rateLimitResult.resetTime);

  } catch (error) {
    context.error('Error fetching projects:', error);
    return {
      status: 500,
      headers: { "Content-Type": "application/json" },
      jsonBody: { error: "Failed to fetch projects" }
    };
  }
}

// GET project (single)
export async function getProject(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  try {
    const projectId = request.params.id;
    
    // Rate limit
    const rateLimitResult = checkRateLimit(request, RATE_LIMIT_CONFIGS.api);
    if (!rateLimitResult.allowed) {
      return rateLimitResult.response!;
    }

    // Auth check
    const userId = await verifyAuth(request);
    if (!userId) {
      return {
        status: 401,
        headers: { "Content-Type": "application/json" },
        jsonBody: { error: "Unauthorized" }
      };
    }

    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project || project.userId !== userId) {
      return {
        status: 404,
        headers: { "Content-Type": "application/json" },
        jsonBody: { error: "Project not found" }
      };
    }

    const response: HttpResponseInit = {
      status: 200,
      headers: { "Content-Type": "application/json" },
      jsonBody: { data: project }
    };

    return addRateLimitHeaders(response, RATE_LIMIT_CONFIGS.api.maxRequests, rateLimitResult.remaining, rateLimitResult.resetTime);

  } catch (error) {
    context.error('Error fetching project:', error);
    return {
      status: 500,
      headers: { "Content-Type": "application/json" },
      jsonBody: { error: "Failed to fetch project" }
    };
  }
}

// UPDATE project
export async function updateProject(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  try {
    const projectId = request.params.id;
    
    // Rate limit
    const rateLimitResult = checkRateLimit(request, RATE_LIMIT_CONFIGS.api);
    if (!rateLimitResult.allowed) {
      return rateLimitResult.response!;
    }

    // Auth check
    const userId = await verifyAuth(request);
    if (!userId) {
      return {
        status: 401,
        headers: { "Content-Type": "application/json" },
        jsonBody: { error: "Unauthorized" }
      };
    }

    const body = await request.json() as { name?: string; isActive?: boolean };
    
    // Verify ownership
    const existing = await prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!existing || existing.userId !== userId) {
      return {
        status: 404,
        headers: { "Content-Type": "application/json" },
        jsonBody: { error: "Project not found" }
      };
    }

    const updated = await prisma.project.update({
      where: { id: projectId },
      data: {
        ...(body.name && { name: body.name }),
        ...(body.isActive !== undefined && { isActive: body.isActive }),
        updatedAt: new Date(),
      },
    });

    const response: HttpResponseInit = {
      status: 200,
      headers: { "Content-Type": "application/json" },
      jsonBody: { data: updated }
    };

    return addRateLimitHeaders(response, RATE_LIMIT_CONFIGS.api.maxRequests, rateLimitResult.remaining, rateLimitResult.resetTime);

  } catch (error) {
    context.error('Error updating project:', error);
    return {
      status: 500,
      headers: { "Content-Type": "application/json" },
      jsonBody: { error: "Failed to update project" }
    };
  }
}

// DELETE project
export async function deleteProject(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  try {
    const projectId = request.params.id;
    
    // Rate limit
    const rateLimitResult = checkRateLimit(request, RATE_LIMIT_CONFIGS.api);
    if (!rateLimitResult.allowed) {
      return rateLimitResult.response!;
    }

    // Auth check
    const userId = await verifyAuth(request);
    if (!userId) {
      return {
        status: 401,
        headers: { "Content-Type": "application/json" },
        jsonBody: { error: "Unauthorized" }
      };
    }

    // Verify ownership
    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project || project.userId !== userId) {
      return {
        status: 404,
        headers: { "Content-Type": "application/json" },
        jsonBody: { error: "Project not found" }
      };
    }

    await prisma.project.delete({
      where: { id: projectId },
    });

    return {
      status: 204,
      headers: { "Content-Type": "application/json" },
    };

  } catch (error) {
    context.error('Error deleting project:', error);
    return {
      status: 500,
      headers: { "Content-Type": "application/json" },
      jsonBody: { error: "Failed to delete project" }
    };
  }
}

// Register routes
app.http('createProject', {
  methods: ['POST'],
  authLevel: 'anonymous',
  route: 'v1/projects',
  handler: createProject,
});

app.http('getProjects', {
  methods: ['GET'],
  authLevel: 'anonymous',
  route: 'v1/projects',
  handler: getProjects,
});

app.http('getProject', {
  methods: ['GET'],
  authLevel: 'anonymous',
  route: 'v1/projects/{id}',
  handler: getProject,
});

app.http('updateProject', {
  methods: ['PUT'],
  authLevel: 'anonymous',
  route: 'v1/projects/{id}',
  handler: updateProject,
});

app.http('deleteProject', {
  methods: ['DELETE'],
  authLevel: 'anonymous',
  route: 'v1/projects/{id}',
  handler: deleteProject,
});
