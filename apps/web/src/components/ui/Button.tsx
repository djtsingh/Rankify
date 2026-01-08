/**
 * 🐠 Rankify Design System - Button Component
 * 
 * A flexible button component with multiple variants and sizes.
 * 
 * Usage:
 * <Button variant="primary" size="md">Click me</Button>
 * <Button variant="outline" colorScheme="secondary">Learn More</Button>
 */

import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { cn } from '@/lib/utils';
import type { ColorVariant, SizeVariant } from '@/lib/utils';

export type ButtonVariant = 'solid' | 'outline' | 'ghost' | 'link';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual style variant */
  variant?: ButtonVariant;
  /** Color scheme */
  colorScheme?: ColorVariant;
  /** Size of the button */
  size?: SizeVariant;
  /** Whether the button is in a loading state */
  isLoading?: boolean;
  /** Icon to display before the text */
  leftIcon?: ReactNode;
  /** Icon to display after the text */
  rightIcon?: ReactNode;
  /** Full width button */
  fullWidth?: boolean;
  /** Children */
  children: ReactNode;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'solid',
      colorScheme = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      fullWidth = false,
      className,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    // Base styles
    const baseStyles = cn(
      'inline-flex items-center justify-center gap-2',
      'font-semibold tracking-tight',
      'transition-all duration-200 ease-out',
      'focus:outline-none focus:ring-2 focus:ring-offset-2',
      'disabled:opacity-50 disabled:cursor-not-allowed',
      fullWidth && 'w-full'
    );

    // Size styles
    const sizeStyles: Record<SizeVariant, string> = {
      xs: 'px-2.5 py-1 text-xs rounded-md',
      sm: 'px-3 py-1.5 text-sm rounded-md',
      md: 'px-4 py-2 text-sm rounded-lg',
      lg: 'px-6 py-3 text-base rounded-lg',
      xl: 'px-8 py-4 text-lg rounded-xl',
    };

    // Variant + ColorScheme styles
    const getVariantStyles = (): string => {
      const colorMap: Record<ColorVariant, { bg: string; hover: string; text: string; border: string; ring: string }> = {
        primary: {
          bg: 'bg-gradient-to-r from-brand-primary via-brand-primary-light to-brand-secondary',
          hover: 'hover:shadow-glow-primary hover:-translate-y-0.5',
          text: 'text-white',
          border: 'border-brand-primary',
          ring: 'focus:ring-brand-primary',
        },
        secondary: {
          bg: 'bg-gradient-to-r from-brand-secondary to-brand-secondary-light',
          hover: 'hover:shadow-glow-secondary hover:-translate-y-0.5',
          text: 'text-white',
          border: 'border-brand-secondary',
          ring: 'focus:ring-brand-secondary',
        },
        accent: {
          bg: 'bg-gradient-to-r from-brand-accent to-brand-accent-light',
          hover: 'hover:shadow-glow-accent hover:-translate-y-0.5',
          text: 'text-white',
          border: 'border-brand-accent',
          ring: 'focus:ring-brand-accent',
        },
        highlight: {
          bg: 'bg-gradient-to-r from-brand-highlight to-brand-highlight-light',
          hover: 'hover:shadow-glow-highlight hover:-translate-y-0.5',
          text: 'text-white',
          border: 'border-brand-highlight',
          ring: 'focus:ring-brand-highlight',
        },
        muted: {
          bg: 'bg-muted',
          hover: 'hover:bg-muted/80',
          text: 'text-foreground',
          border: 'border-border',
          ring: 'focus:ring-muted',
        },
      };

      const color = colorMap[colorScheme];

      switch (variant) {
        case 'solid':
          return cn(color.bg, color.text, color.hover, color.ring, 'shadow-md');
        case 'outline':
          return cn(
            'bg-transparent border-2',
            color.border,
            `text-brand-${colorScheme === 'muted' ? 'foreground' : colorScheme}`,
            `hover:bg-brand-${colorScheme}`,
            'hover:text-white',
            color.ring
          );
        case 'ghost':
          return cn(
            'bg-transparent',
            `text-brand-${colorScheme === 'muted' ? 'foreground' : colorScheme}`,
            `hover:bg-brand-${colorScheme}/10`,
            color.ring
          );
        case 'link':
          return cn(
            'bg-transparent p-0',
            `text-brand-${colorScheme === 'muted' ? 'foreground' : colorScheme}`,
            'hover:underline',
            color.ring
          );
        default:
          return '';
      }
    };

    return (
      <button
        ref={ref}
        className={cn(baseStyles, sizeStyles[size], getVariantStyles(), className)}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && (
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {!isLoading && leftIcon}
        {children}
        {!isLoading && rightIcon}
      </button>
    );
  }
);

Button.displayName = 'Button';

export { Button };
