/**
 * Loading state during audit scanning
 */

'use client';

import { Loader2, Sparkles } from 'lucide-react';

interface AuditProgressProps {
  progress: number;
  currentStep: string;
  url?: string;
}

export function AuditProgress({ progress, currentStep, url }: AuditProgressProps) {
  return (
    <div className="w-full">
      <div className="bg-zinc-900/50 backdrop-blur-sm rounded-2xl p-8 lg:p-10 border border-zinc-800">
        {/* Icon */}
        <div className="flex justify-center mb-8">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-coral via-pink to-cyan rounded-full blur-2xl opacity-50 animate-pulse" />
            <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-coral to-pink flex items-center justify-center shadow-2xl">
              <Loader2 className="w-12 h-12 text-white animate-spin" />
            </div>
          </div>
        </div>

        {/* Title */}
        <div className="text-center mb-8">
          <h3 className="text-2xl lg:text-3xl font-bold text-white mb-3">
            Analyzing Your Website
          </h3>
          {url && (
            <p className="text-slate-400 text-sm lg:text-base break-all">
              {url}
            </p>
          )}
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-slate-400">{currentStep}</span>
            <span className="text-sm font-semibold text-white">{Math.round(progress)}%</span>
          </div>
          
          <div className="h-3 bg-zinc-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-coral via-pink to-cyan rounded-full transition-all duration-500 ease-out relative"
              style={{ width: `${progress}%` }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent animate-pulse" />
            </div>
          </div>
        </div>

        {/* Status Messages */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatusItem icon="🔍" label="Scanning" active={progress < 30} />
          <StatusItem icon="📊" label="Analyzing" active={progress >= 30 && progress < 60} />
          <StatusItem icon="🎯" label="Scoring" active={progress >= 60 && progress < 90} />
          <StatusItem icon="✨" label="Finalizing" active={progress >= 90} />
        </div>

        {/* Bottom Message */}
        <div className="mt-8 text-center">
          <p className="text-sm text-slate-500 flex items-center justify-center gap-2">
            <Sparkles className="w-4 h-4 text-coral" />
            <span>Checking 50+ SEO factors across your website...</span>
          </p>
        </div>
      </div>
    </div>
  );
}

interface StatusItemProps {
  icon: string;
  label: string;
  active: boolean;
}

function StatusItem({ icon, label, active }: StatusItemProps) {
  return (
    <div className={`flex flex-col items-center gap-2 p-3 rounded-lg transition-all ${
      active
        ? 'bg-coral/10 border border-coral/30'
        : 'bg-zinc-800/50 border border-zinc-800'
    }`}>
      <span className="text-2xl">{icon}</span>
      <span className={`text-xs font-medium ${active ? 'text-coral' : 'text-slate-500'}`}>
        {label}
      </span>
    </div>
  );
}
