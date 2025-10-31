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
                <h2 className="text-3xl font-bold text-gray-900 mb-6">1. About Tesla Capital</h2>
                <p className="text-gray-700 mb-6">
                  Tesla Capital is an investment platform that acts as a middleman between investors and the stock market. 
                  We take your investment funds and strategically invest them into top-performing stocks on the stock 
                  exchange market. We also engage in crypto mining operations using your capital as investment funds. 
                  Our expert team handles all market analysis, stock selection, and crypto mining operations. You simply 
                  choose an investment plan, deposit your funds, and watch your money grow. Tesla Capital does all the 
                  hard work while you wait for your returns.
                </p>

                <h2 className="text-3xl font-bold text-gray-900 mb-6 mt-12">2. Investment Plans and Returns</h2>
                <p className="text-gray-700 mb-6">
                  <strong>Daily Rate and ROI:</strong> ROI (Return on Investment) represents the total percentage return 
                  you&apos;ll earn over the entire duration of your investment plan. Daily Rate is calculated by dividing the 
                  total ROI by the number of days in your plan. Tesla Capital calculates these rates based on our actual 
                  investment performance in top stocks and crypto mining operations. The rates reflect our expertise in 
                  identifying profitable stock market opportunities and managing crypto mining operations.
                </p>
                <p className="text-gray-700 mb-6">
                  <strong>First Daily Earning:</strong> Your first daily earning will be credited to your account the day 
                  after you make your investment. This ensures fairness and prevents exploitation of the system.
                </p>
                <p className="text-gray-700 mb-6">
                  <strong>Plan Upgrades:</strong> You must wait for your current plan to finish before you can upgrade to 
                  a new plan. This ensures that you receive the full benefits of your current investment. Upgrading before 
                  your plan completes is not permitted.
                </p>

                <h2 className="text-3xl font-bold text-gray-900 mb-6 mt-12">3. How Your Money Grows</h2>
                <p className="text-gray-700 mb-6">
                  Tesla Capital invests your funds into top-performing stocks from leading companies on the stock exchange 
                  market. We strategically allocate investments based on market analysis and our expertise in identifying 
                  profitable opportunities. Additionally, we use your capital for crypto mining operations. Your investments 
                  multiply through these strategic stock market investments and crypto mining activities. We then return your 
                  money with profits based on the plan you selected, keeping our share of the profits. This creates a 
                  win-win situation where you benefit from our expertise without doing any of the complex work yourself.
                </p>

                <h2 className="text-3xl font-bold text-gray-900 mb-6 mt-12">4. User Responsibilities</h2>
                <p className="text-gray-700 mb-6">
                  Users are responsible for ensuring they have sufficient funds in their account before making investments. 
                  You must provide accurate information during registration and maintain the security of your account 
                  credentials. You agree not to attempt to exploit or manipulate the investment system, including but not 
                  limited to creating multiple accounts or attempting to gain immediate earnings by repeatedly upgrading plans.
                </p>

                <h2 className="text-3xl font-bold text-gray-900 mb-6 mt-12">5. Investment Risks</h2>
                <p className="text-gray-700 mb-6">
                  While Tesla Capital employs expert strategies and invests in top-performing stocks, all investments carry 
                  inherent risks. Stock market performance can fluctuate, and crypto mining operations are subject to market 
                  volatility. Past performance does not guarantee future results. You should only invest funds that you can 
                  afford to lose.
                </p>

                <h2 className="text-3xl font-bold text-gray-900 mb-6 mt-12">6. Account Management</h2>
                <p className="text-gray-700 mb-6">
                  Each user is permitted only one account. Multiple accounts detected will be disabled. You must wait for 
                  your current investment plan to complete before initiating a new plan or upgrade. Account balances are 
                  updated in real-time based on deposits, withdrawals, and daily earnings.
                </p>

                <h2 className="text-3xl font-bold text-gray-900 mb-6 mt-12">7. Withdrawals and Deposits</h2>
                <p className="text-gray-700 mb-6">
                  Deposits are processed according to our deposit policies. Withdrawal requests are processed within 4-6 hours 
                  on business days and 6-12 hours on weekends. There are no withdrawal limits as long as your account balance 
                  reflects sufficient funds.
                </p>

                <h2 className="text-3xl font-bold text-gray-900 mb-6 mt-12">8. Modifications to Terms</h2>
                <p className="text-gray-700 mb-6">
                  Tesla Capital reserves the right to modify these terms at any time. Users will be notified of significant 
                  changes. Continued use of the platform constitutes acceptance of modified terms.
                </p>

                <div className="mt-12 p-6 bg-red-50 rounded-lg border border-red-200">
                  <p className="text-red-800">
                    <strong>Contact Us:</strong> If you have questions about these terms, please contact our support team 
                    through the <Link href="/contact" className="text-red-600 underline">contact page</Link>.
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

