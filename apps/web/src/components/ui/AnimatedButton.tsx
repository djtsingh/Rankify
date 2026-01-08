/**
 * Animated Button Components
 * Award-worthy button designs with anime.js animations
 */

'use client';

import { useRef, useEffect, forwardRef, ButtonHTMLAttributes } from 'react';
import anime from 'animejs';
import { Loader2 } from 'lucide-react';

interface AnimatedButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'gradient' | 'glow' | 'pulse';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  pulse?: boolean;
  children: React.ReactNode;
}

export const AnimatedButton = forwardRef<HTMLButtonElement, AnimatedButtonProps>(
  ({ 
    variant = 'primary', 
    size = 'md', 
    loading = false, 
    pulse = false,
    children, 
    className = '',
    onClick,
    ...props 
  }, ref) => {
    const buttonRef = useRef<HTMLButtonElement | null>(null);
    const animationRef = useRef<ReturnType<typeof anime> | null>(null);

    const sizes = {
      sm: 'px-4 py-2 text-sm',
      md: 'px-6 py-3 text-base',
      lg: 'px-8 py-4 text-lg',
    };

    const variants = {
      primary: 'bg-gradient-to-r from-coral to-pink text-white hover:shadow-lg hover:shadow-coral/30',
      secondary: 'bg-zinc-800 border border-zinc-700 text-white hover:bg-zinc-700',
      gradient: 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-white hover:shadow-lg hover:shadow-emerald-500/30',
      glow: 'bg-cyan-500 text-white hover:bg-cyan-600',
      pulse: 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-white',
    };

    // Pulse animation
    useEffect(() => {
      if ((pulse || variant === 'pulse') && buttonRef.current && !loading) {
        animationRef.current = anime({
          targets: buttonRef.current,
          scale: [1, 1.05, 1],
          boxShadow: [
            '0 0 0 0 rgba(16, 185, 129, 0)',
            '0 0 30px 15px rgba(16, 185, 129, 0.4)',
            '0 0 0 0 rgba(16, 185, 129, 0)',
          ],
          duration: 2000,
          easing: 'easeInOutSine',
          loop: true,
        });
      }

      return () => {
        animationRef.current?.pause();
      };
    }, [pulse, variant, loading]);

    // Ripple effect on click
    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (buttonRef.current && !loading) {
        const button = buttonRef.current;
        const rect = button.getBoundingClientRect();
        const ripple = document.createElement('span');

        ripple.style.cssText = `
          position: absolute;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.3);
          pointer-events: none;
          transform: scale(0);
          opacity: 1;
        `;

        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;

        ripple.style.width = `${size}px`;
        ripple.style.height = `${size}px`;
        ripple.style.left = `${x}px`;
        ripple.style.top = `${y}px`;

        button.appendChild(ripple);

        anime({
          targets: ripple,
          scale: [0, 2],
          opacity: [1, 0],
          duration: 600,
          easing: 'easeOutQuad',
          complete: () => ripple.remove(),
        });
      }

      onClick?.(e);
    };

    return (
      <button
        ref={(node) => {
          buttonRef.current = node;
          if (typeof ref === 'function') ref(node);
          else if (ref) ref.current = node;
        }}
        className={`
          relative overflow-hidden
          font-semibold rounded-xl
          transition-all duration-300
          flex items-center justify-center gap-2
          disabled:opacity-50 disabled:cursor-not-allowed
          ${sizes[size]}
          ${variants[variant]}
          ${className}
        `}
        onClick={handleClick}
        disabled={loading || props.disabled}
        {...props}
      >
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Loading...</span>
          </>
        ) : (
          children
        )}
      </button>
    );
  }
);

AnimatedButton.displayName = 'AnimatedButton';

/**
 * Magnetic Button - follows cursor slightly
 */
interface MagneticButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  strength?: number;
  children: React.ReactNode;
}

export function MagneticButton({ 
  strength = 0.3, 
  children, 
  className = '',
  ...props 
}: MagneticButtonProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const button = buttonRef.current;
    if (!button) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = button.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const distX = (e.clientX - centerX) * strength;
      const distY = (e.clientY - centerY) * strength;

      anime({
        targets: button,
        translateX: distX,
        translateY: distY,
        duration: 300,
        easing: 'easeOutQuad',
      });
    };

    const handleMouseLeave = () => {
      anime({
        targets: button,
        translateX: 0,
        translateY: 0,
        duration: 600,
        easing: 'easeOutElastic(1, 0.5)',
      });
    };

    button.addEventListener('mousemove', handleMouseMove);
    button.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      button.removeEventListener('mousemove', handleMouseMove);
      button.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [strength]);

  return (
    <button
      ref={buttonRef}
      className={`
        relative px-6 py-3
        font-semibold rounded-xl
        bg-gradient-to-r from-coral to-pink
        text-white
        transition-colors duration-300
        hover:shadow-lg hover:shadow-coral/30
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
}

/**
 * Glowing Border Button
 */
export function GlowingButton({ 
  children, 
  className = '',
  ...props 
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (buttonRef.current) {
      anime({
        targets: buttonRef.current,
        borderColor: [
          'rgba(249, 115, 22, 0.5)',
          'rgba(6, 182, 212, 0.5)',
          'rgba(236, 72, 153, 0.5)',
          'rgba(249, 115, 22, 0.5)',
        ],
        boxShadow: [
          '0 0 15px rgba(249, 115, 22, 0.3)',
          '0 0 15px rgba(6, 182, 212, 0.3)',
          '0 0 15px rgba(236, 72, 153, 0.3)',
          '0 0 15px rgba(249, 115, 22, 0.3)',
        ],
        duration: 3000,
        easing: 'linear',
        loop: true,
      });
    }
  }, []);

  return (
    <button
      ref={buttonRef}
      className={`
        px-6 py-3
        font-semibold rounded-xl
        bg-zinc-900
        border-2 border-coral/50
        text-white
        transition-colors duration-300
        hover:bg-zinc-800
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
}
