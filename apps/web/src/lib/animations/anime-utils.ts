/**
 * Anime.js Animation Utilities
 * Award-worthy animations for Rankify SEO Audit Tool
 */

import anime from 'animejs';

// Types for animation configurations
export interface AnimationConfig {
  targets: string | Element | Element[] | NodeList;
  duration?: number;
  delay?: number | ((el: Element, i: number) => number);
  easing?: string;
}

/**
 * Pulsing glow effect for buttons - draws attention
 */
export function createPulseGlow(target: string | Element, color = '#10b981') {
  return anime({
    targets: target,
    boxShadow: [
      { value: `0 0 0 0 ${color}00`, duration: 0 },
      { value: `0 0 20px 8px ${color}60`, duration: 800 },
      { value: `0 0 0 0 ${color}00`, duration: 800 },
    ],
    easing: 'easeInOutQuad',
    loop: true,
  });
}

/**
 * Attention-grabbing button pulse with scale
 */
export function createButtonPulse(target: string | Element) {
  return anime({
    targets: target,
    scale: [1, 1.05, 1],
    boxShadow: [
      '0 0 0 0 rgba(16, 185, 129, 0)',
      '0 0 25px 10px rgba(16, 185, 129, 0.4)',
      '0 0 0 0 rgba(16, 185, 129, 0)',
    ],
    duration: 2000,
    easing: 'easeInOutSine',
    loop: true,
  });
}

/**
 * Gradient shimmer effect for hero elements
 */
export function createGradientShimmer(target: string | Element) {
  return anime({
    targets: target,
    backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
    duration: 3000,
    easing: 'linear',
    loop: true,
  });
}

/**
 * Floating animation for decorative elements
 */
export function createFloatAnimation(target: string | Element, amplitude = 15) {
  return anime({
    targets: target,
    translateY: [0, -amplitude, 0],
    duration: 3000,
    easing: 'easeInOutSine',
    loop: true,
  });
}

/**
 * Stagger reveal animation for grid items
 */
export function createStaggerReveal(targets: string | Element | Element[] | NodeList, options?: Partial<AnimationConfig>) {
  const startDelay = typeof options?.delay === 'number' ? options.delay : 0;
  return anime({
    targets,
    opacity: [0, 1],
    translateY: [30, 0],
    scale: [0.95, 1],
    duration: options?.duration || 600,
    delay: anime.stagger(100, { start: startDelay }),
    easing: options?.easing || 'easeOutCubic',
  });
}

/**
 * Score counter animation
 */
export function createScoreCounter(target: string | Element, endValue: number, duration = 2000) {
  const obj = { value: 0 };
  const el = typeof target === 'string' ? document.querySelector(target) : target;
  
  return anime({
    targets: obj,
    value: endValue,
    duration,
    round: 1,
    easing: 'easeOutExpo',
    update: () => {
      if (el) {
        el.textContent = String(Math.round(obj.value));
      }
    },
  });
}

/**
 * Progress bar animation
 */
export function createProgressBar(target: string | Element, percentage: number, duration = 1500) {
  return anime({
    targets: target,
    width: `${percentage}%`,
    duration,
    easing: 'easeOutExpo',
  });
}

/**
 * Card entrance animation with 3D effect
 */
export function createCardEntrance(targets: string | Element | Element[] | NodeList, options?: Partial<AnimationConfig>) {
  const startDelay = typeof options?.delay === 'number' ? options.delay : 0;
  return anime({
    targets,
    opacity: [0, 1],
    translateY: [50, 0],
    rotateX: [15, 0],
    duration: options?.duration || 800,
    delay: anime.stagger(150, { start: startDelay }),
    easing: 'easeOutBack',
  });
}

/**
 * Typing text effect
 */
export function createTypewriterEffect(target: string | Element, text: string, speed = 50) {
  const el = typeof target === 'string' ? document.querySelector(target) : target;
  if (!el) return null;
  
  el.textContent = '';
  let currentIndex = 0;
  
  const timeline = anime.timeline({
    loop: false,
  });
  
  for (let i = 0; i < text.length; i++) {
    timeline.add({
      duration: speed,
      complete: () => {
        currentIndex++;
        el.textContent = text.substring(0, currentIndex);
      },
    });
  }
  
  return timeline;
}

/**
 * Ripple effect on click
 */
export function createRippleEffect(event: MouseEvent, color = 'rgba(255, 255, 255, 0.3)') {
  const button = event.currentTarget as HTMLElement;
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
}

/**
 * Morphing background gradient
 */
