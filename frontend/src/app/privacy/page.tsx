import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Tundua's Privacy Policy explains how we collect, use, and protect your personal information.",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-2xl font-bold text-primary-600">Tundua</span>
            </Link>
            <nav className="hidden md:flex items-center space-x-6">
              <Link href="/" className="text-gray-600 hover:text-primary-600 transition-colors">
                Home
              </Link>
              <Link href="/dashboard" className="text-gray-600 hover:text-primary-600 transition-colors">
                Dashboard
              </Link>
              <Link href="/auth/login" className="text-primary-600 hover:text-primary-700 font-medium">
                Sign In
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-2xl shadow-sm p-8 md:p-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Privacy Policy
          </h1>
          <p className="text-gray-600 mb-8">
            <strong>Last Updated: January 10, 2026</strong>
          </p>

          <div className="prose prose-lg max-w-none text-gray-700">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Introduction</h2>
              <p className="mb-4">
                Tundua (&ldquo;we,&rdquo; &ldquo;our,&rdquo; or &ldquo;us&rdquo;) is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our study abroad application platform at tundua.com.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Information We Collect</h2>
              
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Information You Provide</h3>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li><strong>Account Information</strong>: Name, email address, phone number when you register</li>
                <li><strong>Profile Information</strong>: Educational background, academic goals, application preferences</li>
                <li><strong>Application Documents</strong>: Transcripts, essays, recommendation letters, and other materials you upload</li>
                <li><strong>Payment Information</strong>: Processed securely through third-party payment processors</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">Information Collected Automatically</h3>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li><strong>Usage Data</strong>: Pages visited, features used, time spent on platform</li>
                <li><strong>Device Information</strong>: IP address, browser type, operating system</li>
                <li><strong>Cookies</strong>: We use cookies to enhance user experience and analyze platform usage</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">Information from Third Parties</h3>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li><strong>Google Authentication</strong>: When you sign in with Google, we receive your name, email address, and profile picture from Google</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">How We Use Your Information</h2>
              <p className="mb-4">We use your information to:</p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>Provide and maintain our study abroad application services</li>
                <li>Process your university applications and manage your account</li>
                <li>Communicate with you about your applications and our services</li>
                <li>Improve our platform and develop new features</li>
                <li>Send you updates, newsletters, and promotional materials (with your consent)</li>
                <li>Comply with legal obligations and protect our rights</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Information Sharing</h2>
              <p className="mb-4">We may share your information with:</p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li><strong>Universities</strong>: Application materials you submit to partner institutions</li>
                <li><strong>Service Providers</strong>: Third-party vendors who assist in operating our platform (hosting, analytics, payment processing)</li>
                <li><strong>Legal Requirements</strong>: When required by law or to protect our rights</li>
              </ul>
              <p className="text-red-600 font-medium">We do NOT sell your personal information to third parties.</p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Data Security</h2>
              <p className="mb-4">We implement appropriate technical and organizational measures to protect your information, including:</p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>Encryption of data in transit and at rest</li>
                <li>Secure authentication mechanisms</li>
                <li>Regular security assessments</li>
                <li>Limited access to personal information</li>
              </ul>
              <p className="text-gray-600">However, no method of transmission over the internet is 100% secure.</p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Your Rights</h2>
              <p className="mb-4">You have the right to:</p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>Access, update, or delete your personal information</li>
                <li>Opt-out of marketing communications</li>
                <li>Request a copy of your data</li>
                <li>Withdraw consent for data processing</li>
                <li>Lodge a complaint with data protection authorities</li>
              </ul>
              <p>To exercise these rights, contact us at <strong>privacy@tundua.com</strong>.</p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Data Retention</h2>
              <p>
                We retain your information for as long as necessary to provide our services and comply with legal obligations. Account data is retained while your account is active and for a reasonable period afterward.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">International Data Transfers</h2>
              <p>
                Your information may be transferred to and processed in countries other than your country of residence. We ensure appropriate safeguards are in place for such transfers.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Children&apos;s Privacy</h2>
              <p>
                Our services are not intended for users under 16 years of age. We do not knowingly collect information from children under 16.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Third-Party Links</h2>
              <p>
                Our platform may contain links to third-party websites. We are not responsible for the privacy practices of these external sites.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Google OAuth</h2>
              <p>When you use &ldquo;Continue with Google,&rdquo; we access only:</p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>Your email address</li>
                <li>Your name</li>
                <li>Your profile picture</li>
              </ul>
              <p>We use this information solely for authentication and account creation purposes.</p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Changes to This Privacy Policy</h2>
              <p>
                We may update this Privacy Policy from time to time. We will notify you of significant changes by posting the new policy on this page and updating the &ldquo;Last Updated&rdquo; date.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Contact Us</h2>
              <p className="mb-4">If you have questions about this Privacy Policy, please contact us at:</p>
              <div className="bg-gray-50 rounded-lg p-6">
                <p><strong>Email</strong>: privacy@tundua.com</p>
                <p><strong>Support</strong>: info@tundua.com</p>
                <p><strong>Website</strong>: https://tundua.com</p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Cookie Policy</h2>
              <p className="mb-4">We use the following types of cookies:</p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li><strong>Essential Cookies</strong>: Required for platform functionality</li>
                <li><strong>Analytics Cookies</strong>: Help us understand how you use our platform</li>
                <li><strong>Preference Cookies</strong>: Remember your settings and preferences</li>
              </ul>
              <p>You can control cookies through your browser settings.</p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">GDPR Compliance (For EU Users)</h2>
              <p>
                If you are in the European Economic Area (EEA), we process your data based on:
              </p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>Your consent</li>
                <li>Performance of our contract with you</li>
                <li>Compliance with legal obligations</li>
                <li>Our legitimate business interests</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Nigeria Data Protection Regulation (NDPR) Compliance</h2>
              <p>
                We comply with the Nigeria Data Protection Regulation and ensure your data rights are protected under Nigerian law.
              </p>
            </section>
          </div>

          <div className="mt-12 pt-8 border-t border-gray-200">
            <p className="text-center text-gray-600">
              <strong>Tundua Education Services</strong><br />
              Committed to your privacy and academic success.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 mt-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <span className="text-lg font-bold text-primary-600">Tundua</span>
              <p className="text-sm text-gray-500 mt-1">Study Abroad Application Platform</p>
            </div>
            <div className="flex items-center space-x-6">
              <Link href="/privacy" className="text-sm text-gray-600 hover:text-primary-600">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-sm text-gray-600 hover:text-primary-600">
                Terms of Service
              </Link>
            </div>
          </div>
          <div className="mt-6 pt-6 border-t border-gray-100 text-center text-sm text-gray-500">
            © {new Date().getFullYear()} Tundua. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
