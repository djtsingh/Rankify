# Container Apps Deployment Setup Guide

## Prerequisites

### 1. Azure Resources
- ✅ Azure Container Registry (ACR) named `rankifyacr`
- ✅ Azure Container Apps resource group `rankify-rg`
- ✅ Azure Container App named `rankify-web`
- ✅ PostgreSQL database (connection string in `DATABASE_URL`)

### 2. GitHub Repository Secrets
Add these secrets to your GitHub repository:

#### `AZURE_CREDENTIALS`
Azure service principal for authentication:
```bash
az ad sp create-for-rbac \
  --name "rankify-github-actions" \
  --role contributor \
  --scopes /subscriptions/{SUBSCRIPTION_ID}/resourceGroups/rankify-rg \
  --json-auth
```
Copy the JSON output and paste into GitHub Secrets.

#### `AZURE_REGISTRY_USERNAME`
ACR username:
```bash
az acr credential show --name rankifyacr --query username -o tsv
```

#### `AZURE_REGISTRY_PASSWORD`
ACR password:
```bash
az acr credential show --name rankifyacr --query "passwords[0].value" -o tsv
```

#### `DATABASE_URL`
PostgreSQL connection string:
```
postgresql://user:password@host:5432/rankify?sslmode=require
```

## Workflow Triggers

The workflow automatically triggers on:
- **Push to `main` branch**
- **Changes to `apps/web/**` directory**
- **Changes to `Dockerfile.web`**
- **Changes to `.github/workflows/deploy-frontend-container-apps.yml`**
- **Changes to `package.json` or `pnpm-lock.yaml`**

## Manual Trigger (Optional)

```bash
# From repository root
gh workflow run deploy-frontend-container-apps.yml
```

## Deployment Steps Breakdown

### Step 1: Checkout & Setup (30 seconds)
- Clones repository
- Sets up Node.js 22
- Installs pnpm

### Step 2: Build Frontend (2-3 minutes)
- Installs dependencies
- Updates `next.config.ts` for SSR (removes `output: 'export'`)
- Runs `pnpm build:web`
- Verifies `.next` directory exists

### Step 3: Azure Authentication (10 seconds)
- Logs in using `AZURE_CREDENTIALS`
- Authenticates to Azure Container Registry

### Step 4: Docker Build & Push (1-2 minutes)
- Builds multi-stage Dockerfile
- Tags with `latest` and commit SHA
- Pushes to `rankifyacr.azurecr.io`

### Step 5: Container App Update (1-2 minutes)
- Updates Container App with new image
- Sets environment variables
- Triggers rolling deployment

### Step 6: Health Check (20-60 seconds)
- Waits for container to start
- Polls health endpoint until 200 response
- Displays Container App URL

**Total Time: 5-10 minutes**

## Environment Variables

### Build-Time Variables
Set in workflow/Dockerfile:
- `NEXT_PUBLIC_API_URL` - Backend API endpoint
- `NODE_ENV` - Always "production"

### Runtime Variables
Set by Container App:
- `PORT` - 3000 (Next.js default)
- `NODE_ENV` - "production"
- `NEXT_TELEMETRY_DISABLED` - 1 (disable Vercel telemetry)
- `DATABASE_URL` - PostgreSQL connection

## Monitoring & Logs

### View Deployment Status
```bash
az containerapp show \
  --name rankify-web \
  --resource-group rankify-rg \
  --query "properties.provisioningState"
```

### View Container Logs
```bash
az containerapp logs show \
  --name rankify-web \
  --resource-group rankify-rg \
  --tail 100
```

### View Revisions
```bash
az containerapp revision list \
  --name rankify-web \
  --resource-group rankify-rg
```

### Rollback to Previous Version
```bash
# List recent revisions
az containerapp revision list --name rankify-web --resource-group rankify-rg

# Activate previous revision (by name)
az containerapp revision activate \
  --revision rankify-web--xxxxxx \
  --name rankify-web \
  --resource-group rankify-rg
```

