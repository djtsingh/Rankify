/**
 * Performance Metrics Component
 * Visualizes detailed performance data
 */

'use client';

import { 
  Gauge, Clock, Server, FileCode, Image, Code2, 
  Package, Wifi, Database, ArrowDown
} from 'lucide-react';
import type { PerformanceMetrics } from '@/lib/types/seo-audit';

interface PerformanceMetricsDisplayProps {
  metrics: PerformanceMetrics;
}

export function PerformanceMetricsDisplay({ metrics }: PerformanceMetricsDisplayProps) {
  const formatBytes = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };
  
  const formatTime = (ms: number) => {
    if (ms < 1000) return `${ms}ms`;
    return `${(ms / 1000).toFixed(2)}s`;
  };
  
  // Timing metrics
  const timingMetrics = [
    { label: 'Page Load Time', value: metrics.pageLoadTime, icon: Clock, target: 3000 },
    { label: 'DOM Content Loaded', value: metrics.domContentLoaded, icon: Code2, target: 1500 },
    { label: 'Fully Loaded', value: metrics.fullyLoaded, icon: Gauge, target: 4000 },
    { label: 'Speed Index', value: metrics.speedIndex, icon: Gauge, target: 3400 },
    { label: 'Time to Interactive', value: metrics.timeToInteractive, icon: Clock, target: 3800 },
    { label: 'Total Blocking Time', value: metrics.totalBlockingTime, icon: Server, target: 300 },
    { label: 'Server Response', value: metrics.serverResponseTime, icon: Server, target: 600 },
  ];
  
  // Resource breakdown
  const resources = [
    { label: 'HTML', value: metrics.htmlSize, icon: FileCode, color: 'from-blue-500 to-blue-400' },
    { label: 'CSS', value: metrics.cssSize, icon: Code2, color: 'from-purple-500 to-purple-400' },
    { label: 'JavaScript', value: metrics.jsSize, icon: FileCode, color: 'from-amber-500 to-amber-400' },
    { label: 'Images', value: metrics.imageSize, icon: Image, color: 'from-emerald-500 to-emerald-400' },
    { label: 'Fonts', value: metrics.fontSize, icon: Code2, color: 'from-pink-500 to-pink-400' },
    { label: 'Third-Party', value: metrics.thirdPartySize, icon: Package, color: 'from-red-500 to-red-400' },
  ];
  
  const totalSize = resources.reduce((sum, r) => sum + r.value, 0);
  
  return (
    <div className="space-y-8">
      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-5 bg-gradient-to-br from-cyan-500/10 to-cyan-600/5 border border-cyan-500/20 rounded-xl">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-4 h-4 text-cyan-400" />
            <span className="text-xs text-zinc-500">Load Time</span>
          </div>
          <span className="text-2xl font-bold text-white">{formatTime(metrics.pageLoadTime)}</span>
        </div>
        
        <div className="p-5 bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 border border-emerald-500/20 rounded-xl">
          <div className="flex items-center gap-2 mb-2">
            <Database className="w-4 h-4 text-emerald-400" />
            <span className="text-xs text-zinc-500">Page Size</span>
          </div>
          <span className="text-2xl font-bold text-white">{formatBytes(metrics.totalPageSize)}</span>
        </div>
        
        <div className="p-5 bg-gradient-to-br from-amber-500/10 to-amber-600/5 border border-amber-500/20 rounded-xl">
          <div className="flex items-center gap-2 mb-2">
            <Package className="w-4 h-4 text-amber-400" />
            <span className="text-xs text-zinc-500">Resources</span>
          </div>
          <span className="text-2xl font-bold text-white">{metrics.resourceCount}</span>
        </div>
        
        <div className="p-5 bg-gradient-to-br from-purple-500/10 to-purple-600/5 border border-purple-500/20 rounded-xl">
          <div className="flex items-center gap-2 mb-2">
            <Wifi className="w-4 h-4 text-purple-400" />
            <span className="text-xs text-zinc-500">Cache Hit</span>
          </div>
          <span className="text-2xl font-bold text-white">{(metrics.cacheHitRatio * 100).toFixed(0)}%</span>
        </div>
      </div>
      
      {/* Timing Waterfall */}
      <div className="p-6 bg-zinc-900/50 border border-zinc-800 rounded-xl">
        <h3 className="text-white font-semibold mb-6 flex items-center gap-2">
          <Gauge className="w-5 h-5 text-cyan-400" />
          Loading Timeline
        </h3>
        
        <div className="space-y-4">
          {timingMetrics.map((metric) => {
            const Icon = metric.icon;
            const percentage = Math.min(100, (metric.value / metric.target) * 100);
            const isGood = metric.value <= metric.target;
            
            return (
              <div key={metric.label} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <Icon className="w-4 h-4 text-zinc-500" />
                    <span className="text-zinc-400">{metric.label}</span>
                  </div>
                  <span className={`font-medium ${isGood ? 'text-emerald-400' : 'text-amber-400'}`}>
                    {formatTime(metric.value)}
                  </span>
                </div>
                
                <div className="relative h-2 bg-zinc-800 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-1000 ${
                      isGood 
                        ? 'bg-gradient-to-r from-emerald-500 to-emerald-400' 
                        : percentage > 150 
                          ? 'bg-gradient-to-r from-red-500 to-red-400'
                          : 'bg-gradient-to-r from-amber-500 to-amber-400'
                    }`}
                    style={{ width: `${Math.min(100, percentage)}%` }}
                  />
                  {/* Target marker */}
                  <div 
                    className="absolute top-0 w-0.5 h-full bg-emerald-500"
                    style={{ left: `${Math.min(100, 100)}%` }}
                    title={`Target: ${formatTime(metric.target)}`}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Resource Breakdown */}
      <div className="p-6 bg-zinc-900/50 border border-zinc-800 rounded-xl">
        <h3 className="text-white font-semibold mb-6 flex items-center gap-2">
          <ArrowDown className="w-5 h-5 text-emerald-400" />
          Resource Breakdown
          <span className="ml-auto text-sm text-zinc-500">Total: {formatBytes(totalSize)}</span>
        </h3>
        
        {/* Stacked bar chart */}
        <div className="h-8 bg-zinc-800 rounded-full overflow-hidden flex mb-6">
          {resources.map((resource) => {
            const percentage = (resource.value / totalSize) * 100;
            if (percentage < 1) return null;
            
            return (
              <div
                key={resource.label}
                className={`h-full bg-gradient-to-r ${resource.color} relative group`}
                style={{ width: `${percentage}%` }}
              >
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-xs font-medium text-white drop-shadow-lg">
                    {resource.label}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Legend */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {resources.map((resource) => {
            const Icon = resource.icon;
            const percentage = ((resource.value / totalSize) * 100).toFixed(1);
            
            return (
              <div key={resource.label} className="flex items-center gap-3 p-3 bg-zinc-800/50 rounded-lg">
                <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${resource.color}`} />
                <div className="flex-1">
                  <div className="flex items-center gap-1.5">
                    <Icon className="w-3.5 h-3.5 text-zinc-500" />
                    <span className="text-sm text-zinc-400">{resource.label}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-white font-medium">{formatBytes(resource.value)}</span>
                    <span className="text-xs text-zinc-600">({percentage}%)</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Compression Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-5 bg-zinc-900/50 border border-zinc-800 rounded-xl">
          <h4 className="text-sm text-zinc-500 mb-3">Compression Ratio</h4>
          <div className="flex items-center gap-4">
            <div className="relative w-16 h-16">
              <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  className="text-zinc-800"
                />
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="url(#compressionGradient)"
                  strokeWidth="3"
                  strokeDasharray={`${metrics.compressionRatio * 100}, 100`}
                  strokeLinecap="round"
                />
                <defs>
                  <linearGradient id="compressionGradient">
                    <stop offset="0%" stopColor="#06b6d4" />
                    <stop offset="100%" stopColor="#10b981" />
                  </linearGradient>
                </defs>
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-lg font-bold text-white">
                {(metrics.compressionRatio * 100).toFixed(0)}%
              </span>
            </div>
            <div>
              <p className="text-white font-medium">Resources Compressed</p>
              <p className="text-xs text-zinc-500">Using GZIP/Brotli compression</p>
            </div>
          </div>
        </div>
        
        <div className="p-5 bg-zinc-900/50 border border-zinc-800 rounded-xl">
          <h4 className="text-sm text-zinc-500 mb-3">Cache Performance</h4>
          <div className="flex items-center gap-4">
            <div className="relative w-16 h-16">
              <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  className="text-zinc-800"
                />
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="url(#cacheGradient)"
                  strokeWidth="3"
                  strokeDasharray={`${metrics.cacheHitRatio * 100}, 100`}
                  strokeLinecap="round"
                />
                <defs>
                  <linearGradient id="cacheGradient">
                    <stop offset="0%" stopColor="#f59e0b" />
                    <stop offset="100%" stopColor="#10b981" />
                  </linearGradient>
                </defs>
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-lg font-bold text-white">
                {(metrics.cacheHitRatio * 100).toFixed(0)}%
              </span>
            </div>
            <div>
              <p className="text-white font-medium">Cache Hit Ratio</p>
              <p className="text-xs text-zinc-500">Browser caching effectiveness</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
