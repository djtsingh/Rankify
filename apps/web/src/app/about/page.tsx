import PageLayout from "@/components/layout/PageLayout";
import { Target, Users, Zap, Heart, Globe, Award, TrendingUp, Lightbulb } from "lucide-react";
import Image from "next/image";

export const metadata = {
  title: "About",
  description: "Rankify's mission to make SEO accessible for all businesses.",
};

export default function AboutPage() {
  return (
    <PageLayout
      title="About Rankify"
      description="We're on a mission to make world-class SEO accessible to everyone. From solo entrepreneurs to enterprise agencies, we believe every business deserves to be found online."
    >
      <div className="space-y-12">
        {/* Mission Statement */}
        <section className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-8 md:p-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-lg bg-coral text-white flex items-center justify-center">
              <Target className="w-6 h-6" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white">Our Mission</h2>
          </div>
          <p className="text-xl leading-relaxed text-slate-300 mb-6">
            To democratize SEO by providing powerful, AI-driven insights that help businesses of all sizes
            compete and win in search rankings—without needing a team of experts or a massive budget.
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-zinc-900 backdrop-blur border border-zinc-800 rounded-xl p-6">
              <div className="text-4xl font-bold text-coral mb-2">500M+</div>
              <p className="text-sm text-slate-400">Keywords Tracked Daily</p>
            </div>
            <div className="bg-zinc-900 backdrop-blur border border-zinc-800 rounded-xl p-6">
              <div className="text-4xl font-bold text-cyan mb-2">50K+</div>
              <p className="text-sm text-slate-400">Happy Customers</p>
            </div>
            <div className="bg-zinc-900 backdrop-blur border border-zinc-800 rounded-xl p-6">
              <div className="text-4xl font-bold text-coral mb-2">47%</div>
              <p className="text-sm text-slate-400">Avg. Ranking Improvement</p>
            </div>
          </div>
        </section>

        {/* Our Story */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-lg bg-coral text-white flex items-center justify-center">
              <Lightbulb className="w-6 h-6" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white">Why We Built Rankify</h2>
          </div>

          <div className="space-y-6 text-lg leading-relaxed text-slate-300">
            <p>
              In 2023, our founders—former SEO consultants and software engineers—saw a glaring problem: 
              <strong className="text-coral"> SEO tools were either too complex for beginners or too limited for professionals.</strong>
            </p>

            <p>
              Small businesses were stuck with basic tools that didn't deliver real insights. Agencies were juggling
              5-10 different platforms just to get a complete picture. Meanwhile, search engines were evolving faster
              than ever with AI-powered results, zero-click searches, and constantly changing algorithms.
            </p>

            <p className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 italic text-slate-300">
              "I asked myself: What if there was one platform that combined enterprise-grade analytics with
              dead-simple usability? What if AI could predict ranking changes <em>before</em> they happen? What if
              small businesses could compete with Fortune 500 companies on a level playing field?"
              <span className="block mt-4 text-sm text-slate-500 not-italic">
                — Daljeet Singh, Founder & CEO
              </span>
            </p>

            <p>
              That question became Rankify. We spent 18 months building a platform that:
            </p>

            <ul className="list-disc pl-6 space-y-2 text-base">
              <li><strong>Just works:</strong> No PhD in SEO required. Set up in 5 minutes, get insights immediately.</li>
              <li><strong>Predicts the future:</strong> Machine learning spots ranking changes weeks before they happen.</li>
              <li><strong>Speaks human:</strong> No jargon, no confusing metrics—just clear, actionable recommendations.</li>
              <li><strong>Scales with you:</strong> From solo blogger to 100-person agency, one platform does it all.</li>
            </ul>

            <p>
              Today, Rankify powers SEO strategies for over 50,000 businesses in 120+ countries. Our users have
              collectively gained over 2 billion organic impressions since launch. But we're just getting started.
            </p>
          </div>
        </section>

        {/* Values */}
        <section>
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-brand-highlight to-brand-highlight-dark text-white flex items-center justify-center">
              <Heart className="w-6 h-6" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white">Our Values</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                icon: Users,
                title: "Users First, Always",
                description: "Every feature, every decision starts with one question: Does this help our users rank higher? If not, we don't build it.",
                color: "emerald",
              },
              {
                icon: Zap,
                title: "Speed & Simplicity",
                description: "Complex doesn't mean good. We obsess over removing friction, automating busywork, and getting you insights in seconds, not hours.",
                color: "cyan",
              },
              {
                icon: TrendingUp,
                title: "Relentless Innovation",
                description: "Search engines evolve daily. So do we. We ship new features every week, powered by the latest AI and SEO research.",
                color: "coral",
              },
              {
                icon: Globe,
                title: "Transparency & Trust",
                description: "No hidden fees, no dark patterns, no sketchy tactics. We're upfront about pricing, data usage, and how our platform works.",
                color: "pink",
              },
            ].map((value, idx) => (
              <div
                key={idx}
                className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 hover:border-coral/50 transition-all duration-300 group"
              >
                <div className={`w-14 h-14 rounded-lg bg-${value.color} text-white flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <value.icon className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-white group-hover:text-coral transition-colors">
                  {value.title}
                </h3>
                <p className="text-slate-400 leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Team */}
        <section>
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-lg bg-cyan text-white flex items-center justify-center">
              <Users className="w-6 h-6" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-white">Meet the Team</h2>
          </div>

          <p className="text-lg text-muted-foreground mb-8">
            We're a remote-first team of 47 SEO experts, data scientists, engineers, and designers spread across
            15 countries. What unites us? An obsession with helping businesses win online.
          </p>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {[
              {
                name: "Alex Chen",
                role: "Co-Founder & CEO",
                bio: "Former Head of SEO at TechCorp. Built SEO teams for 3 unicorn startups. 12 years in search.",
                avatar: "AC",
                gradient: "from-brand-primary to-brand-secondary",
              },
              {
                name: "Sarah Martinez",
                role: "Co-Founder & CTO",
                bio: "Ex-Google engineer. Led machine learning projects for Search Quality. MIT CS grad.",
                avatar: "SM",
                gradient: "from-brand-accent to-brand-highlight",
              },
              {
                name: "David Park",
                role: "VP of Product",
                bio: "Former Product Lead at SEMrush. Shipped 50+ features used by millions. Stanford MBA.",
                avatar: "DP",
                gradient: "from-brand-secondary to-brand-primary",
              },
            ].map((member, idx) => (
              <div
                key={idx}
                className="bg-card border border-border rounded-xl p-6 hover:border-brand-primary/50 transition-all duration-300 group"
              >
                <div className={`w-20 h-20 rounded-full bg-gradient-to-br ${member.gradient} text-white flex items-center justify-center text-2xl font-bold mb-4 mx-auto`}>
                  {member.avatar}
                </div>
                <h3 className="text-xl font-bold text-center mb-1 group-hover:text-brand-primary transition-colors">
                  {member.name}
                </h3>
                <p className="text-sm text-brand-primary text-center mb-3">{member.role}</p>
                <p className="text-sm text-muted-foreground text-center leading-relaxed">
                  {member.bio}
                </p>
              </div>
            ))}
          </div>

          <div className="bg-muted/50 border border-border rounded-xl p-6 text-center">
            <p className="text-lg mb-4">
              <strong>We're hiring!</strong> Want to help shape the future of SEO?
            </p>
            <a
              href="/careers"
              className="rankify-button inline-flex items-center gap-2"
            >
              View Open Positions
            </a>
          </div>
        </section>

        {/* Recognition */}
        <section>
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-brand-highlight to-brand-highlight-dark text-white flex items-center justify-center">
              <Award className="w-6 h-6" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold">Recognition & Awards</h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                title: "Best SEO Tool 2025",
                org: "G2 Crowd",
                badge: "🏆",
              },
              {
                title: "Fastest Growing SaaS",
                org: "TechCrunch",
                badge: "🚀",
              },
              {
                title: "Top 10 Marketing Tools",
                org: "Product Hunt",
                badge: "⭐",
              },
              {
                title: "Y Combinator S23",
                org: "YC Portfolio",
                badge: "🧡",
              },
            ].map((award, idx) => (
              <div
                key={idx}
                className="bg-card border border-border rounded-lg p-4 text-center hover:border-brand-primary/50 transition-all"
              >
                <div className="text-4xl mb-2">{award.badge}</div>
                <h4 className="font-semibold mb-1 text-sm">{award.title}</h4>
                <p className="text-xs text-muted-foreground">{award.org}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Vision */}
        <section className="bg-gradient-to-br from-brand-primary/10 via-brand-secondary/10 to-brand-accent/10 border border-border rounded-2xl p-8 md:p-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-brand-accent to-brand-highlight text-white flex items-center justify-center">
              <Globe className="w-6 h-6" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold">Our Vision for the Future</h2>
          </div>

          <div className="space-y-6 text-lg leading-relaxed">
            <p>
              We envision a world where <strong className="text-brand-primary">every business—no matter how small—can compete
              for attention online.</strong> Where SEO isn't a dark art reserved for experts, but a transparent, AI-powered
              process anyone can master.
            </p>

            <p>
              Over the next 5 years, we're building toward:
            </p>

            <ul className="list-disc pl-6 space-y-2 text-base">
              <li><strong>Predictive SEO:</strong> AI that tells you exactly what to optimize <em>before</em> rankings drop</li>
              <li><strong>Voice & Visual Search:</strong> Optimize for how people actually search (not just text)</li>
              <li><strong>AI-Generated Content:</strong> Automatically create SEO-optimized content that ranks</li>
              <li><strong>Global Expansion:</strong> Support for 50+ languages and region-specific search engines</li>
              <li><strong>Open Standards:</strong> Help establish transparent, ethical SEO practices industry-wide</li>
            </ul>

            <p className="italic text-muted-foreground">
              "Our north star: In 10 years, when someone asks 'How do I rank on Google?', the answer should be simple: 'Use Rankify.'"
            </p>
          </div>
        </section>

        {/* CTA */}
        <section className="text-center bg-card border border-border rounded-2xl p-8 md:p-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Join 50,000+ Businesses Winning with Rankify
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Start ranking higher today. No credit card required for your 14-day trial.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a href="/" className="rankify-button text-lg px-8 py-4">
              Start Free Trial
            </a>
            <a href="/contact" className="rankify-button-outline text-lg px-8 py-4">
              Talk to Sales
            </a>
          </div>
        </section>
      </div>
    </PageLayout>
  );
}
