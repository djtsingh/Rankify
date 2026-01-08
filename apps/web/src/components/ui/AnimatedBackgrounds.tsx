/**
 * Animated Background Particles
 * Creates floating particles for visual interest
 */

'use client';

import { useEffect, useRef, useState } from 'react';
import anime from 'animejs';

interface ParticleProps {
  count?: number;
  colors?: string[];
  minSize?: number;
  maxSize?: number;
  minDuration?: number;
  maxDuration?: number;
}

export function FloatingParticles({
  count = 20,
  colors = ['#f97316', '#06b6d4', '#ec4899', '#10b981'],
  minSize = 4,
  maxSize = 8,
  minDuration = 3000,
  maxDuration = 6000,
}: ParticleProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [particles, setParticles] = useState<Array<{
    id: number;
    x: number;
    y: number;
    size: number;
    color: string;
    duration: number;
  }>>([]);

  useEffect(() => {
    // Generate particles
    const newParticles = Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: minSize + Math.random() * (maxSize - minSize),
      color: colors[Math.floor(Math.random() * colors.length)],
      duration: minDuration + Math.random() * (maxDuration - minDuration),
    }));
    setParticles(newParticles);
  }, [count, colors, minSize, maxSize, minDuration, maxDuration]);

  useEffect(() => {
    if (containerRef.current && particles.length > 0) {
      const particleElements = containerRef.current.querySelectorAll('.particle');
      
      particleElements.forEach((particle, i) => {
        anime({
          targets: particle,
          translateY: [
            { value: -20, duration: particles[i].duration / 2 },
            { value: 0, duration: particles[i].duration / 2 },
          ],
          translateX: [
            { value: anime.random(-10, 10), duration: particles[i].duration / 2 },
            { value: 0, duration: particles[i].duration / 2 },
          ],
          opacity: [
            { value: 0.8, duration: particles[i].duration / 4 },
            { value: 0.4, duration: particles[i].duration / 2 },
            { value: 0.8, duration: particles[i].duration / 4 },
          ],
          easing: 'easeInOutSine',
          loop: true,
          delay: Math.random() * 2000,
        });
      });
    }
  }, [particles]);

  return (
    <div ref={containerRef} className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="particle absolute rounded-full opacity-50"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            backgroundColor: particle.color,
            filter: 'blur(1px)',
          }}
        />
      ))}
    </div>
  );
}

/**
 * Animated Grid Background
 * Creates a subtle animated grid pattern
 */
export function AnimatedGrid() {
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (gridRef.current) {
      anime({
        targets: gridRef.current,
        backgroundPosition: ['0% 0%', '100% 100%'],
        duration: 30000,
        easing: 'linear',
        loop: true,
      });
    }
  }, []);

  return (
    <div
      ref={gridRef}
      className="absolute inset-0 pointer-events-none"
      style={{
        backgroundImage: `
          linear-gradient(rgba(249, 115, 22, 0.03) 1px, transparent 1px),
          linear-gradient(90deg, rgba(249, 115, 22, 0.03) 1px, transparent 1px)
        `,
        backgroundSize: '50px 50px',
      }}
    />
  );
}

/**
 * Gradient Orbs
 * Animated floating gradient orbs for hero sections
 */
export function GradientOrbs() {
  const orbsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (orbsRef.current) {
      const orbs = orbsRef.current.querySelectorAll('.orb');
      
      orbs.forEach((orb, i) => {
        anime({
          targets: orb,
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
          duration: 4000 + i * 1000,
          easing: 'easeInOutSine',
          loop: true,
        });
      });
    }
  }, []);

  return (
    <div ref={orbsRef} className="absolute inset-0 overflow-hidden pointer-events-none">
      <div 
        className="orb absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-coral/20 rounded-full blur-[120px]"
      />
      <div 
        className="orb absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-cyan/15 rounded-full blur-[100px]"
      />
      <div 
        className="orb absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-pink/10 rounded-full blur-[150px]"
      />
    </div>
  );
}

/**
 * Pulse Ring Animation
 * Creates expanding rings from a center point
 */
interface PulseRingProps {
  size?: number;
  color?: string;
  duration?: number;
}

export function PulseRing({ 
  size = 100, 
  color = 'rgba(6, 182, 212, 0.3)', 
  duration = 2000 
}: PulseRingProps) {
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ringRef.current) {
      anime({
        targets: ringRef.current,
        scale: [1, 2],
        opacity: [0.6, 0],
        duration,
        easing: 'easeOutQuad',
        loop: true,
      });
    }
  }, [duration]);

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      <div
        ref={ringRef}
        className="rounded-full border-2"
        style={{
          width: `${size}px`,
          height: `${size}px`,
          borderColor: color,
        }}
      />
    </div>
  );
}

/**
 * Spotlight Effect
 * Creates a spotlight that follows user interaction
 */
export function SpotlightEffect() {
  const spotlightRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (spotlightRef.current) {
        anime({
          targets: spotlightRef.current,
          left: e.clientX,
          top: e.clientY,
          duration: 300,
          easing: 'easeOutQuad',
        });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div
      ref={spotlightRef}
      className="fixed pointer-events-none -translate-x-1/2 -translate-y-1/2 z-0 mix-blend-overlay"
      style={{
        width: '600px',
        height: '600px',
        background: 'radial-gradient(circle, rgba(249, 115, 22, 0.08) 0%, transparent 50%)',
      }}
    />
  );
}
