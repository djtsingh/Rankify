# Rankify Deployment Architecture

## Overview

Rankify uses a multi-service architecture deployed on Azure:

```
┌──────────────────────────────────────────────────────────────────┐
│                        Azure Static Web Apps                      │
│                    (Frontend - Next.js Static)                    │
│                    https://your-app.azurestaticapps.net           │
└─────────────────────────────┬────────────────────────────────────┘
                              │
                              ▼
┌──────────────────────────────────────────────────────────────────┐
│                      Azure Functions App                          │
│                   (API - Node.js TypeScript)                      │
│                  https://rankify-v1-src.azurewebsites.net         │
│                                                                   │
│  Endpoints:                                                       │
│  - POST /api/v1/scans  → Create scan, queue job                   │
│  - GET  /api/v1/scans/{id} → Get scan status/results              │
│  - GET  /api/health    → Health check                             │
└─────────────────────────────┬────────────────────────────────────┘
                              │
            ┌─────────────────┴─────────────────┐
            ▼                                   ▼
┌───────────────────────┐         ┌──────────────────────────┐
│   Azure Storage Queue │         │   Azure PostgreSQL        │
│     (scan-jobs)       │         │  (rankify-v1-data)        │
│                       │         │                           │
│  Messages:            │         │  Tables:                  │
│  - scanId             │         │  - scans                  │
│  - url                │         │  - scan_results           │
│  - createdAt          │         │  - issues                 │
└───────────┬───────────┘         └───────────────────────────┘
            │                                   ▲
            ▼                                   │
┌──────────────────────────────────────────────┴───────────────────┐
│                    Azure Container Apps                           │
│                  (Python SEO Worker)                              │
│                                                                   │
│  - Polls scan-jobs queue                                          │
│  - Fetches URL, extracts metrics                                  │
│  - Saves results to PostgreSQL                                    │
│  - Auto-scales 0-3 replicas based on queue length                 │
└──────────────────────────────────────────────────────────────────┘
```

## Deployment Workflows

### 1. Frontend (Azure Static Web Apps)
**Workflow:** `.github/workflows/azure-static-web-apps.yml`
**Trigger:** Push to `main` with changes in `apps/web/**`

```bash
# What it does:
1. Builds Next.js app with `pnpm build:web`
2. Deploys static output to Azure Static Web Apps
3. Copies staticwebapp.config.json for routing
```

**Required Secrets:**
- `AZURE_STATIC_WEB_APPS_API_TOKEN`

### 2. API Functions (Azure Functions)
**Workflow:** `.github/workflows/main_rankify-v1-src.yml`
**Trigger:** Push to `main` with changes in `api/**`

```bash
# What it does:
1. Uploads source code to Azure
2. Azure Oryx builds TypeScript during deployment
3. Installs dependencies via npm
```

**Required Secrets:**
- `AZURE_FUNCTIONAPP_PUBLISH_PROFILE`

**Required App Settings (Azure Portal):**
- `DATABASE_URL` - PostgreSQL connection string
- `AZURE_STORAGE_CONNECTION_STRING` - For queue access
- `AzureWebJobsStorage` - Same as above

### 3. Python Worker (Azure Container Apps)
**Workflow:** `.github/workflows/deploy-python-worker.yml`
**Trigger:** Push to `main` with changes in `backend/SEO-checker/py-services/**`

```bash
# What it does:
1. Builds Docker image
2. Pushes to Azure Container Registry (rankifyacr)
3. Deploys to Azure Container Apps with auto-scaling
```

**Required Secrets:**
- `AZURE_CREDENTIALS` - Service principal JSON
- `ACR_USERNAME` - Container registry username
- `ACR_PASSWORD` - Container registry password
- `AZURE_STORAGE_CONNECTION_STRING`
- `DATABASE_URL`

## Environment Variables

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=https://rankify-v1-src.azurewebsites.net
NEXT_PUBLIC_USE_MOCK=false
```

### API (Azure Portal App Settings)
```env
DATABASE_URL=postgresql://user:pass@host:5432/db?sslmode=require
AZURE_STORAGE_CONNECTION_STRING=DefaultEndpointsProtocol=https;...
AzureWebJobsStorage=<same as above>
FUNCTIONS_WORKER_RUNTIME=node
```

### Python Worker (Container Apps Environment Variables)
```env
DATABASE_URL=postgresql://user:pass@host:5432/db?sslmode=require
AZURE_STORAGE_CONNECTION_STRING=DefaultEndpointsProtocol=https;...
QUEUE_NAME=scan-jobs
POLL_INTERVAL=5
```

## Manual Deployment Steps

### Deploy Frontend Manually
```bash
cd apps/web
pnpm build
# Output is in apps/web/out/
# Upload to Azure Static Web Apps via Azure Portal or CLI
```

### Deploy API Manually
```bash
cd api
npm run build
# Use Azure Functions Core Tools:
func azure functionapp publish rankify-v1-src
```

### Deploy Python Worker Manually
```bash
cd backend/SEO-checker/py-services
docker build -t rankifyacr.azurecr.io/seo-worker:latest .
docker push rankifyacr.azurecr.io/seo-worker:latest
az containerapp update --name seo-worker --resource-group rankify-v1 --image rankifyacr.azurecr.io/seo-worker:latest
```

## Troubleshooting

### Check API Health
```bash
curl https://rankify-v1-src.azurewebsites.net/api/health
```

### Check Worker Logs
```bash
az containerapp logs show --name seo-worker --resource-group rankify-v1
```

### Check Queue Messages
Use Azure Portal → Storage Account → Queues → scan-jobs

### Common Issues

1. **404 on API calls**: Check CORS settings and route configuration
2. **Scans stuck in pending**: Check Python worker is running and can access queue
3. **Database errors**: Verify DATABASE_URL and firewall rules
4. **Queue errors**: Verify AZURE_STORAGE_CONNECTION_STRING

## Security Checklist

- [ ] All secrets in GitHub Secrets, not in code
- [ ] Database firewall allows only Azure services
- [ ] HTTPS enforced everywhere
- [ ] CSP headers configured in staticwebapp.config.json
- [ ] No credentials in logs
- [ ] Environment variables not exposed to client
