import PageLayout from "@/components/layout/PageLayout";

export const metadata = {
  title: "Cookie Policy",
  description: "Learn about how Rankify uses cookies and similar tracking technologies.",
};

export default function CookiePolicyPage() {
  const effectiveDate = "February 15, 2026";
  
  return (
    <PageLayout
      title="Cookie Policy"
      description="This policy explains how we use cookies and your choices."
      lastUpdated={effectiveDate}
    >
      <div className="space-y-10 text-slate-300">
        
        {/* Introduction */}
        <section>
          <p className="text-lg leading-relaxed">
            Rankify (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) uses cookies and similar technologies 
            on <a href="https://www.rankify.page" className="text-indigo-400 hover:underline">www.rankify.page</a>.
            This policy explains what cookies are, how we use them, and your choices.
          </p>
        </section>

        {/* 1. What Are Cookies */}
        <section>
          <h2 className="text-2xl font-bold text-white mb-4">1. What Are Cookies?</h2>
          
          <p className="mb-4">
            Cookies are small text files stored on your device when you visit a website. 
            They help websites remember information about your visit, such as preferences 
            and usage patterns.
          </p>
          
          <div className="grid md:grid-cols-2 gap-4 mt-6">
            <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
              <h4 className="font-semibold text-white mb-2">Session Cookies</h4>
              <p className="text-sm">Temporary cookies deleted when you close your browser</p>
            </div>
            <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
              <h4 className="font-semibold text-white mb-2">Persistent Cookies</h4>
              <p className="text-sm">Remain on your device until deleted or expired</p>
            </div>
            <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
              <h4 className="font-semibold text-white mb-2">First-Party Cookies</h4>
              <p className="text-sm">Set directly by Rankify</p>
            </div>
            <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
              <h4 className="font-semibold text-white mb-2">Third-Party Cookies</h4>
              <p className="text-sm">Set by external services we use</p>
            </div>
          </div>
        </section>

        {/* 2. Cookies We Use */}
        <section>
          <h2 className="text-2xl font-bold text-white mb-4">2. Cookies We Use</h2>
          
          {/* Essential Cookies */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 mb-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
              <h3 className="text-lg font-semibold text-white">Essential Cookies</h3>
              <span className="text-xs bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full">Always Active</span>
            </div>
            <p className="text-sm mb-4">
              Required for the website to function properly. Cannot be disabled.
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b border-zinc-700">
                  <tr>
                    <th className="text-left py-2 pr-4 text-white">Cookie</th>
                    <th className="text-left py-2 pr-4 text-white">Purpose</th>
                    <th className="text-left py-2 text-white">Duration</th>
                  </tr>
                </thead>
                <tbody className="text-slate-400">
                  <tr className="border-b border-zinc-800">
                    <td className="py-3 pr-4 font-mono text-xs">cookie_consent</td>
                    <td className="py-3 pr-4">Stores your cookie preferences</td>
                    <td className="py-3">12 months</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Analytics Cookies */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 mb-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              <h3 className="text-lg font-semibold text-white">Analytics Cookies</h3>
              <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded-full">Optional</span>
            </div>
            <p className="text-sm mb-4">
              Help us understand how visitors interact with our website to improve user experience.
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b border-zinc-700">
                  <tr>
                    <th className="text-left py-2 pr-4 text-white">Cookie</th>
                    <th className="text-left py-2 pr-4 text-white">Provider</th>
                    <th className="text-left py-2 pr-4 text-white">Purpose</th>
                    <th className="text-left py-2 text-white">Duration</th>
                  </tr>
                </thead>
                <tbody className="text-slate-400">
                  <tr className="border-b border-zinc-800">
                    <td className="py-3 pr-4 font-mono text-xs">_ga</td>
                    <td className="py-3 pr-4">Google Analytics</td>
                    <td className="py-3 pr-4">Distinguishes users</td>
                    <td className="py-3">2 years</td>
                  </tr>
                  <tr className="border-b border-zinc-800">
                    <td className="py-3 pr-4 font-mono text-xs">_ga_*</td>
                    <td className="py-3 pr-4">Google Analytics</td>
                    <td className="py-3 pr-4">Persists session state</td>
                    <td className="py-3">2 years</td>
                  </tr>
                  <tr className="border-b border-zinc-800">
                    <td className="py-3 pr-4 font-mono text-xs">_clck</td>
                    <td className="py-3 pr-4">Microsoft Clarity</td>
                    <td className="py-3 pr-4">Persists Clarity user ID</td>
                    <td className="py-3">12 months</td>
                  </tr>
                  <tr>
                    <td className="py-3 pr-4 font-mono text-xs">_clsk</td>
                    <td className="py-3 pr-4">Microsoft Clarity</td>
                    <td className="py-3 pr-4">Session tracking</td>
                    <td className="py-3">1 day</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* 3. Your Choices */}
        <section>
          <h2 className="text-2xl font-bold text-white mb-4">3. Your Choices</h2>
          
          <p className="mb-4">You have several options to control cookies:</p>
          
          <div className="space-y-4">
            <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
              <h4 className="font-semibold text-white mb-2">Cookie Consent Banner</h4>
              <p className="text-sm">
                When you first visit our site, you can choose to accept all cookies, 
                accept only essential cookies, or customize your preferences.
              </p>
            </div>
            
            <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
              <h4 className="font-semibold text-white mb-2">Browser Settings</h4>
              <p className="text-sm">
                Most browsers allow you to block or delete cookies. Check your browser&apos;s 
                help documentation for instructions.
              </p>
            </div>
            
            <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
              <h4 className="font-semibold text-white mb-2">Google Analytics Opt-Out</h4>
              <p className="text-sm">
                Install the{" "}
                <a 
                  href="https://tools.google.com/dlpage/gaoptout" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-indigo-400 hover:underline"
                >
                  Google Analytics Opt-Out Browser Add-On
                </a>
              </p>
            </div>
          </div>
          
          <p className="mt-4 text-sm text-slate-400">
            Note: Disabling cookies may affect the functionality of some features on our website.
          </p>
        </section>

        {/* 4. Similar Technologies */}
        <section>
          <h2 className="text-2xl font-bold text-white mb-4">4. Similar Technologies</h2>
          
          <p className="mb-4">In addition to cookies, we may use:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong className="text-white">Local Storage:</strong> Used to store preferences on your device</li>
            <li><strong className="text-white">Session Storage:</strong> Temporary data storage during your visit</li>
          </ul>
        </section>

        {/* 5. Updates */}
        <section>
          <h2 className="text-2xl font-bold text-white mb-4">5. Updates to This Policy</h2>
          
          <p>
            We may update this Cookie Policy from time to time. Changes will be posted on 
            this page with an updated &quot;Last Updated&quot; date.
          </p>
        </section>

        {/* Contact Section */}
        <section className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
          <h2 className="text-xl font-bold text-white mb-4">Contact Us</h2>
          <p className="mb-4">
            Questions about cookies? Contact us:
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
          
          <p className="mt-4 text-sm text-slate-400">
            For more information about how we handle your data, see our{" "}
            <a href="/privacy" className="text-indigo-400 hover:underline">Privacy Policy</a>.
          </p>
        </section>
      </div>
    </PageLayout>
  );
}
