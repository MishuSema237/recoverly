'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Send, CheckCircle } from 'lucide-react';

const NewsletterSection = () => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setIsSubscribed(true);
    setIsLoading(false);
    setEmail('');
    
    // Reset success message after 3 seconds
    setTimeout(() => setIsSubscribed(false), 3000);
  };

  return (
    <section className="py-20 bg-gradient-to-br from-gray-900 to-red-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-white"
        >
          <div className="flex justify-center mb-8">
            <div className="bg-red-600 p-4 rounded-full">
              <Mail className="w-8 h-8" />
            </div>
          </div>
          
          <h2 className="text-4xl font-bold mb-4">
            Our Newsletter
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Do you want to be getting updates about new investment opportunities and products?
          </p>

          <form onSubmit={handleSubscribe} className="max-w-md mx-auto">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="w-full px-4 py-3 rounded-lg text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-red-500 focus:outline-none"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="bg-red-600 hover:bg-red-700 disabled:bg-red-800 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200 flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Subscribing...
                  </>
                ) : (
                  <>
                    Subscribe
                    <Send className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>

          {isSubscribed && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-6 bg-green-600 text-white px-6 py-3 rounded-lg inline-flex items-center gap-2"
            >
              <CheckCircle className="w-5 h-5" />
              Successfully subscribed to our newsletter!
            </motion.div>
          )}

          <p className="text-gray-400 text-sm mt-6">
            We respect your privacy. Unsubscribe at any time.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default NewsletterSection;









