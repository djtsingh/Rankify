"use client";

import Link from "next/link";
import { Package, Layers, DollarSign, LogIn, ArrowRight, Menu, X, Chrome, Target, TrendingUp, BarChart3, Sparkles, Zap, Loader2, CheckCircle2 } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import anime from "animejs";
import { useAuth } from "@/lib/auth/auth-context";
import { AuthModal } from "@/components/auth/AuthModal";
import { UserMenu } from "@/components/auth/UserMenu";

interface NavigationProps {
  variant?: 'default' | 'transparent';
  animated?: boolean;
}

export function Navigation({ variant = 'default', animated = false }: NavigationProps) {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isFeaturesDropdownOpen, setIsFeaturesDropdownOpen] = useState(false);
  const [isSolutionsDropdownOpen, setIsSolutionsDropdownOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authModalView, setAuthModalView] = useState<'signin' | 'signup'>('signin');

  const navRef = useRef<HTMLElement>(null);
  const brandRef = useRef<HTMLDivElement>(null);
  const linksRef = useRef<HTMLDivElement>(null);

  // Open auth modal
  const openSignIn = () => {
    setAuthModalView('signin');
    setShowAuthModal(true);
    setIsMobileMenuOpen(false);
  };

  const openSignUp = () => {
    setAuthModalView('signup');
    setShowAuthModal(true);
    setIsMobileMenuOpen(false);
  };

  // Animate on mount if animated prop is true
  useEffect(() => {
    if (animated && navRef.current) {
      anime({
        targets: navRef.current,
        opacity: [0, 1],
        translateY: [-20, 0],
        duration: 600,
        easing: 'easeOutCubic',
      });

      if (brandRef.current) {
        anime({
          targets: brandRef.current,
          opacity: [0, 1],
          translateX: [-20, 0],
          duration: 600,
          easing: 'easeOutCubic',
        });
      }

      if (linksRef.current) {
        anime({
          targets: linksRef.current.children,
          opacity: [0, 1],
          translateX: [20, 0],
          duration: 600,
          delay: anime.stagger(100),
          easing: 'easeOutCubic',
        });
      }
    }
  }, [animated]);

  // Mobile menu handlers
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };

    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
      setTimeout(() => {
        const menuItems = document.querySelectorAll('.mobile-menu-item');
        anime({
          targets: menuItems,
          opacity: [0, 1],
          translateX: [20, 0],
          duration: 400,
          delay: anime.stagger(50),
          easing: 'easeOutCubic',
        });
      }, 100);
    } else {
      document.body.style.overflow = '';
    }

    window.addEventListener('keydown', handleEscape);
    return () => {
      window.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  return (
    <>
      {/* Navigation */}
      <nav className="fixed top-4 left-4 right-4 z-50 bg-zinc-900/80 backdrop-blur-md rounded-2xl border border-zinc-800 shadow-lg shadow-black/50" role="navigation" aria-label="Main navigation">
        <div className="flex items-center justify-between py-3 px-6">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <img src="/logo-horizontal.svg" alt="Rankify" className="h-8 w-auto lg:h-12 lg:w-auto" />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-3">
            <div 
              className="relative"
              onMouseEnter={() => setIsFeaturesDropdownOpen(true)}
              onMouseLeave={() => setIsFeaturesDropdownOpen(false)}
            >
              <div className="flex items-center gap-1.5 text-sm lg:text-base font-medium text-slate-300 hover:text-coral hover:bg-zinc-800/50 transition-all rounded-lg px-3 py-2 lg:px-4 lg:py-2.5 group" aria-label="Navigate to features section">
                <Package className="w-4 h-4 lg:w-5 lg:h-5 group-hover:scale-110 transition-transform" />
                <span>Features</span>
                <svg className={`w-3 h-3 transition-transform ${isFeaturesDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
              
              {/* Features Dropdown */}
              <div className={`absolute top-full left-0 mt-2 w-[620px] bg-zinc-900/95 backdrop-blur-xl border border-zinc-800 rounded-2xl shadow-2xl shadow-black/50 transition-all duration-300 ${isFeaturesDropdownOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2'}`}>
                <div className="p-6">
                  <div className="grid grid-cols-2 gap-4">
                    {/* Website Audit - Active */}
                    <a href="/website-audit" className="group flex items-start gap-3 p-4 rounded-xl bg-zinc-800/30 hover:bg-zinc-800/60 border border-zinc-700/50 hover:border-coral/50 transition-all">
                      <div className="p-2 bg-coral/10 rounded-lg group-hover:bg-coral/20 transition-colors">
                        <Chrome className="w-5 h-5 text-coral" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-sm font-semibold text-white mb-1 group-hover:text-coral transition-colors">Website Audit</h4>
                        <p className="text-xs text-slate-400 leading-relaxed">Complete SEO health check with actionable insights</p>
                      </div>
                    </a>

                    {/* Keyword Research - Faded */}
                    <div className="flex items-start gap-3 p-4 rounded-xl bg-zinc-800/10 border border-zinc-800/50 opacity-40 cursor-not-allowed">
                      <div className="p-2 bg-cyan/5 rounded-lg">
                        <Target className="w-5 h-5 text-cyan" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-sm font-semibold text-white mb-1">Keyword Intelligence</h4>
                        <p className="text-xs text-slate-400 leading-relaxed">Discover high-value keywords with search intent analysis</p>
                      </div>
                    </div>

                    {/* Rank Tracking - Faded */}
                    <div className="flex items-start gap-3 p-4 rounded-xl bg-zinc-800/10 border border-zinc-800/50 opacity-40 cursor-not-allowed">
                      <div className="p-2 bg-emerald/5 rounded-lg">
                        <TrendingUp className="w-5 h-5 text-emerald" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-sm font-semibold text-white mb-1">Rank Monitoring</h4>
                        <p className="text-xs text-slate-400 leading-relaxed">Track keyword positions across search engines</p>
                      </div>
                    </div>

                    {/* Competitor Analysis - Faded */}
                    <div className="flex items-start gap-3 p-4 rounded-xl bg-zinc-800/10 border border-zinc-800/50 opacity-40 cursor-not-allowed">
                      <div className="p-2 bg-pink/5 rounded-lg">
                        <BarChart3 className="w-5 h-5 text-pink" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-sm font-semibold text-white mb-1">Competitor Intelligence</h4>
                        <p className="text-xs text-slate-400 leading-relaxed">Uncover competitor strategies and market gaps</p>
                      </div>
                    </div>

                    {/* Backlink Analysis - Faded */}
                    <div className="flex items-start gap-3 p-4 rounded-xl bg-zinc-800/10 border border-zinc-800/50 opacity-40 cursor-not-allowed">
                      <div className="p-2 bg-cyan/5 rounded-lg">
                        <Sparkles className="w-5 h-5 text-cyan" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-sm font-semibold text-white mb-1">Backlink Explorer</h4>
                        <p className="text-xs text-slate-400 leading-relaxed">Analyze backlink profiles and discover link opportunities</p>
                      </div>
                    </div>

                    {/* Content Optimization - Faded */}
                    <div className="flex items-start gap-3 p-4 rounded-xl bg-zinc-800/10 border border-zinc-800/50 opacity-40 cursor-not-allowed">
                      <div className="p-2 bg-coral/5 rounded-lg">
                        <Zap className="w-5 h-5 text-coral" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-sm font-semibold text-white mb-1">Content Optimizer</h4>
                        <p className="text-xs text-slate-400 leading-relaxed">AI-powered content recommendations for better rankings</p>
                      </div>
                    </div>

                    {/* Site Performance - Faded */}
                    <div className="flex items-start gap-3 p-4 rounded-xl bg-zinc-800/10 border border-zinc-800/50 opacity-40 cursor-not-allowed">
                      <div className="p-2 bg-emerald/5 rounded-lg">
                        <Loader2 className="w-5 h-5 text-emerald" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-sm font-semibold text-white mb-1">Performance Metrics</h4>
                        <p className="text-xs text-slate-400 leading-relaxed">Core Web Vitals and speed optimization insights</p>
                      </div>
                    </div>

                    {/* Technical SEO - Faded */}
                    <div className="flex items-start gap-3 p-4 rounded-xl bg-zinc-800/10 border border-zinc-800/50 opacity-40 cursor-not-allowed">
                      <div className="p-2 bg-pink/5 rounded-lg">
                        <CheckCircle2 className="w-5 h-5 text-pink" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-sm font-semibold text-white mb-1">Technical SEO Scanner</h4>
                        <p className="text-xs text-slate-400 leading-relaxed">Deep technical analysis and crawl diagnostics</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Bottom CTA */}
                  <div className="mt-4 pt-4 border-t border-zinc-800">
                    <a href="/#features" className="flex items-center justify-center gap-2 text-sm text-slate-400 hover:text-coral transition-colors group">
                      <span>Explore all features</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Solutions Dropdown */}
            <div 
              className="relative group"
              onMouseEnter={() => {}}
              onMouseLeave={() => {}}
            >
              <button className="flex items-center gap-1.5 text-sm lg:text-base font-medium text-slate-300 hover:text-coral hover:bg-zinc-800/50 transition-all rounded-lg px-3 py-2 lg:px-4 lg:py-2.5 group/btn" aria-label="Navigate to solutions">
                <Layers className="w-4 h-4 lg:w-5 lg:h-5 group-hover/btn:scale-110 transition-transform" />
                <span>Solutions</span>
                <svg className="w-3 h-3 transition-transform group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {/* Solutions Dropdown Content */}
              <div className="absolute top-full left-0 mt-2 w-[400px] bg-zinc-900/95 backdrop-blur-xl border border-zinc-800 rounded-2xl shadow-2xl shadow-black/50 opacity-0 invisible -translate-y-2 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 transition-all duration-300">
                <div className="p-6 space-y-4">
                  <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">By Use Case</h4>
                  
                  <a href="/website-audit" className="flex items-start gap-3 p-3 rounded-xl hover:bg-zinc-800/50 transition-colors group/item">
                    <div className="p-2 bg-coral/10 rounded-lg">
                      <Chrome className="w-5 h-5 text-coral" />
                    </div>
                    <div className="flex-1">
                      <h5 className="text-sm font-semibold text-white group-hover/item:text-coral transition-colors">SEO Agencies</h5>
                      <p className="text-xs text-slate-400">Audit client sites and deliver professional reports</p>
                    </div>
                  </a>
                  
                  <a href="/website-audit" className="flex items-start gap-3 p-3 rounded-xl hover:bg-zinc-800/50 transition-colors group/item">
                    <div className="p-2 bg-cyan/10 rounded-lg">
                      <Target className="w-5 h-5 text-cyan" />
                    </div>
                    <div className="flex-1">
                      <h5 className="text-sm font-semibold text-white group-hover/item:text-coral transition-colors">In-House Teams</h5>
                      <p className="text-xs text-slate-400">Monitor and improve your company's SEO health</p>
                    </div>
                  </a>
                  
                  <a href="/website-audit" className="flex items-start gap-3 p-3 rounded-xl hover:bg-zinc-800/50 transition-colors group/item">
                    <div className="p-2 bg-emerald/10 rounded-lg">
                      <TrendingUp className="w-5 h-5 text-emerald" />
                    </div>
                    <div className="flex-1">
                      <h5 className="text-sm font-semibold text-white group-hover/item:text-coral transition-colors">Freelancers</h5>
                      <p className="text-xs text-slate-400">Deliver professional SEO audits to your clients</p>
                    </div>
                  </a>
                  
                  <a href="/website-audit" className="flex items-start gap-3 p-3 rounded-xl hover:bg-zinc-800/50 transition-colors group/item">
                    <div className="p-2 bg-coral/10 rounded-lg">
                      <BarChart3 className="w-5 h-5 text-coral" />
                    </div>
                    <div className="flex-1">
                      <h5 className="text-sm font-semibold text-white group-hover/item:text-coral transition-colors">E-commerce</h5>
                      <p className="text-xs text-slate-400">Optimize product pages for better rankings</p>
                    </div>
                  </a>
                </div>
              </div>
            </div>
            
            <Link href="/pricing" className="flex items-center gap-1.5 text-sm lg:text-base font-medium text-slate-300 hover:text-coral hover:bg-zinc-800/50 transition-all rounded-lg px-3 py-2 lg:px-4 lg:py-2.5 group" aria-label="Navigate to pricing page">
              <DollarSign className="w-4 h-4 lg:w-5 lg:h-5 group-hover:scale-110 transition-transform" />
              <span>Pricing</span>
            </Link>
            <div className="w-px h-5 bg-zinc-700 mx-1"></div>
            
            {/* Auth Section */}
            {authLoading ? (
              <div className="w-8 h-8 flex items-center justify-center">
                <Loader2 className="w-5 h-5 text-zinc-400 animate-spin" />
              </div>
            ) : isAuthenticated ? (
              <UserMenu />
            ) : (
              <>
                <button
                  onClick={openSignIn}
                  className="flex items-center gap-1.5 text-sm lg:text-base font-medium text-slate-300 hover:text-coral hover:bg-zinc-800/50 transition-all rounded-lg px-3 py-2 lg:px-4 lg:py-2.5 group"
                  aria-label="Log in to Rankify"
                >
                  <LogIn className="w-4 h-4 lg:w-5 lg:h-5 group-hover:scale-110 transition-transform" />
                  <span>Log In</span>
                </button>
                <button
                  onClick={openSignUp}
                  className="rankify-button text-sm lg:text-base px-5 py-2 lg:px-6 lg:py-2.5 ml-2 flex items-center gap-1.5 group"
                >
                  <span>Get Started</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden text-white p-2 hover:text-coral transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle mobile menu"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
          onClick={() => setIsMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Mobile Menu Slide-out */}
      <div
        className={`lg:hidden fixed top-0 right-0 h-full w-80 bg-zinc-900/95 backdrop-blur-xl border-l border-zinc-800 shadow-2xl transform transition-all duration-500 ease-out z-[70] ${
          isMobileMenuOpen ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
        }`}
      >
        {/* Menu Header */}
        <div className="flex items-center justify-between p-6 border-b border-zinc-800">
          <div className="flex items-center gap-2">
            <img src="/logo-horizontal.svg" alt="Rankify" className="h-7 w-auto" />
          </div>
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="p-2 hover:bg-zinc-800 rounded-lg transition-colors"
            aria-label="Close menu"
          >
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        {/* Menu Content */}
        <div className="flex flex-col h-[calc(100%-80px)] justify-between">
          {/* Navigation Links */}
          <nav className="flex flex-col p-4 gap-1">
            {/* Features with Submenu */}
            <div className="mobile-menu-item opacity-0">
              <button
                className="w-full flex items-center justify-between text-base font-medium text-slate-300 hover:text-coral hover:bg-zinc-800/50 rounded-lg px-4 py-3.5 transition-all duration-200 group"
                onClick={() => setIsFeaturesDropdownOpen(!isFeaturesDropdownOpen)}
              >
                <div className="flex items-center gap-3">
                  <Package className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  <span>Features</span>
                </div>
                <svg className={`w-4 h-4 transition-transform ${isFeaturesDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {/* Mobile Features Submenu */}
              <div className={`overflow-hidden transition-all duration-300 ${isFeaturesDropdownOpen ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'}`}>
                <div className="pl-4 pr-4 pt-2 space-y-2">
                  {/* Website Audit - Active */}
                  <a href="/website-audit" className="flex items-start gap-3 p-3 rounded-lg bg-zinc-800/30 hover:bg-zinc-800/60 border border-zinc-700/50 hover:border-coral/50 transition-all" onClick={() => setIsMobileMenuOpen(false)}>
                    <div className="p-1.5 bg-coral/10 rounded-lg">
                      <Chrome className="w-4 h-4 text-coral" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-semibold text-white mb-0.5">Website Audit</h4>
                      <p className="text-xs text-slate-400 leading-relaxed">Complete SEO health check</p>
                    </div>
                  </a>

                  {/* Faded Features */}
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-zinc-800/10 border border-zinc-800/50 opacity-40">
                    <div className="p-1.5 bg-cyan/5 rounded-lg"><Target className="w-4 h-4 text-cyan" /></div>
                    <div className="flex-1"><h4 className="text-sm font-semibold text-white">Keyword Intelligence</h4></div>
                  </div>
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-zinc-800/10 border border-zinc-800/50 opacity-40">
                    <div className="p-1.5 bg-emerald/5 rounded-lg"><TrendingUp className="w-4 h-4 text-emerald" /></div>
                    <div className="flex-1"><h4 className="text-sm font-semibold text-white">Rank Monitoring</h4></div>
                  </div>
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-zinc-800/10 border border-zinc-800/50 opacity-40">
                    <div className="p-1.5 bg-pink/5 rounded-lg"><BarChart3 className="w-4 h-4 text-pink" /></div>
                    <div className="flex-1"><h4 className="text-sm font-semibold text-white">Competitor Intelligence</h4></div>
                  </div>
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-zinc-800/10 border border-zinc-800/50 opacity-40">
                    <div className="p-1.5 bg-cyan/5 rounded-lg"><Sparkles className="w-4 h-4 text-cyan" /></div>
                    <div className="flex-1"><h4 className="text-sm font-semibold text-white">Backlink Explorer</h4></div>
                  </div>
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-zinc-800/10 border border-zinc-800/50 opacity-40">
                    <div className="p-1.5 bg-coral/5 rounded-lg"><Zap className="w-4 h-4 text-coral" /></div>
                    <div className="flex-1"><h4 className="text-sm font-semibold text-white">Content Optimizer</h4></div>
                  </div>
                </div>
              </div>
            </div>
            
            <a
              href="/website-audit"
              className="mobile-menu-item flex items-center gap-3 text-base font-medium text-slate-300 hover:text-coral hover:bg-zinc-800/50 rounded-lg px-4 py-3.5 transition-all duration-200 group opacity-0"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <Layers className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <span>Solutions</span>
            </a>
            <a
              href="/pricing"
              className="mobile-menu-item flex items-center gap-3 text-base font-medium text-slate-300 hover:text-coral hover:bg-zinc-800/50 rounded-lg px-4 py-3.5 transition-all duration-200 group opacity-0"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <DollarSign className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <span>Pricing</span>
            </a>
            
            {/* Divider */}
            <div className="h-px bg-zinc-800 my-2"></div>
            
            {/* Mobile Auth */}
            {!isAuthenticated ? (
              <button
                onClick={openSignIn}
                className="mobile-menu-item flex items-center gap-3 text-base font-medium text-slate-300 hover:text-coral hover:bg-zinc-800/50 rounded-lg px-4 py-3.5 transition-all duration-200 group opacity-0"
              >
                <LogIn className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <span>Log In</span>
              </button>
            ) : (
              <div className="mobile-menu-item px-4 py-3 opacity-0">
                <UserMenu />
              </div>
            )}
          </nav>

          {/* Bottom CTA Section */}
          <div className="p-4 border-t border-zinc-800">
            {isAuthenticated ? (
              <Link
                href="/website-audit"
                className="w-full rankify-button text-sm px-5 py-3.5 flex items-center justify-center gap-2 group"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <span>Start New Audit</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            ) : (
              <button
                onClick={openSignUp}
                className="w-full rankify-button text-sm px-5 py-3.5 flex items-center justify-center gap-2 group"
              >
                <span>Get Started</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            )}
            <p className="text-xs text-slate-500 text-center mt-3">
              {isAuthenticated ? 'Analyze any website in seconds' : 'Start your free trial • No credit card required'}
            </p>
          </div>
        </div>
      </div>

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        defaultView={authModalView}
      />
    </>
  );
}
