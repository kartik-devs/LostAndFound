import { Shield, Eye, Lock, Database, UserCheck, AlertTriangle } from 'lucide-react'

function Section({ icon: Icon, title, children }) {
  return (
    <div className="rounded-2xl border border-slate-800 glass-effect p-8 animate-fade-in">
      <div className="flex items-center gap-3 mb-6">
        <div className="h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
          <Icon className="h-5 w-5 text-blue-400" />
        </div>
        <h2 className="text-xl font-bold text-white">{title}</h2>
      </div>
      <div className="prose prose-slate prose-invert max-w-none">
        {children}
      </div>
    </div>
  )
}

export default function PrivacyPage() {
  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-white">Privacy Policy</h1>
        <p className="text-xl text-slate-400 max-w-3xl mx-auto">
          Your privacy is important to us. This policy explains how we collect, use, and protect 
          your personal information when you use Campus Lost & Found.
        </p>
        <div className="text-sm text-slate-500">
          Last updated: January 15, 2024 | Effective: January 1, 2024
        </div>
      </div>

      {/* Quick Summary */}
      <div className="rounded-2xl border border-blue-800/50 bg-blue-500/5 p-6">
        <div className="flex items-center gap-3 mb-4">
          <Shield className="h-6 w-6 text-blue-400" />
          <h2 className="text-lg font-semibold text-white">Privacy at a Glance</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 text-sm">
          <div className="text-center p-3 rounded-lg bg-slate-800/30">
            <div className="text-green-400 font-semibold">✓ Minimal Data</div>
            <div className="text-slate-400">We only collect what's necessary</div>
          </div>
          <div className="text-center p-3 rounded-lg bg-slate-800/30">
            <div className="text-green-400 font-semibold">✓ No Selling</div>
            <div className="text-slate-400">We never sell your information</div>
          </div>
          <div className="text-center p-3 rounded-lg bg-slate-800/30">
            <div className="text-green-400 font-semibold">✓ Secure Storage</div>
            <div className="text-slate-400">Your data is encrypted and protected</div>
          </div>
          <div className="text-center p-3 rounded-lg bg-slate-800/30">
            <div className="text-green-400 font-semibold">✓ Your Control</div>
            <div className="text-slate-400">Delete your data anytime</div>
          </div>
        </div>
      </div>

      <Section icon={Database} title="Information We Collect">
        <div className="space-y-4 text-slate-300">
          <div>
            <h3 className="text-lg font-semibold text-white mb-2">Account Information</h3>
            <ul className="list-disc list-inside space-y-1 text-slate-400">
              <li>Name and university email address</li>
              <li>Student ID number (for verification purposes)</li>
              <li>Phone number (optional, for claim notifications)</li>
              <li>Profile preferences and settings</li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-white mb-2">Item Information</h3>
            <ul className="list-disc list-inside space-y-1 text-slate-400">
              <li>Item descriptions, categories, and locations</li>
              <li>Photos of found items (automatically deleted after 90 days)</li>
              <li>Date and time of item reports</li>
              <li>Claim messages and contact information</li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-white mb-2">Technical Information</h3>
            <ul className="list-disc list-inside space-y-1 text-slate-400">
              <li>IP address and browser information</li>
              <li>Device type and operating system</li>
              <li>Usage patterns and feature interactions</li>
              <li>Error logs and performance data</li>
            </ul>
          </div>
        </div>
      </Section>

      <Section icon={Eye} title="How We Use Your Information">
        <div className="space-y-4 text-slate-300">
          <div>
            <h3 className="text-lg font-semibold text-white mb-2">Primary Uses</h3>
            <ul className="list-disc list-inside space-y-1 text-slate-400">
              <li>Facilitate the return of lost items to their owners</li>
              <li>Verify the identity of users claiming items</li>
              <li>Send notifications about potential matches and claim updates</li>
              <li>Provide customer support and respond to inquiries</li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-white mb-2">Service Improvement</h3>
            <ul className="list-disc list-inside space-y-1 text-slate-400">
              <li>Analyze usage patterns to improve our platform</li>
              <li>Generate anonymous statistics about lost item trends</li>
              <li>Enhance security and prevent fraudulent claims</li>
              <li>Develop new features based on user needs</li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-white mb-2">Legal Compliance</h3>
            <ul className="list-disc list-inside space-y-1 text-slate-400">
              <li>Comply with university policies and procedures</li>
              <li>Respond to legal requests and law enforcement</li>
              <li>Protect against fraud and security threats</li>
              <li>Maintain records as required by educational regulations</li>
            </ul>
          </div>
        </div>
      </Section>

      <Section icon={Lock} title="Data Protection & Security">
        <div className="space-y-4 text-slate-300">
          <div>
            <h3 className="text-lg font-semibold text-white mb-2">Security Measures</h3>
            <ul className="list-disc list-inside space-y-1 text-slate-400">
              <li>All data is encrypted in transit and at rest using industry-standard protocols</li>
              <li>Access to personal information is restricted to authorized personnel only</li>
              <li>Regular security audits and vulnerability assessments</li>
              <li>Secure servers hosted in certified data centers</li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-white mb-2">Data Retention</h3>
            <ul className="list-disc list-inside space-y-1 text-slate-400">
              <li>Item photos are automatically deleted after 90 days</li>
              <li>Account information is retained while you're an active student</li>
              <li>Claim records are kept for 1 year for verification purposes</li>
              <li>Anonymous usage statistics may be retained indefinitely</li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-white mb-2">Access Controls</h3>
            <ul className="list-disc list-inside space-y-1 text-slate-400">
              <li>Multi-factor authentication for admin accounts</li>
              <li>Role-based access permissions</li>
              <li>Regular access reviews and deprovisioning</li>
              <li>Audit logs for all data access and modifications</li>
            </ul>
          </div>
        </div>
      </Section>

      <Section icon={UserCheck} title="Your Rights & Choices">
        <div className="space-y-4 text-slate-300">
          <div>
            <h3 className="text-lg font-semibold text-white mb-2">Data Access & Control</h3>
            <ul className="list-disc list-inside space-y-1 text-slate-400">
              <li>View and download all your personal data</li>
              <li>Update or correct your account information</li>
              <li>Delete your account and associated data</li>
              <li>Opt out of non-essential communications</li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-white mb-2">Communication Preferences</h3>
            <ul className="list-disc list-inside space-y-1 text-slate-400">
              <li>Choose how you receive notifications (email, SMS, in-app)</li>
              <li>Set frequency preferences for updates</li>
              <li>Opt out of promotional communications</li>
              <li>Maintain essential service notifications</li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-white mb-2">Data Portability</h3>
            <ul className="list-disc list-inside space-y-1 text-slate-400">
              <li>Export your data in common formats (JSON, CSV)</li>
              <li>Transfer your information to other services</li>
              <li>Receive copies of your item reports and claims</li>
              <li>Access historical activity logs</li>
            </ul>
          </div>
        </div>
      </Section>

      <Section icon={AlertTriangle} title="Information Sharing">
        <div className="space-y-4 text-slate-300">
          <div>
            <h3 className="text-lg font-semibold text-white mb-2">We DO NOT Share</h3>
            <ul className="list-disc list-inside space-y-1 text-slate-400">
              <li>Personal information with third-party marketers</li>
              <li>Student data with non-university entities</li>
              <li>Individual usage patterns or behaviors</li>
              <li>Contact information without explicit consent</li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-white mb-2">Limited Sharing</h3>
            <ul className="list-disc list-inside space-y-1 text-slate-400">
              <li>University administration for policy compliance</li>
              <li>Campus security for safety-related items</li>
              <li>Law enforcement when legally required</li>
              <li>Service providers under strict confidentiality agreements</li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-white mb-2">Anonymous Data</h3>
            <ul className="list-disc list-inside space-y-1 text-slate-400">
              <li>Aggregate statistics for university reporting</li>
              <li>Anonymized trends for research purposes</li>
              <li>Performance metrics for service improvement</li>
              <li>General usage patterns (no personal identifiers)</li>
            </ul>
          </div>
        </div>
      </Section>

      {/* Contact Information */}
      <div className="rounded-2xl border border-slate-800 glass-effect p-8">
        <h2 className="text-xl font-bold text-white mb-4">Questions About Privacy?</h2>
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <h3 className="text-lg font-semibold text-white mb-2">Privacy Officer</h3>
            <div className="space-y-1 text-slate-400">
              <div>📧 privacy@campuslostandfound.edu</div>
              <div>📞 (555) 123-PRIV</div>
              <div>🏢 Student Services Building, Room 150</div>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white mb-2">Data Protection</h3>
            <div className="space-y-1 text-slate-400">
              <div>📧 security@campuslostandfound.edu</div>
              <div>📞 (555) 123-SAFE</div>
              <div>🚨 Report security issues immediately</div>
            </div>
          </div>
        </div>
      </div>

      {/* Updates */}
      <div className="rounded-2xl border border-amber-800/50 bg-amber-500/5 p-6">
        <div className="flex items-center gap-3 mb-4">
          <AlertTriangle className="h-6 w-6 text-amber-400" />
          <h3 className="text-lg font-semibold text-white">Policy Updates</h3>
        </div>
        <p className="text-slate-300">
          We may update this privacy policy from time to time. When we do, we'll notify you via 
          email and post the updated policy on our website. Continued use of our service after 
          changes indicates acceptance of the new policy.
        </p>
      </div>
    </div>
  )
}