/**
 * URL input form for website audit
 */

'use client';

import { useState, useEffect } from 'react';
import { Chrome, Search, Sparkles, CheckCircle2 } from 'lucide-react';
import { validateAndNormalizeUrl } from '@/lib/utils/url';

interface AuditFormProps {
  onSubmit: (url: string) => void;
  defaultUrl?: string;
  disabled?: boolean;
  isLoading?: boolean;
}

export function AuditForm({ onSubmit, defaultUrl = '', disabled = false, isLoading = false }: AuditFormProps) {
  const [url, setUrl] = useState(defaultUrl);
  const [error, setError] = useState<string>('');
  const [touched, setTouched] = useState(false);

  useEffect(() => {
    if (defaultUrl && !url) {
      setUrl(defaultUrl);
    }
  }, [defaultUrl, url]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);

    const validation = validateAndNormalizeUrl(url);
    
    if (!validation.valid) {
      setError(validation.error || 'Invalid URL');
      return;
    }

    setError('');
    onSubmit(validation.normalizedUrl!);
  };

  const handleBlur = () => {
    setTouched(true);
    if (url) {
      const validation = validateAndNormalizeUrl(url);
      if (!validation.valid) {
        setError(validation.error || '');
      } else {
        setError('');
      }
    }
  };

  const showError = touched && error;

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="bg-zinc-900/50 backdrop-blur-sm rounded-2xl p-6 lg:p-8 border border-zinc-800 hover:border-zinc-700 transition-all">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-coral to-pink flex items-center justify-center shadow-lg shadow-coral/30">
            <Chrome className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Enter Website URL</h3>
            <p className="text-sm text-slate-400">We'll analyze your website in seconds</p>
          </div>
        </div>

        {/* Input Group */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <div className="relative">
              <input
                type="url"
                value={url}
                onChange={(e) => {
                  setUrl(e.target.value);
                  if (touched) setError('');
                }}
                onBlur={handleBlur}
                placeholder="https://example.com"
                disabled={disabled}
                className={`w-full px-5 py-4 bg-black/50 border rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 transition-all ${
                  showError
                    ? 'border-red-500 focus:ring-red-500/20'
                    : 'border-zinc-800 focus:border-coral focus:ring-coral/20'
                } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2">
                <Globe className="w-5 h-5 text-slate-500" />
              </div>
            </div>
            
            {showError && (
              <p className="mt-2 text-sm text-red-500 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4" />
                {error}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={disabled || !url || isLoading}
            className={`px-8 py-4 rounded-xl font-semibold text-white transition-all flex items-center justify-center gap-2 whitespace-nowrap ${
              disabled || !url || isLoading
                ? 'bg-zinc-800 cursor-not-allowed opacity-50'
                : 'bg-gradient-to-r from-coral to-pink hover:shadow-xl hover:shadow-coral/30 hover:scale-105'
            }`}
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Analyzing...</span>
              </>
            ) : (
              <>
                <Search className="w-5 h-5" />
                <span>Analyze Website</span>
              </>
            )}
          </button>
        </div>

        {/* Features List */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="flex items-center gap-2 text-sm text-slate-400">
            <CheckCircle2 className="w-4 h-4 text-emerald flex-shrink-0" />
            <span>100% Free Analysis</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-400">
            <CheckCircle2 className="w-4 h-4 text-emerald flex-shrink-0" />
            <span>Results in 3-5 Seconds</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-400">
            <CheckCircle2 className="w-4 h-4 text-emerald flex-shrink-0" />
            <span>No Signup Required</span>
          </div>
        </div>
      </div>
    </form>
  );
}

// Fix missing import
import { Globe, AlertTriangle } from 'lucide-react';
