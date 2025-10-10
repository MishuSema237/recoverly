'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, TrendingUp, Shield, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const HeroSection = () => {
  const [currentWord, setCurrentWord] = useState(0);
  
  const dynamicWords = [
    'CRYPTO'
  ];

  useEffect(() => {
    // No need for interval since we only have one word
    // const interval = setInterval(() => {
    //   setCurrentWord((prev) => (prev + 1) % dynamicWords.length);
    // }, 2000);

    // return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative bg-gradient-to-br from-gray-900 via-red-900 to-gray-900 text-white overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-black opacity-20"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-red-600/10 to-transparent"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
        <div className="grid grid-cols-1 mobile:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <div className="space-y-4">
              <h1 className="text-4xl lg:text-6xl font-bold leading-tight" style={{ fontFamily: 'Inter, system-ui, sans-serif', fontVariationSettings: '"wght" 900' }}>
                Dominate The
                <span className="block">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentWord}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.5 }}
                      className="flex justify-start space-x-2"
                    >
                      {dynamicWords[currentWord].toUpperCase().split('').map((letter, index) => (
                        <motion.span
                          key={`${currentWord}-${index}`}
                          initial={{ opacity: 0, y: 20, scale: 0.8 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          transition={{ 
                            duration: 0.3, 
                            delay: index * 0.1,
                            type: "spring",
                            stiffness: 200,
                            damping: 20
                          }}
                          className="text-red-400 bg-gradient-to-r from-red-400 via-red-500 to-red-600 bg-clip-text text-transparent"
                          style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '1.2em', fontWeight: '700' }}
                        >
                          {letter}
                        </motion.span>
                      ))}
                    </motion.div>
                  </AnimatePresence>
                </span>
                <span className="block text-white" style={{ fontVariationSettings: '"wght" 800' }}>Game</span>
              </h1>
              <p className="text-xl text-gray-300 max-w-lg">
                <strong>Tesla Capital</strong> transforms your financial future with 
                <span className="text-red-400 font-semibold"> explosive returns</span> and 
                <span className="text-red-400 font-semibold"> bulletproof security</span>. 
                Join the elite investors already crushing their goals.
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

          {/* Right Content - Illustration */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            {/* Mobile Background Image */}
            <div className="mobile:hidden absolute inset-0 opacity-20">
              <Image
                src="/DrawKit - Economy & Finance/PNG/financeWallet.svg"
                alt="Finance Wallet Background"
                fill
                className="object-cover"
              />
            </div>
            
            <div className="relative">
              {/* Main illustration - Hidden on mobile, shown on desktop */}
              <div className="hidden mobile:block relative z-10">
                <Image
                  src="/DrawKit - Economy & Finance/PNG/financeWallet.svg"
                  alt="Finance Wallet Illustration"
                  width={500}
                  height={400}
                  className="mx-auto"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;



