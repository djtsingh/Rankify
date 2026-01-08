"use client";

import anime from 'animejs';
import { ArrowRight, TrendingUp, BarChart3, Zap, Target, Sparkles, CheckCircle2, Chrome, Maximize2, Loader2, Play, Shield, Globe, Users, Rocket, Clock, Star, Award } from "lucide-react";
import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { Footer } from "@/components/layout/Footer";
import { Navigation } from "@/components/layout/Navigation";

// ============================================
// ANIMATED COUNTER HOOK - Counts from 0 on visibility
// ============================================
function useAnimatedCounter(end: number, duration: number = 2000) {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  const startAnimation = useCallback(() => {
    if (hasAnimated) return;
    setHasAnimated(true);

    const startTime = performance.now();
    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const currentCount = Math.floor(easeOutQuart * end);
      
      setCount(currentCount);
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setCount(end);
      }
    };
    
    requestAnimationFrame(animate);
  }, [end, duration, hasAnimated]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            startAnimation();
          }
        });
      },
      { threshold: 0.5 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => observer.disconnect();
  }, [startAnimation]);

  return { count, elementRef };
}

// Stats data for animated counters
const statsData = [
  { value: 50000, suffix: '+', label: 'Active Users', color: 'text-coral' },
  { value: 500, suffix: 'M+', label: 'Keywords Tracked', color: 'text-cyan' },
  { value: 47, suffix: '%', label: 'Avg. Ranking Lift', color: 'text-emerald' },
];

// Feature data with highlights
const features = [
  {
    icon: TrendingUp,
    title: "Rank Tracking",
    description: "Real-time monitoring of your keyword rankings across Google, Bing, and AI search engines.",
    color: "from-coral to-coral-dark",
    gradient: "from-coral/10 to-coral-dark/5",
    highlights: ["Daily rank updates", "Local & global tracking", "SERP feature monitoring"],
  },
  {
    icon: BarChart3,
    title: "Competitor Analysis",
    description: "See exactly what your competitors are doing and find gaps to exploit.",
    color: "from-cyan to-cyan-dark",
    gradient: "from-cyan/10 to-cyan-dark/5",
    highlights: ["Traffic estimation", "Keyword gap analysis", "Backlink comparison"],
  },
  {
    icon: Zap,
    title: "Keyword Research",
    description: "Discover high-intent keywords with search volume, difficulty, and opportunity scores.",
    color: "from-coral to-coral-dark",
    gradient: "from-coral/10 to-coral-dark/5",
    highlights: ["Search intent analysis", "Long-tail suggestions", "Trend forecasting"],
  },
  {
    icon: Target,
    title: "Content Optimization",
    description: "AI-powered recommendations to optimize your content for better rankings.",
    color: "from-pink to-pink-dark",
    gradient: "from-pink/10 to-pink-dark/5",
    highlights: ["NLP-powered analysis", "Semantic optimization", "Readability scoring"],
  },
  {
    icon: Sparkles,
    title: "AI Insights",
    description: "Machine learning algorithms predict ranking changes and opportunities before they happen.",
    color: "from-coral-light to-cyan",
    gradient: "from-coral-light/10 to-cyan/5",
    highlights: ["Predictive analytics", "Algorithm updates", "Opportunity alerts"],
  },
  {
    icon: Chrome,
    title: "Site Audits",
    description: "Comprehensive technical SEO audits with actionable recommendations.",
    color: "from-cyan-light to-coral",
    gradient: "from-cyan-light/10 to-coral/5",
    highlights: ["200+ checkpoints", "Priority scoring", "One-click fixes"],
  },
];

// Testimonials data
const testimonials = [
  {
    name: "Sarah Chen",
    role: "SEO Director",
    company: "TechGrowth Co",
    testimonial: "Rankify transformed how we manage SEO. Our rankings increased by 47% in 3 months. The AI insights are genuinely predictive.",
    avatar: "SC",
    rating: 5,
  },
  {
    name: "Marcus Johnson",
    role: "Agency Owner",
    company: "Digital Velocity",
    testimonial: "The competitor analysis feature alone is worth 10x the price. Game-changer for our clients. We've onboarded 15 new accounts.",
    avatar: "MJ",
    rating: 5,
  },
  {
    name: "Emma Rodriguez",
    role: "Content Strategist",
    company: "Creative Minds",
    testimonial: "AI insights help us predict ranking changes. We're always one step ahead now. Content scores improved by 40%.",
    avatar: "ER",
    rating: 5,
  },
  {
    name: "David Park",
    role: "Founder",
    company: "SEO Innovations",
    testimonial: "Best investment we've made. Rankify pays for itself with every client we onboard. ROI within first week.",
    avatar: "DP",
    rating: 5,
  },
];

