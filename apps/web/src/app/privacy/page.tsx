import PageLayout from "@/components/layout/PageLayout";

export const metadata = {
  title: "Privacy Policy",
  description: "Learn how Rankify collects, uses, and protects your personal data. GDPR and CCPA compliant.",
};

export default function PrivacyPage() {
  const effectiveDate = "February 15, 2026";
  
  return (
    <PageLayout
      title="Privacy Policy"
      description="Your privacy matters. This policy explains how we handle your data."
      lastUpdated={effectiveDate}
    >
      <div className="space-y-10 text-slate-300">
        
        {/* Introduction */}
        <section>
          <p className="text-lg leading-relaxed">
            Rankify (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) operates the website{" "}
            <a href="https://www.rankify.page" className="text-indigo-400 hover:underline">www.rankify.page</a>.
            This Privacy Policy explains how we collect, use, and protect your information when you use our SEO analysis services.
          </p>
        </section>

        {/* 1. Information We Collect */}
        <section>
          <h2 className="text-2xl font-bold text-white mb-4">1. Information We Collect</h2>
          
          <h3 className="text-lg font-semibold text-white mt-6 mb-3">Information You Provide</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong className="text-white">Contact Information:</strong> Name, email address when you contact us or subscribe</li>
            <li><strong className="text-white">Website URLs:</strong> URLs you submit for SEO analysis</li>
            <li><strong className="text-white">Communication:</strong> Messages you send through our contact form</li>
          </ul>

          <h3 className="text-lg font-semibold text-white mt-6 mb-3">Automatically Collected Information</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong className="text-white">Usage Data:</strong> Pages viewed, features used, time on site</li>
            <li><strong className="text-white">Device Information:</strong> Browser type, operating system, IP address</li>
            <li><strong className="text-white">Cookies:</strong> Session cookies and analytics cookies (see our <a href="/cookies" className="text-indigo-400 hover:underline">Cookie Policy</a>)</li>
          </ul>
        </section>

        {/* 2. How We Use Your Information */}
        <section>
          <h2 className="text-2xl font-bold text-white mb-4">2. How We Use Your Information</h2>
          
          <p className="mb-4">We use your information to:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Provide SEO analysis and generate reports for URLs you submit</li>
            <li>Respond to your inquiries and support requests</li>
            <li>Improve our services and user experience</li>
            <li>Analyze site usage and optimize performance</li>
            <li>Send service-related communications (if you opt in)</li>
            <li>Comply with legal obligations</li>
          </ul>

          <p className="mt-4 text-sm text-slate-400">
            We do not sell your personal information to third parties.
          </p>
        </section>

        {/* 3. Analytics & Tracking */}
        <section>
          <h2 className="text-2xl font-bold text-white mb-4">3. Analytics & Tracking</h2>
          
          <p className="mb-4">We use the following third-party services to analyze site usage:</p>
          
          <div className="space-y-4">
            <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
              <h4 className="font-semibold text-white">Google Analytics 4</h4>
              <p className="text-sm mt-1">Tracks page views, session duration, and user interactions. Data is anonymized.</p>
              <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-xs text-indigo-400 hover:underline">
                Google Privacy Policy →
              </a>
            </div>
            
            <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
              <h4 className="font-semibold text-white">Microsoft Clarity</h4>
              <p className="text-sm mt-1">Provides heatmaps and session recordings to understand user behavior. Personal data is masked.</p>
              <a href="https://privacy.microsoft.com/en-us/privacystatement" target="_blank" rel="noopener noreferrer" className="text-xs text-indigo-400 hover:underline">
                Microsoft Privacy Policy →
              </a>
            </div>
          </div>
          
          <p className="mt-4 text-sm">
            You can opt out of analytics tracking via our cookie consent banner or by disabling cookies in your browser.
          </p>
        </section>

        {/* 4. Data Sharing */}
        <section>
          <h2 className="text-2xl font-bold text-white mb-4">4. Data Sharing</h2>
          
          <p className="mb-4">We may share your information with:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong className="text-white">Service Providers:</strong> Cloud hosting (Microsoft Azure), analytics (Google, Microsoft)</li>
            <li><strong className="text-white">Legal Requirements:</strong> When required by law, court order, or government request</li>
            <li><strong className="text-white">Business Transfers:</strong> In case of merger, acquisition, or sale of assets</li>
          </ul>
          
          <p className="mt-4 text-sm text-slate-400">
            We do not share, sell, or rent your personal information for marketing purposes.
          </p>
        </section>

        {/* 5. Your Rights */}
        <section>
          <h2 className="text-2xl font-bold text-white mb-4">5. Your Rights</h2>
          
          <p className="mb-4">Depending on your location, you may have the right to:</p>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
              <h4 className="font-semibold text-white mb-2">Access & Portability</h4>
              <p className="text-sm">Request a copy of your personal data</p>
            </div>
            <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
              <h4 className="font-semibold text-white mb-2">Correction</h4>
              <p className="text-sm">Update inaccurate or incomplete data</p>
            </div>
            <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
              <h4 className="font-semibold text-white mb-2">Deletion</h4>
              <p className="text-sm">Request deletion of your data</p>
            </div>
            <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
              <h4 className="font-semibold text-white mb-2">Opt-Out</h4>
              <p className="text-sm">Disable cookies via consent banner</p>
            </div>
          </div>
          
          <p className="mt-4">
            To exercise these rights, email us at{" "}
            <a href="mailto:privacy@rankify.page" className="text-indigo-400 hover:underline">privacy@rankify.page</a>.
            We will respond within 30 days.
          </p>
        </section>

        {/* 6. Data Security */}
        <section>
          <h2 className="text-2xl font-bold text-white mb-4">6. Data Security</h2>
          
          <p className="mb-4">We implement appropriate security measures including:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>HTTPS encryption for all data in transit</li>
            <li>Secure cloud infrastructure (Microsoft Azure)</li>
            <li>Regular security updates and monitoring</li>
            <li>Limited access to personal data</li>
          </ul>
          
          <p className="mt-4 text-sm text-slate-400">
            For more details, see our <a href="/security" className="text-indigo-400 hover:underline">Security page</a>.
          </p>
        </section>

        {/* 7. Data Retention */}
        <section>
          <h2 className="text-2xl font-bold text-white mb-4">7. Data Retention</h2>
          
          <ul className="list-disc pl-6 space-y-2">
            <li><strong className="text-white">SEO Analysis Data:</strong> Retained for 90 days, then deleted</li>
            <li><strong className="text-white">Contact Messages:</strong> Retained for 2 years</li>
            <li><strong className="text-white">Analytics Data:</strong> Google Analytics retains data per their retention settings (14 months default)</li>
          </ul>
        </section>

        {/* 8. International Transfers */}
        <section>
          <h2 className="text-2xl font-bold text-white mb-4">8. International Data Transfers</h2>
          
          <p>
            Your data may be processed in countries outside your jurisdiction. We use service providers that comply
            with applicable data protection laws, including Standard Contractual Clauses for EU data transfers.
          </p>
        </section>

        {/* 9. Children's Privacy */}
        <section>
          <h2 className="text-2xl font-bold text-white mb-4">9. Children&apos;s Privacy</h2>
          
          <p>
            Rankify is not intended for users under 16 years of age. We do not knowingly collect 
            personal information from children. If you believe we have collected data from a child, 
            please contact us immediately.
          </p>
        </section>

        {/* 10. Changes */}
        <section>
          <h2 className="text-2xl font-bold text-white mb-4">10. Changes to This Policy</h2>
          
          <p>
            We may update this Privacy Policy from time to time. Material changes will be posted on this page
            with an updated &quot;Last Updated&quot; date. Continued use of our services after changes constitutes
            acceptance of the updated policy.
          </p>
        </section>

        {/* Contact Section */}
        <section className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
          <h2 className="text-xl font-bold text-white mb-4">Contact Us</h2>
          <p className="mb-4">
            Questions about this Privacy Policy? Contact us:
          </p>
          <ul className="space-y-2 text-sm">
            <li>
              <strong className="text-white">Email:</strong>{" "}
              <a href="mailto:privacy@rankify.page" className="text-indigo-400 hover:underline">privacy@rankify.page</a>
            </li>
            <li>
              <strong className="text-white">Address:</strong>{" "}
              Rankify, IThink by Lodha, Kalyan - Shilphata Road, Dombivli, Mumbai, MH 421204, India
            </li>
          </ul>
        </section>
      </div>
    </PageLayout>
  );
}
