/**
 * Category Score Card Component
 * Displays individual category scores with visual indicators
 */

'use client';

import { LucideIcon } from 'lucide-react';
import { ReactNode } from 'react';

interface CategoryScoreProps {
  title: string;
  score: number;
  icon: LucideIcon | ReactNode;
  description?: string;
  trend?: 'up' | 'down' | 'stable';
  trendValue?: number;
}

export function CategoryScoreCard({ title, score, icon, description, trend, trendValue }: CategoryScoreProps) {
  const getScoreColor = (s: number) => {
    if (s >= 90) return { bg: 'from-emerald-500/20 to-emerald-600/10', border: 'border-emerald-500/30', text: 'text-emerald-400', bar: 'from-emerald-500 to-emerald-400' };
    if (s >= 70) return { bg: 'from-cyan-500/20 to-cyan-600/10', border: 'border-cyan-500/30', text: 'text-cyan-400', bar: 'from-cyan-500 to-cyan-400' };
    if (s >= 50) return { bg: 'from-amber-500/20 to-amber-600/10', border: 'border-amber-500/30', text: 'text-amber-400', bar: 'from-amber-500 to-amber-400' };
    return { bg: 'from-red-500/20 to-red-600/10', border: 'border-red-500/30', text: 'text-red-400', bar: 'from-red-500 to-red-400' };
  };
  
  const colors = getScoreColor(score);
  
  // Check if icon is a component or already a React element
  const isComponent = typeof icon === 'function';
  const Icon = isComponent ? (icon as LucideIcon) : null;
  
  // Render icon based on its type
  const renderIcon = () => {
    if (Icon) {
      return <Icon className="w-4 h-4 sm:w-5 sm:h-5" />;
    }
    return icon as ReactNode;
  };
  
  return (
    <div className={`relative group p-3 sm:p-5 rounded-xl sm:rounded-2xl bg-gradient-to-br ${colors.bg} border ${colors.border} backdrop-blur-sm hover:scale-[1.02] transition-all duration-300`}>
      {/* Glow on hover */}
      <div className={`absolute inset-0 rounded-xl sm:rounded-2xl bg-gradient-to-br ${colors.bg} opacity-0 group-hover:opacity-50 blur-xl transition-opacity`} />
      
      <div className="relative">
        <div className="flex items-start justify-between mb-2 sm:mb-4">
          <div className={`p-1.5 sm:p-2.5 rounded-lg sm:rounded-xl bg-zinc-900/50 ${colors.text}`}>
            {renderIcon()}
          </div>
          
          <div className="text-right">
            <span className={`text-xl sm:text-3xl font-bold ${colors.text}`}>{score}</span>
            <span className="text-zinc-500 text-xs sm:text-sm">/100</span>
          </div>
        </div>
        
        <h3 className="text-white font-semibold text-sm sm:text-base mb-0.5 sm:mb-1">{title}</h3>
        {description && (
          <p className="text-zinc-500 text-[10px] sm:text-xs mb-2 sm:mb-3 line-clamp-1">{description}</p>
        )}
        
        {/* Progress bar */}
        <div className="h-1 sm:h-1.5 bg-zinc-800 rounded-full overflow-hidden">
          <div 
            className={`h-full bg-gradient-to-r ${colors.bar} rounded-full transition-all duration-1000`}
            style={{ width: `${score}%` }}
          />
        </div>
        
        {/* Trend indicator */}
        {trend && trendValue && (
          <div className="flex items-center gap-1 mt-1.5 sm:mt-2">
            <span className={`text-[10px] sm:text-xs ${trend === 'up' ? 'text-emerald-400' : trend === 'down' ? 'text-red-400' : 'text-zinc-500'}`}>
              {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→'} {trendValue}%
            </span>
            <span className="text-[10px] sm:text-xs text-zinc-600 hidden sm:inline">vs last scan</span>
          </div>
        )}
      </div>
    </div>
  );
}
