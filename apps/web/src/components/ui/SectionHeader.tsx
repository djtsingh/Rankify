/**
 * 🐠 Rankify Design System - Section Header Component
 * 
 * Consistent section headers used across pages.
 * 
 * Usage:
 * <SectionHeader
 *   title="Our Features"
 *   highlight="Features"
 *   description="Everything you need to rank higher"
 *   align="center"
 * />
 */

import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { cn } from '@/lib/utils';
import type { ColorVariant } from '@/lib/utils';
import { IconBox } from './IconBox';

export interface SectionHeaderProps extends HTMLAttributes<HTMLDivElement> {
  /** Main title text */
  title: string;
  /** Part of title to highlight with gradient */
  highlight?: string;
  /** Description text below title */
  description?: string;
  /** Text alignment */
  align?: 'left' | 'center' | 'right';
  /** Icon to display (will be wrapped in IconBox) */
  icon?: ReactNode;
  /** Icon color scheme */
  iconColor?: ColorVariant;
  /** Heading level for accessibility */
  as?: 'h1' | 'h2' | 'h3' | 'h4';
  /** Color for highlighted text */
  highlightColor?: ColorVariant;
}

const SectionHeader = forwardRef<HTMLDivElement, SectionHeaderProps>(
  (
    {
      title,
      highlight,
      description,
      align = 'center',
      icon,
      iconColor = 'primary',
      as: Heading = 'h2',
      highlightColor = 'secondary',
      className,
      ...props
    },
    ref
  ) => {
    const alignStyles: Record<string, string> = {
      left: 'text-left',
      center: 'text-center',
      right: 'text-right',
    };

    const headingStyles: Record<string, string> = {
      h1: 'text-4xl md:text-5xl lg:text-6xl',
      h2: 'text-3xl md:text-4xl lg:text-5xl',
      h3: 'text-2xl md:text-3xl',
      h4: 'text-xl md:text-2xl',
    };

    const highlightColorMap: Record<ColorVariant, string> = {
      primary: 'text-brand-primary',
      secondary: 'text-brand-secondary',
      accent: 'text-brand-accent',
      highlight: 'text-brand-highlight',
      muted: 'text-muted-foreground',
    };

    // Replace highlight word in title
    const renderTitle = () => {
      if (!highlight) return title;
      
      const parts = title.split(new RegExp(`(${highlight})`, 'gi'));
      return parts.map((part, index) =>
        part.toLowerCase() === highlight.toLowerCase() ? (
          <span key={index} className={highlightColorMap[highlightColor]}>
            {part}
          </span>
        ) : (
          part
        )
      );
    };

    return (
      <div
        ref={ref}
        className={cn('mb-8 md:mb-16', alignStyles[align], className)}
        {...props}
      >
        {icon && (
          <div className={cn('mb-4', align === 'center' && 'flex justify-center')}>
            <IconBox colorScheme={iconColor} size="lg">
              {icon}
            </IconBox>
          </div>
        )}
        
        <Heading className={cn('font-bold mb-3 md:mb-4', headingStyles[Heading])}>
          {renderTitle()}
        </Heading>
        
        {description && (
          <p
            className={cn(
              'text-base md:text-lg text-muted-foreground max-w-2xl',
              align === 'center' && 'mx-auto'
            )}
          >
            {description}
          </p>
        )}
      </div>
    );
  }
);

SectionHeader.displayName = 'SectionHeader';

export { SectionHeader };
