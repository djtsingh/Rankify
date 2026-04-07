'use client';

import Link from 'next/link';
import { useAuth, getUserEmail, getUserName } from '@/lib/auth/useAuth';
import { Search, BarChart3, Zap, Clock, TrendingUp, Shield } from 'lucide-react';

export default function DashboardPage() {
  const { user, isLoading, logout } = useAuth();
  
  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="w-12 h-12 rounded-full border-2 border-zinc-800"></div>
            <div className="absolute inset-0 w-12 h-12 rounded-full border-2 border-coral border-t-transparent animate-spin"></div>
          </div>
          <p className="text-zinc-500 text-sm">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  // SWA handles auth at edge, but fallback for safety
  if (!user) {
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
    return null;
  }

  const email = getUserEmail(user);
  const name = getUserName(user);
  const initial = name?.[0] || email?.[0] || 'U';

  return (
    <div className="min-h-screen bg-zinc-950">
      {/* Header */}
      <header className="border-b border-zinc-800/50 bg-zinc-950/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-extrabold text-white tracking-tight group">
            <span className="text-coral group-hover:text-coral-light transition-colors">Rank</span>ify
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-zinc-400 text-sm hidden md:block">
              {email}
            </span>
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-coral to-pink flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-coral/20">
              {initial}
            </div>
            <button
              onClick={() => logout('/')}
              className="text-zinc-400 hover:text-white text-sm transition-colors px-3 py-2 rounded-lg hover:bg-zinc-800/50"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12">
        {/* Welcome Section */}
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald/10 text-emerald rounded-full text-xs font-medium mb-4">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald animate-pulse"></div>
            Dashboard
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
            Welcome back, <span className="text-coral">{name || 'there'}</span>!
          </h1>
          <p className="text-zinc-400 mt-3 text-lg">
            Manage your SEO audits and track your website performance.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-10">
          <StatCard
            icon={<BarChart3 className="w-5 h-5" />}
            title="Total Scans"
            value="0"
            change="+0 this week"
            color="emerald"
          />
          <StatCard
            icon={<Shield className="w-5 h-5" />}
            title="Current Plan"
            value="Free"
            change="Upgrade for more"
            color="coral"
            badge="Free"
          />
          <StatCard
            icon={<Clock className="w-5 h-5" />}
            title="Scan Quota"
            value="5/day"
            change="Resets daily"
            color="cyan"
          />
        </div>

        {/* Quick Actions */}
        <div className="bg-zinc-900/50 rounded-2xl p-6 md:p-8 border border-zinc-800">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">Quick Actions</h2>
            <span className="text-zinc-500 text-sm">Get started</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <ActionCard
              href="/website-audit"
              title="New Scan"
              description="Run a comprehensive SEO audit"
              icon={<Search className="w-6 h-6" />}
              color="coral"
              primary
            />
            <ActionCard
              href="/dashboard/history"
              title="View History"
              description="See your past scans and reports"
              icon={<TrendingUp className="w-6 h-6" />}
              color="emerald"
            />
            <ActionCard
              href="/pricing"
              title="Upgrade Plan"
              description="Get unlimited scans with Pro"
              icon={<Zap className="w-6 h-6" />}
              color="cyan"
            />
          </div>
        </div>

        {/* Recent Activity - Empty State */}
        <div className="mt-10 bg-zinc-900/30 rounded-2xl p-8 md:p-12 border border-zinc-800/50 text-center">
          <div className="w-16 h-16 rounded-full bg-zinc-800 flex items-center justify-center mx-auto mb-6">
            <Search className="w-8 h-8 text-zinc-600" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">No scans yet</h3>
          <p className="text-zinc-500 mb-6 max-w-md mx-auto">
            Run your first SEO audit to see detailed insights and recommendations for your website.
          </p>
          <Link
            href="/website-audit"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-coral to-pink text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-coral/20 transition-all duration-200 hover:-translate-y-0.5"
          >
            <Search className="w-4 h-4" />
            Start Your First Scan
          </Link>
        </div>
      </main>
    </div>
  );
}

function StatCard({ 
  icon, 
  title, 
  value, 
  change, 
  color,
  badge 
}: { 
  icon: React.ReactNode;
  title: string; 
  value: string; 
  change: string;
  color: 'emerald' | 'coral' | 'cyan';
  badge?: string;
}) {
  const colorClasses = {
    emerald: 'bg-emerald/10 text-emerald',
    coral: 'bg-coral/10 text-coral',
    cyan: 'bg-cyan/10 text-cyan',
  };

  return (
    <div className="bg-zinc-900/50 rounded-xl p-6 border border-zinc-800 hover:border-zinc-700 transition-colors group">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-10 h-10 rounded-lg ${colorClasses[color]} flex items-center justify-center`}>
          {icon}
        </div>
        {badge && (
          <span className="px-2 py-1 bg-coral/10 text-coral text-xs font-medium rounded-full">
            {badge}
          </span>
        )}
      </div>
      <p className="text-zinc-500 text-sm">{title}</p>
      <p className="text-3xl font-bold text-white mt-1 tracking-tight">{value}</p>
      <p className="text-zinc-600 text-sm mt-2">{change}</p>
    </div>
  );
}

function ActionCard({ 
  href, 
  title, 
  description, 
  icon,
  color,
  primary
}: { 
  href: string; 
  title: string; 
  description: string;
  icon: React.ReactNode;
  color: 'coral' | 'emerald' | 'cyan';
  primary?: boolean;
}) {
  const colorClasses = {
    coral: 'bg-coral/10 text-coral group-hover:bg-coral/20',
    emerald: 'bg-emerald/10 text-emerald group-hover:bg-emerald/20',
    cyan: 'bg-cyan/10 text-cyan group-hover:bg-cyan/20',
  };

  const hoverBorderClasses = {
    coral: 'hover:border-coral/30',
    emerald: 'hover:border-emerald/30',
    cyan: 'hover:border-cyan/30',
  };

  return (
    <Link
      href={href}
      className={`flex items-start gap-4 p-5 bg-zinc-950/50 rounded-xl border border-zinc-800 ${hoverBorderClasses[color]} hover:bg-zinc-900/50 transition-all duration-200 group ${primary ? 'ring-1 ring-coral/20' : ''}`}
    >
      <div className={`w-12 h-12 rounded-xl ${colorClasses[color]} flex items-center justify-center transition-colors flex-shrink-0`}>
        {icon}
      </div>
      <div>
        <h3 className="text-white font-semibold group-hover:text-coral transition-colors">
          {title}
        </h3>
        <p className="text-zinc-500 text-sm mt-1">{description}</p>
      </div>
    </Link>
  );
}
