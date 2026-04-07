/**
 * Breadcrumbs Component
 * Renders breadcrumb navigation with JSON-LD structured data
 */

import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';
import { generateBreadcrumbSchema } from '@/lib/seo/structured-data';

export interface BreadcrumbItem {
  label: string;
  href: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
  showHome?: boolean;
}

export function Breadcrumbs({ 
  items, 
  className = '', 
  showHome = true 
}: BreadcrumbsProps) {
  // Always include Home as first item if showHome is true
  const fullItems: BreadcrumbItem[] = showHome
    ? [{ label: 'Home', href: '/' }, ...items]
    : items;
  
  // Generate schema items for JSON-LD
  const schemaItems = fullItems.map(item => ({
    name: item.label,
    url: item.href,
  }));
  
  return (
    <>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateBreadcrumbSchema(schemaItems)),
        }}
      />
      
      {/* Visual Breadcrumb Navigation */}
      <nav 
        aria-label="Breadcrumb" 
        className={`flex items-center text-sm ${className}`}
      >
        <ol className="flex items-center gap-1 flex-wrap">
          {fullItems.map((item, index) => {
            const isLast = index === fullItems.length - 1;
            const isHome = index === 0 && showHome;
            
            return (
              <li key={item.href} className="flex items-center">
                {index > 0 && (
                  <ChevronRight 
                    className="w-4 h-4 mx-1.5 text-zinc-600 flex-shrink-0" 
                    aria-hidden="true" 
                  />
                )}
                
                {isLast ? (
                  // Current page - not a link
                  <span 
                    className="text-white font-medium truncate max-w-[200px]" 
                    aria-current="page"
                  >
                    {item.label}
                  </span>
                ) : (
                  // Link to ancestor page
                  <Link 
                    href={item.href}
                    className="text-zinc-400 hover:text-white transition-colors flex items-center gap-1.5 truncate max-w-[150px]"
                  >
                    {isHome && <Home className="w-4 h-4 flex-shrink-0" aria-hidden="true" />}
                    <span className={isHome ? 'sr-only sm:not-sr-only' : ''}>
                      {item.label}
                    </span>
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}

/**
 * Helper function to create breadcrumb items from a path
 * @example createBreadcrumbsFromPath('/about') => [{ label: 'About', href: '/about' }]
 */
export function createBreadcrumbsFromPath(path: string): BreadcrumbItem[] {
  const segments = path.split('/').filter(Boolean);
  
  return segments.map((segment, index) => {
    const href = '/' + segments.slice(0, index + 1).join('/');
    const label = segment
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
    
    return { label, href };
  });
}
