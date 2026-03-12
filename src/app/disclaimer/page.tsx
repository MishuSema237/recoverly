'use client';

import { motion } from 'framer-motion';
import PublicRoute from '@/components/PublicRoute';
import Link from 'next/link';

const DisclaimerPage = () => {
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
                Legal Disclaimer
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
              <div className="prose prose-lg max-w-none text-gray-700">
                <h2 className="text-2xl font-bold text-navy-900 mb-6 font-playfair">1. No Legal or Financial Advice</h2>
                <p className="mb-6">
                  The information provided by Recoverly Trust Bank ("Recoverly," "we," "us," or "our") on our website is for general informational purposes only. All information is provided in good faith, however, we make no representation or warranty of any kind, express or implied, regarding the accuracy, adequacy, validity, reliability, availability, or completeness of any information on the site.
                </p>

                <h2 className="text-2xl font-bold text-navy-900 mb-6 font-playfair">2. Asset Recovery Risks</h2>
                <p className="mb-6">
                  Asset recovery is a complex process involving cross-border legal and financial protocols. Success is not guaranteed and depends on various factors, including the nature of the scam, the jurisdiction of the funds, and the cooperation of external financial institutions. Past recovery successes do not guarantee future results.
                </p>

                <h2 className="text-2xl font-bold text-navy-900 mb-6 font-playfair">3. Limitation of Liability</h2>
                <p className="mb-6">
                  Under no circumstance shall we have any liability to you for any loss or damage of any kind incurred as a result of the use of the site or reliance on any information provided on the site. Your use of the site and your reliance on any information on the site is solely at your own risk.
                </p>

                <h2 className="text-2xl font-bold text-navy-900 mb-6 font-playfair">4. External Links Disclaimer</h2>
                <p className="mb-6">
                  The site may contain links to other websites or content belonging to or originating from third parties. Such external links are not investigated, monitored, or checked for accuracy, adequacy, validity, reliability, availability, or completeness by us. We do not warrant, endorse, guarantee, or assume responsibility for the accuracy or reliability of any information offered by third-party websites linked through the site.
                </p>

                <h2 className="text-2xl font-bold text-navy-900 mb-6 font-playfair">5. Professional Disclaimer</h2>
                <p className="mb-6">
                  Recoverly operates as a specialized legal and financial entity. While we employ forensic accountants and legal specialists, our services should not be seen as a replacement for independent legal counsel or financial planning. We encourage you to consult with independent professionals before making significant financial decisions.
                </p>

                <div className="mt-12 p-6 bg-navy-50 rounded-lg border border-gold-200">
                  <p className="text-navy-900 font-medium italic">
                    By using this website and our services, you acknowledge that you have read and understood this legal disclaimer. For further information, please contact our legal team through the <Link href="/contact" className="text-gold-600 underline hover:text-gold-700 transition-colors">contact page</Link>.
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

export default DisclaimerPage;
