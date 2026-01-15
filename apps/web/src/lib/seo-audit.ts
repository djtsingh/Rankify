/**
 * SEO Audit Utilities
 * Functions to validate and improve SEO elements
 */

export interface SEOIssue {
  type: 'error' | 'warning' | 'info';
  category: 'meta' | 'content' | 'accessibility' | 'performance' | 'technical';
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  fix?: string;
}

/**
 * Validate title tag
 */
export function validateTitle(title: string): SEOIssue[] {
  const issues: SEOIssue[] = [];

  if (!title) {
    issues.push({
      type: 'error',
      category: 'meta',
      title: 'Missing Title Tag',
      description: 'Title tag is required for SEO',
      impact: 'high',
      fix: 'Add a descriptive title tag (50-60 characters)',
    });
  } else {
    if (title.length < 30) {
      issues.push({
        type: 'warning',
        category: 'meta',
        title: 'Title Too Short',
        description: `Title is ${title.length} characters. Recommended: 50-60 characters`,
        impact: 'medium',
        fix: 'Expand title to include more descriptive keywords',
      });
    } else if (title.length > 60) {
      issues.push({
        type: 'warning',
        category: 'meta',
        title: 'Title Too Long',
        description: `Title is ${title.length} characters. Recommended: 50-60 characters`,
        impact: 'medium',
        fix: 'Shorten title while keeping important keywords',
      });
    }
  }

  return issues;
}

/**
 * Validate meta description
 */
export function validateMetaDescription(description: string): SEOIssue[] {
  const issues: SEOIssue[] = [];

  if (!description) {
    issues.push({
      type: 'error',
      category: 'meta',
      title: 'Missing Meta Description',
      description: 'Meta description is required for SEO',
      impact: 'high',
      fix: 'Add a compelling meta description (150-160 characters)',
    });
  } else {
    if (description.length < 120) {
      issues.push({
        type: 'warning',
        category: 'meta',
        title: 'Meta Description Too Short',
        description: `Description is ${description.length} characters. Recommended: 150-160 characters`,
        impact: 'medium',
        fix: 'Expand description to provide more value and keywords',
      });
    } else if (description.length > 160) {
      issues.push({
        type: 'warning',
        category: 'meta',
        title: 'Meta Description Too Long',
        description: `Description is ${description.length} characters. Recommended: 150-160 characters`,
        impact: 'medium',
        fix: 'Shorten description while keeping key benefits',
      });
    }
  }

  return issues;
}

/**
 * Validate image alt text
 */
export function validateImageAlt(alt: string, src: string): SEOIssue[] {
  const issues: SEOIssue[] = [];

  if (!alt || alt.trim() === '') {
    issues.push({
      type: 'error',
      category: 'accessibility',
      title: 'Missing Alt Text',
      description: `Image ${src} is missing alt text`,
      impact: 'high',
      fix: 'Add descriptive alt text explaining what the image shows',
    });
  } else if (alt.length < 10) {
    issues.push({
      type: 'warning',
      category: 'accessibility',
      title: 'Alt Text Too Short',
      description: `Alt text "${alt}" is too brief. Should describe the image content`,
      impact: 'medium',
      fix: 'Make alt text more descriptive of the image content',
    });
  } else if (alt.length > 125) {
    issues.push({
      type: 'warning',
      category: 'accessibility',
      title: 'Alt Text Too Long',
      description: `Alt text is ${alt.length} characters. Keep under 125 characters`,
      impact: 'low',
      fix: 'Shorten alt text while keeping essential description',
    });
  }

  return issues;
}

/**
 * Validate URL structure
 */
export function validateUrl(url: string): SEOIssue[] {
  const issues: SEOIssue[] = [];

  if (url.includes('_')) {
    issues.push({
      type: 'warning',
      category: 'technical',
      title: 'Underscore in URL',
      description: 'URLs with underscores are not SEO-friendly',
      impact: 'low',
      fix: 'Use hyphens instead of underscores in URLs',
    });
  }

  if (url.length > 100) {
    issues.push({
      type: 'warning',
      category: 'technical',
      title: 'URL Too Long',
      description: `URL is ${url.length} characters. Keep under 100 characters`,
      impact: 'low',
      fix: 'Shorten URL while maintaining readability',
    });
  }

  return issues;
}

/**
 * Generate SEO score based on issues
 */
export function calculateSEOScore(issues: SEOIssue[]): number {
  let score = 100;

  issues.forEach(issue => {
    switch (issue.impact) {
      case 'high':
        score -= 20;
        break;
      case 'medium':
        score -= 10;
        break;
      case 'low':
        score -= 5;
        break;
    }
  });

  return Math.max(0, score);
}