'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3, 
  Zap, 
  Users, 
  Shield, 
  Mail, 
  ThumbsUp,
  CheckCircle,
  ArrowRight
} from 'lucide-react';

const FeaturesSection = () => {
  const features = [
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: 'Top Technical Analysis',
      description: 'Identify trading opportunities by analyzing statistical trends gathered from trading activity, such as price movement and volume.',
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: 'High Performance',
      description: 'Our system is highly performant and always ready for our investors any time any day.',
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: 'Full Expert Support',
      description: 'We have experts at hand ready to guide you along the way for a great investment experience.',
    },
    {
      icon: <Mail className="w-8 h-8" />,
      title: 'Direct Email & SMS Signals',
      description: 'We always keep our investors notified through emails and SMS so that they can take action when necessary.',
    },
    {
      icon: <ThumbsUp className="w-8 h-8" />,
      title: 'Highly Recommended',
      description: 'Tesla Capital is highly recommended and well appreciated in the industry. You are safe with us.',
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: 'Join a Growing Community',
      description: 'Join a community of Tesla Capital investors to increase and diversify your investment portfolio.',
    },
  ];

  const steps = [
    {
      number: '1',
      title: 'Create an Account',
      description: 'Create an account with us which can be done in less than 2 minutes with your email address.',
    },
    {
      number: '2',
      title: 'Choose Plan',
      description: 'Choose a plan from a list of available plans. There is a plan for everybody.',
    },
    {
      number: '3',
      title: 'Get Profit',
      description: 'That\'s it. You are good to go. Just relax and watch your profits trickle in based on the plan you choose.',
    },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Features Grid */}
        <div className="mb-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Everything you need to fast track your investment
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our comprehensive platform provides all the tools and support you need 
              to make informed investment decisions and maximize your returns.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-gray-50 rounded-2xl p-8 hover:shadow-lg transition-all duration-300 group"
              >
                <div className="flex items-center space-x-4 mb-4">
                  <div className="bg-red-600 p-3 rounded-lg text-white group-hover:scale-110 transition-transform duration-300">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    {feature.title}
                  </h3>
                </div>
                
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* How It Works */}
        <div className="bg-gradient-to-br from-gray-900 to-red-900 rounded-3xl p-12 text-white">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              How Tesla Capital Works
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Our streamlined investment process is designed to be simple, secure, and profitable. 
              Here&apos;s how you can start building your wealth with Tesla Capital.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="text-center relative"
              >
                <div className="bg-red-600 w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                  {step.number}
                </div>
                <h3 className="text-xl font-semibold mb-4">
                  {step.title}
                </h3>
                <p className="text-gray-300 leading-relaxed">
                  {step.description}
                </p>
                
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-full w-full h-0.5 bg-red-600 transform -translate-x-1/2">
                    <ArrowRight className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-1/2 text-red-600" size={20} />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
