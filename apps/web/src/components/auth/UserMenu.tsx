'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { User, Settings, LogOut, CreditCard, BarChart3, FileText, ChevronDown, Sparkles } from 'lucide-react';
import anime from 'animejs';
import { useAuth } from '@/lib/auth/auth-context';

export function UserMenu() {
  const { user, signOut, isLoading } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Animate dropdown
  useEffect(() => {
    if (isOpen && dropdownRef.current) {
      anime({
        targets: dropdownRef.current,
        opacity: [0, 1],
        translateY: [-10, 0],
        duration: 200,
        easing: 'easeOutCubic',
      });
    }
  }, [isOpen]);

  // Handle sign out
  const handleSignOut = async () => {
    setIsOpen(false);
    await signOut();
  };

  if (!user) return null;

  const initials = user.name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const planColors = {
    free: 'text-zinc-400 bg-zinc-800',
    pro: 'text-coral bg-coral/10',
    enterprise: 'text-cyan bg-cyan/10',
  };

  return (
    <div ref={menuRef} className="relative">
      {/* Profile Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-1 pr-2 rounded-full hover:bg-zinc-800/50 transition-colors"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        {user.avatar ? (
          <img
            src={user.avatar}
            alt={user.name}
            className="w-8 h-8 rounded-full border-2 border-coral/50"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-coral to-cyan flex items-center justify-center text-white text-sm font-bold">
            {initials}
          </div>
        )}
        <ChevronDown className={`w-4 h-4 text-zinc-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          ref={dropdownRef}
          className="absolute right-0 mt-2 w-72 bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl overflow-hidden z-50"
        >
          {/* User Info Header */}
          <div className="p-4 border-b border-zinc-800 bg-zinc-800/30">
            <div className="flex items-center gap-3">
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-12 h-12 rounded-full border-2 border-coral/50"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-coral to-cyan flex items-center justify-center text-white text-lg font-bold">
                  {initials}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-white truncate">{user.name}</p>
                <p className="text-sm text-zinc-400 truncate">{user.email}</p>
              </div>
            </div>
            
            {/* Subscription Badge */}
            <div className="mt-3 flex items-center justify-between">
              <span className={`text-xs font-medium px-2 py-1 rounded-full capitalize ${planColors[user.subscription?.plan || 'free']}`}>
                {user.subscription?.plan || 'Free'} Plan
              </span>
              {user.subscription?.plan === 'free' && (
                <Link
                  href="/pricing"
                  onClick={() => setIsOpen(false)}
                  className="text-xs text-coral hover:underline flex items-center gap-1"
                >
                  <Sparkles className="w-3 h-3" />
                  Upgrade
                </Link>
              )}
            </div>
          </div>

          {/* Menu Items */}
          <div className="p-2">
            <Link
              href="/dashboard"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 text-sm text-zinc-300 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors"
            >
              <BarChart3 className="w-4 h-4 text-zinc-500" />
              Dashboard
            </Link>
            <Link
              href="/audits"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 text-sm text-zinc-300 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors"
            >
              <FileText className="w-4 h-4 text-zinc-500" />
              My Audits
            </Link>
            <Link
              href="/account"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 text-sm text-zinc-300 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors"
            >
              <User className="w-4 h-4 text-zinc-500" />
              Account
            </Link>
            <Link
              href="/account/billing"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 text-sm text-zinc-300 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors"
            >
              <CreditCard className="w-4 h-4 text-zinc-500" />
              Billing
            </Link>
            <Link
              href="/account/settings"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 text-sm text-zinc-300 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors"
            >
              <Settings className="w-4 h-4 text-zinc-500" />
              Settings
            </Link>
          </div>

          {/* Sign Out */}
          <div className="p-2 border-t border-zinc-800">
            <button
              onClick={handleSignOut}
              disabled={isLoading}
              className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
              {isLoading ? 'Signing out...' : 'Sign Out'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
