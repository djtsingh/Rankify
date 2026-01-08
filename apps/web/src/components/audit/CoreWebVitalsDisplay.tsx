/**
 * Core Web Vitals Display Component
 * Real-time visualization of Google's Core Web Vitals
 */

'use client';

import { Activity, Zap, Move, MousePointer, Server, Eye } from 'lucide-react';
import type { CoreWebVitals } from '@/lib/types/seo-audit';

interface CoreWebVitalsDisplayProps {
  vitals: CoreWebVitals;
}

export function CoreWebVitalsDisplay({ vitals }: CoreWebVitalsDisplayProps) {
  const metrics = [
    { 
      key: 'lcp', 
      label: 'Largest Contentful Paint', 
      abbr: 'LCP',
      icon: Eye,
      value: vitals.lcp.value, 
      unit: 's',
      target: vitals.lcp.target,
      rating: vitals.lcp.rating,
      description: 'Measures loading performance. Target: <2.5s'
    },
    { 
      key: 'fid', 
      label: 'First Input Delay', 
      abbr: 'FID',
      icon: MousePointer,
      value: vitals.fid.value, 
      unit: 'ms',
      target: vitals.fid.target,
      rating: vitals.fid.rating,
      description: 'Measures interactivity. Target: <100ms'
    },
    { 
      key: 'cls', 
      label: 'Cumulative Layout Shift', 
      abbr: 'CLS',
      icon: Move,
      value: vitals.cls.value, 
      unit: '',
      target: vitals.cls.target,
      rating: vitals.cls.rating,
      description: 'Measures visual stability. Target: <0.1'
    },
    { 
      key: 'inp', 
      label: 'Interaction to Next Paint', 
      abbr: 'INP',
      icon: Zap,
      value: vitals.inp.value, 
      unit: 'ms',
      target: vitals.inp.target,
      rating: vitals.inp.rating,
      description: 'Measures responsiveness. Target: <200ms'
    },
    { 
      key: 'ttfb', 
      label: 'Time to First Byte', 
      abbr: 'TTFB',
      icon: Server,
      value: vitals.ttfb.value, 
      unit: 'ms',
      target: vitals.ttfb.target,
      rating: vitals.ttfb.rating,
      description: 'Measures server response. Target: <800ms'
    },
    { 
      key: 'fcp', 
      label: 'First Contentful Paint', 
      abbr: 'FCP',
      icon: Activity,
      value: vitals.fcp.value, 
      unit: 's',
      target: vitals.fcp.target,
      rating: vitals.fcp.rating,
      description: 'Measures initial render. Target: <1.8s'
    },
  ];
  
  const getRatingStyles = (rating: string) => {
    switch (rating) {
      case 'good':
        return { 
          bg: 'bg-emerald-500/10', 
          border: 'border-emerald-500/30', 
          text: 'text-emerald-400',
          badge: 'bg-emerald-500/20 text-emerald-400',
          glow: 'shadow-emerald-500/20'
        };
      case 'needs-improvement':
        return { 
          bg: 'bg-amber-500/10', 
          border: 'border-amber-500/30', 
          text: 'text-amber-400',
          badge: 'bg-amber-500/20 text-amber-400',
          glow: 'shadow-amber-500/20'
        };
      default:
        return { 
          bg: 'bg-red-500/10', 
          border: 'border-red-500/30', 
          text: 'text-red-400',
          badge: 'bg-red-500/20 text-red-400',
          glow: 'shadow-red-500/20'
        };
    }
  };
  
  const passCount = metrics.filter(m => m.rating === 'good').length;
  
  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Summary header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 sm:p-4 bg-zinc-900/50 rounded-xl border border-zinc-800">
        <div className="flex items-center gap-3">
          <div className="p-1.5 sm:p-2 bg-gradient-to-br from-cyan-500/20 to-emerald-500/20 rounded-lg">
            <Activity className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-400" />
          </div>
          <div>
            <h3 className="text-white font-semibold text-sm sm:text-base">Core Web Vitals</h3>
            <p className="text-xs sm:text-sm text-zinc-500">Google's page experience signals</p>
          </div>
        </div>
        
        <div className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg font-semibold text-sm sm:text-base self-start sm:self-auto ${passCount >= 4 ? 'bg-emerald-500/20 text-emerald-400' : passCount >= 2 ? 'bg-amber-500/20 text-amber-400' : 'bg-red-500/20 text-red-400'}`}>
          {passCount}/6 Passed
        </div>
      </div>
      
      {/* Metrics grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {metrics.map((metric) => {
          const styles = getRatingStyles(metric.rating);
          const Icon = metric.icon;
          const percentage = Math.min(100, (metric.value / (metric.target * 2)) * 100);
          
          return (
            <div 
              key={metric.key}
              className={`p-3 sm:p-5 rounded-xl ${styles.bg} border ${styles.border} hover:shadow-lg ${styles.glow} transition-all duration-300 group`}
            >
              <div className="flex items-start justify-between mb-3 sm:mb-4">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className={`p-1.5 sm:p-2 rounded-lg bg-zinc-900/50 ${styles.text}`}>
                    <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </div>
                  <div>
                    <span className="text-white font-bold text-sm sm:text-lg">{metric.abbr}</span>
                    <p className="text-[10px] sm:text-xs text-zinc-500 hidden sm:group-hover:block">{metric.label}</p>
                  </div>
                </div>
                
                <span className={`px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-md text-[10px] sm:text-xs font-medium ${styles.badge}`}>
                  {metric.rating === 'good' ? 'Good' : metric.rating === 'needs-improvement' ? 'Needs Work' : 'Poor'}
                </span>
              </div>
              
              <div className="space-y-2 sm:space-y-3">
                <div className="flex items-baseline gap-1.5 sm:gap-2 flex-wrap">
                  <span className={`text-xl sm:text-3xl font-bold ${styles.text}`}>
                    {metric.value}
                  </span>
                  <span className="text-zinc-500 text-xs sm:text-sm">{metric.unit}</span>
                  <span className="text-zinc-600 text-[10px] sm:text-sm ml-auto">Target: {metric.target}{metric.unit}</span>
                </div>
                
                {/* Visual bar */}
                <div className="relative h-1.5 sm:h-2 bg-zinc-800 rounded-full overflow-hidden">
                  <div 
                    className={`absolute left-0 top-0 h-full rounded-full transition-all duration-500 ${
                      metric.rating === 'good' ? 'bg-gradient-to-r from-emerald-500 to-emerald-400' :
                      metric.rating === 'needs-improvement' ? 'bg-gradient-to-r from-amber-500 to-amber-400' :
                      'bg-gradient-to-r from-red-500 to-red-400'
                    }`}
                    style={{ width: `${Math.min(100, percentage)}%` }}
                  />
                  {/* Target line */}
                  <div 
                    className="absolute top-0 w-0.5 h-full bg-white/50"
                    style={{ left: '50%' }}
                  />
                </div>
                
                <p className="text-[10px] sm:text-xs text-zinc-500 line-clamp-2">{metric.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
