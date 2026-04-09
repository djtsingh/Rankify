# Rankify Frontend Deployment: Container Apps vs Static Web Apps

## Overview
This document explains the new Container Apps workflow and why it's better for Rankify's Next.js frontend than the current Static Web Apps (SWA) approach.

## Deployment Comparison

### Current: Azure Static Web Apps (SWA)
**Workflow File:** `.github/workflows/azure-static-web-apps.yml`

**Process:**
1. Builds Next.js with `output: 'export'` (static HTML)
2. Copies static files to `apps/web/out`
3. Uses `Azure/static-web-apps-deploy@v1` action
4. Deploys pre-built static HTML to SWA

**Limitations:**
- ❌ **No server-side rendering** - all rendering happens at build time
- ❌ **No API routes** - Can't use Next.js API routes (`/api/**`)
- ❌ **Limited dynamic content** - Can't generate pages on-demand
- ❌ **Auth challenges** - NextAuth.js requires server-side sessions
- ❌ **Limited caching strategies** - Only static cache headers
- ❌ **No real-time data** - Can't fetch fresh data per request
- ⚠️ **Build-time size limits** - Large static exports can hit size limits

### New: Azure Container Apps (SSR)
**Workflow File:** `.github/workflows/deploy-frontend-container-apps.yml`

**Process:**
1. Builds Next.js in SSR mode (no `output: 'export'`)
2. Builds Docker image containing `.next` production build
3. Pushes image to Azure Container Registry (ACR)
4. Updates Container App with new image via Azure CLI
5. Manages environment variables at runtime

**Advantages:**
- ✅ **Server-side rendering (SSR)** - Dynamic page generation per request
- ✅ **API routes supported** - Full Next.js API routes available
- ✅ **Dynamic content** - `getServerSideProps`, `getStaticProps`, ISR
- ✅ **NextAuth.js compatible** - Sessions stored server-side
- ✅ **Real-time capabilities** - WebSockets, streaming, real-time updates
- ✅ **Advanced caching** - Request-level and response-level caching
- ✅ **Better SEO** - Server-rendered meta tags and content
- ✅ **Horizontal scaling** - Multiple replicas for load distribution
- ✅ **Environment separation** - Prod/staging environments easily managed
- ✅ **Rollback capability** - Instant rollback to previous image

## Deployment Workflow Steps

### Step 1: Build Next.js (SSR)
```yaml
- name: Build Frontend (SSR)
  run: pnpm build:web
  env:
    NEXT_PUBLIC_API_URL: ${{ env.NEXT_PUBLIC_API_URL }}
    DATABASE_URL: ${{ secrets.DATABASE_URL }}
    NODE_ENV: production
```
- Removes `output: 'export'` from config
- Generates optimized `.next` production build
- Keeps server functions intact

### Step 2: Build Docker Image
```yaml
- name: Build and push Docker image
  run: |
    docker build -f Dockerfile.web \
      -t rankifyacr.azurecr.io/rankify-frontend:latest \
      -t rankifyacr.azurecr.io/rankify-frontend:${COMMIT_SHA:0:7} \
      --build-arg NEXT_PUBLIC_API_URL="${{ env.NEXT_PUBLIC_API_URL }}" \
      .
    docker push rankifyacr.azurecr.io/rankify-frontend:latest
```
- Multi-stage build for optimized image size
- Tags with both `latest` and commit SHA
- Arguments passed for environment config during build

### Step 3: Push to Azure Container Registry
```yaml
- name: Login to Azure Container Registry
  run: |
    az acr login --name rankifyacr
```
- Authenticates using Azure credentials
- Pushes image to `rankifyacr.azurecr.io`

### Step 4: Update Container App
```yaml
- name: Update Container Apps deployment
  run: |
    az containerapp update \
      --name rankify-web \
      --resource-group rankify-rg \
      --image rankifyacr.azurecr.io/rankify-frontend:latest \
      --set-env-vars NEXT_PUBLIC_API_URL="..." NODE_ENV="production"
```
- Updates existing Container App with new image
- Sets runtime environment variables
- Zero-downtime deployment (traffic gradually shifted)

### Step 5: Verify Deployment
```yaml
- name: Verify Container Apps deployment
  run: |
    az containerapp show --name rankify-web ...
    # Polls FQDN until app responds with 200
```
- Checks provisioning state
- Polls health endpoint
- Validates deployment succeeded

## Key Differences: Workflow Comparison

