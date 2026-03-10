'use client';

import { motion } from 'framer-motion';
import PublicRoute from '@/components/PublicRoute';
import Link from 'next/link';

const TermsPage = () => {
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
                Terms of Service
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
                <h2 className="text-3xl font-bold text-gray-900 mb-6">1. About Recoverly</h2>
                <p className="text-gray-700 mb-6">
                  Recoverly is a specialized financial institution and asset recovery agency that facilitates secure banking
                  operations and fund reclamation. We manage your financial assets through regulated banking procedures and
                  leverage our global network for efficient asset recovery. Our expert team handles all financial analysis,
                  security monitoring, and reclamation operations. You simply choose a financial plan, deposit your funds,
                  and watch your balance grow through our automated banking systems. Recoverly does all the
                  complex work while you benefit from our secure financial infrastructure.
                </p>

                <h2 className="text-3xl font-bold text-gray-900 mb-6 mt-12">2. Financial Plans and Returns</h2>
                <p className="text-gray-700 mb-6">
                  <strong>Daily Rate and Yield:</strong> Yield represents the total percentage growth
                  you&apos;ll earn over the entire duration of your financial plan. Daily Rate is calculated by dividing the
                  total yield by the number of days in your plan. Recoverly calculates these rates based on our banking
                  performance and successful recovery operations. The rates reflect our expertise in
                  managing secure financial pathways and executing complex asset reclamation.
                </p>
                <p className="text-gray-700 mb-6">
                  <strong>First Daily Earning:</strong> Your first daily earning will be credited to your account the day
                  after you activate your plan. This ensures stable processing and account verification.
                </p>
                <p className="text-gray-700 mb-6">
                  <strong>Plan Upgrades:</strong> You must wait for your current plan to reach maturity before you can upgrade to
                  a new plan. This ensures that you receive the full benefits of your current banking agreement. Upgrading before
                  your plan completes its term is not permitted.
                </p>

                <h2 className="text-3xl font-bold text-gray-900 mb-6 mt-12">3. How Your Assets Grow</h2>
                <p className="text-gray-700 mb-6">
                  Recoverly manages your funds through high-efficiency banking operations and asset recovery strategies.
                  We strategically allocate resources to ensure stable growth and maximize the success of reclamation activities.
                  Your account balance grows through these secure banking processes and professional recovery operations.
                  We then return your funds with the agreed-upon yield based on the plan you selected. This creates a
                  secure environment where you benefit from our banking expertise and global recovery network without
                  managing technical financial complexities yourself.
                </p>

                <h2 className="text-3xl font-bold text-gray-900 mb-6 mt-12">4. User Responsibilities</h2>
                <p className="text-gray-700 mb-6">
                  Users are responsible for ensuring they have sufficient funds in their account before activating plans.
                  You must provide accurate information during registration and maintain the security of your account
                  credentials. You agree not to attempt to exploit or manipulate the banking system, including but not
                  limited to creating multiple accounts or attempting to gain immediate earnings by repeatedly upgrading plans.
                </p>

                <h2 className="text-3xl font-bold text-gray-900 mb-6 mt-12">5. Financial Considerations</h2>
                <p className="text-gray-700 mb-6">
                  While Recoverly employs secure banking strategies and advanced recovery techniques, all financial
                  activities are subject to market conditions and regulatory changes. Recovery operations depend on
                  external factors and cross-border financial protocols. Past performance does not guarantee future results.
                  You should only allocate funds that align with your financial capacity.
                </p>

                <h2 className="text-3xl font-bold text-gray-900 mb-6 mt-12">6. Account Management</h2>
                <p className="text-gray-700 mb-6">
                  Each user is permitted only one account. Multiple accounts detected will be disabled. You must wait for
                  your current financial plan to complete its term before initiating a new plan or upgrade. Account balances
                  are updated in real-time based on deposits, withdrawals, and daily interest/yield.
                </p>

                <h2 className="text-3xl font-bold text-gray-900 mb-6 mt-12">7. Withdrawals and Deposits</h2>
                <p className="text-gray-700 mb-6">
                  Deposits are processed according to our banking policies. Withdrawal requests are processed within 4-6 hours
                  on business days and 6-12 hours on weekends. There are no withdrawal limits as long as your account balance
                  reflects sufficient cleared funds.
                </p>

                <h2 className="text-3xl font-bold text-gray-900 mb-6 mt-12">8. Modifications to Terms</h2>
                <p className="text-gray-700 mb-6">
                  Recoverly reserves the right to modify these terms at any time. Users will be notified of significant
                  changes. Continued use of the platform constitutes acceptance of modified terms.
                </p>

                <div className="mt-12 p-6 bg-[#fdfcf0] rounded-lg border border-red-200">
                  <p className="text-[#b08132]">
                    <strong>Contact Us:</strong> If you have questions about these terms, please contact our support team
                    through the <Link href="/contact" className="text-[#c9933a] underline">contact page</Link>.
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

export default TermsPage;

