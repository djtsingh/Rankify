# Container Apps Deployment Checklist

## ✅ Pre-Deployment Checklist

### Azure Resources
- [ ] Azure Container Registry created (`rankifyacr`)
- [ ] Container App created (`rankify-web`)
- [ ] Resource group exists (`rankify-rg`)
- [ ] PostgreSQL database accessible
- [ ] Service principal created for GitHub Actions

### GitHub Repository Setup
- [ ] Repository settings accessible
- [ ] "Environments" section available (for AZ_resources environment)

### Local Environment
- [ ] Docker installed locally
- [ ] Azure CLI installed (`az --version`)
- [ ] pnpm installed (`pnpm --version`)
- [ ] Node.js 22+ installed (`node --version`)

---

## 🔐 GitHub Secrets to Configure

Navigate to: **Settings > Secrets and variables > Actions**

### Secret 1: AZURE_CREDENTIALS
**Name:** `AZURE_CREDENTIALS`

**Generate:**
```bash
# Get subscription ID
SUBSCRIPTION_ID=$(az account show --query "id" -o tsv)

# Create service principal
az ad sp create-for-rbac \
  --name "rankify-github-actions" \
  --role Contributor \
  --scopes /subscriptions/$SUBSCRIPTION_ID/resourceGroups/rankify-rg \
  --json-auth
```

**Value:** Paste the entire JSON output:
```json
{
  "clientId": "...",
  "clientSecret": "...",
  "subscriptionId": "...",
  "tenantId": "...",
  "activeDirectoryEndpointUrl": "...",
  "resourceManagerEndpointUrl": "...",
  "activeDirectoryGraphResourceId": "...",
  "sqlManagementEndpointUrl": "...",
  "galleryEndpointUrl": "...",
  "managementEndpointUrl": "..."
}
```

### Secret 2: AZURE_REGISTRY_USERNAME
**Name:** `AZURE_REGISTRY_USERNAME`

**Generate:**
```bash
az acr credential show --name rankifyacr --query "username" -o tsv
```

**Value:** Copy the username (typically: `rankifyacr` or a GUID)

### Secret 3: AZURE_REGISTRY_PASSWORD
**Name:** `AZURE_REGISTRY_PASSWORD`

**Generate:**
```bash
az acr credential show --name rankifyacr --query "passwords[0].value" -o tsv
```

**Value:** Copy the first password

### Secret 4: DATABASE_URL
**Name:** `DATABASE_URL`

**Format:** PostgreSQL connection string
```
postgresql://user:password@host.database.azure.com:5432/rankify?sslmode=require
```

**Components:**
- `user`: PostgreSQL user (e.g., `rankify@servername`)
- `password`: PostgreSQL password (URL-encoded)
- `host`: Azure Database for PostgreSQL server FQDN
- `port`: 5432 (default)
- `database`: `rankify`
- `sslmode=require`: Required for Azure

---

## 📋 Environment Variables Summary

### Build-Time (Workflow)
```yaml
NEXT_PUBLIC_API_URL: https://rankify-api.azurewebsites.net  # Backend URL
NODE_ENV: production
```

### Runtime (Container App)
Set via workflow `az containerapp update` step:
```yaml
NEXT_PUBLIC_API_URL: https://rankify-api.azurewebsites.net
DATABASE_URL: ${{ secrets.DATABASE_URL }}
NODE_ENV: production
```

### Container Defaults (Dockerfile)
```dockerfile
PORT=3000
NEXT_TELEMETRY_DISABLED=1
```

---

## 🚀 Deployment Trigger

### Automatic Triggers
Workflow runs when:
- ✅ Push to `main` branch
- ✅ `apps/web/**` files changed
- ✅ `Dockerfile.web` changed
- ✅ `.github/workflows/deploy-frontend-container-apps.yml` changed

### Manual Trigger
```bash
# Using GitHub CLI
gh workflow run deploy-frontend-container-apps.yml

# Or via GitHub UI: Actions tab > "Deploy Frontend to Azure Container Apps" > "Run workflow"
```

---

## 📊 Workflow Execution Timeline

```
Checkout (30s)
  ↓
Setup Node.js (30s)
  ↓
Install Dependencies (1-2m)
  ↓
Update Next.js Config (10s)
  ↓
Build Next.js (2-3m)
  ↓
Verify Build (10s)
  ↓
Azure Login (15s)
  ↓
Build Docker Image (1-2m)
  ↓
Push to ACR (1-2m)
  ↓
Update Container App (30-60s)
  ↓
Health Check (20-60s)
  ↓
Summary (10s)

Total: 8-12 minutes
```

