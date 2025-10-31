'use client';

import { motion } from 'framer-motion';
import PublicRoute from '@/components/PublicRoute';
import Link from 'next/link';

const PrivacyPage = () => {
  return (
    <PublicRoute>
      <div className="min-h-screen bg-gray-50">
        <section className="bg-gradient-to-br from-gray-900 via-red-900 to-gray-900 text-white py-20">
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
                  Tesla Capital collects information necessary to provide our investment services. This includes personal 
                  information such as name, email address, contact information, and financial information required for 
                  deposits and withdrawals. We also collect information about your investment activities, account balances, 
                  and transaction history.
                </p>

                <h2 className="text-3xl font-bold text-gray-900 mb-6 mt-12">2. How We Use Your Information</h2>
                <p className="text-gray-700 mb-6">
                  We use your information to:
                </p>
                <ul className="list-disc pl-6 text-gray-700 mb-6 space-y-2">
                  <li>Process your investment plans and manage your account</li>
                  <li>Calculate and credit daily earnings based on your investment plan</li>
                  <li>Process deposits and withdrawals</li>
                  <li>Invest your funds into top-performing stocks and manage crypto mining operations</li>
                  <li>Communicate with you about your account and investment activities</li>
                  <li>Provide customer support and respond to inquiries</li>
                  <li>Comply with legal and regulatory requirements</li>
                </ul>

                <h2 className="text-3xl font-bold text-gray-900 mb-6 mt-12">3. How Tesla Capital Makes Money</h2>
                <p className="text-gray-700 mb-6">
                  Tesla Capital acts as an investment middleman. We take your funds and invest them strategically into 
                  top-performing stocks on the stock exchange market. We also use your capital for crypto mining operations. 
                  Our expert team manages all investment decisions, market analysis, and operations. When your investments 
                  generate returns, we distribute profits to you according to your selected plan (based on ROI and daily 
                  rates we calculate). Tesla Capital keeps a portion of the profits as our service fee. This win-win 
                  arrangement allows you to benefit from our expertise without managing the complexities of stock market 
                  investing or crypto mining yourself.
                </p>

                <h2 className="text-3xl font-bold text-gray-900 mb-6 mt-12">4. Investment Data and Performance</h2>
                <p className="text-gray-700 mb-6">
                  We track your investment performance, daily earnings, plan duration, and account balances. This data is 
                  used to calculate your returns based on the investment plans you select. Daily rates and ROI percentages 
                  are calculated by Tesla Capital based on our actual investment performance in top stocks and crypto mining 
                  operations. This performance data helps us determine appropriate returns for each investment plan.
                </p>

                <h2 className="text-3xl font-bold text-gray-900 mb-6 mt-12">5. Data Security</h2>
                <p className="text-gray-700 mb-6">
                  Tesla Capital employs industry-standard security measures to protect your personal and financial 
                  information. We use encryption, secure servers, and access controls to safeguard your data. However, 
                  no system is 100% secure, and you acknowledge that transmission of data over the internet carries inherent risks.
                </p>

                <h2 className="text-3xl font-bold text-gray-900 mb-6 mt-12">6. Data Sharing</h2>
                <p className="text-gray-700 mb-6">
                  We do not sell your personal information. We may share information with:
                </p>
                <ul className="list-disc pl-6 text-gray-700 mb-6 space-y-2">
                  <li>Service providers who assist in operating our platform (subject to confidentiality agreements)</li>
                  <li>Financial institutions for processing deposits and withdrawals</li>
                  <li>Legal authorities when required by law or to protect our rights</li>
                  <li>Business partners involved in our stock market investments and crypto mining operations (as necessary for investment execution)</li>
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
                  Tesla Capital services are not intended for individuals under 18 years of age. We do not knowingly collect 
                  personal information from children.
                </p>

                <h2 className="text-3xl font-bold text-gray-900 mb-6 mt-12">10. International Users</h2>
                <p className="text-gray-700 mb-6">
                  If you are using Tesla Capital from outside the country where our servers are located, your information 
                  may be transferred across international borders. By using our services, you consent to such transfers.
                </p>

                <h2 className="text-3xl font-bold text-gray-900 mb-6 mt-12">11. Changes to Privacy Policy</h2>
                <p className="text-gray-700 mb-6">
                  Tesla Capital may update this privacy policy from time to time. We will notify users of significant 
                  changes via email or platform notification. Continued use of our services after changes constitutes 
                  acceptance of the updated policy.
                </p>

                <div className="mt-12 p-6 bg-red-50 rounded-lg border border-red-200">
                  <p className="text-red-800">
                    <strong>Contact Us:</strong> For questions about this privacy policy or to exercise your rights, 
                    please contact us through the <Link href="/contact" className="text-red-600 underline">contact page</Link>.
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

