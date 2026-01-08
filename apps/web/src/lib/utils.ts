/**
 * 🐠 Rankify Design System - Utility Functions
 * 
 * Helper functions for consistent styling across components.
 */

import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merge class names together with Tailwind conflict resolution
 * Uses clsx for conditional classes and tailwind-merge to handle conflicts
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/**
 * Generate consistent component IDs
 */
let idCounter = 0;
export function generateId(prefix = 'rankify') {
  return `${prefix}-${++idCounter}`;
}

/**
 * Color variant mapping for components
 */
export type ColorVariant = 'primary' | 'secondary' | 'accent' | 'highlight' | 'muted';
export type SizeVariant = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type RoundedVariant = 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full';

/**
 * Get background gradient classes for a color variant
 */
export function getGradientBg(variant: ColorVariant): string {
  const gradients: Record<ColorVariant, string> = {
    primary: 'bg-gradient-to-br from-brand-primary to-brand-primary-dark',
    secondary: 'bg-gradient-to-br from-brand-secondary to-brand-secondary-dark',
    accent: 'bg-gradient-to-br from-brand-accent to-brand-accent-dark',
    highlight: 'bg-gradient-to-br from-brand-highlight to-brand-highlight-dark',
    muted: 'bg-muted',
  };
  return gradients[variant];
}

/**
 * Get text color classes for a color variant
 */
export function getTextColor(variant: ColorVariant): string {
  const colors: Record<ColorVariant, string> = {
    primary: 'text-brand-primary',
    secondary: 'text-brand-secondary',
    accent: 'text-brand-accent',
    highlight: 'text-brand-highlight',
    muted: 'text-muted-foreground',
  };
  return colors[variant];
}

/**
 * Get border color classes for a color variant
 */
export function getBorderColor(variant: ColorVariant): string {
  const borders: Record<ColorVariant, string> = {
    primary: 'border-brand-primary',
    secondary: 'border-brand-secondary',
    accent: 'border-brand-accent',
    highlight: 'border-brand-highlight',
    muted: 'border-border',
  };
  return borders[variant];
}

/**
 * Get glow shadow classes for a color variant
 */
export function getGlowShadow(variant: ColorVariant): string {
  const glows: Record<ColorVariant, string> = {
    primary: 'shadow-glow-primary',
    secondary: 'shadow-glow-secondary',
    accent: 'shadow-glow-accent',
    highlight: 'shadow-glow-highlight',
    muted: 'shadow-sm',
  };
  return glows[variant];
}

/**
 * Get size classes for padding
 */
export function getSizePadding(size: SizeVariant): string {
  const sizes: Record<SizeVariant, string> = {
    xs: 'px-2 py-1',
    sm: 'px-3 py-1.5',
    md: 'px-4 py-2',
    lg: 'px-6 py-3',
    xl: 'px-8 py-4',
  };
  return sizes[size];
}

/**
 * Get size classes for text
 */
export function getSizeText(size: SizeVariant): string {
  const sizes: Record<SizeVariant, string> = {
    xs: 'text-xs',
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl',
  };
  return sizes[size];
}

/**
 * Get rounded classes
 */
export function getRounded(rounded: RoundedVariant): string {
  const roundedMap: Record<RoundedVariant, string> = {
    none: 'rounded-none',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    xl: 'rounded-xl',
    full: 'rounded-full',
  };
  return roundedMap[rounded];
}

/**
 * Icon size mapping
 */
export function getIconSize(size: SizeVariant): string {
  const sizes: Record<SizeVariant, string> = {
    xs: 'w-3 h-3',
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
    xl: 'w-8 h-8',
  };
  return sizes[size];
}

/**
 * Icon container size mapping
 */
export function getIconContainerSize(size: SizeVariant): string {
  const sizes: Record<SizeVariant, string> = {
    xs: 'w-6 h-6',
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  };
  return sizes[size];
}
