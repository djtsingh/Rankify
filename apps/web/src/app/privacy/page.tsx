import PageLayout from "@/components/layout/PageLayout";
import { Shield, Database, Users, Lock, Eye, FileText } from "lucide-react";

export const metadata = {
  title: "Privacy Policy | Rankify",
  description: "Learn how Rankify collects, uses, and protects your personal data. GDPR and CCPA compliant.",
};

export default function PrivacyPage() {
  return (
    <PageLayout
      title="Privacy Policy"
      description="Your privacy is important to us. This policy explains how we collect, use, and protect your personal information."
      lastUpdated="January 3, 2026"
    >
      <div className="space-y-8">
        {/* Introduction */}
        <section>
          <p className="text-lg leading-relaxed">
            At Rankify, we are committed to protecting your privacy and ensuring the security of your personal information.
            This Privacy Policy explains how we collect, use, disclose, and safeguard your data when you use our SEO analytics platform.
          </p>
        </section>

        {/* Data Collection */}
        <section>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-brand-primary to-brand-primary-dark text-white flex items-center justify-center">
              <Database className="w-5 h-5" />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold">1. Information We Collect</h2>
          </div>

          <h3 className="text-xl font-semibold mt-6 mb-3">1.1 Information You Provide</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Account Information:</strong> Name, email address, company name, password</li>
            <li><strong>Payment Information:</strong> Credit card details (processed securely via Stripe), billing address</li>
            <li><strong>Website Data:</strong> URLs you submit for analysis, keyword lists, competitor websites</li>
            <li><strong>Communication Data:</strong> Support tickets, feedback, survey responses</li>
          </ul>

          <h3 className="text-xl font-semibold mt-6 mb-3">1.2 Automatically Collected Information</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Usage Data:</strong> Pages viewed, features used, time spent on platform, clicks</li>
            <li><strong>Device Information:</strong> Browser type, operating system, device identifiers, IP address</li>
            <li><strong>Cookies and Tracking:</strong> Session cookies, analytics cookies, preference cookies</li>
            <li><strong>Log Data:</strong> Server logs, error reports, API requests</li>
          </ul>

          <h3 className="text-xl font-semibold mt-6 mb-3">1.3 Third-Party Data</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Search Engine Data:</strong> Public ranking data from Google, Bing, and other search engines</li>
            <li><strong>Analytics Integrations:</strong> Data you choose to connect from Google Analytics, Search Console</li>
          </ul>
        </section>

        {/* How We Use Data */}
        <section>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-brand-highlight to-brand-highlight-dark text-white flex items-center justify-center">
              <Eye className="w-5 h-5" />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold">2. How We Use Your Information</h2>
          </div>

          <h3 className="text-xl font-semibold mt-6 mb-3">2.1 Service Delivery</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li>Provide SEO analytics, keyword tracking, and competitor analysis</li>
            <li>Generate reports, insights, and recommendations</li>
            <li>Process payments and manage subscriptions</li>
            <li>Authenticate your account and prevent unauthorized access</li>
          </ul>

          <h3 className="text-xl font-semibold mt-6 mb-3">2.2 Platform Improvement</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li>Analyze usage patterns to improve features and user experience</li>
            <li>Develop new features based on user behavior and feedback</li>
            <li>Fix bugs and optimize platform performance</li>
            <li>Conduct A/B testing and product research</li>
          </ul>

          <h3 className="text-xl font-semibold mt-6 mb-3">2.3 Communication</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li>Send important account updates, security alerts, and service notifications</li>
            <li>Respond to support requests and customer inquiries</li>
            <li>Send marketing emails (with your consent, unsubscribe anytime)</li>
            <li>Provide onboarding guidance and educational content</li>
          </ul>

          <h3 className="text-xl font-semibold mt-6 mb-3">2.4 Legal and Security</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li>Comply with legal obligations and regulatory requirements</li>
            <li>Detect and prevent fraud, abuse, and security incidents</li>
            <li>Enforce our Terms of Service and protect our rights</li>
          </ul>
        </section>

        {/* Data Sharing */}
        <section>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-brand-accent to-brand-accent-dark text-white flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold">3. How We Share Your Information</h2>
          </div>

          <p className="mb-4">
            We do not sell your personal information. We may share your data with:
          </p>

          <h3 className="text-xl font-semibold mt-6 mb-3">3.1 Service Providers</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Cloud Hosting:</strong> Microsoft Azure (data processing and storage)</li>
            <li><strong>Payment Processing:</strong> Stripe (payment transactions)</li>
            <li><strong>Email Services:</strong> SendGrid (transactional emails)</li>
            <li><strong>Analytics:</strong> Google Analytics (usage analytics)</li>
            <li><strong>Support Tools:</strong> Intercom (customer support)</li>
          </ul>

          <h3 className="text-xl font-semibold mt-6 mb-3">3.2 Legal Requirements</h3>
          <p>We may disclose your information if required by law, court order, or government request.</p>

          <h3 className="text-xl font-semibold mt-6 mb-3">3.3 Business Transfers</h3>
          <p>In the event of a merger, acquisition, or sale of assets, your information may be transferred to the new owner.</p>
        </section>

        {/* User Rights */}
        <section>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-brand-secondary to-brand-secondary-dark text-white flex items-center justify-center">
              <Shield className="w-5 h-5" />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold">4. Your Rights (GDPR & CCPA)</h2>
          </div>

          <p className="mb-4">
            Depending on your location, you have the following rights:
          </p>

          <h3 className="text-xl font-semibold mt-6 mb-3">4.1 Access & Portability</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li>Request a copy of all personal data we hold about you</li>
            <li>Export your data in a machine-readable format (CSV, JSON)</li>
          </ul>

          <h3 className="text-xl font-semibold mt-6 mb-3">4.2 Correction & Deletion</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li>Update inaccurate or incomplete personal information</li>
            <li>Request deletion of your account and associated data (right to be forgotten)</li>
          </ul>

          <h3 className="text-xl font-semibold mt-6 mb-3">4.3 Opt-Out Rights</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li>Unsubscribe from marketing emails (opt-out link in every email)</li>
            <li>Disable non-essential cookies via cookie banner</li>
            <li>Object to automated decision-making and profiling</li>
          </ul>

          <h3 className="text-xl font-semibold mt-6 mb-3">4.4 How to Exercise Your Rights</h3>
          <p>
            Email us at <a href="mailto:privacy@rankify.com" className="text-primary hover:underline">privacy@rankify.com</a> with
            your request. We will respond within 30 days.
          </p>
        </section>

        {/* Data Security */}
        <section>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-brand-highlight to-brand-highlight-dark text-white flex items-center justify-center">
              <Lock className="w-5 h-5" />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold">5. Data Security</h2>
          </div>

          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Encryption:</strong> TLS 1.3 for data in transit, AES-256 for data at rest</li>
            <li><strong>Access Controls:</strong> Role-based access, multi-factor authentication</li>
            <li><strong>Infrastructure:</strong> Azure's SOC 2 Type II certified data centers</li>
            <li><strong>Monitoring:</strong> 24/7 security monitoring and intrusion detection</li>
            <li><strong>Regular Audits:</strong> Annual security audits and penetration testing</li>
          </ul>

          <p className="mt-4">
            For more details, see our <a href="/security" className="text-primary hover:underline">Security page</a>.
          </p>
        </section>

        {/* Data Retention */}
        <section>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-brand-highlight to-brand-highlight-dark text-white flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold">6. Data Retention</h2>
          </div>

          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Active Accounts:</strong> Retained for as long as your account is active</li>
            <li><strong>Closed Accounts:</strong> Deleted within 90 days (unless legal retention required)</li>
            <li><strong>Backup Data:</strong> Retained for up to 30 days in encrypted backups</li>
            <li><strong>Analytics Data:</strong> Aggregated and anonymized after 24 months</li>
          </ul>
        </section>

        {/* Cookies */}
        <section>
          <h2 className="text-2xl md:text-3xl font-bold mb-4">7. Cookie Policy</h2>
          <p>
            We use cookies to improve your experience. For detailed information about our cookie usage,
            see our <a href="/cookies" className="text-primary hover:underline">Cookie Policy</a>.
          </p>
        </section>

        {/* International Transfers */}
        <section>
          <h2 className="text-2xl md:text-3xl font-bold mb-4">8. International Data Transfers</h2>
          <p className="mb-4">
            Your data may be processed in the United States and other countries where our service providers operate.
            We ensure adequate safeguards through:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Standard Contractual Clauses (SCCs) approved by the European Commission</li>
            <li>Data Processing Agreements with all third-party vendors</li>
            <li>Privacy Shield certification (where applicable)</li>
          </ul>
        </section>

        {/* Children's Privacy */}
        <section>
          <h2 className="text-2xl md:text-3xl font-bold mb-4">9. Children's Privacy</h2>
          <p>
            Rankify is not intended for users under 18 years of age. We do not knowingly collect personal information from children.
            If we discover we have collected data from a child, we will delete it immediately.
          </p>
        </section>

        {/* Changes to Policy */}
        <section>
          <h2 className="text-2xl md:text-3xl font-bold mb-4">10. Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. We will notify you of material changes via email or
            prominent notice on our platform at least 30 days before the changes take effect.
          </p>
        </section>

        {/* Contact */}
        <section className="bg-card border border-border rounded-xl p-6 md:p-8">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">11. Contact Us</h2>
          <p className="mb-4">
            If you have questions about this Privacy Policy or how we handle your data:
          </p>
          <ul className="space-y-2">
            <li><strong>Email:</strong> <a href="mailto:privacy@rankify.page" className="text-primary hover:underline">privacy@rankify.page</a></li>
            <li><strong>Data Protection Officer:</strong> <a href="mailto:dpo@rankify.page" className="text-primary hover:underline">dpo@rankify.page</a></li>
            <li><strong>Mailing Address:</strong> Rankify Inc, IThink by Lodha, Kalyan - Shilphata Road, Opp Xperia Mall, Dombivli, Mumbai, MH 421204, India</li>
          </ul>
        </section>
      </div>
    </PageLayout>
  );
}
