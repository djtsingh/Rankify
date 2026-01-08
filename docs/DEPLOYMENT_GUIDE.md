# Rankify End-to-End Deployment Guide

## Architecture Overview

```
┌─────────────────────┐     ┌─────────────────────────┐     ┌─────────────────────┐
│   Azure Static      │     │    Azure Functions      │     │  Azure Storage      │
│   Web Apps          │────▶│    (API/Traffic Cop)    │────▶│  Queue              │
│   (Next.js)         │     │    Node.js v22          │     │  (scan-jobs)        │
└─────────────────────┘     └─────────────────────────┘     └──────────┬──────────┘
                                       │                                │
                                       │                                │
                                       ▼                                ▼
                            ┌─────────────────────────┐     ┌─────────────────────┐
                            │  Azure PostgreSQL       │◀────│  Azure Container    │
                            │  Flexible Server        │     │  Apps (Python)      │
                            │  (Database)             │     │  (SEO Worker)       │
                            └─────────────────────────┘     └─────────────────────┘
```

## Azure Resources

| Resource | Name | Region | Purpose |
|----------|------|--------|---------|
| Static Web App | rankify-v1 | East Asia | Frontend (Next.js) |
| Function App | rankify-v1-src | Central India | API Gateway |
| PostgreSQL | rankify-v1-data | Central India | Database |
| Storage Account | djtblobfree | Central India | Queue + Files |
| Container Registry | rankifyacr | Central India | Docker Images |
| Container Apps Env | rankify-env | Central India | Python Worker |

## Deployment Steps

### Prerequisites

1. Azure CLI installed and logged in
2. Docker installed (for building Python worker)
3. Node.js 22+ installed
4. pnpm installed (`npm install -g pnpm`)

### Step 1: Database Migration

Apply the scans tables migration:

```powershell
# From project root
cd local-testing
.\run-migration.ps1
```

Or manually:

```sql
-- Connect to PostgreSQL and run:
-- api/prisma/migrations/20250111_add_scans_tables/migration.sql
```

### Step 2: Deploy Azure Functions

```powershell
# From project root
cd api

# Install dependencies
pnpm install

# Build
pnpm run build

# Deploy to Azure
func azure functionapp publish rankify-v1-src
```

Or via GitHub Actions (automatic on push to main).

### Step 3: Deploy Python Worker

```powershell
# Option A: Use the deployment script
cd local-testing
.\deploy-python-worker.ps1

# Option B: Manual deployment
cd backend/SEO-checker/py-services

# Login to ACR
az acr login --name rankifyacr

# Build and push
docker build -t rankifyacr.azurecr.io/seo-worker:latest .
docker push rankifyacr.azurecr.io/seo-worker:latest

# Create/Update Container App
az containerapp create \
  --name seo-worker \
  --resource-group rankify-v1 \
  --environment rankify-env \
  --image rankifyacr.azurecr.io/seo-worker:latest \
  --registry-server rankifyacr.azurecr.io \
  --min-replicas 0 \
  --max-replicas 3 \
  --env-vars \
    "AZURE_STORAGE_CONNECTION_STRING=<connection-string>" \
    "DATABASE_URL=postgresql://user:pass@host:5432/db?sslmode=require" \
    "QUEUE_NAME=scan-jobs"
```

### Step 4: Configure Environment Variables

#### Azure Functions (rankify-v1-src)

Set these in Azure Portal > Function App > Configuration:

```
DATABASE_URL=postgresql://adminuser:PASSWORD@rankify-v1-data.postgres.database.azure.com:5432/rankify?sslmode=require
AZURE_STORAGE_CONNECTION_STRING=<from storage account>
```

#### Container App (seo-worker)

```
AZURE_STORAGE_CONNECTION_STRING=<from storage account>
DATABASE_URL=postgresql://adminuser:PASSWORD@rankify-v1-data.postgres.database.azure.com:5432/rankify?sslmode=require
QUEUE_NAME=scan-jobs
POLL_INTERVAL=5
MAX_RETRIES=3
```

### Step 5: Deploy Frontend

Frontend deploys automatically via GitHub Actions to Azure Static Web Apps.

For manual deployment:

```powershell
cd apps/web
pnpm run build

# The built files go to Static Web Apps via GitHub Action
```

### Step 6: Smoke Test

```powershell
# Run end-to-end test
cd local-testing
.\smoke-test-e2e.ps1 -ApiBaseUrl "https://rankify-v1-src.azurewebsites.net/api/v1"
```

## Scan Flow

1. **User initiates scan**
   - Frontend calls `POST /api/v1/scans` with URL
   
2. **API creates scan record**
   - Azure Function creates record in PostgreSQL (status: `pending`)
   - Queues job to `scan-jobs` queue
   - Returns scan ID to frontend

3. **Worker processes scan**
   - Python Container App polls queue
   - Picks up job, updates status to `processing`
   - Fetches URL, extracts comprehensive SEO metrics
   - Saves results to database
   - Updates status to `completed`

4. **Frontend polls for results**
   - Calls `GET /api/v1/scans/{id}` periodically
   - Displays results when complete

## Monitoring

### View Container App Logs

```bash
az containerapp logs show \
  --name seo-worker \
  --resource-group rankify-v1 \
  --follow
```

### View Function App Logs

```bash
func azure functionapp logstream rankify-v1-src
```

### Check Queue Messages

```bash
az storage message peek \
  --queue-name scan-jobs \
  --account-name djtblobfree \
  --num-messages 10
```

## Troubleshooting

### Scans stuck in "pending"

1. Check Container App is running:
   ```bash
   az containerapp show --name seo-worker --resource-group rankify-v1 --query "properties.runningStatus"
   ```

2. Check Container App logs for errors

3. Verify queue has messages:
   ```bash
   az storage queue show --name scan-jobs --account-name djtblobfree --query "metadata.approximateMessageCount"
   ```

### Scan fails immediately

1. Check Function App logs for queue errors
2. Verify `AZURE_STORAGE_CONNECTION_STRING` is set correctly
3. Check database connection

### Worker can't connect to database

1. Verify `DATABASE_URL` format
2. Check PostgreSQL firewall allows Container Apps
3. Verify password is correct

## File Structure

```
api/
├── src/functions/
│   ├── scans.ts          # POST/GET scan endpoints
│   └── health.ts         # Health check
├── prisma/
│   └── schema.prisma     # Database schema
└── package.json

backend/SEO-checker/py-services/
├── worker/
│   └── queue_worker.py   # Queue consumer
├── extractor/
│   └── comprehensive_extractor.py  # SEO metrics
├── Dockerfile
└── requirements.txt

.github/workflows/
├── azure-static-web-apps-*.yml  # Frontend deploy
└── deploy-python-worker.yml     # Worker deploy

local-testing/
├── deploy-python-worker.ps1     # Worker deployment
├── run-migration.ps1            # Database migration
└── smoke-test-e2e.ps1          # End-to-end test
```
