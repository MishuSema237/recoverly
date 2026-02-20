'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Calendar, ArrowRight, TrendingUp, BookOpen, Target } from 'lucide-react';
import Link from 'next/link';
import PublicRoute from '@/components/PublicRoute';

export default function BlogPage() {
  return (
    <PublicRoute>
      <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-gray-900 via-red-900 to-gray-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-4xl lg:text-6xl font-bold mb-6">
                Recoverly <span className="text-red-400">Blog</span>
              </h1>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
                Stay informed with the latest insights, market analysis, and investment strategies 
                from our team of financial experts.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Purpose Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why We Created This Blog
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our blog serves as a comprehensive resource for investors at all levels, 
              providing valuable insights and educational content to help you make informed decisions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="bg-gray-50 rounded-2xl p-8 text-center"
            >
              <div className="bg-[#c9933a] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Market Analysis</h3>
              <p className="text-gray-600">
                In-depth analysis of market trends, cryptocurrency movements, and investment opportunities 
                to help you stay ahead of the curve.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-gray-50 rounded-2xl p-8 text-center"
            >
              <div className="bg-[#c9933a] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <BookOpen className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Educational Content</h3>
              <p className="text-gray-600">
                Learn the fundamentals of investing, risk management, and portfolio diversification 
                with our comprehensive guides and tutorials.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-gray-50 rounded-2xl p-8 text-center"
            >
              <div className="bg-[#c9933a] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Target className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Investment Strategies</h3>
              <p className="text-gray-600">
                Discover proven investment strategies, portfolio optimization techniques, 
                and risk management approaches used by successful investors.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Coming Soon Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="bg-white rounded-2xl p-12 shadow-lg"
            >
              <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-8">
                <BookOpen className="w-12 h-12 text-[#c9933a]" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Blog Content Coming Soon
              </h2>
              <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                We&apos;re currently working on creating valuable content for our blog. 
                Soon you&apos;ll find articles on market trends, investment strategies, 
                and educational resources to help you make better investment decisions.
              </p>
              
              {/* Under Development Illustration */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="flex justify-center mb-8"
              >
                <div className="bg-gray-50 rounded-3xl p-8">
                  <Image
                    src="/DrawKit - Economy & Finance/PNG/undraw_design-objectives_f9uv.svg"
                    alt="Blog Under Development"
                    width={400}
                    height={300}
                    className="rounded-2xl mx-auto"
                  />
                </div>
              </motion.div>
              <div className="bg-gray-50 rounded-lg p-6 mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">What to Expect:</h3>
                <ul className="text-left text-gray-600 space-y-2 max-w-md mx-auto">
                  <li className="flex items-center space-x-2">
                    <ArrowRight className="w-4 h-4 text-[#c9933a]" />
                    <span>Weekly market analysis and insights</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <ArrowRight className="w-4 h-4 text-[#c9933a]" />
                    <span>Investment strategy guides</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <ArrowRight className="w-4 h-4 text-[#c9933a]" />
                    <span>Risk management tutorials</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <ArrowRight className="w-4 h-4 text-[#c9933a]" />
                    <span>Cryptocurrency market updates</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <ArrowRight className="w-4 h-4 text-[#c9933a]" />
                    <span>Portfolio optimization tips</span>
                  </li>
                </ul>
              </div>
              <Link
                href="/"
                className="inline-flex items-center space-x-2 bg-[#c9933a] hover:bg-[#b08132] text-white px-8 py-3 rounded-lg font-semibold transition-colors duration-200"
              >
                <span>Back to Home</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Stay Updated
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Subscribe to our newsletter to be the first to know when we publish new blog content.
          </p>
          <div className="bg-gray-50 rounded-lg p-8">
            <p className="text-gray-600 mb-4">
              Our newsletter will include:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left max-w-2xl mx-auto">
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-[#c9933a]" />
                <span className="text-gray-600">New blog post notifications</span>
              </div>
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-4 h-4 text-[#c9933a]" />
                <span className="text-gray-600">Market analysis updates</span>
              </div>
              <div className="flex items-center space-x-2">
                <BookOpen className="w-4 h-4 text-[#c9933a]" />
                <span className="text-gray-600">Educational content alerts</span>
              </div>
              <div className="flex items-center space-x-2">
                <Target className="w-4 h-4 text-[#c9933a]" />
                <span className="text-gray-600">Investment strategy tips</span>
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-6">
              We respect your privacy. Unsubscribe at any time.
            </p>
          </div>
        </div>
      </section>
      </div>
    </PublicRoute>
  );
}
