import PageLayout from "@/components/layout/PageLayout";
import { Cookie, Eye, Settings, ToggleRight, Shield, CheckCircle } from "lucide-react";

export const metadata = {
  title: "Cookie Policy | Rankify",
  description: "Learn about how Rankify uses cookies and similar tracking technologies.",
};

export default function CookiePolicyPage() {
  return (
    <PageLayout
      title="Cookie Policy"
      description="This Cookie Policy explains how Rankify uses cookies and similar tracking technologies on our website and platform."
      lastUpdated="January 3, 2026"
    >
      <div className="space-y-8">
        {/* Introduction */}
        <section>
          <p className="text-lg leading-relaxed">
            Rankify uses cookies and similar technologies to provide, improve, and protect our Service. This policy explains
            what cookies are, how we use them, and your choices regarding cookie usage.
          </p>
        </section>

        {/* What Are Cookies */}
        <section>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-brand-primary to-brand-primary-dark text-white flex items-center justify-center">
              <Cookie className="w-5 h-5" />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold">1. What Are Cookies?</h2>
          </div>

          <p className="mb-4">
            Cookies are small text files stored on your device (computer, tablet, or phone) when you visit a website. They help
            websites remember information about your visit, such as preferences, login status, and usage patterns.
          </p>

          <h3 className="text-xl font-semibold mt-6 mb-3">Types of Cookies</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Session Cookies:</strong> Temporary cookies deleted when you close your browser</li>
            <li><strong>Persistent Cookies:</strong> Remain on your device until deleted or expired (up to 2 years)</li>
            <li><strong>First-Party Cookies:</strong> Set by Rankify directly</li>
            <li><strong>Third-Party Cookies:</strong> Set by external services we use (analytics, advertising)</li>
          </ul>
        </section>

        {/* How We Use Cookies */}
        <section>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-brand-secondary to-brand-secondary-dark text-white flex items-center justify-center">
              <Eye className="w-5 h-5" />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold">2. How We Use Cookies</h2>
          </div>

          {/* Essential Cookies */}
          <div className="bg-card border border-border rounded-xl p-6 mb-6">
            <div className="flex items-center gap-3 mb-3">
              <CheckCircle className="w-6 h-6 text-emerald" />
              <h3 className="text-xl font-semibold">2.1 Essential Cookies (Always Active)</h3>
            </div>
            <p className="text-muted-foreground mb-3">
              These cookies are necessary for the platform to function and cannot be disabled.
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b border-border">
                  <tr>
                    <th className="text-left py-2 pr-4">Cookie Name</th>
                    <th className="text-left py-2 pr-4">Purpose</th>
                    <th className="text-left py-2">Duration</th>
                  </tr>
                </thead>
                <tbody className="text-muted-foreground">
                  <tr className="border-b border-border">
                    <td className="py-3 pr-4 font-mono text-xs">rankify_session</td>
                    <td className="py-3 pr-4">Maintains your login session</td>
                    <td className="py-3">Session</td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="py-3 pr-4 font-mono text-xs">csrf_token</td>
                    <td className="py-3 pr-4">Prevents cross-site request forgery attacks</td>
                    <td className="py-3">Session</td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="py-3 pr-4 font-mono text-xs">cookie_consent</td>
                    <td className="py-3 pr-4">Stores your cookie preferences</td>
                    <td className="py-3">12 months</td>
                  </tr>
                  <tr>
                    <td className="py-3 pr-4 font-mono text-xs">load_balancer</td>
                    <td className="py-3 pr-4">Routes requests to correct server</td>
                    <td className="py-3">Session</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Analytics Cookies */}
          <div className="bg-card border border-border rounded-xl p-6 mb-6">
            <div className="flex items-center gap-3 mb-3">
              <ToggleRight className="w-6 h-6 text-cyan" />
              <h3 className="text-xl font-semibold">2.2 Analytics Cookies (Optional)</h3>
            </div>
            <p className="text-muted-foreground mb-3">
              Help us understand how users interact with our platform to improve user experience.
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b border-border">
                  <tr>
                    <th className="text-left py-2 pr-4">Cookie Name</th>
                    <th className="text-left py-2 pr-4">Purpose</th>
                    <th className="text-left py-2">Duration</th>
                  </tr>
                </thead>
                <tbody className="text-muted-foreground">
                  <tr className="border-b border-border">
                    <td className="py-3 pr-4 font-mono text-xs">_ga</td>
                    <td className="py-3 pr-4">Google Analytics: Distinguishes users</td>
                    <td className="py-3">2 years</td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="py-3 pr-4 font-mono text-xs">_ga_*</td>
                    <td className="py-3 pr-4">Google Analytics: Persists session state</td>
                    <td className="py-3">2 years</td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="py-3 pr-4 font-mono text-xs">_gid</td>
                    <td className="py-3 pr-4">Google Analytics: Distinguishes users</td>
                    <td className="py-3">24 hours</td>
                  </tr>
                  <tr>
                    <td className="py-3 pr-4 font-mono text-xs">rankify_analytics</td>
                    <td className="py-3 pr-4">Internal analytics: Page views, clicks, feature usage</td>
                    <td className="py-3">12 months</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Functional Cookies */}
          <div className="bg-card border border-border rounded-xl p-6 mb-6">
            <div className="flex items-center gap-3 mb-3">
              <Settings className="w-6 h-6 text-coral" />
              <h3 className="text-xl font-semibold">2.3 Functional Cookies (Optional)</h3>
            </div>
            <p className="text-muted-foreground mb-3">
              Remember your preferences and settings for a better experience.
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b border-border">
                  <tr>
                    <th className="text-left py-2 pr-4">Cookie Name</th>
                    <th className="text-left py-2 pr-4">Purpose</th>
                    <th className="text-left py-2">Duration</th>
                  </tr>
                </thead>
                <tbody className="text-muted-foreground">
                  <tr className="border-b border-border">
                    <td className="py-3 pr-4 font-mono text-xs">theme_preference</td>
                    <td className="py-3 pr-4">Stores dark/light mode preference</td>
                    <td className="py-3">12 months</td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="py-3 pr-4 font-mono text-xs">language</td>
                    <td className="py-3 pr-4">Stores language preference</td>
                    <td className="py-3">12 months</td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="py-3 pr-4 font-mono text-xs">dashboard_layout</td>
                    <td className="py-3 pr-4">Remembers dashboard customization</td>
                    <td className="py-3">6 months</td>
                  </tr>
                  <tr>
                    <td className="py-3 pr-4 font-mono text-xs">timezone</td>
                    <td className="py-3 pr-4">Stores timezone for accurate reporting</td>
                    <td className="py-3">12 months</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Marketing Cookies */}
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="flex items-center gap-3 mb-3">
              <Shield className="w-6 h-6 text-pink" />
              <h3 className="text-xl font-semibold">2.4 Marketing Cookies (Optional)</h3>
            </div>
            <p className="text-muted-foreground mb-3">
              Track your visit across websites to show relevant ads and measure campaign effectiveness.
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b border-border">
                  <tr>
                    <th className="text-left py-2 pr-4">Cookie Name</th>
                    <th className="text-left py-2 pr-4">Purpose</th>
                    <th className="text-left py-2">Duration</th>
                  </tr>
                </thead>
                <tbody className="text-muted-foreground">
                  <tr className="border-b border-border">
                    <td className="py-3 pr-4 font-mono text-xs">_fbp</td>
                    <td className="py-3 pr-4">Facebook Pixel: Tracks conversions</td>
                    <td className="py-3">3 months</td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="py-3 pr-4 font-mono text-xs">_gcl_au</td>
                    <td className="py-3 pr-4">Google Ads: Conversion tracking</td>
                    <td className="py-3">3 months</td>
                  </tr>
                  <tr>
                    <td className="py-3 pr-4 font-mono text-xs">intercom-id-*</td>
                    <td className="py-3 pr-4">Intercom: Support chat and messaging</td>
                    <td className="py-3">9 months</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Third-Party Cookies */}
        <section>
          <h2 className="text-2xl md:text-3xl font-bold mb-4">3. Third-Party Cookies</h2>
          <p className="mb-4">
            We work with trusted third-party services that may set cookies on our platform:
          </p>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-card border border-border rounded-lg p-4">
              <h4 className="font-semibold mb-2">Google Analytics</h4>
              <p className="text-sm text-muted-foreground mb-2">Website analytics and user behavior tracking</p>
              <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline">
                Privacy Policy →
              </a>
            </div>

            <div className="bg-card border border-border rounded-lg p-4">
              <h4 className="font-semibold mb-2">Stripe</h4>
              <p className="text-sm text-muted-foreground mb-2">Payment processing and fraud detection</p>
              <a href="https://stripe.com/privacy" target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline">
                Privacy Policy →
              </a>
            </div>

            <div className="bg-card border border-border rounded-lg p-4">
              <h4 className="font-semibold mb-2">Intercom</h4>
              <p className="text-sm text-muted-foreground mb-2">Customer support and in-app messaging</p>
              <a href="https://www.intercom.com/legal/privacy" target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline">
                Privacy Policy →
              </a>
            </div>

            <div className="bg-card border border-border rounded-lg p-4">
              <h4 className="font-semibold mb-2">Google Ads</h4>
              <p className="text-sm text-muted-foreground mb-2">Advertising and remarketing campaigns</p>
              <a href="https://policies.google.com/technologies/ads" target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline">
                Privacy Policy →
              </a>
            </div>
          </div>
        </section>

        {/* Managing Cookies */}
        <section>
          <h2 className="text-2xl md:text-3xl font-bold mb-4">4. How to Manage Cookies</h2>

          <h3 className="text-xl font-semibold mt-6 mb-3">4.1 Cookie Consent Banner</h3>
          <p className="mb-4">
            When you first visit Rankify, you'll see a cookie banner where you can:
          </p>
          <ul className="list-disc pl-6 space-y-2 mb-6">
            <li>Accept all cookies</li>
            <li>Reject non-essential cookies</li>
            <li>Customize your cookie preferences by category</li>
          </ul>

          <h3 className="text-xl font-semibold mt-6 mb-3">4.2 Browser Settings</h3>
          <p className="mb-4">
            Most browsers allow you to control cookies through settings. Here's how:
          </p>

          <div className="space-y-3">
            <div className="bg-card border border-border rounded-lg p-4">
              <h4 className="font-semibold mb-2">Google Chrome</h4>
              <p className="text-sm text-muted-foreground">
                Settings → Privacy and security → Cookies and other site data → Manage cookies
              </p>
            </div>

            <div className="bg-card border border-border rounded-lg p-4">
              <h4 className="font-semibold mb-2">Mozilla Firefox</h4>
              <p className="text-sm text-muted-foreground">
                Settings → Privacy & Security → Cookies and Site Data → Manage Data
              </p>
            </div>

            <div className="bg-card border border-border rounded-lg p-4">
              <h4 className="font-semibold mb-2">Safari</h4>
              <p className="text-sm text-muted-foreground">
                Preferences → Privacy → Manage Website Data
              </p>
            </div>

            <div className="bg-card border border-border rounded-lg p-4">
              <h4 className="font-semibold mb-2">Microsoft Edge</h4>
              <p className="text-sm text-muted-foreground">
                Settings → Cookies and site permissions → Manage and delete cookies and site data
              </p>
            </div>
          </div>

          <h3 className="text-xl font-semibold mt-6 mb-3">4.3 Opt-Out Tools</h3>
          <p className="mb-3">You can also use these tools to opt out of tracking:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li><a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Google Analytics Opt-Out Browser Add-on</a></li>
            <li><a href="https://optout.networkadvertising.org/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Network Advertising Initiative Opt-Out</a></li>
            <li><a href="https://optout.aboutads.info/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Digital Advertising Alliance Opt-Out</a></li>
          </ul>

          <div className="bg-muted/50 border-l-4 border-orange-500 p-4 rounded mt-6">
            <p className="text-sm">
              <strong>Note:</strong> Disabling cookies may affect platform functionality. Essential cookies cannot be disabled
              as they are necessary for the Service to work properly.
            </p>
          </div>
        </section>

        {/* Do Not Track */}
        <section>
          <h2 className="text-2xl md:text-3xl font-bold mb-4">5. Do Not Track (DNT)</h2>
          <p>
            Some browsers have a "Do Not Track" (DNT) feature that signals websites you visit that you don't want your online
            activity tracked. Currently, there is no industry standard for how to respond to DNT signals. Rankify does not
            currently respond to DNT signals, but we respect your cookie preferences set through our cookie banner.
          </p>
        </section>

        {/* Updates */}
        <section>
          <h2 className="text-2xl md:text-3xl font-bold mb-4">6. Updates to This Policy</h2>
          <p>
            We may update this Cookie Policy from time to time to reflect changes in our practices or legal requirements.
            We'll notify you of material changes via email or a notice on our website.
          </p>
        </section>

        {/* Contact */}
        <section className="bg-card border border-border rounded-xl p-6 md:p-8">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">7. Contact Us</h2>
          <p className="mb-4">
            Questions about our use of cookies?
          </p>
          <ul className="space-y-2">
            <li><strong>Email:</strong> <a href="mailto:privacy@rankify.com" className="text-primary hover:underline">privacy@rankify.com</a></li>
            <li><strong>Address:</strong> Rankify Inc., 123 SEO Street, San Francisco, CA 94105, USA</li>
          </ul>
        </section>
      </div>
    </PageLayout>
  );
}
