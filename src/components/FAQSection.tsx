'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp } from 'lucide-react';

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: 'What is Tesla Capital?',
      answer: 'Tesla Capital is a world-class investment platform that acts as a trusted middleman for your investments. We take your money and invest it into top-performing stocks on the stock exchange market, plus engage in crypto mining operations. We handle all the complex work of analyzing market trends, selecting high-performing stocks, and managing crypto mining operations. You simply choose an investment plan, deposit your funds, and watch your money grow. Tesla Capital manages everything for you, ensuring your investments multiply while we take our share of the profits. It\'s a win-win situation where you don\'t have to worry about the complexities of the stock market or crypto mining - we do all the hard work.',
    },
    {
      question: 'How does Tesla Capital make my money grow?',
      answer: 'Tesla Capital invests your money into top-performing stocks that multiply your capital. We also engage in crypto mining operations using your money as capital. Our expert team knows how the stock market works and identifies the best investment opportunities. We take your funds, invest them strategically in high-performing stocks, manage crypto mining operations, and then return your money with profits based on the plan you choose. The rest of the profit is ours. You don\'t need to do any work - just wait for the days on your plan and watch your money increase.',
    },
    {
      question: 'What is Daily Rate and ROI?',
      answer: 'ROI (Return on Investment) is the total percentage return you\'ll earn over the entire duration of your investment plan. Daily Rate is calculated by dividing the total ROI by the number of days in your plan. For example, if a plan offers 60% ROI over 30 days, the daily rate is 2% per day. Tesla Capital calculates these rates based on our actual investment performance in top stocks and crypto mining operations. The daily rate determines how much you earn each day, starting from the day after you make your investment (your first daily earning comes the next day).',
    },
    {
      question: 'When will I receive my first daily earning?',
      answer: 'Your first daily earning will be credited to your account the day after you make your investment. For example, if you invest on Monday, your first daily earning will be added on Tuesday. This ensures fairness and prevents users from repeatedly upgrading plans just to gain immediate earnings.',
    },
    {
      question: 'Can I upgrade my plan while it\'s still active?',
      answer: 'No, you must wait for your current plan to finish before you can upgrade to a new one. This ensures that you receive the full benefits of your current investment plan. Once your plan duration is complete, you can then upgrade to a better plan with higher returns.',
    },
    {
      question: 'How do I Create an Account?',
      answer: 'Registration process is very easy and will take a few minutes to complete. Simply click GET STARTED or SIGN UP button and fill in all the required fields.',
    },
    {
      question: 'Can I own Multiple Accounts?',
      answer: 'No, every account must have a different owner. Our system will disable any multiple accounts detected.',
    },
    {
      question: 'How can I make a Deposit?',
      answer: 'To deposit funds in your account is quick and simple. For your convenience, you may choose one of the several plans available and then your desired deposit methods. Login to your account and Click on the DEPOSITS button in the DASHBOARD section; choose the deposit option and follow the steps to complete your transaction.',
    },
    {
      question: 'Can I make multiple deposits?',
      answer: 'Yes, you can carry out multiple deposits. The processing of each is going to be done individually and settled according to the time each one is reflected on the system.',
    },
    {
      question: 'How long does it take deposits to reflect?',
      answer: 'Your deposit will reflect immediately once it is confirmed. Usually within few minutes.',
    },
    {
      question: 'What is the Withdrawal Limit?',
      answer: 'As long as your payout reflects, there is no withdrawal limit.',
    },
    {
      question: 'How long does a Withdrawal Request take?',
      answer: 'Withdrawal Requests are completed under 4-6hrs during our working days (Mon-Fri), and 6-12hrs during weekends (Sat-Sun). It is a 24/7 service.',
    },
    {
      question: 'Is Tesla Capital regulated?',
      answer: 'Tesla Capital operates under strict regulatory compliance and maintains the highest standards of security and transparency in all our investment operations.',
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept cryptocurrency payments through various wallets including Solana, Bitcoin, Ethereum, and other major cryptocurrencies. We also support traditional payment methods for eligible investors.',
    },
  ];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-20 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Find answers to the most common questions about Tesla Capital and our 
            investment services.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              className="bg-gray-50 rounded-2xl overflow-hidden"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-8 py-6 text-left flex items-center justify-between hover:bg-gray-100 transition-colors duration-200"
              >
                <h3 className="text-lg font-semibold text-gray-900 pr-4">
                  {faq.question}
                </h3>
                <div className="flex-shrink-0">
                  {openIndex === index ? (
                    <ChevronUp className="w-6 h-6 text-red-600" />
                  ) : (
                    <ChevronDown className="w-6 h-6 text-gray-500" />
                  )}
                </div>
              </button>
              
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="px-8 pb-6">
                      <p className="text-gray-600 leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        {/* Contact CTA */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-red-600 to-red-700 rounded-2xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-4">
              Still have questions?
            </h3>
            <p className="text-red-100 mb-6">
              Our support team is here to help you with any questions or concerns.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/contact"
                className="bg-white text-red-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-200"
              >
                Contact Support
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;



