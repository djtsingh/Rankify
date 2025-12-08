import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";

export async function test(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    return {
        status: 200,
        headers: {
            'Content-Type': 'application/json'
        },
        jsonBody: {
            message: 'API is working!',
            timestamp: new Date().toISOString()
        }
    };
}

app.http('test', {
    methods: ['GET'],
    authLevel: 'anonymous',
    route: 'test',
    handler: test
});
