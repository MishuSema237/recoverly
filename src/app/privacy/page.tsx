'use client';

import { motion } from 'framer-motion';
import PublicRoute from '@/components/PublicRoute';
import Link from 'next/link';

const PrivacyPage = () => {
  return (
    <PublicRoute>
      <div className="min-h-screen bg-gray-50">
        <section className="bg-gradient-to-br from-navy-900 via-navy-800 to-navy-900 text-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center"
            >
              <h1 className="text-5xl lg:text-6xl font-bold mb-6">
                Privacy Policy
              </h1>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Last updated: {new Date().toLocaleDateString()}
              </p>
            </motion.div>
          </div>
        </section>

        <section className="py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-white rounded-2xl shadow-lg p-8 lg:p-12"
            >
              <div className="prose prose-lg max-w-none">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">1. Information We Collect</h2>
                <p className="text-gray-700 mb-6">
                  Recoverly collects information necessary to provide our banking and recovery services. This includes personal
                  information such as name, email address, contact information, and financial details required for
                  secure deposits and withdrawals. We also collect information about your account activities, balances,
                  and transaction history.
                </p>

                <h2 className="text-3xl font-bold text-gray-900 mb-6 mt-12">2. How We Use Your Information</h2>
                <p className="text-gray-700 mb-6">
                  We use your information to:
                </p>
                <ul className="list-disc pl-6 text-gray-700 mb-6 space-y-2">
                  <li>Process your financial plans and manage your secure account</li>
                  <li>Calculate and credit daily yields based on your selected plan</li>
                  <li>Process deposits and withdrawals through our banking network</li>
                  <li>Execute and manage asset recovery operations using professional protocols</li>
                  <li>Communicate with you about your account and recovery status</li>
                  <li>Provide customer support and respond to financial inquiries</li>
                  <li>Comply with international banking and recovery regulations</li>
                </ul>

                <h2 className="text-3xl font-bold text-gray-900 mb-6 mt-12">3. How Recoverly Operates</h2>
                <p className="text-gray-700 mb-6">
                  Recoverly operates as a specialized bank and recovery agency. We manage your funds through secure
                  financial pathways and leverage our global infrastructure for asset reclamation.
                  Our expert team handles all technical aspects, financial analysis, and recovery operations.
                  Growth is generated through these optimized banking processes and successful reclamation projects.
                  Recoverly retains a portion of the generated proceeds as a service fee for our infrastructure and expertise.
                  This arrangement allows you to benefit from our secure financial systems without managing technical
                  banking or recovery complexities yourself.
                </p>

                <h2 className="text-3xl font-bold text-gray-900 mb-6 mt-12">4. Financial Data and Performance</h2>
                <p className="text-gray-700 mb-6">
                  We track your account performance, daily yields, plan status, and balances. This data is
                  used to manage your returns based on the banking plans you select. Daily rates and yield percentages
                  are determined by Recoverly based on our banking performance and successful recovery
                  operations. This data helps us ensure the stability and growth of each plan.
                </p>

                <h2 className="text-3xl font-bold text-gray-900 mb-6 mt-12">5. Data Security</h2>
                <p className="text-gray-700 mb-6">
                  Recoverly employs industry-standard security measures to protect your personal and financial
                  information. We use encryption, secure servers, and access controls to safeguard your data. However,
                  no system is 100% secure, and you acknowledge that transmission of data over the internet carries inherent risks.
                </p>

                <h2 className="text-3xl font-bold text-gray-900 mb-6 mt-12">6. Data Sharing</h2>
                <p className="text-gray-700 mb-6">
                  We do not sell your personal information. We may share information with:
                </p>
                <ul className="list-disc pl-6 text-gray-700 mb-6 space-y-2">
                  <li>Service providers who assist in operating our secure platform</li>
                  <li>Financial institutions for processing deposits and withdrawals</li>
                  <li>Legal and regulatory authorities as required for compliance</li>
                  <li>Global partners involved in our asset recovery operations (as necessary for execution)</li>
                </ul>

                <h2 className="text-3xl font-bold text-gray-900 mb-6 mt-12">7. Your Rights</h2>
                <p className="text-gray-700 mb-6">
                  You have the right to:
                </p>
                <ul className="list-disc pl-6 text-gray-700 mb-6 space-y-2">
                  <li>Access your personal information</li>
                  <li>Request corrections to inaccurate information</li>
                  <li>Request deletion of your account and personal data (subject to legal and contractual obligations)</li>
                  <li>Opt out of marketing communications</li>
                  <li>Withdraw your consent for data processing (which may affect our ability to provide services)</li>
                </ul>

                <h2 className="text-3xl font-bold text-gray-900 mb-6 mt-12">8. Cookies and Tracking</h2>
                <p className="text-gray-700 mb-6">
                  We use cookies and similar technologies to enhance your experience, analyze platform usage, and improve
                  our services. You can control cookie preferences through your browser settings.
                </p>

                <h2 className="text-3xl font-bold text-gray-900 mb-6 mt-12">9. Children&apos;s Privacy</h2>
                <p className="text-gray-700 mb-6">
                  Recoverly services are not intended for individuals under 18 years of age. We do not knowingly collect
                  personal information from children.
                </p>

                <h2 className="text-3xl font-bold text-gray-900 mb-6 mt-12">10. International Users</h2>
                <p className="text-gray-700 mb-6">
                  If you are using Recoverly from outside the country where our servers are located, your information
                  may be transferred across international borders. By using our services, you consent to such transfers.
                </p>

                <h2 className="text-3xl font-bold text-gray-900 mb-6 mt-12">11. Changes to Privacy Policy</h2>
                <p className="text-gray-700 mb-6">
                  Recoverly may update this privacy policy from time to time. We will notify users of significant
                  changes via email or platform notification. Continued use of our services after changes constitutes
                  acceptance of the updated policy.
                </p>

                <div className="mt-12 p-6 bg-[#fdfcf0] rounded-lg border border-red-200">
                  <p className="text-[#b08132]">
                    <strong>Contact Us:</strong> For questions about this privacy policy or to exercise your rights,
                    please contact us through the <Link href="/contact" className="text-[#c9933a] underline">contact page</Link>.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </PublicRoute>
  );
};

export default PrivacyPage;

