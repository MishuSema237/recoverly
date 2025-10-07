'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, TrendingUp, Shield, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

const HeroSection = () => {
  return (
    <section className="relative bg-gradient-to-br from-gray-900 via-red-900 to-gray-900 text-white overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-black opacity-20"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-red-600/10 to-transparent"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <div className="space-y-4">
              <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
                Go to the next level
                <span className="block text-red-400">investing</span>
              </h1>
              <p className="text-xl text-gray-300 max-w-lg">
                <strong>Tesla Capital</strong> is a cutting-edge investment platform offering 
                secure cryptocurrency and traditional investment opportunities with 
                industry-leading returns and expert guidance.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/signup"
                className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-300 flex items-center justify-center group"
              >
                Get Started
                <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
              </Link>
              <Link
                href="#investment-plans"
                className="border-2 border-white hover:bg-white hover:text-gray-900 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-300"
                onClick={(e) => {
                  e.preventDefault();
                  const element = document.getElementById('investment-plans');
                  if (element) {
                    element.scrollIntoView({ 
                      behavior: 'smooth',
                      block: 'start'
                    });
                  }
                }}
              >
                View Plans
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 pt-8">
              <div className="text-center">
                <div className="text-2xl font-bold text-red-400">$2.81B</div>
                <div className="text-sm text-gray-300">Total Deposits 2024</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-400">33,759</div>
                <div className="text-sm text-gray-300">Active Investors</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-400">$983.7M</div>
                <div className="text-sm text-gray-300">Total Withdrawals</div>
              </div>
            </div>
          </motion.div>

          {/* Right Content - Features */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-6"
          >
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <div className="flex items-center space-x-4 mb-4">
                <div className="bg-red-600 p-3 rounded-lg">
                  <TrendingUp className="text-white" size={24} />
                </div>
                <h3 className="text-xl font-semibold">Top Technical Analysis</h3>
              </div>
              <p className="text-gray-300">
                Identify trading opportunities by analyzing statistical trends gathered from 
                trading activity, such as price movement and volume.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <div className="flex items-center space-x-4 mb-4">
                <div className="bg-red-600 p-3 rounded-lg">
                  <Zap className="text-white" size={24} />
                </div>
                <h3 className="text-xl font-semibold">High Performance</h3>
              </div>
              <p className="text-gray-300">
                Our system is highly performant and always ready for our investors 
                any time any day.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <div className="flex items-center space-x-4 mb-4">
                <div className="bg-red-600 p-3 rounded-lg">
                  <Shield className="text-white" size={24} />
                </div>
                <h3 className="text-xl font-semibold">Full Expert Support</h3>
              </div>
              <p className="text-gray-300">
                We have experts at hand ready to guide you along the way for a 
                great investment experience.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;



