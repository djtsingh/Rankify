/**
 * React Hook for anime.js animations
 * Easy-to-use animations with cleanup
 */

'use client';

import { useEffect, useRef, useCallback } from 'react';
import anime from 'animejs';

type AnimeInstance = ReturnType<typeof anime>;

/**
 * Hook for pulsing glow animation on buttons
 */
export function usePulseAnimation(
  active: boolean,
  color = 'rgba(16, 185, 129, 0.4)'
) {
  const elementRef = useRef<HTMLElement>(null);
  const animationRef = useRef<AnimeInstance | null>(null);

  useEffect(() => {
    if (active && elementRef.current) {
      animationRef.current = anime({
        targets: elementRef.current,
        scale: [1, 1.05, 1],
        boxShadow: [
          `0 0 0 0 transparent`,
          `0 0 30px 15px ${color}`,
          `0 0 0 0 transparent`,
        ],
        duration: 2000,
        easing: 'easeInOutSine',
        loop: true,
      });
    }

    return () => {
      animationRef.current?.pause();
    };
  }, [active, color]);

  return elementRef;
}

/**
 * Hook for stagger reveal animation
 */
export function useStaggerReveal(trigger: boolean) {
  const containerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (trigger && containerRef.current) {
      const children = containerRef.current.children;
      
      anime({
        targets: children,
        opacity: [0, 1],
        translateY: [30, 0],
        scale: [0.95, 1],
        duration: 600,
        delay: anime.stagger(100),
        easing: 'easeOutCubic',
      });
    }
  }, [trigger]);

  return containerRef;
}

/**
 * Hook for entrance animation
 */
export function useEntranceAnimation(trigger: boolean) {
  const elementRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (trigger && elementRef.current) {
      anime({
        targets: elementRef.current,
        opacity: [0, 1],
        translateY: [30, 0],
        scale: [0.95, 1],
        duration: 800,
        easing: 'easeOutBack',
      });
    }
  }, [trigger]);

  return elementRef;
}

/**
 * Hook for counting animation
 */
export function useCountAnimation(
  targetValue: number,
  trigger: boolean,
  duration = 2000
) {
  const elementRef = useRef<HTMLElement>(null);
  const animationRef = useRef<AnimeInstance | null>(null);

  useEffect(() => {
    if (trigger && elementRef.current) {
      const obj = { value: 0 };
      const el = elementRef.current;

      animationRef.current = anime({
        targets: obj,
        value: targetValue,
        duration,
        round: 1,
        easing: 'easeOutExpo',
        update: () => {
          el.textContent = String(Math.round(obj.value));
        },
      });
    }

    return () => {
      animationRef.current?.pause();
    };
  }, [targetValue, trigger, duration]);

  return elementRef;
}

/**
 * Hook for tab change animation
 */
export function useTabAnimation() {
  const contentRef = useRef<HTMLElement>(null);

  const animateOut = useCallback((callback: () => void) => {
    if (contentRef.current) {
      anime({
        targets: contentRef.current,
        opacity: [1, 0],
        translateX: [0, -20],
        duration: 150,
        easing: 'easeInQuad',
        complete: callback,
      });
    } else {
      callback();
    }
  }, []);

  const animateIn = useCallback(() => {
    if (contentRef.current) {
      anime({
        targets: contentRef.current,
        opacity: [0, 1],
        translateX: [20, 0],
        duration: 250,
        easing: 'easeOutQuad',
      });
    }
  }, []);

  return { contentRef, animateOut, animateIn };
}

/**
 * Hook for floating animation
 */
export function useFloatAnimation(amplitude = 15) {
  const elementRef = useRef<HTMLElement>(null);
  const animationRef = useRef<AnimeInstance | null>(null);

  useEffect(() => {
    if (elementRef.current) {
      animationRef.current = anime({
        targets: elementRef.current,
        translateY: [0, -amplitude, 0],
        duration: 3000,
        easing: 'easeInOutSine',
        loop: true,
      });
    }

    return () => {
      animationRef.current?.pause();
    };
  }, [amplitude]);

  return elementRef;
}

/**
 * Hook for glowing border animation
 */
export function useGlowingBorder() {
  const elementRef = useRef<HTMLElement>(null);
  const animationRef = useRef<AnimeInstance | null>(null);

  useEffect(() => {
    if (elementRef.current) {
      animationRef.current = anime({
        targets: elementRef.current,
        borderColor: [
          'rgba(249, 115, 22, 0.5)',
          'rgba(6, 182, 212, 0.5)',
          'rgba(236, 72, 153, 0.5)',
          'rgba(249, 115, 22, 0.5)',
        ],
        boxShadow: [
          '0 0 10px rgba(249, 115, 22, 0.3)',
          '0 0 10px rgba(6, 182, 212, 0.3)',
          '0 0 10px rgba(236, 72, 153, 0.3)',
          '0 0 10px rgba(249, 115, 22, 0.3)',
        ],
        duration: 3000,
        easing: 'linear',
        loop: true,
      });
    }

    return () => {
      animationRef.current?.pause();
    };
  }, []);

  return elementRef;
}

/**
 * Hook for ripple effect on click
 */
export function useRippleEffect(color = 'rgba(255, 255, 255, 0.3)') {
  const createRipple = useCallback((event: React.MouseEvent<HTMLElement>) => {
    const button = event.currentTarget;
    const rect = button.getBoundingClientRect();
    const ripple = document.createElement('span');

    ripple.style.cssText = `
      position: absolute;
      border-radius: 50%;
      background: ${color};
      pointer-events: none;
      transform: scale(0);
      opacity: 1;
    `;

    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;

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
  }, [color]);

  return createRipple;
}

/**
 * Hook for morphing gradient background
 */
export function useMorphingGradient() {
  const elementRef = useRef<HTMLElement>(null);
  const animationRef = useRef<AnimeInstance | null>(null);

  useEffect(() => {
    if (elementRef.current) {
      animationRef.current = anime({
        targets: elementRef.current,
        background: [
          'linear-gradient(135deg, rgba(249, 115, 22, 0.2) 0%, rgba(6, 182, 212, 0.1) 100%)',
          'linear-gradient(135deg, rgba(6, 182, 212, 0.2) 0%, rgba(236, 72, 153, 0.1) 100%)',
          'linear-gradient(135deg, rgba(236, 72, 153, 0.2) 0%, rgba(249, 115, 22, 0.1) 100%)',
          'linear-gradient(135deg, rgba(249, 115, 22, 0.2) 0%, rgba(6, 182, 212, 0.1) 100%)',
        ],
        duration: 10000,
        easing: 'linear',
        loop: true,
      });
    }

    return () => {
      animationRef.current?.pause();
    };
  }, []);

  return elementRef;
}

// Export anime for direct use
export { anime };