---

## 🔍 Monitoring After Deployment

### GitHub Actions
1. Go to **Actions** tab
2. Click **"Deploy Frontend to Azure Container Apps"**
3. Click latest workflow run
4. View step-by-step logs

### Azure Portal
```bash
# Check deployment status
az containerapp show \
  --name rankify-web \
  --resource-group rankify-rg

# View live logs
az containerapp logs show \
  --name rankify-web \
  --resource-group rankify-rg \
  --follow

# Check revisions
az containerapp revision list \
  --name rankify-web \
  --resource-group rankify-rg
```

---

## 🆘 Common Issues & Fixes

| Issue | Solution |
|-------|----------|
| **AZURE_CREDENTIALS invalid** | Regenerate service principal, check JSON format |
| **ACR login fails** | Verify username/password are correct, not Base64-encoded |
| **Docker build fails** | Check Dockerfile.web exists, Node.js version compatibility |
| **Container won't start** | Check logs with `az containerapp logs show`, verify DATABASE_URL |
| **Health check timeout** | Increase `--startup-period`, verify port 3000 is open |
| **Image push fails** | Run `az acr login`, check storage quota in ACR |

---

## ✨ Verification Steps

### Step 1: Verify Secrets Exist
```bash
# From repository (via GitHub CLI)
gh secret list
```

Expected output:
```
AZURE_CREDENTIALS         ★ (not shown)
AZURE_REGISTRY_PASSWORD   ★ (not shown)
AZURE_REGISTRY_USERNAME   ★ (not shown)
DATABASE_URL              ★ (not shown)
```

### Step 2: Verify Workflow File
```bash
# Check workflow syntax
gh workflow view deploy-frontend-container-apps.yml
```

### Step 3: Verify Azure Resources
```bash
# Check ACR exists
az acr show --name rankifyacr

# Check Container App exists
az containerapp show \
  --name rankify-web \
  --resource-group rankify-rg

# Check PostgreSQL connectivity
psql -h <host> -U <user> -d rankify -c "SELECT 1"
```

### Step 4: Run First Deployment
```bash
# Trigger workflow
git push origin main

# Or manually
gh workflow run deploy-frontend-container-apps.yml

# Watch progress
gh run watch $(gh run list --workflow deploy-frontend-container-apps.yml --json databaseId -q '.[0].databaseId')
```

---

## 📝 Workflow Files Reference

### New Files Added
```
├── .github/workflows/
│   └── deploy-frontend-container-apps.yml  (224 lines)
├── Dockerfile.web                           (73 lines)
└── docs/
    ├── DEPLOYMENT-CONTAINER-APPS.md
    └── SETUP-CONTAINER-APPS.md
```

### Existing Files (Keep)
```
.github/workflows/
  ├── azure-static-web-apps.yml      (fallback)
  ├── deploy-python-worker.yml
  └── main_rankify-v1-src.yml
```

---

## 🔄 Comparison: Old vs New

| Aspect | Old (SWA) | New (Container Apps) |
|--------|-----------|----------------------|
| **Build** | Static export | SSR Docker image |
| **Deployment** | `azure/static-web-apps-deploy@v1` | `az containerapp update` |
| **Runtime** | CDN edge | Node.js process |
| **API Routes** | ❌ Not supported | ✅ Supported |
| **NextAuth.js** | ❌ No sessions | ✅ Full support |
| **Database Queries** | ❌ Build-only | ✅ Per-request |
| **Cost** | $9/month | $135-175/month |
| **TTFB** | ~50ms | ~200-500ms |

---

## ✅ Final Pre-Launch Checklist

- [ ] All 4 GitHub Secrets configured
- [ ] `AZURE_CREDENTIALS` is valid JSON
- [ ] `DATABASE_URL` is correct and accessible
- [ ] `Dockerfile.web` committed to repository
- [ ] `.github/workflows/deploy-frontend-container-apps.yml` committed
- [ ] Azure Container App `rankify-web` exists
- [ ] Azure Container Registry `rankifyacr` exists
- [ ] PostgreSQL database accessible from Container App
- [ ] Next.js `pnpm build:web` command works locally
- [ ] No merge conflicts in `apps/web/` directory
- [ ] GitHub Actions enabled on repository

---

## 🎯 Launch Command

```bash
# Push to main - this triggers the workflow
git push origin main

# Monitor in real-time
gh run watch
```

**Expected Result:** Container App URL responding with Next.js frontend in 8-12 minutes ✅

---

**Created:** 2026-04-09
**Status:** Ready for deployment
