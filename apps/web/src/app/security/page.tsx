import PageLayout from "@/components/layout/PageLayout";
import { Shield, Lock, Server, Eye, AlertTriangle, FileCheck, Award } from "lucide-react";

export const metadata = {
  title: "Security",
  description: "Learn how Rankify protects your data with enterprise-grade security measures.",
};

export default function SecurityPage() {
  return (
    <PageLayout
      title="Security"
      description="Your data security is our top priority. Learn about the comprehensive measures we take to protect your information."
      lastUpdated="January 3, 2026"
    >
      <div className="space-y-8">
        {/* Introduction */}
        <section>
          <p className="text-lg leading-relaxed">
            At Rankify, security is built into every layer of our platform. We employ industry-leading practices, cutting-edge
            technology, and rigorous processes to ensure your data remains safe, private, and always available.
          </p>
        </section>

        {/* Data Encryption */}
        <section>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-brand-primary to-brand-primary-dark text-white flex items-center justify-center">
              <Lock className="w-5 h-5" />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold">1. Data Encryption</h2>
          </div>

          <h3 className="text-xl font-semibold mt-6 mb-3">1.1 Encryption in Transit</h3>
          <ul className="list-disc pl-6 space-y-2 mb-6">
            <li><strong>TLS 1.3:</strong> All data transmitted between your browser and our servers uses the latest Transport Layer Security protocol</li>
            <li><strong>Perfect Forward Secrecy:</strong> Each session uses unique encryption keys that cannot be compromised retroactively</li>
            <li><strong>HSTS Enabled:</strong> HTTP Strict Transport Security prevents downgrade attacks</li>
            <li><strong>Certificate Pinning:</strong> Protects against man-in-the-middle attacks</li>
          </ul>

          <h3 className="text-xl font-semibold mt-6 mb-3">1.2 Encryption at Rest</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>AES-256:</strong> All stored data encrypted using Advanced Encryption Standard with 256-bit keys</li>
            <li><strong>Database Encryption:</strong> PostgreSQL Transparent Data Encryption (TDE) for all databases</li>
            <li><strong>Backup Encryption:</strong> All backups encrypted before storage</li>
            <li><strong>Key Management:</strong> Azure Key Vault for secure key storage and rotation</li>
          </ul>

          <div className="bg-card border border-border rounded-lg p-4 mt-6">
            <p className="text-sm text-muted-foreground">
              <strong>What this means for you:</strong> Your data is encrypted both when moving across the internet and when
              stored on our servers, making it unreadable to anyone without proper authorization.
            </p>
          </div>
        </section>

        {/* Infrastructure Security */}
        <section>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-brand-highlight to-brand-highlight-dark text-white flex items-center justify-center">
              <Server className="w-5 h-5" />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold">2. Infrastructure Security</h2>
          </div>

          <h3 className="text-xl font-semibold mt-6 mb-3">2.1 Microsoft Azure</h3>
          <p className="mb-3">
            Rankify is hosted on Microsoft Azure, one of the world's most secure cloud platforms:
          </p>
          <ul className="list-disc pl-6 space-y-2 mb-6">
            <li><strong>Physical Security:</strong> 24/7 monitored data centers with biometric access controls</li>
            <li><strong>Network Security:</strong> DDoS protection, firewalls, and intrusion detection systems</li>
            <li><strong>Redundancy:</strong> Multi-region deployment ensures 99.99% uptime</li>
            <li><strong>Isolated Environments:</strong> Virtual networks with strict access controls</li>
          </ul>

          <h3 className="text-xl font-semibold mt-6 mb-3">2.2 Application Security</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Container Isolation:</strong> Docker containers with minimal attack surface</li>
            <li><strong>API Security:</strong> Rate limiting, authentication, and input validation on all endpoints</li>
            <li><strong>Web Application Firewall (WAF):</strong> Cloudflare protection against common exploits</li>
            <li><strong>Dependency Scanning:</strong> Automated checks for vulnerable libraries</li>
          </ul>
        </section>

        {/* Access Controls */}
        <section>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-brand-accent to-brand-accent-dark text-white flex items-center justify-center">
              <Eye className="w-5 h-5" />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold">3. Access Controls</h2>
          </div>

          <h3 className="text-xl font-semibold mt-6 mb-3">3.1 User Authentication</h3>
          <ul className="list-disc pl-6 space-y-2 mb-6">
            <li><strong>Multi-Factor Authentication (MFA):</strong> Optional 2FA via authenticator apps or SMS</li>
            <li><strong>Password Requirements:</strong> Minimum 12 characters with complexity rules</li>
            <li><strong>Bcrypt Hashing:</strong> Passwords hashed with salt (never stored in plain text)</li>
            <li><strong>Session Management:</strong> Secure tokens with automatic expiration</li>
            <li><strong>Login Monitoring:</strong> Alerts for suspicious login attempts</li>
          </ul>

          <h3 className="text-xl font-semibold mt-6 mb-3">3.2 Employee Access</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Least Privilege:</strong> Employees only access data necessary for their role</li>
            <li><strong>Role-Based Access Control (RBAC):</strong> Granular permissions system</li>
            <li><strong>Mandatory MFA:</strong> All employees required to use 2FA</li>
            <li><strong>Access Logs:</strong> All data access logged and audited</li>
            <li><strong>Background Checks:</strong> Security screening for all employees</li>
          </ul>

          <h3 className="text-xl font-semibold mt-6 mb-3">3.3 Third-Party Vendors</h3>
          <p>
            We vet all vendors for security compliance and require them to sign Data Processing Agreements (DPAs).
          </p>
        </section>

        {/* Monitoring & Detection */}
        <section>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-brand-secondary to-brand-secondary-dark text-white flex items-center justify-center">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold">4. Monitoring & Threat Detection</h2>
          </div>

          <h3 className="text-xl font-semibold mt-6 mb-3">4.1 24/7 Security Operations</h3>
          <ul className="list-disc pl-6 space-y-2 mb-6">
            <li><strong>SIEM (Security Information and Event Management):</strong> Real-time log analysis</li>
            <li><strong>Intrusion Detection:</strong> Automated alerts for suspicious activity</li>
            <li><strong>Anomaly Detection:</strong> Machine learning identifies unusual patterns</li>
            <li><strong>Incident Response Team:</strong> Dedicated team available 24/7</li>
          </ul>

          <h3 className="text-xl font-semibold mt-6 mb-3">4.2 Proactive Security</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Penetration Testing:</strong> Annual third-party security audits</li>
            <li><strong>Vulnerability Scanning:</strong> Weekly automated scans</li>
            <li><strong>Bug Bounty Program:</strong> Rewards for responsible disclosure</li>
            <li><strong>Security Training:</strong> Regular employee security awareness training</li>
          </ul>
        </section>

        {/* Compliance & Certifications */}
        <section>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-brand-highlight to-brand-highlight-dark text-white flex items-center justify-center">
              <Award className="w-5 h-5" />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold">5. Compliance & Certifications</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <div className="bg-card border border-border rounded-lg p-4">
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <Award className="w-5 h-5 text-emerald" />
                SOC 2 Type II
              </h4>
              <p className="text-sm text-muted-foreground">
                Audited annually for security, availability, and confidentiality controls
              </p>
            </div>

            <div className="bg-card border border-border rounded-lg p-4">
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <Award className="w-5 h-5 text-cyan" />
                GDPR Compliant
              </h4>
              <p className="text-sm text-muted-foreground">
                Full compliance with EU General Data Protection Regulation
              </p>
            </div>

            <div className="bg-card border border-border rounded-lg p-4">
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <Award className="w-5 h-5 text-pink" />
                CCPA Compliant
              </h4>
              <p className="text-sm text-muted-foreground">
                Meets California Consumer Privacy Act requirements
              </p>
            </div>

            <div className="bg-card border border-border rounded-lg p-4">
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <Award className="w-5 h-5 text-coral" />
                ISO 27001
              </h4>
              <p className="text-sm text-muted-foreground">
                Information security management system certification (in progress)
              </p>
            </div>
          </div>

          <h3 className="text-xl font-semibold mt-6 mb-3">5.1 Regular Audits</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li>Annual SOC 2 audits by independent third-party auditors</li>
            <li>Quarterly internal security audits</li>
            <li>Continuous compliance monitoring</li>
          </ul>
        </section>

        {/* Data Backup & Recovery */}
        <section>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-brand-highlight to-brand-highlight-dark text-white flex items-center justify-center">
              <FileCheck className="w-5 h-5" />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold">6. Data Backup & Disaster Recovery</h2>
          </div>

          <h3 className="text-xl font-semibold mt-6 mb-3">6.1 Backup Strategy</h3>
          <ul className="list-disc pl-6 space-y-2 mb-6">
            <li><strong>Continuous Backups:</strong> Real-time replication to secondary region</li>
            <li><strong>Daily Snapshots:</strong> Full database snapshots retained for 30 days</li>
            <li><strong>Geo-Redundant Storage:</strong> Backups stored in multiple geographic locations</li>
            <li><strong>Encrypted Backups:</strong> All backups encrypted with AES-256</li>
          </ul>

          <h3 className="text-xl font-semibold mt-6 mb-3">6.2 Disaster Recovery</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Recovery Time Objective (RTO):</strong> Service restored within 4 hours</li>
            <li><strong>Recovery Point Objective (RPO):</strong> Maximum 15 minutes of data loss</li>
            <li><strong>Failover Testing:</strong> Quarterly disaster recovery drills</li>
            <li><strong>Business Continuity Plan:</strong> Documented procedures for all scenarios</li>
          </ul>
        </section>

        {/* Incident Response */}
        <section>
          <h2 className="text-2xl md:text-3xl font-bold mb-4">7. Incident Response</h2>

          <h3 className="text-xl font-semibold mt-6 mb-3">7.1 Security Incident Process</h3>
          <ol className="list-decimal pl-6 space-y-3">
            <li>
              <strong>Detection:</strong> Automated alerts + manual monitoring identify potential incidents
            </li>
            <li>
              <strong>Assessment:</strong> Security team evaluates severity and impact
            </li>
            <li>
              <strong>Containment:</strong> Immediate action to limit damage and prevent spread
            </li>
            <li>
              <strong>Eradication:</strong> Remove threat and close security vulnerabilities
            </li>
            <li>
              <strong>Recovery:</strong> Restore services and verify system integrity
            </li>
            <li>
              <strong>Communication:</strong> Notify affected users within 72 hours (GDPR requirement)
            </li>
            <li>
              <strong>Post-Mortem:</strong> Analyze incident and improve security measures
            </li>
          </ol>

          <h3 className="text-xl font-semibold mt-6 mb-3">7.2 User Notification</h3>
          <p>
            In the event of a data breach affecting your account, we will notify you via email within 72 hours and provide:
          </p>
          <ul className="list-disc pl-6 space-y-2 mt-3">
            <li>Description of the incident and data affected</li>
            <li>Steps we've taken to address the breach</li>
            <li>Recommended actions to protect your account</li>
            <li>Contact information for questions</li>
          </ul>
        </section>

        {/* Vulnerability Disclosure */}
        <section>
          <h2 className="text-2xl md:text-3xl font-bold mb-4">8. Responsible Vulnerability Disclosure</h2>
          
          <p className="mb-4">
            We welcome security researchers to help us keep Rankify secure. If you discover a security vulnerability:
          </p>

          <div className="bg-card border border-border rounded-lg p-6">
            <h4 className="font-semibold mb-3">How to Report</h4>
            <ol className="list-decimal pl-6 space-y-2 text-sm">
              <li>Email details to <a href="mailto:security@rankify.com" className="text-primary hover:underline">security@rankify.com</a> (PGP key available)</li>
              <li>Include steps to reproduce the vulnerability</li>
              <li>Allow us reasonable time to fix the issue (typically 90 days)</li>
              <li>Do not exploit the vulnerability or access user data</li>
            </ol>

            <div className="mt-4 p-3 bg-muted/50 rounded">
              <p className="text-sm font-semibold mb-1">Bug Bounty Program</p>
              <p className="text-sm text-muted-foreground">
                Eligible vulnerabilities may receive rewards up to $10,000 USD depending on severity.
              </p>
            </div>
          </div>
        </section>

        {/* Your Responsibilities */}
        <section>
          <h2 className="text-2xl md:text-3xl font-bold mb-4">9. Your Security Responsibilities</h2>
          
          <p className="mb-4">
            Security is a shared responsibility. To keep your account secure:
          </p>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-card border border-green-500/30 rounded-lg p-4">
              <h4 className="font-semibold mb-2 text-green-400">✓ Do</h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• Use a strong, unique password</li>
                <li>• Enable two-factor authentication</li>
                <li>• Keep your email account secure</li>
                <li>• Log out on shared devices</li>
                <li>• Report suspicious activity immediately</li>
              </ul>
            </div>

            <div className="bg-card border border-red-500/30 rounded-lg p-4">
              <h4 className="font-semibold mb-2 text-red-400">✗ Don't</h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• Share your password with anyone</li>
                <li>• Reuse passwords from other sites</li>
                <li>• Click suspicious links in emails</li>
                <li>• Access your account on public Wi-Fi</li>
                <li>• Store credentials in plain text</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Questions */}
        <section className="bg-card border border-border rounded-xl p-6 md:p-8">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">10. Security Questions?</h2>
          <p className="mb-4">
            Our security team is here to help. Contact us:
          </p>
          <ul className="space-y-2">
            <li><strong>Security Issues:</strong> <a href="mailto:security@rankify.page" className="text-primary hover:underline">security@rankify.page</a></li>
            <li><strong>Privacy Concerns:</strong> <a href="mailto:privacy@rankify.page" className="text-primary hover:underline">privacy@rankify.page</a></li>
            <li><strong>General Support:</strong> <a href="mailto:support@rankify.page" className="text-primary hover:underline">support@rankify.page</a></li>
          </ul>

          <div className="mt-6 p-4 bg-muted/50 rounded-lg">
            <p className="text-sm text-muted-foreground">
              <strong>Security Updates:</strong> Subscribe to our security mailing list for important security announcements
              and best practices. Email <a href="mailto:security@rankify.page" className="text-primary hover:underline">security@rankify.page</a> with
              subject "Subscribe to Security Updates".
            </p>
          </div>
        </section>
      </div>
    </PageLayout>
  );
}
