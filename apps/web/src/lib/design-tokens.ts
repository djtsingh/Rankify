/**
 * 🐠 Rankify Design System - Ocean Reef Theme
 * 
 * This file defines all design tokens used throughout the application.
 * Change colors here to update them everywhere automatically.
 * 
 * Usage:
 * - Import tokens: import { colors, spacing, typography } from '@/lib/design-tokens'
 * - Use CSS variables: className="bg-brand-primary text-brand-primary-foreground"
 * - Use semantic classes: className="bg-primary text-primary-foreground"
 */

// ============================================
// 🎨 COLOR PALETTE
// ============================================

export const colors = {
  // Brand Colors (Primary Palette)
  brand: {
    primary: {
      DEFAULT: '#10B981',    // Emerald - Growth, Success
      light: '#34D399',
      dark: '#059669',
      foreground: '#FFFFFF',
    },
    secondary: {
      DEFAULT: '#06B6D4',    // Cyan - Ocean, Trust
      light: '#22D3EE',
      dark: '#0891B2',
      foreground: '#FFFFFF',
    },
    accent: {
      DEFAULT: '#F97316',    // Coral - Energy, Action
      light: '#FB923C',
      dark: '#EA580C',
      foreground: '#FFFFFF',
    },
    highlight: {
      DEFAULT: '#EC4899',    // Pink - Creativity, Fun
      light: '#F472B6',
      dark: '#DB2777',
      foreground: '#FFFFFF',
    },
  },

  // Semantic Colors
  semantic: {
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    info: '#06B6D4',
  },

  // Background Colors
  background: {
    light: {
      DEFAULT: '#F8FAFC',
      card: '#FFFFFF',
      muted: '#F1F5F9',
    },
    dark: {
      DEFAULT: '#0F172A',
      card: '#1E293B',
      muted: '#334155',
    },
  },

  // Text Colors
  text: {
    light: {
      DEFAULT: '#0F172A',
      muted: '#64748B',
    },
    dark: {
      DEFAULT: '#F8FAFC',
      muted: '#94A3B8',
    },
  },

  // Border Colors
  border: {
    light: '#E2E8F0',
    dark: '#334155',
  },
} as const;

// ============================================
// 📐 SPACING SCALE
// ============================================

export const spacing = {
  px: '1px',
  0: '0',
  0.5: '0.125rem',  // 2px
  1: '0.25rem',     // 4px
  1.5: '0.375rem',  // 6px
  2: '0.5rem',      // 8px
  2.5: '0.625rem',  // 10px
  3: '0.75rem',     // 12px
  3.5: '0.875rem',  // 14px
  4: '1rem',        // 16px
  5: '1.25rem',     // 20px
  6: '1.5rem',      // 24px
  7: '1.75rem',     // 28px
  8: '2rem',        // 32px
  9: '2.25rem',     // 36px
  10: '2.5rem',     // 40px
  11: '2.75rem',    // 44px
  12: '3rem',       // 48px
  14: '3.5rem',     // 56px
  16: '4rem',       // 64px
  20: '5rem',       // 80px
  24: '6rem',       // 96px
  28: '7rem',       // 112px
  32: '8rem',       // 128px
  36: '9rem',       // 144px
  40: '10rem',      // 160px
  44: '11rem',      // 176px
  48: '12rem',      // 192px
  52: '13rem',      // 208px
  56: '14rem',      // 224px
  60: '15rem',      // 240px
  64: '16rem',      // 256px
  72: '18rem',      // 288px
  80: '20rem',      // 320px
  96: '24rem',      // 384px
} as const;

// ============================================
// 🔤 TYPOGRAPHY
// ============================================

export const typography = {
  fontFamily: {
    sans: "'Inter', system-ui, -apple-system, sans-serif",
  },
  
  fontSize: {
    xs: ['0.75rem', { lineHeight: '1rem' }],
    sm: ['0.875rem', { lineHeight: '1.25rem' }],
    base: ['1rem', { lineHeight: '1.5rem' }],
    lg: ['1.125rem', { lineHeight: '1.75rem' }],
    xl: ['1.25rem', { lineHeight: '1.75rem' }],
    '2xl': ['1.5rem', { lineHeight: '2rem' }],
    '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
    '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
    '5xl': ['3rem', { lineHeight: '1' }],
    '6xl': ['3.75rem', { lineHeight: '1' }],
    '7xl': ['4.5rem', { lineHeight: '1' }],
    '8xl': ['6rem', { lineHeight: '1' }],
    '9xl': ['8rem', { lineHeight: '1' }],
  },
  
  fontWeight: {
    light: '300',
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
    black: '900',
  },
  
  letterSpacing: {
    tighter: '-0.05em',
    tight: '-0.025em',
    normal: '0em',
    wide: '0.025em',
    wider: '0.05em',
    widest: '0.1em',
  },
} as const;

