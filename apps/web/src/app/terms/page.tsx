import PageLayout from "@/components/layout/PageLayout";

export const metadata = {
  title: "Terms of Service",
  description: "Terms and conditions for using Rankify's SEO analysis tools and services.",
};

export default function TermsPage() {
  const effectiveDate = "February 15, 2026";
  
  return (
    <PageLayout
      title="Terms of Service"
      description="Please read these terms carefully before using Rankify."
      lastUpdated={effectiveDate}
    >
      <div className="space-y-10 text-slate-300">
        
        {/* Introduction */}
        <section>
          <p className="text-lg leading-relaxed">
            These Terms of Service (&quot;Terms&quot;) govern your access to and use of{" "}
            <a href="https://www.rankify.page" className="text-indigo-400 hover:underline">www.rankify.page</a>{" "}
            (&quot;Service&quot;), operated by Rankify (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;).
            By accessing or using our Service, you agree to be bound by these Terms.
          </p>
        </section>

        {/* 1. Acceptance */}
        <section>
          <h2 className="text-2xl font-bold text-white mb-4">1. Acceptance of Terms</h2>
          
          <p className="mb-4">By using Rankify, you confirm that:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>You are at least 16 years old</li>
            <li>You have the legal capacity to enter into binding agreements</li>
            <li>You will comply with these Terms and all applicable laws</li>
          </ul>
          
          <p className="mt-4 text-sm text-slate-400">
            If you do not agree to these Terms, please do not use our Service.
          </p>
        </section>

        {/* 2. Description of Service */}
        <section>
          <h2 className="text-2xl font-bold text-white mb-4">2. Description of Service</h2>
          
          <p className="mb-4">Rankify provides:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Website SEO analysis and audit tools</li>
            <li>Performance and optimization recommendations</li>
            <li>SEO scoring and reporting</li>
            <li>Related educational content</li>
          </ul>
          
          <p className="mt-4 text-sm text-slate-400">
            We may modify, suspend, or discontinue any part of the Service at any time without notice.
          </p>
        </section>

        {/* 3. Acceptable Use */}
        <section>
          <h2 className="text-2xl font-bold text-white mb-4">3. Acceptable Use</h2>
          
          <p className="mb-4">You agree NOT to:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Use automated tools to scrape, crawl, or overload our systems</li>
            <li>Submit URLs you do not own or have permission to analyze</li>
            <li>Reverse engineer, decompile, or attempt to extract source code</li>
            <li>Use the Service for any illegal or unauthorized purpose</li>
            <li>Interfere with or disrupt the Service or its infrastructure</li>
            <li>Share, resell, or redistribute our analysis data commercially without permission</li>
            <li>Attempt to gain unauthorized access to any part of our systems</li>
          </ul>
          
          <p className="mt-4">
            Violation of these terms may result in immediate termination of access.
          </p>
        </section>

        {/* 4. Intellectual Property */}
        <section>
          <h2 className="text-2xl font-bold text-white mb-4">4. Intellectual Property</h2>
          
          <h3 className="text-lg font-semibold text-white mt-6 mb-3">Our Content</h3>
          <p className="mb-4">
            The Service, including its design, features, functionality, code, and content, 
            is owned by Rankify and protected by intellectual property laws. You may not copy, 
            modify, or distribute our content without prior written permission.
          </p>
          
          <h3 className="text-lg font-semibold text-white mt-6 mb-3">Your Content</h3>
          <p>
            You retain ownership of URLs and data you submit. By using our Service, you grant us 
            a limited license to process and analyze your submitted URLs for the purpose of 
            providing the Service.
          </p>
        </section>

        {/* 5. Disclaimer of Warranties */}
        <section>
          <h2 className="text-2xl font-bold text-white mb-4">5. Disclaimer of Warranties</h2>
          
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4">
            <p className="text-sm">
              THE SERVICE IS PROVIDED &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot; WITHOUT WARRANTIES 
              OF ANY KIND, EITHER EXPRESS OR IMPLIED. WE DO NOT WARRANT THAT THE SERVICE WILL BE 
              UNINTERRUPTED, ERROR-FREE, OR COMPLETELY SECURE.
            </p>
          </div>
          
          <p className="mt-4">
            SEO analysis results are recommendations only. We do not guarantee specific 
            search engine rankings or performance outcomes. Search engine algorithms change 
            frequently and are outside our control.
          </p>
        </section>

        {/* 6. Limitation of Liability */}
        <section>
          <h2 className="text-2xl font-bold text-white mb-4">6. Limitation of Liability</h2>
          
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
            <p className="text-sm">
              TO THE MAXIMUM EXTENT PERMITTED BY LAW, RANKIFY SHALL NOT BE LIABLE FOR ANY 
              INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING 
              LOST PROFITS, DATA LOSS, OR BUSINESS INTERRUPTION, ARISING FROM YOUR USE OF 
              THE SERVICE.
            </p>
          </div>
          
          <p className="mt-4 text-sm text-slate-400">
            Some jurisdictions do not allow limitation of liability, so these limitations 
            may not apply to you.
          </p>
        </section>

        {/* 7. Indemnification */}
        <section>
          <h2 className="text-2xl font-bold text-white mb-4">7. Indemnification</h2>
          
          <p>
            You agree to indemnify and hold harmless Rankify from any claims, damages, or 
            expenses arising from your violation of these Terms, your use of the Service, 
            or your violation of any third-party rights.
          </p>
        </section>

        {/* 8. Third-Party Services */}
        <section>
          <h2 className="text-2xl font-bold text-white mb-4">8. Third-Party Services</h2>
          
          <p>
            Our Service may contain links to third-party websites or integrate with third-party 
            services. We are not responsible for the content, privacy practices, or terms of 
            any third-party services. Use them at your own risk.
          </p>
        </section>

        {/* 9. Governing Law */}
        <section>
          <h2 className="text-2xl font-bold text-white mb-4">9. Governing Law</h2>
          
          <p>
            These Terms are governed by the laws of India, without regard to conflict of law 
            principles. Any disputes shall be subject to the exclusive jurisdiction of the 
            courts in Mumbai, Maharashtra, India.
          </p>
        </section>

        {/* 10. Changes to Terms */}
        <section>
          <h2 className="text-2xl font-bold text-white mb-4">10. Changes to Terms</h2>
          
          <p>
            We may update these Terms from time to time. Material changes will be posted on 
            this page with an updated &quot;Last Updated&quot; date. Continued use of the Service 
            after changes constitutes acceptance of the new Terms.
          </p>
        </section>

        {/* 11. Severability */}
        <section>
          <h2 className="text-2xl font-bold text-white mb-4">11. Severability</h2>
          
          <p>
            If any provision of these Terms is found invalid or unenforceable, the remaining 
            provisions will continue in full force and effect.
          </p>
        </section>

        {/* Contact Section */}
        <section className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
          <h2 className="text-xl font-bold text-white mb-4">Contact Us</h2>
          <p className="mb-4">
            Questions about these Terms? Contact us:
          </p>
          <ul className="space-y-2 text-sm">
            <li>
              <strong className="text-white">Email:</strong>{" "}
              <a href="mailto:legal@rankify.page" className="text-indigo-400 hover:underline">legal@rankify.page</a>
            </li>
            <li>
              <strong className="text-white">Support:</strong>{" "}
              <a href="mailto:support@rankify.page" className="text-indigo-400 hover:underline">support@rankify.page</a>
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
