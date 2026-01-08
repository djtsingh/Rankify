import PageLayout from "@/components/layout/PageLayout";
import { FileText, UserCheck, CreditCard, AlertTriangle, Scale, MessageSquare } from "lucide-react";

export const metadata = {
  title: "Terms of Service | Rankify",
  description: "Terms and conditions for using Rankify's SEO analytics platform.",
};

export default function TermsPage() {
  return (
    <PageLayout
      title="Terms of Service"
      description="Please read these terms carefully before using Rankify. By accessing our platform, you agree to be bound by these terms."
      lastUpdated="January 3, 2026"
    >
      <div className="space-y-8">
        {/* Agreement */}
        <section>
          <p className="text-lg leading-relaxed">
            These Terms of Service ("Terms") govern your access to and use of Rankify's SEO analytics platform, website,
            and related services (collectively, the "Service"). By creating an account or using the Service, you agree to these Terms.
          </p>
        </section>

        {/* Acceptance */}
        <section>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-brand-primary to-brand-primary-dark text-white flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold">1. Acceptance of Terms</h2>
          </div>

          <p className="mb-4">
            By accessing or using Rankify, you confirm that:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>You are at least 18 years old</li>
            <li>You have the legal capacity to enter into binding contracts</li>
            <li>You represent a business entity with authority to bind that entity</li>
            <li>You are not located in a country subject to U.S. government embargo</li>
          </ul>
        </section>

        {/* Account Terms */}
        <section>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-brand-secondary to-brand-secondary-dark text-white flex items-center justify-center">
              <UserCheck className="w-5 h-5" />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold">2. Account Terms</h2>
          </div>

          <h3 className="text-xl font-semibold mt-6 mb-3">2.1 Account Creation</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li>You must provide accurate, complete, and current information during registration</li>
            <li>You are responsible for maintaining the security of your account credentials</li>
            <li>You must immediately notify us of any unauthorized access or security breach</li>
            <li>One person or legal entity may maintain only one free account</li>
          </ul>

          <h3 className="text-xl font-semibold mt-6 mb-3">2.2 Account Responsibilities</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li>You are responsible for all activity under your account</li>
            <li>You may not share your account credentials with others</li>
            <li>You must not use another user's account without permission</li>
            <li>Business accounts cannot be transferred without our written consent</li>
          </ul>

          <h3 className="text-xl font-semibold mt-6 mb-3">2.3 Account Termination</h3>
          <p className="mb-3">
            You may cancel your account at any time through your account settings. We may suspend or terminate your account if you:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Violate these Terms or our Acceptable Use Policy</li>
            <li>Fail to pay fees when due</li>
            <li>Engage in fraudulent or illegal activity</li>
            <li>Use the Service in a way that harms Rankify or other users</li>
          </ul>
        </section>

        {/* Acceptable Use */}
        <section>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-brand-accent to-brand-accent-dark text-white flex items-center justify-center">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold">3. Acceptable Use Policy</h2>
          </div>

          <h3 className="text-xl font-semibold mt-6 mb-3">3.1 Prohibited Activities</h3>
          <p className="mb-3">You agree NOT to:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Scrape or crawl:</strong> Use automated tools to scrape, crawl, or index our Service</li>
            <li><strong>Reverse engineer:</strong> Decompile, disassemble, or reverse engineer our software</li>
            <li><strong>Share accounts:</strong> Allow multiple users to access one account (use team plans instead)</li>
            <li><strong>Resell:</strong> Resell, lease, or provide the Service to third parties</li>
            <li><strong>Spam:</strong> Send unsolicited messages through our platform</li>
            <li><strong>Harm infrastructure:</strong> Overload, attack, or disrupt our systems</li>
            <li><strong>Violate laws:</strong> Use the Service for illegal purposes</li>
            <li><strong>Infringe rights:</strong> Violate intellectual property or privacy rights</li>
          </ul>

          <h3 className="text-xl font-semibold mt-6 mb-3">3.2 Rate Limits</h3>
          <p>
            API usage is subject to rate limits based on your plan. Exceeding limits may result in temporary throttling or account suspension.
          </p>

          <h3 className="text-xl font-semibold mt-6 mb-3">3.3 Data Usage</h3>
          <p>
            You may only track websites you own or have explicit permission to monitor. Unauthorized tracking may violate privacy laws.
          </p>
        </section>

        {/* Payment Terms */}
        <section>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-brand-secondary to-brand-secondary-dark text-white flex items-center justify-center">
              <CreditCard className="w-5 h-5" />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold">4. Payment Terms</h2>
          </div>

          <h3 className="text-xl font-semibold mt-6 mb-3">4.1 Pricing</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li>Pricing is displayed on our Pricing page and subject to change with 30 days' notice</li>
            <li>All prices are in U.S. Dollars (USD) unless otherwise stated</li>
            <li>Prices do not include applicable taxes (VAT, sales tax, etc.)</li>
          </ul>

          <h3 className="text-xl font-semibold mt-6 mb-3">4.2 Billing</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Subscription Billing:</strong> Billed monthly or annually in advance</li>
            <li><strong>Auto-Renewal:</strong> Subscriptions renew automatically unless canceled</li>
            <li><strong>Payment Method:</strong> You must provide a valid payment method (credit card, ACH)</li>
            <li><strong>Failed Payments:</strong> Service may be suspended if payment fails; 15-day grace period</li>
          </ul>

          <h3 className="text-xl font-semibold mt-6 mb-3">4.3 Refunds</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>30-Day Money-Back Guarantee:</strong> Full refund if canceled within 30 days of first payment</li>
            <li><strong>Pro-Rated Refunds:</strong> Not available for mid-cycle cancellations</li>
            <li><strong>Downgrade:</strong> Plan changes take effect at next billing cycle</li>
          </ul>

          <h3 className="text-xl font-semibold mt-6 mb-3">4.4 Free Trials</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li>Free trials are available for new customers only</li>
            <li>Credit card required; charged automatically when trial ends</li>
            <li>Cancel anytime during trial to avoid charges</li>
          </ul>
        </section>

        {/* Intellectual Property */}
        <section>
          <h2 className="text-2xl md:text-3xl font-bold mb-4">5. Intellectual Property</h2>

          <h3 className="text-xl font-semibold mt-6 mb-3">5.1 Our IP</h3>
          <p className="mb-3">
            Rankify owns all rights to the Service, including software, trademarks, logos, and content. You receive a limited,
            non-exclusive, non-transferable license to use the Service under these Terms.
          </p>

          <h3 className="text-xl font-semibold mt-6 mb-3">5.2 Your Content</h3>
          <p className="mb-3">
            You retain ownership of data you submit (website URLs, keywords, etc.). By using the Service, you grant us a license to:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Process and analyze your data to provide the Service</li>
            <li>Create aggregated, anonymized insights (no personal identifiers)</li>
            <li>Display data in your reports and dashboards</li>
          </ul>

          <h3 className="text-xl font-semibold mt-6 mb-3">5.3 Feedback</h3>
          <p>
            If you provide feedback or suggestions, we may use them without obligation or compensation to you.
          </p>
        </section>

        {/* Warranties and Disclaimers */}
        <section>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-brand-highlight to-brand-highlight-dark text-white flex items-center justify-center">
              <Scale className="w-5 h-5" />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold">6. Warranties and Disclaimers</h2>
          </div>

          <h3 className="text-xl font-semibold mt-6 mb-3">6.1 Service Availability</h3>
          <p className="mb-3">
            We strive for 99.9% uptime but do not guarantee uninterrupted access. The Service is provided "AS IS" and "AS AVAILABLE."
          </p>

          <h3 className="text-xl font-semibold mt-6 mb-3">6.2 Data Accuracy</h3>
          <p className="mb-3">
            While we aim for accuracy, we do not guarantee:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Complete or error-free ranking data (search engines change frequently)</li>
            <li>Real-time updates (data may be delayed by hours or days)</li>
            <li>Accuracy of third-party integrations (Google Analytics, Search Console, etc.)</li>
          </ul>

          <h3 className="text-xl font-semibold mt-6 mb-3">6.3 Disclaimer</h3>
          <div className="bg-muted/50 border-l-4 border-orange-500 p-4 rounded">
            <p className="font-semibold mb-2">DISCLAIMER OF WARRANTIES</p>
            <p className="text-sm">
              TO THE MAXIMUM EXTENT PERMITTED BY LAW, RANKIFY DISCLAIMS ALL WARRANTIES, EXPRESS OR IMPLIED, INCLUDING
              MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT. WE DO NOT WARRANT THAT THE SERVICE
              WILL MEET YOUR REQUIREMENTS OR ACHIEVE SPECIFIC RESULTS.
            </p>
          </div>
        </section>

        {/* Limitation of Liability */}
        <section>
          <h2 className="text-2xl md:text-3xl font-bold mb-4">7. Limitation of Liability</h2>

          <div className="bg-muted/50 border-l-4 border-red-500 p-4 rounded mb-4">
            <p className="font-semibold mb-2">LIMITATION OF LIABILITY</p>
            <p className="text-sm mb-2">
              IN NO EVENT SHALL RANKIFY BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES,
              INCLUDING LOST PROFITS, DATA LOSS, OR BUSINESS INTERRUPTION, ARISING FROM YOUR USE OF THE SERVICE.
            </p>
            <p className="text-sm">
              OUR TOTAL LIABILITY SHALL NOT EXCEED THE AMOUNT YOU PAID US IN THE 12 MONTHS PRECEDING THE CLAIM, OR $100 USD
              (WHICHEVER IS GREATER).
            </p>
          </div>

          <p className="text-sm text-muted-foreground">
            Some jurisdictions do not allow exclusion of certain warranties or limitation of liability, so these limitations
            may not apply to you.
          </p>
        </section>

        {/* Indemnification */}
        <section>
          <h2 className="text-2xl md:text-3xl font-bold mb-4">8. Indemnification</h2>
          <p className="mb-3">
            You agree to indemnify and hold harmless Rankify from any claims, damages, or expenses (including legal fees)
            arising from:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Your violation of these Terms</li>
            <li>Your violation of applicable laws or third-party rights</li>
            <li>Your use of the Service</li>
            <li>Content you submit to the Service</li>
          </ul>
        </section>

        {/* Dispute Resolution */}
        <section>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-brand-highlight to-brand-highlight-dark text-white flex items-center justify-center">
              <MessageSquare className="w-5 h-5" />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold">9. Dispute Resolution</h2>
          </div>

          <h3 className="text-xl font-semibold mt-6 mb-3">9.1 Informal Resolution</h3>
          <p>
            Before filing a legal claim, you agree to contact us at <a href="mailto:legal@rankify.com" className="text-primary hover:underline">legal@rankify.com</a> to
            resolve the dispute informally. We'll work in good faith to resolve issues within 60 days.
          </p>

          <h3 className="text-xl font-semibold mt-6 mb-3">9.2 Arbitration</h3>
          <p className="mb-3">
            If informal resolution fails, disputes will be resolved through binding arbitration under the American Arbitration
            Association (AAA) rules, rather than in court. Exceptions:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Small claims court disputes (under $10,000)</li>
            <li>Intellectual property disputes</li>
            <li>Injunctive relief requests</li>
          </ul>

          <h3 className="text-xl font-semibold mt-6 mb-3">9.3 Class Action Waiver</h3>
          <p>
            You agree to resolve disputes individually, not as part of a class action or consolidated proceeding.
          </p>

          <h3 className="text-xl font-semibold mt-6 mb-3">9.4 Governing Law</h3>
          <p>
            These Terms are governed by the laws of India, without regard to conflict of law principles.
            Any disputes shall be subject to the exclusive jurisdiction of the courts in Mumbai, Maharashtra.
          </p>
        </section>

        {/* Changes to Terms */}
        <section>
          <h2 className="text-2xl md:text-3xl font-bold mb-4">10. Changes to Terms</h2>
          <p>
            We may update these Terms from time to time. Material changes will be notified via email at least 30 days in advance.
            Continued use of the Service after changes take effect constitutes acceptance of the new Terms.
          </p>
        </section>

        {/* Miscellaneous */}
        <section>
          <h2 className="text-2xl md:text-3xl font-bold mb-4">11. Miscellaneous</h2>

          <h3 className="text-xl font-semibold mt-6 mb-3">11.1 Entire Agreement</h3>
          <p>These Terms, along with our Privacy Policy and Cookie Policy, constitute the entire agreement between you and Rankify.</p>

          <h3 className="text-xl font-semibold mt-6 mb-3">11.2 Severability</h3>
          <p>If any provision is found invalid, the remaining provisions remain in effect.</p>

          <h3 className="text-xl font-semibold mt-6 mb-3">11.3 No Waiver</h3>
          <p>Failure to enforce a provision does not waive our right to enforce it later.</p>

          <h3 className="text-xl font-semibold mt-6 mb-3">11.4 Assignment</h3>
          <p>You may not transfer your rights under these Terms. We may assign our rights without restriction.</p>
        </section>

        {/* Contact */}
        <section className="bg-card border border-border rounded-xl p-6 md:p-8">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">12. Contact Us</h2>
          <p className="mb-4">
            Questions about these Terms?
          </p>
          <ul className="space-y-2">
            <li><strong>Email:</strong> <a href="mailto:legal@rankify.page" className="text-primary hover:underline">legal@rankify.page</a></li>
            <li><strong>Support:</strong> <a href="mailto:support@rankify.page" className="text-primary hover:underline">support@rankify.page</a></li>
            <li><strong>Address:</strong> Rankify Inc, IThink by Lodha, Kalyan - Shilphata Road, Opp Xperia Mall, Dombivli, Mumbai, MH 421204, India</li>
          </ul>
        </section>
      </div>
    </PageLayout>
  );
}
