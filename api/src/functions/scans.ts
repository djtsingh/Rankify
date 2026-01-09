import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { prisma } from "../lib/prisma";
import { QueueServiceClient } from "@azure/storage-queue";
import { randomUUID } from "crypto";

const STORAGE_CONNECTION_STRING = process.env.AZURE_STORAGE_CONNECTION_STRING || process.env.AzureWebJobsStorage || '';
const QUEUE_NAME = 'scan-jobs';

function getQueueClient() {
    if (!STORAGE_CONNECTION_STRING) {
        throw new Error('AZURE_STORAGE_CONNECTION_STRING is not configured');
    }
    const queueServiceClient = QueueServiceClient.fromConnectionString(STORAGE_CONNECTION_STRING);
    return queueServiceClient.getQueueClient(QUEUE_NAME);
}

export async function createScan(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log('Create scan request received');

    if (request.method === 'OPTIONS') {
        return {
            status: 204,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization',
            }
        };
    }

    try {
        const body = await request.json() as { url?: string };
        const url = body.url;

        if (!url) {
            return {
                status: 400,
                headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
                jsonBody: { error: 'URL is required', message: 'Please provide a url field in the request body' }
            };
        }

        let normalizedUrl: string;
        try {
            normalizedUrl = url.match(/^https?:\/\//) ? url : `https://${url}`;
            new URL(normalizedUrl);
        } catch {
            return {
                status: 400,
                headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
                jsonBody: { error: 'Invalid URL', message: 'Please provide a valid URL' }
            };
        }

        const scanId = randomUUID();
        const urlHash = Buffer.from(normalizedUrl).toString('base64').substring(0, 64);

        await prisma.$executeRaw`
            INSERT INTO scans (id, url, url_hash, status, created_at, updated_at)
            VALUES (${scanId}::uuid, ${normalizedUrl}, ${urlHash}, 'pending', NOW(), NOW())
        `;

        context.log(`Scan created in DB: ${scanId}`);

        try {
            const queueClient = getQueueClient();
            const message = {
                scanId: scanId,
                url: normalizedUrl,
                createdAt: new Date().toISOString()
            };

            const encodedMessage = Buffer.from(JSON.stringify(message)).toString('base64');
            await queueClient.sendMessage(encodedMessage);

            context.log(`Job queued for scan: ${scanId}`);
        } catch (queueError) {
            context.error('Failed to queue job:', queueError);
            await prisma.$executeRaw`UPDATE scans SET status = 'failed', error_message = 'Failed to queue job', updated_at = NOW() WHERE id = ${scanId}::uuid`;
            throw queueError;
        }

        return {
            status: 202,
            headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
            jsonBody: {
                scan_id: scanId,
                url: normalizedUrl,
                status: 'pending',
                message: 'Scan queued successfully',
                estimated_time_seconds: 30
            }
        };

    } catch (error) {
        context.error('Error creating scan:', error);

        return {
            status: 500,
            headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
            jsonBody: {
                error: 'Failed to create scan',
                message: error instanceof Error ? error.message : 'Unknown error'
            }
        };
    }
}

export async function getScan(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    const scanId = request.params.id;
    context.log('Get scan request received for ID:', scanId);

    if (request.method === 'OPTIONS') {
        return {
            status: 204,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization',
            }
        };
    }

    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!scanId || !uuidRegex.test(scanId)) {
        return {
            status: 400,
            headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
            jsonBody: { error: 'Invalid scan ID format', message: 'Scan ID must be a valid UUID' }
        };
    }

    try {
        const scanResult = await prisma.$queryRaw<any[]>`
            SELECT
                s.id as scan_id,
                s.url,
                s.status,
                s.error_message,
                s.created_at,
                s.completed_at,
                sr.score,
                sr.metrics,
                sr.category_scores
            FROM scans s
            LEFT JOIN scan_results sr ON s.id = sr.scan_id
            WHERE s.id = ${scanId}::uuid
        `;

        if (!scanResult || scanResult.length === 0) {
            return {
                status: 404,
                headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
                jsonBody: { error: 'Scan not found', message: 'No scan exists with this ID', scan_id: scanId }
            };
        }

        const scan = scanResult[0];

        let issues: any[] = [];
        if (scan.status === 'completed') {
            issues = await prisma.$queryRaw<any[]>`
                SELECT
                    id,
                    type,
                    category,
                    severity,
                    title,
                    description,
                    recommendation,
                    impact_score,
                    expected_improvement,
                    time_to_fix_hours,
                    priority,
                    data
                FROM issues
                WHERE scan_id = ${scanId}::uuid
                ORDER BY priority ASC, impact_score DESC
            `;
        }

        const score = scan.score || 0;
        const grade = score >= 90 ? 'A' : score >= 80 ? 'B+' : score >= 70 ? 'B' : score >= 60 ? 'C+' : 'C';

        const response: any = {
            data: {
                id: scan.scan_id,
                url: scan.url,
                status: scan.status,
                score: scan.score,
                grade: scan.status === 'completed' ? grade : undefined,
                createdAt: scan.created_at,
                completedAt: scan.completed_at,
                errorMessage: scan.error_message,
                results: scan.metrics ? {
                    ...scan.metrics,
                    categoryScores: scan.category_scores
                } : undefined,
                issues: issues,
                summary: scan.status === 'completed' ? {
                    criticalIssues: issues.filter((i: any) => i.category === 'critical').length,
                    warnings: issues.filter((i: any) => i.severity === 'warning').length,
                    passedChecks: Math.max(0, 50 - issues.length),
                    totalChecks: 50
                } : undefined
            }
        };

        return {
            status: 200,
            headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
            jsonBody: response
        };

    } catch (error) {
        context.error('Error fetching scan:', error);

        return {
            status: 500,
            headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
            jsonBody: {
                error: 'Failed to fetch scan',
                message: error instanceof Error ? error.message : 'Unknown error'
            }
        };
    }
}

app.http('createScan', {
    methods: ['POST', 'OPTIONS'],
    authLevel: 'anonymous',
    route: 'v1/scans',
    handler: createScan,
});

app.http('getScan', {
    methods: ['GET', 'OPTIONS'],
    authLevel: 'anonymous',
    route: 'v1/scans/{id}',
    handler: getScan,
});
