# Rankify - Complete Project Analysis & Documentation

> **Generated**: January 7, 2026  
> **Status**: Production with Active Development  
> **Live URL**: https://www.rankify.page (via Azure Static Web Apps)

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Architecture Overview](#2-architecture-overview)
3. [Component Deep Dive](#3-component-deep-dive)
   - [Frontend (Next.js)](#31-frontend-nextjs)
   - [API Layer (Azure Functions)](#32-api-layer-azure-functions)
   - [Backend Services (Go/Python)](#33-backend-services-gopython)
   - [Database Layer](#34-database-layer)
4. [Azure Infrastructure](#4-azure-infrastructure)
5. [GitHub Workflows (CI/CD)](#5-github-workflows-cicd)
6. [Data Flow & Component Connections](#6-data-flow--component-connections)
7. [Testing & Local Development](#7-testing--local-development)
8. [Deployment Guide](#8-deployment-guide)
9. [Issues & Inconsistencies](#9-issues--inconsistencies)
10. [Recommendations](#10-recommendations)

---

## 1. Executive Summary

### What is Rankify?

**Rankify** is a modern SEO (Search Engine Optimization) analysis platform that allows users to audit their websites for SEO issues, get actionable recommendations, and track improvements over time.

**Tagline**: *"SEO Made Simple, Results Made Clear"*

### Core Features

- 🎯 Website SEO auditing with comprehensive scoring
- 📊 Detailed metrics analysis (meta tags, headings, content, links, etc.)
- 🚨 Issue detection with severity classification
- 💡 Actionable recommendations for improvement
- 📈 Progress tracking over time

### Tech Stack Summary

| Layer | Technology | Hosting |
|-------|------------|---------|
| Frontend | Next.js 15 + React 19 + TailwindCSS 4 | Azure Static Web Apps |
| API Gateway | Azure Functions v4 (Node.js 22 + TypeScript) | Azure Functions App |
| Backend Services | Go (Gin) + Python | Local/Self-hosted |
| Message Queue | NATS | Local |
| Database | PostgreSQL 17 | Azure Flexible Server |
| Package Manager | pnpm (workspaces) | - |

---

## 2. Architecture Overview

### High-Level Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              USER BROWSER                                       │
└─────────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                         AZURE STATIC WEB APPS                                   │
│                    https://www.rankify.page                                     │
│                    (jolly-bush-045b06200.3.azurestaticapps.net)                 │
│  ┌─────────────────────────────────────────────────────────────────────────┐   │
│  │                    NEXT.JS FRONTEND (Static Export)                      │   │
│  │  - Landing page, Website Audit page, etc.                               │   │
│  │  - Client-side rendering with React 19                                  │   │
│  │  - TailwindCSS 4 for styling                                            │   │
│  └─────────────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      │ API Calls
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                         AZURE FUNCTIONS v4                                      │
│                    https://rankify-v1-src.azurewebsites.net                     │
│  ┌───────────────────┬───────────────────┬───────────────────┐                 │
│  │  /api/health      │  /api/test        │  /api/v1/scans    │                 │
│  │  Health Check     │  API Test         │  Scan Proxy       │                 │
│  └───────────────────┴───────────────────┴─────────┬─────────┘                 │
│                                                     │                           │
│  Uses: Prisma ORM ─────────────────────────────────┼────────────────────────►  │
└─────────────────────────────────────────────────────┼───────────────────────────┘
                                                      │
                          ┌───────────────────────────┼───────────────────────────┐
                          │                           │                           │
                          ▼                           ▼                           │
┌─────────────────────────────────────┐  ┌─────────────────────────────────────┐ │
│     GO API GATEWAY (Port 8080)      │  │    AZURE POSTGRESQL                 │ │
│     (Local Development Only)        │  │    Flexible Server v17              │ │
│  ┌───────────────────────────────┐  │  │    rankify-v1-data                  │ │
│  │  POST /api/v1/scans           │  │  │                                     │ │
│  │  GET  /api/v1/scans/:id       │  │  │  ┌─────────────────────────────┐   │ │
│  │  GET  /api/v1/health          │  │  │  │ Tables:                     │   │ │
│  └───────────────────────────────┘  │  │  │ - users                     │   │ │
│             │                        │  │  │ - scans                     │   │ │
│             ▼                        │  │  │ - scan_results             │   │ │
│  ┌───────────────────────────────┐  │  │  │ - issues                    │   │ │
│  │         NATS QUEUE            │  │  │  │ - scan_history              │   │ │
│  │      (nats://localhost:4222)  │  │  │  │ - projects (Prisma)         │   │ │
│  │      Subject: scan.jobs       │  │  │  │ - audits (Prisma)           │   │ │
│  └───────────────────────────────┘  │  │  │ - keywords (Prisma)         │   │ │
│             │                        │  │  └─────────────────────────────┘   │ │
│             ▼                        │  │                                     │ │
│  ┌───────────────────────────────┐  │  └─────────────────────────────────────┘ │
│  │    PYTHON WORKER              │  │                                           │
│  │    (scanner-worker.py)        │  │                                           │
│  │  ┌─────────────────────────┐  │  │                                           │
│  │  │  1. WebScraper          │  │  │                                           │
│  │  │  2. HTMLParser          │  │  │                                           │
│  │  │  3. IssueDetector       │  │  │                                           │
│  │  │  4. Scorer              │  │  │                                           │
│  │  └─────────────────────────┘  │  │                                           │
│  └───────────────────────────────┘  │                                           │
└─────────────────────────────────────┘                                           │
                                                                                  │
◄─────────────────────────────────────────────────────────────────────────────────┘
```

### Architecture Type

This is a **hybrid serverless + microservices architecture**:

1. **Serverless Tier** (Cloud - Production Ready):
   - Azure Static Web Apps for frontend
   - Azure Functions for API gateway/proxy
   - Azure PostgreSQL for persistent storage

2. **Microservices Tier** (Local - Development/Future):
   - Go API Gateway for scan orchestration
   - Python workers for actual SEO analysis
   - NATS message queue for async job processing

---

## 3. Component Deep Dive

### 3.1 Frontend (Next.js)

**Location**: `apps/web/`

#### Configuration

```typescript
// next.config.ts
const nextConfig: NextConfig = {
  // output: 'export',  // Currently disabled for development
  images: { unoptimized: true },
  trailingSlash: true,
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || '/api',
  },
};
```

#### Key Files Structure

```
apps/web/src/
├── app/                    # Next.js App Router pages
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Landing page
│   ├── website-audit/      # Main SEO audit feature
│   ├── pricing/            # Pricing page
│   ├── about/              # About page
│   └── ...                 # Other pages
├── components/
│   ├── layout/             # Navigation, Footer
│   ├── audit/              # Audit-specific components
│   ├── sections/           # Landing page sections
│   └── ui/                 # Reusable UI components
├── lib/
│   ├── api/
│   │   ├── client.ts       # API request wrapper
│   │   ├── audit.ts        # Audit API methods
│   │   ├── mock-data.ts    # Mock data for testing
│   │   └── comprehensive-mock.ts
│   ├── hooks/
│   │   └── useAudit.ts     # Audit state management hook
│   └── utils/              # Utility functions
└── styles/                 # Global styles
```

#### Environment Variables

| Variable | Development | Production |
|----------|-------------|------------|
| `NEXT_PUBLIC_API_URL` | `https://rankify-v1-src-dtdvaab6ehcsa5gs.centralindia-01.azurewebsites.net` | Same |
| `NEXT_PUBLIC_USE_MOCK` | `false` | `false` |

#### Frontend-API Communication

The frontend uses a custom API client (`client.ts`) with:
- Automatic retries (3 attempts with exponential backoff)
- Timeout handling (30s default)
- Error classification (APIError class)
- CORS handling

```typescript
// Example: Starting a scan
const result = await post<CreateScanResponse>('/api/v1/scans', { url });
```

---

### 3.2 API Layer (Azure Functions)

**Location**: `api/`

#### Functions Defined

| Function | Route | Method | Purpose |
|----------|-------|--------|---------|
| `health` | `/api/health` | GET | Health check + DB status |
| `test` | `/api/test` | GET | Simple API test |
| `createScan` | `/api/v1/scans` | POST, OPTIONS | Create new scan (proxies to Go) |
| `getScan` | `/api/v1/scans/{id}` | GET, OPTIONS | Get scan results (proxies to Go) |

#### Entry Point Architecture (v4 Model)

```typescript
// src/index.ts - CRITICAL for Azure Functions v4
import './functions/health';
import './functions/test';
import './functions/scans';
```

**Important**: Azure Functions v4 requires explicit imports to register functions. Without this, functions return 404.

#### Prisma Schema

```prisma
// Defined models for Azure Functions layer
model User     { id, email, name, password, projects[], audits[] }
model Project  { id, userId, name, domain, url, audits[], keywords[] }
model Audit    { id, userId, projectId, url, scores, issues (JSON) }
model Keyword  { id, projectId, keyword, tracking data }
```

#### Function App Settings (Azure)

```bash
# Verified via Azure CLI
FUNCTIONS_WORKER_RUNTIME=node
FUNCTIONS_EXTENSION_VERSION=~4
NODE_ENV=production
DATABASE_URL=postgresql://djtpgadmin:***@rankify-v1-data.postgres.database.azure.com:5432/postgres
SCM_DO_BUILD_DURING_DEPLOYMENT=true
ENABLE_ORYX_BUILD=true
WEBSITE_NODE_DEFAULT_VERSION=~22
```

---

### 3.3 Backend Services (Go/Python)

#### Go API Gateway

**Location**: `backend/SEO-checker/go-services/api-gateway/`

**Purpose**: Handles scan orchestration, job queuing, and result retrieval.

**Stack**: Go + Gin Framework + pgx (PostgreSQL) + NATS

```go
// Routes defined
api := r.Group("/api/v1")
api.GET("/health", handlers.HealthCheck)
api.POST("/scans", handlers.CreateScan)    // Creates job, publishes to NATS
api.GET("/scans/:id", handlers.GetScan)    // Returns scan + results + issues
```

**Environment Variables** (local):
```dotenv
DB_HOST=localhost
DB_PORT=5432
DB_NAME=rankify
DB_USER=djt_rankify_1
DB_PASSWORD=djtrankify1
PORT=8080
NATS_URL=nats://localhost:4222
```

#### Python Worker

**Location**: `backend/SEO-checker/py-services/`

**Purpose**: Actual SEO analysis - scrapes pages, parses HTML, detects issues, calculates scores.

**Components**:

| Module | Function |
|--------|----------|
| `scraper/web_scraper.py` | Async web page fetching |
| `parser/html_parser.py` | HTML parsing, metric extraction |
| `analyzer/issue_detector.py` | SEO issue identification |
| `analyzer/scorer.py` | Score calculation |
| `worker/scanner-worker.py` | NATS consumer, orchestrates analysis |
| `database/save_results.py` | Stores results in PostgreSQL |

**Analysis Pipeline**:
```
1. Receive job from NATS (scan_id, url)
2. Update status: 'pending' → 'processing'
3. Scrape website (WebScraper)
4. Parse HTML (HTMLParser) → Extract metrics
5. Detect issues (IssueDetector)
6. Calculate score (Scorer)
7. Save to database (scan_results, issues tables)
8. Update status: 'processing' → 'completed'
```

---

### 3.4 Database Layer

#### Two Database Schemas Coexist

**1. Backend Schema** (`backend/SEO-checker/database/schema.sql`):
Used by Go API Gateway and Python Workers

```sql
-- Tables
users (id, email, password_hash, name, subscription_tier)
scans (id, user_id, url, url_hash, status, error_message, created_at, completed_at)
scan_results (id, scan_id, score, metrics JSONB)
issues (id, scan_id, type, severity, title, description, recommendation, impact_score, ...)
scan_history (id, user_id, url, score, previous_score, score_delta)
```

**2. Prisma Schema** (`api/prisma/schema.prisma`):
Used by Azure Functions

```prisma
-- Models
User, Project, Audit, Keyword
```

#### ⚠️ INCONSISTENCY ALERT

The two schemas define overlapping but different structures:
- Backend uses `scans`, `scan_results`, `issues`
- Prisma uses `audits` with JSON fields for issues
- Field naming differs (`password_hash` vs `password`)

---

## 4. Azure Infrastructure

### Resources (Verified via CLI)

| Resource | Type | Location | SKU/Plan |
|----------|------|----------|----------|
| `rankify` | Resource Group | Central India | - |
| `rankify-v1` | Static Web App | Global | Free |
| `rankify-v1-src` | Function App | Central India | Linux Consumption |
| `rankify-v1-data` | PostgreSQL Flexible | Central India | Standard_B1ms |
| `djtblobfree` | Storage Account | Central India | - |

### Static Web App Details

- **Hostname**: `jolly-bush-045b06200.3.azurestaticapps.net`
- **Custom Domain**: `www.rankify.page`
- **SKU**: Free tier
- **Deployment Source**: GitHub (main branch)

### Function App Details

- **Hostname**: `rankify-v1-src.azurewebsites.net`
- **Alternative**: `rankify-v1-src-dtdvaab6ehcsa5gs.centralindia-01.azurewebsites.net`
- **OS**: Linux
- **Runtime**: Node.js 22
- **Functions Version**: v4
- **State**: Running ✅
- **HTTPS Only**: ❌ (Should be enabled)

### PostgreSQL Details

- **Hostname**: `rankify-v1-data.postgres.database.azure.com`
- **Version**: 17
- **SKU**: Standard_B1ms (Burstable)
- **State**: Ready ✅
- **SSL Mode**: Required

---

## 5. GitHub Workflows (CI/CD)

### Workflow 1: Static Web Apps (`azure-static-web-apps.yml`)

**Trigger**: Push/PR to `main` on `web/**` paths

**Process**:
```yaml
1. Checkout code
2. Setup Node.js 22
3. Install pnpm
4. Install root + API dependencies
5. Build API (for Prisma types)
6. Prune dev dependencies
7. Build Frontend (pnpm build:web)
8. Copy staticwebapp.config.json
9. Deploy to Azure Static Web Apps
```

**Notes**:
- Uses Azure Static Web Apps Deploy action
- `api_location: ""` - No managed API (standalone Functions used instead)
- `skip_app_build: true` - Pre-built app uploaded

### Workflow 2: Functions App (`main_rankify-v1-src.yml`)

**Trigger**: Push to `main` on `api/**` paths, or manual dispatch

**Process**:
```yaml
Build Job:
1. Checkout code
2. Setup Node.js 22
3. Clean local build artifacts
4. Upload source as artifact

Deploy Job:
1. Download artifact
2. Deploy using Azure Functions Action
3. Remote build enabled (Oryx)
```

**Key Settings**:
```yaml
scm-do-build-during-deployment: true  # Azure builds remotely
enable-oryx-build: true               # Use Oryx builder
```

**Important**: Source files (TypeScript) are uploaded, Azure builds them remotely. This is required because:
- Prisma binaries are platform-specific
- Linux binaries needed for Azure Linux Function App

---

## 6. Data Flow & Component Connections

### Flow 1: Production (Current)

```
User submits URL → Frontend
        │
        ▼
Frontend calls Azure Functions (/api/v1/scans)
        │
        ▼ (Currently returns error - Go not deployed)
Azure Functions proxies to GO_API_URL (http://localhost:8080)
        │
        ▼
Error: Connection refused (Go not running in cloud)
```

### Flow 2: Local Development (Full Pipeline)

```
User submits URL → Frontend (localhost:3000)
        │
        ├─────────► Option A: Direct to Go API
        │           │
        │           ▼
        │     Go API Gateway (localhost:8080)
        │           │
        │           ├──► Creates scan record (PostgreSQL)
        │           │
        │           ├──► Publishes job to NATS
        │           │
        │           └──► Returns scan_id
        │
        └─────────► Option B: Through Azure Functions
                    │
                    ▼
              Azure Functions (localhost:7071)
                    │
                    ▼ (Proxies to Go)
              Go API Gateway (localhost:8080)
                    │
                    (Same as above)

Meanwhile:

Python Worker (listening to NATS)
        │
        ▼
Receives job → Scrapes → Parses → Analyzes → Scores
        │
        ▼
Saves results to PostgreSQL (scan_results, issues)
        │
        ▼
Updates scan status to 'completed'

Then:

User polls /api/v1/scans/{id}
        │
        ▼
Returns complete results with score, metrics, issues
```

### Connection Points

| From | To | Protocol | Port |
|------|-----|----------|------|
| Browser | Static Web App | HTTPS | 443 |
| Browser | Azure Functions | HTTPS | 443 |
| Azure Functions | Go API | HTTP | 8080 |
| Go API | PostgreSQL | PostgreSQL | 5432 |
| Go API | NATS | NATS | 4222 |
| Python Worker | NATS | NATS | 4222 |
| Python Worker | PostgreSQL | PostgreSQL | 5432 |

---

## 7. Testing & Local Development

### Prerequisites

```bash
# Required software
- Node.js 22+
- pnpm (npm install -g pnpm)
- Go 1.21+
- Python 3.10+
- PostgreSQL 17
- NATS Server
- Azure Functions Core Tools v4
```

### Quick Start Commands

```bash
# 1. Install dependencies
pnpm install

# 2. Start frontend only
pnpm dev:web
# → http://localhost:3000

# 3. Start API only (Azure Functions)
cd api
npm run build
func start
# → http://localhost:7071

# 4. Start both
pnpm dev

# 5. Start Go API Gateway
cd backend/SEO-checker/go-services/api-gateway
go run main.go
# → http://localhost:8080

# 6. Start Python Worker
cd backend/SEO-checker/py-services
python worker/scanner-worker.py

# 7. Start NATS
nats-server
# → nats://localhost:4222
```

### Local Testing Scripts

```powershell
# In local-testing folder
.\start-api.bat       # Start Azure Functions API
.\start-fullstack.bat # Start frontend + API
.\test-endpoints.ps1  # Run endpoint tests
.\test-database.ps1   # Test DB connection
```

### Testing Endpoints

```bash
# Health check (Azure Functions)
curl https://rankify-v1-src.azurewebsites.net/api/health

# Expected response:
{
  "status": "healthy",
  "timestamp": "2026-01-07T14:09:06.568Z",
  "version": "1.0.0",
  "environment": "development",  # ⚠️ Should be "production"
  "services": {
    "database": {
      "status": "connected",
      "error": null
    }
  }
}

# Test endpoint
curl https://rankify-v1-src.azurewebsites.net/api/test

# Create scan (will fail in production - Go not deployed)
curl -X POST https://rankify-v1-src.azurewebsites.net/api/v1/scans \
  -H "Content-Type: application/json" \
  -d '{"url": "https://example.com"}'
```

---

## 8. Deployment Guide

### Frontend Deployment

**Automatic**: Push to `main` branch triggers GitHub Action

**Manual**:
```bash
cd apps/web
pnpm build
# Output in apps/web/out/
# Upload to Azure Static Web Apps
```

### Azure Functions Deployment

**Automatic**: Push to `main` branch (changes in `api/`) triggers GitHub Action

**Manual**:
```bash
cd api
npm run build
func azure functionapp publish rankify-v1-src
```

### Go/Python Services (Not Deployed)

Currently local only. Options for deployment:
1. Azure Container Apps
2. Azure Kubernetes Service (AKS)
3. Azure VM
4. Self-hosted server

---

## 9. Issues & Inconsistencies

### 🔴 Critical Issues

#### 1. Scan Functionality Non-Operational in Production

**Problem**: `/api/v1/scans` endpoints proxy to `GO_API_URL` which defaults to `http://localhost:8080`. In production (Azure Functions), there's no Go service running.

**Impact**: Core feature (website scanning) doesn't work in production.

**Solution**: Either:
- Deploy Go API Gateway to Azure (Container Apps, VM, etc.)
- Implement scanning directly in Azure Functions
- Use serverless alternative (Azure Durable Functions for queuing)

#### 2. Two Conflicting Database Schemas

**Problem**: 
- `api/prisma/schema.prisma` defines: User, Project, Audit, Keyword
- `backend/SEO-checker/database/schema.sql` defines: users, scans, scan_results, issues

**Impact**: Inconsistent data models, potential migration issues

**Solution**: Consolidate schemas, decide which system is source of truth

#### 3. Go Build Error - Duplicate main()

**Problem**: Both `main.go` and `test_db.go` declare `func main()` in same package

**File**: `backend/SEO-checker/go-services/api-gateway/test_db.go`

**Solution**: Move test_db.go to a separate package or use build tags:
```go
//go:build ignore
package main
```

### 🟡 Medium Issues

#### 4. Environment Inconsistency

**Problem**: Azure Functions reports `environment: "development"` in production

**Location**: `api/src/functions/health.ts` line 36

**Solution**: Check `AZURE_FUNCTIONS_ENVIRONMENT` is set correctly, or use `NODE_ENV`

#### 5. HTTPS Not Enforced

**Problem**: Function App has `httpsOnly: false`

**Solution**: 
```bash
az functionapp update --name rankify-v1-src --resource-group rankify --https-only true
```

#### 6. Static Export Disabled

**Problem**: `next.config.ts` has `output: 'export'` commented out

**Impact**: May affect static deployment to Azure Static Web Apps

**Location**: `apps/web/next.config.ts`

#### 7. Different Database Connections

**Problem**: 
- Azure Functions connects to: `rankify-v1-data.postgres.database.azure.com/postgres`
- Go/Python connects to: `localhost:5432/rankify`

**Impact**: Local and cloud databases are different

### 🟢 Minor Issues

#### 8. Missing Production Values

- `NEXT_PUBLIC_API_URL` in `.env.local` points to full Azure URL (should just be `/api` for production)
- Inconsistent `/api` suffix handling

#### 9. Duplicate Code

- CORS handling implemented in both Azure Functions and Go API
- Consider centralizing

#### 10. Missing Error Boundaries

- Frontend lacks proper error boundaries for API failures
- Consider adding fallback UI components

---

## 10. Recommendations

### Immediate Actions

1. **Fix Go Build Error**: Add build tag to `test_db.go`
   ```go
   //go:build ignore
   ```

2. **Enable HTTPS Only**:
   ```bash
   az functionapp update --name rankify-v1-src --resource-group rankify --https-only true
   ```

3. **Set NODE_ENV Correctly**:
   ```bash
   az functionapp config appsettings set --name rankify-v1-src --resource-group rankify --settings NODE_ENV=production
   ```

### Short-term (1-2 weeks)

1. **Deploy Backend Services**: Choose deployment strategy for Go/Python
   - Option A: Azure Container Apps (serverless containers)
   - Option B: Azure VM (simple, more control)
   - Option C: Rewrite scanning in Azure Functions + Durable Functions

2. **Consolidate Database Schemas**: Decide on single schema
   - Recommend: Use backend schema (more complete), update Prisma to match

3. **Re-enable Static Export**: Uncomment `output: 'export'` in next.config.ts

### Long-term (1+ month)

1. **Implement Authentication**: Currently no user auth
2. **Add Caching**: Cache scan results to reduce DB load
3. **Add Rate Limiting**: Prevent abuse
4. **Set Up Monitoring**: Azure Application Insights is configured but underutilized
5. **Add Staging Environment**: Test deployments before production

---

## Appendix A: Azure CLI Commands Reference

```bash
# List resources
az resource list --resource-group rankify -o table

# Function App details
az functionapp show --name rankify-v1-src --resource-group rankify

# Function App settings
az functionapp config appsettings list --name rankify-v1-src --resource-group rankify

# List deployed functions
az functionapp function list --name rankify-v1-src --resource-group rankify

# Static Web App details
az staticwebapp show --name rankify-v1 --resource-group rankify

# PostgreSQL details
az postgres flexible-server show --name rankify-v1-data --resource-group rankify

# Check Function App logs
az webapp log tail --name rankify-v1-src --resource-group rankify
```

## Appendix B: Environment Variables Reference

### Azure Functions (Production)
```
FUNCTIONS_WORKER_RUNTIME=node
FUNCTIONS_EXTENSION_VERSION=~4
DATABASE_URL=postgresql://...
NODE_ENV=production
SCM_DO_BUILD_DURING_DEPLOYMENT=true
ENABLE_ORYX_BUILD=true
GO_API_URL=<needs to be set when Go is deployed>
```

### Frontend (Production)
```
NEXT_PUBLIC_API_URL=https://rankify-v1-src.azurewebsites.net/api
NEXT_PUBLIC_USE_MOCK=false
```

### Go API Gateway (Local)
```
DB_HOST=localhost
DB_PORT=5432
DB_NAME=rankify
DB_USER=djt_rankify_1
DB_PASSWORD=djtrankify1
PORT=8080
NATS_URL=nats://localhost:4222
```

### Python Worker (Local)
```
DB_HOST=localhost
DB_PORT=5432
DB_NAME=rankify
DB_USER=djt_rankify_1
DB_PASSWORD=djtrankify1
NATS_URL=nats://localhost:4222
```

---

**Document Version**: 1.0  
**Last Updated**: January 7, 2026  
**Author**: Generated by GitHub Copilot
