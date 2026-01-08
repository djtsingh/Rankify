"use client";

import { useState } from "react";
import Link from "next/link";
import { Navigation } from "@/components/layout/Navigation";
import { Footer } from "@/components/layout/Footer";
import {
  Check,
  X,
  Zap,
  Crown,
  Building2,
  ArrowRight,
  HelpCircle,
  ChevronDown,
  Shield,
  Clock,
  Globe,
  Users,
  Sparkles,
  Star,
  MessageCircle,
} from "lucide-react";

// Pricing plans data
const plans = [
  {
    id: "free",
    name: "Free",
    description: "Perfect for trying out Rankify",
    price: { monthly: 0, annually: 0 },
    icon: Zap,
    color: "emerald",
    popular: false,
    cta: "Get Started Free",
    features: [
      { name: "1 website audit per day", included: true },
      { name: "Basic SEO analysis", included: true },
      { name: "50+ ranking factors checked", included: true },
      { name: "PDF report download", included: true },
      { name: "Email support", included: true },
      { name: "Competitor analysis", included: false },
      { name: "Historical tracking", included: false },
      { name: "White-label reports", included: false },
      { name: "API access", included: false },
      { name: "Priority support", included: false },
    ],
    limits: {
      audits: "1/day",
      projects: "1",
      teamMembers: "1",
    },
  },
  {
    id: "pro",
    name: "Pro",
    description: "For SEO professionals & agencies",
    price: { monthly: 49, annually: 39 },
    icon: Crown,
    color: "coral",
    popular: true,
    cta: "Start Pro Trial",
    features: [
      { name: "Unlimited website audits", included: true },
      { name: "Advanced SEO analysis", included: true },
      { name: "100+ ranking factors checked", included: true },
      { name: "PDF & CSV report exports", included: true },
      { name: "Priority email support", included: true },
      { name: "Competitor analysis (5 competitors)", included: true },
      { name: "30-day historical tracking", included: true },
      { name: "White-label reports", included: true },
      { name: "API access (1,000 calls/mo)", included: true },
      { name: "24/7 priority support", included: false },
    ],
    limits: {
      audits: "Unlimited",
      projects: "10",
      teamMembers: "3",
    },
  },
  {
    id: "enterprise",
    name: "Enterprise",
    description: "For large teams & organizations",
    price: { monthly: 199, annually: 159 },
    icon: Building2,
    color: "cyan",
    popular: false,
    cta: "Contact Sales",
    features: [
      { name: "Unlimited website audits", included: true },
      { name: "Enterprise-grade SEO analysis", included: true },
      { name: "150+ ranking factors checked", included: true },
      { name: "All export formats", included: true },
      { name: "24/7 dedicated support", included: true },
      { name: "Unlimited competitor analysis", included: true },
      { name: "Unlimited historical tracking", included: true },
      { name: "Custom white-label branding", included: true },
      { name: "API access (unlimited)", included: true },
      { name: "Dedicated account manager", included: true },
    ],
    limits: {
      audits: "Unlimited",
      projects: "Unlimited",
      teamMembers: "Unlimited",
    },
  },
];

// FAQ data
const faqs = [
  {
    q: "Can I switch plans at any time?",
    a: "Yes! You can upgrade or downgrade your plan at any time. When upgrading, you'll get immediate access to new features. When downgrading, changes take effect at the end of your current billing cycle.",
  },
  {
    q: "What payment methods do you accept?",
    a: "We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and bank transfers for annual Enterprise plans. All payments are processed securely through Stripe.",
  },
  {
    q: "Is there a free trial for paid plans?",
    a: "Yes! All paid plans come with a 14-day free trial. No credit card required. You'll have full access to all features during the trial period.",
  },
  {
    q: "What happens to my data if I cancel?",
    a: "Your data is retained for 30 days after cancellation. During this period, you can reactivate your account and restore all your data. After 30 days, data is permanently deleted per our privacy policy.",
  },
  {
    q: "Do you offer refunds?",
    a: "Yes, we offer a 30-day money-back guarantee for all paid plans. If you're not satisfied, contact our support team for a full refund.",
  },
  {
    q: "Can I get a custom plan for my agency?",
    a: "Absolutely! We offer custom Enterprise plans tailored to your agency's specific needs. Contact our sales team to discuss volume pricing and custom features.",
  },
];

