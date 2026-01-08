/**
 * 🐠 Rankify Design System - IconBox Component
 * 
 * A colored icon container used for feature highlights, contact cards, etc.
 * 
 * Usage:
 * <IconBox colorScheme="primary" size="lg">
 *   <Mail className="w-6 h-6" />
 * </IconBox>
 */

import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { cn } from '@/lib/utils';
import type { ColorVariant, SizeVariant } from '@/lib/utils';

export interface IconBoxProps extends HTMLAttributes<HTMLDivElement> {
  /** Color scheme for the gradient background */
  colorScheme?: ColorVariant;
  /** Size of the icon container */
  size?: SizeVariant;
  /** Border radius style */
  rounded?: 'md' | 'lg' | 'xl' | 'full';
  /** Whether to animate on hover (scale effect) */
  hover?: boolean;
  /** Icon element */
  children: ReactNode;
}

const IconBox = forwardRef<HTMLDivElement, IconBoxProps>(
  (
    {
      colorScheme = 'primary',
      size = 'md',
      rounded = 'lg',
      hover = false,
      className,
      children,
      ...props
    },
    ref
  ) => {
    // Size mapping
    const sizeStyles: Record<SizeVariant, string> = {
      xs: 'w-6 h-6',
      sm: 'w-8 h-8',
      md: 'w-10 h-10',
      lg: 'w-12 h-12',
      xl: 'w-16 h-16',
    };

    // Color gradient mapping
    const colorStyles: Record<ColorVariant, string> = {
      primary: 'bg-gradient-to-br from-brand-primary to-brand-primary-dark',
      secondary: 'bg-gradient-to-br from-brand-secondary to-brand-secondary-dark',
      accent: 'bg-gradient-to-br from-brand-accent to-brand-accent-dark',
      highlight: 'bg-gradient-to-br from-brand-highlight to-brand-highlight-dark',
      muted: 'bg-muted',
    };

    // Rounded mapping
    const roundedStyles: Record<string, string> = {
      md: 'rounded-md',
      lg: 'rounded-lg',
      xl: 'rounded-xl',
      full: 'rounded-full',
    };

    return (
      <div
        ref={ref}
        className={cn(
          'flex items-center justify-center text-white',
          'transition-transform duration-200',
          sizeStyles[size],
          colorStyles[colorScheme],
          roundedStyles[rounded],
          hover && 'group-hover:scale-110',
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

IconBox.displayName = 'IconBox';

export { IconBox };
