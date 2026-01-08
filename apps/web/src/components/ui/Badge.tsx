/**
 * 🐠 Rankify Design System - Badge Component
 * 
 * A badge/tag component for labels, status indicators, etc.
 * 
 * Usage:
 * <Badge colorScheme="primary">New</Badge>
 * <Badge colorScheme="accent" variant="outline">Featured</Badge>
 */

import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { cn } from '@/lib/utils';
import type { ColorVariant, SizeVariant } from '@/lib/utils';

export type BadgeVariant = 'solid' | 'soft' | 'outline';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  /** Color scheme */
  colorScheme?: ColorVariant;
  /** Visual style variant */
  variant?: BadgeVariant;
  /** Size of the badge */
  size?: 'sm' | 'md' | 'lg';
  /** Dot indicator before text */
  dot?: boolean;
  /** Pulsing dot animation */
  pulse?: boolean;
  /** Children */
  children: ReactNode;
}

const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  (
    {
      colorScheme = 'primary',
      variant = 'soft',
      size = 'md',
      dot = false,
      pulse = false,
      className,
      children,
      ...props
    },
    ref
  ) => {
    // Size styles
    const sizeStyles: Record<string, string> = {
      sm: 'px-2 py-0.5 text-xs',
      md: 'px-3 py-1 text-xs',
      lg: 'px-4 py-1.5 text-sm',
    };

    // Color + Variant styles
    const getColorStyles = (): string => {
      const solidMap: Record<ColorVariant, string> = {
        primary: 'bg-brand-primary text-white',
        secondary: 'bg-brand-secondary text-white',
        accent: 'bg-brand-accent text-white',
        highlight: 'bg-brand-highlight text-white',
        muted: 'bg-muted text-muted-foreground',
      };

      const softMap: Record<ColorVariant, string> = {
        primary: 'bg-brand-primary/10 text-brand-primary dark:bg-brand-primary/20',
        secondary: 'bg-brand-secondary/10 text-brand-secondary dark:bg-brand-secondary/20',
        accent: 'bg-brand-accent/10 text-brand-accent dark:bg-brand-accent/20',
        highlight: 'bg-brand-highlight/10 text-brand-highlight dark:bg-brand-highlight/20',
        muted: 'bg-muted text-muted-foreground',
      };

      const outlineMap: Record<ColorVariant, string> = {
        primary: 'border border-brand-primary text-brand-primary',
        secondary: 'border border-brand-secondary text-brand-secondary',
        accent: 'border border-brand-accent text-brand-accent',
        highlight: 'border border-brand-highlight text-brand-highlight',
        muted: 'border border-border text-muted-foreground',
      };

      switch (variant) {
        case 'solid':
          return solidMap[colorScheme];
        case 'soft':
          return softMap[colorScheme];
        case 'outline':
          return outlineMap[colorScheme];
        default:
          return softMap[colorScheme];
      }
    };

    // Dot color mapping
    const dotColorMap: Record<ColorVariant, string> = {
      primary: 'bg-brand-primary',
      secondary: 'bg-brand-secondary',
      accent: 'bg-brand-accent',
      highlight: 'bg-brand-highlight',
      muted: 'bg-muted-foreground',
    };

    return (
      <span
        ref={ref}
        className={cn(
          'inline-flex items-center gap-2 font-semibold rounded-md uppercase tracking-wide',
          sizeStyles[size],
          getColorStyles(),
          className
        )}
        {...props}
      >
        {dot && (
          <span className="relative flex h-2 w-2">
            {pulse && (
              <span
                className={cn(
                  'animate-ping absolute inline-flex h-full w-full rounded-full opacity-75',
                  dotColorMap[colorScheme]
                )}
              />
            )}
            <span
              className={cn(
                'relative inline-flex rounded-full h-2 w-2',
                dotColorMap[colorScheme]
              )}
            />
          </span>
        )}
        {children}
      </span>
    );
  }
);

Badge.displayName = 'Badge';

export { Badge };
