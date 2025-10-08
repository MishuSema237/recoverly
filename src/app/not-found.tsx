'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Home, ArrowLeft, Search } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-red-900 to-gray-900 flex items-center justify-center px-4">
      <div className="max-w-4xl mx-auto text-center text-white">
        {/* Large Illustration */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="mb-12"
        >
          <div className="relative">
            {/* Background decoration */}
            <div className="absolute -top-8 -right-8 w-32 h-32 bg-red-500/20 rounded-full blur-xl"></div>
            <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
            
            {/* Main illustration */}
            <div className="relative z-10 bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10">
              <Image
                src="/DrawKit - Economy & Finance/PNG/404.svg"
                alt="404 Not Found Illustration"
                width={500}
                height={400}
                className="rounded-2xl mx-auto"
              />
            </div>
            
            {/* Floating elements */}
            <div className="absolute top-4 right-4 bg-red-600 rounded-full p-3 shadow-lg">
              <Search className="w-6 h-6 text-white" />
            </div>
            <div className="absolute bottom-4 left-4 bg-green-500 rounded-full p-3 shadow-lg">
              <Home className="w-6 h-6 text-white" />
            </div>
          </div>
        </motion.div>

        {/* Error Content */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="space-y-8"
        >
          <div>
            <h1 className="text-8xl font-bold text-red-400 mb-4">404</h1>
            <h2 className="text-4xl font-bold mb-4">Page Not Found</h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Oops! It looks like you&apos;ve taken a wrong turn in your investment journey. 
              The page you&apos;re looking for doesn&apos;t exist or has been moved.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/"
              className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-300 flex items-center justify-center group"
            >
              <Home className="mr-2 group-hover:scale-110 transition-transform" size={20} />
              Go Home
            </Link>
            <button
              onClick={() => window.history.back()}
              className="border-2 border-white hover:bg-white hover:text-gray-900 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-300 flex items-center justify-center group"
            >
              <ArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" size={20} />
              Go Back
            </button>
          </div>

          {/* Additional Help */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 max-w-2xl mx-auto">
            <h3 className="text-xl font-semibold mb-4">Need Help?</h3>
            <p className="text-gray-300 mb-4">
              If you&apos;re looking for something specific, try these popular pages:
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link href="/#investment-plans" className="text-red-400 hover:text-red-300 transition-colors">
                Investment Plans
              </Link>
              <Link href="/about" className="text-red-400 hover:text-red-300 transition-colors">
                About Us
              </Link>
              <Link href="/contact" className="text-red-400 hover:text-red-300 transition-colors">
                Contact
              </Link>
              <Link href="/blog" className="text-red-400 hover:text-red-300 transition-colors">
                Blog
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
