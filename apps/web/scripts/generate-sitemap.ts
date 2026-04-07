/**
 * Sitemap Generator Script
 * Generates sitemap.xml based on seo.config.ts pages configuration
 * Run with: npx tsx scripts/generate-sitemap.ts
 */

import * as fs from 'fs';
import * as path from 'path';

// Import config - we need to use the actual values, not the module
// Because this runs outside Next.js context, we inline the config
const siteUrl = 'https://www.rankify.page';

// Page configurations with SEO metadata
const pages = [
  {
    path: '',
    changefreq: 'daily',
    priority: 1.0,
  },
  {
    path: '/website-audit',
    changefreq: 'daily',
    priority: 0.9,
  },
  {
    path: '/pricing',
    changefreq: 'weekly',
    priority: 0.8,
  },
  {
    path: '/about',
    changefreq: 'monthly',
    priority: 0.7,
  },
  {
    path: '/contact',
    changefreq: 'monthly',
    priority: 0.6,
  },
  {
    path: '/security',
    changefreq: 'monthly',
    priority: 0.5,
  },
  {
    path: '/privacy',
    changefreq: 'monthly',
    priority: 0.4,
  },
  {
    path: '/terms',
    changefreq: 'monthly',
    priority: 0.4,
  },
  {
    path: '/cookies',
    changefreq: 'monthly',
    priority: 0.4,
  },
  {
    path: '/acceptable-use',
    changefreq: 'monthly',
    priority: 0.4,
  },
];

function generateSitemap(): string {
  const today = new Date().toISOString().split('T')[0];
  
  const urlEntries = pages
    .map(
      (page) => `  <url>
    <loc>${siteUrl}${page.path || '/'}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`
    )
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlEntries}
</urlset>
`;
}

function main() {
  const sitemap = generateSitemap();
  const outputPath = path.join(process.cwd(), 'public', 'sitemap.xml');
  
  fs.writeFileSync(outputPath, sitemap, 'utf-8');
  
  console.log(`✓ Sitemap generated at: ${outputPath}`);
  console.log(`  - ${pages.length} URLs included`);
  console.log(`  - Last modified: ${new Date().toISOString().split('T')[0]}`);
}

main();
