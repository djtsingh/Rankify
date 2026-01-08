/**
 * Reusable style patterns and Tailwind class combinations
 * Ensures consistent styling across components
 */

// Common button styles
export const BUTTON_STYLES = {
  base: "inline-flex items-center justify-center gap-2 font-semibold transition-all rounded-xl disabled:opacity-50 disabled:cursor-not-allowed",
  
  sizes: {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
  },
  
  variants: {
    primary: "bg-gradient-to-br from-coral to-pink text-white hover:shadow-lg hover:shadow-coral/30 hover:scale-105",
    secondary: "bg-zinc-800 text-white hover:bg-zinc-700 border border-zinc-700",
    outline: "border-2 border-coral text-coral hover:bg-coral/10",
    ghost: "text-coral hover:bg-coral/10",
  }
} as const;

// Common card styles
export const CARD_STYLES = {
  base: "rounded-2xl border transition-all",
  
  variants: {
    default: "bg-zinc-900/50 border-zinc-800 hover:border-zinc-700",
    elevated: "bg-zinc-900 border-zinc-800 shadow-xl",
    glass: "bg-zinc-900/30 backdrop-blur-lg border-zinc-800/50",
  }
} as const;

// Common input styles
export const INPUT_STYLES = {
  base: "w-full px-4 py-3 rounded-xl border transition-all focus:outline-none focus:ring-2",
  variants: {
    default: "bg-zinc-900 border-zinc-800 text-white placeholder:text-slate-500 focus:border-coral focus:ring-coral/20",
    error: "bg-zinc-900 border-red-500 text-white focus:border-red-500 focus:ring-red-500/20",
  }
} as const;

// Text styles
export const TEXT_STYLES = {
  heading: {
    h1: "text-4xl md:text-5xl lg:text-6xl font-bold",
    h2: "text-3xl md:text-4xl lg:text-5xl font-bold",
    h3: "text-2xl md:text-3xl lg:text-4xl font-bold",
    h4: "text-xl md:text-2xl lg:text-3xl font-semibold",
  },
  
  body: {
    large: "text-lg md:text-xl text-slate-300",
    default: "text-base md:text-lg text-slate-400",
    small: "text-sm md:text-base text-slate-400",
  },
  
  gradient: {
    ocean: "bg-gradient-to-r from-cyan via-emerald to-emerald bg-clip-text text-transparent",
    fire: "bg-gradient-to-r from-coral via-pink to-pink bg-clip-text text-transparent",
    multi: "bg-gradient-to-r from-emerald via-cyan to-pink bg-clip-text text-transparent",
  }
} as const;

// Responsive container widths
export const CONTAINER_STYLES = {
  sm: "max-w-3xl mx-auto px-4",
  md: "max-w-5xl mx-auto px-4",
  lg: "max-w-7xl mx-auto px-4",
  xl: "max-w-[1400px] mx-auto px-4",
  full: "w-full px-4",
} as const;

// Animation classes
export const ANIMATION_STYLES = {
  fadeIn: "animate-fade-in",
  slideUp: "animate-slide-up",
  scaleIn: "animate-scale-in",
  pulse: "animate-pulse",
} as const;

// Shadow styles
export const SHADOW_STYLES = {
  glow: {
    emerald: "shadow-lg shadow-emerald/30",
    cyan: "shadow-lg shadow-cyan/30",
    coral: "shadow-lg shadow-coral/30",
    pink: "shadow-lg shadow-pink/30",
  },
  elevation: {
    sm: "shadow-sm",
    md: "shadow-md",
    lg: "shadow-lg",
    xl: "shadow-xl",
  }
} as const;
