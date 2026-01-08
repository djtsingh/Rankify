/**
 * 🐠 Rankify Design System - Theme Toggle Component
 * 
 * A beautiful dark/light mode toggle button.
 * 
 * Usage:
 * <ThemeToggle />
 */

'use client';

import { useState, useEffect } from 'react';
import { Moon, Sun } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ThemeToggleProps {
  /** Additional CSS classes */
  className?: string;
  /** Callback when theme changes */
  onThemeChange?: (isDark: boolean) => void;
}

export function ThemeToggle({ className, onThemeChange }: ThemeToggleProps) {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [mounted, setMounted] = useState(false);

  // Only run on client
  useEffect(() => {
    setMounted(true);
    
    // Check for saved preference or system preference
    const saved = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const shouldBeDark = saved ? saved === 'dark' : prefersDark;
    
    setIsDarkMode(shouldBeDark);
    
    if (shouldBeDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  // Handle theme changes
  useEffect(() => {
    if (!mounted) return;
    
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
    
    onThemeChange?.(isDarkMode);
  }, [isDarkMode, mounted, onThemeChange]);

  // Prevent hydration mismatch
  if (!mounted) {
    return (
      <div className={cn('w-16 h-8 rounded-full bg-muted animate-pulse', className)} />
    );
  }

  return (
    <button
      onClick={() => setIsDarkMode(!isDarkMode)}
      className={cn(
        'relative w-16 h-8 rounded-full cursor-pointer',
        'transition-all duration-300 ease-out',
        'border-2',
        isDarkMode
          ? 'bg-gradient-to-r from-slate-700 to-slate-800 border-slate-600 hover:border-brand-primary'
          : 'bg-gradient-to-r from-sky-100 to-sky-200 border-sky-300 hover:border-brand-secondary',
        className
      )}
      aria-label={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}
      role="switch"
      aria-checked={isDarkMode}
    >
      <div
        className={cn(
          'absolute top-0.5 w-6 h-6 rounded-full',
          'flex items-center justify-center',
          'transition-all duration-300 ease-bounce',
          isDarkMode
            ? 'left-0.5 bg-gradient-to-br from-slate-100 to-slate-200'
            : 'left-[calc(100%-26px)] bg-gradient-to-br from-amber-200 to-yellow-300'
        )}
      >
        {isDarkMode ? (
          <Moon className="w-3.5 h-3.5 text-slate-600" />
        ) : (
          <Sun className="w-3.5 h-3.5 text-amber-600" />
        )}
      </div>
    </button>
  );
}

export default ThemeToggle;
