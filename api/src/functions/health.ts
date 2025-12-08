import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";

export async function health(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log('Health check requested');

    return {
        status: 200,
        headers: {
            'Content-Type': 'application/json'
        },
        jsonBody: {
            status: 'healthy',
            timestamp: new Date().toISOString(),
            version: '1.0.0',
            environment: process.env.AZURE_FUNCTIONS_ENVIRONMENT || 'development',
            message: 'API running in mock mode - database coming soon',
            services: {
                database: {
                    status: 'not_configured',
                    note: 'Database will be connected via standalone Azure Functions'
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
