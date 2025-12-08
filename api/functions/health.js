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
function health(request, context) {
    return __awaiter(this, void 0, void 0, function* () {
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
    });
}
functions_1.app.http('health', {
    methods: ['GET'],
    authLevel: 'anonymous',
    route: 'health',
    handler: health
});
//# sourceMappingURL=health.js.map