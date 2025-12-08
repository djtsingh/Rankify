# Rankify - Production Configuration

## Live Deployment

### Frontend (Static Web App)
- **URL**: https://www.rankify.page
- **Deployment**: Automatic via GitHub Actions on push to `main`
- **Source**: `/web` folder

### Backend API (Azure Functions)
- **URL**: https://rankify-v1-src.azurewebsites.net
- **Endpoints**:
  - Health: `/api/health`
  - Test: `/api/test`
- **Deployment**: Automatic via GitHub Actions on push to `main`
- **Source**: `/api` folder

### Database
- **Type**: Azure PostgreSQL Flexible Server
- **Tier**: B1MS (Burstable, Central India)
- **Connection**: Configured via `DATABASE_URL` environment variable

## Project Structure

```
Rankify/
├── web/                     # Next.js frontend
├── api/                     # Azure Functions backend
│   ├── src/
│   │   ├── functions/      # Function handlers (TypeScript)
│   │   ├── lib/            # Shared utilities (Prisma client)
│   │   └── index.ts        # Entry point (imports all functions)
│   ├── prisma/
│   │   └── schema.prisma   # Database schema
│   ├── dist/               # Compiled output (gitignored, Azure builds this)
│   ├── host.json           # Azure Functions configuration
│   ├── local.settings.json # Local environment variables
│   ├── package.json        # Dependencies & scripts
│   └── tsconfig.json       # TypeScript configuration
├── local-testing/          # Local development scripts (gitignored)
└── .github/workflows/      # CI/CD pipelines

```

## Key Configuration

### Azure Functions Setup
- **Runtime**: Node.js 22
- **OS**: Linux (required for v4 programming model)
- **Plan**: Consumption (serverless)
- **Programming Model**: Azure Functions v4
- **Build**: Remote build with Oryx (Azure handles TypeScript compilation)

### Critical Settings (Azure Portal)
```
FUNCTIONS_WORKER_RUNTIME=node
DATABASE_URL=postgresql://...
SCM_DO_BUILD_DURING_DEPLOYMENT=true
ENABLE_ORYX_BUILD=true
WEBSITE_NODE_DEFAULT_VERSION=~22
```

### TypeScript Configuration (`api/tsconfig.json`)
```json
{
  "compilerOptions": {
    "outDir": "dist",        // Output to dist folder
    "rootDir": "src",
    "typeRoots": ["./node_modules/@types"],
    "esModuleInterop": true,
    "skipLibCheck": true
  }
}
```

### Package.json Entry Point
```json
{
  "main": "dist/index.js"   // Entry point for function discovery
}
```

### Dependencies in Production
- `@azure/functions` - v4 programming model
- `@prisma/client` - Database ORM
- `prisma` - Schema management
- `typescript` - Required for Azure remote build
- `@types/node` - TypeScript definitions

## Local Development

See `LOCAL_DEVELOPMENT.md` for complete local setup instructions.

**Quick Start:**
```bash
cd api
npm install
npm run build
func start
```

Functions available at:
- http://localhost:7071/api/health
- http://localhost:7071/api/test

## Deployment Process

### Automatic (Recommended)
Push to `main` branch triggers GitHub Actions:
1. Checks out code
2. Uploads `api/` folder to Azure
3. Azure runs remote build:
   - `npm install` (includes TypeScript)
   - `npx prisma generate`
   - `tsc` (compiles to dist/)
4. Azure loads `dist/index.js` and discovers functions

### Manual Testing
Use scripts in `local-testing/` folder (not committed to repo).

## Important Notes

### What Gets Deployed to Azure
- ✅ Source files: `src/`, `prisma/`, `package.json`, `tsconfig.json`
- ❌ NOT: `node_modules`, `dist/`, compiled files (Azure builds these)

### Function Discovery (v4 Model)
Functions MUST be imported in `src/index.ts`:
```typescript
import './functions/health';
import './functions/test';
```

This ensures `app.http()` registration code runs at startup.

### Binary Targets (Prisma)
```prisma
binaryTargets = ["native", "windows", "debian-openssl-3.0.x"]
```
Supports local Windows development + Linux Azure deployment.

## Resource Details

### Resource Group: `rankify`
- Static Web App: `rankify` (Free tier)
- Function App: `rankify-v1-src` (Consumption, Linux, Node 22)
- PostgreSQL Server: `rankify-v1-data` (B1MS)
- Application Insights: `rankify-v1-src` (monitoring)

### Region
Central India (all resources co-located)

## Environment Variables

### Local (`api/local.settings.json`)
```json
{
  "Values": {
    "FUNCTIONS_WORKER_RUNTIME": "node",
    "AzureWebJobsFeatureFlags": "EnableWorkerIndexing",
    "DATABASE_URL": "postgresql://...",
    "NODE_ENV": "development"
  }
}
```

### Azure (Portal → Configuration)
- DATABASE_URL (from PostgreSQL)
- FUNCTIONS_WORKER_RUNTIME=node
- SCM_DO_BUILD_DURING_DEPLOYMENT=true
- ENABLE_ORYX_BUILD=true

## Troubleshooting

### Functions return 404
- Check `az functionapp function list` - should show registered functions
- Verify `main: dist/index.js` in package.json
- Ensure `src/index.ts` imports all function files
- Check build logs in Kudu (https://rankify-v1-src.scm.azurewebsites.net)

### Database connection fails
- Verify DATABASE_URL in Azure settings
- Check PostgreSQL firewall rules (allow Azure services)
- Test locally first

### Local functions not discovered
- Run `npm run build` first
- Verify `dist/index.js` exists
- Check `EnableWorkerIndexing` in local.settings.json

## Next Steps

With infrastructure complete, you can now:
1. Add more API endpoints in `api/src/functions/`
2. Update Prisma schema and run migrations
3. Connect frontend to API endpoints
4. Implement authentication
5. Add monitoring and alerts
