"use client";

import anime from 'animejs';
import { ArrowRight, Search, Shield, Zap, BarChart3, CheckCircle2, Globe, FileText, Code2, Eye } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Footer } from "@/components/layout/Footer";
import { Navigation } from "@/components/layout/Navigation";

export function HomePageClient() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [auditUrl, setAuditUrl] = useState('');

  const heroRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);
  const formRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isLoaded) return;

    anime({
      targets: headlineRef.current,
      opacity: [0, 1],
      translateY: [30, 0],
      duration: 700,
      delay: 200,
      easing: 'easeOutCubic',
    });

    anime({
      targets: descRef.current,
      opacity: [0, 1],
      translateY: [30, 0],
      duration: 700,
      delay: 350,
      easing: 'easeOutCubic',
    });

    anime({
      targets: formRef.current,
      opacity: [0, 1],
      translateY: [30, 0],
      duration: 700,
      delay: 500,
      easing: 'easeOutCubic',
    });
  }, [isLoaded]);

  return (
    <div className="min-h-screen bg-black text-foreground overflow-x-hidden">
      <Navigation animated />

      {/* Hero Section */}
      <section ref={heroRef} className="relative min-h-[90vh] flex items-center justify-center pt-24 md:pt-28 overflow-hidden" aria-labelledby="hero-heading">
        <div className="absolute inset-0 z-0" aria-hidden="true">
          <div className="absolute inset-0 bg-gradient-to-b from-ocean-emerald/5 via-transparent to-transparent" />
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-ocean-emerald/5 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-ocean-cyan/5 rounded-full blur-3xl" />
        </div>

        <div className="container relative z-10 max-w-4xl mx-auto px-4 md:px-6">
          <h1
            id="hero-heading"
            ref={headlineRef}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.1] tracking-tight mb-6 text-center opacity-0 text-white"
          >
            Understand your website's{' '}
            <span className="text-ocean-emerald">SEO health</span>{' '}
            in seconds
          </h1>

          <p ref={descRef} className="text-base md:text-lg text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed text-center opacity-0 px-4">
            Get a comprehensive SEO audit with actionable insights. Analyze performance, technical issues, content quality, and more — completely free.
          </p>

          <div ref={formRef} className="max-w-xl mx-auto opacity-0">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (auditUrl.trim()) {
                  window.location.href = `/website-audit?url=${encodeURIComponent(auditUrl.trim())}`;
                }
              }}
              className="flex flex-col sm:flex-row gap-3"
            >
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input
                  type="url"
                  value={auditUrl}
                  onChange={(e) => setAuditUrl(e.target.value)}
                  placeholder="Enter your website URL..."
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-xl pl-12 pr-4 py-4 text-white placeholder-slate-500 focus:outline-none focus:border-ocean-emerald focus:ring-2 focus:ring-ocean-emerald/30 transition-all"
                  aria-label="Website URL to audit"
                />
              </div>
              <button
                type="submit"
                className="rankify-button px-8 py-4 flex items-center justify-center gap-2 group whitespace-nowrap"
              >
                Analyze Site
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </form>
            <p className="text-xs text-slate-500 text-center mt-3">
              Free audit — no account required. 3 scans per day for guests.
            </p>
          </div>
        </div>
      </section>

      {/* What You Get Section */}
      <section className="py-20 md:py-28 bg-zinc-950" aria-labelledby="features-heading">
        <div className="container max-w-6xl px-4 md:px-6 mx-auto">
          <div className="text-center mb-16">
            <h2 id="features-heading" className="text-3xl md:text-4xl font-bold mb-4 text-white">
              What your audit includes
            </h2>
            <p className="text-base md:text-lg text-slate-400 max-w-2xl mx-auto">
              100+ checks across every dimension of SEO, delivered in a clear, actionable report.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: Zap,
                title: 'Performance Analysis',
                description: 'Page speed, load times, Core Web Vitals, and resource optimization insights.',
                color: 'text-ocean-coral bg-ocean-coral/10',
              },
              {
                icon: Code2,
                title: 'Technical SEO',
                description: 'Crawlability, robots.txt, canonical tags, structured data, and indexing issues.',
                color: 'text-ocean-cyan bg-ocean-cyan/10',
              },
              {
                icon: FileText,
                title: 'On-Page SEO',
                description: 'Title tags, meta descriptions, heading hierarchy, and keyword optimization.',
                color: 'text-ocean-emerald bg-ocean-emerald/10',
              },
              {
                icon: Eye,
                title: 'Content & Readability',
                description: 'Word count, readability scoring, keyword density, and content structure analysis.',
                color: 'text-ocean-pink bg-ocean-pink/10',
              },
              {
                icon: Shield,
                title: 'Security & Headers',
                description: 'HTTPS status, security headers, CSP configuration, and vulnerability checks.',
                color: 'text-ocean-emerald bg-ocean-emerald/10',
              },
              {
                icon: Globe,
                title: 'Social & Sharing',
                description: 'Open Graph tags, Twitter Cards, and social media sharing optimization.',
                color: 'text-ocean-cyan bg-ocean-cyan/10',
              },
            ].map((feature, idx) => (
              <div
                key={idx}
                className="group rankify-card p-6 hover:border-zinc-700 transition-all duration-300"
              >
                <div className={`w-12 h-12 rounded-xl ${feature.color} flex items-center justify-center mb-4`}>
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 md:py-28 bg-black" aria-labelledby="how-heading">
        <div className="container max-w-4xl px-4 md:px-6 mx-auto">
          <div className="text-center mb-16">
            <h2 id="how-heading" className="text-3xl md:text-4xl font-bold mb-4 text-white">
              How it works
            </h2>
            <p className="text-base md:text-lg text-slate-400 max-w-xl mx-auto">
              Three steps to a complete SEO picture of any website.
            </p>
          </div>

          <div className="space-y-12">
            {[
              {
                step: '01',
                title: 'Enter a URL',
                description: 'Paste any website URL into the audit tool. No signup needed for your first scans.',
              },
              {
                step: '02',
                title: 'We analyze everything',
                description: 'Our engine scrapes the page, runs 100+ checks across performance, SEO, content, security, and more.',
              },
              {
                step: '03',
                title: 'Get actionable results',
                description: 'Receive a scored report with prioritized issues and specific recommendations to improve your rankings.',
              },
            ].map((item, idx) => (
              <div key={idx} className="flex gap-6 items-start">
                <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-ocean-emerald/10 border border-ocean-emerald/20 flex items-center justify-center">
                  <span className="text-ocean-emerald font-bold text-lg">{item.step}</span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">{item.title}</h3>
                  <p className="text-slate-400 leading-relaxed">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-28 bg-zinc-950" aria-labelledby="cta-heading">
        <div className="container max-w-3xl text-center px-4 md:px-6 mx-auto">
          <h2 id="cta-heading" className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 text-white">
            Ready to improve your SEO?
          </h2>
          <p className="text-base md:text-lg text-slate-400 mb-8 max-w-xl mx-auto">
            Run your first audit now. It&apos;s free, fast, and requires no account.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <Link
              href="/website-audit"
              className="rankify-button flex items-center gap-2 text-base md:text-lg px-8 py-4 w-full sm:w-auto"
            >
              Start Free Audit
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/pricing"
              className="rankify-button-outline text-base md:text-lg px-8 py-4 w-full sm:w-auto"
            >
              View Plans
            </Link>
          </div>

          <div className="flex flex-wrap justify-center gap-6 text-sm text-slate-500">
            <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-ocean-emerald" /> No account needed</span>
            <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-ocean-emerald" /> Results in under 60s</span>
            <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-ocean-emerald" /> 3 free scans daily</span>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
