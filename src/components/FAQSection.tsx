'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp } from 'lucide-react';

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: 'Is Recoverly a Bank or a Law Firm?',
      answer: 'We are both. Recoverly Trust Bank is a fully chartered financial institution that operates an internal specialized legal department. This unique structure allows us to hold your funds securely (like a bank) while having the legal authority to fight for your assets (like a law firm).',
    },
    {
      question: 'How does the "No Win, No Fee" recovery service work?',
      answer: 'For asset recovery cases, we charge $0 upfront. We only take a percentage fee (typically 10-20%) from the funds we successfully recover for you. If we fail to get your money back, you owe us nothing.',
    },
    {
      question: 'Is my money safe with Recoverly Trust Bank?',
      answer: 'Absolutely. All customer deposits in our banking accounts are FDIC insured up to $250,000. Our banking infrastructure is built on military-grade encryption and 24/7 active fraud monitoring.',
    },
    {
      question: 'What types of scams can you recover money from?',
      answer: 'We specialize in recovering funds from Crypto Investment Scams, Romance Scams, Unauthorized Bank Transfers, Credit Card Fraud, and Merchant Disputes. Our legal team has jurisdiction to subpoena banks and exchanges globally.',
    },
    {
      question: 'How long does the recovery process take?',
      answer: 'Simple disputes (like credit card chargebacks) can be resolved in 7-14 days. Complex crypto fraud cases typically take 30-90 days as they require court orders and international cooperation.',
    },
    {
      question: 'Can I open a normal bank account without being a scam victim?',
      answer: 'Yes! You can open a standard Checking or High-Yield Savings account with us at any time. You get the added benefit of our aggressive fraud protection services for free.',
    },
  ];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-20 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 mobile:mb-16">
          <span className="text-navy-600 font-bold tracking-wider uppercase text-xs mobile:text-sm">Common Questions</span>
          <h2 className="text-2xl mobile:text-3xl lg:text-5xl font-bold text-navy-900 mt-2 font-playfair">
            Frequently Asked Questions
          </h2>
          <p className="text-base mobile:text-xl text-gray-600 max-w-3xl mx-auto mt-3 mobile:mt-4">
            Everything you need to know about our legal recovery and banking services.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              className="bg-navy-50 rounded-2xl overflow-hidden border border-navy-100"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-5 py-4 mobile:px-8 mobile:py-6 text-left flex items-center justify-between hover:bg-navy-100 transition-colors duration-200"
              >
                <h3 className="text-base mobile:text-lg font-bold text-navy-900 pr-4 font-playfair">
                  {faq.question}
                </h3>
                <div className="flex-shrink-0">
                  {openIndex === index ? (
                    <ChevronUp className="w-5 h-5 mobile:w-6 mobile:h-6 text-gold-600" />
                  ) : (
                    <ChevronDown className="w-5 h-5 mobile:w-6 mobile:h-6 text-navy-400" />
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
                    <div className="px-5 pb-4 mobile:px-8 mobile:pb-6 bg-white border-t border-navy-100">
                      <p className="text-gray-600 leading-relaxed pt-3 mobile:pt-4 text-sm mobile:text-base">
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
        <div className="mt-12 mobile:mt-16 text-center">
          <div className="bg-navy-900 rounded-2xl p-6 mobile:p-8 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-gold-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            <h3 className="text-xl mobile:text-2xl font-bold mb-3 mobile:mb-4 font-playfair relative z-10">
              Still have questions?
            </h3>
            <p className="text-sm mobile:text-base text-navy-100 mb-5 mobile:mb-6 relative z-10">
              Our legal team is ready to review your case for free.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center relative z-10">
              <a
                href="/contact"
                className="bg-gold-500 text-navy-900 px-5 py-2.5 mobile:px-6 mobile:py-3 rounded-lg font-bold hover:bg-gold-400 transition-colors duration-200 text-sm mobile:text-base"
              >
                Contact Legal Support
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