// Trust indicators
const trustIndicators = [
  { icon: Users, value: "50,000+", label: "Active Users" },
  { icon: Star, value: "4.9/5", label: "User Rating" },
  { icon: Shield, value: "SOC 2", label: "Compliant" },
  { icon: Globe, value: "150+", label: "Countries" },
];

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annually">("annually");
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const annualSavings = 20; // percent

  return (
    <div className="min-h-screen bg-black">
      <Navigation />

      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4 relative overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-coral/10 rounded-full blur-[120px]"></div>
          <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-cyan/10 rounded-full blur-[100px]"></div>
        </div>

        <div className="container max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-coral/10 border border-coral/30 rounded-full mb-6">
            <Sparkles className="w-4 h-4 text-coral" />
            <span className="text-sm text-coral font-medium">Simple, Transparent Pricing</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
            Choose the Perfect Plan
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-coral to-cyan">
              for Your SEO Goals
            </span>
          </h1>

          <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-10">
            Start free, scale as you grow. All plans include our core SEO audit features.
            <br />No hidden fees, no surprises.
          </p>

          {/* Billing Toggle */}
          <div className="inline-flex items-center gap-4 p-1.5 bg-zinc-900 border border-zinc-800 rounded-xl mb-12">
            <button
              onClick={() => setBillingCycle("monthly")}
              className={`px-6 py-2.5 rounded-lg font-medium transition-all ${
                billingCycle === "monthly"
                  ? "bg-coral text-white"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle("annually")}
              className={`px-6 py-2.5 rounded-lg font-medium transition-all flex items-center gap-2 ${
                billingCycle === "annually"
                  ? "bg-coral text-white"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Annually
              <span className="text-xs bg-emerald/20 text-emerald px-2 py-0.5 rounded-full">
                Save {annualSavings}%
              </span>
            </button>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="pb-24 px-4">
        <div className="container max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
            {plans.map((plan) => {
              const Icon = plan.icon;
              const price = billingCycle === "annually" ? plan.price.annually : plan.price.monthly;
              const isPopular = plan.popular;

              return (
                <div
                  key={plan.id}
                  className={`relative p-6 lg:p-8 rounded-3xl border transition-all hover:scale-[1.02] ${
                    isPopular
                      ? "bg-gradient-to-b from-zinc-900 to-zinc-950 border-coral/50 shadow-xl shadow-coral/10"
                      : "bg-zinc-900/50 border-zinc-800 hover:border-zinc-700"
                  }`}
                >
                  {isPopular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-gradient-to-r from-coral to-pink rounded-full text-sm font-semibold text-white">
                      Most Popular
                    </div>
                  )}

                  {/* Plan Header */}
                  <div className="mb-6">
                    <div className={`inline-flex items-center justify-center w-12 h-12 bg-${plan.color}/10 rounded-xl mb-4`}>
                      <Icon className={`w-6 h-6 text-${plan.color}`} />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                    <p className="text-slate-400 text-sm">{plan.description}</p>
                  </div>

                  {/* Price */}
                  <div className="mb-6">
                    <div className="flex items-baseline gap-1">
                      <span className="text-5xl font-bold text-white">
                        ${price}
                      </span>
                      {price > 0 && (
                        <span className="text-slate-400">/month</span>
                      )}
                    </div>
                    {billingCycle === "annually" && price > 0 && (
                      <p className="text-sm text-slate-500 mt-1">
                        Billed ${price * 12}/year
                      </p>
                    )}
                  </div>

                  {/* CTA */}
                  <Link
                    href={plan.id === "enterprise" ? "/contact" : "/website-audit"}
                    className={`w-full py-3.5 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all mb-8 ${
                      isPopular
                        ? "bg-gradient-to-r from-coral to-pink text-white hover:shadow-lg hover:shadow-coral/30"
                        : "bg-zinc-800 text-white hover:bg-zinc-700 border border-zinc-700"
                    }`}
                  >
                    {plan.cta}
                    <ArrowRight className="w-4 h-4" />
                  </Link>

                  {/* Limits */}
                  <div className="grid grid-cols-3 gap-4 mb-6 p-4 bg-zinc-800/30 rounded-xl">
                    <div className="text-center">
                      <div className="text-lg font-bold text-white">{plan.limits.audits}</div>
                      <div className="text-xs text-slate-400">Audits</div>
                    </div>
                    <div className="text-center border-x border-zinc-700">
                      <div className="text-lg font-bold text-white">{plan.limits.projects}</div>
                      <div className="text-xs text-slate-400">Projects</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-white">{plan.limits.teamMembers}</div>
                      <div className="text-xs text-slate-400">Team</div>
                    </div>
                  </div>

                  {/* Features */}
                  <ul className="space-y-3">
                    {plan.features.map((feature, idx) => (
                      <li
                        key={idx}
                        className={`flex items-start gap-3 text-sm ${
                          feature.included ? "text-slate-300" : "text-slate-500"
                        }`}
                      >
                        {feature.included ? (
                          <Check className="w-5 h-5 text-emerald flex-shrink-0 mt-0.5" />
                        ) : (
                          <X className="w-5 h-5 text-zinc-600 flex-shrink-0 mt-0.5" />
                        )}
                        <span>{feature.name}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="py-12 px-4 border-y border-zinc-800 bg-zinc-950/50">
        <div className="container max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {trustIndicators.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div key={idx} className="text-center">
                  <Icon className="w-8 h-8 text-coral mx-auto mb-3" />
                  <div className="text-2xl font-bold text-white mb-1">{item.value}</div>
                  <div className="text-sm text-slate-400">{item.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Feature Comparison Table */}
      <section className="py-24 px-4">
        <div className="container max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Compare All Features
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto">
              See exactly what's included in each plan to make the best choice for your needs.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-zinc-800">
                  <th className="text-left p-4 text-slate-400 font-medium">Feature</th>
                  {plans.map((plan) => (
                    <th key={plan.id} className="p-4 text-center">
                      <span className={`text-${plan.color} font-bold`}>{plan.name}</span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  { feature: "Website Audits", free: "1/day", pro: "Unlimited", enterprise: "Unlimited" },
                  { feature: "Ranking Factors", free: "50+", pro: "100+", enterprise: "150+" },
                  { feature: "Projects", free: "1", pro: "10", enterprise: "Unlimited" },
                  { feature: "Team Members", free: "1", pro: "3", enterprise: "Unlimited" },
                  { feature: "Competitor Analysis", free: false, pro: "5 competitors", enterprise: "Unlimited" },
                  { feature: "Historical Tracking", free: false, pro: "30 days", enterprise: "Unlimited" },
                  { feature: "White-label Reports", free: false, pro: true, enterprise: "Custom branding" },
                  { feature: "API Access", free: false, pro: "1,000/mo", enterprise: "Unlimited" },
                  { feature: "Support", free: "Email", pro: "Priority", enterprise: "24/7 Dedicated" },
                ].map((row, idx) => (
                  <tr key={idx} className="border-b border-zinc-800/50">
                    <td className="p-4 text-slate-300">{row.feature}</td>
                    {["free", "pro", "enterprise"].map((planId) => {
                      const value = row[planId as keyof typeof row];
                      return (
                        <td key={planId} className="p-4 text-center">
                          {typeof value === "boolean" ? (
                            value ? (
                              <Check className="w-5 h-5 text-emerald mx-auto" />
                            ) : (
                              <X className="w-5 h-5 text-zinc-600 mx-auto" />
                            )
                          ) : (
                            <span className="text-slate-300">{value}</span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 px-4">
        <div className="container max-w-4xl mx-auto">
          <div className="relative bg-zinc-900/60 backdrop-blur-xl border border-zinc-800 rounded-3xl p-8 md:p-12">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-cyan/10 border border-cyan/30 rounded-full mb-6">
                <HelpCircle className="w-4 h-4 text-cyan" />
                <span className="text-sm text-cyan font-medium">Have Questions?</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Frequently Asked Questions
              </h2>
            </div>

            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div
                  key={index}
                  className="bg-zinc-800/50 border border-zinc-700 rounded-2xl overflow-hidden"
                >
                  <button
                    onClick={() => setOpenFaq(openFaq === index ? null : index)}
                    className="w-full px-6 py-5 flex items-center justify-between text-left group"
                  >
                    <span className="text-lg font-semibold text-white group-hover:text-coral transition-colors pr-4">
                      {faq.q}
                    </span>
                    <div
                      className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                        openFaq === index ? "bg-coral text-white rotate-180" : "bg-zinc-700 text-slate-400"
                      }`}
                    >
                      <ChevronDown className="w-5 h-5" />
                    </div>
                  </button>
                  <div
                    className={`overflow-hidden transition-all duration-300 ${
                      openFaq === index ? "max-h-96" : "max-h-0"
                    }`}
                  >
                    <div className="px-6 pb-6 text-slate-400 leading-relaxed">{faq.a}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 px-4">
        <div className="container max-w-4xl mx-auto">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-coral/30 via-pink/30 to-cyan/30 rounded-3xl blur-3xl opacity-50"></div>

            <div className="relative p-12 md:p-16 bg-zinc-900/90 backdrop-blur-xl border border-zinc-800 rounded-3xl text-center">
              <div className="absolute top-0 left-0 w-32 h-32 bg-coral/20 rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 right-0 w-32 h-32 bg-cyan/20 rounded-full blur-3xl"></div>

              <div className="relative">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                  Still Have Questions?
                </h2>
                <p className="text-xl text-slate-400 mb-8 max-w-2xl mx-auto">
                  Our team is here to help you find the perfect plan for your needs.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link
                    href="/website-audit"
                    className="px-8 py-4 bg-gradient-to-r from-coral to-pink rounded-xl font-semibold text-white flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-coral/30 transition-all"
                  >
                    <Zap className="w-5 h-5" />
                    Start Free Trial
                  </Link>
                  <Link
                    href="/contact"
                    className="px-8 py-4 bg-zinc-800 border border-zinc-700 rounded-xl font-semibold text-white flex items-center justify-center gap-2 hover:bg-zinc-700 transition-all"
                  >
                    <MessageCircle className="w-5 h-5" />
                    Talk to Sales
                  </Link>
                </div>

                <p className="mt-6 text-sm text-slate-500">
                  <Clock className="w-4 h-4 inline mr-1" />
                  14-day free trial • No credit card required • Cancel anytime
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