export function createMorphingGradient(target: string | Element) {
  return anime({
    targets: target,
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

/**
 * Particle explosion effect
 */
export function createParticleExplosion(x: number, y: number, container: Element, particleCount = 20) {
  const particles: HTMLElement[] = [];
  
  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('div');
    particle.className = 'absolute w-2 h-2 rounded-full';
    particle.style.cssText = `
      left: ${x}px;
      top: ${y}px;
      background: ${['#f97316', '#06b6d4', '#ec4899', '#10b981'][i % 4]};
      pointer-events: none;
    `;
    container.appendChild(particle);
    particles.push(particle);
  }
  
  anime({
    targets: particles,
    translateX: () => anime.random(-150, 150),
    translateY: () => anime.random(-150, 150),
    scale: [1, 0],
    opacity: [1, 0],
    duration: 1000,
    easing: 'easeOutExpo',
    complete: () => particles.forEach(p => p.remove()),
  });
}

/**
 * Smooth tab transition
 */
export function createTabTransition(outgoing: Element | null, incoming: Element) {
  const timeline = anime.timeline({
    easing: 'easeInOutQuad',
  });
  
  if (outgoing) {
    timeline.add({
      targets: outgoing,
      opacity: [1, 0],
      translateX: [0, -20],
      duration: 200,
    });
  }
  
  timeline.add({
    targets: incoming,
    opacity: [0, 1],
    translateX: [20, 0],
    duration: 300,
  }, outgoing ? '-=100' : 0);
  
  return timeline;
}

/**
 * Glowing border animation
 */
export function createGlowingBorder(target: string | Element) {
  return anime({
    targets: target,
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

/**
 * Number flip animation
 */
export function createNumberFlip(target: Element, from: number, to: number, duration = 1000) {
  const obj = { value: from };
  
  return anime({
    targets: obj,
    value: to,
    round: 1,
    duration,
    easing: 'easeOutExpo',
    update: () => {
      target.textContent = obj.value.toLocaleString();
    },
  });
}

/**
 * Breathing effect for elements
 */
export function createBreathingEffect(target: string | Element) {
  return anime({
    targets: target,
    scale: [1, 1.02, 1],
    opacity: [0.8, 1, 0.8],
    duration: 4000,
    easing: 'easeInOutSine',
    loop: true,
  });
}

/**
 * Magnetic effect for buttons (follows cursor slightly)
 */
export function createMagneticEffect(element: HTMLElement, strength = 0.3) {
  const handleMouseMove = (e: MouseEvent) => {
    const rect = element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const distX = (e.clientX - centerX) * strength;
    const distY = (e.clientY - centerY) * strength;
    
    anime({
      targets: element,
      translateX: distX,
      translateY: distY,
      duration: 300,
      easing: 'easeOutQuad',
    });
  };
  
  const handleMouseLeave = () => {
    anime({
      targets: element,
      translateX: 0,
      translateY: 0,
      duration: 600,
      easing: 'easeOutElastic(1, 0.5)',
    });
  };
  
  element.addEventListener('mousemove', handleMouseMove);
  element.addEventListener('mouseleave', handleMouseLeave);
  
  return () => {
    element.removeEventListener('mousemove', handleMouseMove);
    element.removeEventListener('mouseleave', handleMouseLeave);
  };
}

/**
 * Wave text animation
 */
export function createWaveText(target: string | Element) {
  const el = typeof target === 'string' ? document.querySelector(target) : target;
  if (!el) return null;
  
  const text = el.textContent || '';
  el.innerHTML = '';
  
  text.split('').forEach((char, i) => {
    const span = document.createElement('span');
    span.textContent = char === ' ' ? '\u00A0' : char;
    span.style.display = 'inline-block';
    el.appendChild(span);
  });
  
  return anime({
    targets: el.querySelectorAll('span'),
    translateY: [0, -10, 0],
    delay: anime.stagger(50),
    duration: 600,
    loop: true,
    direction: 'alternate',
    easing: 'easeInOutSine',
  });
}

/**
 * Loading spinner with gradient
 */
export function createLoadingSpinner(target: string | Element) {
  return anime({
    targets: target,
    rotate: '1turn',
    duration: 1000,
    easing: 'linear',
    loop: true,
  });
}

/**
 * Success checkmark animation
 */
export function createSuccessCheck(svgPath: Element) {
  return anime({
    targets: svgPath,
    strokeDashoffset: [anime.setDashoffset, 0],
    duration: 800,
    easing: 'easeOutQuart',
  });
}

// Export anime for direct use when needed
export { default as anime } from 'animejs';