## Troubleshooting

### Error: "Docker image not found"
```bash
# Verify ACR contains the image
az acr repository show \
  --name rankifyacr \
  --repository rankify-frontend
```

### Error: "Container won't start"
```bash
# Check logs for startup errors
az containerapp logs show \
  --name rankify-web \
  --resource-group rankify-rg \
  --follow
```

### Error: "Health check timeout"
- Increase startup period in Container App: `--startup-period=60s`
- Check if Node.js process is binding to PORT 3000
- Verify DATABASE_URL is accessible from container

### Slow deployment?
- Clear pnpm cache: `pnpm store prune`
- Use `--frozen-lockfile` to skip dependency resolution
- Consider splitting workflow stages

## Performance Tuning

### Optimize Image Size
Current Dockerfile uses multi-stage build:
- Stage 1: Install dependencies
- Stage 2: Build application
- Stage 3: Runtime (only `.next` + node_modules)

Typical size: **400-600 MB**

### Reduce Startup Time
- Pre-warm Node.js: `node --max-old-space-size=512 node_modules/.bin/next start`
- Increase Container App startup probe from 40s to 60s if needed
- Cache Node modules: use `--mount=type=cache` in Dockerfile (requires buildkit)

### Scaling Configuration
```bash
# Set minimum replicas
az containerapp update \
  --name rankify-web \
  --resource-group rankify-rg \
  --min-replicas 1 \
  --max-replicas 4

# Enable autoscaling rules
az containerapp update \
  --name rankify-web \
  --resource-group rankify-rg \
  --scale-rule-type cpu \
  --scale-rule-value 70 \
  --scale-rule-auth "disabled"
```

## Cost Estimation

| Component | Pricing | Monthly Cost |
|-----------|---------|--------------|
| Container Apps (1 replica, 0.5 vCPU) | $50/vCPU-month | ~$25 |
| Container Registry (Standard) | $100/month | $100 |
| Bandwidth (egress) | $0.20/GB | $10-50 |
| **Total** | | **$135-175** |

## Differences from Static Web Apps Workflow

### Static Web Apps (Current)
```yaml
- Uses: Azure/static-web-apps-deploy@v1
- Deploys: Pre-built HTML/CSS/JS
- No runtime: Pure static
- Size limit: ~1GB
```

### Container Apps (New)
```yaml
- Uses: Azure CLI (az containerapp update)
- Deploys: Docker image with Node.js runtime
- SSR capable: Server-side rendering
- Size limit: ~2GB (ACR limit)
```

## Next Steps

1. **Create Azure service principal** (step in Prerequisites)
2. **Add GitHub Secrets** with credentials
3. **Commit Dockerfile.web** to repository
4. **Commit new workflow** `.github/workflows/deploy-frontend-container-apps.yml`
5. **Push to main** - workflow should trigger automatically
6. **Monitor logs** via GitHub Actions UI
7. **Validate** Container App URL responds correctly
8. **Update DNS/CDN** if switching from SWA

## Support

- **Workflow Issues:** Check `.github/workflows/deploy-frontend-container-apps.yml`
- **Docker Issues:** Check `Dockerfile.web`
- **Azure Issues:** Check `az containerapp logs show`
- **Next.js Issues:** Check `apps/web/.next` build output

## Rollback Procedure

If something goes wrong:

1. **Immediate Rollback (1 minute)**
   ```bash
   az containerapp revision activate \
     --revision rankify-web--{PREVIOUS_REVISION} \
     --name rankify-web \
     --resource-group rankify-rg
   ```

2. **Rollback via Git** (revert commit, push to main)
   - Workflow triggers automatically
   - New deployment uses previous image

3. **Disaster Recovery**
   - Keep ACR image retention policy (keep last 10 versions)
   - Store important revisions: `az containerapp revision copy`

---

**Last Updated:** 2026-04-09
**Workflow Version:** 1.0
