<p align="center">
  <img src="apps/web/public/rankify-logo.png" alt="Rankify Logo" width="120" height="120">
</p>

<h1 align="center">Rankify</h1>

<p align="center">
  <strong>🚀 Make Your Rankings Fly</strong>
</p>

<p align="center">
  A comprehensive, enterprise-grade SEO analysis platform providing industry-leading insights to optimize website rankings. Built with modern technologies and deployed on Azure's serverless infrastructure.
</p>

<p align="center">
  <a href="https://www.rankify.page">Live Demo</a> •
  <a href="#features">Features</a> •
  <a href="#tech-stack">Tech Stack</a> •
  <a href="#getting-started">Getting Started</a> •
  <a href="#deployment">Deployment</a>
</p>

---

## ✨ Features

### 🔍 **Comprehensive SEO Audit**
- **Performance Analysis** - Core Web Vitals (LCP, FID, CLS, INP, TTFB, FCP)
- **Technical SEO** - Crawlability, indexing, mobile-friendliness, security
- **On-Page SEO** - Title tags, meta descriptions, headings, images, links
- **Content Intelligence** - AI-powered content analysis, keyword density, readability
- **Social SEO** - Open Graph tags, Twitter Cards, social sharing optimization
- **Backlink Profile** - Link analysis (mock data in current version)
- **Competitor Analysis** - Competitive intelligence insights
- **User Experience** - Accessibility, mobile responsiveness, touch targets

### 📊 **Beautiful Results Dashboard**
- Interactive score gauges with animated visualizations
- Tabbed navigation for different SEO categories
- Issue prioritization with actionable recommendations
- Export reports as PDF/CSV
- Share results via email or direct link
- Print-friendly report format

### 🎨 **Modern UI/UX**
- Dark theme with cyan/coral accent colors
- Smooth anime.js animations
- Responsive design for all devices
- Loading states with progress visualization
- Toast notifications and micro-interactions

---

## 🛠 Tech Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| **Next.js 15** | React framework with App Router |
| **TypeScript** | Type-safe development |
| **Tailwind CSS** | Utility-first styling |
| **anime.js** | Animation library |
| **Lucide React** | Beautiful icon set |

### Backend
| Technology | Purpose |
|------------|---------|
| **Azure Functions** | Serverless API (Node.js 22) |
| **Prisma** | Database ORM |
| **PostgreSQL** | Azure Flexible Server database |
| **Azure Storage Queue** | Job queue for async processing |

### Python Worker
| Technology | Purpose |
|------------|---------|
| **Python 3.11** | SEO analysis engine |
| **BeautifulSoup4** | HTML parsing |
| **scikit-learn** | TF-IDF keyword extraction |
| **textstat** | Readability analysis |
| **Azure Container Apps** | Docker deployment |

### Infrastructure
| Service | Purpose |
|---------|---------|
| **Azure Static Web Apps** | Frontend hosting |
| **Azure Functions** | API hosting |
| **Azure Container Apps** | Python worker |
| **Azure PostgreSQL** | Database |
| **GitHub Actions** | CI/CD pipelines |

---

## 📁 Project Structure

```
Rankify/
├── 📂 apps/
│   └── 📂 web/                      # Next.js Frontend
│       ├── 📂 src/
│       │   ├── 📂 app/              # App Router pages
│       │   │   ├── 📂 website-audit/
│       │   │   │   └── 📂 results/[scanId]/  # Dynamic results page
│       │   │   ├── page.tsx         # Homepage
│       │   │   └── layout.tsx       # Root layout
│       │   ├── 📂 components/       # React components
│       │   │   ├── 📂 audit/        # SEO audit displays
│       │   │   ├── 📂 layout/       # Layout components
│       │   │   └── 📂 ui/           # UI primitives
│       │   ├── 📂 lib/              # Utilities & hooks
│       │   │   ├── 📂 api/          # API clients
│       │   │   ├── 📂 hooks/        # Custom React hooks
│       │   │   └── 📂 types/        # TypeScript types
│       │   └── 📂 fonts/            # Custom fonts
│       └── 📄 next.config.ts
│
├── 📂 api/                          # Azure Functions API
│   ├── 📂 src/
│   │   ├── 📂 functions/            # API endpoints
│   │   │   ├── scans.ts             # Scan CRUD operations
│   │   │   └── health.ts            # Health check
│   │   └── 📂 lib/                  # Shared utilities
│   ├── 📂 prisma/                   # Database schema
│   └── 📄 host.json
│
├── 📂 backend/
│   └── 📂 SEO-checker/
│       └── 📂 py-services/          # Python SEO Worker
│           ├── 📂 extractor/        # SEO extraction modules
│           │   ├── comprehensive_extractor.py
│           │   ├── text_analyzer.py
│           │   ├── security_headers.py
│           │   └── pagespeed_insights.py
│           ├── 📂 worker/           # Queue worker
│           └── 📄 Dockerfile
│
├── 📂 .github/
│   └── 📂 workflows/                # CI/CD Pipelines
│       ├── azure-static-web-apps.yml
│       ├── main_rankify-v1-src.yml
│       └── deploy-python-worker.yml
│
├── 📄 staticwebapp.config.json      # SWA routing config
├── 📄 pnpm-workspace.yaml           # Monorepo config
└── 📄 package.json                  # Root package.json
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 22+
- pnpm 9+
- Python 3.11+ (for backend worker)

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/rankify.git
cd rankify

# Install dependencies
pnpm install

# Set up environment variables
cp apps/web/.env.example apps/web/.env.local
cp api/local.settings.example.json api/local.settings.json
```

