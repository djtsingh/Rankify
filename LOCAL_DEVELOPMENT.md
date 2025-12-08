# Local Development Guide

## Quick Start - Use Local Testing Scripts

All local testing scripts are in the `local-testing/` folder (not pushed to GitHub).

### Start API Server

```powershell
cd local-testing
.\start-api.bat
```

### Test Endpoints

```powershell
cd local-testing
.\test-endpoints.ps1
```

### Test Database Connection

```powershell
cd local-testing
.\test-database.ps1
```

### Start Full Stack (Web + API)

```powershell
cd local-testing
.\start-fullstack.bat
```

---

## Prerequisites

1. **Node.js 22+** - Download from https://nodejs.org/
2. **pnpm** - Install globally: `npm install -g pnpm`
3. **Azure Functions Core Tools v4** - Install globally: `npm install -g azure-functions-core-tools@4 --unsafe-perm true`
4. **PostgreSQL Client** (optional) - For database inspection

## Quick Start

### 1. Install Dependencies

```bash
# Install root dependencies
pnpm install

# Install API dependencies
cd api
npm install

# Install web dependencies (optional, if testing frontend)
cd ../apps/web
pnpm install
```

### 2. Configure Environment

The `api/local.settings.json` is already configured with:
- Database connection string
- Local CORS settings
- Port 7071 for API

### 3. Run Locally

#### Option A: API Only (Recommended for testing)

```bash
# From root directory
pnpm dev:api

# Or from api directory
cd api
npm start
```

This will:
1. Clean build artifacts
2. Generate Prisma Client
3. Compile TypeScript
4. Start Azure Functions runtime on http://localhost:7071

#### Option B: Full Stack (Web + API)

```bash
# From root directory
pnpm dev
```

This runs both:
- Frontend: http://localhost:3000
- API: http://localhost:7071

### 4. Test Endpoints

Once running, test the API:

```powershell
# Health check (with database)
Invoke-RestMethod http://localhost:7071/api/health

# Simple test endpoint
Invoke-RestMethod http://localhost:7071/api/test
```

Or use curl:
```bash
curl http://localhost:7071/api/health
curl http://localhost:7071/api/test
```

## Development Workflow

### Step 1: Make Changes
Edit files in `api/src/functions/` or `api/src/lib/`

### Step 2: Test Locally

```bash
cd api
npm run clean    # Clear old build
npm run build    # Generate Prisma + Compile TypeScript
npm start        # Start local server
```

### Step 3: Verify Everything Works

```powershell
# Test health endpoint
$response = Invoke-RestMethod http://localhost:7071/api/health
$response | ConvertTo-Json

# Should return:
# {
#   "status": "healthy",
#   "timestamp": "...",
#   "services": {
#     "database": { "status": "connected" }
#   }
# }
```

### Step 4: Commit & Push

```bash
git add .
git commit -m "Your change description"
git push
```

GitHub Actions will automatically deploy to Azure.

## Useful Commands

### API Development

```bash
# Clean build artifacts
npm run clean

# Build (Prisma generate + TypeScript compile)
npm run build

# Watch mode (auto-recompile on changes)
npm run watch

# Start Azure Functions locally
npm start

# Full rebuild and start
npm run prestart && npm start
```

### Database

```bash
# Generate Prisma Client
npx prisma generate

# View database in browser
npx prisma studio

# Create migration
npx prisma migrate dev --name your_migration_name

# Apply migrations to production
npx prisma migrate deploy
```

### Testing

```bash
# Run tests (when implemented)
npm test

# Check TypeScript errors
npx tsc --noEmit
```

## Troubleshooting

### Port Already in Use

If port 7071 is busy:
```powershell
# Windows - Find process using port
Get-Process -Id (Get-NetTCPConnection -LocalPort 7071).OwningProcess

# Kill it
Stop-Process -Id <ProcessId> -Force
```

### Prisma Client Not Found

```bash
cd api
npx prisma generate
```

### Database Connection Issues

Check `api/local.settings.json` has correct `DATABASE_URL`.

Test connection:
```bash
npx prisma db execute --stdin <<< "SELECT 1"
```

### Functions Not Loading

1. Ensure `host.json` exists in `api/`
2. Check compiled files exist in `api/functions/`
3. Rebuild: `npm run clean && npm run build`

## File Structure

```
api/
├── src/                    # TypeScript source
│   ├── functions/          # Function handlers
│   │   ├── health.ts
│   │   └── test.ts
│   └── lib/                # Shared code
│       └── prisma.ts
├── functions/              # Compiled JS (generated)
├── lib/                    # Compiled JS (generated)
├── prisma/
│   ├── schema.prisma       # Database schema
│   └── migrations/         # Migration history
├── host.json               # Azure Functions config
├── local.settings.json     # Local environment variables
├── package.json
└── tsconfig.json
```

## Environment Variables

**Local** (`api/local.settings.json`):
- `DATABASE_URL` - PostgreSQL connection string
- `NODE_ENV` - Set to "development"
- `FUNCTIONS_WORKER_RUNTIME` - Set to "node"

**Production** (Azure Portal):
- `DATABASE_URL` - Production database
- `NODE_ENV` - Set to "production"
- `WEBSITE_NODE_DEFAULT_VERSION` - Set to "~22"

## Pre-Deployment Checklist

Before pushing to GitHub:

- [ ] Test locally with `npm start`
- [ ] Verify `/api/health` returns 200 OK
- [ ] Check TypeScript compiles without errors: `npx tsc --noEmit`
- [ ] Ensure no secrets in code (use environment variables)
- [ ] Test database operations work
- [ ] Run `npm run build` successfully

## Next Steps

1. Add unit tests
2. Add integration tests
3. Set up pre-commit hooks
4. Add ESLint/Prettier configuration
5. Implement CI/CD testing before deployment
