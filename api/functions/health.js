"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.health = health;
const functions_1 = require("@azure/functions");
const prisma_1 = require("../lib/prisma");
function health(request, context) {
    return __awaiter(this, void 0, void 0, function* () {
        context.log('Health check requested');
        // Test database connection
        let dbStatus = 'disconnected';
        let dbError = null;
        try {
            yield prisma_1.prisma.$queryRaw `SELECT 1`;
            dbStatus = 'connected';
        }
        catch (error) {
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
    });
}
functions_1.app.http('health', {
    methods: ['GET'],
    authLevel: 'anonymous',
    route: 'health',
    handler: health
});
//# sourceMappingURL=health.js.map