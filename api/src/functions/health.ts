import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { prisma } from "../lib/prisma";

export async function health(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log('Health check requested');

    let dbStatus = 'disconnected';
    let dbError = null;

    try {
        await prisma.$queryRaw`SELECT 1`;
        dbStatus = 'connected';
    } catch (error) {
        dbError = error instanceof Error ? error.message : 'Unknown error';
        context.error('Database connection failed:', error);
    }

    const isHealthy = dbStatus === 'connected';

    return {
        status: isHealthy ? 200 : 503,
        headers: {
            'Content-Type': 'application/json'
        },
        jsonBody: {
            status: isHealthy ? 'healthy' : 'degraded',
            timestamp: new Date().toISOString(),
            version: '1.0.0',
            environment: process.env.AZURE_FUNCTIONS_ENVIRONMENT || 'development',
            services: {
                database: {
                    status: dbStatus,
                    error: dbError
                }
            }
        }
    };
}

app.http('health', {
    methods: ['GET'],
    authLevel: 'anonymous',
    route: 'health',
    handler: health
});
