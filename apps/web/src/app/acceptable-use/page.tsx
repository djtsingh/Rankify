import { Metadata } from 'next';
import PageLayout from "@/components/layout/PageLayout";

export const metadata: Metadata = {
  title: 'Acceptable Use Policy',
  description: 'Guidelines for acceptable use of Rankify SEO analysis services. Understand the rules to ensure a safe and fair experience for all users.',
  robots: { index: true, follow: true },
};

export default function AcceptableUsePage() {
  const effectiveDate = "February 19, 2026";
  
  return (
    <PageLayout
      title="Acceptable Use Policy"
      description="Guidelines for fair and responsible use of Rankify services."
      lastUpdated={effectiveDate}
    >
      <div className="space-y-10 text-slate-300">
        
        {/* Introduction */}
        <section>
          <p className="text-lg leading-relaxed">
            This Acceptable Use Policy (&quot;AUP&quot;) governs your use of Rankify (&quot;Service&quot;) 
            at <a href="https://www.rankify.page" className="text-indigo-400 hover:underline">www.rankify.page</a>. 
            By using our Service, you agree to comply with this policy and our{" "}
            <a href="/terms" className="text-indigo-400 hover:underline">Terms of Service</a>.
          </p>
        </section>

        {/* 1. General Conduct */}
        <section>
          <h2 className="text-2xl font-bold text-white mb-4">1. General Conduct</h2>
          
          <p className="mb-4">When using Rankify, you agree to:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Use the Service only for lawful purposes</li>
            <li>Respect the rights and privacy of others</li>
            <li>Provide accurate information when required</li>
            <li>Maintain the confidentiality of your account credentials</li>
            <li>Report any security vulnerabilities responsibly</li>
          </ul>
        </section>

        {/* 2. Prohibited Activities */}
        <section>
          <h2 className="text-2xl font-bold text-white mb-4">2. Prohibited Activities</h2>
          
          <h3 className="text-lg font-semibold text-white mt-6 mb-3">2.1 System Abuse</h3>
          <p className="mb-4">You may NOT:</p>
          <ul className="list-disc pl-6 space-y-2 mb-6">
            <li>Attempt to circumvent rate limits or usage quotas</li>
            <li>Use automated scripts, bots, or scrapers without authorization</li>
            <li>Overload or disrupt our systems or infrastructure</li>
            <li>Attempt to gain unauthorized access to our systems</li>
            <li>Probe, scan, or test vulnerabilities without permission</li>
            <li>Interfere with other users&apos; access to the Service</li>
          </ul>

          <h3 className="text-lg font-semibold text-white mt-6 mb-3">2.2 Malicious Use</h3>
          <p className="mb-4">You may NOT use Rankify to:</p>
          <ul className="list-disc pl-6 space-y-2 mb-6">
            <li>Analyze websites for malicious purposes (hacking, exploitation)</li>
            <li>Identify vulnerabilities for unauthorized exploitation</li>
            <li>Gather competitive intelligence through deceptive means</li>
            <li>Engage in any form of cyber attack or reconnaissance</li>
            <li>Violate the privacy or security of any website or individual</li>
          </ul>

          <h3 className="text-lg font-semibold text-white mt-6 mb-3">2.3 Content Restrictions</h3>
          <p className="mb-4">You may NOT submit URLs that contain or link to:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Illegal content in any jurisdiction</li>
            <li>Child sexual abuse material (CSAM)</li>
            <li>Content promoting violence, terrorism, or hate speech</li>
            <li>Malware, viruses, or malicious code</li>
            <li>Phishing or fraudulent content</li>
            <li>Copyrighted content distributed without authorization</li>
          </ul>
        </section>

        {/* 3. Rate Limits & Fair Use */}
        <section>
          <h2 className="text-2xl font-bold text-white mb-4">3. Rate Limits & Fair Use</h2>
          
          <p className="mb-4">To ensure fair access for all users:</p>
          <ul className="list-disc pl-6 space-y-2 mb-4">
            <li><strong className="text-white">Free Tier:</strong> Limited to 5 scans per day</li>
            <li><strong className="text-white">Pro Tier:</strong> Limited to 100 scans per day</li>
            <li><strong className="text-white">Enterprise:</strong> Custom limits per agreement</li>
          </ul>
          
          <p className="text-sm text-slate-400">
            Exceeding these limits may result in temporary restrictions or account suspension.
          </p>
        </section>

        {/* 4. API Usage */}
        <section>
          <h2 className="text-2xl font-bold text-white mb-4">4. API Usage Guidelines</h2>
          
          <p className="mb-4">If you access Rankify via our API:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Use your API key only for authorized applications</li>
            <li>Do not share or expose your API credentials</li>
            <li>Implement proper error handling and respect retry-after headers</li>
            <li>Cache responses when appropriate to reduce load</li>
            <li>Identify your application with a proper User-Agent string</li>
          </ul>
        </section>

        {/* 5. Intellectual Property */}
        <section>
          <h2 className="text-2xl font-bold text-white mb-4">5. Intellectual Property</h2>
          
          <ul className="list-disc pl-6 space-y-2">
            <li>Respect all copyrights, trademarks, and intellectual property rights</li>
            <li>Do not reproduce, distribute, or create derivative works from our reports without permission</li>
            <li>You retain ownership of your data; we retain ownership of our analysis methods</li>
            <li>Attribution is required if you publicly share Rankify analysis results</li>
          </ul>
        </section>

        {/* 6. Reporting Violations */}
        <section>
          <h2 className="text-2xl font-bold text-white mb-4">6. Reporting Violations</h2>
          
          <p className="mb-4">
            If you become aware of any violation of this policy, please report it to:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Email: <a href="mailto:abuse@rankify.page" className="text-indigo-400 hover:underline">abuse@rankify.page</a></li>
            <li>Security issues: <a href="mailto:security@rankify.page" className="text-indigo-400 hover:underline">security@rankify.page</a></li>
          </ul>
          
          <p className="mt-4 text-sm text-slate-400">
            We investigate all reports and take appropriate action.
          </p>
        </section>

        {/* 7. Enforcement */}
        <section>
          <h2 className="text-2xl font-bold text-white mb-4">7. Enforcement & Consequences</h2>
          
          <p className="mb-4">Violation of this policy may result in:</p>
          <ul className="list-disc pl-6 space-y-2 mb-4">
            <li><strong className="text-white">Warning:</strong> First-time minor violations may receive a warning</li>
            <li><strong className="text-white">Temporary Suspension:</strong> Repeated or moderate violations</li>
            <li><strong className="text-white">Permanent Termination:</strong> Severe or repeated violations</li>
            <li><strong className="text-white">Legal Action:</strong> For illegal activities or significant damages</li>
          </ul>
          
          <p className="text-sm text-slate-400">
            We reserve the right to take action at our sole discretion without prior notice.
          </p>
        </section>

        {/* 8. Changes */}
        <section>
          <h2 className="text-2xl font-bold text-white mb-4">8. Changes to This Policy</h2>
          
          <p className="mb-4">
            We may update this Acceptable Use Policy from time to time. Changes will be posted on this page 
            with an updated effective date. Continued use of the Service after changes constitutes acceptance.
          </p>
        </section>

        {/* Contact */}
        <section className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
          <h2 className="text-xl font-bold text-white mb-3">Questions?</h2>
          <p className="mb-4">
            If you have questions about this policy or need clarification on acceptable use, contact us:
          </p>
          <ul className="space-y-2">
            <li>
              <strong className="text-white">General:</strong>{" "}
              <a href="mailto:support@rankify.page" className="text-indigo-400 hover:underline">support@rankify.page</a>
            </li>
            <li>
              <strong className="text-white">Abuse Reports:</strong>{" "}
              <a href="mailto:abuse@rankify.page" className="text-indigo-400 hover:underline">abuse@rankify.page</a>
            </li>
            <li>
              <strong className="text-white">Security:</strong>{" "}
              <a href="mailto:security@rankify.page" className="text-indigo-400 hover:underline">security@rankify.page</a>
            </li>
          </ul>
        </section>

      </div>
    </PageLayout>
  );
}