// ============================================
// 🎯 BORDER RADIUS
// ============================================

export const borderRadius = {
  none: '0',
  sm: '0.25rem',    // 4px
  DEFAULT: '0.5rem', // 8px
  md: '0.5rem',     // 8px
  lg: '0.75rem',    // 12px
  xl: '1rem',       // 16px
  '2xl': '1.5rem',  // 24px
  '3xl': '2rem',    // 32px
  full: '9999px',
} as const;

// ============================================
// 🌫️ SHADOWS
// ============================================

export const shadows = {
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  DEFAULT: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
  '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  
  // Brand Glows
  glow: {
    primary: '0 0 20px rgba(16, 185, 129, 0.3)',
    secondary: '0 0 20px rgba(6, 182, 212, 0.3)',
    accent: '0 0 20px rgba(249, 115, 22, 0.3)',
    highlight: '0 0 20px rgba(236, 72, 153, 0.3)',
  },
  
  // Hover States
  hover: {
    primary: '0 8px 25px rgba(16, 185, 129, 0.4)',
    secondary: '0 8px 25px rgba(6, 182, 212, 0.4)',
    accent: '0 8px 25px rgba(249, 115, 22, 0.4)',
    highlight: '0 8px 25px rgba(236, 72, 153, 0.4)',
  },
} as const;

// ============================================
// ⏱️ TRANSITIONS
// ============================================

export const transitions = {
  duration: {
    fast: '150ms',
    DEFAULT: '200ms',
    slow: '300ms',
    slower: '500ms',
  },
  
  easing: {
    DEFAULT: 'cubic-bezier(0.4, 0, 0.2, 1)',
    in: 'cubic-bezier(0.4, 0, 1, 1)',
    out: 'cubic-bezier(0, 0, 0.2, 1)',
    inOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    bounce: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
  },
} as const;

// ============================================
// 📱 BREAKPOINTS
// ============================================

export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const;

// ============================================
// 🎨 CSS VARIABLE MAPPINGS
// ============================================

/**
 * These map to CSS custom properties in globals.css
 * Usage in Tailwind: bg-primary, text-secondary, etc.
 */
export const cssVariables = {
  // Brand colors - use these in components
  '--brand-primary': colors.brand.primary.DEFAULT,
  '--brand-primary-light': colors.brand.primary.light,
  '--brand-primary-dark': colors.brand.primary.dark,
  '--brand-secondary': colors.brand.secondary.DEFAULT,
  '--brand-secondary-light': colors.brand.secondary.light,
  '--brand-secondary-dark': colors.brand.secondary.dark,
  '--brand-accent': colors.brand.accent.DEFAULT,
  '--brand-accent-light': colors.brand.accent.light,
  '--brand-accent-dark': colors.brand.accent.dark,
  '--brand-highlight': colors.brand.highlight.DEFAULT,
  '--brand-highlight-light': colors.brand.highlight.light,
  '--brand-highlight-dark': colors.brand.highlight.dark,
} as const;

// ============================================
// 🏷️ COMPONENT VARIANT TYPES
// ============================================

export type ColorVariant = 'primary' | 'secondary' | 'accent' | 'highlight';
export type SizeVariant = 'sm' | 'md' | 'lg' | 'xl';
export type ButtonVariant = 'solid' | 'outline' | 'ghost' | 'link';

// Helper to get gradient classes
export const getGradientClasses = (variant: ColorVariant): string => {
  const gradients: Record<ColorVariant, string> = {
    primary: 'from-brand-primary to-brand-primary-light',
    secondary: 'from-brand-secondary to-brand-secondary-light',
    accent: 'from-brand-accent to-brand-accent-light',
    highlight: 'from-brand-highlight to-brand-highlight-light',
  };
  return gradients[variant];
};

// Helper to get glow classes
export const getGlowClasses = (variant: ColorVariant): string => {
  const glows: Record<ColorVariant, string> = {
    primary: 'shadow-glow-primary hover:shadow-hover-primary',
    secondary: 'shadow-glow-secondary hover:shadow-hover-secondary',
    accent: 'shadow-glow-accent hover:shadow-hover-accent',
    highlight: 'shadow-glow-highlight hover:shadow-hover-highlight',
  };
  return glows[variant];
};

export default {
  colors,
  spacing,
  typography,
  borderRadius,
  shadows,
  transitions,
  breakpoints,
  cssVariables,
};
