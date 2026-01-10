import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Tundua's Terms of Service outlines the rules and guidelines for using our study abroad application platform.",
};

export default function TermsPage() {
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
            Terms of Service
          </h1>
          <p className="text-gray-600 mb-8">
            <strong>Last Updated: January 10, 2026</strong>
          </p>

          <div className="prose prose-lg max-w-none text-gray-700">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Acceptance of Terms</h2>
              <p className="mb-4">
                By accessing or using Tundua&apos;s study abroad application platform (&ldquo;Service&rdquo;), you agree to be bound by these Terms of Service (&ldquo;Terms&rdquo;). If you do not agree to these Terms, please do not use our Service.
              </p>
              <p className="mb-4">
                These Terms constitute a legally binding agreement between you and Tundua Education Services (&ldquo;Tundua,&rdquo; &ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;).
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Description of Service</h2>
              <p className="mb-4">Tundua provides an online platform that helps students:</p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>Discover and research universities worldwide</li>
                <li>Manage study abroad applications</li>
                <li>Track application progress and deadlines</li>
                <li>Access educational consulting services</li>
                <li>Connect with partner institutions</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. User Accounts</h2>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">3.1 Registration</h3>
              <p className="mb-4">
                To access certain features, you must create an account. You agree to provide accurate, current, and complete information during registration and to update this information to keep it accurate.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">3.2 Account Security</h3>
              <p className="mb-4">
                You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You must notify us immediately of any unauthorized use.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">3.3 Account Termination</h3>
              <p className="mb-4">
                We reserve the right to suspend or terminate your account if you violate these Terms or engage in fraudulent or harmful activities.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. User Responsibilities</h2>
              <p className="mb-4">When using our Service, you agree to:</p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>Provide truthful and accurate information in all applications and documents</li>
                <li>Not submit fraudulent, plagiarized, or misleading materials</li>
                <li>Respect intellectual property rights of others</li>
                <li>Not interfere with or disrupt the Service or servers</li>
                <li>Not attempt to gain unauthorized access to any part of the Service</li>
                <li>Comply with all applicable laws and regulations</li>
                <li>Not use the Service for any illegal or unauthorized purpose</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Application Services</h2>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">5.1 No Guarantee of Admission</h3>
              <p className="mb-4">
                Tundua facilitates the application process but does not guarantee admission to any university or program. Admission decisions are made solely by the respective institutions.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">5.2 Document Accuracy</h3>
              <p className="mb-4">
                You are solely responsible for the accuracy and authenticity of all documents and information submitted through our platform. We are not liable for any consequences arising from inaccurate or fraudulent submissions.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">5.3 Deadlines</h3>
              <p className="mb-4">
                While we provide deadline tracking features, you are responsible for ensuring timely submission of your applications. We are not liable for missed deadlines.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Fees and Payments</h2>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">6.1 Service Fees</h3>
              <p className="mb-4">
                Certain features of our Service may require payment. All fees are displayed before purchase and are subject to change with notice.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">6.2 Third-Party Fees</h3>
              <p className="mb-4">
                University application fees, visa fees, and other third-party charges are separate from Tundua&apos;s fees and are your responsibility.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">6.3 Refund Policy</h3>
              <p className="mb-4">
                Refunds are handled on a case-by-case basis. Please contact our support team for refund requests. Application fees paid to universities are non-refundable through Tundua.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">7. Intellectual Property</h2>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">7.1 Our Content</h3>
              <p className="mb-4">
                The Service, including its design, features, content, and functionality, is owned by Tundua and protected by intellectual property laws. You may not copy, modify, or distribute our content without permission.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">7.2 Your Content</h3>
              <p className="mb-4">
                You retain ownership of content you submit (essays, documents, etc.). By submitting content, you grant Tundua a license to use it for providing and improving our Service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">8. Privacy</h2>
              <p className="mb-4">
                Your use of the Service is also governed by our <Link href="/privacy" className="text-primary-600 hover:text-primary-700 underline">Privacy Policy</Link>, which describes how we collect, use, and protect your personal information.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">9. Disclaimers</h2>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">9.1 Service Availability</h3>
              <p className="mb-4">
                The Service is provided &ldquo;as is&rdquo; and &ldquo;as available.&rdquo; We do not guarantee uninterrupted or error-free access to the Service.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">9.2 Information Accuracy</h3>
              <p className="mb-4">
                While we strive to provide accurate university and program information, we do not warrant its completeness or accuracy. Always verify information directly with institutions.
              </p>

              <h3 className="text-xl font-semibold text-gray-900 mb-3">9.3 Third-Party Services</h3>
              <p className="mb-4">
                Our Service may contain links to third-party websites or services. We are not responsible for their content or practices.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">10. Limitation of Liability</h2>
              <p className="mb-4">
                To the maximum extent permitted by law, Tundua shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to:
              </p>
              <ul className="list-disc pl-6 mb-4 space-y-2">
                <li>Loss of profits, data, or other intangible losses</li>
                <li>Inability to use the Service</li>
                <li>Unauthorized access to your account or data</li>
                <li>Statements or conduct of any third party</li>
                <li>University admission decisions</li>
                <li>Visa application outcomes</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">11. Indemnification</h2>
              <p className="mb-4">
                You agree to indemnify and hold harmless Tundua, its officers, directors, employees, and agents from any claims, damages, losses, or expenses arising from your use of the Service or violation of these Terms.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">12. Changes to Terms</h2>
              <p className="mb-4">
                We may modify these Terms at any time. We will notify you of significant changes by posting the updated Terms on our website and updating the &ldquo;Last Updated&rdquo; date. Your continued use of the Service after changes constitutes acceptance of the new Terms.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">13. Governing Law</h2>
              <p className="mb-4">
                These Terms shall be governed by and construed in accordance with the laws of the Federal Republic of Nigeria, without regard to its conflict of law provisions.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">14. Dispute Resolution</h2>
              <p className="mb-4">
                Any disputes arising from these Terms or your use of the Service shall first be attempted to be resolved through informal negotiation. If unresolved, disputes shall be submitted to binding arbitration in accordance with applicable arbitration rules.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">15. Severability</h2>
              <p className="mb-4">
                If any provision of these Terms is found to be unenforceable, the remaining provisions will continue in full force and effect.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">16. Contact Us</h2>
              <p className="mb-4">If you have questions about these Terms, please contact us at:</p>
              <div className="bg-gray-50 rounded-lg p-6">
                <p><strong>Email</strong>: legal@tundua.com</p>
                <p><strong>Support</strong>: info@tundua.com</p>
                <p><strong>Website</strong>: https://tundua.com</p>
              </div>
            </section>

            <div className="mt-12 pt-8 border-t border-gray-200 text-center">
              <p className="text-gray-600">
                <strong>Tundua Education Services</strong><br />
                Your trusted partner in study abroad applications.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 mt-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-600 text-sm">
              © {new Date().getFullYear()} Tundua. All rights reserved.
            </p>
            <div className="flex gap-6">
              <Link href="/privacy" className="text-gray-600 hover:text-primary-600 text-sm">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-gray-600 hover:text-primary-600 text-sm">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
