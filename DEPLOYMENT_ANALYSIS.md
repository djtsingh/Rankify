# Deployment Issue Analysis

## Problem
Azure Static Web Apps managed Functions keep failing to deploy with Prisma ORM.

## Root Cause
**Static Web Apps FREE tier managed Functions have significant limitations:**

1. **Limited npm package support** - Complex native binaries (like Prisma engines) may not work
2. **No PostgreSQL extensions** - Database connections might be restricted
3. **Limited runtime environment** - Not full Azure Functions capabilities
4. **Build constraints** - May not support all build tools

## Current Architecture (NOT WORKING)
```
Static Web App (FREE tier)
├── Frontend (Next.js) ✅ Works
└── Managed API (Functions) ❌ Fails
    └── Prisma ORM (native binaries, DB connection)
```

## Solution Options

### Option 1: Use Standalone Azure Functions (RECOMMENDED)
**Architecture:**
```
Static Web App (FREE tier)
├── Frontend (Next.js)
└── [No managed API]

Separate Azure Functions App (Consumption/Free tier)
└── Full Node.js environment
    └── Prisma ORM with PostgreSQL
```

**Pros:**
- Full Azure Functions capabilities
- Prisma works perfectly
- More control over environment
- Still FREE (Consumption plan has 1M free executions/month)

**Cons:**
- Need to configure CORS
- Separate deployment
- One more Azure resource

**Setup Steps:**
1. Create Azure Functions app in portal
2. Deploy API code separately
3. Update frontend to call Functions URL
4. Configure CORS to allow Static Web App domain

### Option 2: Remove Prisma from API (TEMPORARY)
**Quick fix to get SOMETHING working:**

1. Create simple API endpoints WITHOUT database:
   ```javascript
   // api/functions/health.js
   app.http('health', {
       handler: async () => ({ body: { status: 'ok' } })
   });
   ```

2. Move database logic to separate service later

**Pros:**
- API deploys immediately
- Frontend can be tested
- Can add database later

**Cons:**
- Not the full solution
- API is just mock data
- Need to refactor later

## Recommendation

**Start with Option 2** to get the site live NOW, then implement Option 1 for database functionality.

### Phase 1 (Today - Get Site Live)
1. Remove Prisma from API
2. Create simple mock endpoints
3. Deploy successfully
4. Frontend works with mock data

### Phase 2 (This Week - Add Database)
1. Create standalone Azure Functions resource
2. Deploy Prisma-based API there
3. Update frontend API calls
4. Full functionality restored

## Decision Required

Which approach do you want to take?
