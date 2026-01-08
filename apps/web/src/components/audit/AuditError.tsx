/**
 * Error state component for audit failures
 */

'use client';

import { AlertCircle, RefreshCw, Home } from 'lucide-react';

interface AuditErrorProps {
  error: string;
  onRetry: () => void;
  onReset: () => void;
}

export function AuditError({ error, onRetry, onReset }: AuditErrorProps) {
  return (
    <div className="w-full">
      <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-8 lg:p-10">
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 rounded-full bg-red-500/20 flex items-center justify-center">
            <AlertCircle className="w-10 h-10 text-red-500" />
          </div>
        </div>

        {/* Content */}
        <div className="text-center mb-8">
          <h3 className="text-2xl lg:text-3xl font-bold text-white mb-3">
            Audit Failed
          </h3>
          <p className="text-slate-400 max-w-md mx-auto">
            {error}
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={onRetry}
            className="px-8 py-4 bg-gradient-to-r from-coral to-pink hover:shadow-xl hover:shadow-coral/30 rounded-xl text-white font-semibold transition-all flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-5 h-5" />
            Try Again
          </button>
          <button
            onClick={onReset}
            className="px-8 py-4 bg-zinc-800 hover:bg-zinc-700 rounded-xl text-white font-semibold transition-all flex items-center justify-center gap-2"
          >
            <Home className="w-5 h-5" />
            Start Over
          </button>
        </div>

        {/* Help Text */}
        <div className="mt-8 pt-6 border-t border-red-500/20">
          <p className="text-sm text-slate-500 text-center">
            Common issues: Invalid URL, website is down, or blocked by robots.txt
          </p>
        </div>
      </div>
    </div>
  );
}