| Aspect | Static Web Apps | Container Apps |
|--------|-----------------|----------------|
| **Build Mode** | Static export (`output: 'export'`) | SSR (no export) |
| **Image Format** | HTML/CSS/JS files | Docker container |
| **Registry** | SWA deployment token | Azure Container Registry (ACR) |
| **Deployment Mechanism** | `azure/static-web-apps-deploy` action | `az containerapp update` CLI |
| **Runtime** | Static file server | Node.js process (Next.js server) |
| **Port** | N/A (CDN) | 3000 (configurable) |
| **Scaling** | Automatic (CDN-based) | Manual replicas or autoscaling rules |
| **Environment Vars** | Build-time only | Build-time + Runtime |
| **Secrets** | Limited options | Full Azure Key Vault integration |
| **Health Checks** | None (static files) | Configurable HTTP probes |
| **Rollback** | Repository-based | Instant image rollback |

## Why Container Apps > Static Web Apps for Rankify

### 1. **API Routes Integration**
SWA cannot use Next.js API routes. Container Apps enables:
```typescript
// apps/web/src/app/api/analytics/route.ts
export async function GET(req: Request) {
  const data = await fetchAnalytics();
  return Response.json(data);
}
```

### 2. **NextAuth.js Support**
SWA doesn't support server-side sessions. Container Apps enables:
```typescript
// apps/web/src/app/api/auth/[...nextauth]/route.ts
export const { handlers, auth } = NextAuth({ ... })
```

### 3. **Database Integration**
Can query PostgreSQL on every request:
```typescript
// apps/web/src/app/dashboard/page.tsx
export default async function DashboardPage() {
  const user = await db.user.findUnique({ ... });
  return <Dashboard user={user} />;
}
```

### 4. **Real-Time Updates**
WebSocket support for live analytics, notifications:
```typescript
// apps/web/src/app/api/realtime/route.ts
export async function GET(req: Request) {
  const readable = new ReadableStream({ ... });
  return new Response(readable);
}
```

### 5. **SEO Optimization**
Server-rendered meta tags for dynamic content:
```typescript
export async function generateMetadata({
  params: { id }
}: Props): Promise<Metadata> {
  const report = await db.report.findUnique({ where: { id } });
  return {
    title: report.name,
    description: report.summary,
  };
}
```

## Secrets Required

### GitHub Repository Secrets
```
AZURE_CREDENTIALS        # Azure service principal (JSON)
AZURE_REGISTRY_USERNAME  # ACR username
AZURE_REGISTRY_PASSWORD  # ACR password
DATABASE_URL             # PostgreSQL connection string
```

### Container App Environment Variables (set in workflow)
```
NEXT_PUBLIC_API_URL      # Backend API URL
NODE_ENV                 # "production"
DATABASE_URL             # Runtime database URL
```

## Troubleshooting

### Image Push Fails
```bash
# Check ACR login
az acr login --name rankifyacr
az acr repository list --name rankifyacr
```

### Container App Won't Start
```bash
# Check logs
az containerapp logs show --name rankify-web --resource-group rankify-rg
```

### Slow Startup
- Increase health check startup period: `--startup-period=60s`
- Optimize node_modules size in Dockerfile

## Migration Path

1. **Create ACR credentials** in GitHub Secrets
2. **Commit** `Dockerfile.web` and new workflow
3. **Test on non-main branch** first (optional)
4. **Merge to main** - workflow triggers automatically
5. **Monitor** Container App deployment
6. **Switch DNS** once validated
7. **Keep SWA** workflow for fallback (optional)

## Performance Characteristics

| Metric | SWA | Container Apps |
|--------|-----|-----------------|
| **TTFB** | ~50ms (CDN edge) | ~200-500ms (dynamic) |
| **Cold Start** | None (static) | ~2-5s (first request) |
| **Compute** | Minimal | ~0.5 vCPU baseline |
| **Cost** | $9/month | ~$50-100/month (1 replica) |
| **Concurrent Requests** | Unlimited (CDN) | Limited by resources |

## Conclusion

**Use Container Apps if:**
- ✅ Need API routes
- ✅ Using NextAuth.js
- ✅ Querying database per request
- ✅ Need dynamic SEO
- ✅ Want server-side rendering
- ✅ Need real-time updates

**Keep SWA if:**
- ✅ Pure static site (blog, docs)
- ✅ Zero server-side requirements
- ✅ Want lowest cost
- ✅ Need global CDN distribution

**For Rankify:** Container Apps is essential because the SEO audit SaaS requires:
- Dynamic user dashboards
- Database-driven analytics
- Real-time report generation
- Authentication/authorization
- API integration with backend services
