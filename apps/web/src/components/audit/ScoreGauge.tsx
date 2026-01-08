/**
 * Advanced Score Gauge Component
 * Beautiful circular progress indicator with grade
 */

'use client';

import { useEffect, useState } from 'react';

interface ScoreGaugeProps {
  score: number;
  grade: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showLabel?: boolean;
  animated?: boolean;
}

export function ScoreGauge({ score, grade, size = 'lg', showLabel = true, animated = true }: ScoreGaugeProps) {
  const [displayScore, setDisplayScore] = useState(animated ? 0 : score);
  
  const sizes = {
    sm: { width: 80, stroke: 6, fontSize: 'text-lg sm:text-xl', gradeSize: 'text-[10px] sm:text-xs' },
    md: { width: 120, stroke: 8, fontSize: 'text-2xl sm:text-3xl', gradeSize: 'text-xs sm:text-sm' },
    lg: { width: 150, stroke: 8, fontSize: 'text-3xl sm:text-4xl', gradeSize: 'text-sm sm:text-base' },
    xl: { width: 200, stroke: 10, fontSize: 'text-4xl sm:text-5xl', gradeSize: 'text-base sm:text-lg' },
  };
  
  const { width, stroke, fontSize, gradeSize } = sizes[size];
  const radius = (width - stroke) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (displayScore / 100) * circumference;
  
  // Color based on score
  const getColor = (s: number) => {
    if (s >= 90) return { primary: '#10b981', secondary: '#34d399', glow: 'rgba(16, 185, 129, 0.4)' };
    if (s >= 70) return { primary: '#06b6d4', secondary: '#22d3ee', glow: 'rgba(6, 182, 212, 0.4)' };
    if (s >= 50) return { primary: '#f59e0b', secondary: '#fbbf24', glow: 'rgba(245, 158, 11, 0.4)' };
    return { primary: '#ef4444', secondary: '#f87171', glow: 'rgba(239, 68, 68, 0.4)' };
  };
  
  const colors = getColor(score);
  
  useEffect(() => {
    if (!animated) return;
    
    const duration = 1500;
    const steps = 60;
    const increment = score / steps;
    let current = 0;
    
    const timer = setInterval(() => {
      current += increment;
      if (current >= score) {
        setDisplayScore(score);
        clearInterval(timer);
      } else {
        setDisplayScore(Math.floor(current));
      }
    }, duration / steps);
    
    return () => clearInterval(timer);
  }, [score, animated]);
  
  return (
    <div className="relative inline-flex items-center justify-center">
      {/* Glow effect */}
      <div 
        className="absolute inset-0 blur-xl opacity-30"
        style={{ 
          background: `radial-gradient(circle, ${colors.glow} 0%, transparent 70%)`,
          transform: 'scale(1.2)'
        }}
      />
      
      <svg width={width} height={width} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={width / 2}
          cy={width / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={stroke}
          className="text-zinc-800"
        />
        
        {/* Progress circle with gradient */}
        <defs>
          <linearGradient id={`scoreGradient-${size}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={colors.primary} />
            <stop offset="100%" stopColor={colors.secondary} />
          </linearGradient>
        </defs>
        
        <circle
          cx={width / 2}
          cy={width / 2}
          r={radius}
          fill="none"
          stroke={`url(#scoreGradient-${size})`}
          strokeWidth={stroke}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
          style={{ filter: `drop-shadow(0 0 8px ${colors.glow})` }}
        />
      </svg>
      
      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={`${fontSize} font-bold text-white tabular-nums`}>
          {displayScore}
        </span>
        {showLabel && (
          <>
            <span className="text-xs text-zinc-500 uppercase tracking-wider mt-1">SEO Score</span>
            <span 
              className={`${gradeSize} font-bold mt-2 px-3 py-1 rounded-full`}
              style={{ 
                background: `linear-gradient(135deg, ${colors.primary}20, ${colors.secondary}20)`,
                color: colors.primary,
                border: `1px solid ${colors.primary}40`
              }}
            >
              Grade {grade}
            </span>
          </>
        )}
      </div>
    </div>
  );
}
