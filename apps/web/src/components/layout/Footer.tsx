'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Twitter, Github, MessageCircle, Linkedin, Mail, Send, Package, BookOpen, Briefcase, Shield, CheckCircle2, Loader2, AlertCircle } from 'lucide-react';

// Email validation
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function Footer() {
  const [email, setEmail] = useState('');
  const [subscribeStatus, setSubscribeStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate email
    if (!email.trim()) {
      setSubscribeStatus('error');
      setErrorMessage('Please enter your email address');
      return;
    }
    
    if (!isValidEmail(email)) {
      setSubscribeStatus('error');
      setErrorMessage('Please enter a valid email address');
      return;
    }

    setSubscribeStatus('loading');
    setErrorMessage('');

    try {
      // Simulate API call - in production, replace with actual API endpoint
      // Example: await fetch('/api/subscribe', { method: 'POST', body: JSON.stringify({ email }) });
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Store subscriber in localStorage for demo (in production, use backend)
      const subscribers = JSON.parse(localStorage.getItem('newsletter_subscribers') || '[]');
      if (!subscribers.includes(email.toLowerCase())) {
        subscribers.push(email.toLowerCase());
        localStorage.setItem('newsletter_subscribers', JSON.stringify(subscribers));
      }
      
      setSubscribeStatus('success');
      setEmail('');
      
      // Reset after 5 seconds
      setTimeout(() => {
        setSubscribeStatus('idle');
      }, 5000);
    } catch {
      setSubscribeStatus('error');
      setErrorMessage('Something went wrong. Please try again.');
    }
  };

  return (
    <footer className="border-t border-zinc-800 bg-black pt-16 pb-8 px-4">
      <div className="container max-w-7xl mx-auto">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-12 gap-8 mb-12">
          {/* Brand Section */}
          <div className="col-span-2 md:col-span-3 lg:col-span-4">
            <Link href="/" className="flex items-center gap-3 mb-4">
              <img src="/rankify-logo.png" alt="Rankify" className="h-12 w-12 lg:h-14 lg:w-14" />
              <span className="text-2xl lg:text-3xl font-bold text-white">Rankify</span>
            </Link>
            <p className="text-sm lg:text-base text-slate-400 mb-6 max-w-sm">
              Dominate search rankings with AI-powered insights. Built for SEO professionals who demand excellence.
            </p>
            <div className="flex items-center gap-3">
              <a href="https://twitter.com/rankify" target="_blank" rel="noopener noreferrer" className="p-2 lg:p-2.5 text-slate-400 hover:text-coral hover:bg-zinc-800/50 rounded-lg transition-all" aria-label="Twitter">
                <Twitter className="w-5 h-5 lg:w-6 lg:h-6" />
              </a>
              <a href="https://github.com/rankify" target="_blank" rel="noopener noreferrer" className="p-2 lg:p-2.5 text-slate-400 hover:text-coral hover:bg-zinc-800/50 rounded-lg transition-all" aria-label="GitHub">
                <Github className="w-5 h-5 lg:w-6 lg:h-6" />
              </a>
              <a href="https://discord.gg/rankify" target="_blank" rel="noopener noreferrer" className="p-2 lg:p-2.5 text-slate-400 hover:text-coral hover:bg-zinc-800/50 rounded-lg transition-all" aria-label="Discord">
                <MessageCircle className="w-5 h-5 lg:w-6 lg:h-6" />
              </a>
              <a href="https://linkedin.com/company/rankify" target="_blank" rel="noopener noreferrer" className="p-2 lg:p-2.5 text-slate-400 hover:text-coral hover:bg-zinc-800/50 rounded-lg transition-all" aria-label="LinkedIn">
                <Linkedin className="w-5 h-5 lg:w-6 lg:h-6" />
              </a>
            </div>
          </div>

          {/* Features Links - Aligned with Header */}
          <div className="lg:col-span-2">
            <h4 className="font-semibold text-white lg:text-lg mb-4 flex items-center gap-2">
              <Package className="w-4 h-4 lg:w-5 lg:h-5 text-coral" />
              Features
            </h4>
            <ul className="space-y-3">
              <li><Link href="/website-audit" className="text-sm lg:text-base text-slate-400 hover:text-coral transition-colors flex items-center gap-2 group">
                <span className="group-hover:translate-x-1 transition-transform">Website Audit</span>
              </Link></li>
              <li><Link href="/pricing" className="text-sm lg:text-base text-slate-400 hover:text-coral transition-colors flex items-center gap-2 group">
                <span className="group-hover:translate-x-1 transition-transform">Pricing</span>
              </Link></li>
              <li><span className="text-sm lg:text-base text-slate-500 flex items-center gap-2 cursor-not-allowed">
                <span>API</span>
                <span className="text-xs bg-zinc-800 px-2 py-0.5 rounded">Soon</span>
              </span></li>
              <li><span className="text-sm lg:text-base text-slate-500 flex items-center gap-2 cursor-not-allowed">
                <span>Integrations</span>
                <span className="text-xs bg-zinc-800 px-2 py-0.5 rounded">Soon</span>
              </span></li>
            </ul>
          </div>

          {/* Resources Links */}
          <div className="lg:col-span-2">
            <h4 className="font-semibold text-white lg:text-lg mb-4 flex items-center gap-2">
              <BookOpen className="w-4 h-4 lg:w-5 lg:h-5 text-cyan" />
              Resources
            </h4>
            <ul className="space-y-3">
              <li><span className="text-sm lg:text-base text-slate-500 flex items-center gap-2 cursor-not-allowed">
                <span>Documentation</span>
                <span className="text-xs bg-zinc-800 px-2 py-0.5 rounded">Soon</span>
              </span></li>
              <li><span className="text-sm lg:text-base text-slate-500 flex items-center gap-2 cursor-not-allowed">
                <span>Blog</span>
                <span className="text-xs bg-zinc-800 px-2 py-0.5 rounded">Soon</span>
              </span></li>
              <li><span className="text-sm lg:text-base text-slate-500 flex items-center gap-2 cursor-not-allowed">
                <span>SEO Guides</span>
                <span className="text-xs bg-zinc-800 px-2 py-0.5 rounded">Soon</span>
              </span></li>
              <li><span className="text-sm lg:text-base text-slate-500 flex items-center gap-2 cursor-not-allowed">
                <span>Help Center</span>
                <span className="text-xs bg-zinc-800 px-2 py-0.5 rounded">Soon</span>
              </span></li>
            </ul>
          </div>

          {/* Company Links */}
          <div className="lg:col-span-2">
            <h4 className="font-semibold text-white lg:text-lg mb-4 flex items-center gap-2">
              <Briefcase className="w-4 h-4 lg:w-5 lg:h-5 text-coral" />
              Company
            </h4>
            <ul className="space-y-3">
              <li><Link href="/about" className="text-sm lg:text-base text-slate-400 hover:text-coral transition-colors flex items-center gap-2 group">
                <span className="group-hover:translate-x-1 transition-transform">About</span>
              </Link></li>
              <li><Link href="/contact" className="text-sm lg:text-base text-slate-400 hover:text-coral transition-colors flex items-center gap-2 group">
                <span className="group-hover:translate-x-1 transition-transform">Contact</span>
              </Link></li>
              <li><span className="text-sm lg:text-base text-slate-500 flex items-center gap-2 cursor-not-allowed">
                <span>Careers</span>
                <span className="text-xs bg-zinc-800 px-2 py-0.5 rounded">Soon</span>
              </span></li>
              <li><span className="text-sm lg:text-base text-slate-500 flex items-center gap-2 cursor-not-allowed">
                <span>Press Kit</span>
                <span className="text-xs bg-zinc-800 px-2 py-0.5 rounded">Soon</span>
              </span></li>
            </ul>
          </div>

          {/* Legal Links */}
          <div className="lg:col-span-2">
            <h4 className="font-semibold text-white lg:text-lg mb-4 flex items-center gap-2">
              <Shield className="w-4 h-4 lg:w-5 lg:h-5 text-emerald" />
              Legal
            </h4>
            <ul className="space-y-3">
              <li><Link href="/privacy" className="text-sm lg:text-base text-slate-400 hover:text-coral transition-colors flex items-center gap-2 group">
                <span className="group-hover:translate-x-1 transition-transform">Privacy</span>
              </Link></li>
              <li><Link href="/terms" className="text-sm lg:text-base text-slate-400 hover:text-coral transition-colors flex items-center gap-2 group">
                <span className="group-hover:translate-x-1 transition-transform">Terms</span>
              </Link></li>
              <li><Link href="/cookies" className="text-sm lg:text-base text-slate-400 hover:text-coral transition-colors flex items-center gap-2 group">
                <span className="group-hover:translate-x-1 transition-transform">Cookies</span>
              </Link></li>
              <li><Link href="/security" className="text-sm lg:text-base text-slate-400 hover:text-coral transition-colors flex items-center gap-2 group">
                <span className="group-hover:translate-x-1 transition-transform">Security</span>
              </Link></li>
            </ul>
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="border-t border-zinc-800 pt-8 pb-8">
          <div className="max-w-xl mx-auto text-center">
            <div className="flex items-center justify-center gap-2 mb-3">
              <Mail className="w-5 h-5 lg:w-6 lg:h-6 text-coral" />
              <h4 className="font-semibold text-white lg:text-lg">Stay Updated</h4>
            </div>
            <p className="text-sm lg:text-base text-slate-400 mb-4">
              Get the latest SEO insights, product updates, and ranking strategies delivered to your inbox.
            </p>
            
            {subscribeStatus === 'success' ? (
              <div className="flex items-center justify-center gap-2 p-4 bg-emerald/10 border border-emerald/30 rounded-xl text-emerald">
                <CheckCircle2 className="w-5 h-5" />
                <span className="font-medium">Thanks for subscribing! Check your inbox soon.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-3 max-w-md mx-auto">
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (subscribeStatus === 'error') {
                        setSubscribeStatus('idle');
                        setErrorMessage('');
                      }
                    }}
                    placeholder="Enter your email"
                    className={`flex-1 bg-zinc-900 border rounded-lg px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 transition-all ${
                      subscribeStatus === 'error' 
                        ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                        : 'border-zinc-800 focus:border-coral focus:ring-coral'
                    }`}
                    aria-label="Email for newsletter"
                    disabled={subscribeStatus === 'loading'}
                  />
                  <button
                    type="submit"
                    disabled={subscribeStatus === 'loading'}
                    className="rankify-button text-sm px-5 py-2.5 flex items-center justify-center gap-2 group whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {subscribeStatus === 'loading' ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Subscribing...</span>
                      </>
                    ) : (
                      <>
                        <span>Subscribe</span>
                        <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </button>
                </div>
                {subscribeStatus === 'error' && errorMessage && (
                  <div className="flex items-center gap-2 text-red-400 text-sm">
                    <AlertCircle className="w-4 h-4" />
                    <span>{errorMessage}</span>
                  </div>
                )}
              </form>
            )}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-zinc-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-slate-500 text-center md:text-left">
            © {new Date().getFullYear()} Rankify. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-xs text-slate-500">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 bg-emerald rounded-full animate-pulse"></span>
              All systems operational
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