// Trusted by logos
const trustedBy = [
  { name: "Forbes", logo: "Forbes" },
  { name: "TechCrunch", logo: "TechCrunch" },
  { name: "Wired", logo: "Wired" },
  { name: "ProductHunt", logo: "ProductHunt" },
  { name: "Mashable", logo: "Mashable" },
];

export default function Home() {
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null);
  const [demoStep, setDemoStep] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  
  const heroRef = useRef<HTMLElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);

  // Animated counters for stats - these count from 0 when visible
  const stat1 = useAnimatedCounter(statsData[0].value, 2000);
  const stat2 = useAnimatedCounter(statsData[1].value, 2500);
  const stat3 = useAnimatedCounter(statsData[2].value, 1800);
  const stats = [stat1, stat2, stat3];

  // Demo animation steps
  const demoSteps = [
    { label: "Enter URL", duration: 1 },
    { label: "Analyzing Content", duration: 1.5 },
    { label: "Scanning Competitors", duration: 1.5 },
    { label: "Optimizing Strategy", duration: 1.5 },
    { label: "Ranking Boost", duration: 1 },
  ];

  // Page load animation
  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // Auto-play demo steps
  useEffect(() => {
    const interval = setInterval(() => {
      setDemoStep((prev) => (prev >= demoSteps.length - 1 ? 0 : prev + 1));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  // Initial hero animations with stagger
  useEffect(() => {
    if (!isLoaded) return;
    
    // Hero content animations with stagger
    anime({
      targets: badgeRef.current,
      opacity: [0, 1],
      translateY: [20, 0],
      duration: 600,
      delay: 200,
      easing: 'easeOutCubic',
    });

    anime({
      targets: headlineRef.current,
      opacity: [0, 1],
      translateY: [20, 0],
      duration: 600,
      delay: 280,
      easing: 'easeOutCubic',
    });

    anime({
      targets: descRef.current,
      opacity: [0, 1],
      translateY: [20, 0],
      duration: 600,
      delay: 360,
      easing: 'easeOutCubic',
    });

    anime({
      targets: buttonsRef.current,
      opacity: [0, 1],
      translateY: [20, 0],
      duration: 600,
      delay: 440,
      easing: 'easeOutCubic',
    });

    // Arrow animation loop
    anime({
      targets: '.arrow-icon',
      translateX: [0, 4, 0],
      duration: 1500,
      loop: true,
      easing: 'easeInOutQuad',
    });
  }, [isLoaded]);

  // Feature hover animation
  const handleFeatureHover = (idx: number) => {
    setHoveredFeature(idx);
    anime({
      targets: `.feature-card-${idx}`,
      translateY: -8,
      duration: 300,
      easing: 'easeOutCubic',
    });
    anime({
      targets: `.feature-icon-${idx}`,
      scale: 1.15,
      rotate: 5,
      duration: 300,
      easing: 'easeOutCubic',
    });
  };

  const handleFeatureLeave = (idx: number) => {
    anime({
      targets: `.feature-card-${idx}`,
      translateY: 0,
      duration: 300,
      easing: 'easeOutCubic',
    });
    anime({
      targets: `.feature-icon-${idx}`,
      scale: 1,
      rotate: 0,
      duration: 300,
      easing: 'easeOutCubic',
    });
    setHoveredFeature(null);
  };

  return (
    <div className="min-h-screen bg-black text-foreground overflow-x-hidden transition-colors duration-300">
      {/* Page Load Overlay */}
      {!isLoaded && (
        <div className="fixed inset-0 z-[100] bg-black flex items-center justify-center">
          <div className="text-center">
            <div className="text-4xl font-bold mb-4 text-coral animate-pulse">Rankify</div>
            <div className="flex gap-2 justify-center">
              <div className="w-2 h-2 bg-coral rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <div className="w-2 h-2 bg-cyan rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <div className="w-2 h-2 bg-coral rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        </div>
      )}
      
      {/* Unified Navigation - Single Source of Truth */}
      <Navigation animated />

      {/* Hero Section */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center pt-24 md:pt-28 overflow-hidden" aria-labelledby="hero-heading">
        {/* Hero Background Image */}
        <div className="absolute inset-0 z-0" aria-hidden="true">
          <img 
            src="/hero-bg.png" 
            alt="" 
            className="absolute inset-0 w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/60 to-black/90"></div>
        </div>

        {/* Content */}
        <div className="container relative z-10 max-w-5xl mx-auto px-4 md:px-6">
          <div ref={badgeRef} className="text-center mb-8 opacity-0">
            <div className="rankify-badge inline-flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan"></span>
              </span>
              🚀 Rank Higher, Faster, Smarter
            </div>
          </div>

          <h1 id="hero-heading" ref={headlineRef} className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.1] tracking-tight mb-4 md:mb-6 text-center opacity-0 text-white">
            <span className="inline">Dominate Search Rankings on </span>
            <span className="text-coral">Google & AI, </span>
            <span className="inline">Outrank Competitors.</span>
          </h1>

          <p ref={descRef} className="text-sm md:text-base lg:text-lg text-slate-400 mb-6 md:mb-8 max-w-3xl mx-auto leading-relaxed text-center opacity-0 px-4">
            The all-in-one SEO platform that combines real-time analytics, AI-powered insights, and competitive intelligence. Watch your rankings soar while competitors wonder what happened.
          </p>

          <div ref={buttonsRef} className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center items-center mb-8 md:mb-12 opacity-0">
            <Link
              href="/website-audit"
              className="rankify-button magnetic-btn flex items-center gap-2 group primary-cta-btn text-sm md:text-base px-6 md:px-8 py-3 md:py-4 w-full sm:w-auto"
              aria-label="Start ranking now with Rankify"
            >
              <span className="flex items-center gap-2">
                Start Ranking Now
                <ArrowRight className="w-4 h-4 arrow-icon transition-transform group-hover:translate-x-1" aria-hidden="true" />
              </span>
            </Link>
            <button className="rankify-button-outline flex items-center gap-2 text-sm md:text-base px-6 md:px-8 py-3 md:py-4 w-full sm:w-auto" aria-label="Watch product demo">
              <Play className="w-4 h-4" />
              Watch Demo
            </button>
          </div>

          {/* Animated Stats - Numbers count from 0 when visible */}
          <div className="grid grid-cols-3 gap-4 md:gap-8 pt-8 md:pt-12 border-t border-zinc-800">
            {statsData.map((stat, idx) => (
              <div 
                key={idx} 
                ref={stats[idx].elementRef}
                className="text-center"
              >
                <div className={`text-xl sm:text-2xl md:text-4xl font-bold mb-1 ${stat.color} tabular-nums`}>
                  {stats[idx].count.toLocaleString()}{stat.suffix}
                </div>
                <div className="text-xs md:text-sm text-slate-500">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trusted By Section - Light Alternate */}
      <section className="py-12 bg-white/5 backdrop-blur-sm border-y border-zinc-800/50">
        <div className="container max-w-6xl px-4 md:px-6 mx-auto">
          <p className="text-center text-sm text-zinc-500 mb-6">TRUSTED BY INDUSTRY LEADERS</p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
            {trustedBy.map((company, idx) => (
              <div key={idx} className="text-zinc-600 font-bold text-lg md:text-xl opacity-50 hover:opacity-100 transition-opacity cursor-default">
                {company.logo}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Animated Demo Section - Dark */}
      <section className="py-12 md:py-24 relative overflow-hidden demo-section bg-black" aria-labelledby="demo-heading">
        <div className="container max-w-6xl px-4 md:px-6 mx-auto">
          <div className="text-center mb-8 md:mb-16 demo-header">
            <h2 id="demo-heading" className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3 md:mb-4 text-white">
              See Rankify <span className="text-cyan">in Action</span>
            </h2>
            <p className="text-base md:text-lg text-zinc-400 max-w-2xl mx-auto px-4">
              Watch how Rankify analyzes your website and propels it to the top of search results
            </p>
          </div>

          {/* macOS Window Demo */}
          <div className="relative demo-window" role="region" aria-label="Product demonstration">
            {/* macOS Window Frame */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-lg md:rounded-2xl overflow-hidden shadow-2xl">
              {/* Window Header */}
              <div className="bg-gradient-to-b from-zinc-700 to-zinc-800 px-3 md:px-6 py-2 md:py-4 flex items-center justify-between">
                <div className="flex items-center gap-2 md:gap-3 flex-1">
                  <div className="flex gap-1.5 md:gap-2">
                    <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-red-500" aria-hidden="true" />
                    <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-yellow-500" aria-hidden="true" />
                    <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-green-500" aria-hidden="true" />
                  </div>
                  <div className="text-xs md:text-sm text-zinc-400 font-medium truncate">rankify.com/analyze</div>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <Maximize2 className="w-3 h-3 md:w-4 md:h-4 text-zinc-500" aria-hidden="true" />
                  <Chrome className="w-3 h-3 md:w-4 md:h-4 text-zinc-500" aria-hidden="true" />
                </div>
              </div>

              {/* Window Content */}
              <div className="bg-zinc-950 p-4 md:p-8 min-h-64 md:min-h-96 relative overflow-hidden">
                {/* Input Section */}
                <div className="mb-6 md:mb-8">
                  <label htmlFor="demo-url-input" className="text-xs md:text-sm font-semibold text-cyan mb-2 block">Enter Your Website URL</label>
                  <div className="flex flex-col sm:flex-row gap-2 md:gap-3">
                    <input
                      id="demo-url-input"
                      type="text"
                      placeholder="https://yourwebsite.com"
                      className="flex-1 bg-zinc-900 border border-zinc-700 rounded-lg px-3 md:px-4 py-2 md:py-3 text-sm md:text-base text-white placeholder-zinc-500 focus:outline-none focus:border-cyan focus:ring-2 focus:ring-cyan/50"
                      defaultValue="https://example-ecommerce.com"
                      readOnly
                      aria-label="Website URL for analysis"
                    />
                    <button className="bg-gradient-to-r from-coral to-cyan text-white px-4 md:px-6 py-2 md:py-3 rounded-lg text-sm md:text-base font-semibold hover:scale-105 transition-transform focus:outline-none focus:ring-2 focus:ring-coral w-full sm:w-auto" aria-label="Start analysis">
                      Analyze
                    </button>
                  </div>
                </div>

                {/* Processing Steps */}
                <div className="space-y-3 md:space-y-4">
                  {demoSteps.map((step, idx) => (
                    <div key={idx} className="flex items-center gap-3 md:gap-4 demo-step" role="status" aria-live="polite">
                      <div className="relative w-6 h-6 md:w-8 md:h-8 flex-shrink-0">
                        {idx === demoStep ? (
                          <Loader2 className="w-full h-full text-cyan animate-spin" aria-label="Processing" />
                        ) : idx < demoStep ? (
                          <div className="w-full h-full rounded-full bg-coral/20 border-2 border-coral flex items-center justify-center">
                            <CheckCircle2 className="w-4 h-4 md:w-5 md:h-5 text-coral" aria-label="Completed" />
                          </div>
                        ) : (
                          <div className="w-full h-full rounded-full border-2 border-zinc-700" aria-hidden="true" />
                        )}
                      </div>
                      <span className={`font-medium text-sm md:text-base flex-1 ${idx <= demoStep ? "text-cyan" : "text-zinc-600"}`}>
                        {step.label}
                      </span>
                      {idx < demoStep && (
                        <div className="ml-auto text-coral text-sm md:text-base" aria-hidden="true">
                          ✓
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Results Display */}
                {demoStep >= demoSteps.length - 1 && (
                  <div className="mt-6 md:mt-8 p-4 md:p-6 bg-gradient-to-r from-coral/10 to-cyan/10 border border-coral/30 rounded-lg demo-results" role="region" aria-label="Analysis results">
                    <h3 className="font-bold text-cyan mb-3 md:mb-4 text-sm md:text-base">🎯 Results: Your Site Now Ranks #1</h3>
                    <div className="grid grid-cols-3 gap-2 md:gap-4">
                      <div>
                        <div className="text-lg md:text-2xl font-bold text-coral">↑ 47%</div>
                        <div className="text-xs md:text-sm text-zinc-500">Ranking Improvement</div>
                      </div>
                      <div>
                        <div className="text-lg md:text-2xl font-bold text-coral">+12K</div>
                        <div className="text-xs md:text-sm text-zinc-500">New Organic Clicks</div>
                      </div>
                      <div>
                        <div className="text-lg md:text-2xl font-bold text-coral">3 Days</div>
                        <div className="text-xs md:text-sm text-zinc-500">Time to #1</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Demo Step Controller */}
            <div className="flex justify-center gap-2 mt-8">
              {demoSteps.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setDemoStep(idx)}
                  className={`h-3 rounded-full transition-all ${
                    idx <= demoStep ? "bg-cyan w-8" : "bg-zinc-700 w-3"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - Light Alternate */}
      <section id="features" className="py-16 md:py-24 relative overflow-hidden bg-gradient-to-b from-zinc-900/50 to-black">
        <div className="container max-w-6xl px-4 md:px-6 mx-auto">
          <div className="text-center mb-8 md:mb-16">
            <span className="text-coral text-sm font-semibold tracking-wider uppercase mb-2 block">Powerful Tools</span>
            <h2 id="features-heading" className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3 md:mb-4 text-white">
              Everything You Need to <span className="text-coral">Rank Higher</span>
            </h2>
            <p className="text-base md:text-lg text-zinc-400 max-w-2xl mx-auto px-4">
              Powerful tools designed for modern SEO professionals. Simple enough for beginners, powerful enough for agencies.
            </p>
          </div>

          {/* Features Grid with Highlights */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, idx) => (
              <div
                key={idx}
                onMouseEnter={() => handleFeatureHover(idx)}
                onMouseLeave={() => handleFeatureLeave(idx)}
                className="group relative"
              >
                <div className={`rankify-card card-3d h-full feature-card-${idx} relative overflow-hidden transition-all duration-300 ${hoveredFeature === idx ? '-translate-y-2' : ''}`}>
                  {/* Gradient background on hover */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                  
                  {/* Shimmer effect */}
                  <div className="absolute inset-0 shimmer opacity-0 group-hover:opacity-100" />
                  
                  <div className="relative z-10">
                    <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${feature.color} text-white flex items-center justify-center mb-4 feature-icon-${idx} group-hover:shadow-lg transition-all duration-300 ${hoveredFeature === idx ? 'scale-110 rotate-3' : ''}`}>
                      <feature.icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-bold mb-2 group-hover:text-coral transition-colors duration-300">{feature.title}</h3>
                    <p className="text-sm text-zinc-400 leading-relaxed">{feature.description}</p>
                    
                    {/* Feature highlights on hover */}
                    <div className="mt-4 pt-4 border-t border-zinc-800 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <ul className="space-y-1">
                        {feature.highlights.map((highlight, i) => (
                          <li key={i} className="flex items-center gap-2 text-xs text-zinc-400">
                            <CheckCircle2 className="w-3 h-3 text-emerald" />
                            {highlight}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  
                  {/* Corner accent */}
                  <div className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-br ${feature.color} opacity-5 rounded-bl-full`} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Rankify Section - White Alternate */}
      <section className="py-16 md:py-24 bg-white text-zinc-900">
        <div className="container max-w-6xl px-4 md:px-6 mx-auto">
          <div className="text-center mb-12">
            <span className="text-coral text-sm font-semibold tracking-wider uppercase mb-2 block">Why Choose Us</span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-zinc-900">
              Built for <span className="text-coral">Results</span>
            </h2>
            <p className="text-base md:text-lg text-zinc-600 max-w-2xl mx-auto">
              We obsess over the details so you can focus on what matters - growing your business.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Rocket, title: "Lightning Fast", desc: "Real-time data updates every 15 minutes", color: "bg-coral/10 text-coral" },
              { icon: Shield, title: "99.9% Uptime", desc: "Enterprise-grade reliability you can trust", color: "bg-cyan/10 text-cyan" },
              { icon: Globe, title: "200+ Countries", desc: "Track rankings in any location worldwide", color: "bg-emerald/10 text-emerald" },
              { icon: Users, title: "24/7 Support", desc: "Expert help whenever you need it", color: "bg-pink/10 text-pink" },
            ].map((item, idx) => (
              <div key={idx} className="text-center p-6 rounded-2xl bg-zinc-50 hover:bg-zinc-100 transition-colors group">
                <div className={`w-14 h-14 mx-auto mb-4 rounded-xl ${item.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  <item.icon className="w-7 h-7" />
                </div>
                <h3 className="text-lg font-bold mb-2">{item.title}</h3>
                <p className="text-sm text-zinc-600">{item.desc}</p>
              </div>
            ))}
          </div>

          {/* Metrics bar */}
          <div className="mt-16 p-8 bg-gradient-to-r from-coral/10 via-cyan/10 to-emerald/10 rounded-2xl">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {[
                { value: "2M+", label: "Websites Audited" },
                { value: "500M+", label: "Keywords Tracked" },
                { value: "99.9%", label: "Accuracy Rate" },
                { value: "4.9★", label: "User Rating" },
              ].map((metric, idx) => (
                <div key={idx}>
                  <div className="text-2xl md:text-3xl font-bold text-coral">{metric.value}</div>
                  <div className="text-sm text-zinc-600">{metric.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section - Dark */}
      <section className="py-16 md:py-24 bg-black relative overflow-hidden" aria-labelledby="testimonials-heading">
        <div className="absolute inset-0 -z-10" aria-hidden="true">
          <div className="absolute top-1/2 right-0 w-64 h-64 md:w-96 md:h-96 bg-cyan/10 rounded-full blur-3xl" />
        </div>

        <div className="container max-w-6xl px-4 md:px-6 mx-auto">
          <div className="text-center mb-12">
            <span className="text-cyan text-sm font-semibold tracking-wider uppercase mb-2 block">Testimonials</span>
            <h2 id="testimonials-heading" className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-white">
              Trusted by <span className="text-coral">Leading Agencies</span>
            </h2>
            <p className="text-lg text-zinc-400">
              Join thousands of SEO professionals using Rankify to dominate search results.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {testimonials.map((testimonial, idx) => (
              <div key={idx} className="rankify-card p-6 hover:border-coral/30 transition-colors">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-coral to-cyan text-white flex items-center justify-center font-bold">
                    {testimonial.avatar}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-white">{testimonial.name}</h4>
                    <p className="text-sm text-zinc-400">{testimonial.role} at {testimonial.company}</p>
                  </div>
                  <div className="flex gap-0.5">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                </div>
                <p className="text-zinc-300 italic">&ldquo;{testimonial.testimonial}&rdquo;</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section - White Alternate */}
      <section className="py-16 md:py-24 bg-white text-zinc-900" aria-labelledby="cta-heading">
        <div className="container max-w-4xl text-center px-4 md:px-6 mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-coral/10 text-coral rounded-full text-sm font-medium mb-6">
            <Clock className="w-4 h-4" />
            Limited Time: 20% off all plans
          </div>
          
          <h2 id="cta-heading" className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6">
            Ready to <span className="text-coral">Dominate</span> Your Niche?
          </h2>
          <p className="text-base md:text-lg text-zinc-600 mb-8 max-w-2xl mx-auto">
            Join thousands of successful SEO professionals. Start your free trial today—no credit card required.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <Link
              href="/website-audit"
              className="rankify-button flex items-center gap-2 text-base md:text-lg px-6 md:px-8 py-3 md:py-4 w-full sm:w-auto"
            >
              Start Free Trial
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/pricing"
              className="rankify-button-outline text-base md:text-lg px-6 md:px-8 py-3 md:py-4 w-full sm:w-auto !text-zinc-900 !border-zinc-300 hover:!border-coral"
            >
              View Pricing
            </Link>
          </div>

          <div className="flex flex-wrap justify-center gap-6 text-sm text-zinc-500">
            <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald" /> Free 14-day trial</span>
            <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald" /> No credit card required</span>
            <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald" /> Cancel anytime</span>
          </div>
        </div>
      </section>

      {/* Footer - Using shared component */}
      <Footer />
    </div>
  );
}