### Development

```bash
# Run all services concurrently
pnpm dev

# Or run services individually:
pnpm dev:web      # Frontend only (http://localhost:3000)
pnpm dev:api      # API only (http://localhost:7071)
```

### Environment Variables

#### Frontend (`apps/web/.env.local`)
```env
NEXT_PUBLIC_API_URL=http://localhost:7071
NEXT_PUBLIC_USE_MOCK=true
```

#### API (`api/local.settings.json`)
```json
{
  "Values": {
    "DATABASE_URL": "postgresql://...",
    "AZURE_STORAGE_CONNECTION_STRING": "..."
  }
}
```

---

## 📦 Building

```bash
# Build all packages
pnpm build

# Build frontend only
pnpm build:web

# Build API only
cd api && npm run build
```

### Static Export

The frontend uses Next.js static export for Azure Static Web Apps. Dynamic routes use the "Wrapper Fix" pattern:

```tsx
// page.tsx - Server component with generateStaticParams
export function generateStaticParams() {
  return [{ scanId: 'placeholder' }];
}

// Client component handles actual routing via useParams()
```

---

## 🚢 Deployment

### GitHub Actions Workflows

| Workflow | Trigger | Target |
|----------|---------|--------|
| `azure-static-web-apps.yml` | Push to `apps/web/**` | Azure Static Web Apps |
| `main_rankify-v1-src.yml` | Push to `api/**` | Azure Functions |
| `deploy-python-worker.yml` | Push to `backend/**` | Azure Container Apps |

### Required Secrets

```yaml
# Azure Static Web Apps
AZURE_STATIC_WEB_APPS_API_TOKEN

# Azure Functions
AZURE_FUNCTIONAPP_PUBLISH_PROFILE

# Python Worker
AZURE_CREDENTIALS
ACR_USERNAME
ACR_PASSWORD
DATABASE_URL
AZURE_STORAGE_CONNECTION_STRING
```

### Manual Deployment

```bash
# Frontend
cd apps/web && pnpm build
# Upload 'out/' to Azure Static Web Apps

# API
cd api && npm run build
func azure functionapp publish rankify-v1-src

# Python Worker
cd backend/SEO-checker/py-services
docker build -t rankifyacr.azurecr.io/seo-worker:latest .
docker push rankifyacr.azurecr.io/seo-worker:latest
```

---

## 🏗 Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                    Azure Static Web Apps                             │
│                    (Next.js Static Export)                           │
│                    https://www.rankify.page                          │
└──────────────────────────────┬──────────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────────┐
│                      Azure Functions                                 │
│                    (Node.js TypeScript API)                          │
│         POST /api/v1/scans   |   GET /api/v1/scans/{id}             │
└──────────────────────────────┬──────────────────────────────────────┘
                               │
           ┌───────────────────┴───────────────────┐
           ▼                                       ▼
┌────────────────────────────────────────┐   ┌──────────────────────────┐
│       Azure Storage Queue              │   │   Azure PostgreSQL       │
│          (scan-jobs)                   │   │   (rankify-v1-data)      │
└───────────────┬────────────────────────┘   └──────────────────────────┘
                │                                      ▲
                ▼                                      │
┌──────────────────────────────────────────────────────┴──────────────┐
│                    Azure Container Apps                              │
│                   (Python SEO Worker)                                │
│                                                                      │
│   • Polls queue for scan jobs                                        │
│   • Fetches target URL                                               │
│   • Extracts comprehensive SEO metrics                               │
│   • Saves results to PostgreSQL                                      │
│   • Auto-scales 0-3 replicas                                         │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 📊 SEO Metrics Extracted

### Core Web Vitals
- Largest Contentful Paint (LCP)
- First Input Delay (FID)  
- Cumulative Layout Shift (CLS)
- Interaction to Next Paint (INP)
- Time to First Byte (TTFB)
- First Contentful Paint (FCP)

### Technical SEO
- HTTPS/SSL validation
- Robots.txt analysis
- XML Sitemap detection
- Canonical URL verification
- Mobile viewport configuration
- Structured data (Schema.org)

### Content Analysis
- Title tag optimization
- Meta description analysis
- Heading hierarchy (H1-H6)
- Image alt text audit
- Internal/External link analysis
- Word count & readability
- TF-IDF keyword extraction

### Security
- Security headers (CSP, X-Frame-Options, etc.)
- Mixed content detection
- HSTS verification

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is proprietary software. All rights reserved.

---

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - React Framework
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Azure](https://azure.microsoft.com/) - Cloud Infrastructure
- [anime.js](https://animejs.com/) - Animations
- [Lucide](https://lucide.dev/) - Icons

---

<p align="center">
  Built with ❤️ by the Rankify Team
</p>

<p align="center">
  <a href="https://www.rankify.page">www.rankify.page</a>
</p>
