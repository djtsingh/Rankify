/**
 * 🐠 Rankify Design System - Stat Component
 * 
 * Display statistics with number and label.
 * 
 * Usage:
 * <Stat value="50K+" label="Active Users" colorScheme="primary" />
 */

import { forwardRef, type HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';
import type { ColorVariant } from '@/lib/utils';

export interface StatProps extends HTMLAttributes<HTMLDivElement> {
  /** The stat value (e.g., "50K+", "$1.2M") */
  value: string;
  /** Label describing the stat */
  label: string;
  /** Color for the value */
  colorScheme?: ColorVariant;
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
  /** Text alignment */
  align?: 'left' | 'center' | 'right';
}

const Stat = forwardRef<HTMLDivElement, StatProps>(
  (
    {
      value,
      label,
      colorScheme = 'primary',
      size = 'md',
      align = 'center',
      className,
      ...props
    },
    ref
  ) => {
    const colorMap: Record<ColorVariant, string> = {
      primary: 'text-brand-primary',
      secondary: 'text-brand-secondary',
      accent: 'text-brand-accent',
      highlight: 'text-brand-highlight',
      muted: 'text-foreground',
    };

    const sizeMap: Record<string, { value: string; label: string }> = {
      sm: { value: 'text-xl md:text-2xl', label: 'text-xs' },
      md: { value: 'text-2xl md:text-3xl', label: 'text-sm' },
      lg: { value: 'text-3xl md:text-4xl', label: 'text-base' },
    };

    const alignMap: Record<string, string> = {
      left: 'text-left',
      center: 'text-center',
      right: 'text-right',
    };

    return (
      <div
        ref={ref}
        className={cn(alignMap[align], className)}
        role="group"
        aria-label={`${value} ${label}`}
        {...props}
      >
        <div className={cn('font-bold mb-1 md:mb-2', sizeMap[size].value, colorMap[colorScheme])}>
          {value}
        </div>
        <div className={cn('font-medium text-muted-foreground', sizeMap[size].label)}>
          {label}
        </div>
      </div>
    );
  }
);

Stat.displayName = 'Stat';

// Stat Group for displaying multiple stats
export interface StatGroupProps extends HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  /** Number of columns */
  columns?: 1 | 2 | 3 | 4;
  /** Gap between stats */
  gap?: 'sm' | 'md' | 'lg';
}

const StatGroup = forwardRef<HTMLDivElement, StatGroupProps>(
  (
    {
      children,
      columns = 3,
      gap = 'md',
      className,
      ...props
    },
    ref
  ) => {
    const columnMap: Record<number, string> = {
      1: 'grid-cols-1',
      2: 'grid-cols-2',
      3: 'grid-cols-1 sm:grid-cols-3',
      4: 'grid-cols-2 lg:grid-cols-4',
    };

    const gapMap: Record<string, string> = {
      sm: 'gap-4',
      md: 'gap-6',
      lg: 'gap-8',
    };

    return (
      <div
        ref={ref}
        className={cn('grid', columnMap[columns], gapMap[gap], className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);

StatGroup.displayName = 'StatGroup';

export { Stat, StatGroup };
