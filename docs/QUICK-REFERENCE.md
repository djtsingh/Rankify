# Quick Reference: Container Apps Deployment

## File Locations
```
.github/workflows/deploy-frontend-container-apps.yml    # Main workflow (224 lines)
Dockerfile.web                                           # Docker build config (73 lines)
docs/DEPLOYMENT-CONTAINER-APPS.md                       # Detailed comparison
docs/SETUP-CONTAINER-APPS.md                            # Setup instructions
docs/CHECKLIST-CONTAINER-APPS.md                        # Pre-launch checklist
```

## Workflow Triggers
| Trigger | Condition |
|---------|-----------|
| Push | Main branch |
| Paths | `apps/web/**`, `Dockerfile.web`, `pnpm-lock.yaml` |
| Manual | `gh workflow run deploy-frontend-container-apps.yml` |

## Required Secrets (4 total)
```
AZURE_CREDENTIALS              # JSON service principal
AZURE_REGISTRY_USERNAME        # ACR username
AZURE_REGISTRY_PASSWORD        # ACR password
DATABASE_URL                   # PostgreSQL connection string
```

## GitHub Secrets Generation Quick Commands

```bash
# 1. AZURE_CREDENTIALS
SUBSCRIPTION_ID=$(az account show --query "id" -o tsv)
az ad sp create-for-rbac \
  --name "rankify-github-actions" \
  --role Contributor \
  --scopes /subscriptions/$SUBSCRIPTION_ID/resourceGroups/rankify-rg \
  --json-auth

# 2. AZURE_REGISTRY_USERNAME
az acr credential show --name rankifyacr --query "username" -o tsv

# 3. AZURE_REGISTRY_PASSWORD
az acr credential show --name rankifyacr --query "passwords[0].value" -o tsv

# 4. DATABASE_URL (format)
postgresql://user:password@host.database.azure.com:5432/rankify?sslmode=require
```

## Deployment Pipeline (8-12 minutes)
```
1. Checkout & Setup (30s)          → Node 22 + pnpm
2. Build Next.js (2-3 min)         → SSR (no static export)
3. Build Docker Image (1-2 min)    → Multi-stage build
4. Push to ACR (1-2 min)           → rankifyacr.azurecr.io
5. Update Container App (1-2 min)  → Rolling deployment
6. Health Check (20-60s)           → Poll until 200 response
```

## Key Environment Variables

| Variable | Value | When |
|----------|-------|------|
| `NEXT_PUBLIC_API_URL` | `https://rankify-api.azurewebsites.net` | Build + Runtime |
| `DATABASE_URL` | From secret | Runtime only |
| `NODE_ENV` | `production` | Build + Runtime |
| `PORT` | `3000` | Runtime only |
| `NEXT_TELEMETRY_DISABLED` | `1` | Runtime only |

## Container App Details
| Property | Value |
|----------|-------|
| Name | `rankify-web` |
| Resource Group | `rankify-rg` |
| Registry | `rankifyacr.azurecr.io` |
| Image | `rankify-frontend:latest` |
| Port | 3000 |
| User | `nextjs` (UID 1001) |

## Monitoring Commands

```bash
# Check deployment status
az containerapp show --name rankify-web --resource-group rankify-rg

# View live logs
az containerapp logs show --name rankify-web --resource-group rankify-rg --follow

# List recent revisions
az containerapp revision list --name rankify-web --resource-group rankify-rg

# Rollback to previous version
az containerapp revision activate \
  --revision rankify-web--XXXXX \
  --name rankify-web \
  --resource-group rankify-rg
```

## Docker Image Specs
| Property | Value |
|----------|-------|
| Base | `node:22-alpine` (3 stages) |
| Size | ~400-600 MB |
| User | `nextjs:1001` (non-root) |
| Health Check | HTTP on port 3000 every 30s |
| Startup Probe | 40s timeout, retry up to 3 times |
| Entry Point | `dumb-init` (signal handling) |

## Why Container Apps vs Static Web Apps

| Need | Container Apps | SWA |
|------|---|---|
| SSR/Dynamic rendering | ✅ | ❌ |
| API routes (`/api/**`) | ✅ | ❌ |
| NextAuth.js | ✅ | ❌ |
| Per-request DB queries | ✅ | ❌ |
| WebSockets/streaming | ✅ | ❌ |
| Dynamic meta tags | ✅ | ❌ |

## Cost Comparison (Monthly)
| Resource | Cost |
|----------|------|
| Container Apps (0.5 vCPU, 1 replica) | $25 |
| Container Registry (Standard) | $100 |
| Bandwidth (10GB/month) | $2 |
| **Total** | **$127** |

SWA: $9/month (but limited functionality)

## Troubleshooting Checklist

- [ ] All 4 secrets added to GitHub
- [ ] `AZURE_CREDENTIALS` is valid JSON
- [ ] Service principal has Contributor role on `rankify-rg`
- [ ] ACR `rankifyacr` exists and accessible
- [ ] Container App `rankify-web` exists in `rankify-rg`
- [ ] PostgreSQL accessible and `DATABASE_URL` correct
- [ ] `pnpm build:web` works locally
- [ ] No syntax errors in workflow YAML
- [ ] `Dockerfile.web` in repository root
- [ ] GitHub Actions enabled on repository

## Common Errors & Fixes

| Error | Solution |
|-------|----------|
| `invalid_grant` in AZURE_CREDENTIALS | Regenerate service principal |
| `403 Unauthorized` to ACR | Check AZURE_REGISTRY_USERNAME/PASSWORD |
| `ERROR: no such file or directory: Dockerfile.web` | Commit file to root |
| `Container won't start` | Check `az containerapp logs show` |
| `Health check timeout` | Increase `--startup-period` to 60s |

## First Deployment

```bash
# 1. Add all 4 secrets in GitHub UI
Settings > Secrets and variables > Actions

# 2. Commit workflow and Dockerfile
git add .github/workflows/deploy-frontend-container-apps.yml
git add Dockerfile.web
git add docs/

# 3. Push to main
git push origin main

# 4. Monitor
gh run watch
# or GitHub UI > Actions tab

# 5. Verify
az containerapp show --name rankify-web --resource-group rankify-rg
```

## Rollback Procedure

```bash
# Option 1: Activate previous revision (1 minute)
az containerapp revision list --name rankify-web --resource-group rankify-rg
az containerapp revision activate --revision rankify-web--XXXXX --name rankify-web --resource-group rankify-rg

# Option 2: Revert commit and push (triggers redeployment)
git revert HEAD
git push origin main
# Workflow re-runs automatically
```

## Performance Tips

- **Faster builds:** `pnpm install --frozen-lockfile` (skip resolution)
- **Smaller images:** Multi-stage Dockerfile (dependency/build/runtime)
- **Quick startup:** Cache layers in Docker registry
- **Scaling:** Set `--min-replicas 1 --max-replicas 4` for autoscale

## API Endpoints Available (post-deployment)

```typescript
// Apps/web can now use:
/api/analytics      // Fetch report analytics
/api/auth/**        // NextAuth.js authentication
/api/scan          // Initiate SEO scan
/api/results       // Get scan results
```

---

**Quick Start:** 3 commands
```bash
# 1. Add secrets (UI)
# 2. Commit files
git add .github/workflows/deploy-frontend-container-apps.yml Dockerfile.web docs/
git commit -m "feat: Container Apps deployment"
git push origin main
# 3. Monitor (8-12 minutes)
gh run watch
```

**Status:** ✅ Ready to deploy
**Last Updated:** 2026-04-09
